const { group, cancel, text, password, note } = require("@clack/prompts");
const colors = require("colors");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util")
const { exec } = require("child_process");
const { PACKAGE_JSON, TS_CONFIG_JSON, WITHOUT_DB_INDEX_FILE, DB_CONNECTION, DB_TEST_CONNECTION, INDEX_FILE_WITH_TEST_API } = require("./constants");

const validatePort = function (port) {
    if (port.length == 0) return `Value is required!`;
    if (!isNumber(port)) return `Value must be a number!`
    const num = parseInt(`${port}`, 10);
    if (num < 1 || num > 65535) {
        return `port < 1 || port > 65535`;
    }
}
const execAsync = promisify(exec);

const isNumber = function (str) {
    return /^\d+$/.test(str);
}

module.exports = {
    orange: function (text) {
        return `\x1b[38;2;255;165;0m${text}\x1b[0m`
    },
    sleep: async function (num) {
        return new Promise(resolve => setTimeout(resolve, num * 1000));
    },
    isNumber,
    validatePort,
    getAppInputs: function () {
        return group({
            appName: () => text({
                message: colors.blue("Application Name?"),
                placeholder: 'your-app-name',
                initialValue: 'my-app',
                validate(value) {
                    if (value.length === 0) return `Value is required!`;
                },
            }),
            appPort: () => text({
                message: colors.blue("Application Port?"),
                placeholder: '4040',
                initialValue: '4040',
                validate: validatePort
            })
        }, {
            onCancel: () => {
                cancel('Operation cancelled.');
                process.exit(0);
            }
        })
    },
    getDBInputs: function (appPort) {
        return group({
            dbPort: () => text({
                message: colors.blue("Database Port?"),
                placeholder: '6543',
                initialValue: '6543',
                validate: (port) => {
                    const res = validatePort(port);
                    if (res) {
                        return res;
                    }
                    if (port === appPort) {
                        return `Port is already in use by application!`;
                    }
                },
            }),
            secretToAccessDB: () => password({
                message: colors.blue("Secret?"),
                validate(value) {
                    if (value.length === 0) return `Value is required!`;
                },
            }),

        }, {
            onCancel: () => {
                cancel('Operation cancelled.');
                process.exit(0);
            }
        })
    },
    generateDate: function () {
        const date = new Date();
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const month = monthNames[date.getMonth()];
        const day = date.getDate();
        const year = date.getFullYear();
        return `${month} ${day}, ${year}`;
    },

    getDIRs: function (options, db) {
        const projectDirectory = path.join(process.cwd(), options.appName);
        fs.mkdirSync(projectDirectory, { recursive: true });

        const srcDir = path.join(projectDirectory, "src");
        const distDir = path.join(projectDirectory, "dist");
        fs.mkdirSync(srcDir);
        fs.mkdirSync(distDir);
        let dbDir = "";
        if (db) {
            dbDir = path.join(srcDir, "database");
            fs.mkdirSync(dbDir);
        }
        return { projectDirectory, srcDir, distDir, dbDir };
    },
    writeTsConfigJson: function (projectDirectory) {
        const tsconfigJson = TS_CONFIG_JSON
        fs.writeFileSync(path.join(projectDirectory, "tsconfig.json"), JSON.stringify(tsconfigJson, null, 2));
    },
    writePackageJson: function (projectDirectory, appName, db) {
        const packageJson = {
            name: String(appName),
            ...PACKAGE_JSON
        }
        if (db) {
            packageJson.dependencies = {
                ...packageJson.dependencies,
                "pg": "^8.12.0"
            }
            packageJson.devDependencies = {
                ...packageJson.devDependencies,
                "@types/pg": "^8.11.6"
            }
        }
        fs.writeFileSync(path.join(projectDirectory, "package.json"), JSON.stringify(packageJson, null, 2));
    },
    writeIndex: function (srcDir, db) {
        const indexTs = db ? INDEX_FILE_WITH_TEST_API : WITHOUT_DB_INDEX_FILE

        fs.writeFileSync(path.join(srcDir, "index.ts"), indexTs);
    },
    writeEnv: function (projectDirectory, options) {
        const env = `PORT=${options.appPort}`;
        fs.writeFileSync(path.join(projectDirectory, ".env"), env);
    },
    writeEnvWithDBConfig: function (projectDirectory, options, type) {
        const env = `
PORT=${options.appPort}
DB_HOST=localhost
DB_PORT=${options.dbPort}
DB_USERNAME=postgres
DB_NAME=postgres
DB_PASSWORD=${options.secret}
DB_CONTAINER_NAME=${options.appName}-${type}c
`;

        fs.writeFileSync(path.join(projectDirectory, ".env"), env);
    },
    writeDatabaseFiles: function (dbDir) {
        fs.writeFileSync(path.join(dbDir, "connection.ts"), DB_CONNECTION);
        fs.writeFileSync(path.join(dbDir, "testConnection.ts"), DB_TEST_CONNECTION);
    },
    installDependencies: async (spinner, projectDirectory) => {
        try {
            const { stdout, stderr } = await execAsync(`cd ${projectDirectory} && npm install`, { encoding: "ascii" });
            if (stderr) {
                console.error(`Stderr: ${stderr}`);
            }
            note(stdout);
            spinner.stop("Dependencies Installed!");
        } catch (error) {
            note(`Error: ${error.message}`, colors.red("Error"));
            spinner.stop("Failed to install dependencies!");
            process.exit(1);
        }
    },
    installPostgres: async function (spinner) {
        try {
            const { stdout, stderr } = await execAsync("docker pull postgres", { encoding: "ascii" });
            if (stderr) {
                console.error(`Stderr: ${stderr}`);
            }
            note(stdout);
            spinner.stop("Postgres pulled successfully");
        }
        catch (error) {
            note(`Error Message : ${error.message}`)
            spinner.stop("Fail to Fetch Postgres");
            process.exit(1);
        }
    },
    runPostgresContainer: async function (spinner, secret, dbcName, dbPort) {
        const cmdCreateContainer = `docker run --name ${dbcName}-psqlc -e POSTGRES_PASSWORD=${secret} -p ${dbPort}:5432 -d postgres`
        try {
            const { stdout, stderr } = await execAsync(cmdCreateContainer, { encoding: "ascii" })
            if (stderr) {
                console.error(`Stderr: ${stderr}`);
            }
            note(`${stdout}\nYou can access postgres at port : \`${dbPort}\``);
            spinner.stop("Postgres Container Up");
        } catch (error) {
            note(`Error Message : ${error.message}`)
            spinner.stop("Fail to setup postgres");
            process.exit(1);
        }
    }
}
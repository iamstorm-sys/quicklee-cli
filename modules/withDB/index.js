const { note, outro, intro, spinner } = require("@clack/prompts");
const { writeTsConfigJson, writeIndex, generateDate, getDIRs, writePackageJson, installDependencies, installPostgres, runPostgresContainer, writeEnvWithDBConfig, writeDatabaseFiles, writeIndexEJS, writeUtils } = require("../../commons");
const colors = require("colors");
const { sleep, getAppInputs, getDBInputs } = require("../../commons");

module.exports = {
    withDB: async function () {
        console.log(colors.green("\nThis utility will walk you through creating a new Node Project\nwith typescript enabled by default.\n"))
        console.log("\x1b[38;2;255;165;0mPress ^C at any time to quit.\x1b[0m\n");
        await sleep(1);

        intro(colors.green(`${generateDate()} - Hi, Let's get done with this Quickly!`))

        const { appName, appPort } = await getAppInputs();
        const { dbPort, secretToAccessDB } = await getDBInputs(appPort);

        const options = {
            appName,
            appPort,
            dbPort,
            secret: secretToAccessDB
        }

        const addNecessaryFiles = spinner();
        addNecessaryFiles.start("Configuring project");
        const { projectDirectory, srcDir, dbDir, viewsDir } = getDIRs(options, "getDbDir");
        writeTsConfigJson(projectDirectory);
        writePackageJson(projectDirectory, options.appName, "addDBLibs");
        writeIndex(srcDir, "getIndexWithDbRoutes");
        writeEnvWithDBConfig(projectDirectory, options, 'psql');
        writeDatabaseFiles(dbDir);
        writeIndexEJS(viewsDir);
        writeUtils(srcDir);
        addNecessaryFiles.stop("Configuration Complete!");
        const getDependencies = spinner();

        getDependencies.start("Installing dependencies...");

        await installDependencies(getDependencies, projectDirectory);

        const dbImageSpinner = spinner();
        dbImageSpinner.start("Fetching postgres image")
        await installPostgres(dbImageSpinner)

        const dbContainerSpinner = spinner();
        dbContainerSpinner.start("Starting postgres container");
        await runPostgresContainer(dbContainerSpinner, secretToAccessDB, appName, dbPort)

        note(`To get Started\n\ncd ${appName}\n\n\`npm start\``, "Next Step.")
        outro(colors.green("You’ve got this in the bag."))
        console.log(colors.green("\nHappy Hacking!"));
    }
}
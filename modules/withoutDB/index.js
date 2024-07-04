const { note, outro, intro, spinner } = require("@clack/prompts");
const { sleep, getAppInputs, writeTsConfigJson, writeIndex, generateDate, getDIRs, writePackageJson, installDependencies, writeEnv, writeIndexEJS, writeUtils } = require("../../commons");
const colors = require("colors");


module.exports = {
    withoutDB: async function () {
        console.log(colors.green("\nThis utility will walk you through creating a new Node Project\nwith typescript enabled by default.\n"))
        console.log("\x1b[38;2;255;165;0mPress ^C at any time to quit.\x1b[0m\n");
        await sleep(1);

        intro(colors.green(`${generateDate()} - Hi, Let's get done with this Quickly!`))

        const { appName, appPort } = await getAppInputs();

        const options = {
            appName,
            appPort
        }
        const addNecessaryFiles = spinner();
        addNecessaryFiles.start("Configuring project");
        const { projectDirectory, srcDir, viewsDir } = getDIRs(options);
        writeTsConfigJson(projectDirectory);
        writePackageJson(projectDirectory, options.appName);
        writeIndex(srcDir);
        writeEnv(projectDirectory, options);
        writeIndexEJS(viewsDir);
        writeUtils(srcDir);
        addNecessaryFiles.stop("Configuration Complete!");
        const getDependencies = spinner();

        getDependencies.start("Installing dependencies...");

        await installDependencies(getDependencies, projectDirectory);

        note(`To get Started\n\ncd ${appName}\n\n\`npm start\``, "Next Step.");
        outro(colors.green("You’ve got this in the bag!"));
        console.log(colors.green("\nHappy Hacking!"));
    }
}
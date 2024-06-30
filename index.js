#! /usr/bin/env node

const { Command } = require("commander");
const { withoutDB } = require("./modules/withoutDB");
const { withDB } = require("./modules/withDB");
const commander = new Command();

commander
    .description("quicklee-cli")
    .version("1.0.0")

commander.option('-w, --with-pg [database-name]', "Add Postgres database to the application.")

commander.parse(process.argv);

const options = commander.opts();


async function main() {


    if (options.withPg) {
        await withDB();
    } else {
        await withoutDB();
    }
}

main();



# ![quicklee-cli](https://img.shields.io/badge/quicklee--cli-orange) quicklee-cli

![npm version](https://img.shields.io/npm/v/quicklee-cli) ![npm downloads](https://img.shields.io/npm/dm/quicklee-cli) ![license](https://img.shields.io/npm/l/quicklee-cli)

`quicklee-cli` is a command-line utility that helps you quickly set up a new Node.js project with TypeScript enabled by default. It also offers an option to integrate a PostgreSQL database into your project.

## Features

- ⚡ Quick setup of a Node.js project with TypeScript.
- 🗄️ Optional integration with a PostgreSQL database.
- 🔧 Automated configuration and dependency installation.
- 🛠️ Easy-to-follow prompts and progress indicators.

## Requirements

If you choose to set up a project with a PostgreSQL database, you must have Docker installed on your system. Docker is required to start the PostgreSQL database container.

You can download and install Docker from the [official Docker website](https://www.docker.com/products/docker-desktop).

## Installation

To install `quicklee-cli`, use npm:

```sh
npm install -g quicklee-cli
```

## Usage

Run `quicklee-cli` to start setting up your project. You can choose to create a project with or without a PostgreSQL database.

### Create a Project without Database

```sh
quicklee-cli
```

Follow the on-screen prompts to set up your project. The CLI will guide you through configuring your project and installing necessary dependencies.

### Create a Project with PostgreSQL Database

```sh
quicklee-cli --with-pg
```

Follow the on-screen prompts to set up your project and PostgreSQL database. The CLI will handle the database configuration, installation of required dependencies, and start a PostgreSQL container.

## Options

- `-w, --with-pg [database-name]`: Add PostgreSQL database to the application.
- `-h, --help`: Display help information.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.


const WITHOUT_DB_INDEX_FILE =
    `import express from "express";

import { config } from "dotenv";

config();

const app = express();


const port = process.env.PORT || 3000;

app.get("/health", (req, res) => {

    res.status(200).json({ message: "Fit as a fiddle!" })

});


app.listen(port, () => {

    console.log(\`server up on port \${port}\`)
    
});`;

const TS_CONFIG_JSON = {
    "compilerOptions": {
        "target": "es2016",
        "module": "commonjs",
        "rootDir": "./src",
        "moduleResolution": "node10",
        "outDir": "./dist",
        "esModuleInterop": true,
        "forceConsistentCasingInFileNames": true,
        "strict": true,
        "skipLibCheck": true
    }
};

const PACKAGE_JSON = {
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
        "build": "tsc",
        "start": "nodemon src/index.ts"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "dependencies": {
        "dotenv": "^16.4.5",
        "express": "^4.19.2",
        "ts-node": "^10.9.2"
    },
    "devDependencies": {
        "nodemon": "^3.1.3",
        "@types/express": "^4.17.21",
        "typescript": "^5.4.5"
    }
}

const DB_CONNECTION = `
import { config } from 'dotenv';
config();

import { Pool } from 'pg';

const getNewPool = () => {

    const pool = new Pool({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    return pool;
}

export default getNewPool;
`;

const DB_TEST_CONNECTION = `
import pool from "./connection";

export async function testConnection() {
    try {
        const client = await pool().connect();
        console.log('Connected to the database');

        const res = await client.query('SELECT NOW()');
        console.log(res.rows[0]);

        client.release();
    } catch (err) {
        console.error('Error connecting to the database', err);
        return "NOT_OK";
    } finally {
        await pool().end();
    }
    return "OK";
}
`;

const INDEX_FILE_WITH_TEST_API = `
import express from "express";

import { config } from "dotenv";
import { testConnection } from "./database/testConnection";

config();

const app = express();


const port = process.env.PORT || 3000;

app.get("/health", (req, res) => {

    res.status(200).json({ message: "Fit as a fiddle!" })

});

app.get("/health/database", (req, res) => {

    testConnection().then(data => {
        if (data === "OK") {
            res.status(200).json({ message: "Fit as a fiddle!" });
        } else {
            res.status(500).json({ message: "Database connection failed!" });
        }
    }).catch((err) => {
        res.status(500).json({ message: "Database connection failed!" });
    })
});

app.listen(port, () => {

    console.log(\`server up on port \${port}\`)

});
`;

module.exports = {
    WITHOUT_DB_INDEX_FILE, TS_CONFIG_JSON, PACKAGE_JSON, DB_CONNECTION, DB_TEST_CONNECTION, INDEX_FILE_WITH_TEST_API
}
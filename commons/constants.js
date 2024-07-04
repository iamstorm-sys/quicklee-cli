
const WITHOUT_DB_INDEX_FILE = `
import express, { Router } from "express";

import { config } from "dotenv";
import { getRoutes } from "./routes";
import path from "path";
import openurl from "openurl";

config();

const app = express();


const port = process.env.PORT || 3000;


app.get(\`/\${process.env.NAME}/info\`, (req, res) => {
    const routes = getRoutes(app._router as Router);
    res.render('index', {
        routes: routes,
        appName: process.env.NAME,
        appPort: process.env.PORT,
        dbPort: process.env.DB_PORT,
        userName: process.env.DB_USERNAME,
        dbName: process.env.DB_NAME,
        containerName: process.env.DB_CONTAINER_NAME
    });
})

app.get("/health", (req, res) => {

    res.status(200).json({ message: "Fit as a fiddle!" })

});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.listen(port, () => {

    console.log(\`server up on port \${port}\`)
    //TODO Comment the below statement in developement
    openurl.open(\`http://localhost:\${port}/\${process.env.NAME}/info\`);
});
`;

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
        "@types/node": "^20.14.9",
        "dotenv": "^16.4.5",
        "ejs": "^3.1.10",
        "express": "^4.19.2",
        "openurl": "^1.1.1",
        "ts-node": "^10.9.2"
    },
    "devDependencies": {
        "@types/express": "^4.17.21",
        "@types/openurl": "^1.0.3",
        "nodemon": "^3.1.3",
        "typescript": "^5.5.3"
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
import express, { Router } from "express";

import { config } from "dotenv";
import { testConnection } from "./database/testConnection";
import { getRoutes } from "./routes";
import path from "path";
import openurl from "openurl";

config();

const app = express();


const port = process.env.PORT || 3000;


app.get(\`/\${process.env.NAME}/info\`, (req, res) => {
    const routes = getRoutes(app._router as Router);
    res.render('index', {
        routes: routes,
        appName: process.env.NAME,
        appPort: process.env.PORT,
        dbPort: process.env.DB_PORT,
        userName: process.env.DB_USERNAME,
        dbName: process.env.DB_NAME,
        containerName: process.env.DB_CONTAINER_NAME
    });
})

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

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.listen(port, () => {

    console.log(\`server up on port \${port}\`)
    //TODO Comment the below statement in developement
    openurl.open(\`http://localhost:\${port}/\${process.env.NAME}/info\`);
});
`;

const INDEX_EJS = `
<!-- views/index.ejs -->


<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>
        <%= appName %>
    </title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            font-family: "Poppins", sans-serif;
        }

        body {
            background-color: rgb(48, 47, 50);
        }

        .layer1 {
            position: relative;
            display: flex;
            justify-content: center;
        }

        .layer21 {
            height: 90vh;
            width: 90vw;
            position: absolute;
        }

        .layer22 {
            min-height: 70vh;
            max-width: 90vw;
            min-width: 90vw;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, 20%);
            background-color: rgba(62, 64, 62, 0.625);
            border-radius: 4px;
        }

        .grid-container {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr;
            gap: 4px;
            padding: 4px;
        }

        .grid-item {
            background-color: #262429db;
            border-radius: 4px;
            padding: 2px 20px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .grid-container-info {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            grid-template-rows: 1fr;
            gap: 8px;
            padding: 4px;
        }

        .grid-item-info {
            background-color: #1c1920c7;
            border-radius: 4px;
            padding: 20px 20px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            color: #e5caff;
        }

        .grid-item-1,
        .grid-item-2,
        .grid-item-3 {
            grid-column: span 1;
        }

        .grid-item-4 {
            grid-row: span 4;
            grid-column: span 3;
            display: flex;
            flex-direction: column;
            justify-content: start;
            padding: 20px;
            overflow-y: scroll;
            max-height: 400px;
        }

        ::-webkit-scrollbar {
            width: 1px;
        }

        .grid-item-5 {
            grid-column: span 3;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: stretch;
        }

        .grid-item-method {
            grid-column: span 1;
        }


        .grid-item-route {
            grid-column: span 2;
            display: flex;
            justify-content: flex-end;
        }

        .grid-item:hover,
        .grid-item-info:hover {
            animation: 200ms;
            background-color: #1c1920c7;
        }

        .title {
            font-weight: 400;
            font-style: normal;
            color: #b5acbee6;
        }

        .sub-title {
            color: #e5caff;
            font-weight: bold;
            font-size: medium;
        }

        hr {
            background-color: rgba(62, 64, 62, 0.625);
        }

        .mb_10 {
            margin-bottom: 10px;
        }

        .chip {
            background-color: #1c1920c7;
            color: black;
            padding: 4px 15px;
            font-weight: 400;
            border-radius: 10px;
        }

        .vr {
            display: flex;
            flex-direction: column;
            height: 40%;
            margin: 0px 20px;
            background-color: #e5caff;
            width: 2px;
        }

        a {
            text-decoration: none;
            color: #e5caff;
            cursor: pointer;
        }

        .flex {
            display: flex;
            flex-direction: row;
            align-items: center;
        }

        .syntax {
            font-size: small;
        }

        .star {
            position: absolute;
            right: -20px;
            bottom: -20px;
            z-index: -1;
        }
    </style>
</head>

<body>
    <div class="layer1">
        <svg class="layer21" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" fill="none">
            <path
                d="M202.255 527.016C202.596 527.773 203.183 528.124 204.015 528.07C204.542 526.387 205.584 524.658 207.141 522.885C208.678 521.068 210.671 519.607 213.119 518.503C217.793 516.396 222.288 516.031 226.604 517.406C226.604 517.406 226.82 517.469 227.252 517.596C227.69 517.023 227.729 516.337 227.367 515.535C226.745 514.155 225.063 513.334 222.32 513.071C219.16 512.834 215.6 513.609 211.638 515.395C210.57 515.877 209.63 516.407 208.82 516.987L200.965 499.559C200.102 497.645 199.003 496.989 197.667 497.591C196.376 498.173 196.172 499.443 197.055 501.402L205.302 519.697C202.428 522.707 201.412 525.146 202.255 527.016ZM221.997 556.198C214.296 559.669 206.655 561.373 199.074 561.309C191.473 561.2 184.428 558.939 177.94 554.526C170.646 549.513 164.681 541.864 160.045 531.581C155.41 521.298 153.644 511.677 154.747 502.718C155.726 494.671 158.795 487.637 163.954 481.616C169.158 475.575 175.544 470.848 183.111 467.437C196.911 461.217 209.554 460.392 221.04 464.962C232.551 469.467 241.246 478.241 247.125 491.284C250.717 499.252 252.176 507.004 251.502 514.538L261.184 510.174C264.953 514.259 267.801 518.438 269.728 522.712C272.657 529.211 273.212 535.254 271.392 540.841C269.572 546.428 265.435 550.677 258.98 553.586C252.526 556.496 246.199 556.777 239.999 554.43C233.864 552.107 227.394 546.963 220.59 538.997L220.256 539.147C218.831 539.789 218.44 540.823 219.082 542.247C220.286 544.918 223.624 548.341 229.094 552.516C226.9 553.827 224.534 555.054 221.997 556.198Z"
                fill="url(#paint0_linear_2_13)" />
            <path
                d="M298.118 486.777C298.652 486.536 299.13 486.053 299.553 485.327C298.445 484.058 297.189 481.866 295.785 478.75L280.916 445.765C284.351 440.789 289.384 436.806 296.017 433.816C299.756 432.131 303.259 431.168 306.525 430.927C309.815 430.622 312.588 430.952 314.844 431.917L330.525 466.705C333.515 473.338 337.064 476.934 341.172 477.492C341.317 477.695 341.53 478.108 341.811 478.731L342.352 479.933C345.282 486.432 345.785 492.123 343.863 497.007C342.151 501.527 338.558 505.022 333.083 507.49C329.655 509.035 326.188 509.66 322.681 509.367C319.219 509.053 316.126 507.715 313.401 505.355C311.888 506.037 311.462 507.113 312.124 508.582C312.586 509.606 313.559 510.399 315.045 510.961C314.142 512.761 312.849 514.468 311.167 516.083C309.485 517.698 306.685 519.389 302.768 521.155C298.895 522.9 294.75 523.805 290.333 523.868C284.865 523.976 279.994 522.556 275.72 519.609C270.571 516.146 266.33 510.719 262.999 503.33L255.445 486.57C251.389 483.632 248.287 479.781 246.14 475.018C245.036 472.57 244.204 469.892 243.644 466.985C243.083 464.077 243.031 461.289 243.488 458.619L258.178 451.997C263.698 449.509 268.607 448.876 272.907 450.098C277.232 451.255 280.588 454.482 282.976 459.779L292.728 481.414C294.674 485.731 296.471 487.519 298.118 486.777Z"
                fill="url(#paint1_linear_2_13)" />
            <path
                d="M360.806 421.241L372.725 447.683C375.715 454.316 379.264 457.911 383.372 458.47C383.517 458.672 383.73 459.085 384.011 459.708L384.552 460.91C387.502 467.454 387.939 473.175 385.862 478.075C383.973 482.676 380.268 486.22 374.748 488.708C369.273 491.176 364.053 491.655 359.087 490.144C352.805 488.209 347.948 483.436 344.517 475.824L324.953 432.422C325.494 431.482 326.151 430.623 326.925 429.846C327.699 429.068 328.478 428.182 329.261 427.186C326.906 427.069 324.407 426.16 321.765 424.459C319.104 422.713 317.041 420.215 315.576 416.966C313.048 411.357 312.828 405.939 314.918 400.712C317.007 395.486 320.723 391.669 326.064 389.261C331.451 386.833 336.769 386.631 342.02 388.656C347.296 390.616 351.168 394.334 353.636 399.809C355.622 404.216 355.988 408.711 354.733 413.294C353.458 417.832 351.03 421.417 347.45 424.049C348.212 425.74 349.239 426.295 350.53 425.713C352.8 424.69 354.714 422.756 356.27 419.912C358.673 420.489 360.185 420.932 360.806 421.241Z"
                fill="url(#paint2_linear_2_13)" />
            <path
                d="M432.564 463.692C420.99 468.909 410.148 469.511 400.037 465.499C389.952 461.422 382.2 453.374 376.782 441.355C371.364 429.337 370.975 418.077 375.615 407.577C379.75 398.214 387.026 391.185 397.442 386.49C406.701 382.316 415.414 381.148 423.579 382.984C431.724 384.775 437.562 389.588 441.094 397.423C443.542 402.854 443.847 408.045 442.009 412.998C440.195 417.886 436.551 421.564 431.076 424.032C426.624 426.039 422.375 426.534 418.329 425.52C414.308 424.44 411.167 422.107 408.907 418.519C406.949 419.402 406.29 420.556 406.933 421.98C408.397 425.23 411.344 427.49 415.773 428.761C420.913 430.3 426.22 429.836 431.695 427.368C437.215 424.88 441.246 421.643 443.789 417.659C447.559 420.083 450.548 423.744 452.756 428.64C455.324 434.338 455.073 440.316 452.002 446.574C448.48 453.732 442.001 459.438 432.564 463.692Z"
                fill="url(#paint3_linear_2_13)" />
            <path
                d="M488.755 405.664L486.182 408.511C487.526 411.494 489.54 414.416 492.222 417.277C494.646 420.041 497.288 422.278 500.148 423.988C497.787 430.515 492.69 435.544 484.855 439.076C480.359 441.103 475.933 441.679 471.575 440.804C466.543 439.859 463.033 437.183 461.047 432.776L425.922 354.853C427.497 352.643 429.595 350.466 432.216 348.32C434.882 346.154 437.751 344.379 440.822 342.995C445.941 340.687 450.622 339.783 454.863 340.281C459.711 340.935 463.127 343.465 465.114 347.872L468.304 354.95C470.973 360.87 472.536 367.129 472.992 373.725C472.852 374.484 472.521 375.651 471.999 377.225C471.456 378.755 471.074 380.106 470.853 381.277C470.675 382.428 470.737 383.338 471.038 384.005C471.319 384.629 472.114 384.966 473.423 385.019C475.43 380.204 476.551 375.441 476.784 370.73C477.061 365.999 476.599 360.102 475.396 353.038C475.935 352.688 476.552 352.276 477.249 351.801C477.946 351.327 479.102 350.565 480.717 349.515C482.358 348.401 483.534 347.683 484.246 347.362C491.101 344.272 497.155 343.444 502.408 344.879C507.641 346.27 511.492 349.702 513.96 355.178C516.428 360.653 516.809 366.132 515.102 371.614C513.482 376.576 510.514 381.1 506.198 385.189C511.376 385.746 517.313 385.132 524.006 383.347C528.376 386.626 531.675 390.736 533.903 395.677C536.11 400.574 536.398 405.371 534.767 410.07C532.92 415.241 528.925 419.211 522.782 421.98C516.683 424.729 510.6 424.659 504.531 421.771C498.487 418.818 493.228 413.449 488.755 405.664Z"
                fill="url(#paint4_linear_2_13)" />
            <path
                d="M542 314.901L563.159 361.842C566.149 368.475 569.698 372.07 573.806 372.629C573.95 372.831 574.163 373.244 574.444 373.867L574.986 375.069C577.855 381.435 578.408 386.997 576.643 391.756C574.923 396.495 571.102 400.199 565.182 402.867C559.262 405.536 553.823 406.006 548.866 404.277C542.96 402.226 538.222 397.238 534.65 389.315L503.377 319.939C506.767 314.983 511.467 311.151 517.476 308.442C523.53 305.713 528.608 304.977 532.71 306.235C536.836 307.428 539.933 310.316 542 314.901Z"
                fill="url(#paint5_linear_2_13)" />
            <path
                d="M625.134 376.888C612.803 382.446 601.532 383.402 591.319 379.758C580.909 376.149 573.005 368.357 567.607 356.383C562.189 344.364 561.657 333.142 566.009 322.717C570.004 313.044 577.321 305.809 587.96 301.013C598.599 296.217 608.448 295.313 617.506 298.299C626.59 301.221 633.058 306.955 636.91 315.502C640.341 323.114 640.281 330.051 636.73 336.311C633.479 342.169 627.624 347.004 619.166 350.816C612.845 353.665 606.911 354.76 601.365 354.1C601.129 354.528 601.172 355.098 601.493 355.81C602.095 357.145 604.405 357.577 608.424 357.105C612.482 356.721 616.737 355.526 621.188 353.52C625.684 351.493 629.507 349.101 632.655 346.342C635.828 343.52 638.176 340.828 639.7 338.266C641.19 338.719 642.818 340.074 644.585 342.331C646.376 344.523 647.743 346.665 648.687 348.757C649.61 350.804 650.232 352.72 650.554 354.503C648.406 359.006 645.788 362.704 642.699 365.595C638.379 369.793 632.523 373.557 625.134 376.888ZM603.889 332.074C606.115 331.071 606.847 329.723 606.084 328.032C605.362 326.429 603.821 326.16 601.462 327.223C599.102 328.287 598.316 330.167 599.104 332.865C600.692 333.06 602.287 332.797 603.889 332.074Z"
                fill="url(#paint6_linear_2_13)" />
            <path
                d="M700.72 342.816C688.389 348.374 677.118 349.331 666.905 345.686C656.495 342.077 648.591 334.285 643.193 322.311C637.775 310.292 637.243 299.07 641.595 288.646C645.59 278.972 652.907 271.737 663.546 266.942C674.185 262.146 684.034 261.241 693.092 264.228C702.176 267.15 708.643 272.884 712.496 281.431C715.927 289.043 715.867 295.979 712.316 302.24C709.064 308.097 703.21 312.932 694.752 316.745C688.431 319.594 682.497 320.689 676.951 320.029C676.715 320.456 676.758 321.026 677.079 321.738C677.681 323.074 679.991 323.505 684.009 323.033C688.068 322.65 692.323 321.455 696.774 319.448C701.27 317.422 705.092 315.029 708.241 312.271C711.414 309.448 713.762 306.756 715.286 304.195C716.775 304.648 718.404 306.003 720.171 308.259C721.962 310.451 723.329 312.593 724.272 314.685C725.195 316.733 725.818 318.648 726.14 320.431C723.992 324.935 721.374 328.632 718.285 331.524C713.964 335.721 708.109 339.485 700.72 342.816ZM679.475 298.003C681.701 296.999 682.432 295.652 681.67 293.96C680.948 292.358 679.407 292.088 677.047 293.152C674.688 294.215 673.902 296.096 674.69 298.794C676.277 298.989 677.873 298.725 679.475 298.003Z"
                fill="url(#paint7_linear_2_13)" />
            <path
                d="M763.022 263.235C764.447 266.395 765.263 269.455 765.472 272.414C765.706 275.308 765.467 278.522 764.757 282.055L729.101 298.128C723.119 294.719 718.823 290.121 716.215 284.334C714.77 281.129 713.933 278.025 713.704 275.021C713.455 271.974 713.631 268.681 714.232 265.143L749.888 249.07C753.131 251.036 755.77 253.087 757.804 255.223C759.838 257.359 761.577 260.03 763.022 263.235Z"
                fill="url(#paint8_linear_2_13)" />
            <path
                d="M815.542 256.592C815.987 256.392 816.338 256.1 816.594 255.717L813.855 249.64C815.959 246.228 819.435 242.653 824.284 238.914C829.177 235.155 834.206 232.111 839.37 229.784C842.813 231.124 846.396 233.847 850.122 237.952C853.871 241.993 856.663 245.93 858.498 249.762C858.41 251.944 857.76 254.541 856.546 257.551C855.377 260.542 853.692 263.578 851.492 266.658C846.069 274.352 838.573 280.355 829.002 284.669C815.291 290.85 802.701 291.731 791.23 287.315C779.452 282.93 770.352 273.615 763.931 259.37C757.49 245.081 756.885 231.857 762.116 219.698C764.388 214.282 767.717 209.487 772.102 205.314C776.468 201.097 781.521 197.694 787.264 195.106C798.482 190.049 808.898 188.621 818.513 190.821C828.128 193.021 834.731 198.106 838.323 206.074C841.031 212.083 841.191 217.367 838.8 221.926C836.39 226.441 832.024 230.123 825.703 232.972C822.231 234.537 818.355 235.266 814.076 235.16C809.777 235.009 806.952 234.327 805.602 233.115C803.957 229.465 802.729 226.563 801.92 224.411C801.811 224.407 801.645 224.455 801.422 224.555L800.955 224.766C800.287 225.067 799.843 225.508 799.623 226.089C799.428 226.606 799.445 227.535 799.675 228.877C799.95 230.2 801.291 233.532 803.699 238.873C809.458 251.649 813.406 257.555 815.542 256.592Z"
                fill="url(#paint9_linear_2_13)" />
            <path
                d="M885.109 257.289C880.168 259.517 875.748 259.929 871.848 258.527C867.994 257.104 864.872 253.745 862.485 248.447L833.048 183.144C834.505 180.078 836.683 177.248 839.585 174.654C842.511 171.996 845.799 169.845 849.449 168.199C854.836 165.771 860 165.05 864.943 166.035C870.359 167.237 874.27 170.508 876.678 175.85L893.142 212.374C890.75 213.72 888.622 215.536 886.76 217.821C884.878 220.062 884.218 221.806 884.78 223.052C885.121 223.809 885.835 224.264 886.922 224.417C889.663 218.736 895.374 213.939 904.054 210.026L919.879 202.893C925.145 206.732 928.992 211.345 931.42 216.731C932.623 219.402 933.49 222.573 934.02 226.244C934.55 229.915 934.428 232.969 933.652 235.408L885.109 257.289Z"
                fill="url(#paint10_linear_2_13)" />
            <path
                d="M947.184 140.132L978.275 209.107C977.03 211.811 974.965 214.536 972.079 217.283C969.193 220.03 965.302 222.507 960.405 224.714C955.509 226.921 950.855 227.707 946.444 227.071C941.508 226.457 938.067 223.991 936.12 219.674L905.028 150.698C906.273 147.994 908.339 145.269 911.225 142.522C914.111 139.775 917.98 137.308 922.832 135.121C927.684 132.934 932.372 132.106 936.896 132.638C941.828 133.36 945.257 135.858 947.184 140.132Z"
                fill="url(#paint11_linear_2_13)" />
            <path
                d="M1393 206.205C1393 190.09 1402.67 175.549 1417.53 169.317L1581.34 100.623C1591.43 96.3935 1602.81 96.4787 1612.83 100.859L1769.02 169.123C1783.59 175.49 1793 189.878 1793 205.775V417.77C1793 434.44 1782.66 449.361 1767.06 455.219L1610.91 513.831C1602.02 517.168 1592.23 517.233 1583.3 514.016L1419.45 455.006C1403.58 449.291 1393 434.237 1393 417.372V206.205Z"
                fill="url(#paint12_linear_2_13)" />
            <path
                d="M1413.37 761.516L1390.53 807.659C1387.65 808.413 1384.23 808.547 1380.28 808.06C1376.32 807.573 1371.94 806.138 1367.12 803.755C1362.31 801.372 1358.75 798.274 1356.44 794.462C1353.78 790.258 1353.5 786.034 1355.61 781.789L1376.53 739.518L1361.24 731.946C1360.32 725.879 1361.18 720.176 1363.83 714.838C1365.63 711.206 1367.75 708.337 1370.21 706.231C1372.74 704.103 1375.22 702.717 1377.67 702.075L1445.53 735.677C1445.83 738.274 1445.7 741.179 1445.14 744.391C1444.59 747.604 1443.63 750.588 1442.26 753.345C1439.71 758.508 1436.68 761.752 1433.2 763.076C1429.73 764.356 1426.07 764.043 1422.22 762.136L1402.99 752.615C1402.7 752.856 1402.48 753.152 1402.3 753.502C1401.91 754.289 1402.11 755.042 1402.9 755.76C1403.71 756.542 1405.69 757.714 1408.84 759.274L1413.37 761.516Z"
                fill="url(#paint13_linear_2_13)" />
            <path
                d="M1467.95 788.128C1466.64 787.915 1465.73 788.312 1465.23 789.318L1465.07 789.646C1464.96 789.865 1464.92 790.007 1464.94 790.073C1465.45 790.267 1466.09 790.559 1466.88 790.949L1468.45 791.729C1473.44 794.199 1477.72 797.272 1481.3 800.949C1484.94 804.603 1487.31 808.775 1488.42 813.466C1489.62 818.746 1488.8 824.252 1485.96 829.984C1481.54 838.911 1475.12 844.122 1466.7 845.619C1458.28 847.115 1448.9 845.306 1438.58 840.193C1428.25 835.08 1421 829.366 1416.82 823.049C1412.69 816.755 1412.26 810.304 1415.54 803.696C1416.75 801.246 1418.38 799.274 1420.43 797.781C1422.49 796.244 1424.39 795.385 1426.12 795.204C1427.53 798.408 1430.14 801.881 1433.95 805.622C1437.83 809.341 1442.33 812.468 1447.45 815.003C1449.51 816.021 1450.82 815.961 1451.38 814.823C1451.64 814.298 1451.79 813.828 1451.83 813.413C1451.51 813.305 1451.12 813.143 1450.69 812.926L1449.96 812.569C1440.69 807.976 1434.18 802.466 1430.44 796.039C1426.2 788.762 1425.95 781.338 1429.7 773.768C1433.45 766.198 1439.3 761.469 1447.27 759.581C1456.08 757.516 1465.96 759.192 1476.9 764.608C1482.28 767.273 1487.01 770.322 1491.08 773.756C1495.2 777.212 1498.46 780.704 1500.85 784.232C1500.8 786.438 1499.9 789.291 1498.17 792.792C1495.52 798.131 1492.03 801.496 1487.69 802.889C1486.07 800.559 1483.83 798.198 1480.98 795.807C1478.2 793.394 1475.52 791.549 1472.94 790.271C1470.35 788.992 1468.69 788.278 1467.95 788.128Z"
                fill="url(#paint14_linear_2_13)" />
            <defs>
                <linearGradient id="paint0_linear_2_13" x1="0" y1="540" x2="1920" y2="540"
                    gradientUnits="userSpaceOnUse">
                    <stop stop-color="#FE842B" />
                    <stop offset="0.575" stop-color="#E64E39" />
                    <stop offset="0.96" stop-color="#F5A52E" />
                </linearGradient>
                <linearGradient id="paint1_linear_2_13" x1="0" y1="540" x2="1920" y2="540"
                    gradientUnits="userSpaceOnUse">
                    <stop stop-color="#FE842B" />
                    <stop offset="0.575" stop-color="#E64E39" />
                    <stop offset="0.96" stop-color="#F5A52E" />
                </linearGradient>
                <linearGradient id="paint2_linear_2_13" x1="0" y1="540" x2="1920" y2="540"
                    gradientUnits="userSpaceOnUse">
                    <stop stop-color="#FE842B" />
                    <stop offset="0.575" stop-color="#E64E39" />
                    <stop offset="0.96" stop-color="#F5A52E" />
                </linearGradient>
                <linearGradient id="paint3_linear_2_13" x1="0" y1="540" x2="1920" y2="540"
                    gradientUnits="userSpaceOnUse">
                    <stop stop-color="#FE842B" />
                    <stop offset="0.575" stop-color="#E64E39" />
                    <stop offset="0.96" stop-color="#F5A52E" />
                </linearGradient>
                <linearGradient id="paint4_linear_2_13" x1="0" y1="540" x2="1920" y2="540"
                    gradientUnits="userSpaceOnUse">
                    <stop stop-color="#FE842B" />
                    <stop offset="0.575" stop-color="#E64E39" />
                    <stop offset="0.96" stop-color="#F5A52E" />
                </linearGradient>
                <linearGradient id="paint5_linear_2_13" x1="0" y1="540" x2="1920" y2="540"
                    gradientUnits="userSpaceOnUse">
                    <stop stop-color="#FE842B" />
                    <stop offset="0.575" stop-color="#E64E39" />
                    <stop offset="0.96" stop-color="#F5A52E" />
                </linearGradient>
                <linearGradient id="paint6_linear_2_13" x1="0" y1="540" x2="1920" y2="540"
                    gradientUnits="userSpaceOnUse">
                    <stop stop-color="#FE842B" />
                    <stop offset="0.575" stop-color="#E64E39" />
                    <stop offset="0.96" stop-color="#F5A52E" />
                </linearGradient>
                <linearGradient id="paint7_linear_2_13" x1="0" y1="540" x2="1920" y2="540"
                    gradientUnits="userSpaceOnUse">
                    <stop stop-color="#FE842B" />
                    <stop offset="0.575" stop-color="#E64E39" />
                    <stop offset="0.96" stop-color="#F5A52E" />
                </linearGradient>
                <linearGradient id="paint8_linear_2_13" x1="0" y1="540" x2="1920" y2="540"
                    gradientUnits="userSpaceOnUse">
                    <stop stop-color="#FE842B" />
                    <stop offset="0.575" stop-color="#E64E39" />
                    <stop offset="0.96" stop-color="#F5A52E" />
                </linearGradient>
                <linearGradient id="paint9_linear_2_13" x1="0" y1="540" x2="1920" y2="540"
                    gradientUnits="userSpaceOnUse">
                    <stop stop-color="#FE842B" />
                    <stop offset="0.575" stop-color="#E64E39" />
                    <stop offset="0.96" stop-color="#F5A52E" />
                </linearGradient>
                <linearGradient id="paint10_linear_2_13" x1="0" y1="540" x2="1920" y2="540"
                    gradientUnits="userSpaceOnUse">
                    <stop stop-color="#FE842B" />
                    <stop offset="0.575" stop-color="#E64E39" />
                    <stop offset="0.96" stop-color="#F5A52E" />
                </linearGradient>
                <linearGradient id="paint11_linear_2_13" x1="0" y1="540" x2="1920" y2="540"
                    gradientUnits="userSpaceOnUse">
                    <stop stop-color="#FE842B" />
                    <stop offset="0.575" stop-color="#E64E39" />
                    <stop offset="0.96" stop-color="#F5A52E" />
                </linearGradient>
                <linearGradient id="paint12_linear_2_13" x1="201.6" y1="206.141" x2="657.536" y2="1450.97"
                    gradientUnits="userSpaceOnUse">
                    <stop stop-color="#7EEE56" />
                    <stop offset="1" stop-color="#101F0A" />
                </linearGradient>
                <linearGradient id="paint13_linear_2_13" x1="1495.6" y1="893.787" x2="1373.26" y2="717.169"
                    gradientUnits="userSpaceOnUse">
                    <stop stop-color="#2B3137" />
                    <stop offset="1" stop-color="#487299" />
                </linearGradient>
                <linearGradient id="paint14_linear_2_13" x1="1495.6" y1="893.787" x2="1373.26" y2="717.169"
                    gradientUnits="userSpaceOnUse">
                    <stop stop-color="#2B3137" />
                    <stop offset="1" stop-color="#487299" />
                </linearGradient>
            </defs>
        </svg>
        <div class="layer22 grid-container">
            <div class="grid-item grid-item-1">
                <h3 class="title">
                    Application Name
                </h3>
                <code class="sub-title"><%= appName %></code>
            </div>
            <div class="grid-item grid-item-2">
                <h3 class="title">
                    Application Port
                </h3>
                <code class="sub-title"><%= appPort %></code>
            </div>
            <div class="grid-item grid-item-3">
                <h3 class="title">
                    Database Details <code class="syntax"> &lt; db | port | container &gt;</code>
                </h3>
                <div class="flex">
                    <code class="sub-title">
                        <% if (dbName) { %>
                            <%= dbName %>
                        <% } else { %>
                            NULL
                        <% } %>
                    </code>
                    <div class="vr"></div>
                    <code class="sub-title">

                        <% if (dbPort) { %>
                            <%= dbPort %>
                        <% } else { %>
                            NULL
                        <% } %>
                    </code>
                    <div class="vr"></div>
                    <code class="sub-title">

                        <% if (containerName) { %>
                            <%= containerName %>
                        <% } else { %>
                            NULL
                        <% } %>
                    </code>
                </div>
            </div>
            <div class="grid-item grid-item-4">
                <h3 class="title mb_10">Available Routes</h3>
                <div class="grid-container-info">
                    <% routes.forEach(route=> { %>
                        <div class="grid-item-info grid-item-method">
                            <code class="sub-title"><%= route.methods.join(', ') %></code>
                        </div>
                        <div class="grid-item-info grid-item-route">
                            <%= route.route %>
                        </div>
                        <% }); %>
                </div>
            </div>

            <div class="grid-item grid-item-5">
                <div class="star">
                    <svg width="139" height="109" viewBox="0 0 139 109" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M12.0271 54.8469C-4.25605 51.9902 -2.16756 28 14.3643 28H36.3026C44.1175 28 50.7018 22.1383 51.6307 14.3788V14.3788C53.8326 -4.01345 80.5355 -4.1688 82.8012 14.2157V14.2157C83.7706 22.0817 90.4536 28 98.379 28H123.497C141.183 28 143.647 53.5626 126.287 56.9412V56.9412C116.983 58.7517 111.842 68.8065 115.821 77.4087L118.002 82.1238C127.199 102.007 100.558 118.749 86.6317 101.838L81.1571 95.1908C73.7743 86.226 60.0846 86.1077 52.5481 94.9436L48.7467 99.4004C34.9453 115.581 9.44092 98.5977 19.0492 79.6243L21.7561 74.279C25.8586 66.178 20.971 56.416 12.0271 54.8469V54.8469Z"
                            fill="url(#paint0_linear_2_9)" />
                        <defs>
                            <linearGradient id="paint0_linear_2_9" x1="-221" y1="-177" x2="105" y2="591"
                                gradientUnits="userSpaceOnUse">
                                <stop stop-color="#2EF589" />
                                <stop offset="1" stop-color="#8F601B" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                <code class="chip"><a href="https://github.com/iamstorm-sys/quicklee-cli">Github</a></code>
                <div class="vr"></div>
                <code class="chip"><a href="https://www.npmjs.com/package/quicklee-cli">NPM</a></code>

            </div>
        </div>
    </div>
</body>

</html>
`


const ROUTES_FILE = `
import { Router } from 'express';
import { RouteInfo } from './types';

function getRoutes(router: Router): RouteInfo[] {
    const routes: RouteInfo[] = [];

    router.stack.forEach(layer => {
        if (layer.route) {
            const route: any = layer.route;

            const routeInfo: RouteInfo = {
                route: route.path as string,
                methods: Object.keys(route.methods).map(method => method.toUpperCase())
            };
            routes.push(routeInfo);
        } else if (layer.name === 'router' && layer.handle) {
            // Nested routers
            const nestedRoutes = getRoutes(layer.handle as Router);
            routes.push(...nestedRoutes);
        }
    });

    return routes;
}

export { getRoutes };
`

const ROUTE_TYPES = `
export interface RouteInfo {
  route: string;
  methods: string[];
}
`
module.exports = {
    WITHOUT_DB_INDEX_FILE, TS_CONFIG_JSON, PACKAGE_JSON, DB_CONNECTION, DB_TEST_CONNECTION, INDEX_FILE_WITH_TEST_API, INDEX_EJS, ROUTES_FILE, ROUTE_TYPES
}
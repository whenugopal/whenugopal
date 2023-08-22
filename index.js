import puppeteer from "puppeteer";
import chalk from "chalk";
import path from "path";
import fs from "fs";
import deviceList from "./inventory/devices.js";

const createFolders = (currentModulePath, screenshotsDirectory) => {
  if (!fs.existsSync(path.dirname(currentModulePath) + "/screenshots")) {
    fs.mkdirSync(path.join(path.dirname(currentModulePath)) + "/screenshots");
  }
  if (!fs.existsSync(screenshotsDirectory)) {
    fs.mkdirSync(screenshotsDirectory);
  }
};

const namaste = async (props) => {
  // fetching from props
  const urls = props.urls;
  const devices = deviceList[props.deviceName];

  // lets start puppy
  const browser = await puppeteer.launch();

  // iterate over urls
  for (const url of urls) {
    const page = await browser.newPage();
    await page.goto(url);

    console.log(chalk.bold(`Capturing screenshots for ${url}\n`));

    // Iterate over selected devices
    for (const device of devices) {
      await page.setViewport({ width: device.width, height: device.height });
      const sanitizedUrl = url.replace(/[^a-zA-Z0-9]/g, "_");
      const currentModulePath = new URL(import.meta.url).pathname;
      const screenshotsDirectory = path.join(
        path.dirname(currentModulePath) + "/screenshots",
        sanitizedUrl
      );
      // create required folders
      createFolders(currentModulePath, screenshotsDirectory);
      const screenshotPath = path.join(
        screenshotsDirectory,
        `${device.name.toLowerCase()}_${sanitizedUrl}.png`
      );

      await page.screenshot({ path: screenshotPath });
      console.log(
        chalk.green(
          `Captured screenshot for ${device.name} (${device.width}x${device.height}): ${screenshotPath}`
        )
      );
    }
    console.log("\n");
    await page.close();
  }

  await browser.close();
};

export default namaste;

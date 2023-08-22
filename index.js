import puppeteer from "puppeteer";
import chalk from "chalk";
import path from "path";
import fs from "fs";

const namaste = async (props) => {
  const urls = props.urls;

  const devices = [
    { name: "Desktop", width: 1366, height: 768 },
    { name: "Tablet", width: 768, height: 1024 },
    { name: "Mobile", width: 375, height: 667 },
  ];

  const browser = await puppeteer.launch();

  for (const url of urls) {
    const page = await browser.newPage();
    await page.goto(url);

    console.log(chalk.bold(`Capturing screenshots for ${url}\n`));

    for (const device of devices) {
      await page.setViewport({ width: device.width, height: device.height });
      const sanitizedUrl = url.replace(/[^a-zA-Z0-9]/g, "_");
      const currentModulePath = new URL(import.meta.url).pathname;
      const screenshotsDirectory = path.join(
        path.dirname(currentModulePath) + "/screenshots",
        sanitizedUrl
      );

      if (!fs.existsSync(path.dirname(currentModulePath) + "/screenshots")) {
        fs.mkdirSync(
          path.join(path.dirname(currentModulePath)) + "/screenshots"
        );
      }

      if (!fs.existsSync(screenshotsDirectory)) {
        fs.mkdirSync(screenshotsDirectory);
      }

      const screenshotPath = path.join(
        screenshotsDirectory,
        `${device.name.toLowerCase()}_${sanitizedUrl}.png`
      );

      // await page.screenshot({ path: screenshotPath });
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

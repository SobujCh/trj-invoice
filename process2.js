const { connect } = require("puppeteer-real-browser");
const start = async () => {
    console.log("Starting Puppeteer Real Browser...");
    const { page, browser } = await connect({
        headless: false,
        disableXvfb: false,
    });
    console.log("Connected to browser.");
    await page.goto("https://payment.ivacbd.com/");
    //here is the page title
    console.log("Navigated to page.");
    const title = await page.title();
    console.log("Page title:", title);
    //close the browser
    await browser.close();
};

start();

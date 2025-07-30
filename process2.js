const { connect } = require("puppeteer-real-browser");
const start = async () => {
    const { page, browser } = await connect({
        headless: true
    });
    await page.goto("https://payment.ivacbd.com/");
    //here is the page title
    const title = await page.title();
    console.log("Page title:", title);
    //close the browser
    await browser.close();
};

start();

const { ProxyAgent } = require('undici');
const jsdom = require("jsdom");

const base_url = "https://payment.ivacbd.com/";
const URL = `${base_url}invoice/print/SBIMU1753101591603A`;
const client = new ProxyAgent(
	'http://CHNwdYQi3qRbbKh1:ZzTX8KjtB7V_country-bd@geo.iproyal.com:12321'
);




async function run(){
    for (let i = 0; i < 2; i++) {
        await fetcher();
    }
}
async function fetcher() {
    fetch("https://payment.ivacbd.com/invoice/print/SBIMU1753101591603A", {
        dispatcher: client,
        "headers": {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "en-US,en;q=0.9,bn-BD;q=0.8,bn;q=0.7",
            "priority": "u=0, i",
            "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
            "sec-ch-ua-arch": "\"x86\"",
            "sec-ch-ua-bitness": "\"64\"",
            "sec-ch-ua-full-version": "\"138.0.7204.158\"",
            "sec-ch-ua-full-version-list": "\"Not)A;Brand\";v=\"8.0.0.0\", \"Chromium\";v=\"138.0.7204.158\", \"Google Chrome\";v=\"138.0.7204.158\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-model": "\"\"",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-ch-ua-platform-version": "\"15.0.0\"",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "none",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1"
        },
        "body": null,
        "method": "GET"
    }).then(response => {
        if (!response.ok) { console.log('Response not OK:', response.status); return; }
        return response.text();
    }).then(html => {
        const dom = new jsdom.JSDOM(html);
        console.log('Fetched Title:', dom.window.document.title);
        //console.log('Fetched HTML:', html.trim());
    }).catch(error => {
        console.error('Error fetching data:', error);
    });
}
run()

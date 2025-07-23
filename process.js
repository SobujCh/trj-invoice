const { ProxyAgent } = require('undici');
const jsdom = require("jsdom");

const client = new ProxyAgent(
    'http://CHNwdYQi3qRbbKh1:ZzTX8KjtB7V_country-bd@geo.iproyal.com:12321'
);
let intervalId = null;
async function run(){
    if(process.argv.length < 3) {
        console.error("Please provide the URL to fetch as an argument.");
        return;

    }
    intervalId = setInterval(() => {
        fetcher(process.argv[2]);
    }, 100);
}
async function fetcher(dataBody) {
    fetch("https://payment.ivacbd.com/api/payment/appointment/process", {
        dispatcher: client,
        "headers": {
            "content-type": "application/x-www-form-urlencoded",
            "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "upgrade-insecure-requests": "1",
            "Referer": "https://securepay.sslcommerz.com/redirections/"
        },
        "body": dataBody,
        "method": "POST",
        redirect: 'manual'
    }).then(response => {
        // Check if it's a redirect response (3xx status codes)
        if (response.status >= 300 && response.status < 400) {
            const redirectUrl = response.headers.get('location');
            console.log('Redirect URL:', redirectUrl);
            console.log('Response Status:', response.status);
            clearInterval(intervalId); // Stop the interval if we hit a redirect
            return; // Don't try to parse as HTML since it's a redirect
        }
        
        if (!response.ok) { 
            console.log('Response not OK:', response.status); 
            return; 
        }
        return response.text();
    }).then(html => {
        if (html) { // Only process HTML if we have it
            const dom = new jsdom.JSDOM(html);
            console.log('Fetched Title:', dom.window.document.title);
            //console.log('Fetched HTML:', html.trim());
        }
    }).catch(error => {
        console.error('Error fetching data:', error);
    });
}
run()

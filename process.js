const { ProxyAgent } = require('undici');
const jsdom = require("jsdom");

const client = new ProxyAgent(
    'http://CHNwdYQi3qRbbKh1:ZzTX8KjtB7V_country-bd@geo.iproyal.com:12321'
);
let intervalId = null;
let controllers = [];
let aborting = false;
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
    const controller = new AbortController()
    const signal = controller.signal;
    controllers.push(controller); 
    fetch("https://payment.ivacbd.com/api/payment/appointment/process", {
        dispatcher: client,
        signal: signal,
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
        if (aborting) return; // If we are aborting, skip further processing
        // Check if it's a redirect response (3xx status codes)
        if (response.status >= 300 && response.status < 400) {
            const redirectUrl = response.headers.get('location');
            console.log('Status:', response.status, 'Redirect URL:', redirectUrl);
            clearInterval(intervalId); // Stop the interval if we hit a redirect
            clearControllers(); // Abort all ongoing fetch requests
            aborting = true; // Set aborting flag to true
            process.exit(0); // Exit cleanly with success status
        }
        
        if (!response.ok) { 
            console.log('Response not OK:', response.status); 
            return; 
        }
        return response.text();
    }).then(html => {
        if(aborting) return; // If we are aborting, skip further processing
        if (html) { // Only process HTML if we have it
            const dom = new jsdom.JSDOM(html);
            console.log('Fetched Title:', dom.window.document.title);
            //console.log('Fetched HTML:', html.trim());
        }
    }).catch(error => {
        if (aborting) return;                           // If we are aborting, skip further processing
        if (error.name === 'AbortError') {return;}      //if aborted, we don't need to log it
        console.error('Error fetching data:', error);
    });
}
function clearControllers() {
    controllers.forEach(controller => controller.abort());
}
run()

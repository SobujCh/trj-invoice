const { ProxyAgent } = require('undici');
const jsdom = require("jsdom");
const dotenv = require('dotenv');
process.env.DOTENV_CONFIG_QUIET=true
dotenv.config();
const proxies = require('./proxies.json').proxies;

let agents = [];
const proxyItem = process.env.PROXY || 'iproyal';
Object.keys(proxies[proxyItem].cities).forEach(key => {
    const agent = new ProxyAgent(proxies[proxyItem].url.replace('[citycode]', proxies[proxyItem].cities[key]));
    agents.push(agent);
});

let currentAgent = 0;
let intervalId = null;
let controllers = [];
let aborting = false;
let err402=0,err403=0,err419=0,err429=0,err500=0,err502=0,err503=0,err504=0,otherErrors=0,otherCodes='';
async function run(){
    if(process.argv.length < 3) {
        console.error("Please provide the URL to fetch as an argument.");
        return;
    }
    console.log('');
    intervalId = setInterval(() => {
        fetcher(process.argv[2]);
    }, (agents.length > 0 ? (800/agents.length) : 800)); // Adjust interval based on agents
}
async function fetcher(dataBody) {
    const controller = new AbortController()
    const signal = controller.signal;
    controllers.push(controller); 
    fetch("https://payment.ivacbd.com/api/payment/appointment/process", {
        dispatcher: agents[currentAgent],
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
            console.log('\nStatus:', response.status, 'Redirect URL:', redirectUrl);
            clearControllers(); // Abort all ongoing fetch requests
        }
        
        if (!response.ok) { 
            errCountUp(response.status);
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
        if (aborting) return;                   // If we are aborting, skip further processing
        if (error.name === 'AbortError') {return;}      //if aborted, we don't need to log it
        if(error.cause && error.cause.cause && typeof(error.cause.cause) === 'object' && error.cause.cause.name && error.cause.cause.name=='AbortError')return;
        console.error('\nError fetching data:');
        console.error('Message:', error.message);
        if(error.cause && error.cause.cause && typeof(error.cause.cause)==='object' && error.cause.cause) {
            console.error('Cause2:', typeof(error.cause.cause));
            console.error('CauseKeys:', Object.keys(error.cause.cause));
            console.error('CauseName:', error.cause.cause.name);
            console.error('CauseCode:', error.cause.cause.code);
        }else if(error.cause && typeof(error.cause)==='object' && error.cause){
            console.error('Cause:', error.cause);
            console.error('CauseKeys:', Object.keys(error.cause));
            console.error('CauseName:', error.cause.name);
            console.error('CauseCode:', error.cause.code);
        }{
            console.error('Cause:', error.cause);
        }
    });
    currentAgent = (currentAgent + 1) % agents.length; // Cycle through agents
}
function clearControllers() {
    clearInterval(intervalId); // Stop the interval if we hit a redirect
    controllers.forEach(controller => controller.abort());
    aborting = true; // Set aborting flag to true
    process.exit(0); // Exit cleanly with success status
}
function errCountUp(status) {
    switch (status) {
        case 402: err402++; break;
        case 403: err403++; break;
        case 419: err419++; break;
        case 429: err429++; break;
        case 500: err500++; break;
        case 502: err502++; break;
        case 503: err503++; break;
        case 504: err504++; break;
        default: otherErrors++; if(otherCodes.indexOf(status) === -1){otherCodes += status + ', '; }
    }
    process.stdout.write(`\rErrors - 402:${err402}, 403:${err403}, 419:${err419}, 429:${err429}, 500:${err500}, 502:${err502}, 503:${err503}, 504:${err504}, Other:${otherErrors} (${otherCodes})`);
}
run()

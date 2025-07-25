const { ProxyAgent } = require('undici');
const dotenv = require('dotenv');
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
let decliner = 0;
let maxDecline = 3; // Maximum number of declines before stopping
let err403=0,err419=0,err429=0,err500=0,err502=0,err503=0,err504=0,otherErrors=0,otherCodes='';


async function run(){
    if(process.argv.length < 3) {
        console.error("Please provide the SBIMU ID as an argument.");
        return;
    }
    console.log('');
    intervalId = setInterval(() => {
        fetcher(process.argv[2]);
    }, (agents.length > 0 ? (800/agents.length) : 800)); // Adjust interval based on agents
}
async function fetcher(sbimuid) {
    const controller = new AbortController()
    const signal = controller.signal;
    controllers.push(controller); 


    fetch(`https://payment.ivacbd.com/multi_payment/status/${sbimuid}`, {
        dispatcher: agents[currentAgent],
        signal: signal,
        "headers": {
            "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
            "sec-ch-ua-arch": "\"x86\"",
            "sec-ch-ua-bitness": "\"64\"",
            "sec-ch-ua-full-version": "\"138.0.7204.158\"",
            "sec-ch-ua-full-version-list": "\"Not)A;Brand\";v=\"8.0.0.0\", \"Chromium\";v=\"138.0.7204.158\", \"Google Chrome\";v=\"138.0.7204.158\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-model": "\"\"",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-ch-ua-platform-version": "\"15.0.0\"",
            "upgrade-insecure-requests": "1"
        },
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "omit",
        redirect: 'manual'
    }).then(response => {
        if (aborting) return; // If we are aborting, skip further processing
        // Check if it's a redirect response (3xx status codes)
        if (response.status >= 300 && response.status < 400) {
            const redirectUrl = response.headers.get('location');
            console.log('');
            console.log('Status:', response.status, 'Redirect URL:', redirectUrl);
            fullStop(); // Stop the interval if we hit a redirect
        }
        
        if (!response.ok) { 
            errCountUp(response.status);
            process.stdout.write(`\rProcessing: ${count}%`);
            console.log('Response not OK:', response.status); 
            return; 
        }
        return response.text();
    }).then(html => {
        if(aborting) return; // If we are aborting, skip further processing
        if (html) { // Only process HTML if we have it
            if(html.includes('Thank you for your payment')) {
                var count = (html.match(/BGD/g) || []).length;
                console.log(`Payment Successful ${count}!!!`);
                fullStop();
            }else if(html.includes('Your payment was declined')) {
                decliner++;
                console.error(`Payment Declined ${decliner}!!!`);
                if(decliner >= maxDecline) {
                    fullStop();
                }
            }
        }
    }).catch(error => {
        if (aborting) return;                           // If we are aborting, skip further processing
        if (error.name === 'AbortError' || error.name === 'TypeError') {return;}      //if aborted, we don't need to log it
        console.error('Error fetching data:', error.name, error.message);
        console.log('');
    });
    currentAgent = (currentAgent + 1) % agents.length; // Cycle through agents
}
function clearControllers() {
    controllers.forEach(controller => controller.abort());
}
function errCountUp(status) {
    switch (status) {
        case 403: err403++; break;
        case 419: err419++; break;
        case 429: err429++; break;
        case 500: err500++; break;
        case 502: err502++; break;
        case 503: err503++; break;
        case 504: err504++; break;
        default: otherErrors++; if(otherCodes.indexOf(status) === -1){otherCodes += status + ', '; }
    }
    process.stdout.write(`\nErrors - 403:${err403}, 419:${err419}, 429:${err429}, 500:${err500}, 502:${err502}, 503:${err503}, 504:${err504}, Other:${otherErrors} (${otherCodes})`);
}
function fullStop(){
    clearInterval(intervalId);
    clearControllers();
    process.exit(0);
}
run()
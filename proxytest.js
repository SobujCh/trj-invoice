const dotenv = require('dotenv');
const { ProxyAgent } = require('undici');
const proxies = require('./proxies.json').proxies;
dotenv.config();

const proxyItem = process.env.PROXY || 'iproyal';
Object.keys(proxies[proxyItem].cities).forEach(key => {
    const agent = new ProxyAgent(proxies[proxyItem].url.replace('[citycode]', proxies[proxyItem].cities[key]));
    fetch('https://ipv4.icanhazip.com', {
        dispatcher: agent,
    })
    .then(res => res.text())
    .then(ip => {
        console.log(`IP for ${proxyItem}_${proxies[proxyItem].cities[key]}: ${ip.trim()}`);
    })
    .catch(err => {
        console.error(`Error fetching IP for ${proxyItem}_${proxies[proxyItem].cities[key]}:`, err.message);
    });
});
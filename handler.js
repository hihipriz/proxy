const fetch = require('node-fetch');
const percentile = require('percentile');
const limiter = require('./limiter');

const ipGeoTimes = [];
const ipstackTimes = [];

const handle = (ip, res) => {
    let countryName = '';
    let end;

    const ipstackUrl = `http://api.ipstack.com/${ip}?access_key=07291042e1800c8d51696b22c85ca849`;
    const ipGeoUrl = `https://api.ipgeolocation.io/ipgeo?apiKey=034f739b2da24ad28eefd968c73667da&ip=${ip}`;
    let url;
    let vendor;

    // can impl strat pattern for providers
    // it's assumed there's a valid response from the providers for the limiter
    if (limiter.allowed(ip, 'ipstack')) {
        vendor = 'ipstack';
        url = ipstackUrl;
    } else if (limiter.allowed(ip, 'ipGeo')) {
        vendor = 'ipGeo';
        url = ipGeoUrl;
    } else {
        res.status(403);
        res.send('None shall pass');
        return;
    }

    const start = new Date();
    fetch(url)
        .then((resp) => resp.json())
        .then((json) => {
            end = new Date() - start;

            if (vendor === 'ipstack') {
                ipstackTimes.push(end);
            } else if (vendor === 'ipGeo') {
                ipGeoTimes.push(end);
            }
            countryName = json.country_name;

            const response = {
                ip,
                countryName,
                apiLatency: end,
                vendor,
            };
            console.log(`response: ${JSON.stringify(response, undefined, 4)}`);

            res.send(response);
        });
};

const getMetrics = () => ({
    ipstack: {
        percentile50: percentile(50, ipstackTimes),
        percentile75: percentile(75, ipstackTimes),
        percentile95: percentile(95, ipstackTimes),
        percentile99: percentile(99, ipstackTimes),
    },
    ipGeo: {
        percentile50: percentile(50, ipGeoTimes),
        percentile75: percentile(75, ipGeoTimes),
        percentile95: percentile(95, ipGeoTimes),
        percentile99: percentile(99, ipGeoTimes),
    },
});

module.exports = {
    handle,
    getMetrics,
};

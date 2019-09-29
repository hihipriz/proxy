const fetch = require('node-fetch');
const limiter = require('./limiter');

const handle = (ip, res) => {
    let countryName = '';
    const start = new Date();
    let end;

    const ipstackUrl = `http://api.ipstack.com/${ip}?access_key=07291042e1800c8d51696b22c85ca849`;
    const ipGeoUrl = `https://api.ipgeolocation.io/ipgeo?apiKey=034f739b2da24ad28eefd968c73667da&ip=${ip}`;
    let url;

    // can impl strat pattern for providers
    // it's assumed there's a valid response from the providers for the limiter
    if (limiter.allowed(ip, 'ipstack')) {
        url = ipstackUrl;
    } else if (limiter.allowed(ip, 'ipGeo')) {
        url = ipGeoUrl;
    } else {
        res.status(403);
        res.send('None shall pass');
        return;
    }

    fetch(url)
        .then((resp) => resp.json())
        .then((json) => {
            end = new Date() - start;
            countryName = json.country_name;

            res.send({
                ip,
                countryName,
                apiLatency: end,
                vendor: 'ipstack',
            });
        });
};

module.exports = {
    handle,
};

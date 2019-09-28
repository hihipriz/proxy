const fetch = require('node-fetch');

const handle = (ip, res) => {
    let countryName = '';
    const start = new Date();
    let end;

    // todo: decide between urls
    const ipstackUrl = `http://api.ipstack.com/${ip}?access_key=07291042e1800c8d51696b22c85ca849`;
    const ipGeoUrl = `https://api.ipgeolocation.io/ipgeo?apiKey=034f739b2da24ad28eefd968c73667da&ip=${ip}`;

    const url = ipstackUrl || ipGeoUrl;
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

const express = require('express');
const { handle, getMetrics } = require('./handler');

const app = express();
const port = 3000;

app.get('/getIPCountry', (req, res) => {
    try {
    // since xff may provide a number of ips,
    // we'd like to take the first element in order to get the original ip.
    // in case of no xff, we get the remoteAddr property. with the original code,
    // we could end up with the wrong ip, or no ip if there's no xff header
        let ip =      (req.headers['x-forwarded-for'] || '').split(',')[0]
      || req.connection.remoteAddress;

        // in case of IPv4-mapped IPv6 address format
        ip = ip.replace(/^.*:/, '');

        handle(ip, res);
    } catch (error) {
        console.log(error);
    }
});

app.get('/metrics', (req, res) => {
    try {
        res.send(getMetrics());
    } catch (error) {
        console.log(error);
    }
});

// make sure supertest and app aren't both listening when running test
if (!module.parent) {
    app.listen(port, () => console.log(`Proxy listening on port ${port}!`));
}

module.exports = app;

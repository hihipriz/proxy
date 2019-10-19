const express = require('express');
const { handle, getMetrics } = require('./handler');

const app = express();
const port = 3000;

app.get('/getIPCountry', (req, res) => {
    try {
        const ip = req.headers['x-forwarded-for'];

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

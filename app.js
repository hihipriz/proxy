const express = require('express');
const { handle } = require('./handler');

const app = express();
const port = 3000;

app.get('/getIPCountry', (req, res) => {
    const ip = req.headers['x-forwarded-for'];

    handle(ip, res);
});

// make sure supertest and app aren't both listening when running test
if (!module.parent) {
    app.listen(port, () => console.log(`Proxy listening on port ${port}!`));
}

module.exports = app;

const express = require('express');
const { handle } = require('./handler');

const app = express();
const port = 3000;

app.get('/getIPCountry', (req, res) => {
    const ip = req.headers['x-forwarded-for'];

    handle(ip, res);
});

app.listen(port, () => console.log(`Proxy listening on port ${port}!`));

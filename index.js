const http = require('http');
const https = require('https');
const express = require('express');
const httpProxy = require('http-proxy');
const fs = require('fs');

const HttpProxy = () => {
    const port = 8080;
    const proxy = httpProxy.createProxyServer({});

    const server = http.createServer(function(req, res) {
        console.log(req.url);
        proxy.web(req, res, {target: `http://${req.headers.host}`});
    });

    console.log(`listening on port ${port}`);
    server.listen(port, '0.0.0.0');
};

const HttpsProxy = () => {
    const port = +process.env.PORT || 8443;
    const options = {
        key: fs.readFileSync('key.pem'),
        cert: fs.readFileSync('certificate.pem')
    };
    const proxy = httpProxy.createServer({
        ssl: options,
        secure: true
    });

    const server = https.createServer(options, (req, res) => {
        console.log(req.url);
        res.end('pok')
        //proxy.web(req, res, {target: `https://${req.headers.host}`});
    });

    console.log(`listening on port ${port}`);
    server.listen(port, '0.0.0.0');
};

const Verify = () => {
    const app = express();
    app.use(express.static('static'));

    const port = process.env.PORT || 443;
    const server = http.createServer(app);
    server.listen(port, '0.0.0.0', () => {
        console.log(`Start listening on localhost:${port}`)
    });
};

const VERIFY = +process.env.VERIFY;
const SSL = +process.env.SSL;

VERIFY? Verify() : null;
SSL? HttpsProxy() : HttpProxy();
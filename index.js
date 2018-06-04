const http = require('http');
const https = require('https');
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
        secure: false
    });

    const server = https.createServer(options, (req, res) => {
        console.log(req.url);
        res.end('pok')
        //proxy.web(req, res, {target: `https://${req.headers.host}`});
    });

    console.log(`listening on port ${port}`);
    server.listen(port, '0.0.0.0');
};

const SSL = +process.env.SSL;

SSL? HttpsProxy() : HttpProxy();
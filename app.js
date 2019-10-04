// Dependencies
const express = require('express');
const proxy = require('http-proxy-middleware');


const http = require("http");


const https = require("https");
const fs = require("fs");

const credentials = {
  key: fs.readFileSync("/opt/certPems/tempCerts/domain-key-a11y.txt"),
  cert: fs.readFileSync("/opt/certPems/tempCerts/domain-crt-a11y.txt")
};

// Certificate
//const privateKey = fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/privkey.pem', 'utf8');
//const certificate = fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/cert.pem', 'utf8');
//const ca = fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/chain.pem', 'utf8');

//const credentials = {
//	key: privateKey,
//	cert: certificate,
//	ca: ca
//};





// Config
const { routes } = require('./config.json');

const app = express();

for (route of routes) {
    app.use(route.route,
        proxy({
            target: route.address,
            pathRewrite: (path, req) => {
                return path.split('/').slice(2).join('/'); // Could use replace, but take care of the leading '/'
            }
        })
    );
}

//app.listen(80, () => {
//    console.log('Proxy listening on port 80');
//});
//https.createServer(options, app).listen(80, () => {
//    console.log('Proxy listening on port 80');
//});


// Starting both http & https servers
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(80, () => {
	console.log('HTTP Server running on port 80');
});

httpsServer.listen(443, () => {
	console.log('HTTPS Server running on port 443');
});

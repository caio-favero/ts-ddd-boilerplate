import { Express } from 'express';
import fs from 'fs';
import https from 'https';

interface SSLOptions {
    key?: Buffer,
    cert?: Buffer,
    ca?: Buffer,
}

export function createServer(port: number, app?: Express) {
    let sslOptions: SSLOptions = {
        key: fs.readFileSync(__dirname + '/ssl/localhost-ssl.key'),
        cert: fs.readFileSync(__dirname + '/ssl/localhost-ssl.crt'),
    };

    if (process.env.NODE_ENV === 'local' && fs.existsSync(process.env.SERVER_SSL_KEY || '')) {
        sslOptions = {
            key: fs.readFileSync(process.env.SERVER_SSL_KEY || ''),
            ca: fs.readFileSync(process.env.SERVER_SSL_CA || ''),
            cert: fs.readFileSync(process.env.SERVER_SSL_CERT || ''),
        };
    }

    const server = https.createServer(sslOptions, app);

    if (fs.existsSync(process.env.SERVER_SSL_BR_KEY || '')) {
        const sslOptions_br = {
            key: fs.readFileSync(process.env.SERVER_SSL_BR_KEY || ''),
            ca: fs.readFileSync(process.env.SERVER_SSL_BR_CA || ''),
            cert: fs.readFileSync(process.env.SERVER_SSL_BR_CERT || ''),
        };

        server.addContext('*.55pbx.com.br', sslOptions_br);
    }

    server.listen(port);

    return server;
}

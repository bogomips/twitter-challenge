import * as fs from 'fs'; 
import * as https from 'https';
import config from 'config';

const sslServer={};

sslServer.create = (app) => {

  try {

    const sslOptions = {
      key: fs.readFileSync(config.server.ssl.privkey).toString(),
      cert: fs.readFileSync(config.server.ssl.cert).toString()
    };

    return https.createServer(sslOptions, app.callback());
  }
  catch (e) {
    console.log(e);
    return null;
  }

}

export { sslServer }; 
const fs = require('fs')

class Config {
    constructor() {

        this.port = 6001;
        this.staticPath = './static';

        this.readconfig();
    }

    readconfig () {
        let cfg = JSON.parse(fs.readFileSync('./config/config.json', 'utf-8'))

        cfg.BASE.port && (this.port = cfg.BASE.port);
        this.user           = cfg.USER;
        this.languagelist   = cfg.LANGUAGE_TABLES;
        this.mysql          = cfg.MYSQL
        
        console.log("Read Config.ini Success!");
    }
}

let config = new Config()

module.exports = config
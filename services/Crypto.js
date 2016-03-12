"use strict";

const crypt = require('crypto');
var   App   = null;

class Crypto {
    ready(){
        App = require(__dirname + '/../app.js');
        this.config = App.config.crypto;        
    }
    
    /**
     * Hash the password using secret salt, given salt and password
     * @param string pass Password
     * @param string salt Custom salt
     * @return string sha512 password
     */
    hashPassword(pass, salt){
        var hash = new crypt.createHash('sha512');
        hash.update(salt + pass + this.config.Secret);
        
        for(let i = 0; i < 32; i++){
            let nhash = new crypt.createHash('sha512');
            nhash.update(this.config.secret + hash.digest('hex'));
            hash = nhash;    
        }
        
        return hash.digest('hex');
    }
    
    /**
     * Create random string 
     * @param length length of the output string
     * @param chars Chars allowed 
     * @return string
     */
    random(length, chars){
        if(!chars){
            chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        }
        
        var out = '';    

        for(let i = 0; i < length; i++){
            out += chars[Math.floor(Math.random() * (chars.length - 1))];
        }
        
        return out;
    }
}


module.exports = new Crypto();
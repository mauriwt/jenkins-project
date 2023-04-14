import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})

export class EncrDecrService {
  private keySize = 256;
  private ivSize = 128;
  private saltSize = 256;
  private iterations = 1000;
  private key = "";

  private password = "x2fE4Gzv7r7UYBznQ2";
  constructor() { }

  encryptar(data: string) {
    return CryptoJS.AES.encrypt(data, this.password.trim()).toString();
  }

  decryptar(data: string) {
    return CryptoJS.AES.decrypt(data, this.password.trim()).toString(CryptoJS.enc.Utf8);
  }

  decode64(data: string) {
    return CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8);
  }

  encode64(data: string) {
    return CryptoJS.enc.Utf8.parse(data).toString(CryptoJS.enc.Base64);
  }

  recuperarSesionDato() {
    return JSON.parse(this.decryptar(sessionStorage.getItem('userData')));
  }


  encryptCshap(msg, clave) {
    var salt = CryptoJS.lib.WordArray.random(this.saltSize / 8);

    var key = CryptoJS.PBKDF2(clave, salt, {
      keySize: this.keySize / 32,
      iterations: this.iterations
    });

    var iv = CryptoJS.lib.WordArray.random(this.ivSize / 8);

    var encrypted = CryptoJS.AES.encrypt(msg, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC

    });

    var encryptedHex = this.base64ToHex(encrypted.toString());
    var base64result = this.encode64(`${salt}${iv}${encryptedHex}`);

    return base64result;
  }

  decryptCsharp(transitmessage, clave) {

    var hexResult = this.decode64(transitmessage)

    var salt = CryptoJS.enc.Hex.parse(hexResult.substr(0, 64));
    var iv = CryptoJS.enc.Hex.parse(hexResult.substr(64, 32));
    var encrypted = this.hexToBase64(hexResult.substring(96));

    var key = CryptoJS.PBKDF2(clave, salt, {
      keySize: this.keySize / 32,
      iterations: this.iterations
    });

    var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC

    })

    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  private hexToBase64(str) {
    return btoa(String.fromCharCode.apply(null,
      str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))
    );
  }

  private base64ToHex(str) {
    for (var i = 0, bin = atob(str.replace(/[ \r\n]+$/, "")), hex = []; i < bin.length; ++i) {
      var tmp = bin.charCodeAt(i).toString(16);
      if (tmp.length === 1) tmp = "0" + tmp;
      hex[hex.length] = tmp;
    }
    return hex.join("");
  }

  randomKey(length: number) {
    var result = '';
    var characters = '@abcdefghijklmnopqrstuvwxyz123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  aesKey(): string {
    this.key = this.randomKey(16);
    return this.key;
  }


}

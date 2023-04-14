import { Injectable } from '@angular/core';
import * as Forge from 'node-forge';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RSAHelperService {

  constructor() {}

  encrypt(valueToEncrypt: string): string {
    const rsa = Forge.pki.publicKeyFromPem(environment.publicKey);
    return window.btoa(rsa.encrypt(valueToEncrypt.toString()));
  }

  verifySing(values: string, key:string): boolean {

    var md = Forge.md.sha256.create();
    md.update(values, 'utf8');
    const rsa = Forge.pki.publicKeyFromPem(environment.publicKey);
    return rsa.verify(md.digest().bytes(), window.atob(key));

  }
}

import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ObservableService } from './observable.service';

@Injectable()
export class CRUDService {

  constructor(private servicio: ObservableService) { }


  public setHearder(tokenUsuario) {
    this.servicio.setHeaders(tokenUsuario);
  }

  public obtener(rest_url: string) {
    return this.servicio.getUrlServicioGet(rest_url);
  }

  public post(rest_url, object) {
    return this.servicio.post(rest_url, object);
  }
  public postFile(rest_url, object, headers: HttpHeaders) {
    return this.servicio.postFile(rest_url, object, headers);
  }
  public putFile(rest_url, object, headers: HttpHeaders) {
    return this.servicio.putFile(rest_url, object, headers);
  }
  public postFormData(rest_url, object) {
    return this.servicio.postFormData(rest_url, object);
  }

  public putFormData(rest_url, object) {
    return this.servicio.putFormData(rest_url, object);
  }

  public deleteFormData(rest_url, object) {
    return this.servicio.deleteFormData(rest_url, object);
  }

  public peticioDevExtreme(url: string, method: string = "GET", data: any = {}) {
    return this.servicio.sendRequestDevExtreme(url, method, data);
  }

  public put(rest_url, object) {
    return this.servicio.put(rest_url, object);
  }

  public postHttpParams(rest_url, object) {
    return this.servicio.postHttpParams(rest_url, object);
  }

}

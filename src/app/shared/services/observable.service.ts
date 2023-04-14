
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AlertifyService } from './alertify.service';


@Injectable({ providedIn: 'root' })
export class ObservableService {

  private headers: HttpHeaders = new HttpHeaders();
  private headersToken: HttpHeaders = new HttpHeaders();

  constructor(private http: HttpClient, private alert: AlertifyService) {
    this.headers = this.headers.append('Content-Type', 'application/json');
  }

  public setHeaders(token) {
    this.headers = this.headers.append('tokenUsuario', token);
    this.setHeadersToken(token);
  }

  private setHeadersToken(token) {
    this.headersToken = this.headersToken.append('tokenUsuario', token);
  }

  public getUrlServicioGet(servicio: string) {
    return this.getQuery(servicio);
  }

  getQuery(query: string) {
    return this.http.get(query, { headers: this.headers });
  }

  post(servicio: string, obj): Observable<any> {
    return this.http.post(servicio, obj, { headers: this.headers }).pipe(
      tap((body) => body),
      catchError(this.handleError<any>('Error al guardar registro'))
    );
  }
  postFile(servicio: string, obj, headersfile: HttpHeaders) {
    return this.http.post(servicio, obj, { headers: headersfile }).pipe(
      tap((body) => body),
      catchError(this.handleError<any>('Error al guardar registro'))
    );
  }
  putFile(servicio: string, obj, headersfile: HttpHeaders) {
    return this.http.put(servicio, obj, { headers: headersfile }).pipe(
      tap((body) => body),
      catchError(this.handleError<any>('Error al guardar registro'))
    );
  }
  put(servicio: string, obj): Observable<any> {
    return this.http.put(servicio, obj, { headers: this.headers }).pipe(
      tap((body) => body),
      catchError(this.handleError<any>('Error al editar registro'))
    );
  }

  postFormData(url: string, params: any) {
    const formData: any = new FormData();

    Object.entries(params).forEach(
      ([key, value]) => formData.append(key, value)
    );

    return this.http.post(url, formData).pipe(
      tap((body) => body),
      catchError(this.handleError<any>('Error al guardar registro'))
    );
  }

  putFormData(url: string, params: any) {
    const formData: any = new FormData();

    Object.entries(params).forEach(
      ([key, value]) => formData.append(key, value)
    );

    return this.http.put(url, formData).pipe(
      tap((body) => body),
      catchError(this.handleError<any>('Error al guardar registro'))
    );
  }

  deleteFormData(url: string, params: any) {
    const httpParams = new HttpParams({ fromObject: params });
    const httpOptions = { withCredentials: false, body: httpParams };
    return this.http.delete(url, httpOptions).pipe(
      tap((body) => body),
      catchError(this.handleError<any>('Error al guardar registro'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.log(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return throwError(error);
    };
  }

  postHttpParams(url: string, data: any = {}) {
    const httpParams = new HttpParams({ fromObject: data });
    const httpOptions = { body: httpParams, headers: this.headersToken };
    return this.http.post(url, httpParams, httpOptions).pipe(
      tap((body) => body),
      catchError(this.handleError<any>('Error al guardar registro'))
    );
  }

  sendRequestDevExtreme(url: string, method: string = "GET", data: any = {}): any {
    const httpParams = new HttpParams({ fromObject: data });
    const httpOptions = { withCredentials: false, body: httpParams };
    let result;

    switch (method) {
      case "GET":
        result = this.http.get(url, httpOptions);
        break;
      case "PUT":
        result = this.http.put(url, httpParams, httpOptions);
        break;
      case "POST":
        result = this.http.post(url, httpParams, httpOptions);
        break;
      case "DELETE":
        result = this.http.delete(url, httpOptions);
        break;
    }

    return result
      .toPromise()
      .then((respuesta: any) => {
        switch (method) {
          case "PUT":
            this.mensajes(respuesta);
            break;
          case "POST":
            this.mensajes(respuesta);
            break;
          case "DELETE":
            this.mensajes(respuesta);
            break;
        }
        return method === "GET" ? respuesta : respuesta;
      }, error => {
        this.mensajesError(error);
        throw error.error;
      })
      .catch(e => {
        throw e && e.error && e.error.Message;
      });
  }

  mensajesError(respuesta) {
    if (respuesta) {
      this.alert.error(respuesta.error);
    }
  }

  mensajes(respuesta) {
    if (respuesta) {
      switch (respuesta.estado) {
        case "OK":
          this.alert.message(respuesta.mensaje);
          break;
        case "ERROR":
          this.alert.error(respuesta.mensaje);
          break;
      }
    }
  }
}

import { Injectable } from '@angular/core';
import { config } from '../servicios.config';
import { CRUDService } from './crud.service';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { DecimalPipe } from '@angular/common';
import { custom } from 'devextreme/ui/dialog';
import { FormGroup } from '@angular/forms';

declare var $;

@Injectable({
  providedIn: 'root',
})
export class ComunService {
  public Urlbase = config.confProducto.dominio;
  public Urlbase2 = config.portalCliente.dominio;
  private static tipos: any[] = [{ id: 'C', valor: 10, digito3: 5 }, { id: 'R', valor: 13, digito3: 5 },
  { id: 'RP', valor: 13, digito3: 6 }, { id: 'RX', valor: 13, digito3: 9 }];
  private tildes = {
    'Á': '&#193;',
    'É': '&#201;',
    'Í': '&#205;',
    'Ó': '&#211;',
    'Ú': '&#218;',
    'Ü': '&#220;',
    'ü': '&#252;',
    'á': '&#225;',
    'é': '&#233;',
    'í': '&#237;',
    'ó': '&#243;',
    'ú': '&#250;',
    'ñ': '&#241;',
    'Ñ': '&#209;'
  };
  constructor(private dialog: MatDialog, private crud: CRUDService, private decPipe: DecimalPipe) { }


  checkIdentificacion(id: string) {
    const pattern = /^[0-9a-zA-Z]{13,14}$/i;
    return pattern.test(id);
  }

  public obtenerProductosCliente(identificacion: string) {
    return new Observable(observer => {
      this.crud.obtener(`${this.Urlbase}${config.confProducto.producto.cliente}${identificacion}`)
        .subscribe((data: any) => {
          observer.next(data);
        });
    });
  }

  public obtenerDetallesProductoCliente(identificacion: string, codigoProducto: string) {
    return new Observable(observer => {
      this.crud.obtener(`${this.Urlbase2}${config.portalCliente.producto.detalle}${identificacion}${config.portalCliente.producto.codigo}${codigoProducto}`)
        .subscribe((data: any) => {
          observer.next(data);
        });
    });
  }

  confirmDialogDevExtreme(mensaje) {
    return custom({
      showTitle: false,
      messageHtml: mensaje,
      buttons: [{
        text: "SI",
        onClick: (e) => {
          return true;
        }
      },
      {
        text: "NO",
        onClick: (e) => {
          return false;
        }
      }
      ]
    });
  }

  public confirmDialog(titulo, mensaje, confirmar = false) {
    return new Observable(observer => {
      const dialogData = new ConfirmDialogModel(titulo, mensaje, confirmar);


      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: "100%",
        data: dialogData,
        disableClose: true,
        autoFocus: true
      });
      //dialogRef.updateSize('60%', '');
      dialogRef.afterClosed().subscribe(dialogResult => {
        observer.next(dialogResult);
      });
    });
  }

  getCliente(identificacion) {
    return new Observable(observer => {
      this.crud.obtener(`${this.Urlbase}${config.confProducto.cliente.base}${identificacion}`).subscribe(cliente => {
        observer.next(cliente);
        observer.complete();
      });
    });
  }

  letrasNum(event) {
    if ((event.keyCode >= 48 && event.keyCode <= 58) ||
      (event.keyCode >= 65 && event.keyCode <= 90) ||
      (event.keyCode >= 97 && event.keyCode <= 122) ||
      (event.keyCode === 241 || event.keyCode === 209 || event.keyCode === 32)) {
      return true;
    }
    return false;
  }

  validarEntrada(event) {
    if ((event.keyCode >= 48 && event.keyCode <= 58) ||
      (event.keyCode >= 65 && event.keyCode <= 90) ||
      (event.keyCode >= 97 && event.keyCode <= 122) ||
      (event.keyCode == 241 || event.keyCode == 209 || event.keyCode == 32)) {
      return true;
    }
    return false;
  }

  isNumberKey(evt) {
    var e = evt || window.event;
    var charCode = e.which || e.keyCode;
    if (charCode > 31 && (charCode < 47 || charCode > 57))
      return false;
    if (e.shiftKey) return false;
    return true;
  }

  isDecimalKey(evt) {
    var e = evt || window.event;
    var charCode = e.which || e.keyCode;
    if (charCode > 31 && ((charCode != 46 && charCode < 47) || (charCode > 57 && charCode != 190 && charCode != 110)))
      return false;
    if (e.shiftKey) return false;
    return true;
  }

  noEspacio(evt) {
    var e = evt || window.event;
    var charCode = e.which || e.keyCode;
    if (charCode === 32)
      return false;
    if (e.shiftKey) return false;
    return true;
  }

  depurarIdentificacion(identificacionOriginal) {
    var identificacionDepurada = identificacionOriginal;
    if (identificacionOriginal.length == 14) {
      var inicio = identificacionDepurada.length - 13;
      identificacionDepurada = identificacionDepurada.substring(inicio);
      var caracteresIniciales = identificacionDepurada.substring(0, 3);
      if (caracteresIniciales == "000") {
        identificacionDepurada = identificacionDepurada.substring(3);
      }
    }
    if (identificacionOriginal.length == 13) {
      var caracteresIniciales = identificacionDepurada.substring(0, 3);
      if (caracteresIniciales == "000") {
        identificacionDepurada = identificacionDepurada.substring(3);
      }

    }
    return identificacionDepurada;
  }

  isBlank(str) {
    return (!str || /^\s*$/.test(str));
  }

  isEmptyObject(obj) {
    return (obj && (Object.keys(obj).length === 0));
  }

  isEmpty(str) {
    return (!str || 0 === str.length);
  }

  fechaIsoADate(fechaIso: Date) {
    return fechaIso ? moment(fechaIso).format("YYYY-MM-DD") : "";
  }

  fechaIsoADatetime(fechaIso: Date) {
    return fechaIso ? moment(fechaIso).format("YYYY-MM-DD HH:mm") : "";
  }

  public convertirStringADatetime(fecha: string) {
    if (fecha) {
      return moment(fecha, 'YYYY-MM-DD HH:mm').toDate();
    }
    return;
  }

  public convertirStringADate(fecha: string) {
    if (fecha) {
      return moment(fecha, 'YYYY-MM-DD').toDate();
    }
    return;
  }

  openClose(modalID, accion) {
    $('#' + modalID).modal(accion);
  }

  public static verificarTipoRuc(ruc, esEmpresa) {
    if (!ruc) return;
    ruc = ruc.replace(/ /g, "");
    let tercerDigito: number = ruc.substr(2, 1);
    if (tercerDigito < 6 && !esEmpresa)
      return this.validarCedulaRucNatural(ruc, 'R')
    if (tercerDigito == 6 && esEmpresa)
      return this.validarRucPrivadoPublico(ruc, 'RP')
    if (tercerDigito == 9 && esEmpresa)
      return this.validarRucPrivadoPublico(ruc, 'RX');
  }

  // tslint:disable-next-line: member-ordering
  public static validarCedulaRucNatural(ruc, tipo) {
    let tmpTipo = this.tipos.find(item => item.id === tipo);
    ruc = String(ruc);
    if (!ruc) return;
    if (this.contarRepetidos(ruc, "0") > 6) return false;
    ruc = ruc.replace(/ /g, "");
    if (ruc.length === tmpTipo.valor) {
      if (ruc.substring(0, 2) < 0 || ruc.substring(0, 2) > 24)
        return false;
      if (ruc.substr(2, 1) > tmpTipo.digito3) {
        return false;
      }
      if (tipo === 'C') {
        return this.validarNatural(ruc);
      } else {
        if (ruc.substr(10, 3) < 1) {
          return false;
        }
        return this.validarNatural(ruc);
      }
    }
  }

  private static validarNatural(ruc) {
    let coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    let digitos = ruc.substring(0, 9);
    let digitosIniciales = digitos.split('', 9);
    let digitoVerificador = +ruc[9];
    let total = 0;
    digitosIniciales.forEach((digito, i) => {
      let valorPosicion = +digito * coeficientes[i];
      valorPosicion = valorPosicion > 9 ? valorPosicion - 9 : valorPosicion;
      total = total + valorPosicion;
    });
    let residuo = total % 10;
    let resultado;
    if (residuo == 0)
      resultado = 0;
    else
      resultado = 10 - residuo;

    if (resultado != digitoVerificador) {
      return false;
    }
    return true;
  }

  public static validarRucPrivadoPublico(ruc, tipo) {
    let tmpTipo = this.tipos.find(item => item.id === tipo);
    ruc = String(ruc);
    if (ruc.length == tmpTipo.valor) {
      if (ruc.substring(0, 2) < 0 || ruc.substring(0, 2) > 24)
        return false;
      if (ruc.substr(2, 1) > tmpTipo.digito3) {
        return false;
      }
      if (tipo === 'RP') {
        if (ruc.substr(9, 4) < 1) {
          return false;
        }
        let coeficientes = [3, 2, 7, 6, 5, 4, 3, 2];
        return this.validarJuridico(ruc, coeficientes, 8);
      } else {
        if (ruc.substr(10, 3) < 1) {
          return false;
        }
        let coeficientes = [4, 3, 2, 7, 6, 5, 4, 3, 2];
        return this.validarJuridico(ruc, coeficientes, 9);
      }
    }
  }

  private static validarJuridico(ruc, coeficientes, numValid: number) {
    let digitos = ruc.substring(0, numValid);
    let digitosIniciales = digitos.split('', numValid);
    let digitoVerificador = +ruc[numValid];
    let total = 0;
    digitosIniciales.forEach((digito, i) => {
      let valorPosicion = +digito * coeficientes[i];
      total = total + valorPosicion;
    });
    let residuo = total % 11;
    let resultado;
    if (residuo == 0)
      resultado = 0;
    else
      resultado = 11 - residuo;

    if (resultado != digitoVerificador) {
      return false;
    }
    return true;
  }

  capitalize(object) {
    for (let key in object) {
      let value = object[key];
      let newValue = value;
      if (typeof value != "object") {
        if (typeof value == "string") {
          newValue = value.toUpperCase();
        }
      } else {
        newValue = this.capitalize(value);
      }
      object[key] = newValue;
    }
    return object;
  }

  makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 3; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

  noVacios(data) {
    let contar = 0;
    let y: string;
    for (let x in data) {
      if (Object.prototype.hasOwnProperty.call(data, x)) {
        y = data[x];
        if (y === "null" || y === null || y === "" || typeof y === "undefined") {
          contar++;
          break;
        }
      }
    }
    return contar == 0 ? true : false;
  }

  obtenerRegistroUnicos(arr: any, comp: any) {
    const unique = arr
      .map(e => e[comp])
      .map((e, i, final) => final.indexOf(e) === i && i)
      .filter(e => arr[e]).map(e => arr[e]);
    return unique;
  }

  decimalPipe(numero, pipe) {
    return this.decPipe.transform(numero, pipe);
  }

  opcionSelectBox(campo, valor = '100%') {
    return {
      width: valor,
      searchEnabled: true,
      placeholder: `Seleccione ${campo}`,
      showClearButton: true,
    };
  }

  private static contarRepetidos(str, letter) {
    let letterCount = 0;
    for (let position = 0; position < str.length; position++) {
      if (str.charAt(position) === letter) {
        letterCount += 1;
      }
    }
    return letterCount;
  }

  isFieldValid(form: FormGroup, field: string, submit: boolean) {
    return (submit && form.controls[field].invalid || (form.controls[field].invalid && form.controls[field].dirty) ||
      ((form.controls[field].invalid && form.controls[field].pristine) && (!this.isEmpty(form.controls[field].value))));
  }

  fieldCss(form: FormGroup, field: string, submit: boolean) {
    return {
      'is-valid': (submit && form.controls[field].valid) || (form.controls[field].valid && form.controls[field].dirty),
      'is-invalid': (submit && form.controls[field].invalid) || (form.controls[field].invalid && form.controls[field].dirty) || ((form.controls[field].invalid && form.controls[field].pristine) && (!this.isEmpty(form.controls[field].value)))
    };
  }

  convertirHoraMin(data: number): string {
    let minutos = data % 60;
    let horas = (data - minutos) / 60;
    return `${horas > 9 ? horas : '0' + horas} : ${minutos > 9 ? minutos : '0' + minutos} min`;
  }

  minutosAdias(data: number) {
    let minutos = data % 60;
    let htmp = (data - minutos) / 60;
    let horas = htmp % 8;
    let dias = (htmp - horas) / 8;
    return [dias, horas, minutos];
  }

  verificationCode() {
    var text = "";
    var possible = "0123456789";
    for (var i = 0; i < 4; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

  tildesAHtmlCode(texto: string) {
    return texto.replace(/Á|É|Í|Ó|Ú|Ü|ü|á|é|í|ó|ú|ñ|Ñ/gi, (x) => {
      return this.tildes[x];
    });
  }
}

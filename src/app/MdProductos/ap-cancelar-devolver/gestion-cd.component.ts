import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CRUDService, ComunService } from 'src/app/shared/services';
import { config } from 'src/app/shared/servicios.config';

@Component({
  selector: 'app-gestion-cd',
  templateUrl: './gestion-cd.component.html',
  styleUrls: ['./gestion-cd.component.scss']
})
export class GestionCDComponent implements OnInit {

  subscription: Subscription = new Subscription();
  url = config.sigsIntg.dominio;
  zohomjs: string;
  cargando: boolean;
  cancelacioZoho: any;

  zohoData: any[];

  constructor(private aroute: ActivatedRoute, private crud: CRUDService, private comun: ComunService) { }

  ngOnInit() {
    this.cancelacioZoho = {
      Identificacion: '',
      IdCancelacion: '',
      TipoCancelacion: '',
      Usuario: ''
    };
    this.recibirParametro();
  }

  recibirParametro() {
    this.subscription.add(
      this.aroute.params.subscribe(param => {
        this.zohoData = new Array<any>();
        // zohoParams --> Identificacion|IdCancelacionCRM|TipoCancelacion|Usuario
        if (param.parametros) {
          this.cargando = true;
          this.zohoData = this.convertirParametro(param.parametros);
          if (this.zohoData.length > 0 && this.zohoData.length === 4) {
            this.cancelacioZoho = this.updateObj(this.cancelacioZoho, this.zohoData);
            this.gestionCancelacionDevolucion(this.cancelacioZoho);
          }
        }
      }));
  }

  gestionCancelacionDevolucion(obj) {
    this.subscription.add(
      this.crud.postFormData(`${this.url}${config.sigsIntg.cancelacion.gestionDC}`, obj).subscribe(response => {

        if (typeof response !== 'undefined') {
          if (response === 1) {
            this.zohomjs = "SI";
          } else {
            this.popupCancel();
          }
        } else {
          this.popupCancel();
        }
        this.cargando = false;
      }, error => {
        this.popupCancel();
        this.cargando = false;
      }));
  }


  popupCancel() {
    this.subscription.add(
      this.comun.confirmDialog("Algo salió mal", `Cierre la ventana e intente nuevamente.`, true).subscribe(valido => {
        if (valido) {
          this.salir();
        } else {
          this.salir();
        }
      }));
  }

  salir() {
    this.cancelacioZoho = {
      Identificacion: '',
      IdCancelacion: '',
      TipoCancelacion: '',
      Usuario: ''
    };
    window.close();
  }

  convertirParametro(zohoParams: string) {
    return zohoParams.split('|');
  }

  updateObj(object, arreglo) {
    let i = 0;
    Object.entries(object).forEach(
      ([key, value]) => {
        object[key] = arreglo[i];
        i++;
      }
    );
    return object;
  }

}

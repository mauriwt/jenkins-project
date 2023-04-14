import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CRUDService, ComunService } from 'src/app/shared/services';
import { config } from 'src/app/shared/servicios.config';

@Component({
  selector: 'app-cancelarzoho',
  templateUrl: './cancelarzoho.component.html',
  styleUrls: ['./cancelarzoho.component.scss']
})
export class CancelarzohoComponent implements OnInit {

  subscription: Subscription = new Subscription();
  url = config.sigsIntg.dominio;
  zohomjs: string;
  cargando: boolean;
  cancelacioZoho: any;

  zohoData: any[];

  constructor(private aroute: ActivatedRoute, private crud: CRUDService, private comun: ComunService) { }

  ngOnInit() {
    this.cancelacioZoho = {
      Subclasificacion: '',
      Zdesk_contacto_id: '',
      No_ticket: '',
      Descripcion_ticket_zdesk: '',
      Clasificacion: '',
      Zdesk_empresa_id: '',
      TicketID: '',
      IdentificacionCliente: '',
      RUCEmpresa: '',
    };
    this.recibirParametro();
  }

  recibirParametro() {
    this.subscription.add(
      this.aroute.params.subscribe(param => {
        this.zohoData = new Array<any>();
        // zohoParams --> Identificacion|NumeroCancelacion|IdCrm|TipoCancelado|IdTicket
        if (param.body) {
          this.cargando = true;
          this.zohoData = this.convertirParametro(param.body);
          if (this.zohoData.length > 0 && this.zohoData.length === 9) {
            this.cancelacioZoho = this.updateObj(this.cancelacioZoho, this.zohoData);
            this.crearCancelacionZoho(this.cancelacioZoho);
          }
        }
      }));
  }

  crearCancelacionZoho(obj) {
    this.subscription.add(
      this.crud.post(`${this.url}${config.sigsIntg.cancelacion.crearCancelacion}`, obj).subscribe(response => {
        if (typeof response !== 'undefined') {
          if (response.code === config.zohoSuccess) {
            this.zohomjs = response.code;
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
      Subclasificacion: '',
      Zdesk_contacto_id: '',
      No_ticket: '',
      Descripcion_ticket_zdesk: '',
      Clasificacion: '',
      Zdesk_empresa_id: '',
      TicketID: '',
      IdentificacionCliente: '',
      RUCEmpresa: '',
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

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComunService } from 'src/app/shared/services';
import { Subscription } from 'rxjs';
import { Documento } from '../../models';

@Component({
  selector: 'doc-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.scss']
})
export class SolicitudComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();
  public desdeProveedor: any;
  public deAqui: string =  Documento.getCodigoDetalleCatalogo()[2];
  public cargando: boolean;

  constructor(private aroute: ActivatedRoute, private comun: ComunService, private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    }
  }


  ngOnInit() {
    this.desdeProveedor = {};
    this.cargando = true;
    this.recibirParametro();
  }

  recibirParametro() {
    this.subscription.add(
      this.aroute.params.subscribe(param => {
        if (param.numeroCertificado && param.identificacion && param.nombres) {
         this.desdeProveedor = {IdVentaPGS: param.numeroCertificado, identificacion: param.identificacion, nombres: param.nombres};
        }
      }));
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}

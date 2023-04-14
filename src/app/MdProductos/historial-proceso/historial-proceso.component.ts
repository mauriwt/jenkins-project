import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { config } from 'src/app/shared/servicios.config';
import { CRUDService, AlertifyService, ComunService } from 'src/app/shared/services';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-historial-proceso',
  templateUrl: './historial-proceso.component.html',
  styleUrls: ['./historial-proceso.component.scss']
})
export class HistorialProcesoComponent implements OnInit {

  private subscription: Subscription = new Subscription();

  cargando = false;
  opcionFiltro = "auto";
  @ViewChild('grid') grid: DxDataGridComponent;
  private url = config.sigsIntg.dominio;
  private tokenSigs: string;
  dataSource: any;
  fechaOptions: any;
  min: Date = new Date(1900, 0, 1);
  listaServicios: any[];
  codigoServicio: string;

  constructor(private comun: ComunService, private crud: CRUDService, private notifi: AlertifyService, private aroute: ActivatedRoute, private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
  }

  ngOnInit() {
    this.fechaOptions = {
      width: '100%',
      showClearButton: true,
      placeholder: 'dd/mm/aaaa',
      useMaskBehavior: true,
      displayFormat: 'dd/MM/yyyy',
      min: this.min,
      max: new Date()
    };
    this.listaServicios = [
      { nombre: "Banco Pichincha", valor: "DEVBP" },
      { nombre: "Banco de Loja", valor: "DEVBDL" },
      { nombre: "Banco General Rumiñahui", valor: "DEVBGR" }
    ];
  }


  obtenerHistorialProcesos(token) {
    this.cargando = true;
    this.subscription.add(
      this.crud.obtener(`${this.url}${config.sigsIntg.cancelacion.historialproceso}${token}`).subscribe((response: any) => {
        this.dataSource = response;
        if (response.length === 0) {
          this.notifi.openSnackBar("No hubo resultados", "vacío");
        }
        this.cargando = false;
      }, error => { this.cargando = false; }));
  }

  obtenerHistorialProcesosBGRLoja(codigoServicio) {
    this.cargando = true;
    this.subscription.add(
      this.crud.obtener(`${this.url}${config.sigsIntg.cancelacion.historialprocesoBGRLoja}${codigoServicio}`).subscribe((response: any) => {
        this.dataSource = response;
        if (response.length === 0) {
          this.notifi.openSnackBar("No hubo resultados", "vacío");
        }
        this.cargando = false;
      }, error => { this.cargando = false; }));
  }

  recibirParametro() {
    this.subscription.add(
      this.aroute.params.subscribe(param => {
        if (param.token) {
          this.tokenSigs = param.token;
          this.obtenerHistorialProcesos(param.token);
        }
      }));
  }

  procesoArchivoRespuesta() {
    this.cargando = true;
    if (this.codigoServicio == this.listaServicios[0].value) {
      this.procesoArchivoRespuestaBP();
    } else {
      this.procesoArchivoRespuestaBGRLoja();
    }
  }

  respuestaProceso(obj) {
    if (!this.comun.isEmptyObject(obj)) {
      switch (obj.Estado) {
        case "ok":
          this.notifi.openSnackBar("El proceso finalizó correctamente", "aviso");
          break;
        case "Ok":
          this.notifi.openSnackBar(obj.Mensaje, "vacío");
          break;
        case "Error":
          this.notifi.openSnackBar(obj.Mensaje, obj.Estado);
          break;
        default:
          this.notifi.openSnackBar("Fallo el procesamiento", "Error");
          break;
      }
    }
  }

  checkFiltrarServicio(servicioSeleccionado) {
    this.codigoServicio = servicioSeleccionado;
    if (servicioSeleccionado == this.listaServicios[0].value) {
      this.recibirParametro();
    } else {
      this.obtenerHistorialProcesosBGRLoja(servicioSeleccionado);
    }
  }

  procesoArchivoRespuestaBP() {
    this.subscription.add(
      this.crud.obtener(`${this.url}${config.sigsIntg.cancelacion.procesoRespuesta}${this.tokenSigs}`).subscribe((response: any) => {
        this.respuestaProceso(response);
        this.obtenerHistorialProcesos(this.tokenSigs);
      }, error => { this.cargando = false; }));
  }

  procesoArchivoRespuestaBGRLoja() {
    this.subscription.add(
      this.crud.obtener(`${this.url}${config.sigsIntg.cancelacion.procesoRespuestaBGRLoja}${this.codigoServicio}`).subscribe((response: any) => {
        this.respuestaProceso(response);
        this.obtenerHistorialProcesosBGRLoja(this.codigoServicio);
      }, error => { this.cargando = false; }));
  }


}

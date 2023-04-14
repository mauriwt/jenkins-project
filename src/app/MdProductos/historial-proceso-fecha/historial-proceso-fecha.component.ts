import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { Subscription, Observable, forkJoin } from 'rxjs';
import { config } from 'src/app/shared/servicios.config';
import { ComunService, CRUDService, AlertifyService } from 'src/app/shared/services';
import { ActivatedRoute, Router } from '@angular/router';

import { DateAdapter } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Base } from 'src/app/shared/AppDominio';

@Component({
  selector: 'app-historial-proceso-fecha',
  templateUrl: './historial-proceso-fecha.component.html',
  styleUrls: ['./historial-proceso-fecha.component.scss']
})
export class HistorialProcesoFechaComponent implements OnInit {

  private subscription: Subscription = new Subscription();

  cargando = false;
  opcionFiltro = "auto";
  @ViewChild('grid') grid: DxDataGridComponent;
  private tokenSigs: string;
  dataSource: any;
  historialprocesos: any[];
  estadoProcesoIntegracion: any[];
  estadoServicioIntegracion: any[];
  paramfecha: string;
  fechaOptions: any;

  maxDate: Date;
  minDate: Date;

  constructor(private adapter: DateAdapter<any>, private comun: ComunService, private crud: CRUDService, private notifi: AlertifyService, private aroute: ActivatedRoute, private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
    this.adapter.setLocale('es');
  }

  ngOnInit() {
    this.minDate = new Date(1800, 0, 1);
    this.maxDate = new Date();
    this.historialprocesos = new Array<any>();
    this.estadoProcesoIntegracion = new Array<any>();
    this.estadoServicioIntegracion = new Array<any>();
    this.recibirParametro();
    this.obtenerEstadosProcesoServicioIntegracion();
    this.fechaOptions = {
      width: '100%',
      showClearButton: true,
      placeholder: 'dd/mm/aaaa',
      useMaskBehavior: true,
      displayFormat: 'dd/MM/yyyy',
      min: this.minDate,
      max: new Date()
    };
  }

  cambiarFeha(e) {
    this.dataSource = [];
    if (e.value) {
      this.paramfecha = this.comun.fechaIsoADate(new Date(`${e.value}`));
      this.obtenerHistorialProcesosPorFecha(this.paramfecha);
    }
  }

  addEvent(event: MatDatepickerInputEvent<Date>) {
    this.dataSource = [];
    if (event.value) {
      this.paramfecha = this.comun.fechaIsoADate(new Date(`${event.value}`));
      this.obtenerHistorialProcesosPorFecha(this.paramfecha);
    }

  }

  obtenerHistorialProcesosPorFecha(fecha) {
    this.cargando = true;
    this.subscription.add(
      this.crud.obtener(`${Base.integracionRest}${config.sigsIntg.cancelacion.historialprocesoFecha}${this.tokenSigs}&Fecha=${fecha}`).subscribe((response: any) => {
        this.dataSource = response;
        if (response.length === 0) {
          this.notifi.openSnackBar("No hubo resultados", "vacío");
        }
        this.cargando = false;
      }, error => { this.cargando = false; }));
  }

  obtenerHistorialProcesosPorCodigoLote(codigoLote) {
    this.cargando = true;
    this.subscription.add(
      this.crud.obtener(`${Base.integracionRest}${config.sigsIntg.cancelacion.historialprocesoCodigoLote}${this.tokenSigs}&CodigoLote=${codigoLote}`).subscribe((response: any) => {
        this.historialprocesos = response;
        if (response.length === 0) {
          this.notifi.openSnackBar("No hubo resultados", "vacío");
        }
        this.cargando = false;
      }, error => { this.cargando = false; }));
  }

  obtenerEstadosProcesoServicioIntegracion() {
    this.cargando = true;
    this.subscription.add(
      this.obtenerEstados().subscribe(catalogos => {
        this.estadoProcesoIntegracion = catalogos[0];
        this.estadoServicioIntegracion = catalogos[1];
        this.cargando = false;
      }, error => {
        this.notifi.error("No hay respuesta del servidor.<br> Vuelva a intentar más tarde.");
        this.cargando = false;
      }));
  }

  obtenerEstados(): Observable<any> {
    const estadoProceso = this.crud.obtener(`${Base.integracionRest}${config.sigsIntg.catalogo.estadoProcesoIntegracion}`);
    const estadoServicio = this.crud.obtener(`${Base.integracionRest}${config.sigsIntg.catalogo.estadoServicioIntegracion}`);
    return forkJoin([estadoProceso, estadoServicio]);
  }


  recibirParametro() {
    this.subscription.add(
      this.aroute.params.subscribe(param => {
        if (param.token) {
          this.tokenSigs = param.token;
        }
      }));
  }

  contentReady(e) {
    if (!e.component.getSelectedRowKeys().length) {
      e.component.selectRowsByIndexes(0);
    }
  }

  selectionChanged(e) {
    e.component.collapseAll(-1);
    e.component.expandRow(e.key);
    this.obtenerHistorialProcesosPorCodigoLote(e.key);
  }


}

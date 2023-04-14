import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { config } from 'src/app/shared/servicios.config';
import { Base } from 'src/app/shared/AppDominio';
import { CRUDService, AlertifyService, ComunService } from 'src/app/shared/services';
import { ActivatedRoute, Router } from '@angular/router';
import { DxDataGridComponent, DxSelectBoxComponent, DxFormComponent } from 'devextreme-angular';
import { Subscription, Observable, forkJoin } from 'rxjs';
import { Emision, DevolucionEnvio } from 'src/app/models/filtro-tabla-dinamica';

@Component({
  selector: 'app-proceso-servicio',
  templateUrl: './proceso-servicio.component.html',
  styleUrls: ['./proceso-servicio.component.scss']
})
export class ProcesoServicioComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();

  @ViewChild('grid') grid: DxDataGridComponent;
  @ViewChild('domservicios') domservicios: DxSelectBoxComponent;
  @ViewChild(DxFormComponent) form: DxFormComponent;

  listaDimanica: any[];

  private tokenSigs: string;

  procesos: any[];
  estadoProcesoIntegracion: any[];
  estadoServicioIntegracion: any[];
  servicios: any[];
  procesosIntegracion: any;
  servicioIntegracion: any;

  private paramServicios: any;
  private paramPIntegracion: any;
  private paramSIntegracion: any;
  private IdServicioTmp: any;
  public objProceso: any;
  public objServicio: any;
  filtroEmision: Emision;
  filtroDevolucionEnvio: DevolucionEnvio;
  isPopupVisible: boolean;
  isPopupVisibleDev: boolean;

  cargando = false;
  cargandosi = false;
  opcionFiltro = "auto";

  searchModeOption = "contains";
  searchExprOption = "Descripcion";
  searchServ = "Nombre";

  searchTimeoutOption = 200;
  minSearchLengthOption = 0;
  buttonOptions: any;
  fechaOptions: any;
  min: Date = new Date(1900, 0, 1);

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
    this.buttonOptions = {
      type: "default",
      stylingMode: "outlined",
      text: 'Buscar',
      elementAttr: { id: 'btnBuscar', class: 'botonFiltroDevExtreme' },
      useSubmitBehavior: true
    };
    this.objProceso = {};
    this.objServicio = {};
    this.listaDimanica = new Array<any>();
    this.estadoProcesoIntegracion = new Array<any>();
    this.estadoServicioIntegracion = new Array<any>();
    this.procesos = new Array<any>();
    this.servicios = new Array<any>();
    this.paramServicios = {};
    this.paramPIntegracion = {};
    this.paramSIntegracion = {};
    this.recibirParametro();
    this.obtenerEstadosProcesoServicioIntegracion();
  }

  consultarEmision = (e) => {
    this.cargando = true;
    const params = { token: this.tokenSigs, idProceso: this.objProceso.Codigo, idServicioIntegracion: this.IdServicioTmp, Filtro: JSON.stringify(this.filtroEmision) };
    this.peticionTablaDinamica(params);
    e.preventDefault();
  }

  consultarDevEnvio = (e) => {
    this.cargando = true;
    const params = { token: this.tokenSigs, idProceso: this.objProceso.Codigo, idServicioIntegracion: this.IdServicioTmp, Filtro: JSON.stringify(this.filtroDevolucionEnvio) };
    this.peticionTablaDinamica(params);
    e.preventDefault();
  }

  peticionTablaDinamica(obj) {
    this.subscription.add(
      this.crud.postFormData(`${Base.integracionRest}${config.sigsIntg.cancelacion.tablaDinamica}`, obj).subscribe((response: any) => {
        this.listaDimanica = new Array<any>();
        this.listaDimanica = response;
        if (response.length === 0) {
          this.notifi.openSnackBar("No hubo resultados", "vacío");
        }
        this.cargando = false;
      }, error => {
        this.cargando = false;
        this.notifi.openSnackBar("No hubo resultados", "Error de respueta");
      }));
  }

  getIdServicioIntegracion(idServicioI) {
    this.IdServicioTmp = idServicioI;
    this.grid.instance.repaint();
    this.listaDimanica = new Array<any>();
    switch (this.objProceso.CodigoProceso) {
      case 'DEV':
        this.filtroDevolucionEnvio = new DevolucionEnvio();
        this.comun.openClose('mdDevolucion', 'show');
        break;
      case 'SOLEMI':
        this.filtroEmision = new Emision();
        this.comun.openClose('mdEmision', 'show');
        break;
      default:
        break;
    }
  }

  cerrarModal(modalID) {
    this.filtroDevolucionEnvio = new DevolucionEnvio();
    this.filtroEmision = new Emision();
    this.comun.openClose(modalID, 'hide');
  }

  getProcesoServicioByProceso(idProceso) {
    this.crud.obtener(`${Base.integracionRest}${config.sigsIntg.cancelacion.procesoIntegracionByProceso}${idProceso}`).subscribe((response: any) => {
      this.procesosIntegracion = response;
    });
  }

  open(modalID) {
    this.comun.openClose(modalID, 'show');
  }

  close(modalID) {
    this.comun.openClose(modalID, 'hide');
  }

  obtenerProcesos(token) {
    this.cargando = true;
    this.subscription.add(
      this.crud.obtener(`${Base.integracionRest}${config.sigsIntg.cancelacion.procesos}${token}`).subscribe((response: any) => {
        this.procesos = response;
        if (response.length === 0) {
          this.notifi.openSnackBar("No hubo resultados", "vacío");
        }
        this.cargando = false;
      }, error => { this.cargando = false; }));
  }

  contentReady(e) {
    if (!e.component.getSelectedRowKeys().length) {
      e.component.selectRowsByIndexes(0);
    }
  }

  selectionChanged(e) {
    e.component.collapseAll(-1);
    e.component.expandRow(e.key);
    this.getServicioIntegracion(e.key);
  }



  getServicioIntegracion(idProcesoIntegracion) {
    if (idProcesoIntegracion !== null) {
      this.paramSIntegracion.token = this.tokenSigs;
      this.paramSIntegracion.idProcesoIntegracion = idProcesoIntegracion;
      this.paramSIntegracion.idServicio = this.comun.isEmpty(this.paramPIntegracion.idServicio) ? 0 : this.paramPIntegracion.idServicio;
      this.cargandosi = true;
      this.subscription.add(
        this.crud.postFormData(`${Base.integracionRest}${config.sigsIntg.cancelacion.servicioIntegracion}`, this.paramSIntegracion).subscribe((response: any) => {
          this.servicioIntegracion = response;
          if (response.length === 0) {
            this.notifi.openSnackBar("No hubo resultados", "vacío");
          }
          this.cargandosi = false;
        }, error => { this.cargandosi = false; this.objServicio = {}; }));
    }
  }

  obtenerServicios(proceso: any) {
    this.servicios = new Array<any>();
    this.domservicios.instance.reset();
    if (proceso !== null) {
      this.objProceso = proceso;
      this.paramServicios.token = this.tokenSigs;
      this.paramServicios.idProceso = proceso.Codigo;
      this.cargando = true;
      this.subscription.add(
        this.getListaByIdProceso(this.paramServicios).subscribe(response => {
          this.servicios = response[0];
          this.procesosIntegracion = response[1];
          this.cargando = false;
        }, error => { this.cargandosi = false; this.objProceso = {}; }));
    }
  }

  obtenerProcesosIntegracion(servicio: any) {
    this.procesosIntegracion = new Array<any>();
    this.servicioIntegracion = new Array<any>();
    this.grid.instance.state({});
    this.grid.instance.collapseAll(-1);
    if (servicio !== null) {
      this.grid.instance.clearFilter("row");
      this.objServicio = servicio;
      this.paramPIntegracion.token = this.tokenSigs;
      this.paramPIntegracion.idProceso = this.paramServicios.idProceso;
      this.paramPIntegracion.idServicio = servicio.Codigo;
      this.cargando = true;
      this.subscription.add(
        this.crud.postFormData(`${Base.integracionRest}${config.sigsIntg.cancelacion.procesoIntegracion}`, this.paramPIntegracion).subscribe((response: any) => {
          this.procesosIntegracion = response;
          if (response.length === 0) {
            this.notifi.openSnackBar("No hubo resultados", "vacío");
          }
          this.cargando = false;
        }, error => { this.cargando = false; this.objServicio = {}; }));
    } else {
      this.objServicio = {};
      this.paramPIntegracion = {};
      this.obtenerServicios(this.objProceso);
    }
  }

  getNombreProceso(idProceso) {
    const data = this.procesos.find(p => p.Codigo === idProceso);
    return data ? data.Nombre : "Desconocido";
  }

  getNombreServicio(idServicio) {
    const data = this.servicios.find(p => p.Codigo === idServicio);
    return data ? data.Nombre : "Desconocido";
  }

  getEstadoServicio(estado) {
    const data = this.estadoServicioIntegracion.find(p => p.Codigo === estado);
    return data ? data.Nombre : "Desconocido";
  }

  recibirParametro() {
    this.subscription.add(
      this.aroute.params.subscribe(param => {
        if (param.token) {
          this.tokenSigs = param.token;
          this.obtenerProcesos(param.token);
        }
      }));
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

  getListaByIdProceso(proceso): Observable<any> {
    const servicios = this.crud.postFormData(`${Base.integracionRest}${config.sigsIntg.cancelacion.servicios}`, proceso);
    const procesos = this.crud.obtener(`${Base.integracionRest}${config.sigsIntg.cancelacion.procesoIntegracionByProceso}${proceso.idProceso}`);
    return forkJoin([servicios, procesos]);
  }


  obtenerEstados(): Observable<any> {
    const estadoProceso = this.crud.obtener(`${Base.integracionRest}${config.sigsIntg.catalogo.estadoProcesoIntegracion}`);
    const estadoServicio = this.crud.obtener(`${Base.integracionRest}${config.sigsIntg.catalogo.estadoServicioIntegracion}`);
    return forkJoin([estadoProceso, estadoServicio]);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}

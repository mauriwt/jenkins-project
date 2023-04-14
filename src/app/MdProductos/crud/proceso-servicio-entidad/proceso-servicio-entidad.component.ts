import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { DxDataGridComponent, DxPopupComponent } from 'devextreme-angular';

import { ExpRegular } from 'src/app/models/regex';
import { config } from 'src/app/shared/servicios.config';
import { Base } from 'src/app/shared/AppDominio';
import { CRUDService, FormService, ComunService, AlertifyService } from 'src/app/shared/services';
import { ProcesoServicioEntidad, ClaveValor, Constantes, } from 'src/app/models';
import { Observable, forkJoin, Subscription } from 'rxjs';
import CustomStore from 'devextreme/data/custom_store';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-proceso-servicio-entidad',
  templateUrl: './proceso-servicio-entidad.component.html',
  styleUrls: ['./proceso-servicio-entidad.component.scss']
})
export class ProcesoServicioEntidadComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('gridProcesoServicio') gridProcesoServicio: DxDataGridComponent;

  private subscription: Subscription = new Subscription();

  frmPSE: FormGroup;
  submitted: boolean;
  cargando: boolean;
  public formErrors = ProcesoServicioEntidad.fieldEmpty();

  searchModeOption = "contains";
  searchExprOption: any = "Nombre";
  searchTimeoutOption = 200;
  minSearchLengthOption = 0;

  procesoServicioEntidad: ProcesoServicioEntidad;
  procesoServicioEntidadTmp: ProcesoServicioEntidad;
  catalogoServicio: any;
  catalogoProceso: any[];
  catalogoEntidad: any;
  dataSource: any;
  masterDetailDataSource: any;
  urlt: string;
  letras = ExpRegular.letras;
  alfNumerico = ExpRegular.alfNumerico;
  ruta = ExpRegular.ruta;
  selectBoxProcesoOpcion: any;
  selectBoxServicioOpcion: any;
  selectBoxEntidadOpcion: any;
  isPopupVisible = false;
  tokenSigs: string;
  selectBoxOptions: any;
  addButtonOptions: any;

  titulo: string;

  constructor(private aroute: ActivatedRoute, private router: Router, private alert: AlertifyService, private crud: CRUDService, private frmService: FormService, private comun: ComunService) {
  }

  ngOnInit() {
    this.catalogoProceso = new Array<any>();
    this.procesoServicioEntidad = new ProcesoServicioEntidad();
    this.procesoServicioEntidadTmp = new ProcesoServicioEntidad();
    this.crudProceso();
    this.recibirParametro();
    this.addButtonOptions = {
      type: "default",
      stylingMode: "outlined",
      text: 'Nuevo Registro',
      onClick: this.iniciarNuevo.bind(this)
    };
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

  obtenerServioPorIdProceso(e) {
    this.titulo = "Editar Registro";
    this.getCatalosHijos(e.data.IdProceso);
    this.iniciarEdicion(e.data);
  }

  getServioPorIdProceso(proceso) {
    const params = {
      token: "1244",
      idProceso: proceso
    };
    this.crud.postFormData(`${Base.integracionRest}${config.sigsIntg.cancelacion.serviciosByTipoEntidad}`, params).subscribe(response => {
      this.catalogoServicio = response;
      this.selectBoxServicioOpcion = this.crearOptionServicio(response);
    });
  }

  crudProceso() {
    const api = config.sigsIntg.procesoServicio;
    const url = `${Base.integracionRest}${api.procesoServicioEntidad}`;
    this.dataSource = new CustomStore({
      key: "IdProcesoServicioEntidad",
      loadMode: "raw",
      load: () => this.crud.peticioDevExtreme(`${url}${api.lista}`)
    });
  }

  eliminarConfirm(e) {
    const dialogo = this.comun.confirmDialogDevExtreme(Constantes.mensajeEliminar);
    dialogo.show().then((dialogResult) => {
      if (dialogResult) {
        this.eliminar(e.key);
      }
    });
  }

  color(e) {
    if (e.rowType === "data") {
      switch (e.data.Activo) {
        case false:
          e.rowElement.bgColor = "#F39EA7";
          // e.rowElement.cells[this.pos].bgColor = Constantes.colorFila[1];
          break;
        default:
          break;
      }
    }
  }

  eliminar(key) {
    this.cargando = true;
    const api = config.sigsIntg.procesoServicio;
    const url = `${Base.integracionRest}${api.procesoServicioEntidad}`;
    const obj = new ClaveValor();
    obj.key = key;
    delete obj.values;
    this.crud.deleteFormData(`${url}${api.eliminar}`, obj).subscribe(response => {
      this.crudProceso();
      this.cancelar();
      response.estado === "OK" ? this.alert.message(response.mensaje) : this.alert.error("No se actualizó el registro.");
      this.cargando = false;
    }, error => {
      this.cancelar();
      this.cargando = false;
    });
  }

  iniciarEdicion(fila) {
    this.getCatalosHijos(fila.IdProceso);
    this.procesoServicioEntidad = new ProcesoServicioEntidad();
    this.procesoServicioEntidad.IdProcesoServicioEntidad = fila.IdProcesoServicioEntidad;
    this.procesoServicioEntidad.IdProceso = fila.IdProceso;
    this.procesoServicioEntidad.IdServicio = fila.IdServicio;
    this.procesoServicioEntidad.IdEntidadOrigen = fila.IdEntidadOrigen;
    this.procesoServicioEntidad.Activo = fila.Activo;
    this.procesoServicioEntidad.Orden = fila.Orden;
    this.procesoServicioEntidadTmp = Object.assign({}, this.procesoServicioEntidad);
    this.isPopupVisible = true;
  }

  iniciarNuevo() {
    this.isPopupVisible = true;
    this.titulo = "Nuevo Registro";
    this.procesoServicioEntidad = new ProcesoServicioEntidad();
    this.procesoServicioEntidad.Activo = true;
  }

  getCatalosHijos(idProceso) {
    this.catalogoServicio = new Array<any>();
    this.catalogoEntidad = new Array<any>();
    if (idProceso) {
      this.cargando = true;
      this.subscription.add(
        this.obtenerCatalogos(idProceso).subscribe(catalogos => {
          this.catalogoServicio = catalogos[0];
          this.catalogoEntidad = catalogos[1];
          this.cargando = false;
        }, error => this.cargando = false));
    }
  }

  obtenerCatalogos(proceso): Observable<any> {
    const servicios = this.crud.obtener(`${Base.integracionRest}${config.sigsIntg.catalogo.servicioByIdProceso}${proceso}`);
    const entidades = this.crud.obtener(`${Base.integracionRest}${config.sigsIntg.catalogo.entidad}${proceso}`);
    return forkJoin([servicios, entidades]);
  }

  obtenerProcesos(token) {
    this.catalogoProceso = new Array<any>();
    this.cargando = true;
    this.subscription.add(
      this.crud.obtener(`${Base.integracionRest}${config.sigsIntg.cancelacion.procesos}${token}`).subscribe((response: any) => {
        this.catalogoProceso = response;
        this.selectBoxOptions = this.crearFiltroProceso(response);
        this.cargando = false;
      }, error => this.cargando = false));
  }

  ngAfterViewInit() {
    this.gridProcesoServicio.instance.clearFilter("row");
    this.gridProcesoServicio.instance.state({});
    this.gridProcesoServicio.instance.columnOption("command:edit", "visibleIndex", 0);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  inicializarFrm() {
    this.frmPSE = this.frmService.generar(ProcesoServicioEntidad.campos());
    this.subscription.add(
      this.frmPSE.valueChanges.subscribe((data) => {
        this.formErrors = this.frmService.validateForm(this.frmPSE, this.formErrors, ProcesoServicioEntidad.getCampos(), true);
      }));
  }
  cancelar() {
    this.procesoServicioEntidad = new ProcesoServicioEntidad();
    this.procesoServicioEntidadTmp = new ProcesoServicioEntidad();
    this.isPopupVisible = false;
  }

  confirmSave() {
    const api = config.sigsIntg.procesoServicio;
    const url = `${Base.integracionRest}${api.procesoServicioEntidad}`;
    this.cargando = true;
    if (this.procesoServicioEntidad.IdProcesoServicioEntidad) {
      if (JSON.stringify(this.procesoServicioEntidadTmp) !== JSON.stringify(this.procesoServicioEntidad)) {
        const obj = new ClaveValor();
        obj.key = this.procesoServicioEntidad.IdProcesoServicioEntidad;
        delete this.procesoServicioEntidad.IdProcesoServicioEntidad;
        obj.values = JSON.stringify(this.procesoServicioEntidad);
        this.crud.putFormData(`${url}${api.editar}`, obj).subscribe(response => {
          this.crudProceso();
          this.cancelar();
          response.estado === "OK" ? this.alert.message(response.mensaje) : this.alert.error("No se actualizó el registro.");
          this.cargando = false;
        }, error => {
          this.cancelar();
          this.cargando = false;
        });
      } else {
        this.cancelar();
        this.cargando = false;
      }
    } else {
      const obj = new ClaveValor();
      delete this.procesoServicioEntidad.IdProcesoServicioEntidad;
      delete obj.key;
      obj.values = JSON.stringify(this.procesoServicioEntidad);
      this.crud.postFormData(`${url}${api.guardar}`, obj).subscribe(response => {
        this.crudProceso();
        this.cancelar();
        response.estado === "OK" ? this.alert.message(response.mensaje) : this.alert.error("No se guardó el registro.");
        this.cargando = false;
      }, error => {
        this.cargando = false;
        this.cancelar();
      });
    }
  }

  crearFiltroProceso(procesos) {
    return {
      searchEnabled: true,
      placeholder: 'Seleccione Proceso',
      showClearButton: true,
      width: 500,
      items: procesos,
      valueExpr: 'Codigo',
      displayExpr: 'Nombre',
      onValueChanged: (args) => {
        if (args.value > 0) {
          this.gridProcesoServicio.instance.filter(["IdProceso", "=", args.value]);
        } else {
          this.gridProcesoServicio.instance.clearFilter();
        }
      }
    };
  }

  crearOptionServicio(servicios) {
    return {
      items: this.catalogoServicio,
      searchEnabled: true,
      displayExpr: 'Nombre',
      valueExpr: 'Codigo',
    };
  }

}


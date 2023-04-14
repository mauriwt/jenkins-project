import { Component, OnInit, ChangeDetectionStrategy, ViewChild, AfterViewInit } from '@angular/core';
import { Base } from '../../../shared/AppDominio';

import { config } from 'src/app/shared/servicios.config';
import { DxDataGridComponent, DxPopupComponent } from 'devextreme-angular';
import { ExpRegular } from '../../../models/regex';
import { CRUDService, ComunService } from 'src/app/shared/services';
import CustomStore from 'devextreme/data/custom_store';
import { Constantes } from 'src/app/models';

@Component({
  selector: 'app-proceso',
  templateUrl: './proceso.component.html',
  styleUrls: ['./proceso.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProcesoComponent implements OnInit, AfterViewInit {

  @ViewChild('gridProcesos', { static: false }) gridProcesos: DxDataGridComponent;
  @ViewChild('popupForm') popupForm: DxPopupComponent;

  catalogoSistema: any;
  catalogoTipoProceso: any;
  catalogoTipoEntidad: any;
  dataSource: any;
  masterDetailDataSource: any;
  urlt: string;
  letras = ExpRegular.letrasMay;
  alfNumerico = ExpRegular.alfNumericoMay;
  ruta = ExpRegular.ruta;
  customMayus = ExpRegular.customMayus;
  mensajeEliminar = Constantes.mensajeEliminar;
  addButtonOptions: any;
  popupTitulo = Constantes.nuevoRegistro;


  opcionTipoEntidad: any;
  opcionTipo: any;
  opcionSAD: any;

  constructor(private crud: CRUDService, private comun: ComunService) { }

  ngOnInit() {
    this.addButtonOptions = {
      type: "default",
      stylingMode: "outlined",
      text: 'Nuevo Registro',
      onClick: this.addRow.bind(this)
    };

    this.opcionTipoEntidad = this.comun.opcionSelectBox("Tipo Entidad");
    this.opcionTipo = this.comun.opcionSelectBox("Tipo");
    this.opcionSAD = this.comun.opcionSelectBox("Sistema Afectación de Datos");
    this.obtenerCatalogos();
    this.crudProceso();
  }

  crudProceso() {
    const api = config.sigsIntg.procesoServicio;
    const url = `${Base.integracionRest}${api.proceso}`;
    this.dataSource = new CustomStore({
      key: "IdProceso",
      load: () => this.crud.peticioDevExtreme(`${url}${api.lista}`),
      insert: (values) => this.crud.peticioDevExtreme(`${url}${api.guardar}`, "POST", {
        values: JSON.stringify(values)
      }),
      update: (clave, values) => this.crud.peticioDevExtreme(`${url}${api.editar}`, "PUT", {
        key: clave,
        values: JSON.stringify(values)
      }),
      remove: (clave) => this.crud.peticioDevExtreme(`${url}${api.eliminar}`, "DELETE", {
        key: clave
      })
    });
  }

  cancelar(e) {
    this.gridProcesos.instance.cancelEditData();
  }


  mayuscula(e) {
    const customMayus = new RegExp('^[0-9A-Z]*$');
    return customMayus.test(e.value);
  }

  addRow() {
    this.popupTitulo = Constantes.nuevoRegistro;
    this.gridProcesos.instance.addRow();
  }

  nuevoReg(e) {
    e.data.Activo = true;
    e.data.EsMultiproceso = false;
  }

  iniciarEdicion(e) {
    this.popupTitulo = Constantes.editarRegistro;
  }

  obtenerCatalogos() {
    this.catalogoSistema = new CustomStore({
      key: "Codigo",
      loadMode: "raw",
      load: () => this.crud.peticioDevExtreme(`${Base.integracionRest}${config.sigsIntg.catalogo.sistema}`)
    });
    this.catalogoTipoProceso = new CustomStore({
      key: "Codigo",
      loadMode: "raw",
      load: () => this.crud.peticioDevExtreme(`${Base.integracionRest}${config.sigsIntg.catalogo.tipoProceso}`)
    });
    this.catalogoTipoEntidad = new CustomStore({
      key: "Codigo",
      loadMode: "raw",
      load: () => this.crud.peticioDevExtreme(`${Base.integracionRest}${config.sigsIntg.catalogo.tipoEntidad}`)
    });
  }

  ngAfterViewInit() {
    this.gridProcesos.instance.clearFilter("row");
    this.gridProcesos.instance.state({});
    this.gridProcesos.instance.columnOption("command:edit", "visibleIndex", 0);
  }
}

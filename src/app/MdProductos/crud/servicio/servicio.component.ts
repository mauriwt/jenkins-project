import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';

import { ExpRegular } from 'src/app/models/regex';
import { config } from 'src/app/shared/servicios.config';
import { Base } from 'src/app/shared/AppDominio';
import CustomStore from 'devextreme/data/custom_store';
import { CRUDService, ComunService } from 'src/app/shared/services';
import { Constantes } from 'src/app/models';

@Component({
  selector: 'app-servicio',
  templateUrl: './servicio.component.html',
  styleUrls: ['./servicio.component.scss']
})
export class ServicioComponent implements OnInit, AfterViewInit {

  @ViewChild('gridServicio') gridServicio: DxDataGridComponent;

  catalogoTipoEntidad: any;
  catalogoProducto: any;
  dataSource: any;
  masterDetailDataSource: any;
  urlt: string;
  letras = ExpRegular.letras;
  alfNumerico = ExpRegular.alfNumerico;
  ruta = ExpRegular.ruta;
  mensajeEliminar = Constantes.mensajeEliminar;
  opcionTipoEntidad: any;
  addButtonOptions: any;
  popupTitulo = Constantes.nuevoRegistro;

  constructor(private crud: CRUDService, private comun: ComunService) { }

  ngOnInit() {
    this.addButtonOptions = {
      type: "default",
      stylingMode: "outlined",
      text: 'Nuevo Registro',
      onClick: this.addRow.bind(this)
    };
    this.opcionTipoEntidad = this.comun.opcionSelectBox("Tipo Entidad");
    this.obtenerCatalogos();
    this.crudProceso();
  }

  verPopup(e){

  }

  cancelar(e) {
    this.gridServicio.instance.cancelEditData();
  }

  addRow() {
    this.gridServicio.instance.addRow();
    this.popupTitulo = Constantes.nuevoRegistro;
  }

  nuevoReg(e) {
    e.data.Activo = true;
  }

  iniciarEdicion(e) {
    this.popupTitulo = Constantes.editarRegistro;
  }

  crudProceso() {
    const api = config.sigsIntg.procesoServicio;
    const url = `${Base.integracionRest}${api.servicio}`;
    this.dataSource = new CustomStore({
      key: "IdServicio",
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


  obtenerCatalogos() {
    this.catalogoTipoEntidad = new CustomStore({
      key: "Codigo",
      loadMode: "raw",
      load: () => this.crud.peticioDevExtreme(`${Base.integracionRest}${config.sigsIntg.catalogo.tipoEntidad}`)
    });
  }

  ngAfterViewInit() {
    this.gridServicio.instance.clearFilter("row");
    this.gridServicio.instance.state({});
    this.gridServicio.instance.columnOption("command:edit", "visibleIndex", 0);
  }

}

import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';

import { ExpRegular } from 'src/app/models/regex';
import { config } from 'src/app/shared/servicios.config';
import { Base } from 'src/app/shared/AppDominio';
import CustomStore from 'devextreme/data/custom_store';
import { CRUDService, ComunService } from 'src/app/shared/services';
import { Constantes } from 'src/app/models';

@Component({
  selector: 'app-producto-servicio',
  templateUrl: './producto-servicio.component.html',
  styleUrls: ['./producto-servicio.component.scss']
})
export class ProductoServicioComponent implements OnInit, AfterViewInit {

  @ViewChild('gridProcesoServicio') gridProcesoServicio: DxDataGridComponent;

  catalogoServicio: any;
  catalogoProducto: any;
  dataSource: any;
  masterDetailDataSource: any;
  urlt: string;
  letras = ExpRegular.letras;


  alfNumerico = ExpRegular.alfNumerico;
  ruta = ExpRegular.ruta;
  mensajeEliminar = Constantes.mensajeEliminar;
  opcionServicio: any;
  opcionPOrigen: any;
  filtroServicio: any;
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
    this.opcionServicio = this.comun.opcionSelectBox("Servicio");
    this.opcionPOrigen = this.comun.opcionSelectBox("Producto Origen");
    this.obtenerCatalogos();
    this.crudProceso();
  }

  cancelar(e) {
    this.gridProcesoServicio.instance.cancelEditData();
  }

  addRow() {
    this.popupTitulo = Constantes.nuevoRegistro;
    this.gridProcesoServicio.instance.addRow();
  }

  nuevoReg(e) {
    e.data.Activo = true;
  }

  iniciarEdicion(e) {
    this.popupTitulo = Constantes.editarRegistro;
  }

  crudProceso() {
    const api = config.sigsIntg.procesoServicio;
    const url = `${Base.integracionRest}${api.productoServicio}`;
    this.dataSource = new CustomStore({
      key: "IdProductoServicio",
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
    /*  this.catalogoServicio = new CustomStore({
       key: "Codigo",
       loadMode: "raw",
       load: () => this.crud.peticioDevExtreme()
     }); */
    this.catalogoProducto = new CustomStore({
      key: "Codigo",
      loadMode: "raw",
      load: () => this.crud.peticioDevExtreme(`${Base.integracionRest}${config.sigsIntg.catalogo.productos}`)
    });

    this.crud.obtener(`${Base.integracionRest}${config.sigsIntg.catalogo.servicios}`).subscribe((response: any) => {
      this.catalogoServicio = response;
      this.filtroServicio = this.crearFiltroServicio(response);
    });
  }

  ngAfterViewInit() {
    this.gridProcesoServicio.instance.clearFilter("row");
    this.gridProcesoServicio.instance.state({});
    this.gridProcesoServicio.instance.columnOption("command:edit", "visibleIndex", 0);
  }

  crearFiltroServicio(servcios) {
    return {
      searchEnabled: true,
      placeholder: 'Seleccione Servicio',
      showClearButton: true,
      width: 400,
      items: servcios,
      valueExpr: 'Codigo',
      displayExpr: 'Nombre',
      onValueChanged: (args) => {
        if (args.value > 0) {
          this.gridProcesoServicio.instance.filter(["IdServicio", "=", args.value]);
        } else {
          this.gridProcesoServicio.instance.clearFilter();
        }
      }
    };
  }
}

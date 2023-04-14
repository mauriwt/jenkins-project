import { Component, OnInit, ViewChild, AfterContentInit, AfterViewInit } from '@angular/core';
import 'devextreme/data/odata/store';
import { DxDataGridComponent } from "devextreme-angular";
import CustomStore from 'devextreme/data/custom_store';
import { config } from '../../shared/servicios.config';
import { AlertifyService, CRUDService } from '../../shared/services';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

declare var $;

@Component({
  templateUrl: 'configuracion.component.html'
})

export class ConfiguracionComponent implements OnInit, AfterViewInit {

  private subscription: Subscription = new Subscription();

  @ViewChild('ramo', { static: false }) ramoSelectBox: any;
  @ViewChild('grid', { static: false }) productoGrid: any;
  @ViewChild('item', { static: false }) productoSelectBox: any;
  @ViewChild('gridClientes', { static: false }) gridClientes: DxDataGridComponent;
  tipoFiltro: any;
  opcionFiltro: any;
  dataSource: any;
  priority: any[];
  url: string;
  cargando: boolean;

  allMode: string;
  checkBoxesMode: string;
  public catalogo: any;
  public aseguradoras: any;
  public ramos: any;
  public productos: any;

  searchModeOption: string = "contains";
  searchExprOption: any = "Nombre";
  searchTimeoutOption: number = 200;
  minSearchLengthOption: number = 0;
  showDataBeforeSearchOption: boolean = false;
  widget: string = "widget";
  token: string;

  constructor(private crud: CRUDService, private aroute: ActivatedRoute, private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
    this.url = config.confProducto.dominio;
  }

  ngAfterViewInit() {
    this.gridClientes.instance.columnOption("command:edit", "visibleIndex", 0);
  }

  ngOnInit() {
    this.getAseguradoras();
    this.recibirParametro();
    this.catalogo = this.getCatalogo('Codigo', `${this.url}${config.confProducto.catalogo.base}`);
    this.tipoFiltro = [{
      key: "auto",
      name: "Immediately"
    }, {
      key: "onClick",
      name: "On Button Click"
    }];
    this.opcionFiltro = this.tipoFiltro[0].key;
  }

  recibirParametro() {
    this.subscription.add(
      this.aroute.params.subscribe(param => {
        if (param['token']) {
          this.token = param['token'];
        }
      }));
  }



  getConfiguracionProductos(value) {
    if (value) {
      this.gridClientes.instance.clearFilter("row");
      this.gridClientes.instance.state({});
      this.dataSource = new CustomStore({
        key: 'IdConfiguracionProducto',
        load: () => this.crud.peticioDevExtreme(`${this.url}${config.confProducto.producto.base}${value.Nombre}`),
        update: (key, values) => this.crud.peticioDevExtreme(`${this.url}${config.confProducto.producto.update}${this.token}`, "PUT", {
          key: key,
          values: JSON.stringify(values)
        }),
      });

    } else {
      this.dataSource = null;
      $("input.dx-texteditor-input:text").val("");
    }
  }

  getCatalogo(valor, url) {
    return new CustomStore({
      key: valor,
      load: () => this.crud.peticioDevExtreme(url),
      loadMode: "raw",
    });
  }

  getAseguradoras() {
    this.cargando = true;
    this.crud.obtener(`${this.url}${config.confProducto.producto.aseguradoras}`).subscribe(response => {
      this.aseguradoras = response;
      this.cargando = false;
    }, error => this.cargando = false);
  }

  allowEditting(e) {
    let val = false;
    if (e.row.rowType === "data"){
      val = e.row.data.EsEditable;
      if(val === undefined)
      {
        val = false;
      }
    }
    return val;
  }
}

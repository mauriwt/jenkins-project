import { Component, OnInit, OnDestroy, ViewChild, Input, SimpleChanges, OnChanges } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { CRUDService, ComunService, AlertifyService } from 'src/app/shared/services';
import { Base } from 'src/app/shared/AppDominio';
import { config } from 'src/app/shared/servicios.config';
import CustomStore from 'devextreme/data/custom_store';
import { ClaveValor, Constantes } from 'src/app/models';
import { ExpRegular } from 'src/app/models/regex';
import { ActivatedRoute } from '@angular/router';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ExcelService } from 'src/app/shared/services/excel.service';

@Component({
  selector: 'app-emision',
  templateUrl: './emision.component.html',
  styleUrls: ['./emision.component.scss']
})
export class EmisionComponent implements OnInit, OnDestroy, OnChanges {


  private subscription: Subscription = new Subscription();


  @ViewChild('gridPagi', { static: false }) gridPagi: DxDataGridComponent;
  @ViewChild('gridBatch', { static: false }) gridBatch: DxDataGridComponent;

  @Input() token: string;

  cargando: boolean;
  public filteredCamposError: any[];
  listaTipoOrigen: any[];
  camposError: any[];
  listaActidadE: any[];
  listaServicio: any[];
  listaCodigoPais: any[];
  listaProvincia: any[];
  listaCanton: any[];
  listaNacionalidad: any[];
  listaEstadoCivil: any[];
  listaGenero: any[];
  listaTipoasegurado: any[];
  listaTipoidentificacion: any[];
  listaCodigoPlan: any[];
  listaFormaPago: any[];
  listaCodigoPeriodicidad: any[];
  listaTipoCuenta: any[];
  dataSource: any;
  saveButtonOptions: any;
  cancelButtonOptions: any;
  editButtonOptions: any;
  exportButtonOptions: any;
  fechaOptions: any;
  nombreCampo: string;
  ocultarGrid = false;
  opcionSelect: any;
  now: Date = new Date();
  min: Date = new Date(1900, 0, 1);
  btnEditarVer = false;
  esEditable: boolean;

  d = new Date();
  letras = ExpRegular.letrasMaySinEspacio;
  direccion = ExpRegular.alfNumerico;
  soloNumeros = ExpRegular.telfCelular;
  tokenUsuario: string;
  regiForm: FormGroup;

  DataFieldObj: any;
  ArregloBatch: any[];

  listaTemp: any[];

  constructor(private excelService: ExcelService, private crud: CRUDService, private comun: ComunService, private notify: AlertifyService, private aroute: ActivatedRoute, private fb: FormBuilder) {

    this.d.setDate(this.d.getDate() - 30);
    this.d.setHours(0, 0, 0, 0);

    this.regiForm = fb.group({
      FechaInicio: [this.d, Validators.required],
      FechaFin: [new Date(new Date().setHours(0, 0, 0, 0)), Validators.required],
      IdServicio: [0],
      TipoOrigen: ['', Validators.required],
      DataField: ['', Validators.required],
    });

  }

  ngOnInit() {
    this.DataFieldObj = {};
    this.opcionSelect = this.comun.opcionSelectBox("");
    this.listaTipoOrigen = new Array<any>();
    this.ArregloBatch = new Array<any>();
    this.camposError = new Array<any>();
    this.inicializarElementos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const userToken = changes.token;
    if (userToken !== undefined) {
      if (userToken.currentValue !== undefined) {
        this.tokenUsuario = userToken.currentValue;
        this.catalogos(userToken.currentValue);
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  exportarRegistros() {
    this.mensajeDescarga();
  }

  mensajeDescarga() {
    this.subscription.add(
      this.comun.confirmDialog("Aviso", `Esto puede tardar varios segundos.<br> ¿Desea seguir con la descarga del archivo?`).subscribe(valido => {
        if (valido) {
         this.descargarErrores();
        }
      }));
  }

  descargarErrores() {
    if (this.regiForm.valid) {
      this.cargando = true;
      const filtro = {
        FechaInicio: this.comun.fechaIsoADate(this.regiForm.value.FechaInicio),
        FechaFin: this.comun.fechaIsoADate(this.regiForm.value.FechaFin),
        IdServicio: this.regiForm.value.IdServicio ? this.regiForm.value.IdServicio : 0,
        DataField: this.regiForm.value.DataField,
        tokenUsuario: this.tokenUsuario
      };
      this.subscription.add(
        this.crud.post(`${Base.integracionRest}${config.sigsIntg.integracionError.descargarError}`, filtro).subscribe(
          (response: any) => {
            this.excelService.exportAsExcelFile(response, 'INTEGRACION_EMISION_ERROR');
            this.cargando = false;
          }, error => this.cargando = false));

    }
  }

  obtenerErrores(tipoOrigen: string) {
    this.subscription.add(
      this.crud.obtener(`${Base.integracionRest}${config.sigsIntg.catalogo.campoError}${tipoOrigen}&tokenUsuario=${this.tokenUsuario}`).subscribe(
        (response: any) => {
          this.camposError = response;
          this.filteredCamposError = response.slice();
          this.cargando = false;
        }));
  }

  realizarBusqueda() {
    if (this.regiForm.valid) {
      this.nombreCampo = this.DataFieldObj.Columna;
      this.esEditable = this.DataFieldObj.Editable;
      this.gridPagi.instance.state({});
      const filtro = {
        FechaInicio: null,
        FechaFin: null,
        IdServicio: null,
        DataField: "",
        skip: "",
        take: "",
        RequireTotalCount: null,
        tokenUsuario: ""
      };
      filtro.DataField = this.regiForm.value.DataField;
      filtro.FechaInicio = this.comun.fechaIsoADate(this.regiForm.value.FechaInicio);
      filtro.FechaFin = this.comun.fechaIsoADate(this.regiForm.value.FechaFin);
      filtro.tokenUsuario = this.tokenUsuario;
      filtro.IdServicio = this.regiForm.value.IdServicio ? this.regiForm.value.IdServicio : "0";
      this.dataSource = new CustomStore({
        key: "IdIntegracionEmisionError",
        load: (loadOptions: any) => {
          [
            "skip",
            "take",
            "requireTotalCount"
          ].forEach((i) => {
            if (i in loadOptions && !this.comun.isEmpty(loadOptions[i])) {
              switch (i) {
                case "skip":
                  filtro.skip = JSON.stringify(loadOptions[i]);
                  filtro.RequireTotalCount = false;
                  break;
                case "take":
                  filtro.take = JSON.stringify(loadOptions[i]);
                  break;
                case "requireTotalCount":
                  delete filtro.skip;
                  filtro.RequireTotalCount = loadOptions[i];
                  break;
                default:
                  break;
              }
            }
          });
          return this.crud.postFormData(`${Base.integracionRest}${config.sigsIntg.integracionError.emision}`, filtro).
            toPromise().then((response: any) => {
              this.listaTemp = response.Data;
              this.btnEditarVer = response.Data.length > 0 ? true : false;
              return {
                data: response.Data,
                totalCount: response.TotalRegistros,
              };
            }).catch(error => { throw 'Fallo la carga de datos' });
        },
      });
    }
  }


  onToolbarPreparing(e) {
    e.toolbarOptions.visible = false;
  }


  onRowPrepared(e) {
    if (e.rowType === "data" && this.esEditable) {
      const fila = e.columns.find(h => h.dataField === this.nombreCampo);
      if (fila) {
        e.rowElement.cells[3].bgColor = Constantes.colorFila[1];
      }
    }
  }

  editarRegistros() {
    this.ocultarGrid = true;
    this.regiForm.disable();
    this.ArregloBatch = this.gridPagi.instance.getDataSource().items().filter(item => !item.ErrorSolventado);
  }

  setCellValue = (newData, value, currentRowData) => {
     if (!this.comun.isBlank(value)) {
      newData[this.nombreCampo] = value;
      newData.ErrorSolventado = true;
    } else {
      newData[this.nombreCampo] = null;
      newData.ErrorSolventado = false;
    }
  }

  saveBatch() {
    this.gridBatch.instance.saveEditData();
    let arrayEnvio = [];
    for (const item of this.ArregloBatch) {
      console.log(item.ErrorSolventado,item[this.nombreCampo],this.nombreCampo);
      if (item.ErrorSolventado && !this.comun.isEmpty(item[this.nombreCampo])) {
        arrayEnvio.push({ IdIntegracionEmisionError: item.IdIntegracionEmisionError, Valor: item[this.nombreCampo] });
      }
    }
    console.log(arrayEnvio);
    if (arrayEnvio.length > 0) {
      this.gridBatch.instance.state({});
      this.ocultarGrid = false;
      const obj = new ClaveValor();
      obj.key = this.nombreCampo;
      obj.values = arrayEnvio;
      this.crud.post(`${Base.integracionRest}${config.sigsIntg.integracionError.editar}`, obj).subscribe(
        respose => {
          if (respose) {
            switch (respose.estado) {
              case "OK":
                this.notify.message(respose.mensaje);
                arrayEnvio = [];
                this.ArregloBatch = new Array<any>();
                this.ocultarGrid = false;
                this.regiForm.enable();
                break;
              case "ERROR":
                this.notify.error(respose.mensaje);
                break;
              default:
                this.notify.error("Problema desconocido.");
                break;
            }
          }

        }, error => {
          arrayEnvio = [];
          this.ArregloBatch = new Array<any>();
          this.ocultarGrid = false;
          this.regiForm.enable();
          this.notify.error("Problema desconocido.");
        });
    } else {
      this.comun.confirmDialog("No hay cambios", "No se detectó nigún cambio en los registros", true).subscribe(valido => {
        if (valido) {
        }
      });
    }
  }

  cancelarBatch() {
    this.gridBatch.instance.state({});
    this.gridBatch.instance.cancelEditData();
    this.ArregloBatch = new Array<any>();
    this.ocultarGrid = false;
    this.regiForm.enable();
  }

  inicializarElementos() {
    this.saveButtonOptions = {
      type: "default",
      stylingMode: "outlined",
      text: 'Guardar Cambios',
      onClick: this.saveBatch.bind(this)
    };
    this.cancelButtonOptions = {
      type: "danger",
      stylingMode: "outlined",
      text: 'Cancelar',
      onClick: this.cancelarBatch.bind(this)
    };


    this.editButtonOptions = {
      type: "default",
      stylingMode: "outlined",
      text: 'Editar',
      onClick: this.editarRegistros.bind(this)
    };
    this.exportButtonOptions = {
      type: "normal",
      stylingMode: "text",
      icon: "xlsxfile",
      onClick: this.exportarRegistros.bind(this)
    };

    this.fechaOptions = {
      width: '100%',
      showClearButton: true,
      placeholder: 'dd/mm/aaaa',
      useMaskBehavior: true,
      displayFormat: 'dd/MM/yyyy',
      min: this.min,
      max: this.now
    };
  }
  obtenerCatalogos(token): Observable<any> {
    const nodoToken = `&tokenUsuario=${token}`;
    const catServicio = this.crud.obtener(`${Base.integracionRest}${config.sigsIntg.integracionError.servicio}${token}`);
    const api = `${Base.integracionRest}${config.sigsIntg.integracionError.catalogoByCodigo}`;
    const catActividadE = this.crud.obtener(`${api}${Constantes.estadosErrores[0]}${nodoToken}`);
    const catGeneros = this.crud.obtener(`${api}${Constantes.estadosErrores[1]}${nodoToken}`);
    const catEstadoCivil = this.crud.obtener(`${api}${Constantes.estadosErrores[2]}${nodoToken}`);
    const catPeriodicidad = this.crud.obtener(`${api}${Constantes.estadosErrores[3]}${nodoToken}`);
    const catIdentificaciones = this.crud.obtener(`${api}${Constantes.estadosErrores[4]}${nodoToken}`);
    const catFormaPagos = this.crud.obtener(`${api}${Constantes.estadosErrores[5]}${nodoToken}`);
    const catCuentas = this.crud.obtener(`${api}${Constantes.estadosErrores[6]}${nodoToken}`);
    const catPais = this.crud.obtener(`${api}${Constantes.estadosErrores[7]}${nodoToken}`);
    const catProvincias = this.crud.obtener(`${api}${Constantes.estadosErrores[8]}${nodoToken}`);
    const catCantones = this.crud.obtener(`${api}${Constantes.estadosErrores[9]}${nodoToken}`);
    const catNacionalidades = this.crud.obtener(`${api}${Constantes.estadosErrores[10]}${nodoToken}`);
    const catListaOrigen = this.crud.obtener(`${Base.integracionRest}${config.sigsIntg.integracionError.listaOrigen}${token}`);

    return forkJoin([catServicio, catActividadE, catGeneros, catEstadoCivil, catPeriodicidad, catIdentificaciones, catFormaPagos,
      catCuentas, catPais, catProvincias, catCantones, catNacionalidades, catListaOrigen]);
  }

  catalogos(token) {
    this.cargando = true;
    this.subscription.add(
      this.obtenerCatalogos(token).subscribe(catalogos => {
        this.listaActidadE = catalogos[1];
        this.listaGenero = catalogos[2];
        this.listaEstadoCivil = catalogos[3];
        this.listaCodigoPeriodicidad = catalogos[4];
        this.listaTipoidentificacion = catalogos[5];
        this.listaFormaPago = catalogos[6];
        this.listaTipoCuenta = catalogos[7];
        this.listaCodigoPais = catalogos[8];
        this.listaProvincia = catalogos[9];
        this.listaCanton = catalogos[10];
        this.listaNacionalidad = catalogos[11];
        this.listaTipoOrigen = catalogos[12];
        this.listaServicio = catalogos[0];
        this.cargando = false;
      }, error => {
        this.cargaFallida();
        this.cargando = false;
      }));
  }

  cargaFallida() {
    this.subscription.add(
      this.comun.confirmDialog("Aviso", `No hay respuesta del servidor.<br> ¿Desea recargar la ventana?`, true).subscribe(valido => {
        if (valido) {
          this.catalogos(this.tokenUsuario);
        }
      }));
  }

  setValoresDefault(e) {
    this.gridPagi.instance.option('dataSource', []);
    if (this.comun.isEmpty(e)) {
      this.regiForm.value.IdServicio = "0";
    }
    this.btnEditarVer = false;
  }

  getCampoError(e) {
    this.gridPagi.instance.option('dataSource', []);
    if (!this.comun.isEmpty(e)) {
      this.cargando = true;
      this.obtenerErrores(e);
    } else {
      this.camposError = new Array<any>();
    }
    this.btnEditarVer = false;
  }

  getElemento(e) {
    this.gridPagi.instance.option('dataSource', []);
    if (!this.comun.isEmpty(e)) {
      this.DataFieldObj = this.camposError.find(item => item.Descripcion === e);
      this.btnEditarVer = false;
    } else {
      this.DataFieldObj = {};
    }
  }
}

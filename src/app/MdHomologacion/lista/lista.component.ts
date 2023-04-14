
import { Component, OnInit, OnDestroy, ViewChild, EventEmitter, Output, Input, SimpleChanges, OnChanges, Injectable, ChangeDetectionStrategy, Inject, ElementRef } from '@angular/core';
import 'devextreme/data/odata/store';
import { DxDataGridComponent, DxDataGridModule, DxButtonModule, DxPopupComponent } from "devextreme-angular";
import { config } from '../../shared/servicios.config';
import { ActivatedRoute, Router } from '@angular/router';
import CustomStore from 'devextreme/data/custom_store';
import { CRUDService, ComunService, AlertifyService, FormService } from 'src/app/shared/services';
import { FormGroup, FormControl } from '@angular/forms';
import { Homologacion } from 'src/app/models';
import { Observable, forkJoin, Subscription } from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss'],
  providers: [ComunService]
})

export class ListaComponent implements OnInit {

  @Output() public cargarData = new EventEmitter();
  @ViewChild('grid') grid: DxDataGridComponent;
  @ViewChild('formBuq') form: any;

  @ViewChild('popupForm') popupForm: DxPopupComponent;

  public listaCatalogoTabla: any[];
  public formulario: FormGroup;

  private subscription: Subscription = new Subscription();
  private subscriptionHomologacion: Subscription = new Subscription();
  private homologacion: any;
  private formHomologacion: Homologacion;
  private identificacionURL: boolean;
  private url = config.sigsIntg.dominio;

  public formErrors = Homologacion.fieldEmpty();
  public submitted: boolean = false;
  public mIdHomologacion: Number = 0;
  public mCodigoHomologacion: string = "";
  public mtextCatalogoTabla: string = "";
  public mEsCatalogo: boolean = false;
  public mExisteSigs: boolean = false;
  public mCatalogoTabla: string = "";
  public mNombre: string = "";
  public mDescripcion: string = "";
  public mActivo: boolean = false;
  public mValorSIGS: string = "";
  public mValorHomologar: string = "";
  public mValorHomologar2: string = "";
  public mValorHomologar3: string = "";
  public mValorIntegrar: string = "";
  public mActivoDetalle: boolean = false;
  public mDetalleEliminado: boolean = false;
  public detalle = [];
  public detalleEliminados = [];
  public mActualizaDetalle: Number = -1;
  public validCatalogoTabla: boolean = false;
  public validTextCatalogoTabla: boolean = false;
  public validCodigoHomologacion: boolean = false;
  public validNombre: boolean = false;
  public validValorSIGS: boolean = false;
  public validValorHomologar: boolean = false;
  public validValorIntegrar: boolean = false;
  public mMuestraActualizacion: number = 0;
  public token;
  public mBuscar: string = "";
  public mNuevo: boolean = false;

  public mPopUpForm: any = null;

  public mTituloForm = "";
  public mTituloFormAnterior = "";
  public formActivoHomologacion: FormGroup;
  public formActivoDetalle: FormGroup;

  public sinpuntero = "sinpuntero";

  public mHeightAnterior: number = 0;

  dataSource: any;

  constructor
    (
    private router: Router,
    private comun: ComunService,
    private crud: CRUDService,
    private alertify: AlertifyService,
    private formService: FormService,
    private notifi: AlertifyService,
    private aroute: ActivatedRoute
    ) {
      this.formActivoHomologacion = new FormGroup({
        activoCabecera: new FormControl()
      });
      this.formActivoDetalle = new FormGroup({
        activoDetalle: new FormControl()
      });
      this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    $(document).ready(function () {
      $('[data-toggle="popover"]').popover({
        title: '',
        content: `<div class="info-buscar"><p><b>Criterios de búqueda:</b></p>
        <p>Catálogo / tabla</p><p>Código de homologación</p>
        <p>Nombre</p><p>Descripción</p><p>Catálogo tabla</p></div>`,
        html: true,
      });
    });
    this.onShowing = this.onShowing.bind(this);
  }

  ngOnInit() {
    this.recibirParametro();
    this.listaCatalogoTabla = new Array<any>();
    this.catalogos();
    this.inicializarFormularios();
    this.getHistorial();
  }

  recibirParametro() {
    this.subscription.add(
      this.aroute.params.subscribe(param => {
        if (param['token']) {
          this.token = param['token'];
        }
      }));
  }

  inicializarFormularios() {
    this.formulario = this.formService.generar(Homologacion.campos());
    this.subscription.add(
      this.formulario.valueChanges.subscribe((data) => {
        this.formErrors = this.formService.validateForm(this.formulario, this.formErrors, Homologacion.getCampos(), true)
      }));
  }

  isFieldValid(form: FormGroup, field: string) {
    return (this.submitted && form.controls[field].invalid || (form.controls[field].invalid && form.controls[field].dirty) ||
      ((form.controls[field].invalid && form.controls[field].pristine) && (!this.comun.isEmpty(form.controls[field].value))));
  }

  getHistorial() {
    this.dataSource = new CustomStore({
      key: 'IdHomologacion',
      load: () => this.crud.peticioDevExtreme(`${config.sigsHomologacion.dominio}${config.sigsHomologacion.lista.homologacion}${this.token}`)
    });
  }

  openHomologacion(modal, indexModifica = -1) {
    this.mActualizaDetalle = indexModifica;
    switch (modal) {
      case 'mdDetalle':
        if (indexModifica == -1) this.limpiarDetalle();
        break;
      case 'mdHomologacion':
        if (indexModifica == -1) {
          this.limpiarCabecera();
          this.detalle = [];
          this.detalleEliminados = [];
        }
        break;
    }
  }

  closeActualizarDetalle() {
    this.mTituloForm = this.mTituloFormAnterior;
    this.asignarTitulo(this.mPopUpForm);
    this.mMuestraActualizacion = 0;

    this.formSize(2);

  }

  closeHomologacion(modal) {
    this.close(modal);
  }

  open(modalID) {
    this.comun.openClose(modalID, 'show');
  }

  close(modalID) {
    this.comun.openClose(modalID, 'hide');
  }

  catalogos() {
    this.subscription.add(
      this.obtenerCatalogos().subscribe(catalogos => {
        this.listaCatalogoTabla = catalogos[0];
        this.cargarData.emit(false);
      }, error => {
        this.alertify.error("No hay respuesta del servidor.<br> Vuelva a intentar más tarde.");
        this.cargaFallida();

      }));
  }

  obtenerCatalogos(): Observable<any> {
    const catalogo = this.crud.obtener(`${this.url}${config.sigsIntg.catalogo.catalogo}${this.token}`);
    return forkJoin([catalogo]);
  }

  cargaFallida() {
    this.subscription.add(
      this.comun.confirmDialog("Aviso", `No hay respuesta del servidor.<br> Desea recargar la ventana ?`).subscribe(valido => {
        if (valido) {
          if (!this.identificacionURL) {
            this.cargarData.emit(true);
            this.catalogos();
          }
          else location.reload();
        } else {
          if (this.identificacionURL) {
            window.close();
          }
        }
      }));
  }

  blurCatalogoTabla() {
    this.validCatalogoTabla = (this.mCatalogoTabla.trim().length === 0);
  }

  blurTextCatalogoTabla() {
    this.validTextCatalogoTabla = (this.mtextCatalogoTabla.trim().length === 0);
  }

  blurCodigoHomologacion() {
    this.validCodigoHomologacion = (this.mCodigoHomologacion.trim().length === 0);
  }

  blurNombre() {
    this.validNombre = (this.mNombre.trim().length === 0);
  }

  blurValorSIGS() {
    this.validValorSIGS = (this.mValorSIGS.trim().length === 0);
  }

  blurValorHomologar() {
    this.validValorHomologar = (this.mValorHomologar.trim().length === 0);
  }

  blurValorIntegrar() {
    this.validValorIntegrar = (this.mValorIntegrar.trim().length === 0);
  }

  validarHomologación(): boolean {
    this.limpiarValidaciones();
    let isValid: boolean = true;
    if (this.mEsCatalogo && this.mExisteSigs && this.mCatalogoTabla.trim().length === 0) {
      this.validCatalogoTabla = true;
      isValid = false;
    }
    if ((!this.mEsCatalogo || !this.mExisteSigs) && this.mtextCatalogoTabla.trim().length === 0) {
      this.validTextCatalogoTabla = true;
      isValid = false;
    }
    if (this.mCodigoHomologacion.trim().length === 0) {
      this.validCodigoHomologacion = true;
      isValid = false;
    }
    if (this.mNombre.trim().length === 0) {
      this.validNombre = true;
      isValid = false;
    }

    if (!this.mEsCatalogo && !this.mExisteSigs)
    {
      this.alertify.error("No pueden ser 'Es Catálogo' y 'Existe en SIGS' falsos simultáneamente");
      isValid = false;
    }

    if (!isValid) this.alertify.error("Ingrese Campos Requeridos");

    return isValid;
  }

  validarDetalle(): boolean {
    this.limpiarValidacionesDetalle();
    let isValid = true;
    if (this.mEsCatalogo && this.mExisteSigs && this.mValorSIGS.trim().length === 0) {
      this.validValorSIGS = true;
      isValid = false;
    }
    if (this.mValorHomologar.trim().length === 0) {
      this.validValorHomologar = true;
      isValid = false;
    }
    if (this.mValorIntegrar.trim().length === 0) {
      this.validValorIntegrar = true;
      isValid = false;
    }
    if (!isValid) this.alertify.error("Ingrese Campos Requeridos");

    return isValid;
  }

  guardarPrevio(idHomologacion): boolean {
    if (!this.validarHomologación()) return false;
    var Encabezado: any;
    var lpost: any;

    let lCatalogoTabla: string = !this.mEsCatalogo || !this.mExisteSigs ? this.mtextCatalogoTabla : this.mCatalogoTabla;

    if (idHomologacion == 0) {
      Encabezado = [{
        EsCatalogo: this.mEsCatalogo,
        CatalogoTabla: lCatalogoTabla.trim(),
        CodigoHomologacion: this.mCodigoHomologacion.trim(),
        Nombre: this.mNombre.trim(),
        Descripcion: this.mDescripcion,
        Activo: this.mActivo,
        ExisteEnSIGS: this.mExisteSigs
      }];
      lpost = `${config.sigsHomologacion.dominio}${config.sigsHomologacion.lista.insert}${config.sigsHomologacion.lista.tokenUsuario}${this.token}`;
    }
    else {
      Encabezado = [{
        IdHomologacion: this.mIdHomologacion,
        EsCatalogo: this.mEsCatalogo,
        CatalogoTabla: lCatalogoTabla.trim(),
        CodigoHomologacion: this.mCodigoHomologacion.trim(),
        Nombre: this.mNombre.trim(),
        Descripcion: this.mDescripcion,
        Activo: this.mActivo,
        ExisteEnSIGS: this.mExisteSigs
      }];
      lpost = `${config.sigsHomologacion.dominio}${config.sigsHomologacion.lista.update}${config.sigsHomologacion.lista.tokenUsuario}${this.token}`;
    }

    let detalleAux = [];
    let lenDetalle = this.detalle.length;
    for (let i = 0; i < lenDetalle; i++)
    {
      if (!this.detalle[i].DetalleEliminado)
      {
        try
        {
          detalleAux.push(
            {
              IdDetalleHomologacion: this.detalle[i].IdDetalleHomologacion,
              IdHomologacion: this.detalle[i].IdHomologacion,
              ValorSIGS: this.detalle[i].ValorSIGS,
              ValorHomologar: this.detalle[i].ValorHomologar,
              ValorHomologar2: this.detalle[i].ValorHomologar2,
              ValorHomologar3: this.detalle[i].ValorHomologar3,
              ValorIntegrar: this.detalle[i].ValorIntegrar,
              Activo: this.detalle[i].Activo
            }
          );
        }
        catch
        {
          detalleAux.push(
            {
              ValorSIGS: this.detalle[i].ValorSIGS,
              ValorHomologar: this.detalle[i].ValorHomologar,
              ValorHomologar2: this.detalle[i].ValorHomologar2,
              ValorHomologar3: this.detalle[i].ValorHomologar3,
              ValorIntegrar: this.detalle[i].ValorIntegrar,
              Activo: this.detalle[i].Activo
            }
          );
        }
      }
    }

    const Obj = {
      Encabezado: Encabezado,
      Detalle: detalleAux,
      Borrar: this.detalleEliminados
    };
    return this.guardar(Obj, lpost);
  }

  private guardar(obj, ipost): boolean {
    this.subscription.add(

      this.crud.post(ipost, obj).subscribe(response => {
        if (typeof response !== 'undefined') {
          if (response === 1) {
            if (this.mIdHomologacion == 0) this.closeHomologacion('mdHomologacion');
            this.grid.instance.cancelEditData();
            this.getHistorial();
            this.alertify.message("Operación realizada exitosamente.");
            this.mNuevo = false;
            return true;
          } else {
            this.alertify.error("Error: response undefined!");
            return false;
          }
        } else {
          this.alertify.error("Error: conexión a la base de datos no establecida!");
          return false;
        }
      },
        error => {
          this.alertify.error(error.error);
          return false;
        }
      ));
      return true;
  }

  guardarPrevioDetalle(nuevo) {
    if (!this.validarDetalle()) return;

    this.mTituloForm = this.mTituloFormAnterior;
    this.asignarTitulo(this.mPopUpForm);

    if (this.mEsCatalogo && !this.mExisteSigs) this.mValorSIGS = "";

    if (this.mActualizaDetalle !== -1) {
      this.detalle[this.mActualizaDetalle.toString()].ValorSIGS = this.mValorSIGS == null ? null : this.mValorSIGS.trim();
      this.detalle[this.mActualizaDetalle.toString()].ValorHomologar = this.mValorHomologar == null ? null : this.mValorHomologar.trim();
      this.detalle[this.mActualizaDetalle.toString()].ValorHomologar2 = this.mValorHomologar2 == null ? null : this.mValorHomologar2.trim();
      this.detalle[this.mActualizaDetalle.toString()].ValorHomologar3 = this.mValorHomologar3 == null ? null : this.mValorHomologar3.trim();
      this.detalle[this.mActualizaDetalle.toString()].ValorIntegrar = this.mValorIntegrar == null ? null : this.mValorIntegrar.trim();
      this.detalle[this.mActualizaDetalle.toString()].Activo = this.mActivoDetalle == null ? null : this.mActivoDetalle;
    }
    else if (nuevo) {
      this.detalle.push(
        {
          ValorSIGS: this.mValorSIGS == null ? null : this.mValorSIGS.trim(),
          ValorHomologar: this.mValorHomologar == null ? null : this.mValorHomologar.trim(),
          ValorHomologar2: this.mValorHomologar2 == null ? null : this.mValorHomologar2.trim(),
          ValorHomologar3: this.mValorHomologar3 == null ? null : this.mValorHomologar3.trim(),
          ValorIntegrar: this.mValorIntegrar == null ? null : this.mValorIntegrar.trim(),
          Activo: this.mActivoDetalle == null ? null : this.mActivoDetalle
        }
      );
    }
    else {
      this.detalle.push(
        {
          IdDetalleHomologacion: 0,
          IdHomologacion: this.mIdHomologacion,
          ValorSIGS: this.mValorSIGS == null ? null : this.mValorSIGS.trim(),
          ValorHomologar: this.mValorHomologar == null ? null : this.mValorHomologar.trim(),
          ValorHomologar2: this.mValorHomologar2 == null ? null : this.mValorHomologar2.trim(),
          ValorHomologar3: this.mValorHomologar3 == null ? null : this.mValorHomologar3.trim(),
          ValorIntegrar: this.mValorIntegrar == null ? null : this.mValorIntegrar.trim(),
          Activo: this.mActivoDetalle == null ? null : this.mActivoDetalle,
          DetalleEliminado: this.mDetalleEliminado == null ? false : this.mDetalleEliminado
        }
      );
    }
    if (nuevo) {
      this.closeHomologacion('mdDetalle');
    }
    else {
      this.mMuestraActualizacion = 0;
    }
  }

  limpiarDetalle() {
    this.mValorSIGS = '';
    this.mValorHomologar = '';
    this.mValorHomologar2 = '';
    this.mValorHomologar3 = '';
    this.mValorIntegrar = '';
    this.mActivoDetalle = true;
    this.mDetalleEliminado = false;
    this.limpiarValidacionesDetalle();
  }

  limpiarCabecera() {
    this.mIdHomologacion = 0;
    this.mEsCatalogo = true;
    this.mCatalogoTabla = '';
    this.mCodigoHomologacion = '';
    this.mtextCatalogoTabla = "";
    this.mNombre = '';
    this.mDescripcion = '';
    this.mActivo = true;
    this.mExisteSigs = true;
    this.limpiarValidaciones();
  }

  limpiarValidaciones() {
    this.validCatalogoTabla = false;
    this.validTextCatalogoTabla = false;
    this.validCodigoHomologacion = false;
    this.validNombre = false;
  }

  limpiarValidacionesDetalle() {
    this.validValorSIGS = false;
    this.validValorHomologar = false;
    this.validValorIntegrar = false;
  }

  fieldCss(form: FormGroup, field: string) {
    return {
      'is-valid': (this.submitted && form.controls[field].valid) || (form.controls[field].valid && form.controls[field].dirty),
      'is-invalid': (this.submitted && form.controls[field].invalid) || (form.controls[field].invalid && form.controls[field].dirty) || ((form.controls[field].invalid && form.controls[field].pristine) && (!this.comun.isEmpty(form.controls[field].value)))
    };
  }

  homologacionYDetalle(idHomologacion): any {
    this.detalleEliminados = [];
    this.limpiarValidaciones();
    this.limpiarValidacionesDetalle();
    this.subscriptionHomologacion.add(
      this.obtenerHomologacionYDetalle(idHomologacion).subscribe(registro => {
        const registros = registro[0];
        this.mIdHomologacion = registros[1].IdHomologacion;
        this.mEsCatalogo = registros[1].EsCatalogo;
        this.mExisteSigs = registros[1].ExisteEnSIGS;

        if (!this.mEsCatalogo || !this.mExisteSigs) {
          this.mCatalogoTabla = "";
          this.mtextCatalogoTabla = registros[1].CatalogoTabla;
        }
        else {
          this.mCatalogoTabla = registros[1].CatalogoTabla;
          this.mtextCatalogoTabla = "";
        }

        this.mCodigoHomologacion = registros[1].CodigoHomologacion;
        this.mNombre = registros[1].Nombre;
        this.mDescripcion = registros[1].Descripcion;
        this.mActivo = registros[1].Activo;
        this.detalle = registros[0];
        this.cargarData.emit(false);

      }, error => {
        this.alertify.error("No hay respuesta del servidor.<br> Vuelva a intentar más tarde.");
        this.cargaFallida();
      }));
    return false;
  }

  obtenerHomologacionYDetalle(idHomologacion): any {
    const lurl = `${config.sigsHomologacion.dominio}${config.sigsHomologacion.lista.obtenerCabeceraDetalle}${config.sigsHomologacion.lista.tokenUsuario}${this.token}&${config.sigsHomologacion.lista.idHomologacion}${idHomologacion}`;
    const response = this.crud.obtener(lurl);
    return forkJoin([response]);
  }

  actualizar() {
    if (this.mIdHomologacion === 0)
    {
      if (!this.guardarPrevio(0)) return;
      this.grid.instance.cancelEditData();
      this.mNuevo = false;
    }
    else{
      if (!this.validarHomologación()) return;
      this.guardarPrevio(this.mIdHomologacion);
    }
  }

  iniciarEdicion(e) {

    this.mTituloForm = "Editar Registro";

    this.mMuestraActualizacion = 0;
    this.homologacionYDetalle(e.data.IdHomologacion);

    this.formSize();

  }

  actualizarDetalle(index, estaActualizando = false, e = null) {



    this.mTituloFormAnterior = this.mTituloForm;
    this.mTituloForm = "Editar Detalle";
    this.asignarTitulo(this.mPopUpForm);
    this.mValorSIGS = this.detalle[index].ValorSIGS;
    this.mValorHomologar = this.detalle[index].ValorHomologar;
    this.mValorHomologar2 = this.detalle[index].ValorHomologar2;
    this.mValorHomologar3 = this.detalle[index].ValorHomologar3;
    this.mValorIntegrar = this.detalle[index].ValorIntegrar;
    this.mActivoDetalle = this.detalle[index].Activo;
    if (estaActualizando) {
      this.mMuestraActualizacion = 1;
      this.mActualizaDetalle = index;
    }
    else {
      this.openHomologacion('mdDetalle', index);
    }

    this.formSize(1);

  }

  onShowing(e: any) {
    if (this.mPopUpForm == null) this.mPopUpForm = e;
    this.asignarTitulo(this.mPopUpForm);
  }

  asignarTitulo(e: any) {
    e.component.option("title", this.mTituloForm);
  }

  cancelarEdicion() {
    this.grid.instance.cancelEditData();
    this.mNuevo = false;
  }

  eliminar() {
    const lurl = `${config.sigsHomologacion.dominio}${config.sigsHomologacion.lista.delete}${config.sigsHomologacion.lista.tokenUsuario}${this.token}&${config.sigsHomologacion.lista.idHomologacionRecibido}${this.mIdHomologacion}`;
    this.guardar(this.mIdHomologacion, lurl);
  }

  guardarPrevioDetalleActualiza() {
    this.guardarPrevioDetalle(false);
    this.formSize(2);
  }

  nuevoDetalleActualiza() {

    this.mTituloFormAnterior = this.mTituloForm;
    this.mTituloForm = "Nuevo Detalle";
    this.asignarTitulo(this.mPopUpForm);
    this.mActualizaDetalle = -1;
    this.limpiarDetalle();
    this.mMuestraActualizacion = 1;
    this.formSize(1);
  }

confirmarEliminacion(index = -1) {

    let mensaje = "";
    let titulo = "";
    if (index === -1)
    {
      mensaje = "Esta homologación se eliminará de forma permanente.<br>¿Está seguro?";
      titulo = "Eliminar Homologación";
    }
    else
    {
      mensaje = "El detalle se eliminará de forma permanente.<br>¿Está seguro?";
      titulo = "Eliminar Detalle";
    }

    this.subscription.add(


      this.comun.confirmDialog(titulo, mensaje).subscribe(valido => {
        if (valido) {
          if (index === -1) {
            this.eliminar();
          }
          else {
            if (this.mIdHomologacion !== 0 &&
              this.detalle[index].IdDetalleHomologacion !== undefined &&
              this.detalle[index].IdDetalleHomologacion !== 0) {
              this.detalleEliminados.push(
                {
                  IdDetalleHomologacion: this.detalle[index].IdDetalleHomologacion
                }
              );
            }
            this.eliminarFila(index);
          }
        } else {
          this.alertify.error("Eliminación cancelada");
        }
      }));
  }

  eliminarFila(index) {
    const oldData = this.detalle[index];
    oldData.DetalleEliminado = true;
    this.detalle.splice(index, 1, oldData);
    $(`#fila_${index}`).children('td, th').css('background-color', '#f39ea7');
  }


  buscarHomologaciones(value)
  {
    this.grid.instance.clearFilter("row");
    this.grid.instance.searchByText(this.mBuscar.trim());
  }

  nuevaHomologacion()
  {
    this.mTituloForm = "Nuevo Registro";
    this.mNuevo = true;
    this.openHomologacion('mdHomologacion');
    this.mMuestraActualizacion = 0;
    this.grid.instance.addRow();
  }

  keyUpBusqueda()
  {
    if (this.mBuscar.trim().length == 0) this.limpiarBusqueda();
  }

  limpiarBusqueda()
  {
    this.mBuscar = "";
    this.getHistorial();
    this.buscarHomologaciones(this.mBuscar);
  }

  formSize(detalle: number = 0)
  {
    let lHeight = 0;

    if (detalle === 0 || detalle === 2)
    {
      lHeight = this.obtenerHeight();
    }
    else
    {
      lHeight = 560;
    }
    this.mPopUpForm.component.option("height", lHeight);
  }

  obtenerHeight(): number
  {
    if (!this.mEsCatalogo && !this.mExisteSigs)
    {
      return 535;
      this.alertify.error("No permite ésta combinación.");
    }
    else
    {
      if (!this.mEsCatalogo && !this.mExisteSigs) this.alertify.error("No permite ésta combinación.");
      return 670;
    }
  }
}

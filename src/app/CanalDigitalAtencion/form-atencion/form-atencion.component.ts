import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { FrmAtencion } from 'src/app/models/canal-digital/frm-atencion';
import { FormService, ComunService, CRUDService } from 'src/app/shared/services';
import { Subscription, Observable, forkJoin } from 'rxjs';
import { Base } from 'src/app/shared/AppDominio';
import { config } from 'src/app/shared/servicios.config';
import { ReCaptcha2Component } from 'ngx-captcha/public_api';
import { Constantes } from 'src/app/models';
import { ReCaptchaV3Service } from 'ngx-captcha';
import { ActivatedRoute, Router } from '@angular/router';
import { EncrDecrService } from 'src/app/shared/services/encryDecryService';

declare var $;

@Component({
  selector: 'app-form-atencion',
  templateUrl: './form-atencion.component.html',
  styleUrls: ['./form-atencion.component.scss'],
})
export class FormAtencionComponent implements OnInit, OnDestroy {

  @ViewChild('captchaElem', { static: false }) captchaElem: ReCaptcha2Component;

  private subscription: Subscription = new Subscription();
  frmAtencion: FormGroup;
  frmErrorAtencion = FrmAtencion.camposVacios();
  btnObj = { equipo: "", estado: Constantes.EstadosCanalDigital[3] };
  constructor(private router: Router, private reCaptchaV3Service: ReCaptchaV3Service, private formService: FormService, private comun: ComunService, private http: CRUDService, private aroute: ActivatedRoute, private cifrar: EncrDecrService) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
  }

  imgUrlPacial = "assets/img/";
  nombreImg = "PAGNOVA";
  urlImg = "";
  imgDefault = `${this.imgUrlPacial}${this.nombreImg}.png`;
  submitted = false;
  cargando = false;
  cargarLogo = false;
  inactivarCampos = false;
  keyCaptcha = config.keyCaptcha;
  keyCaptchaV3 = config.keyCaptchaV3;
  tokenSistema: string = null;
  public captchaIsLoaded = false;
  public captchaSuccess = false;
  public captchaIsExpired = false;
  public captchaResponse?: string;

  private CodigoSistema = "";

  recaptcha: string;

  contactoCanalDigital: FrmAtencion;

  listaEquipos: any[];
  listaProvincia: any[];
  listaCanton: any[];
  listaRamo: any[];
  verCmbxRamo = false;
  linkWhereby = "#";

  ngOnInit() {
    this.cargando = true;
    config.TieneCaptcha ? this.inicializarCaptcha("INIT") : null;
    $(() => {
      $('[data-toggle="tooltip"]').tooltip();
    });
    this.contactoCanalDigital = new FrmAtencion();
    this.inicializarFormularios();
    this.recibirParametro();
  }

  recibirParametro() {
    const { tokenSistema, tokenUsuario } = this.aroute.snapshot.params;
    this.tokenSistema = tokenSistema ? tokenSistema : null;
    if (tokenSistema) {
      this.tokenSistema = this.cifrar.decode64(tokenSistema)
      this.http.setHearder(this.tokenSistema)
    }
    if (tokenUsuario && tokenSistema) this.leerDatosCliente(this.cifrar.decode64(tokenUsuario));
    this.catalogos();
  }

  obtenerUrlImg() {
    this.cargarLogo = true;
    this.http.obtener(`${Base.integracionRest}${config.sigsIntg.canalDigital.codigoSistema}`).subscribe((response: any) => {
      if (response && response?.IsSuccess) {
        this.urlImg = `${this.imgUrlPacial}${response.Data}.png`;
      } else {
        this.urlImg = this.imgDefault;
      }
      this.cargarLogo = false;
    }, error => {
      this.urlImg = this.imgDefault;
      this.cargarLogo = false;
    }
    );
  }

  leerDatosCliente(tokenUsuario: string) {
    this.http.obtener(`${Base.integracionRest}${config.sigsIntg.canalDigital.contacto.obtenerDatos}${tokenUsuario}`).subscribe((response: any) => {
      if (!this.comun.isEmptyObject(response)) {
        if (response.IsSuccess) {
          this.inactivarCampos = true;
          this.llenarDatosCliente(response.Data[0]);
        }
      }
      this.cargando = false;
    }, error => {
      this.cargando = false;
    }
    );
  }
  llenarDatosCliente(data) {
    this.frmAtencion.get('Identificacion').setValue(data.Identificacion);
    this.frmAtencion.get('Nombres').setValue(data.PrimerNombre + " " + data.SegundoNombre);
    this.frmAtencion.get('Apellidos').setValue(data.PrimerApellido + " " + data.SegundoApellido);
    this.frmAtencion.get('Mail').setValue(data.EmailPersonal);
    this.frmAtencion.get('NumeroCelular').setValue(data.TelefonoMovil);
  }
  setValorBtn(valor: string) {
    this.btnObj.equipo = valor;
  }

  confirmSave() {
    this.submitted = true;
    if (this.frmAtencion.invalid) return;
    this.contactoCanalDigital = this.frmAtencion.value;
    this.contactoCanalDigital.TipoIdentificacion = "C";
    this.contactoCanalDigital.Atendido = false;
    this.contactoCanalDigital.Respuesta = "";
    this.contactoCanalDigital.Estado = this.btnObj.estado;
    config.TieneCaptcha ? this.inicializarCaptcha("BTN", this.contactoCanalDigital) : this.guardarContacto(this.contactoCanalDigital);
  }

  inicializarCaptcha(bandera: string, modeloContacto?) {
    this.cargando = true;
    this.reCaptchaV3Service.executeAsPromise(this.keyCaptchaV3, 'FormularioContacto', {
      useGlobalDomain: false // optional
    }).then(tokenRes => {
      this.frmAtencion.patchValue({
        recaptcha: tokenRes
      });
      bandera === "BTN" ? this.validarTokenCatpcha({ token: tokenRes }, modeloContacto) : this.cargando = false;
    });
  }

  validarTokenCatpcha(obj, modeloContacto) {
    this.subscription.add(
      this.http.post(`${Base.integracionRest}${config.sigsIntg.canalDigital.validarCapcha}`, obj).subscribe((response: any) => {
        if (!this.comun.isEmptyObject(response)) {
          if (response.IsSuccess) {
            this.guardarContacto(modeloContacto);
          } else {
            this.cargando = false;
            alert("No se puedo completar la solicitud. Intente nuevamente");
          }
        } else {
          this.cargando = false;
          alert("No se puedo completar la validación del captcha. Intente nuevamente");
        }
      }, error => { this.cargando = false; }));
  }
  modeloAtencion:any;
  guardarContacto(modeloContacto) {
    this.http.post(`${Base.integracionRest}${config.sigsIntg.canalDigital.contacto.add}`, modeloContacto).subscribe((response) => {
      if (!this.comun.isEmptyObject(response)) {
        this.submitted = false;
        if (response.IsSuccess) {
          this.modeloAtencion = response.Data;
          this.linkWhereby = this.modeloAtencion.Valor;
          this.cargando = false;
          this.open("mdVideoChat");
        } else {
          this.cargando = false;
          this.comun.confirmDialog("", response.Message, true).subscribe();
        }
      }
    }, error => {
      this.cargando = false;
      alert("No hay repuesta del servicio, Intente nuevamente");
    });
  }

  aceptarLlamada() {
    this.modeloAtencion.Valor = Constantes.EstadosCanalDigital[0];
    this.cambiarEstados(this.modeloAtencion).subscribe((editar: any) => {
      this.cargando = false;
    });
    if (!this.inactivarCampos) {
      this.limpiarFrm();
    }
    this.close('mdVideoChat');
  }

  rechazarLlamada() {
    this.cargando = true;
    this.modeloAtencion.Valor = "Contacto rechazo videollamada.";
    this.respuestaContacto(this.modeloAtencion).subscribe(respuesta => {
      this.cargando = false;
    });
    this.close('mdVideoChat');
  }

  open(modalID) {
    this.comun.openClose(modalID, 'show');
  }

  close(modalID) {
    this.comun.openClose(modalID, 'hide');
  }

  cambiarEstados(obj) {
    return new Observable(observer => {
      this.subscription.add(
        this.http.put(`${Base.integracionRest}${config.sigsIntg.canalDigital.editarEstado}`, obj).subscribe((response: any) => {
          observer.next(response);
        }));
    });
  }

  respuestaContacto(obj) {
    return new Observable(observer => {
      this.subscription.add(
        this.http.put(`${Base.integracionRest}${config.sigsIntg.canalDigital.contacto.respuesta}`, obj).subscribe((response: any) => {
          observer.next(response);
        }));
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  inicializarFormularios() {
    this.frmAtencion = this.formService.generar(FrmAtencion.elementosForm());
    this.subscription.add(
      this.frmAtencion.valueChanges.subscribe((data) => {
        this.frmErrorAtencion = this.formService.validateForm(this.frmAtencion, this.frmErrorAtencion, FrmAtencion.mensajeCampos(), true);
      }));
  }

  isFieldValid(form: FormGroup, field: string) {
    return (this.submitted && form.controls[field].invalid || (form.controls[field].invalid && form.controls[field].dirty) ||
      ((form.controls[field].invalid && form.controls[field].pristine) && (!this.comun.isEmpty(form.controls[field].value))));
  }

  fieldCss(form: FormGroup, field: string) {
    return {
      'is-valid': (this.submitted && form.controls[field].valid) || (form.controls[field].valid && form.controls[field].dirty),
      'is-invalid': (this.submitted && form.controls[field].invalid) || (form.controls[field].invalid && form.controls[field].dirty) || ((form.controls[field].invalid && form.controls[field].pristine) && (!this.comun.isEmpty(form.controls[field].value)))
    };
  }

  removeSpaces(e) {
    return this.comun.noEspacio(e);
  }

  validarEntrada(event) {
    return this.comun.letrasNum(event);
  }

  validarSoloNumer(event) {
    return this.comun.isNumberKey(event);
  }

  limpiarFrm() {
    this.frmAtencion.reset();
    this.contactoCanalDigital = new FrmAtencion();
    this.frmAtencion.patchValue({
      Equipo: "",
      IdCanton: "",
      IdProvincia: "",
      CodigoRamo: "",
    });
    this.verCmbxRamo = false;
    this.limpiarValidacion();
  }

  obtenerCatalogos(): Observable<any> {
    const cat_equipos = this.http.obtener(`${Base.integracionRest}${config.sigsIntg.canalDigital.equipo.equiposActivos}`);
    const cat_provincias = this.http.obtener(`${Base.integracionRest}${config.sigsIntg.canalDigital.catalogos.provincias}`);
    const cat_ramos = this.http.obtener(`${Base.integracionRest}${config.sigsIntg.canalDigital.catalogos.ramos}`);
    const objCodigoSistema = this.http.obtener(`${Base.integracionRest}${config.sigsIntg.canalDigital.codigoSistema}`);
    return forkJoin([cat_equipos, cat_provincias, cat_ramos, objCodigoSistema]);
  }

  catalogos() {
    this.listaEquipos = new Array<any>();
    this.cargando = true;
    this.subscription.add(
      this.obtenerCatalogos().subscribe(catalogos => {
        let lista = catalogos[0]?.IsSuccess ? catalogos[0].Data : [];
        this.listaProvincia = catalogos[1];
        this.listaRamo = catalogos[2];
        let nombre = catalogos[3]?.IsSuccess ? catalogos[3].Data : "";
        this.verificarSistemaMenta(catalogos[3]?.IsSuccess, nombre, lista);
        this.cargando = false;
      }, error => {
        this.urlImg = this.imgDefault;
        alert("No hay respuesta del servidor. Vuelva a intentar más tarde.");
        this.cargando = false;
      }));
  }

  verificarSistemaMenta(isOk: boolean, codigoSistema: string, lista: any[]) {
    if (isOk) {
      this.CodigoSistema = codigoSistema;
      this.urlImg = `${this.imgUrlPacial}${codigoSistema}.png`;
    } else {
      this.CodigoSistema = "";
      this.urlImg = this.imgDefault;
    }
    if (this.CodigoSistema === "MENTA") {
      this.listaEquipos = lista.filter((x) => x.CodigoEquipoCanalDigital.includes("MENTA"))
    } else {
      this.listaEquipos = lista.filter((x) => !x.CodigoEquipoCanalDigital.includes("MENTA"))
    }
  }

  obtenerCanton() {
    this.listaCanton = new Array<any>();
    if (!this.comun.isEmpty(this.frmAtencion.value.IdProvincia)) {
      this.cargando = true;
      this.listaCanton = new Array<any>();
      this.subscription.add(
        this.http.obtener(`${Base.integracionRest}${config.sigsIntg.canalDigital.catalogos.cantones}${this.frmAtencion.value.IdProvincia}`).subscribe((response: any) => {
          this.listaCanton = response;
          this.cargando = false;
        }, error => {
          this.cargando = false;
          alert("No hay repuesta del servicio, Intente nuevamente")
        }));
    }

  }

  mostrarRamo() {
    if (!this.comun.isEmpty(this.frmAtencion.value.Equipo) && this.frmAtencion.value.Equipo !== "BTNDOS") {
      this.validarControl();
      this.verCmbxRamo = true;
    } else {
      this.limpiarValidacion();
      this.frmAtencion.get('CodigoRamo').setValue("");
      this.verCmbxRamo = false;
    }
  }

  validarControl() {
    this.frmAtencion.get("CodigoRamo").setValidators([Validators.nullValidator, Validators.required])
    this.frmAtencion.get("CodigoRamo").updateValueAndValidity();
  }

  limpiarValidacion() {
    this.frmAtencion.get("CodigoRamo").clearValidators();
    this.frmAtencion.get("CodigoRamo").updateValueAndValidity();
  }

}

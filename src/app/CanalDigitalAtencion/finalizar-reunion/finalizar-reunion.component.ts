import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ComunService, FormService, CRUDService, AlertifyService } from 'src/app/shared/services';
import { FrmReunion, ModeloReunion } from 'src/app/models/canal-digital/frm-atencion';
import { Subscription, interval, Observable } from 'rxjs';
import { Base } from 'src/app/shared/AppDominio';
import { config } from 'src/app/shared/servicios.config';
import { TimeagoIntl } from 'ngx-timeago';
import { strings as espanolStrings } from 'ngx-timeago/language-strings/es';
import { Constantes, Response } from 'src/app/models';
import { Router, ActivatedRoute } from '@angular/router';
import { EncrDecrService } from 'src/app/shared/services/encryDecryService';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-finalizar-reunion',
  templateUrl: './finalizar-reunion.component.html',
  styleUrls: ['./finalizar-reunion.component.scss'],
})
export class FinalizarReunionComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();
  frmErrorReunion = FrmReunion.camposVacios();

  dataProductos = new MatTableDataSource<any>();

  columnsZonas: string[] = ['NombreRamo', 'NombreProducto', 'PlanContratado', 'Costo', 'NombrePeriodicidad', 'InicioVigencia'];

  listaReunionCanal: any[];
  listaProducto: any[];
  listaNotify: any[];
  cargando: boolean;
  submitted = false;
  verNotificaciones = false;
  minimo: Date;
  maximo: Date;
  modeloReunion: ModeloReunion;
  modeloReunionResumen: ModeloReunion;
  disponible = false;

  modalName = "mdEditar";
  Estado = Constantes.EstadosCanalDigital;
  SOLICIDADO = Constantes.EstadosCanalDigital[0];
  ENPROCESO = Constantes.EstadosCanalDigital[1];
  intervalId: number;
  segundos = 1000 * 5;
  contarNotificacion = 0;

  public FormIdentificacion: FormGroup;

  activarSonido = false;

  public formGroup = new FormGroup({
    EstadoReunion: new FormControl(null, [Validators.required]),
    Nota: new FormControl(null, [])
  });


  constructor(private cifrar: EncrDecrService, private router: Router, private aroute: ActivatedRoute, private msj: AlertifyService, private comun: ComunService, private formService: FormService, private http: CRUDService, private intl: TimeagoIntl) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
    intl.strings = espanolStrings;
    intl.changes.next();
  }

  ngOnInit(): void {
    const source = interval(this.segundos);
    this.subscription = source.subscribe(val => this.opensnack());
    this.modeloReunion = new ModeloReunion();
    this.modeloReunionResumen = new ModeloReunion();
    this.listaReunionCanal = new Array<any>();
    this.listaProducto = new Array<any>();
    this.listaNotify = new Array<any>();
    this.inicializarFormularios();
    this.recibirParametro();
  }

  recibirParametro() {
    const { tokenUsuario, asesorCedula } = this.aroute.snapshot.params;
    if (asesorCedula && tokenUsuario) {
      this.http.setHearder(tokenUsuario);
      const identificacion = this.cifrar.decode64(asesorCedula);
      this.asesorDisponibleEnLinea(identificacion);
      this.FormIdentificacion.patchValue({ Identificacion: identificacion });
      this.validarAsesor();
    }
  }

  opensnack() {
    if (this.disponible) {
      this.FormIdentificacion.value?.Identificacion ? this.obtenerReunionesParaNotificacion(this.Estado[0]) : console.log("Sin cedula");
    }
  }

  editarRegistro() {
    this.open(this.modalName);
    this.formGroup.patchValue({
      EstadoReunion: Constantes.EstadosCanalDigital[4],
    });
  }

  removeSpaces(e) {
    return this.comun.noEspacio(e);
  }

  validarEntrada(event) {
    return this.comun.letrasNum(event);
  }

  validarAsesor() {
    this.cargando = true;
    this.modeloReunionResumen = new ModeloReunion();
    this.validarAsesorYObtenerReuniones(this.Estado[1]).subscribe((response: any) => {
      if (!this.comun.isEmptyObject(response)) {
        if (response.IsSuccess) {
          response.Data.length > 0 ? this.modeloReunionResumen = response.Data[0] : this.modeloReunionResumen = new ModeloReunion();
          this.listaReunionCanal = response.Data;
        } else {
          this.modeloReunionResumen = new ModeloReunion();
        }
      }
      this.cargando = false;
    }, error => {
      this.cargando = false;
      this.msj.error(error.error);
      this.listaReunionCanal = new Array<any>();
    });
  }

  devolverEquipoMensaje() {
    let mensaje = "";
    switch (this.modeloReunionResumen.Nota) {
      case 'BTNUNO':
        mensaje = Constantes.EquipoCanalDigital[0];
        break;
      case 'BTNDOS':
        mensaje = Constantes.EquipoCanalDigital[1];
        break;
      default:
        mensaje = "";
        break;
    }
    return mensaje;
  }

  obtenerReunionesParaNotificacion(estado: string) {
    this.validarAsesorYObtenerReuniones(estado).subscribe((response: any) => {
      if (!this.comun.isEmptyObject(response)) {
        if (response.IsSuccess) {
          this.listaNotify = response.Data;
          this.contarNotificacion = response.Data.length;
          this.reproducir();
        } else {
          this.listaNotify = new Array<any>();
          this.contarNotificacion = 0;
        }
      }
    }, error => {
      this.listaNotify = new Array<any>();
      this.msj.error(error.error);
      this.contarNotificacion = 0;
    });
  }

  private validarAsesorYObtenerReuniones(estado: string) {
    return new Observable(observer => {
      this.http.obtener(`${Base.integracionRest}${config.sigsIntg.canalDigital.validarAsesor}${this.FormIdentificacion.value.Identificacion}/${estado}`).subscribe((response: any) => {
        observer.next(response);
      }, error => this.msj.error(error.error));
    });
  }


  cambiarEstadoStandByLibre(e) {
    this.cargando = true;
    const estado = e.checked ? Constantes.EstadosCanalDigital[3] : Constantes.EstadosCanalDigital[5];
    this.http.obtener(`${Base.integracionRest}${config.sigsIntg.canalDigital.asesor.standbyLibre}${this.FormIdentificacion.value.Identificacion}/${estado}`).subscribe((response: any) => {
      if (!this.comun.isEmptyObject(response)) {
        if (response.IsSuccess) {
          this.msj.message(response.Message);
        } else {
          this.disponible = !e.checked;
          this.msj.message(response.Message);
        }
        this.cargando = false;
      }
    }, error => {
      this.cargando = false;
      this.disponible = !e.checked;
    });
  }


  asesorDisponibleEnLinea(identificacion: string) {
    this.cargando = true;
    this.http.obtener(`${Base.integracionRest}${config.sigsIntg.canalDigital.asesor.disponible}${identificacion}`).subscribe((response: any) => {
      if (!this.comun.isEmptyObject(response)) {
        if (response.IsSuccess) {
          this.disponible = response.Data;
          this.msj.message(response.Message);
        } else {
          this.disponible = false;
          this.msj.message(response.Message);
        }
        this.cargando = false;
      }
    }, error => {
      this.cargando = false;
      this.disponible = false;
    });
  }

  private inicializarFormularios() {
    this.FormIdentificacion = this.formService.generar(FrmReunion.elementosForm());
    this.subscription.add(
      this.FormIdentificacion.valueChanges.subscribe((data) => {
        this.frmErrorReunion = this.formService.validateForm(this.FormIdentificacion, this.frmErrorReunion, FrmReunion.mensajeCampos(), true);
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

  cancelar() {
    this.formGroup.reset();
    this.close(this.modalName);
  }

  private open(modalID) {
    this.comun.openClose(modalID, 'show');
  }

  private close(modalID) {
    this.comun.openClose(modalID, 'hide');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    console.log("Cerrado");
  }

  fechatALong(fecha) {
    return new Date(fecha).getTime();
  }

  verLista() {
    this.verNotificaciones = this.verNotificaciones ? false : true;
  }

  abrirNotificacion(obj) {
    this.modeloReunionResumen = obj;
    this.verLista();
    this.cargando = true;
    this.http.obtener(`${Base.integracionRest}${config.sigsIntg.canalDigital.contacto.productos}${this.modeloReunionResumen.Identificacion}`).subscribe((response: Response) => {
      this.dataProductos.data = response?.IsSuccess ? response.Data : [];
      this.cargando = false;
    }, error => {this.msj.error(error.error); this.cargando = false; });
  }

  cerrarSalaCanalDigital() {
    this.modeloReunionResumen.EstadoReunion = this.formGroup.value.EstadoReunion;
    this.modeloReunionResumen.Nota = this.formGroup.value.Nota;
    const tmpModelo = Object.assign({}, this.modeloReunionResumen);
    tmpModelo.Nombres = Constantes.EstadosCanalDigital[3];
    this.cargando = true;
    this.cambiarEstadoReunion(tmpModelo).subscribe((response: any) => {
      if (!this.comun.isEmptyObject(response)) {
        if (response.IsSuccess) {
          this.modeloReunionResumen = new ModeloReunion();
          this.msj.message(response.Message);
          this.close(this.modalName);
          this.dataProductos.data = [];
        }
      }
      this.cargando = false;
    }, error => this.cargando = false);
  }

  volverAsalaReunion() {
    window.open(this.modeloReunionResumen.URLSala, "_blank");
  }

  abrirSalaCanalDigital() {
    window.open(this.modeloReunionResumen.URLSala, "_blank");
    const tmpModelo = Object.assign({}, this.modeloReunionResumen);
    tmpModelo.EstadoReunion = Constantes.EstadosCanalDigital[1];
    tmpModelo.Nota = "";
    tmpModelo.Nombres = Constantes.EstadosCanalDigital[2];
    this.cambiarEstadoReunion(tmpModelo).subscribe((response: any) => {
      if (!this.comun.isEmptyObject(response)) {
        if (response.IsSuccess) {
          this.modeloReunionResumen.EstadoReunion = Constantes.EstadosCanalDigital[1];
          this.msj.message(response.Message);
        }
      }
    });
  }

  cambiarEstadoReunion(modeloReunion) {
    return new Observable(observer => {
      this.http.post(`${Base.integracionRest}${config.sigsIntg.canalDigital.reunion.cambiarEstado}`, modeloReunion).subscribe((response: any) => {
        observer.next(response);
      });
    });
  }

  reproducir() {
    const audio = new Audio('assets/notify/iphone-notificacion.mp3');
    audio.play();
  }

  sonidoOn() {
    this.activarSonido = true;
    const audio = new Audio('assets/notify/iphone-notificacion.mp3');
    audio.play();
  }

}

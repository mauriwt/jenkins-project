import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AlertifyService, ComunService, CRUDService, RSAHelperService } from 'src/app/shared/services';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Base } from 'src/app/shared/AppDominio';
import { config } from 'src/app/shared/servicios.config';
import { EncrDecrService } from 'src/app/shared/services/encryDecryService';
import { ClaveValor } from 'src/app/models';

declare var $;
@Component({
  selector: 'app-pestania',
  templateUrl: './pestania.component.html',
  styleUrls: ['./pestania.component.scss'],
})
export class PestaniaComponent implements OnInit, OnDestroy {

  @ViewChild('codeInput') codeInput: any;

  public solicitudBody: ClaveValor;

  private plantilla = {
    templateCode: "RUCAPRORECH",
    groupCode: "NOVA",
    parameters: [
      {
        "name": "asunto",
        "value": ""
      },
      {
        "name": "email_asesor",
        "value": ""
      },
      {
        "name": "email_aprobador",
        "value": ""
      },
      {
        "name": "nombre_aprobador",
        "value": ""
      },
      {
        "name": "ruc_emp",
        "value": ""
      },
      {
        "name": "nombre_emp",
        "value": ""
      },
      {
        "name": "fecha_emp",
        "value": ""
      },
      {
        "name": "accion_respuesta",
        "value": ""
      }
    ],
    "message": null,
    "attacheds": null
  };

  private plantillaCodigo = {
    templateCode: "CODEVERIFY",
    groupCode: "NOVA",
    parameters: [
      {
        "name": "default_value",
        "value": ""
      },
      {
        "name": "mailDestino",
        "value": ""
      }
    ],
    "message": null,
    "attacheds": null
  };
  public settings = {
    length: 4,
    numbersOnly: true,
    timer: 120,
    timerType: 1
  }
  default_titulo = "";
  caption = "";
  visible = false;
  estados = ['S', 'P', 'A', 'R'];
  titulos = {
    S: () => { this.default_titulo = 'Solicitudes de creación de clientes'; this.caption = ""; this.visible = false; },
    P: () => { this.default_titulo = 'Solicitudes Pendientes', this.caption = 'Revisado Por', this.visible = true; },
    A: () => { this.default_titulo = 'Solicitudes Aprobadas', this.caption = 'Aprobado Por', this.visible = true; },
    R: () => { this.default_titulo = 'Solicitudes Rechazadas', this.caption = 'Rechazado Por', this.visible = true; },
  };

  accionBoton = {
    P: { asunto: 'Corregir información', detalle: 'Por favor verifique el nombre del cliente, y vuelva a enviar la solicitud', smspopup: 'Enviar a corregir' },
    A: { asunto: 'Aprobación de solicitudes.', detalle: 'La solicitud de creación del cliente fue aprobada', smspopup: 'Aprobar solicitud' },
    R: { asunto: 'Rechazo de solicitudes.', detalle: 'La solicitud de creación del cliente fue rechazada', smspopup: 'Rechazar solicitud' }
  };

  private subscription: Subscription = new Subscription();

  listaSolicitudes: any[];
  cargando: boolean;
  private nombre_aprobador: string;
  private email_aprobador: string;

  constructor(private crud: CRUDService, private comun: ComunService, private notify: AlertifyService, private aroute: ActivatedRoute, private cifrar: EncrDecrService, private rsaHelper: RSAHelperService) {
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });
  }

  ngOnInit() {
    this.recibirParametro();
  }

  validArray(array) {
    return array.length === 4;
  }

  recibirParametro() {
    this.subscription.add(
      this.aroute.params.subscribe(param => {
        if (param.token) {
          try {
            const paremetros = this.cifrar.decode64(param.token);
            const lista = paremetros.split('|');
            this.gestionarValores(lista);
          } catch (error) {
            this.comun.confirmDialog("Error al procesar", "Refresque la página e intente nuevamente", true).subscribe(s => window.location.reload());
            throw new Error(error);
          }
        }
      }));
  }

  gestionarValores(args: any[]) {
    if (this.validArray(args)) {
      if (this.rsaHelper.verifySing(`${args[0]}|${args[1]}|${args[2]}`, args[3])) {
        this.crud.setHearder(args[0]);
        this.nombre_aprobador = args[1];
        this.email_aprobador = args[2];
        this.generateCode()
        this.comun.openClose("mdVerificacionCode", "show");
      }else{
        this.comun.confirmDialog("Alerta", "Se detecto modificaciones en la dirección de la página.", true).subscribe(validar => {
          window.location.reload();
        });
      }
    } else {
      this.comun.confirmDialog("Parámetros incorrectos", "Refresque la página e intente nuevamente", true).subscribe(estado => {
        window.location.reload();
      });
    }
  }

  getTitulo(estado: string) {
    this.titulos[estado]();
  }

  setState(input: string) {
    this.getTitulo(input);
    this.getRequestByState(input);
  }

  getRequestByState(currectState) {
    this.cargando = true;
    this.crud.obtener(`${Base.integracionRest}${config.sigsIntg.oracle.getByState}${currectState}`).subscribe((response: any) => {
      this.cargando = false;
      this.listaSolicitudes = response;
    }, error => {
      this.cargando = false;
      this.notify.openSnackBar('Error de conexión', 'Intente nuevamente.');
    });
  }

  getRow(item, estado) {
    this.subscription.add(
      this.comun.confirmDialog(this.accionBoton[estado].smspopup, "¿Seguro que desea realizar esta acción?", false).subscribe(valida => {
        if (valida) {
          let accion = {
            ID: item.ID,
            ESTADO: estado,
            APROBADOR: this.nombre_aprobador,
            APROBADOR_EMAIL: this.email_aprobador
          }

          const dateNew = new Date(item.FECHA_EMP);
          this.plantilla.parameters = this.updateParams(this.plantilla.parameters, 'asunto', this.accionBoton[estado].asunto);
          this.plantilla.parameters = this.updateParams(this.plantilla.parameters, 'email_asesor', item.EMAIL_SOLICITANTE);
          this.plantilla.parameters = this.updateParams(this.plantilla.parameters, 'email_aprobador', item.APROBADOR_EMAIL);
          this.plantilla.parameters = this.updateParams(this.plantilla.parameters, 'nombre_aprobador', this.comun.tildesAHtmlCode(this.nombre_aprobador));
          this.plantilla.parameters = this.updateParams(this.plantilla.parameters, 'ruc_emp', item.RUC);
          this.plantilla.parameters = this.updateParams(this.plantilla.parameters, 'nombre_emp', this.comun.tildesAHtmlCode(item.NOMBRE_EMP));
          this.plantilla.parameters = this.updateParams(this.plantilla.parameters, 'fecha_emp', dateNew.toLocaleDateString('en-GB'));
          this.plantilla.parameters = this.updateParams(this.plantilla.parameters, 'accion_respuesta', this.comun.tildesAHtmlCode(this.accionBoton[estado].detalle));
          this.procesarConfirmacion(accion, this.plantilla);
        }
      }));
  }


  procesarConfirmacion(objAcion, plantilla) {
    this.crud.post(`${Base.integracionRest}${config.sigsIntg.oracle.changeState}`, objAcion).subscribe((response: any) => {
      if (response.IsSuccess) {
        this.getRequestByState(this.estados[0]);
        this.sendEmail(plantilla);
        this.notify.message(response.Message);
      } else {
        this.notify.warning(response.Message);
      }
      this.cargando = false;
    }, error => {
      this.cargando = false;
      this.notify.error('Error de conexión, Intente nuevamente.');
    });
  }

  updateParams(lista, clave, valor) {
    return lista.map(obj => {
      if (obj.name === clave) {
        return { ...obj, value: valor };
      }
      return obj;
    });
  }

  sendEmail(plantilla) {
    this.crud.post(`${Base.notifyModule}${config.notifyModule.services.sendEmail}`, plantilla).subscribe();
  }

  notifyCodeEmail(plantilla) {
    this.crud.post(`${Base.integracionRest}${config.sigsIntg.oracle.notify}`, plantilla).subscribe(respose => respose);
  }

  public onInputChange(e) {
    if (e.length == this.settings.length) {
      const codesms = this.cifrar.decryptar(localStorage.getItem('pacay'));
      if (codesms == e) {
        this.comun.openClose("mdVerificacionCode", "hide");
        this.getTitulo(this.estados[0]);
        this.getRequestByState(this.estados[0]);
      } else {
        this.notify.message("Código incorrecto");
      }
    } else if (e == -1) {
      this.codeInput.otpForm.reset()
      localStorage.removeItem('pacay');
    } else if (e == -2) {
      this.generateCode();
    }
  }

  generateCode() {
    const smscode = this.comun.verificationCode();
    localStorage.setItem('pacay', this.cifrar.encryptar(smscode));

    this.plantillaCodigo.parameters = this.updateParams(this.plantillaCodigo.parameters, 'default_value', smscode);
    this.plantillaCodigo.parameters = this.updateParams(this.plantillaCodigo.parameters, 'mailDestino', this.email_aprobador);

    const aesKeyValue = this.cifrar.aesKey();
    let body = new ClaveValor();
    body.key = this.rsaHelper.encrypt(aesKeyValue);
    body.values = this.cifrar.encryptCshap(JSON.stringify(this.plantillaCodigo), aesKeyValue);
    this.notifyCodeEmail(body);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

import { Validators } from '@angular/forms';
import { ValidarCedula } from 'src/app/shared/services/cedula.validator';
import { ExpRegular } from '../regex';

export class FrmAtencion {
  public IdContactoCanalDigital: number;
  public TipoIdentificacion: string;
  public Identificacion: string;
  public Apellidos: string;
  public Nombres: string;
  public Mail: string;
  public NumeroCelular: string;
  public Atendido: boolean;
  public Respuesta: string;
  public FechaCreacion: Date;
  public UsuarioAfectacion: string;
  public SistemaAfectacion: string;
  public HostUsuario: string;
  public Equipo: string;
  public Estado: string;
  public recaptcha: string;
  public IdProvincia: number;
  public IdCanton: number;
  public CodigoRamo: string;
  valido: boolean;

  constructor() { }

  public static elementosForm() {
    return [
      { tipo: 'text', id: 'Identificacion', validar: [Validators.nullValidator, Validators.required] },
      { tipo: 'text', id: 'Nombres', validar: [Validators.nullValidator, Validators.required, Validators.pattern(ExpRegular.nombresCanalDigital)] },
      { tipo: 'text', id: 'Apellidos', validar: [Validators.nullValidator, Validators.required, Validators.pattern(ExpRegular.nombresCanalDigital)] },
      { tipo: 'text', id: 'Mail', validar: [Validators.nullValidator, Validators.required, Validators.email] },
      { tipo: 'text', id: 'NumeroCelular', validar: [Validators.nullValidator, Validators.required, Validators.pattern(ExpRegular.telfCelular)] },
      { tipo: 'text', id: 'recaptcha', validar: [] },
      { tipo: 'select', id: 'Equipo', validar: [Validators.nullValidator, Validators.required] },
      { tipo: 'select', id: 'IdProvincia', validar: [Validators.nullValidator, Validators.required] },
      { tipo: 'select', id: 'IdCanton', validar: [Validators.nullValidator, Validators.required] },
      { tipo: 'select', id: 'CodigoRamo', validar: [] },
    ];
  }

  public static camposVacios() {
    return {
      Identificacion: '',
      Nombres: '',
      Apellidos: '',
      Mail: '',
      NumeroCelular: '',
      recaptcha: '',
      Equipo: '',
      IdProvincia: '',
      IdCanton: '',
      CodigoRamo: ''
    };
  }

  public static mensajeCampos() {

    return [
      { id: 'Identificacion', pattern: '', maxLength: '' },
      { id: 'Nombres', pattern: ExpRegular.mletrasCanal, maxLength: '' },
      { id: 'Apellidos', pattern: ExpRegular.mletrasCanal, maxLength: '' },
      { id: 'Mail', pattern: '', maxLength: '' },
      { id: 'NumeroCelular', pattern: 'El número celular no tiene un formato válido.', maxLength: '' },
      { id: 'recaptcha', pattern: '', maxLength: '' },
      { id: 'Equipo', pattern: '', maxLength: '' },
      { id: 'IdProvincia', pattern: '', maxLength: '' },
      { id: 'IdCanton', pattern: '', maxLength: '' },
      { id: 'CodigoRamo', pattern: '', maxLength: '' },
    ];
  }
}

export class FrmReunion {
  public Identificacion: string;
  constructor() { }
  public static elementosForm() {
    return [
      { tipo: 'text', id: 'Identificacion', validar: [Validators.nullValidator, Validators.required, ValidarCedula] },
    ];
  }

  public static camposVacios() {
    return {
      Identificacion: '',
    };
  }

  public static mensajeCampos() {
    return [
      { id: 'Identificacion', pattern: '', maxLength: '' },
    ];
  }

}

export class ModeloReunion {
  IdReunionCanalDigital: number;
  IdAsesorCanalDigital: number;
  IdSalaCanalDigital: number;
  IdContactoCanalDigital: number;
  FechaHoraInicio: Date;
  FechaHoraFin: any;
  EstadoReunion: string;
  Nota: string;
  Identificacion: string;
  Apellidos: string;
  Nombres: string;
  Mail: string;
  NumeroCelular: string;
  URLSala: string;
}

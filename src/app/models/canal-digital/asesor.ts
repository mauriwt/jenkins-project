import { Validators } from '@angular/forms';

export class Asesor {
  Activo: boolean;
  EstadoOcupacion: string;
  IdAsesorCanalDigital: number;
  IdEquipoCanalDigital: number;
  IdUsuario: number;

  DatoAsesores: any[];
  constructor() { }

  public static formControlNames() {
    return [
      { tipo: 'checkbox', id: 'Activo', validar: [Validators.nullValidator, Validators.required] },
      { tipo: 'text', id: 'IdEquipoCanalDigital', validar: [Validators.nullValidator, Validators.required] },
      { tipo: 'text', id: 'EstadoOcupacion', validar: [Validators.nullValidator, Validators.required] },
      { tipo: 'number', id: 'IdUsuario', validar: [Validators.nullValidator, Validators.required] },
    ];
  }

  public static emptyControlNames() {
    return {
      IdEquipoCanalDigital: '',
      EstadoOcupacion: '',
      IdUsuario: '',
      Activo: '',
    };
  }
  public static msjControlNames() {

    return [
      { id: 'IdEquipoCanalDigital', pattern: '', maxLength: '' },
      { id: 'EstadoOcupacion', pattern: '', maxLength: '' },
      { id: 'IdUsuario', pattern: '', maxLength: '' },
      { id: 'Activo', pattern: '', maxLength: '' },
    ];
  }
}

export class DatoAsesor {
  IdDatoAsesorCanalDigital: number;
  IdAsesorCanalDigital: number;
  IdZonaEquipoCanalDigital: number;
  CodigoRamo: number;
  CodigoSegmento: number;
  Activo: boolean;

  constructor() { }

  public static formControlNames() {
    return [
      { tipo: 'number', id: 'IdZonaEquipoCanalDigital', validar: [Validators.nullValidator, Validators.required] },
      { tipo: 'text', id: 'CodigoRamo', validar: [Validators.nullValidator, Validators.required] },
      { tipo: 'text', id: 'CodigoSegmento', validar: [Validators.nullValidator, Validators.required] },
    ];
  }

  public static emptyControlNames() {
    return {
      IdZonaEquipoCanalDigital: '',
      CodigoRamo: '',
      CodigoSegmento: '',
    };
  }
  public static msjControlNames() {

    return [
      { id: 'IdZonaEquipoCanalDigital', pattern: '', maxLength: '' },
      { id: 'CodigoRamo', pattern: '', maxLength: '' },
      { id: 'CodigoSegmento', pattern: '', maxLength: '' }
    ];
  }

}

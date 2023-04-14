import { Validators } from "@angular/forms";

export class Homologacion {

  IdHomologacion: number;
  EsCatalogo: boolean;
  CatalogoTabla: string;
  textCatalogoTabla: string;
  CodigoHomologacion: string;
  Nombre: string;
  Descripcion: string;
  Activo: boolean;

  constructor() { }

  public static campos() {
    return [

      { tipo: 'checkbox', id: 'EsCatalogo', validar: [] },
      { tipo: 'select', id: 'CatalogoTabla', validar: [Validators.nullValidator, Validators.required] },
      { tipo: 'text', id: 'textCatalogoTabla', validar: [Validators.nullValidator, Validators.required] },
      { tipo: 'text', id: 'CodigoHomologacion', validar: [Validators.nullValidator, Validators.required] },
      { tipo: 'text', id: 'Nombre', validar: [Validators.nullValidator, Validators.required] },
      { tipo: 'textarea', id: 'Descripcion', validar: [] },
      { tipo: 'checkbox', id: 'Activo', validar: [] },

    ];
  }

  public static fieldEmpty() {
    return {

      EsCatalogo: '',
      CatalogoTabla: '',
      textCatalogoTabla: '',
      CodigoHomologacion: '',
      Nombre: '',
      Descripcion: '',
      Activo: ''
    };
  }
  public static getCampos() {

    return [
      { id: 'EsCatalogo', pattern: '', maxLength: '' },
      { id: 'CatalogoTabla', pattern: '', maxLength: '' },
      { id: 'textCatalogoTabla', pattern: '', maxLength: '' },
      { id: 'CodigoHomologacion', pattern: '', maxLength: '' },
      { id: 'Nombre', pattern: '', maxLength: '' },
      { id: 'Descripcion', pattern: '', maxLength: '' },
      { id: 'Activo', pattern: '', maxLength: '' },
    ];
  }
}

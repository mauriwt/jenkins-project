import { Validators } from '@angular/forms';

export class Direccion {
    Activo: boolean
    Bloque: string;
    CallePrincipal: string;
    CalleSecundaria: string;
    CodigoCanton: string;
    CodigoPais: string;
    CodigoProvincia: string;
    CodigoPostal: string;
    CoordenadasGPS: string;
    EsPrincipal: boolean;
    FechaCreacion: Date;
    HostUsuario: string;
    IdCliente: number;
    IdDireccionCliente: number;
    IdUbicacionGeografica: number;
    Numeracion: string;
    NumeroVivienda: string;
    Sector: string;
    SistemaAfectacion: string;
    SitioReferencia: string;
    TipoDireccion: string;
    Urbanizacion: string;
    UsuarioAfectacion: string;
    Validada: boolean;
    EntregaCorrespondencia: boolean;
    constructor() { }

    public static campos() {
        return [
            { tipo:'select', id: 'CodigoPais', validar: [Validators.nullValidator, Validators.required] },
            { tipo:'select', id: 'CodigoProvincia', validar: [Validators.nullValidator, Validators.required,] },
            { tipo:'select', id: 'CodigoCanton', validar: [Validators.nullValidator, Validators.required]},
            { tipo:'text', id: 'CallePrincipal', validar: [Validators.nullValidator, Validators.required] },
            { tipo:'text', id: 'CalleSecundaria', validar: [] },
            { tipo:'text', id: 'Numeracion', validar: [] },
            { tipo:'text', id: 'SitioReferencia', validar: [] },
            { tipo:'checkbox', id: 'EntregaCorrespondencia', validar: [] },
            { tipo:'select', id: 'TipoDireccion', validar: [Validators.nullValidator, Validators.required] },
            { tipo:'checkbox', id: 'EsPrincipal', validar: [] },           
            { tipo:'checkbox', id: 'Activo', validar: [] }           

        ];
    }

    public static fieldEmpty() {
        return {
            CodigoPais: '',
            CodigoProvincia: '',
            CodigoCanton: '',
            CallePrincipal: '',
            CalleSecundaria: '',
            Numeracion: '',
            SitioReferencia: '',
            EntregaCorrespondecia: '',
            TipoDireccion: '',
            EsPrincipal: '',
            Activo: ''
        };
    }
    public static getCampos() {

        return [
            { id: 'CodigoPais', pattern: '', maxLength: '' },
            { id: 'CodigoProvincia', pattern: '', maxLength: '' },
            { id: 'CodigoCanton', pattern: '', maxLength: '' },
            { id: 'CallePrincipal', pattern: '', maxLength: '' },
            { id: 'CalleSecundaria', pattern: '', maxLength: '' },
            { id: 'Numeracion', pattern: '', maxLength: '' },
            { id: 'SitioReferencia', pattern: '', maxLength: '' },
            { id: 'EntregaCorrespondencia', pattern: '', maxLength: '' },
            { id: 'TipoDireccion', pattern: '', maxLength: '' },
            { id: 'EsPrincipal', pattern: '', maxLength: '' },
            { id: 'Activo', pattern: '', maxLength: '' },
        ];
    }

}
import { Validators } from "@angular/forms";
import { ExpRegular } from './regex';
import { ValidarCedula } from '../shared/services/cedula.validator';
import { Direccion } from './DireccionCliente';
import { LocalizaciónCliente } from './localizacionCliente';
import { ContactoCliente } from './contactoCliente';
import {ValidarFecha} from '../shared/services/fecha.validator';

export class Cliente {
    CantonDomicilio: string;
    CantonTrabajo: string;
    DireccionCliente: Direccion[];
    DireccionDomicilio: string;
    DireccionTrabajo: string;
    EmailPersonal: string;
    EmailTrabajo: string;
    EsEmpresa: boolean;
    EsVIP: boolean;
    EstadoCivil: string;
    FechaConstitucion: Date;
    FechaNacimiento: Date;
    FuerzaVenta: string;
    Genero: string;
    IdCliente: number;
    IdPersona: number;
    IdContactoZoho: string;
    Identificacion: string;
    LocalizacionCliente: LocalizaciónCliente[];
    MovilPersonal: string;
    NombreJuridico: string;
    PaisDomicilio: string;
    PaisTrabajo: string;
    PrimerApellido: string;
    PrimerNombre: string;
    ProvinciaDomicilio: string;
    ProvinciaTrabajo: string;
    RazonSocial: string;
    Segmento: string;
    SegundoApellido: string;
    SegundoNombre: string;
    TelefonoDomicilio: string;
    TelefonoTrabajo: string;
    TipoIdentificacion: string;
    IdentificacionRepresentante: string;
    NombreRepresentante: string;
    NombreCompleto: string;
    ContactoCliente: ContactoCliente[];

    constructor() { }

    public static campos() {
        return [
            { tipo: 'select', id: 'TipoIdentificacion', validar: [Validators.nullValidator, Validators.required] },
            { tipo: 'text', id: 'Identificacion', validar: [Validators.nullValidator, Validators.required, ValidarCedula, ] },
            { tipo: 'text', id: 'PrimerNombre', validar: [Validators.nullValidator, Validators.required, Validators.pattern(ExpRegular.letras)] },
            { tipo: 'text', id: 'SegundoNombre', validar: [Validators.pattern(ExpRegular.letras)] },
            { tipo: 'text', id: 'PrimerApellido', validar: [Validators.nullValidator, Validators.required, Validators.pattern(ExpRegular.letras)] },
            { tipo: 'text', id: 'SegundoApellido', validar: [Validators.pattern(ExpRegular.letras)] },
            { tipo: 'select', id: 'Genero', validar: [Validators.nullValidator, Validators.required] },
            { tipo: 'select', id: 'EstadoCivil', validar: [Validators.nullValidator, Validators.required] },
            { tipo: 'text', id: 'TelefonoDomicilio', validar: [Validators.nullValidator, Validators.required, Validators.pattern(ExpRegular.numerominmax)] },
            { tipo: 'text', id: 'EmailPersonal', validar: [Validators.nullValidator, Validators.required, Validators.email] },
            { tipo: 'select', id: 'PaisDomicilio', validar: [Validators.nullValidator, Validators.required] },
            { tipo: 'select', id: 'ProvinciaDomicilio', validar: [Validators.nullValidator, Validators.required] },
            { tipo: 'select', id: 'CantonDomicilio', validar: [Validators.nullValidator, Validators.required] },
            { tipo: 'textarea', id: 'DireccionDomicilio', validar: [Validators.nullValidator, Validators.required] },
            { tipo: 'select', id: 'Segmento', validar: [Validators.nullValidator, Validators.required] },
            { tipo: 'select', id: 'FuerzaVenta', validar: [] },
            { tipo: 'checkbox', id: 'EsEmpresa', validar: [] },
            { tipo: 'checkbox', id: 'EsVIP', validar: [] },
            { tipo: 'date', id: 'FechaNacimiento', validar: [Validators.nullValidator, Validators.required, ValidarFecha] },
            { tipo: 'date', id: 'FechaConstitucion', validar: [] },
            { tipo: 'text', id: 'RazonSocial', validar: [] },
            { tipo: 'text', id: 'NombreJuridico', validar: [] },
            { tipo: 'text', id: 'NombreRepresentante', validar: [] },
        ];
    }

    public static fieldEmpty() {
        return {
            TipoIdentificacion: '',
            Identificacion: '',
            PrimerNombre: '',
            SegundoNombre: '',
            PrimerApellido: '',
            SegundoApellido: '',
            Genero: '',
            EstadoCivil: '',
            PaisDomicilio: '',
            ProvinciaDomicilio: '',
            CantonDomicilio: '',
            DireccionDomicilio: '',
            TelefonoDomicilio: '',
            EmailPersonal: '',
            Segmento: '',
            EsEmpresa: '',
            EsVIP: '',
            FuerzaVenta: '',
            FechaNacimiento: '',
            FechaConstitucion: '',
            RazonSocial: '',
            NombreJuridico: '',
            NombreRepresentante: ''
        };
    }
    public static getCampos() {

        return [
            { id: 'TipoIdentificacion', pattern: '', maxLength: '' },
            { id: 'Identificacion', pattern: 'Cédula ó RUC tiene carácteres no validos.', maxLength: '' },
            { id: 'PrimerNombre', pattern: ExpRegular.mletras, maxLength: '' },
            { id: 'SegundoNombre', pattern: ExpRegular.mletras, maxLength: '' },
            { id: 'PrimerApellido', pattern: ExpRegular.mletras, maxLength: '' },
            { id: 'SegundoApellido', pattern: ExpRegular.mletras, maxLength: '' },
            { id: 'DireccionDomicilio', pattern: '', maxLength: '' },
            { id: 'Genero', pattern: '', maxLength: '' },
            { id: 'EstadoCivil', pattern: '', maxLength: '' },
            { id: 'TelefonoDomicilio', pattern: ExpRegular.mtelf },
            { id: 'EmailPersonal', pattern: '', maxLength: '' },
            { id: 'PaisDomicilio', pattern: '', maxLength: '' },
            { id: 'ProvinciaDomicilio', pattern: '', maxLength: '' },
            { id: 'CantonDomicilio', pattern: '', maxLength: '' },
            { id: 'Segmento', pattern: '', maxLength: '' },
            { id: 'FuerzaVenta', pattern: '', minLength: '' },
            { id: 'EsVIP', pattern: '', maxLength: '' },
            { id: 'EsEmpresa', pattern: '', maxLength: '' },
            { id: 'FechaNacimiento', pattern: '', maxLength: '' },
            { id: 'FechaConstitucion', pattern: '', maxLength: '' },
            { id: 'RazonSocial', pattern: '', maxLength: '' },
            { id: 'NombreJuridico', pattern: '', maxLength: '' },
            { id: 'NombreRepresentante', pattern: '', maxLength: '' },
        ];
    }

}

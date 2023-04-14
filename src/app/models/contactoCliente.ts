import { Validators } from '@angular/forms';

export class ContactoCliente {
    IdContactoCliente: number;
    IdCliente: number;
    IdPersona: number;
    Identificacion: string;
    NombreContactoCliente: string;
    Parentesco: string;
    TelefonoMovil: string;
    TelefonoConvencional: string;
    Email: string;
    Direccion: string;
    Activo: boolean;
    FechaCreacion: Date;
    UsuarioAfectacion: string;
    SistemaAfectacion: string;
    HostUsuario: string;

    public static campos() {
        return [
            { tipo: 'text', id: 'NombreContactoCliente', validar: [Validators.nullValidator, Validators.required] },
            { tipo: 'select', id: 'Parentesco', validar: [Validators.nullValidator, Validators.required,] },
        ];
    }

    public static fieldEmpty() {
        return {
            NombreContactoCliente: '',
            Parentesco: ''
        };
    }
    public static getCampos() {

        return [
            { id: 'NombreContactoCliente', pattern: '', maxLength: '' },
            { id: 'Parentesco', pattern: '', maxLength: '' }
        ];
    }
}
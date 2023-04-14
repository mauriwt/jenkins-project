import { Validators } from "@angular/forms";

export class Documento {
    CodigoDetalleCatalogo: string;
    CodigoTipoEntidadDocumental: string;
    DescripcionDocumento: string;
    Directorio: string;
    EsFisico: true;
    Fecha: Date;
    IdCatalogo: number;
    IdImpresion: number;
    Nombre: string;
    NumeroDeItems: number;
    PermiteActualizar: boolean;
    PermiteEliminar: boolean;
    ReferenciaExterna: string;
    ReferenciaNegocio: string;
    UrlDirectorio: string;

    public static campos() {
        return [
            { id: 'CodigoTipoEntidadDocumental', validar: [Validators.nullValidator, Validators.required] },
            { id: 'CodigoDetalleCatalogo', validar: [Validators.nullValidator, Validators.required] },
            { id: 'file', validar: [Validators.nullValidator, Validators.required] },
            { id: 'Descripcion', validar: [] },
        ];
    }

    public static fieldEmpty() {
        return {
            CodigoTipoEntidadDocumental: '',
            CodigoDetalleCatalogo: '',
            file: '',
        };
    }
    public static getCampos() {

        return [
            { id: 'CodigoTipoEntidadDocumental', pattern: '', maxLength: '' },
            { id: 'CodigoDetalleCatalogo', pattern: '', maxLength: '' },
            { id: 'CodigoCanton', pattern: '', maxLength: '' },
            { id: 'file', pattern: '', maxLength: '' },
        ];
    }

    public static getCodigoDetalleCatalogo() {
        return ['CLI', 'CERT', 'SOLCANC', 'TODO'];
    }
}

export interface IArchivo {
    ReferenciaNegocio: string;
    ReferenciaExterna: string;
    CodigoFormulario: string;
    IdImpresion: number;
}

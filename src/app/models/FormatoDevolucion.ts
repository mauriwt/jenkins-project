import { Validators } from "@angular/forms";

export class FormatoDevolucion {
  file: string;

    public static campos() {
        return [
            { id: 'file', validar: [Validators.nullValidator, Validators.required] },
            
        ];
    }

    public static fieldEmpty() {
        return {
            file: '',
        };
    }
    public static getCampos() {

        return [            
            { id: 'file', pattern: '', maxLength: '' },
        ];
    }
  
}


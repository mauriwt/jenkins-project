import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { CRUDService, ComunService, AlertifyService } from 'src/app/shared/services';
import { ActivatedRoute } from '@angular/router';
import { Base } from 'src/app/shared/AppDominio';
import { config } from 'src/app/shared/servicios.config';
import CustomStore from 'devextreme/data/custom_store';

@Component({
  selector: 'app-resume-error',
  templateUrl: './resume-error.component.html',
  styleUrls: ['./resume-error.component.scss']
})
export class ResumeErrorComponent implements OnInit, OnChanges {

  private subscription: Subscription = new Subscription();

  @Input() token: string;

  tokenUsuario: string;
  origenes: any[];
  dataSourceResumen: any;
  cargando: boolean;
  opcionTipoEntidad: any;
  editButtonOptions: any;
  nombreArchivo = "RESUMEN_INTEGRACION_EMISION_ERROR_" + new Date().toISOString().substr(0, 10);

  constructor(private crud: CRUDService, private comun: ComunService, private notify: AlertifyService, private aroute: ActivatedRoute) { }

  ngOnInit() {
    this.opcionTipoEntidad = this.comun.opcionSelectBox("Origen");
    this.opcionTipoEntidad = this.comun.opcionSelectBox("Origen");
    this.obtenerOrigen(this.tokenUsuario);
    this.editButtonOptions = {
      widget: 'dxButton',
      location: 'before',
      options: {
        type: "default",
        stylingMode: "outlined",
        text: 'Refrescar',
        onClick: this.refrescarTabla.bind(this)
      }
    };
  }

  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(this.editButtonOptions);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.cargando = true;
    const userToken = changes.token;
    if (userToken !== undefined) {
      if (userToken.currentValue !== undefined) {
        this.tokenUsuario = userToken.currentValue;
        this.obtenerOrigen(this.tokenUsuario);
        //this.obtenerOrigen(this.tokenUsuario);
        this.getResumenError(userToken.currentValue);
      }
    }
  }


  recibirParametro() {
    this.subscription.add(
      this.aroute.params.subscribe(param => {
        if (param.token) {
          this.tokenUsuario = param.token;
          this.getResumenError(param.token);
        }
      }));
  }

  refrescarTabla() {
    this.getResumenError(this.tokenUsuario);
  }

  getResumenError(token) {
    this.dataSourceResumen = new CustomStore({
      key: "Id",
      load: () => {
        return this.crud.obtener(`${Base.integracionRest}${config.sigsIntg.integracionError.resumenError}${token}`).
          toPromise().then((response: any) => {
            this.cargando = false;
            return response;
          }).catch(error => { throw 'Fallo la carga de datos' });
      },
    });
  }

  obtenerOrigen(token) {
    this.crud.obtener(`${Base.integracionRest}${config.sigsIntg.integracionError.listaOrigen}${token}`).subscribe((listaOrigen: any) => {
      this.origenes = listaOrigen;
    });
  }

  calculateCellValue(data) {
    return data.TotalErrores - data.Solventados;
  }
}

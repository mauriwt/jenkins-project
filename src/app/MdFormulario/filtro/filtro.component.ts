import { Component, OnInit, Output, EventEmitter, Input, ViewChild, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { DxDataGridComponent } from "devextreme-angular";
import { ComunService, AlertifyService, CRUDService } from 'src/app/shared/services';
import { config } from 'src/app/shared/servicios.config';
declare var $;
@Component({
  selector: 'app-filtro',
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.scss'],
  providers: [ComunService]
})
export class FiltroComponent implements OnInit, OnChanges, OnDestroy {
  cargando: boolean = false;
  opcionFiltro: string = "auto";
  @ViewChild('grid') grid: DxDataGridComponent;
  @ViewChild('formBuq') form: any;
  private url = config.sigsIntg.dominio;
  dataSource: any;
  @Input() quienLlama: string;
  @Output() public parametro = new EventEmitter();
  @Output() public nuevoReg = new EventEmitter();
  @Output() public cambioBusqueda = new EventEmitter();
  tituloBtn: string = "";
  constructor(private comun: ComunService, private notifi: AlertifyService, private crud: CRUDService) {
    $(document).ready(function () {
      $('[data-toggle="popover"]').popover({
        title: '',
        content: `<div class="info-buscar"><p><b>Criterios de búqueda:</b></p>
        <p>Identificación/RUC: 1032932323</p><p>Cliente: LOPEZ LOPEZ LUIS GENARO</p>
        <p>Empresa: NOVA SEGUROS</p></div>`,
        html: true,
      });
    });
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    let quien = changes.quienLlama;
    if (quien !== undefined) {
      if (quien.currentValue !== undefined) {
        this.tituloBtn = quien.currentValue;
      }
    }
  }

  public getCedula(data) {
    switch (this.quienLlama) {
      case "popupCC":
      case "popoup":
        this.grid.instance.clearFilter("row");
        this.form.reset();
        this.dataSource = null;
        break;
      default:
        break;
    }
    this.parametro.emit({ identificacion: data.Identificacion, nombre: data.NombreCompleto, quien: this.quienLlama });
    this.quitarSeleccion();
  }

  buscarCoincidencia(value) {
    this.grid.instance.clearFilter("row");
    if (!this.comun.isEmptyObject(value)) {
      if (!this.comun.isEmpty(value.termino)) {
        let temp = value.termino.trim();
        if (!this.comun.isEmpty(temp) || temp.length > 4) {
          this.cambioBusqueda.emit(this.comun.makeid());
          this.cargando = true;
          this.crud.obtener(`${this.url}${config.sigsIntg.cancelacion.buscarXDniNombre}${temp}${config.sigsIntg.token}`).subscribe((response: any) => {
            this.dataSource = response;
            if (response.length == 0) {
              this.notifi.openSnackBar("No hubo resultados para ", temp);
            }
            this.cargando = false;
          });
        }
        else {
          this.notifi.warning("Ingrese algún criterio de búsqueda.");
        }
      } else {
        this.notifi.warning("Ingrese algún criterio de búsqueda.");
      }
    }
  }

  limpiar(frm) {
    $("input.dx-texteditor-input:text").val("");
    $("#buscador").val('');
    this.dataSource = null;
    this.cambioBusqueda.emit(this.comun.makeid());
    frm.reset();
  }
  nuevo(frm){
    this.limpiar(frm);
    this.nuevoReg.emit(true);
  }


  quitarSeleccion() {
    this.grid.instance.deselectAll();
    this.grid.instance.option("focusedRowIndex", -1);
  }

  validarEntrada(event) {
    return this.comun.validarEntrada(event);
  }

  ngOnDestroy(): void {
    this.tituloBtn = "";
  }
}

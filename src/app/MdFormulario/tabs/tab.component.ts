import { Component, OnInit, OnDestroy, Input, SimpleChanges } from '@angular/core';
import { ComunService } from 'src/app/shared/services';
declare var $;
@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
})
export class TabComponent implements OnInit, OnDestroy {
  @Input() desdeApp: string;
  desdeGrid
  ramdumValor: string;
  gcargando: boolean;
  constructor(private comun: ComunService) {
  }

  ngOnInit() {
    this.gcargando = true;
  }

  eventoEmitter(data) {
    if (data.quien === 'tab')
      $("#menu1_a").tab('show');
    this.desdeGrid = data;
  }

  frmVacio(opcion) {
    if (opcion)
      $("#menu1_a").tab('show');
  }

  detectarBusqueda(valor) {
    this.ramdumValor = valor;
  }

  cargarDataEmitter(valor) {
    this.gcargando = valor;
  }

  ngOnDestroy(): void {
    this.gcargando = true;
  }
}

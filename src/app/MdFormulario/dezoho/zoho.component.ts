import { Component, OnInit, OnDestroy } from '@angular/core';
import { ComunService } from 'src/app/shared/services';
declare var $;
@Component({
  selector: 'app-zoho',
  templateUrl: './zoho.component.html',
  styleUrls: ['./zoho.component.scss'],
})
export class ZohoComponent implements OnInit, OnDestroy {
  desdeGrid
  ramdumValor:string;
  gcargando:boolean;
  constructor(private comun: ComunService) {
  }

  ngOnInit() {
    this.gcargando = true;
  }

  eventoEmitter(data) {
    if(data.quien==='tab')
      $("#menu1_a").tab('show');
    this.desdeGrid = data;
  }
  
  detectarBusqueda(valor){
    this.ramdumValor = valor;
  }

  cargarDataEmitter(valor){
    this.gcargando = valor;
  }

  ngOnDestroy(): void {
    this.gcargando = true;
  }
}

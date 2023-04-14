import { Component, OnInit, OnDestroy, Input, SimpleChanges } from '@angular/core';
import { ComunService } from 'src/app/shared/services';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
declare var $;
@Component({
  selector: 'app-tab-error',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
})
export class TabErrorComponent implements OnInit, OnDestroy {
  @Input() desdeApp: string;
  desdeGrid
  ramdumValor:string;
  gcargando:boolean;
  tokenUsuario: string;

  private subscription: Subscription = new Subscription();

  constructor(private comun: ComunService, private aroute: ActivatedRoute) {
  }

  ngOnInit() {
    this.recibirParametro();
  }


  recibirParametro() {
    this.subscription.add(
      this.aroute.params.subscribe(param => {
        if (param.token) {
          this.tokenUsuario = param.token;
        }
      }));
  }

  eventoEmitter(data) {
    if(data.quien==='tab')
      $("#menu1_a").tab('show');
    this.desdeGrid = data;
  }

  frmVacio(opcion){
    if(opcion)
      $("#menu1_a").tab('show');
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

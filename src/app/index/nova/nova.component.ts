import { Component, OnInit } from '@angular/core';
import { Base } from 'src/app/shared/AppDominio';

@Component({
  selector: 'app-nova',
  templateUrl: './nova.component.html',
  styleUrls: ['./nova.component.scss']
})
export class NovaComponent implements OnInit {

  private slideImg = "assets/img/";
  private cantidad = 4;
  public carusel: string[];

  urlDocumento = Base.formCanalDigital;


  constructor() { }

  ngOnInit() {
    this.carusel = new Array<string>();
    this.generarRutaImg();
  }

  generarRutaImg(){
    for (let index = 0; index < this.cantidad; index++) {
      const img = index + 1;
      this.carusel.push(this.slideImg + img + ".jpg");
    }
  }
}















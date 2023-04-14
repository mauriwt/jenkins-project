import { Component, OnInit } from '@angular/core';
import { CRUDService, FormService, ComunService, AlertifyService } from 'src/app/shared/services';
import { Base } from 'src/app/shared/AppDominio';
import { config } from 'src/app/shared/servicios.config';
import { FormGroup } from '@angular/forms';
import { Asesor } from 'src/app/models/canal-digital/asesor';
import { Subscription } from 'rxjs';
import { Constantes } from 'src/app/models';
import { ActivatedRoute, Router } from '@angular/router';
declare var $;

@Component({
  selector: 'app-crud-asesor-sala',
  templateUrl: './crud-asesor-sala.component.html',
  styleUrls: ['./crud-asesor-sala.component.scss']
})
export class CrudAsesorSalaComponent implements OnInit {

  cargando = false;
  listaEquipo = new Array<any>();
  constructor(private aroute: ActivatedRoute, private http: CRUDService, private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
   }

  ngOnInit(): void {
    this.http.setHearder(this.aroute.snapshot.params.token);
    this.obtenerEquipos();
  }

  private obtenerEquipos() {
    this.cargando = true;
    this.http.obtener(`${Base.integracionRest}${config.sigsIntg.canalDigital.equipo.catalogo}`).
      subscribe((response: any) => {
        this.listaEquipo = response?.IsSuccess ? response.Data : [];
        this.cargando = false;
      }, error => {
        alert(error.error);
        this.cargando = false;
      });
  }

}

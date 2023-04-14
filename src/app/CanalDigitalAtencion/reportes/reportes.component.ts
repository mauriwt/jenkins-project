import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import CustomStore from 'devextreme/data/custom_store';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { Response } from 'src/app/models';
import { Base } from 'src/app/shared/AppDominio';
import { AlertifyService, ComunService, CRUDService } from 'src/app/shared/services';
import { config } from 'src/app/shared/servicios.config';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();

  dataSource: any;
  dataSourcePerdidas: any;
  cargando = false;
  listaLamadas: any[];
  listaTotalLlmadas: any[];
  listaRamos: any[];
  listaSegmentos: any[];
  listaEquipo: any[];

  frmFiltro: FormGroup;
  diasAntes = new Date();
  now: Date = new Date();
  min: Date = new Date(1900, 0, 1);
  fileName = "Reporte_Llamadas";

  constructor(private fb: FormBuilder, private router: Router, private aroute: ActivatedRoute, private http: CRUDService, private msj: AlertifyService, private comun: ComunService) {

    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };

    this.diasAntes.setDate(this.diasAntes.getDate() - 30);
    this.diasAntes.setHours(0, 0, 0, 0);

    this.frmFiltro = fb.group({
      IdEquipoCanalDigital: ['', Validators.required],
      FechaInicio: [this.diasAntes, Validators.required],
      FechaFin: [new Date(new Date().setHours(0, 0, 0, 0)), Validators.required],
      EstadoReunion: [],
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.http.setHearder(this.aroute.snapshot.params.token);
    this.catalogos();
  }


  realizarBusqueda() {
    if (this.frmFiltro.invalid) return;
    this.obtenerLlamadasFiltro();
  }

  private obtenerLlamadasFiltro(): void {
    this.cargando = true;
    this.listaTotalLlmadas = new Array<any>();
    this.http.post(`${Base.integracionRest}${config.sigsIntg.canalDigital.totalLlamadasFiltro}`, this.frmFiltro.value).subscribe((response: any) => {
      this.listaTotalLlmadas = response;
      this.cargando = false;
    }, error => { this.cargando = false; alert(error.error) });
  }

  public obtenerLlamadas(): void {
    this.cargando = true;
    this.listaTotalLlmadas = new Array<any>();
    this.http.obtener(`${Base.integracionRest}${config.sigsIntg.canalDigital.totalLlamadas}`).subscribe((response: any) => {
      this.listaTotalLlmadas = response;
      this.cargando = false;
    }, error => { this.cargando = false; alert(error.error) });
  }

  obtenerDetalle(Codigo: string, btn) {
    this.frmFiltro.get('EstadoReunion').setValue(Codigo);
    if (btn.getAttribute('aria-expanded') === "false") {
      switch (Codigo) {
        case 'FINALIZADO':
        case 'EXPIRADO':
          this.cargando = true;
          this.dataSource = new CustomStore({
            key: 'IdReunionCanalDigital',
            load: () => {
              return this.obtenerDetalleLlamadasFiltro();
            },
            loadMode: "raw",
          });
          this.fileName = Codigo === 'FINALIZADO' ? 'Reporte_Llamadas_Atendidas' : 'Reporte_Llamadas_no_Contestadas';
          break;
        default:
          this.cargando = false;
          this.dataSourcePerdidas = new CustomStore({
            key: 'Id',
            load: () => {
              return this.obtenerDetalleLlamadasPerdidas();
            },
            loadMode: "raw",
          });
          this.fileName = 'Reporte_Llamadas_Perdidas';
      }
    }
  }

  minutoHoras = (data) => {
    return this.comun.convertirHoraMin(data.DuracionLlamada)
  }

  obtenerDetalleLlamadasFiltro() {
    if (this.frmFiltro.invalid) {
      return this.http.obtener(`${Base.integracionRest}${config.sigsIntg.canalDigital.detalleLlamadas}${this.frmFiltro.value.EstadoReunion}`,).
        toPromise().then((response: any) => {
          this.cargando = false;
          return response;
        }).catch(error => { this.cargando = false; throw 'Fallo la carga de datos' });
    } else {
      return this.http.post(`${Base.integracionRest}${config.sigsIntg.canalDigital.detalleLlamadasFitro}`, this.frmFiltro.value).
        toPromise().then((response: any) => {
          this.cargando = false;
          return response;
        }).catch(error => { this.cargando = false; throw 'Fallo la carga de datos' });
    }
  }

  getCodigoEquipo(e) {
    let obj = this.listaEquipo.find(el => el.IdEquipoCanalDigital === e);
    this.frmFiltro.get('CodigoEquipo').setValue(obj?.CodigoEquipoCanalDigital);
  }

  obtenerDetalleLlamadasPerdidas() {
    return this.http.post(`${Base.integracionRest}${config.sigsIntg.canalDigital.detalleLlamadasPerdidas}`, this.frmFiltro.value).
      toPromise().then((response: any) => {
        this.cargando = false;
        return response;
      }, error => { this.cargando = false; throw 'Fallo la carga de datos' });
  }

  obtenerCatalogos(): Observable<any> {
    const cat_totalLlamadas = this.http.obtener(`${Base.integracionRest}${config.sigsIntg.canalDigital.totalLlamadas}`);
    const cat_equipos = this.http.obtener(`${Base.integracionRest}${config.sigsIntg.canalDigital.equipo.catalogo}`);
    const cat_ramos = this.http.obtener(`${Base.integracionRest}${config.sigsIntg.canalDigital.catalogos.ramos}`);
    const cat_segmentos = this.http.obtener(`${Base.integracionRest}${config.sigsIntg.canalDigital.catalogos.segmentos}`);

    //const cat_equipos = this.http.obtener(`${Base.integracionRest}${config.sigsIntg.canalDigital.equipo.catalogo}`);
    return forkJoin([cat_totalLlamadas, cat_equipos, cat_ramos, cat_segmentos]);
  }

  catalogos() {
    this.listaTotalLlmadas = new Array<any>();
    this.listaEquipo = new Array<any>();
    this.listaRamos = new Array<any>();
    this.listaSegmentos = new Array<any>();
    this.cargando = true;
    this.subscription.add(
      this.obtenerCatalogos().subscribe(catalogos => {
        this.listaTotalLlmadas = catalogos[0];
        const listOrin = catalogos[1]?.IsSuccess ? catalogos[1].Data : [];
        this.listaRamos = catalogos[2];
        this.listaSegmentos = catalogos[3];
        this.listaEquipo.push({ IdEquipoCanalDigital: -99, Nombre: "TODOS" })
        for (const item of listOrin) {
          this.listaEquipo.push({ IdEquipoCanalDigital: item.IdEquipoCanalDigital, Nombre: item.Nombre })
        }
        this.cargando = false;
      }, error => {
        alert("No hay respuesta del servidor. Vuelva a intentar más tarde.");
        this.cargando = false;
      }));
  }

}

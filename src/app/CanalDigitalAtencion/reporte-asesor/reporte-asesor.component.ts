import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import CustomStore from 'devextreme/data/custom_store';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { Base } from 'src/app/shared/AppDominio';
import { AlertifyService, ComunService, CRUDService } from 'src/app/shared/services';
import { config } from 'src/app/shared/servicios.config';

@Component({
  selector: 'app-reporte-asesor',
  templateUrl: './reporte-asesor.component.html',
  styleUrls: ['./reporte-asesor.component.scss']
})
export class ReporteAsesorComponent implements OnInit, OnDestroy {

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

  addButtonOptions: any;

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
    this.addButtonOptions = {
      widget: 'dxButton',
      location: 'after',
      options: {
        type: "default",
        stylingMode: "text",
        icon: 'pulldown',
        onClick: this.obtenerEstados.bind(this)
      }
    };
    this.http.setHearder(this.aroute.snapshot.params.token);
    this.catalogos();
    this.obtenerEstados();
  }

  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(this.addButtonOptions);
  }


  realizarBusqueda() {
    if (this.frmFiltro.invalid) return;
    this.obtenerEstados();
  }

  private obtenerEstados(): void {
    this.cargando = true;
    this.dataSource = new CustomStore({
      key: 'Id',
      load: () => {
        return this.obtenerEstadoAsesores();
      },
      loadMode: "raw",
    });
  }


  obtenerEstadoAsesores() {
    return this.http.post(`${Base.integracionRest}${config.sigsIntg.canalDigital.asesor.estados}`, this.frmFiltro.value).
      toPromise().then((response: any) => {
        this.cargando = false;
        return response;
      }).catch(error => { this.cargando = false; throw 'Fallo la carga de datos' });
  }

  obtenerCatalogos(): Observable<any> {
    const cat_equipos = this.http.obtener(`${Base.integracionRest}${config.sigsIntg.canalDigital.equipo.catalogo}`);
    return forkJoin([cat_equipos]);
  }

  catalogos() {
    this.listaEquipo = new Array<any>();
    this.cargando = true;
    this.subscription.add(
      this.obtenerCatalogos().subscribe(catalogos => {
        const listOrin = catalogos[0]?.IsSuccess ? catalogos[0].Data : [];
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

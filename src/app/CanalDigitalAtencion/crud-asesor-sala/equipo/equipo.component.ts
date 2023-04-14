import { Component, OnDestroy, OnInit } from '@angular/core';
import { CRUDService, FormService, ComunService, AlertifyService } from 'src/app/shared/services';
import { Base } from 'src/app/shared/AppDominio';
import { config } from 'src/app/shared/servicios.config';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Observable, of, Subscription } from 'rxjs';
import { Equipo } from 'src/app/models/canal-digital/equipo';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
declare var $;

@Component({
  selector: 'app-equipo',
  templateUrl: './equipo.component.html',
  styleUrls: ['./equipo.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class EquipoComponent implements OnInit, OnDestroy {

  isTableExpanded = false;

  dataStudentsList = new MatTableDataSource<any>();
  displayedStudentsColumnsList: string[] = ['actions', 'CodigoEquipoCanalDigital', 'Nombre', 'Descripcion', 'MensajeNoDisponibilidad', 'Activo'];
  columnsZonas: string[] = ['Acciones', 'NombreZona', 'Provincia', 'Activo'];
  columnsUbicaciones: string[] = ['IdUbicacionGeografica', 'Activo'];


  private subscription: Subscription = new Subscription();

  frmEquipo: FormGroup;
  frmErrorEquipo = Equipo.emptyControlNames();

  frmZonas: FormGroup;

  elementos = new FormControl();

  equipo: Equipo;

  //listaEquipos: any[];
  listaProvincias: any[];
  titulo = "Nuevo Registro";
  submitted = false;
  indexTmp = -1;
  idxZona = -1;
  cargando = false;
  tamanio = 1000;
  editaZona = false;
  constructor(private mjs: AlertifyService, private http: CRUDService, private formService: FormService, private comun: ComunService) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.equipo = new Equipo();
    //this.listaEquipos = new Array<any>();
    this.listaProvincias = new Array<any>();
    this.catalogos();
    this.inicializarFormularios();
  }

  toggleTableRows() {
    this.isTableExpanded = !this.isTableExpanded;

    this.dataStudentsList.data.forEach((row: any) => {
      row.isExpanded = this.isTableExpanded;
      row.ZonaEquipos.forEach((zona: any) => {
        zona.isExpanded = this.isTableExpanded;
      })
    })
  }


  getNombreProvincia(IdUbicacionGeografica) {
    let provincia = this.listaProvincias.find(u => +u.Codigo === IdUbicacionGeografica);
    return provincia ? provincia.Nombre : 'N/S';
  }

  public obtenerArbolEquipos() {
    this.isTableExpanded = false;
    this.cargando = true;
    this.http.obtener(`${Base.integracionRest}${config.sigsIntg.canalDigital.equipo.arbol}`).
      subscribe((response: any) => {
        this.dataStudentsList.data = response;
        this.cargando = false;
      }, error => {
        this.mjs.error(error.error);
        this.cargando = false;
      });
  }

  onEdit(fila, index) {
    this.titulo = "Editar Registro";
    this.equipo = new Equipo();
    this.indexTmp = index;
    Object.entries(fila).forEach(
      ([key, value]) => {
        this.equipo[key] = value;
      }
    );
    this.comun.openClose("mdEquipo", "show");
    this.frmEquipo.patchValue(this.equipo);
  }

  nuevaZona(idx) {
    this.editaZona = false;
    this.frmZonas.reset();
    this.comun.openClose("mdZona", "show");
    this.indexTmp = idx;
  }

  editarZona(idxe, idxz) {
    this.indexTmp = idxe;
    this.idxZona = idxz;
    this.editaZona = true;
    let zona = this.dataStudentsList.data[idxe].ZonaEquipos[idxz];
    let ubicaciones = new Array<string>();
    for (const ubi of zona.ZonaUbicaciones) {
      if (ubi.Activo)
        ubicaciones.push(`${ubi.IdUbicacionGeografica}`);
    }

    this.frmZonas.patchValue({
      NombreZona: zona.NombreZona,
      Provincias: ubicaciones
    })
    this.comun.openClose("mdZona", "show");
  }

  guardar() {
    if (this.frmZonas.valid) {
      let eq = this.dataStudentsList.data[this.indexTmp];
      if (!this.editaZona) {
        let ubicaciones = new Array<any>();
        let zonas = new Array<any>();
        for (const pro of this.frmZonas.value.Provincias) {
          let obj = {
            "IdZonaEquipoUbicacionGeografica": 0,
            "IdZonaEquipoCanalDigital": 0,
            "IdUbicacionGeografica": +pro,
            "Activo": true
          }
          ubicaciones.push(obj);
        }
        zonas.push({
          "IdEquipoCanalDigital": eq.IdEquipoCanalDigital,
          "NombreZona": this.frmZonas.value.NombreZona,
          "Activo": true,
          "isExpanded": false,
          "ZonaUbicaciones": ubicaciones
        })

        eq.ZonaEquipos = zonas;
        this.dbNuevaZona(eq)
      } else {
        let ubicaciones = new Array<any>();
        let actualUbi: any[] = [];
        actualUbi = eq.ZonaEquipos[this.idxZona].ZonaUbicaciones.map(item => {

          let ob = this.frmZonas.value.Provincias.find(p => item.IdUbicacionGeografica === +p)
          if (ob) {
            item.Activo = true;
          } else {
            item.Activo = false;
          }

          return item;
        });
        for (const pro of this.frmZonas.value.Provincias) {
          let dato = actualUbi.find(item => item.IdUbicacionGeografica === +pro);
          if (!dato) {
            ubicaciones.push({
              "IdZonaEquipoUbicacionGeografica": 0,
              "IdZonaEquipoCanalDigital": eq.ZonaEquipos[this.idxZona].IdZonaEquipoCanalDigital,
              "IdUbicacionGeografica": +pro,
              "Activo": true
            });
          }
        }
        eq.ZonaEquipos[this.idxZona].NombreZona = this.frmZonas.value.NombreZona;
        eq.ZonaEquipos[this.idxZona].ZonaUbicaciones = actualUbi.concat(ubicaciones);


        this.dataStudentsList.data.splice(this.indexTmp, 1, eq);

        let equipo = Object.assign({}, this.dataStudentsList.data[this.indexTmp]);
        let zona = Object.assign({}, equipo.ZonaEquipos[this.idxZona]);
        equipo.ZonaEquipos = []
        equipo.ZonaEquipos.push(zona)
        this.dbEditarZona(equipo);

      }
    } else {
      this.mjs.error("Llene todos los campos requeridos.");
    }

  }

  cancelarZona() {
    this.frmZonas.reset();
    this.comun.openClose("mdZona", "hide");
    this.indexTmp = -1;
    this.idxZona = -1;
  }

  dbNuevaZona(body) {
    this.cargando = true;
    this.http.post(`${Base.integracionRest}${config.sigsIntg.canalDigital.zona.insertar}`, body).subscribe((response: any) => {
      this.mensajeSala(response);
    }, error => {
      this.mjs.error(error.error);
      this.cargando = false;
    });
  }

  dbEditarZona(body) {
    this.cargando = true;
    this.http.post(`${Base.integracionRest}${config.sigsIntg.canalDigital.zona.editar}`, body).subscribe((response: any) => {
      this.mensajeSala(response);
    }, error => {
      this.mjs.error(error.error);
      this.cargando = false;
    });
  }

  revertir() {
    this.dataStudentsList.data = null;
    this.dataStudentsList = new MatTableDataSource(JSON.parse(localStorage.getItem("listaEquipo")));
  }

  guardarRegistro() {
    this.submitted = true;
    if (this.frmEquipo.valid) {
      if (this.comun.isEmptyObject(this.equipo)) {
        if (!this.verDuplicadoReg(this.frmEquipo.value, this.dataStudentsList.data)) {
          this.nuevoRegistro();
        } else {
          this.mjs.error("El código ingresado es duplicado, ingrese otro código.");
        }
      } else {
        const oldData = this.dataStudentsList.data[this.indexTmp];
        const tmpObj = {};
        Object.entries(this.frmEquipo.getRawValue()).forEach(
          ([key, value]) => {
            tmpObj[key] = oldData[key];
          }
        );
        if (JSON.stringify(this.frmEquipo.value) === JSON.stringify(tmpObj)) {
          this.cancelarEquipo();
        } else {
          if (oldData.CodigoEquipoCanalDigital === this.frmEquipo.value.CodigoEquipoCanalDigital) {
            Object.entries(this.frmEquipo.getRawValue()).forEach(
              ([key, value]) => {
                this.equipo[key] = value;
              }
            );
            this.editarRegistro(this.equipo);
          } else {
            if (!this.verDuplicadoReg(this.frmEquipo.value, this.dataStudentsList.data)) {
              Object.entries(this.frmEquipo.getRawValue()).forEach(
                ([key, value]) => {
                  this.equipo[key] = value;
                }
              );
              this.editarRegistro(this.equipo);
            }
            else {
              this.mjs.error("El código ingresado es duplicado, ingrese otro código.");
            }
          }
        }

      }
    } else {
      this.mjs.error("Llene todos los campos requeridos.");
    }
  }


  nuevoRegistro() {
    this.cargando = true;
    this.http.post(`${Base.integracionRest}${config.sigsIntg.canalDigital.equipo.insertar}`, this.frmEquipo.value).subscribe((response: any) => {
      this.mensajeSala(response);
    }, error => {
      this.mjs.error(error.error);
      this.cargando = false;
    });
  }

  editarRegistro(obj) {
    this.cargando = true;
    this.http.put(`${Base.integracionRest}${config.sigsIntg.canalDigital.equipo.editar}`, obj).subscribe((response: any) => {
      this.mensajeSala(response);
    }, error => {
      this.mjs.error(error.error);
      this.cargando = false;
    });
  }

  mensajeSala(response) {
    if (!this.comun.isEmptyObject(response)) {
      if (response.IsSuccess) {
        this.mjs.message(response.Message);
        this.cancelarEquipo();
        this.cancelarZona();
        this.obtenerArbolEquipos();
      } else {
        this.cargando = false;
        this.mjs.error(response.Message);
      }
    }
  }

  abrirmdEquipo() {
    this.titulo = "Nuevo Registro";
    this.frmEquipo.patchValue({
      Activo: true
    });
    this.comun.openClose("mdEquipo", "show");
  }

  cancelarEquipo() {
    this.frmEquipo.reset();
    this.comun.openClose("mdEquipo", "hide");
    this.submitted = false;
    this.equipo = new Equipo();
    this.indexTmp = -1;
  }


  inicializarFormularios() {
    this.frmEquipo = this.formService.generar(Equipo.formControlNames());
    this.subscription.add(
      this.frmEquipo.valueChanges.subscribe((data) => {
        this.frmErrorEquipo = this.formService.validateForm(this.frmEquipo, this.frmErrorEquipo, Equipo.msjControlNames(), true);
      }));

    this.frmZonas = new FormGroup({});
    this.frmZonas.addControl('NombreZona', new FormControl('', [Validators.nullValidator, Validators.required]));
    this.frmZonas.addControl('Provincias', new FormControl('', [Validators.nullValidator, Validators.required]));

  }

  isFieldValid(form: FormGroup, field: string) {
    return this.comun.isFieldValid(form, field, this.submitted);
  }

  fieldCss(form: FormGroup, field: string) {
    return this.comun.fieldCss(form, field, this.submitted);
  }

  verDuplicadoReg(obj, lista) {
    const duplicado = lista.find(item => item.CodigoEquipoCanalDigital === obj.CodigoEquipoCanalDigital);
    return duplicado ? true : false;
  }

  contador() {
    return `${this.frmEquipo.value.MensajeNoDisponibilidad?.length} de ${this.tamanio}`;
  }

  obtenerCatalogos(): Observable<any> {
    const cat_provincias = this.http.obtener(`${Base.integracionRest}${config.sigsIntg.canalDigital.catalogos.provincias}`);
    const cat_equipos = this.http.obtener(`${Base.integracionRest}${config.sigsIntg.canalDigital.equipo.arbol}`);
    return forkJoin([cat_provincias, cat_equipos]);
  }

  catalogos() {
    this.dataStudentsList = new MatTableDataSource();
    this.cargando = true;
    this.subscription.add(
      this.obtenerCatalogos().subscribe(catalogos => {
        this.listaProvincias = catalogos[0];
        this.dataStudentsList.data = catalogos[1];
        this.cargando = false;
      }, error => {
        alert("No hay respuesta del servidor. Vuelva a intentar más tarde.");
        this.cargando = false;
      }));
  }

}

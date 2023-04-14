import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { CRUDService, FormService, ComunService, AlertifyService } from 'src/app/shared/services';
import { Base } from 'src/app/shared/AppDominio';
import { config } from 'src/app/shared/servicios.config';
import { FormControl, FormGroup } from '@angular/forms';
import { Asesor, DatoAsesor } from 'src/app/models/canal-digital/asesor';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { Constantes, Response } from 'src/app/models';
declare var $;

@Component({
  selector: 'app-asesor',
  templateUrl: './asesor.component.html',
  styleUrls: ['./asesor.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AsesorComponent implements OnInit {

  @Input() listaEquipo: any[];
  private subscription: Subscription = new Subscription();
  private valorPrevio: number;

  listaAsesor: any[];
  listaUsuario: any[];
  listaRamos: any[];
  listaSegmentos: any[];
  listaZonas: any[];
  segmentosFiltro: any[];
  listaDatoAsesor: any[];
  listaDatoAsesorCopia: any[];

  frmAsesor: FormGroup;
  frmErrorAsesor = Asesor.emptyControlNames();

  frmDatoAsesor: FormGroup;
  frmErrorDatoAsesor = DatoAsesor.emptyControlNames();

  asesorObj: Asesor;

  submitted: boolean;
  verFrm = false;
  editarReg = false;
  asignarTodos: FormControl;

  titulo = "Nuevo Registro";
  indexTmp = -1;

  identificacionBusqueda: string;
  cargando = false;

  constructor(private mjs: AlertifyService, private http: CRUDService, private formService: FormService, private comun: ComunService) {
   }

  ngOnInit(): void {
    $(() => {
      $('[data-toggle="tooltip"]').tooltip();
    });
    this.asignarTodos = new FormControl('');
    this.asesorObj = new Asesor();
    this.listaUsuario = Array<any>();
    this.listaAsesor = new Array<any>();
    this.listaRamos = new Array<any>();
    this.listaZonas = new Array<any>();
    this.listaSegmentos = new Array<any>();
    this.segmentosFiltro = new Array<any>();
    this.listaDatoAsesor = new Array<any>();
    this.listaDatoAsesorCopia = new Array<any>();
    this.catalogos();
    this.inicializarFormularios();
  }

  public obtenerAsesores() {
    this.cargando = true;
    return this.http.obtener(`${Base.integracionRest}${config.sigsIntg.canalDigital.asesor.lista}`).
      subscribe((response: any) => {
        if (!this.comun.isEmptyObject(response)) {
          if (response.IsSuccess && response.Data) {
            this.listaAsesor = response.Data;
            this.listaAsesor.sort((a, b) => (a.Equipo < b.Equipo) ? 1 : -1);
          }
        }
        this.cargando = false;
      }, error => {
        this.mjs.error(error.error);
        this.cargando = false;
      });
  }

  buscarUsuario(identificacion: string) {
    if (identificacion.length >= 6) {
      this.cargando = true;
      this.http.obtener(`${Base.integracionRest}${config.sigsIntg.canalDigital.asesor.buscar}${identificacion}`).subscribe((response: any) => {
        if (!this.comun.isEmptyObject(response)) {
          if (response.IsSuccess && response.Data) {
            this.frmAsesor.patchValue({ IdUsuario: response.Data.IdUsuario });
            this.listaUsuario[0] = response.Data;
          } else {
            this.mjs.error(response.Message);
          }
        } else {
          this.mjs.error("No hay respuesta del servidor");
          this.frmAsesor.patchValue({ IdUsuario: null });
        }
        this.cargando = false;
      }, error => {
        this.mjs.error(error.error);
        this.cargando = false;
      });
    } else {
      this.mjs.error("Tiene que ingresar minimo 6 carácteres.");
    }
  }

  guardarRegistro() {
    this.submitted = true;
    if (this.frmAsesor.valid) {
      if (this.comun.isEmptyObject(this.asesorObj)) {
        if (!this.verDuplicadoReg(this.frmAsesor.value, this.listaAsesor)) {
          let tmpAsesor: Asesor = this.frmAsesor.value;
          tmpAsesor.DatoAsesores = this.listaDatoAsesor;
          this.nuevoRegistro(tmpAsesor);
        } else {
          this.mjs.error("El registro está duplicado, ingrese otro asesor");
        }
      } else {
        const oldData = this.listaAsesor[this.indexTmp];

        if (oldData.IdUsuario === this.frmAsesor.value.IdUsuario) {
          Object.entries(this.frmAsesor.getRawValue()).forEach(
            ([key, value]) => {
              this.asesorObj[key] = value;
            }
          );
          this.asesorObj.DatoAsesores = this.listaDatoAsesor.concat(this.listaDatoAsesorCopia);
          this.editarRegistro(this.asesorObj);
        } else {
          if (!this.verDuplicadoReg(this.frmAsesor.value, this.listaAsesor)) {
            Object.entries(this.frmAsesor.getRawValue()).forEach(
              ([key, value]) => {
                this.asesorObj[key] = value;
              }
            );
            this.asesorObj.DatoAsesores = this.listaDatoAsesor.concat(this.listaDatoAsesorCopia);
            this.editarRegistro(this.asesorObj);
          }
          else {
            this.mjs.error("El registro está duplicado, ingrese otro asesor");
          }
        }
      }
    } else {
      this.mjs.error("Llene todos los campos requeridos.");
    }

  }

  segmentoSelect() {
    const { CodigoRamo, IdZonaEquipoCanalDigital } = this.frmDatoAsesor.value;
    let segmentos = this.listaDatoAsesor.map(item => {
      if (item.CodigoRamo === CodigoRamo && item.IdZonaEquipoCanalDigital === +IdZonaEquipoCanalDigital) {
        return item.CodigoSegmento
      }
    });
    this.frmDatoAsesor.patchValue({ CodigoSegmento: segmentos })
  }

  AsignarTodosReg() {
    if (this.listaZonas.length > 0) {
      let temp = new Array<any>();
      temp.push({ Codigo: "", Nombre: "NO DEFINIDO" });
      temp = temp.concat(this.listaRamos);
      for (const zona of this.listaZonas) {
        for (const ramo of temp) {
          for (const seg of this.listaSegmentos) {
            this.agregarDataAsesor(seg.Codigo, ramo.Codigo, zona.IdZonaEquipoCanalDigital)
          }
        }
      }
      this.listaDatoAsesor.sort((a, b) => (a.IdZonaEquipoCanalDigital < b.IdZonaEquipoCanalDigital) ? 1 : -1);
      this.asignarTodos.reset();
    } else {
      this.mjs.error("Seleccione un equipo.");
    }

  }

  addDatoAsesor() {
    const { CodigoSegmento, CodigoRamo, IdZonaEquipoCanalDigital } = this.frmDatoAsesor.value;
    for (const segmento of CodigoSegmento) {
      this.agregarDataAsesor(segmento, CodigoRamo, IdZonaEquipoCanalDigital);
    }
    this.listaDatoAsesor.sort((a, b) => (a.IdZonaEquipoCanalDigital < b.IdZonaEquipoCanalDigital) ? 1 : -1);
    this.frmDatoAsesor.reset();
    this.frmDatoAsesor.patchValue(
      {
        IdZonaEquipoCanalDigital: "",
        CodigoRamo: ""
      });
  }

  agregarDataAsesor(segmento, idRamo, idZona) {
    let dupli = this.listaDatoAsesor.find(d => d.CodigoRamo === idRamo && d.CodigoSegmento === segmento && d.IdZonaEquipoCanalDigital === +idZona)
    if (!dupli) {
      let datoAsesor: DatoAsesor = new DatoAsesor();
      datoAsesor.CodigoRamo = idRamo;
      datoAsesor.CodigoSegmento = segmento;
      datoAsesor.Activo = true;
      datoAsesor.IdZonaEquipoCanalDigital = +idZona;
      datoAsesor.IdAsesorCanalDigital = this.frmAsesor.value.IdAsesorCanalDigital > 0 ? this.frmAsesor.value.IdAsesorCanalDigital : 0;
      datoAsesor.IdDatoAsesorCanalDigital = 0;
      this.listaDatoAsesor.push(datoAsesor);
    }
  }

  eliminarConfirm(obj, idx) {
    let msj = obj.IdDatoAsesorCanalDigital > 0 ? Constantes.mensajeEliminar : Constantes.msjEliminar;
    const dialogo = this.comun.confirmDialogDevExtreme(msj);
    dialogo.show().then((dialogResult) => {
      if (dialogResult) {
        this.borrarFila(obj, idx);
      }
    });
  }

  borrarFila(obj, idx) {
    if (obj.IdDatoAsesorCanalDigital > 0) {
      obj.Activo = false;
      this.listaDatoAsesor.splice(idx, 1, obj);
      this.listaDatoAsesor.sort((a, b) => (a.IdZonaEquipoCanalDigital < b.IdZonaEquipoCanalDigital) ? 1 : -1);
    } else {
      this.listaDatoAsesor.splice(idx, 1);
      this.listaDatoAsesor.sort((a, b) => (a.IdZonaEquipoCanalDigital < b.IdZonaEquipoCanalDigital) ? 1 : -1);
    }
  }

  getNombreRamo(codigo: string): string {
    let ramo = this.listaRamos.find(r => r.Codigo === codigo)
    return ramo ? ramo.Nombre : 'N/S';
  }

  getNombreZona(codigo: number): string {
    let zona = this.listaZonas.find(r => r.IdZonaEquipoCanalDigital === codigo)
    return zona ? zona.NombreZona : 'N/S';
  }

  getNombreSegmento(codigo: string): string {
    let segmento = this.listaSegmentos.find(r => r.Codigo === codigo)
    return segmento ? segmento.Nombre : 'N/S';
  }

  nuevoRegistro(body) {
    this.cargando = true;
    this.http.post(`${Base.integracionRest}${config.sigsIntg.canalDigital.asesor.insertar}`, body).subscribe((response: any) => {
      this.mensajeAsesor(response);
    }, error => {
      this.mjs.error(error.error);
      this.cargando = false;
    });
  }

  editarRegistro(obj) {
    this.cargando = true;
    this.http.put(`${Base.integracionRest}${config.sigsIntg.canalDigital.asesor.editar}`, obj).subscribe((response: any) => {
      this.mensajeAsesor(response);
    }, error => {
      this.mjs.error(error.error);
      this.cargando = false;
    });
  }

  mensajeAsesor(response) {
    if (!this.comun.isEmptyObject(response)) {
      if (response.IsSuccess) {
        this.mjs.message(response.Message);
        this.cancelarAsesor();
        this.obtenerAsesores();
      } else {
        this.cargando = false;
        this.mjs.error(response.Message);
      }
    }
  }

  onEdit(asesor, index) {
    this.titulo = "Editar Registro";
    this.indexTmp = index;
    Object.entries(asesor).forEach(
      ([key, value]) => {
        this.asesorObj[key] = value;
      }
    );
    this.listaUsuario[0] = this.asesorObj;
    this.valorPrevio = this.asesorObj.IdEquipoCanalDigital;
    this.frmAsesor.patchValue(this.asesorObj);
    this.obtenerZonas(asesor.IdEquipoCanalDigital);

    this.http.obtener(`${Base.integracionRest}${config.sigsIntg.canalDigital.asesor.asesorById}${asesor.IdAsesorCanalDigital}`).subscribe((response: Response) => {
      this.listaDatoAsesor = response?.IsSuccess ? response.Data?.DatoAsesores : null;
      this.listaDatoAsesor.sort((a, b) => (a.IdZonaEquipoCanalDigital < b.IdZonaEquipoCanalDigital) ? 1 : -1);
      this.listaDatoAsesorCopia = this.listaDatoAsesor.slice();
      this.verFrm = true;
    })

  }

  inicializarFormularios() {
    this.frmAsesor = this.formService.generar(Asesor.formControlNames());
    this.subscription.add(
      this.frmAsesor.valueChanges.subscribe((data) => {
        this.frmErrorAsesor = this.formService.validateForm(this.frmAsesor, this.frmErrorAsesor, Asesor.msjControlNames(), true);
      }));

    this.frmDatoAsesor = this.formService.generar(DatoAsesor.formControlNames());
    this.subscription.add(
      this.frmDatoAsesor.valueChanges.subscribe((data) => {
        this.frmErrorDatoAsesor = this.formService.validateForm(this.frmDatoAsesor, this.frmErrorDatoAsesor, DatoAsesor.msjControlNames(), true);
      }));
  }

  isFieldValid(form: FormGroup, field: string) {
    return this.comun.isFieldValid(form, field, this.submitted);
  }

  fieldCss(form: FormGroup, field: string) {
    return this.comun.fieldCss(form, field, this.submitted);
  }

  abrirMDasesor() {
    this.verFrm = true;
    this.titulo = "Nuevo Registro";
    this.frmAsesor.patchValue({
      EstadoOcupacion: Constantes.EstadosCanalDigital[5],
      Activo: true
    });
    //this.comun.openClose("mdAsesor", "show");
  }

  cancelarAsesor() {
    this.frmAsesor.reset();
    this.frmDatoAsesor.reset();
    this.listaDatoAsesor = new Array<any>();
    //this.comun.openClose("mdAsesor", "hide");
    this.submitted = false;
    this.asesorObj = new Asesor();
    this.identificacionBusqueda = "";
    this.indexTmp = -1;
    this.frmAsesor.patchValue({ IdEquipoCanalDigital: "" });
    this.frmDatoAsesor.patchValue(
      {
        IdZonaEquipoCanalDigital: "",
        CodigoRamo: ""
      });
    this.asignarTodos.reset();
    this.verFrm = false;
  }

  getNombreEquipo(codigo) {
    const equipo = this.listaEquipo.find(item => item.IdEquipoCanalDigital === codigo);
    return equipo ? equipo.Nombre : "N/S";
  }

  verDuplicadoReg(obj, lista) {
    const duplicado = lista.find(item => item.IdUsuario === obj.IdUsuario);
    return duplicado ? true : false;
  }

  obtenerCatalogos(): Observable<any> {
    const cat_ramos = this.http.obtener(`${Base.integracionRest}${config.sigsIntg.canalDigital.catalogos.ramos}`);
    const cat_segmentos = this.http.obtener(`${Base.integracionRest}${config.sigsIntg.canalDigital.catalogos.segmentos}`);
    const cat_asesores = this.http.obtener(`${Base.integracionRest}${config.sigsIntg.canalDigital.asesor.lista}`);
    return forkJoin([cat_ramos, cat_segmentos, cat_asesores]);
  }

  catalogos() {
    this.cargando = true;
    this.subscription.add(
      this.obtenerCatalogos().subscribe(catalogos => {
        this.listaRamos = catalogos[0];
        this.listaSegmentos = catalogos[1];
        this.listaAsesor = catalogos[2]?.IsSuccess ? catalogos[2].Data : [];
        this.listaAsesor.sort((a, b) => (a.Equipo < b.Equipo) ? 1 : -1);
        this.segmentosFiltro = this.listaSegmentos.slice();
        this.cargando = false;
      }, error => {
        alert("No hay respuesta del servidor. Vuelva a intentar más tarde.");
        this.cargando = false;
      }));
  }

  obtenerZonas(IdEquipoCanalDigital) {
    let obj = this.listaEquipo.find(e => e.IdEquipoCanalDigital === +IdEquipoCanalDigital);
    this.listaZonas = obj?.ZonaEquipos;
    this.listaDatoAsesor = new Array<any>();
    this.listaDatoAsesorCopia = this.listaDatoAsesorCopia.map(item => {
      item.Activo = false;
      return item
    });
  }

  confirmLimpiarDetalles(IdEquipoCanalDigital) {
    if (this.listaDatoAsesor.length > 0) {
      const dialogo = this.comun.confirmDialogDevExtreme(Constantes.msjLimpiar);
      dialogo.show().then((dialogResult) => {
        if (dialogResult) {
          this.obtenerZonas(IdEquipoCanalDigital);
          this.valorPrevio = IdEquipoCanalDigital;
        } else {
          this.frmAsesor.patchValue({ IdEquipoCanalDigital: this.valorPrevio })
        }
      });
    } else {
      this.obtenerZonas(IdEquipoCanalDigital);
    }
  }

}

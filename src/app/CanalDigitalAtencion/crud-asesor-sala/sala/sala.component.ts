import { Component, Input, OnInit } from '@angular/core';
import { CRUDService, FormService, ComunService, AlertifyService } from 'src/app/shared/services';
import { Base } from 'src/app/shared/AppDominio';
import { config } from 'src/app/shared/servicios.config';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Constantes } from 'src/app/models';
import { Sala } from 'src/app/models/canal-digital/sala';
declare var $;

@Component({
  selector: 'app-sala',
  templateUrl: './sala.component.html',
  styleUrls: ['./sala.component.scss']
})
export class SalaComponent implements OnInit {
  @Input() listaEquipo: any[];
  private subscription: Subscription = new Subscription();

  listaSalas: any[];

  frmSala: FormGroup;
  frmErrorSala = Sala.emptyControlNames();

  salaObj: Sala;

  submitted: boolean;

  titulo = "Nuevo Registro";
  indexTmp = -1;
  cargando = false;

  constructor(private mjs: AlertifyService, private http: CRUDService, private formService: FormService, private comun: ComunService) { }

  ngOnInit(): void {
    $(() => {
      $('[data-toggle="tooltip"]').tooltip();
    });
    this.listaSalas = new Array<any>();
    this.salaObj = new Sala();
    this.obtenerSalas();
    this.inicializarFormularios();
  }


  public obtenerSalas() {
    this.cargando = true;
    this.http.obtener(`${Base.integracionRest}${config.sigsIntg.canalDigital.sala.lista}`).
      subscribe((response: any) => {
        if (!this.comun.isEmptyObject(response)) {
          if (response.IsSuccess && response.Data) {
            this.listaSalas = response.Data;
          }
        }
        this.cargando = false;
      }, error => {
        this.mjs.error(error.error);
        this.cargando = false;
      });
  }

  guardarRegistro() {
    this.submitted = true;
    if (this.frmSala.valid) {
      if (this.comun.isEmptyObject(this.salaObj)) {
        if (!this.verDuplicadoReg(this.frmSala.value, this.listaSalas) && !this.verDuplicadoCodigo(this.frmSala.value, this.listaSalas)) {
          this.nuevoRegistro();
        } else {
          this.mjs.error("La URL/Código de sala se encuentran asignados a un equipo");
        }
      } else {
        const oldData = this.listaSalas[this.indexTmp];
        const tmpObj = {};
        Object.entries(this.frmSala.getRawValue()).forEach(
          ([key, value]) => {
            tmpObj[key] = oldData[key];
          }
        );
        if (JSON.stringify(this.frmSala.value) === JSON.stringify(tmpObj)) {
          this.cancelarSala();
        } else {
          if (oldData.URLSala === this.frmSala.value.URLSala && oldData.CodigoSalaCanalDigital === this.frmSala.value.CodigoSalaCanalDigital) {
            Object.entries(this.frmSala.getRawValue()).forEach(
              ([key, value]) => {
                this.salaObj[key] = value;
              }
            );
            this.editarRegistro(this.salaObj);
          } else {
            if (oldData.URLSala === this.frmSala.value.URLSala) {
              if (!this.verDuplicadoCodigo(this.frmSala.value, this.listaSalas)) {
                Object.entries(this.frmSala.getRawValue()).forEach(
                  ([key, value]) => {
                    this.salaObj[key] = value;
                  }
                );
                this.editarRegistro(this.salaObj);
              }
              else {
                this.mjs.error("La Código de sala se encuentran asignados a un equipo");
              }
            } else {
              if (oldData.CodigoSalaCanalDigital === this.frmSala.value.CodigoSalaCanalDigital) {
                if (!this.verDuplicadoReg(this.frmSala.value, this.listaSalas)) {
                  Object.entries(this.frmSala.getRawValue()).forEach(
                    ([key, value]) => {
                      this.salaObj[key] = value;
                    }
                  );
                  this.editarRegistro(this.salaObj);
                }
                else {
                  this.mjs.error("La URL de sala se encuentran asignados a un equipo");
                }
              }else{
                if (!this.verDuplicadoCodigo(this.frmSala.value, this.listaSalas) && !this.verDuplicadoReg(this.frmSala.value, this.listaSalas)) {
                  Object.entries(this.frmSala.getRawValue()).forEach(
                    ([key, value]) => {
                      this.salaObj[key] = value;
                    }
                  );
                  this.editarRegistro(this.salaObj);
                }
                else {
                  this.mjs.error("La URL/Código de sala se encuentran asignados a un equipo");
                }
              }

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
    this.http.post(`${Base.integracionRest}${config.sigsIntg.canalDigital.sala.insertar}`, this.frmSala.value).subscribe((response: any) => {
      this.mensajeSala(response);
    }, error => {
      this.mjs.error(error.error);
      this.cargando = false;
    });
  }

  editarRegistro(obj) {
    this.http.put(`${Base.integracionRest}${config.sigsIntg.canalDigital.sala.editar}`, obj).subscribe((response: any) => {
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
        this.cancelarSala();
        this.obtenerSalas();
      } else {
        this.cargando = false;
        this.mjs.error(response.Message);
      }
    }
  }

  onEdit(sala, index) {
    this.titulo = "Editar Registro";
    this.salaObj = new Sala();
    this.indexTmp = index;
    Object.entries(sala).forEach(
      ([key, value]) => {
        this.salaObj[key] = value;
      }
    );
    this.comun.openClose("mdSala", "show");
    this.frmSala.patchValue(this.salaObj);
  }

  inicializarFormularios() {
    this.frmSala = this.formService.generar(Sala.formControlNames());
    this.subscription.add(
      this.frmSala.valueChanges.subscribe((data) => {
        this.frmErrorSala = this.formService.validateForm(this.frmSala, this.frmErrorSala, Sala.msjControlNames(), true);
      }));
  }

  isFieldValid(form: FormGroup, field: string) {
    return this.comun.isFieldValid(form, field, this.submitted);
  }

  fieldCss(form: FormGroup, field: string) {
    return this.comun.fieldCss(form, field, this.submitted);
  }

  abrirmdSala() {
    this.titulo = "Nuevo Registro";
    this.frmSala.patchValue({
      EstadoOcupacion: Constantes.EstadosCanalDigital[3],
      Activo: true
    });
    this.comun.openClose("mdSala", "show");
  }

  cancelarSala() {
    this.frmSala.reset();
    this.comun.openClose("mdSala", "hide");
    this.submitted = false;
    this.salaObj = new Sala();
    this.indexTmp = -1;
    this.frmSala.patchValue({IdEquipoCanalDigital: ""});
  }

  getNombreEquipo(codigo) {
    const equipo = this.listaEquipo.find(item => item.IdEquipoCanalDigital === codigo);
    return equipo ? equipo.Nombre : "N/S";
  }

  verDuplicadoReg(obj, lista) {
    const duplicado = lista.find(item => item.URLSala === obj.URLSala);
    return duplicado ? true : false;
  }

  verDuplicadoCodigo(obj, lista) {
    const duplicado = lista.find(item => item.CodigoSalaCanalDigital === obj.CodigoSalaCanalDigital);
    return duplicado ? true : false;
  }

}

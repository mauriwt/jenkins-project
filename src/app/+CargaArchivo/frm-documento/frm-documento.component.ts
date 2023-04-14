import { Component, OnInit, ViewChild, ViewEncapsulation, Input, OnChanges, Output, EventEmitter, SimpleChanges, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CRUDService, FileUploadService, AlertifyService, FormService, ComunService } from '../../shared/services';
import { config } from '../../shared/servicios.config';
import { Observable, Subscription } from 'rxjs';
import { Documento, IArchivo } from '../../models';

declare var $;

@Component({
  selector: 'app-frm-documento',
  templateUrl: './frm-documento.component.html',
  styleUrls: ['./frm-documento.component.scss'],
  providers: [ComunService]
})
export class FrmDocumentoComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();
  @Input() documento: Documento;
  @Input() docTmp: Documento;
  @Output() subirOK = new EventEmitter();
  @Input() deDonde: string;
  public bloquear: boolean = false;
  public submitted: boolean = false;
  public formulario: FormGroup;
  public formErrors = Documento.fieldEmpty();
  public cargando: boolean;
  private urlbase = config.sigsIntg.dominio;
  private urlDoc = config.sigsDoc.dominio;
  public listaEntidadDocumental: any[];
  public listaTipoDocumento: any[];
  public files: any;
  public fileName: string = "Seleccionar Archivo";
  public respaldo: boolean;
  public cargarbox1: boolean;
  public cargarbox2: boolean;
  onScroll: string = "onScroll";

  constructor(private comun: ComunService, private crud: CRUDService, private fileService: FileUploadService, private msj: AlertifyService, private frmservi: FormService) { }

  ngOnInit() {
    this.listaEntidadDocumental = new Array<any>();
    this.listaTipoDocumento = new Array<any>();
    this.formulario = this.frmservi.generar(Documento.campos());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['docTmp'] !== undefined) {
      if (changes['docTmp'].currentValue !== undefined && !this.comun.isEmptyObject(changes['docTmp'].currentValue)) {
        let data: Documento = changes['docTmp'].currentValue;
        this.cargarFormulario(data);
        this.bloquear = true;
      }
    }

    if (changes['deDonde'] !== undefined) {
      if (changes['deDonde'].currentValue !== undefined && changes['docTmp'].currentValue) {
        this.obtenerEntidadDocumental(Documento.getCodigoDetalleCatalogo()[3]);
      }
    }
  }

  private cargarFormulario(data) {
    this.cargarbox2 = true;
    this.subscription.add(
      this.crud.obtener(`${this.urlDoc}${config.sigsDoc.edocumental.base}${data.CodigoDetalleCatalogo}&${config.tokenCalagolo}`).subscribe((response: any) => {
        this.listaTipoDocumento = response;
        this.formulario.patchValue({
          CodigoDetalleCatalogo: data.CodigoDetalleCatalogo,
          CodigoTipoEntidadDocumental: data.CodigoTipoEntidadDocumental
        });
        this.cargarbox2 = false;
      }, error => this.cargarbox2 = false));
  }

  guardar() {
    if (this.formulario.valid) {
      let parametro: IArchivo = {
        CodigoFormulario: this.formulario.get('CodigoTipoEntidadDocumental').value,
        IdImpresion: this.documento.IdImpresion,
        ReferenciaExterna: this.documento.ReferenciaExterna,
        ReferenciaNegocio: this.documento.ReferenciaNegocio,
      };
      if (this.comun.noVacios(parametro)) {
        this.subscription.add(
          this.fileService.generarFileRequest(`${this.urlDoc}${config.sigsDoc.archivo.subir}`,
            parametro, this.files)
            .subscribe(response => {
              $('#file').val("");
              if (response.status === "OK") {
                let mtmp = JSON.parse(response.file)
                if (mtmp.valor === "OK") {
                  this.subirOK.emit(parametro.ReferenciaNegocio);
                  this.bloquear = false;
                  this.msj.message(mtmp.mensaje)
                  this.cancelar();
                } else {
                  console.log(response)
                  this.msj.warning(mtmp.mensaje);
                }
              }
            }, error => {
              this.msj.error("Se detectó un problema al subir el ducumento.");
              this.cargando = false;
            }));
      } else {
        this.msj.error("Parámetros incompletos.");
      }
    }
  }

  confirmSave() {
    this.submitted = true;
    if (this.formulario.invalid) {
      this.msj.openSnackBar('Verifique que los datos estén ingresados correctamente.', 'Intente nuevamente');
    } else {
      this.subscription.add(
        this.comun.confirmDialog("Guardar documento", `¿Está seguro que los datos ingresados son correctos?`).subscribe(valido => {
          if (valido) {
            this.guardar();
          } else this.submitted = false;
        }));
    }
  }

  obtenerEntidadDocumental(codigo: string) {
    this.cargarbox1 = true;
    this.subscription.add(
      this.crud.obtener(`${this.urlbase}${config.sigsIntg.catalogo.edocumental}${codigo}&${config.tokenCalagolo}`).subscribe((response: any) => {
        this.listaEntidadDocumental = response.filter(item => item.Codigo === this.deDonde);
        this.cargarbox1 = false;
      }, error => this.cargarbox1 = false));
  }

  obtenerTipoDocumento(codigo: string) {
    this.cargarbox2 = true;
    this.subscription.add(
      this.crud.obtener(`${this.urlDoc}${config.sigsDoc.edocumental.base}${codigo}&${config.tokenCalagolo}`).subscribe((response: any) => {
        this.listaTipoDocumento = response;
        this.cargarbox2 = false;
      }, error => this.cargarbox2 = false));
  }

  public setArchivo(event) {
    this.files = (event.srcElement) ? event.srcElement.files : event.target.files;
    if (this.files) {
      this.fileName = this.files[0].name;
      if (this.files[0].type !== "application/pdf") {
        this.fileName = 'Seleccionar Archivo';
        this.files = null;
        this.formulario.patchValue({ file: '' });
        this.msj.warning("Tipo de documento no permitido. <br> Intente nuevamente.");
      }
    } else {
      this.fileName = 'Seleccionar Archivo';
    }
  }

  cancelar() {
    this.formulario.reset();
    this.listaTipoDocumento = new Array<any>();
    this.fileName = "Seleccionar Archivo";
    this.docTmp = new Documento();
    this.subirOK.emit("");
    this.bloquear = false;
    this.submitted = false;
  }

  ngOnDestroy(): void {
    this.cancelar();
  }

  inicializarFormularios() {
    this.formulario = this.frmservi.generar(Documento.campos());
    this.subscription.add(
      this.formulario.valueChanges.subscribe((data) => {
        this.formErrors = this.frmservi.validateForm(this.formulario, this.formErrors, Documento.getCampos(), true)
      }));
  }
  isFieldValid(form: FormGroup, field: string) {
    return (this.submitted && form.controls[field].invalid || (form.controls[field].invalid && form.controls[field].dirty) ||
      ((form.controls[field].invalid && form.controls[field].pristine) && (!this.comun.isEmpty(form.controls[field].value))));
  }

  fieldCss(form: FormGroup, field: string) {
    return {
      'is-valid': (this.submitted && form.controls[field].valid) || (form.controls[field].valid && form.controls[field].dirty),
      'is-invalid': (this.submitted && form.controls[field].invalid) || (form.controls[field].invalid && form.controls[field].dirty) || ((form.controls[field].invalid && form.controls[field].pristine) && (!this.comun.isEmpty(form.controls[field].value)))
    };
  }
}


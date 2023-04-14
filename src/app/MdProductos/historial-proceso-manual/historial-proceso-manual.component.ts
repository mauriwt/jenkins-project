import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { config } from 'src/app/shared/servicios.config';
import { CRUDService, AlertifyService, ComunService, FormService, FileUploadService } from 'src/app/shared/services';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { FormatoDevolucion } from '../../models/FormatoDevolucion';
import { ModeloCobroPagoCash } from '../../models/ModeloCobroPagoCash';

@Component({
  selector: 'app-historial-proceso-manual',
  templateUrl: './historial-proceso-manual.component.html',
  styleUrls: ['./historial-proceso-manual.component.scss']
})
export class HistorialProcesoManualComponent implements OnInit {

  private subscription: Subscription = new Subscription();

  cargando = false;
  opcionFiltro = "auto";
  @ViewChild('grid') grid: DxDataGridComponent;
  private url = config.sigsIntg.dominio;
  dataSource: any;

  public files: any;
  public fileName: string = "Seleccionar Archivo";
  public formulario: FormGroup;
  public formErrors = FormatoDevolucion.fieldEmpty();
  public submitted: boolean = false;

  public fileContent: string = '';
  public modelo: ModeloCobroPagoCash;
  public lista: Array<ModeloCobroPagoCash>;

  constructor(private comun: ComunService, private notifi: AlertifyService, private router: Router, private frmservi: FormService, private fileService: FileUploadService) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
  }

  ngOnInit() {
    this.inicializarFormularios();    
  }

  public setArchivo(event) {

    this.files = (event.srcElement) ? event.srcElement.files : event.target.files;
    if (this.files.length != 0) {
      //console.log(this.files);
      this.fileName = this.files[0].name;
      //console.log(this.files[0].type);
      if (this.files[0].type !== "text/plain") {
        this.fileName = 'Seleccionar Archivo';
        this.files = null;
        this.dataSource = [];
        this.formulario.patchValue({ file: '' });
        this.notifi.warning("Tipo de documento no permitido. <br> Intente nuevamente.");
      }
      else {
        this.listarContenidoArchivo();
      }
    } else {
      this.fileName = 'Seleccionar Archivo';
    }

  }

  limpiar() {
    this.fileName = 'Seleccionar Archivo';
    this.files = null;
    this.dataSource = [];
    this.formulario.patchValue({ file: '' });
  }

  inicializarFormularios() {
    this.formulario = this.frmservi.generar(FormatoDevolucion.campos());
    this.subscription.add(
      this.formulario.valueChanges.subscribe((data) => {
        this.formErrors = this.frmservi.validateForm(this.formulario, this.formErrors, FormatoDevolucion.getCampos(), true)
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

  listarContenidoArchivo() {
    this.submitted = true;
    if (this.formulario.invalid) {
      this.notifi.openSnackBar('Verifique que los datos estén ingresados correctamente.', 'Intente nuevamente');
    } else {
      this.visualizarContenido();
      this.submitted = false;
    }
  }

  public visualizarContenido(): void {
    let file = this.files[0];
    let fileReader: FileReader = new FileReader();
    let self = this;

    fileReader.onloadend = function (x) {

      self.lista = new Array<ModeloCobroPagoCash>();
      self.fileContent = fileReader.result.toString();
      //console.log(self.fileContent);
      let contador: number = 1;
      let nroFilas = self.fileContent.split('\n').length;
      for (const item of self.fileContent.split('\n')) {

        self.modelo = new ModeloCobroPagoCash();
        let vector = item.split('\t');

        if (contador != nroFilas || vector.length > 1 || (vector.length == 1 && vector[0].length != 0)) {
          self.modelo.Id = contador;
          self.modelo.Error = vector.length != 14 ? "SI" : "";

          self.modelo.TipoPago = vector[0];
          self.modelo.NumeroCuenta = vector[1];
          self.modelo.Fijo1 = vector[2];
          self.modelo.Fijo2 = vector[3];
          self.modelo.Contrapartida = vector[4];
          self.modelo.Moneda = vector[5];
          self.modelo.ValorDevolver = vector[6];
          self.modelo.FormaPago = vector[7];
          self.modelo.CodigoBanco = vector[8];
          self.modelo.TipoCuenta = vector[9];
          self.modelo.NumeroCuentaBeneficiario = vector[10];
          self.modelo.TipoDocumento = vector[11];
          self.modelo.NumeroDocumento = vector[12];
          self.modelo.NombreBeneficiario = vector[13];

          self.lista.push(self.modelo);
        }

        contador++;
      }

      self.dataSource = self.lista;
    };

    fileReader.readAsText(file);
  }

  encriptarArchivo() {

    this.cargando = true;
    this.subscription.add(
      this.fileService.generarFileRequest(`${this.url}${config.sigsIntg.cancelacion.encriptarArchivo}`, null, this.files).subscribe((response: any) => {
        //console.log(response);
        if (response.status === "OK") {
          //console.log(JSON.parse(response.file));
          if (JSON.parse(response.file).length != 0)
            this.notifi.warning(response.file);
          else
            this.notifi.openSnackBar('Archivo generado correctamente', 'Por favor verifique');
        }

        this.cargando = false;

      }, error => { this.cargando = false; }));
  }
    
  confirmarEncriptacion() {
    this.submitted = true;
    if (this.formulario.invalid) {
      this.notifi.openSnackBar('Verifique que los datos estén ingresados correctamente.', 'Intente nuevamente');
    } else {
      this.subscription.add(
        this.comun.confirmDialog("Encriptar documento", `¿Está seguro que los datos ingresados son correctos?`).subscribe(valido => {
          if (valido) {
            this.encriptarArchivo();
          } else this.submitted = false;
        }));
    }
  }

}


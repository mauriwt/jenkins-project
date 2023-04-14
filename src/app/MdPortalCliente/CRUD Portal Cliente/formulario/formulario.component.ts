import { Component, OnInit } from '@angular/core';
import { CRUDService, FormService, ComunService, AlertifyService } from 'src/app/shared/services';
import { Base } from 'src/app/shared/AppDominio';
import { config } from 'src/app/shared/servicios.config';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DetalleFormulario } from 'src/app/models/portal-cliente/DetalleFormulario';
import { DetalleActualizar } from 'src/app/models/portal-cliente/DetalleActualizar';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
declare var $:any;
@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})


export class FormularioComponent implements OnInit {

  private subscription: Subscription = new Subscription();
  frmDetalleFormulario: FormGroup;
  frmActualizarForm:FormGroup;
  frmErrorDetalleFormulario = DetalleFormulario.emptyControlNames();
  detalleFormulario: DetalleFormulario;
  actualizarFormulario:DetalleActualizar;
  listaFormulario: any[];
  listaFormDetalle:any[];
  isTableExpanded = false;
  catalogo: string[] = ['actions', 'Nombre'];
  formularioLabel: string[] = ['Editar','Ver', 'Nombre','Descripcion','URL', 'Activo'];
  public files: any;
  public fileData: File;
  Tipo:string;
  titulo = "Nuevo Formulario";
  public fileName: string = "Seleccionar Archivo";
  submitted = false;
  indexTmp = -1;
  cargando = false;
  formDataImage=new FormData();
  urlDocumento: string;
  modalHearder: string;

  popupVisible: boolean = false;
  obj:any;
  private headers: HttpHeaders = new HttpHeaders();

  tokenUsuario:string;
  constructor(private mjs: AlertifyService, private http: CRUDService, private formService: FormService, private comun: ComunService,private aroute: ActivatedRoute) { }

  ngOnInit(): void {
    this.listaFormulario = new Array<any>();
    this.tokenUsuario=this.aroute.snapshot.params.tokenusu;
    this.obtenerFormulario();
    this.inicializarDetalleFormularios();
  }

  filtrar(id:any){
    let obj= this.listaFormulario.find(e=>e.TipoFormulario.Formularios.find(el=>el.Codigo===id));
    this.Tipo=obj.TipoFormulario.Tipo;
    this.listaFormDetalle= obj?obj.TipoFormulario.Formularios:[];
  }
  private obtenerFormulario() {
    this.isTableExpanded = false;
    this.cargando = true;
    this.http.obtener(`${Base.integracionRest}${config.sigsIntg.portalcliente.lista}${this.tokenUsuario}`).subscribe((response:any) => {
      if (!this.comun.isEmptyObject(response)) {
        if (response.IsSuccess) {
          this.listaFormulario = response.Data.map(e=>{
            e.TipoFormulario.isExpanded=false
            e.TipoFormulario.Formularios.forEach(
              form=>form.URL=form.URL.split('/').pop())
              return e;
            });;
          this.cargando = false;
        }
      }
    }, error => {
      this.mjs.error(error.error);
      this.cargando = false;
    }
      );

     
  
  }
  verDocumento(nombre, codigo) {
    this.popupVisible = true;
    let tipo;
    this.listaFormulario.forEach(e=>e.TipoFormulario.Formularios.forEach(el=>
      {
        if (el.Codigo===codigo) {
          tipo=e.TipoFormulario.Tipo;
        }
        })
      );
    nombre=nombre.split('/').pop();
    this.urlDocumento = config.sigsIntg.portalcliente.ver+tipo+"/"+nombre;
    this.modalHearder = nombre;
  }
  public setArchivo(event) {
    this.files = (event.srcElement) ? event.srcElement.files : event.target.files;
    if (this.files) {
  
      this.fileName = this.files[0].name;
      if (this.files[0].type !== "application/pdf") {
        this.fileName = 'Seleccionar Archivo';
        this.files = null;
        this.frmDetalleFormulario.patchValue({ file: '' });
        this.frmActualizarForm.patchValue({file:''})
        this.mjs.error("Tipo de documento no permitido. Adjunte un archivo pdf.");
      }
      else{
        var reader = new FileReader();
        this.fileData=  <File>event.target.files[0];
        reader.readAsDataURL(this.fileData);
        reader.onload = (_event) => {​​
          this.formDataImage.append('image', this.fileData);
    
        }
      }
    } else {
      
      this.fileName = 'Seleccionar Archivo';
    }
  }
  onEditDetalle(fila:any, index:any) {
    
    this.titulo = "Editar Formulario";
    this.filtrar(index);
    this.actualizarFormulario = new DetalleActualizar();
    this.indexTmp = index;
   Object.entries(fila).forEach(
      ([key, value]) => {
        if (key!=='URL') {
          this.actualizarFormulario[key] = value;
        }else{
          
          this.fileName=value.toString();
        }
      }
    ); 

    this.comun.openClose("mdDetalleActualizar", "show");
    this.frmActualizarForm.patchValue(this.actualizarFormulario);
  }



  guardarNuevoDetalle() {
    this.submitted = true
    if (this.frmDetalleFormulario.valid&&this.fileData!==undefined) {
        this.nuevoRegistro();
  }
   else if(!this.frmDetalleFormulario.valid){
    this.mjs.error("Llene todos los campos requeridos.");
  }
   else if(this.fileData===undefined) {
    this.mjs.error("Extensión del archivo inválida.");
  }
  
  }
  actualizarDetalle(){

    const oldData = this.listaFormDetalle.find(e=>e.Codigo===this.indexTmp);
    const tmpObj = {};
    this.frmActualizarForm.value.URL=this.fileName;
    Object.entries(this.frmActualizarForm.getRawValue()).forEach(
      ([key]) => {
        tmpObj[key] = oldData[key];
      }
    );

    if (JSON.stringify(this.frmActualizarForm.value) === JSON.stringify(tmpObj)) {
      this.cancelarDetalle();
    } else {
        this.editarRegistroDetalle(this.frmActualizarForm.value);
    }
  }
  guardarRegistroDetalle() { 
    this.submitted = true
    this.frmActualizarForm.value.URL2=this.fileName;
    this.frmActualizarForm.value.URL=this.fileName;
      if (this.frmActualizarForm.valid&&this.fileData===undefined) 
      {
        this.actualizarDetalle(); 
      }
      else if(this.frmActualizarForm.valid&&this.fileData.type==="application/pdf")
      {
        this.actualizarDetalle(); 
      }
      else if(this.frmActualizarForm.valid&&this.fileData.type!=="application/pdf"){
        this.mjs.error("Extensión del archivo inválida.");
      }
      else {
        this.mjs.error("Llene todos los campos requeridos.");
      }
  }

  nuevoRegistro() {
    this.cargando = true;
    
    this.frmDetalleFormulario.value.Tipo= this.Tipo;
    this.frmDetalleFormulario.value.URL= this.fileName;
    delete this.frmDetalleFormulario.value.Codigo;
    delete this.frmDetalleFormulario.value.Activo;
    delete this.frmDetalleFormulario.value.URL2;
    this.frmDetalleFormulario.value.tokenUsuario= this.tokenUsuario;
    this.formDataImage.append("data",JSON.stringify (this.frmDetalleFormulario.value));
    this.headers.set('enctype', 'multipart/form-data');
    this.http.postFile(`${Base.integracionRest}${config.sigsIntg.portalcliente.insertar}`,this.formDataImage,this.headers).subscribe((response: any) => {
        this.mensajeForm(response);
        this.formDataImage.delete("data");
    }, error => {
      this.mjs.error(error.error);
      this.cargando = false;
       this.formDataImage.delete("data");
    }); 

     
  
  }

  editarRegistroDetalle(obj:any) {
    this.cargando = true;
    obj.Tipo= this.Tipo;
    this.frmActualizarForm.value.tokenUsuario= this.tokenUsuario;
    this.formDataImage.append("data",JSON.stringify (obj));
    this.headers.set('enctype', 'multipart/form-data');
    this.http.putFile(`${Base.integracionRest}${config.sigsIntg.portalcliente.editar}`,this.formDataImage,this.headers).subscribe((response: any) => {
      this.mensajeForm(response);
      this.formDataImage.delete("data");
  }, error => {
    this.mjs.error(error.error);
    this.cargando = false;
     this.formDataImage.delete("data");
  }); 
    
  
  }
  toggleTableRows() {
      this.isTableExpanded = !this.isTableExpanded; 
      this.listaFormulario.forEach(row=>{
      row.TipoFormulario.isExpanded = this.isTableExpanded;
      });
  }
  mensajeForm(response:any) {
    if (!this.comun.isEmptyObject(response)) {
      if (response.IsSuccess) {
        this.mjs.message(response.Message);
        this.cancelarDetalle();
        this.cancelarNuevoForm();
        this.obtenerFormulario();
      } else {
        this.cargando = false;
        this.mjs.error(response.Message);
      }
    }
  }

  abrirmdFormulario(index:any) {
    this.Tipo=index;
    this.titulo = "Nuevo Formulario";
    this.frmDetalleFormulario.patchValue({
      Activo: true
    });
    this.comun.openClose("mdNuevoDetalle", "show");
  }

  cancelarDetalle(){
    this.frmDetalleFormulario.reset();
    this.comun.openClose("mdDetalleActualizar", "hide");
    this.fileName = "Seleccionar Archivo";
    this.submitted = false;
    this.detalleFormulario = new DetalleFormulario();
    this.indexTmp = -1;
    this.formDataImage.delete("data");
    this.formDataImage.delete("image");
  }
  cancelarNuevoForm(){
    this.frmDetalleFormulario.reset();
    this.comun.openClose("mdNuevoDetalle", "hide");
    this.fileName = "Seleccionar Archivo";
    this.submitted = false;
    this.detalleFormulario = new DetalleFormulario();
    this.indexTmp = -1;
    this.formDataImage.delete("data");
    this.formDataImage.delete("image");
  }
  inicializarDetalleFormularios(){
    this.frmDetalleFormulario = this.formService.generar(DetalleFormulario.formControlNames());
    this.subscription.add(
      this.frmDetalleFormulario.valueChanges.subscribe((data) => {
        this.frmErrorDetalleFormulario = this.formService.validateForm(this.frmDetalleFormulario, this.frmErrorDetalleFormulario, DetalleFormulario.msjControlNames(), true);
      }));
      this.frmActualizarForm = this.formService.generar(DetalleActualizar.formControlNames());
      this.subscription.add(
        this.frmActualizarForm.valueChanges.subscribe((data) => {
          this.frmErrorDetalleFormulario = this.formService.validateForm(this.frmActualizarForm, this.frmErrorDetalleFormulario, DetalleActualizar.msjControlNames(), true);
        }));
  }
  
  isFieldValid(form: FormGroup, field: string) {
    return this.comun.isFieldValid(form, field, this.submitted);
  }

  fieldCss(form: FormGroup, field: string) {
    return this.comun.fieldCss(form, field, this.submitted);
  }
 
}

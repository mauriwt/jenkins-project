import { Component, OnInit, OnDestroy, Input, SimpleChanges, Output, EventEmitter, OnChanges, AfterViewInit, AfterContentInit } from '@angular/core';
import { ComunService, AlertifyService, FormService, CRUDService, } from 'src/app/shared/services';
import { Cliente, LocalizaciónCliente, Direccion, ContactoCliente } from 'src/app/models';
import { FormGroup, Validators } from '@angular/forms';
import { config } from 'src/app/shared/servicios.config';
import { validarTiposIdentificacion } from 'src/app/shared/services/cedula.validator';
import { validarTelefonos } from 'src/app/shared/services/telefono.validator';
import { Observable, forkJoin, Subscription } from 'rxjs';
import { ErrorZoho } from '../../errores/errores';
import * as moment from 'moment';
import { ValidarFecha } from 'src/app/shared/services/fecha.validator';
import { DateAdapter } from '@angular/material/core';

declare var $;

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss'],
  providers: [ComunService]
})
export class ClienteComponent implements OnInit, OnDestroy, OnChanges, AfterContentInit {
  public sinpuntero = "sinpuntero";
  private TODOS = "TODO";
  public mensajeValidar: any;
  private subscription: Subscription = new Subscription();
  @Input() recibir: any;
  @Input() eventoBuscar: any;
  @Input() zohoIdentificacion: string;
  @Input() frmvacio: string;
  @Input() app: string;
  @Input() tipoFrm: string;
  @Output() public cargarData = new EventEmitter();
  public formulario: FormGroup;
  public frmDirecion: FormGroup;
  public frmTelefono: FormGroup;
  public frmEmail: FormGroup;
  public frmContacto: FormGroup;
  public frmErrorContacto = ContactoCliente.fieldEmpty();
  public formErrors = Cliente.fieldEmpty();
  public frmErrorsDireccion = Direccion.fieldEmpty();
  public frmErrorsTelefono = LocalizaciónCliente.fieldEmpty();
  public frmErrorsEmail = LocalizaciónCliente.fieldEmpty();
  searchModeOption = "contains";
  searchExprOption: any = "Nombre";
  searchTimeoutOption = 200;
  minSearchLengthOption = 0;
  showDataBeforeSearchOption = false;
  esPrincipal: any[] = [{ id: true, valor: 'SI' }, { id: false, valor: 'NO' }];
  verDuplidado: any[] = [{ id: -1, valor: 'No se puedo hacer la verificación.' }, { id: 0, valor: 'La identificación no se encuentra asignada a ningún registro.' }, { id: 2, valor: 'La indentificación se encuentra registrada solo en SIGS.' }, { id: 1, valor: `La indentificación se encuentra registrada solo en ZOHO CRM.` }, { id: 3, valor: 'La indentificación se encuentra registrada en SIGS y CRM.' }];
  private indexTmp: number;
  private indexAux: number;
  private indexAux2: number;
  public cliente: any;
  public clienteContacto: ContactoCliente;
  public formCliente: Cliente;
  public direccion: Direccion;
  public telefono: LocalizaciónCliente;
  public email: LocalizaciónCliente;
  public listaTipoIdentificacion: any[];
  public listaCambiante: any[];
  public listaGenero: any[];
  public listaEstadoCivil: any[];
  public listaParentesco: any[];
  public listaPais: any[];
  public listaProvincia: any[];
  public listaCanton: any[];
  public listaCantones: any[];
  public listaSegmento: any[];
  public listaSegmentoAll: any[];
  public listaFuerzaVenta: any[];
  public cargando = false;
  public cargarCantonFrm = false;
  public cargandoCanton = false;
  public cargarDetalle = false;
  public cargandoCata = false;
  public cargarFv = false;
  public letura = false;
  public bloquearInputMail = false;
  public verParentesco: boolean;
  private tmpCedula: string;

  esEmpresa: boolean;
  submitted = false;
  listaTelefonos: LocalizaciónCliente[];
  listaCorreos: LocalizaciónCliente[];
  listaClienteContacto: any[];
  listaDirecciones: Direccion[];
  catalogoTelefonos: any[];
  catalogoDirecciones: any[];
  catalogoCorreos: any[];
  popoupDireccion: boolean;
  popoupTelefono: boolean;
  popoupEmail: boolean;
  popoupFiltro: boolean;
  popupCCli: boolean;
  nuevo = false;
  operacion = false;
  nuevoTelf = false;
  operacionTelf = false;
  nuevoEmail = false;
  operacionEmail = false;
  soloLectura: boolean;
  soloLecturaCheck: boolean;
  onScroll = "onScroll";
  identificacionURL: boolean;
  rupTelefono = false;
  rupEmail = false;
  rupDireccion = false;
  maxlengthTelf = 10;
  lengthIdentificacion = 10;
  maxDate: Date;
  minDate: Date;

  private url = config.sigsIntg.dominio;

  constructor(private adapter: DateAdapter<any>, private comun: ComunService, private alertify: AlertifyService, private formService: FormService, private crud: CRUDService) {
    this.adapter.setLocale('es');
  }


  ngOnChanges(changes: SimpleChanges): void {
    const tabData = changes.recibir;
    if (tabData !== undefined) {
      if (tabData.currentValue !== undefined) {
        const data = tabData.currentValue;
        data.quien === 'tab' ? this.verDetalle(data.identificacion) : this.getRepresentante(data);
      }
    }
    if (changes['zohoIdentificacion'] !== undefined) {
      if (changes['zohoIdentificacion'].currentValue !== undefined) {
        let identificacion = changes['zohoIdentificacion'].currentValue
        this.identificacionURL = true;
        this.verDetalle(identificacion);
      }
    }
    if (changes.frmvacio !== undefined) {
      if (changes.frmvacio.currentValue !== undefined) {
        const bandera = changes.frmvacio.currentValue;
        if (bandera === 'SI') {
          this.identificacionURL = true;
        }
      }
    }
    if (changes['eventoBuscar'] !== undefined) {
      if (changes['eventoBuscar'].currentValue !== undefined) {
        this.cancelarEvento();
      }
    }
  }

  ngAfterContentInit() {
    if (!this.comun.isEmpty(this.tipoFrm)) {
      const si = this.tipoFrm === 'empresa' ? true : false;
      this.soloLecturaCheck = true;
      this.formulario.patchValue({
        EsEmpresa: si
      });
      this.limpiarValidacionSegmento();
      this.isEmpresa(si);
    }
  }

  ngOnInit() {
    this.mensajeValidar = {};
    //this.maxDate = moment(new Date()).format('YYYY-MM-DD');
    this.minDate = new Date(1800, 0, 1);
    this.maxDate = new Date();
    this.soloLectura = false;
    this.bloquearInputMail = false;
    this.verParentesco = true;
    this.inicializarFormularios();
    this.listaCanton = new Array<any>();
    this.listaParentesco = new Array<any>();
    this.listaClienteContacto = new Array<any>();
    this.listaCantones = new Array<any>();
    this.listaTelefonos = Array<LocalizaciónCliente>();
    this.listaCorreos = Array<LocalizaciónCliente>();
    this.listaDirecciones = Array<Direccion>();
    this.listaSegmento = new Array<any>();
    this.listaSegmentoAll = new Array<any>();
    this.formCliente = new Cliente();
    this.listaTipoIdentificacion = new Array<any>();
    this.listaCambiante = new Array<any>();
    this.listaGenero = new Array<any>();
    this.listaEstadoCivil = new Array<any>();
    this.listaPais = new Array<any>();
    this.listaProvincia = new Array<any>();
    this.listaCanton = new Array<any>();
    this.listaCantones = new Array<any>();
    this.listaFuerzaVenta = new Array<any>();
    this.catalogoTelefonos = new Array<any>();
    this.catalogoDirecciones = new Array<any>();
    this.catalogoCorreos = new Array<any>();
    this.catalogos();
  }

  validarEntrada(event) {
    return this.comun.isNumberKey(event);
  }

  validarNumLetras(event) {
    return this.comun.validarEntrada(event);
  }
  cambiarTipoIdentificacion() {
    let _si = this.formulario.value.EsEmpresa ? true : false;
    const funcionValida = validarTiposIdentificacion;
    funcionValida(this.formulario.controls["Identificacion"], this.formulario.get('TipoIdentificacion').value, _si);
  }

  verDuplicidad() {
    this.cargarDetalle = true;
    this.crud.obtener(`${this.url}${config.sigsIntg.cancelacion.verDuplicidad}${this.formulario.value.Identificacion}`).subscribe(response => {
      if (response !== null) {
        this.mensajeValidar = this.verDuplidado.find(item => item.id === response);
        switch (this.mensajeValidar.id) {
          case 1:
          case 2:
          case 3:
            this.verDetalle(this.formulario.value.Identificacion);
            break;
          default:
            this.cargarDetalle = false;
            break;
        }

      } else {
        this.mensajeValidar = this.verDuplidado[0];
        this.cargarDetalle = false;
      }
    }, error => {
      this.mensajeValidar = this.verDuplidado[0];
      this.cargarDetalle = false;
    });
  }

  verBoton() {
    if (!this.formCliente.IdCliente && this.formulario.value.Identificacion) {
      return true;
    } else {
      return false;
    }
  }

  estaVacio(obj) {
    return this.comun.isEmptyObject(obj);
  }

  removeSpaces(e) {
    return this.comun.noEspacio(e);
  }

  cambiarTipoTelefono() {
    let controName = this.frmTelefono.controls["Valor"];
    let tipo = this.frmTelefono.get('TipoLocalizacion').value;
    const funcionValida = validarTelefonos;
    funcionValida(controName, tipo);
  }

  tieneTipoId() {
    let tipo = this.formulario.get('TipoIdentificacion').value;
    if (tipo) {
      switch (tipo) {
        case "C":
          this.lengthIdentificacion = 10;
          break;
        case "R":
          this.lengthIdentificacion = 13;
          break;
        default:
          this.lengthIdentificacion = 50;
          break;
      }
    }
    return this.comun.isEmpty(this.formulario.get('TipoIdentificacion').value);
  }

  tieneTipoTelf() {
    let tipo = this.frmTelefono.get('TipoLocalizacion').value;
    if (tipo === "MD" || tipo === "MP") this.maxlengthTelf = 10;
    else this.maxlengthTelf = 9;

    return this.comun.isEmpty(this.frmTelefono.get('TipoLocalizacion').value);
  }

  private limpiarParcial() {
    if (this.formulario.value.EsEmpresa) {
      this.formulario.patchValue({
        PrimerNombre: '',
        SegundoNombre: '',
        PrimerApellido: '',
        SegundoApellido: '',
        Genero: '',
        EstadoCivil: '',
        FechaNacimiento: ''
      });
    } else {
      this.formulario.patchValue({
        FechaConstitucion: '',
        RazonSocial: '',
        NombreJuridico: '',
        NombreRepresentante: ''
      });
    }
  }

  tratarContactoCliente() {
    if (this.formulario.value.EsEmpresa) {
      return this.listaClienteContacto;
    } else {
      return this.listaClienteContacto = new Array<any>();
    }
  }

  guardarClienteEmpresa() {
    if (this.formulario.valid) {
      this.cargando = true;
      let direccionTrabajo = this.direccionXtipo('DT');
      let direccionDomicilio = this.direccionXtipo('DD');
      let emaiPersonal = this.emailXtipo('EP');
      let emaiTrabajo = this.emailXtipo('ET');
      let telfTrabajo = this.telefonoXtipo('TT');
      let movilPersonal = this.telefonoXtipo('MP');
      let telefonoDomicilio = this.telefonoXtipo('TD');
      this.limpiarParcial();
      var clienteEnviar: Cliente = this.formulario.value;
      clienteEnviar.IdCliente = this.formCliente.IdCliente ? this.formCliente.IdCliente : null;
      clienteEnviar.IdContactoZoho = this.formCliente.IdContactoZoho ? this.formCliente.IdContactoZoho : null;
      clienteEnviar.IdentificacionRepresentante = this.formCliente.IdentificacionRepresentante ? this.formCliente.IdentificacionRepresentante : null;
      clienteEnviar.DireccionCliente = this.listaDirecciones;
      clienteEnviar.ContactoCliente = this.tratarContactoCliente();
      if (direccionTrabajo) {
        clienteEnviar.PaisTrabajo = direccionTrabajo.CodigoPais;
        clienteEnviar.ProvinciaTrabajo = direccionTrabajo.CodigoProvincia;
        clienteEnviar.CantonTrabajo = direccionTrabajo.CodigoCanton;
        clienteEnviar.DireccionTrabajo = direccionTrabajo.CallePrincipal;
      }
      if (direccionDomicilio) {
        clienteEnviar.PaisDomicilio = direccionDomicilio.CodigoPais;
        clienteEnviar.ProvinciaDomicilio = direccionDomicilio.CodigoProvincia;
        clienteEnviar.CantonDomicilio = direccionDomicilio.CodigoCanton;
        clienteEnviar.DireccionDomicilio = `${direccionDomicilio.CallePrincipal} ${direccionDomicilio.Numeracion ? direccionDomicilio.Numeracion : ''} ${direccionDomicilio.CalleSecundaria ? direccionDomicilio.CalleSecundaria : ''}`
      }
      if (emaiPersonal) {
        clienteEnviar.EmailPersonal = emaiPersonal.Valor;
      }
      if (emaiTrabajo) {
        clienteEnviar.EmailTrabajo = emaiTrabajo.Valor;
      }
      if (telfTrabajo) {
        clienteEnviar.TelefonoTrabajo = telfTrabajo.Valor;
      }
      if (telefonoDomicilio) {
        clienteEnviar.TelefonoDomicilio = telefonoDomicilio.Valor;
      }
      if (movilPersonal) {
        clienteEnviar.MovilPersonal = movilPersonal.Valor;
      }
      clienteEnviar.LocalizacionCliente = this.listaTelefonos.concat(this.listaCorreos);

      let fv = this.listaFuerzaVenta.find(fv => fv.Codigo === clienteEnviar.FuerzaVenta)
      fv ? clienteEnviar.FuerzaVenta = `${fv.Codigo}|${fv.Nombre}` : clienteEnviar.FuerzaVenta;

      let ti = this.listaTipoIdentificacion.find(tp => tp.Codigo === clienteEnviar.TipoIdentificacion);
      ti ? clienteEnviar.TipoIdentificacion = `${ti.Codigo}|${ti.Nombre}` : clienteEnviar.TipoIdentificacion;

      let ge = this.listaGenero.find(item => item.Codigo === clienteEnviar.Genero);
      ge ? clienteEnviar.Genero = `${ge.Codigo}|${ge.Nombre}` : clienteEnviar.Genero;

      let civil = this.listaEstadoCivil.find(item => item.Codigo === clienteEnviar.EstadoCivil);
      civil ? clienteEnviar.EstadoCivil = `${civil.Codigo}|${civil.Nombre}` : clienteEnviar.EstadoCivil;

      let pais = this.listaPais.find(item => item.Codigo === clienteEnviar.PaisDomicilio);
      pais ? clienteEnviar.PaisDomicilio = `${pais.Codigo}|${pais.Nombre}` : clienteEnviar.PaisDomicilio;

      let prov = this.listaProvincia.find(item => item.Codigo === clienteEnviar.ProvinciaDomicilio);
      prov ? clienteEnviar.ProvinciaDomicilio = `${prov.Codigo}|${prov.Nombre}` : clienteEnviar.ProvinciaDomicilio;

      let seg = this.listaSegmentoAll.find(item => item.Codigo === clienteEnviar.Segmento);
      seg ? clienteEnviar.Segmento = `${seg.Codigo}|${seg.Nombre}` : clienteEnviar.Segmento;

      this.tmpCedula = clienteEnviar.Identificacion;

      this.guardarActualizar(clienteEnviar);

    }

  }

  private guardarActualizar(obj) {
    this.subscription.add(
      this.crud.post(`${this.url}${config.sigsIntg.cancelacion.upsertClienteEmpresa}`, obj).subscribe(response => {
        if (typeof response !== 'undefined') {
          if (response.Code === config.zohoSuccess) {
            this.mensajeCorrecto(response);
          } else {
            this.mensajeError(response);
          }
        } else {
          this.cargando = false;
          this.alertify.error(`${ErrorZoho.errores[3].msj}<br> Vuelva a intentar más tarde.`);
        }
      }));
  }

  private mensajeCorrecto(obj) {
    switch (obj.Message) {
      case "record added":
        this.alertify.message("El registro se guardo correctamente.");
        break;
      case "record updated":
        this.alertify.message("Los cambios se guardaron correctamente.");
        break;
      default:
        break;
    }
    this.cargando = false;
    if (this.identificacionURL) {
      this.tmpCedula = "";
      this.statusOk();
    } else {
      switch (this.app) {
        case "zoho":
          this.statusOk();
          this.tmpCedula = "";
          break;
        case "sigs":
          this.limpiar();
          this.obtenerTODO();
          this.verDetalle(this.tmpCedula);
          break;
        default:
          break;
      }
    }
  }

  private mensajeError(obj) {
    const msError = ErrorZoho.errores.find(item => item.code === obj.Code.toUpperCase());
    if (msError) {
      this.alertify.error(`${msError.msj}`);
    } else {
      this.alertify.error(`${ErrorZoho.errores[3].msj}`);
    }
    this.tmpCedula = "";
    this.cargando = false;
  }


  cancelarEvento() {
    if (this.identificacionURL) {
      this.popupCancel();
    } else {
      this.limpiar();
      this.obtenerTODO();
      this.soloLectura = false;
      this.soloLecturaCheck = false;
    }
  }

  cancelar() {
    if (this.identificacionURL) {
      this.popupCancel();
    } else {
      switch (this.app) {
        case "zoho":
          this.popupCancel();
          break;
        case "sigs":
          this.limpiar();
          this.obtenerTODO();
          break;
        default:
          break;
      }
      this.soloLectura = false;
      this.soloLecturaCheck = false;
    }
  }

  popupCancel() {
    this.subscription.add(
      this.comun.confirmDialog("Salir", `¿Desea cerrar la ventanta?`).subscribe(valido => {
        if (valido) {
          this.limpiar();
          window.close();
        }
      }));
  }

  limpiar() {
    this.submitted = false;
    this.formulario.reset();
    this.formCliente = new Cliente();
    this.listaDirecciones = new Array<Direccion>();
    this.listaTelefonos = new Array<LocalizaciónCliente>();
    this.listaCorreos = new Array<LocalizaciónCliente>();
    this.listaSegmento = new Array<any>();
    this.listaFuerzaVenta = new Array<any>();
    this.listaClienteContacto = new Array<any>();
    this.mensajeValidar = {};
    this.isEmpresa(false);
  }

  statusOk() {
    this.subscription.add(this.comun.confirmDialog("Aviso", `Es necesario actualizar la página de ${config.zoho} <b>CRM</b> para visualizar los cambios.<br> Presione <b>SI</b> para salir de la ventana.`).subscribe(valido => {
      if (valido) {
        this.limpiar();
        window.close();
      } else {
        this.limpiar();
        window.close();
      }
    }));
  }

  elementoFila(cliente: Cliente, direccion: Direccion, email: LocalizaciónCliente, telefono: LocalizaciónCliente) {
    this.formCliente = cliente;
    this.esEmpresa = cliente.EsEmpresa;
    if (direccion) {
      this.formulario.patchValue({
        PaisDomicilio: direccion.CodigoPais,
        ProvinciaDomicilio: direccion.CodigoProvincia,
        CantonDomicilio: direccion.CodigoCanton,
        DireccionDomicilio: `${direccion.CallePrincipal} ${direccion.Numeracion ? direccion.Numeracion : ''} ${direccion.CalleSecundaria ? direccion.CalleSecundaria : ''}`,
      });
    }
    if (email) {
      this.formulario.patchValue({
        EmailPersonal: email.Valor,
      });
    }
    if (telefono) {
      this.formulario.patchValue({
        TelefonoDomicilio: telefono.Valor,
      });
    }
    this.formulario.patchValue({
      Identificacion: cliente.Identificacion,
      TipoIdentificacion: cliente.TipoIdentificacion,
      PrimerNombre: cliente.PrimerNombre,
      SegundoNombre: cliente.SegundoNombre,
      PrimerApellido: cliente.PrimerApellido,
      SegundoApellido: cliente.SegundoApellido,
      Genero: cliente.Genero,
      EstadoCivil: cliente.EstadoCivil,
      FechaNacimiento: cliente.FechaNacimiento,
      Segmento: cliente.Segmento,
      FuerzaVenta: this.listaFuerzaVenta.length > 0 ? this.listaFuerzaVenta[0].Codigo : cliente.FuerzaVenta,
      EsEmpresa: cliente.EsEmpresa,
      EsVIP: cliente.EsVIP,
      FechaConstitucion: cliente.FechaConstitucion,
      RazonSocial: cliente.RazonSocial,
      NombreJuridico: cliente.NombreJuridico,
      NombreRepresentante: cliente.NombreRepresentante
    });
    this.verificarSwich(this.esEmpresa);
    if (this.identificacionURL) {
      this.limpiarValidacionSegmento();
    }
    this.cambiarTipoIdentificacion();
    this.soloLectura = true;
    this.soloLecturaCheck = true;
  }

  verDetalle(identificacion) {
    this.cargarDetalle = true;
    this.listaTelefonos = Array<LocalizaciónCliente>();
    this.listaCorreos = Array<LocalizaciónCliente>();
    this.listaDirecciones = Array<Direccion>();
    this.subscription.add(
      this.crud.obtener(`${this.url}${config.sigsIntg.cancelacion.buscarXDni}${identificacion}${config.sigsIntg.token}`).subscribe((cliente: Cliente) => {
        if (cliente) {
          this.listaSegmento = Array<any>();
          this.formulario.reset();
          this.listaCanton = new Array<any>();
          this.listaClienteContacto = new Array<any>();
          let listaEmailTmp: any[] = new Array<any>();
          let listaTelfTmp: any[] = new Array<any>();
          if (cliente.LocalizacionCliente != null) {
            cliente.LocalizacionCliente.forEach(item => {
              item.TipoLocalizacion.charAt(0) === 'E' ? listaEmailTmp.push(item) : listaTelfTmp.push(item);
            });
          }
          let idSegmento = cliente.Segmento ? cliente.Segmento : this.TODOS;
          this.subscription.add(
            this.obtenerCantonFuezaVenta(cliente.ProvinciaDomicilio, idSegmento).
              subscribe(respose => {
                this.listaCanton = respose[0];
                this.listaSegmento = respose[1];
                this.listaFuerzaVenta = respose[2];
                let direccionLista = this.obtenerPrincipal(cliente.DireccionCliente, 'D');
                let emailLista = this.obtenerPrincipal(listaEmailTmp, 'T');
                let telfLista = this.obtenerPrincipal(listaTelfTmp, 'T');

                this.elementoFila(cliente, direccionLista[1], emailLista[1], telfLista[1]);
                this.listaDirecciones = direccionLista[0];
                this.listaCorreos = emailLista[0];
                this.listaTelefonos = telfLista[0];
                this.listaClienteContacto = cliente.ContactoCliente;
                this.cargarDetalle = false;
              }, error => {
                this.alertify.error("No hay respuesta del servidor.<br> Vuelva a intentar más tarde.");
                this.cargarDetalle = false;
              }));
        } else {
          this.noHayCliente(identificacion);
        }
      }, error => {
        this.alertify.error("No hay respuesta del servidor.<br> Vuelva a intentar más tarde.");
        this.cargarDetalle = false;
      }));
  }

  obtenerPrincipales(lista: Direccion[]): any {
    let direccionPrincipal: any;
    let listaPrincipalUnico: Direccion[] = new Array<Direccion>();
    if (lista.length > 0) {
      direccionPrincipal = lista.find(item => item.EsPrincipal);
      if (direccionPrincipal) {
        for (const item of lista) {
          if (item.IdDireccionCliente !== direccionPrincipal.IdDireccionCliente) {
            item.EsPrincipal = false;
          }
          listaPrincipalUnico.push(item);
        }
      } else {
        direccionPrincipal = lista[0];
        listaPrincipalUnico = lista;
      }
    }
    return [listaPrincipalUnico, direccionPrincipal];
  }

  obtenerPrincipal(lista, tipo: string): any {
    let objPrincipal: any;
    let listaPrincipalUnico: any[] = new Array<any>();
    if (lista != null) {
      objPrincipal = lista.find(item => item.EsPrincipal);
      if (objPrincipal) {
        listaPrincipalUnico = this.arrayXtipo(lista, tipo, objPrincipal);
      } else {
        objPrincipal = lista[0];
        listaPrincipalUnico = lista;
      }
    }
    return [listaPrincipalUnico, objPrincipal];
  }

  private arrayXtipo(lista, tipo, obj) {
    let listaPrincipalUnico: any[] = new Array<any>();
    switch (tipo) {
      case 'D':
        for (const item of lista) {
          if (item.IdDireccionCliente != obj.IdDireccionCliente)
            item.EsPrincipal = false;
          listaPrincipalUnico.push(item);
        }
        break;
      case 'T':
        for (const item of lista) {
          if (item.IdLocalizacionCliente != obj.IdLocalizacionCliente)
            item.EsPrincipal = false;
          listaPrincipalUnico.push(item);
        }
        break;
      default:
        break;
    }
    return listaPrincipalUnico;
  }

  obtenerCantonFuezaVenta(provincia, segmento): Observable<any> {
    const cantones = this.crud.obtener(`${this.url}${config.sigsIntg.catalogo.cantones}${provincia}&${config.tokenCalagolo}`);
    const segmentos = this.crud.obtener(`${this.url}${config.sigsIntg.catalogo.segmentos}${segmento}&${config.tokenCalagolo}`)
    const fuerzaVenta = this.crud.obtener(`${this.url}${config.sigsIntg.catalogo.fventas}${segmento}`);
    return forkJoin([cantones, segmentos, fuerzaVenta]);
  }

  noHayCliente(identificacion) {
    this.comun.confirmDialog("Aviso", `No se encontró registro con la identificación <b>${identificacion}</b>.<br> Verifique e intente nuevamente.`).subscribe(valido => {
      if (valido) {
        if (this.identificacionURL) {
          window.close();
        } else {
          $("#home_a").tab('show');
        }
      } else {
        if (this.identificacionURL) {
          window.close();
        } else {
          $("#home_a").tab('show');
        }
      }
      this.cargarDetalle = false;
    });
  }


  getRepresentante(data) {
    this.formCliente.IdentificacionRepresentante = data.identificacion;
    this.formulario.patchValue({ NombreRepresentante: data.nombre });
    this.popoupFiltro = false;
  }

  eventoEmitter(data) {
    switch (data.quien) {
      case "tab":
        this.verDetalle(data.identificacion);
        break;
      case "popoup":
        this.getRepresentante(data);
        break;
      default:
        this.getClienteContacto(data.identificacion);
        break;
    }
  }

  getClienteContacto(identificacion) {
    if (this.contactoDuplicado(identificacion)) {
      this.clienteContacto = new ContactoCliente();
      this.cargarDetalle = true;
      this.popupCCli = false;
      this.subscription.add(
        this.crud.obtener(`${this.url}${config.sigsIntg.cancelacion.buscarXDni}${identificacion}${config.sigsIntg.token}`).subscribe((cliente: Cliente) => {
          if (cliente) {
            this.clienteContacto.Identificacion = cliente.Identificacion;
            this.clienteContacto.IdPersona = cliente.IdPersona;
            this.clienteContacto.IdCliente = this.formCliente.IdCliente ? this.formCliente.IdCliente : null;
            this.clienteContacto.NombreContactoCliente = `${cliente.PrimerNombre} ${cliente.SegundoNombre} ${cliente.PrimerApellido} ${cliente.SegundoApellido}`;
            this.clienteContacto.TelefonoConvencional = cliente.TelefonoDomicilio;
            this.clienteContacto.Email = cliente.EmailPersonal;
            this.frmContacto.patchValue({
              NombreContactoCliente: `${cliente.PrimerNombre} ${cliente.SegundoNombre} ${cliente.PrimerApellido} ${cliente.SegundoApellido}`
            })
            this.cargarDetalle = false;
            this.verParentesco = false;
          }
        }, error => this.cargarDetalle = false));
    }
  }

  contactoDuplicado(identificacion) {
    if (!this.comun.isEmpty(this.formulario.get('Identificacion').value)) {
      if (identificacion !== this.formulario.get('Identificacion').value) {
        let dato = this.listaClienteContacto.find(item => item.Identificacion === identificacion);
        if (dato) {
          this.alertify.warning("No puede agregar datos duplicados.");
          return false;
        } else {
          return true;
        }
      } else {
        this.alertify.warning("Por favor selecciona otro registro.");
        return false;
      }
    } else {
      this.alertify.warning("Se requiere la identificación de la empresa.");
      return false;
    }
  }

  addContacto() {
    if (this.frmContacto.valid) {
      this.clienteContacto.Parentesco = this.frmContacto.get('Parentesco').value;
      this.clienteContacto.Activo = true;
      this.listaClienteContacto.push(this.clienteContacto);
      this.limpiarContacto();
    }
  }

  limpiarContacto() {
    this.frmContacto.reset();
    this.clienteContacto = new ContactoCliente();
    this.verParentesco = true;
  }

  eliminarContacto(index) {
    let oldData = this.listaClienteContacto[index];
    oldData.Activo = false;
    this.listaClienteContacto.splice(index, 1, oldData);
    $(`#cfila_${index}`).children('td, th').css('background-color', '#f39ea7');
  }

  validarEliminarTContacto(index) {
    this.subscription.add(
      this.comun.confirmDialog("Eliminar Registro", `El registro se eliminará de forma permanente.<br> ¿Está seguro?`).subscribe(valido => {
        if (valido) {
          this.eliminarContacto(index);
        }
      }));
  }


  confirmSave() {
    this.submitted = true;
    if (this.formulario.invalid) {
      this.alertify.openSnackBar('Verifique que los datos estén ingresados correctamente.', 'Intente nuevamente');
    } else {
      this.subscription.add(
        this.comun.confirmDialog("Guardar registro", `¿Está seguro que los datos ingresados son correctos?`).subscribe(valido => {
          if (valido) {
            this.guardarClienteEmpresa();
          } else this.submitted = false;
        }));
    }
  }

  checkValidarPais(valor) {
    var campos = Cliente.campos();
    if (valor === "EC") {
      this.formulario.controls["ProvinciaDomicilio"].setValidators(campos.find(campo => campo.id === 'ProvinciaDomicilio').validar);
      this.formulario.controls["CantonDomicilio"].setValidators(campos.find(campo => campo.id === 'CantonDomicilio').validar);
    } else {
      this.formulario.controls["ProvinciaDomicilio"].clearValidators();
      this.formulario.controls["CantonDomicilio"].clearValidators();
    }
    this.formulario.controls["ProvinciaDomicilio"].updateValueAndValidity();
    this.formulario.controls["CantonDomicilio"].updateValueAndValidity();
  }

  esUnicoPrincipal(lista: any[]): boolean {
    if (!lista) return false;
    if (lista.length != 1) return false;
    return lista.find(item => item.EsPrincipal) ? true : false;
  }

  //#### inicio manejo Teléfono

  nuevoTelfReg() {
    this.nuevoTelf = true;
    this.operacionTelf = false;
  }

  addUpdateTelefono(_telefono) {
    if (!this.operacionTelf) {
      if (!this.verDuplicadoReg(_telefono, this.listaTelefonos)) {
        this.telefono = new LocalizaciónCliente();
        this.telefono.IdCliente = this.formCliente.IdCliente;
        this.telefono.Valor = _telefono.Valor;
        this.telefono.EsPrincipal = _telefono.EsPrincipal;
        this.telefono.TipoLocalizacion = _telefono.TipoLocalizacion;
        this.telefono.Activo = true;
        if (!this.telefono.EsPrincipal)
          this.telefono.EsPrincipal = false;

        if (this.indexAux >= 0) {
          this.cambiarPrincipal(this.indexAux, this.listaTelefonos)
        }
        this.listaTelefonos.push(this.telefono);
        this.cancelarTelf();
      } else {
        this.alertify.warning("EL teléfono que desea registrar ya existe.");
      }
    } else {


      if (this.indexAux >= 0) {
        this.cambiarPrincipal(this.indexAux, this.listaTelefonos)
      }

      let oldData = this.listaTelefonos[this.indexTmp];
      if (oldData.TipoLocalizacion === _telefono.TipoLocalizacion && oldData.Valor === _telefono.Valor) {
        this.listaTelefonos.splice(this.indexTmp, 1, this.modificarTelefono(oldData, _telefono));
        this.cancelarTelf();
      } else {
        if (!this.verDuplicadoReg(_telefono, this.listaTelefonos)) {
          this.listaTelefonos.splice(this.indexTmp, 1, this.modificarTelefono(oldData, _telefono));
          this.cancelarTelf();
        }
        else {
          this.alertify.warning("EL teléfono que desea registrar ya existe.");
        }
      }


    }
    this.principalTelefono();
  }

  private modificarTelefono(oldData, newData) {
    oldData.Valor = newData.Valor;
    oldData.EsPrincipal = newData.EsPrincipal;
    oldData.TipoLocalizacion = newData.TipoLocalizacion;
    return oldData;
  }

  verDuplicadoReg(obj, lista) {
    let duplicado = lista.find(item => item.TipoLocalizacion === obj.TipoLocalizacion && item.Valor === obj.Valor);
    return duplicado ? true : false;
  }

  verificarTelfPrincipal() {
    let controName = this.frmTelefono.get('EsPrincipal');
    let mensaje = "Hay un teléfono marcado como principal.";
    this.validarEsPrincipal(this.listaTelefonos, controName, mensaje);
  }

  getFilaTelefono(telefono, index) {
    this.nuevoTelf = true;
    this.operacionTelf = true;
    this.indexTmp = index;
    this.frmTelefono.patchValue({
      Valor: telefono.Valor,
      TipoLocalizacion: telefono.TipoLocalizacion,
      EsPrincipal: telefono.EsPrincipal
    });
    this.cambiarTipoTelefono()
    this.rupTelefono = this.esUnicoPrincipal(this.listaTelefonos);
  }

  principalTelefono() {
    let telefonoDomicilio = this.listaTelefonos.find(dir => dir.EsPrincipal === true);
    if (telefonoDomicilio) {
      this.formulario.patchValue({
        TelefonoDomicilio: telefonoDomicilio.Valor
      });
    } else {
      this.formulario.patchValue({ TelefonoDomicilio: '' });
    }
  }


  getNombreTelefono(codigo) {
    let dir = this.catalogoTelefonos.find(dir => dir.Codigo === codigo);
    return dir ? dir.Nombre : '';
  }

  cancelarTelf() {
    this.frmTelefono.reset()
    this.telefono = new LocalizaciónCliente();
    this.nuevoTelf = false;
    this.operacionTelf = false;
    this.indexTmp = -1;
    this.indexAux = -1;
    this.rupTelefono = false;
  }

  eliminarTelf(index) {
    let oldData = this.listaTelefonos[index];
    oldData.Activo = false;
    oldData.EsPrincipal = false;
    this.listaTelefonos.splice(index, 1, oldData)
    $(`#filatelf_${index}`).children('td, th').css('background-color', '#f39ea7');
  }

  validarEliminarTelf(index) {
    this.subscription.add(
      this.comun.confirmDialog("Eliminar Registro", `El registro se eliminará de forma permanente.<br> ¿Está seguro?`).subscribe(valido => {
        if (valido) {
          this.eliminarTelf(index);
        }
      }));
  }
  //#### fin manejo Teléfono

  //#### inicio manejo Email

  nuevoEmailReg() {
    this.nuevoEmail = true;
    this.operacionEmail = false;
  }

  notiene() {
    if (this.formulario.get('Identificacion').value) {
      this.subscription.add(
        this.comun.confirmDialog("Crear registro", `Se va a crear un correo electrónico personal por defecto: <br> <b>
        ${this.formulario.get('Identificacion').value}${config.emailDefault}</b> <br> ¿Está seguro?`).subscribe(valido => {
          if (valido) {
            this.email = new LocalizaciónCliente();
            this.email.IdCliente = this.formCliente.IdCliente;
            this.email.Valor = `${this.formulario.get('Identificacion').value}${config.emailDefault}`;
            this.email.EsPrincipal = true;
            this.email.TipoLocalizacion = "EP";
            this.email.Activo = true;
            this.listaCorreos.push(this.email);
            this.cancelarEmail();
            this.principalEmail();
          }
        }));
    } else {
      this.alertify.warning("Se requiere la identificación del cliente.");
    }
  }

  addUpdateEmail(_correo) {
    if (!this.operacionEmail) {
      if (!this.verDuplicadoReg(_correo, this.listaCorreos)) {
        this.email = new LocalizaciónCliente();
        this.email.IdCliente = this.formCliente.IdCliente;
        this.email.Valor = _correo.Valor;
        this.email.EsPrincipal = _correo.EsPrincipal;
        this.email.TipoLocalizacion = _correo.TipoLocalizacion;
        this.email.Activo = true;

        if (!this.email.EsPrincipal)
          this.email.EsPrincipal = false;

        if (this.indexAux >= 0) {
          this.cambiarPrincipal(this.indexAux, this.listaCorreos)
        }

        this.listaCorreos.push(this.email);
        this.cancelarEmail();
      } else {
        this.alertify.warning("El email que desea registrar ya existe.");
      }
    } else {

      if (this.indexAux >= 0) {
        this.cambiarPrincipal(this.indexAux, this.listaCorreos)
      }

      let oldData = this.listaCorreos[this.indexTmp];
      if (oldData.TipoLocalizacion === _correo.TipoLocalizacion && oldData.Valor === _correo.Valor) {
        this.listaCorreos.splice(this.indexTmp, 1, this.modificarEmail(oldData, _correo));
        this.cancelarEmail();
      } else {
        if (!this.verDuplicadoReg(_correo, this.listaCorreos)) {
          this.listaCorreos.splice(this.indexTmp, 1, this.modificarEmail(oldData, _correo));
          this.cancelarEmail();
        } else {
          this.alertify.warning("El email que desea registrar ya existe.");
        }
      }

    }
    this.principalEmail();
  }

  modificarEmail(oldData, newData) {
    oldData.Valor = newData.Valor;
    oldData.EsPrincipal = newData.EsPrincipal;
    oldData.TipoLocalizacion = newData.TipoLocalizacion;
    return oldData;
  }

  verificarEmailPrincipal() {
    let controName = this.frmEmail.get('EsPrincipal');
    let mensaje = "Hay un email marcado como principal.";
    this.validarEsPrincipal(this.listaCorreos, controName, mensaje);
  }

  getFilaEmail(email, index) {
    this.nuevoEmail = true;
    this.operacionEmail = true;
    this.indexTmp = index;
    this.frmEmail.patchValue({
      Valor: email.Valor,
      TipoLocalizacion: email.TipoLocalizacion,
      EsPrincipal: email.EsPrincipal,
    });
    this.rupEmail = this.esUnicoPrincipal(this.listaCorreos);
  }

  principalEmail() {
    const emailPersonal = this.listaCorreos.find(dir => dir.EsPrincipal === true);
    if (emailPersonal) {
      this.formulario.patchValue({
        EmailPersonal: emailPersonal.Valor
      });
    } else {
      this.formulario.patchValue({ EmailPersonal: '' });
    }
  }

  getNombreEmail(codigo) {
    const dir = this.catalogoCorreos.find(dir => dir.Codigo === codigo);
    return dir ? dir.Nombre : '';
  }

  cancelarEmail() {
    this.frmEmail.reset();
    this.email = new LocalizaciónCliente();
    this.nuevoEmail = false;
    this.operacionEmail = false;
    this.indexTmp = -1;
    this.indexAux = -1;
    this.rupEmail = false;
    this.bloquearInputMail = false;
  }

  eliminarEmail(index) {
    const oldData = this.listaCorreos[index];
    oldData.Activo = false;
    oldData.EsPrincipal = false;
    this.listaCorreos.splice(index, 1, oldData)
    $(`#filaemail_${index}`).children('td, th').css('background-color', '#f39ea7');
  }

  validarEliminarEmail(index) {
    this.subscription.add(
      this.comun.confirmDialog("Eliminar Registro", `El registro se eliminará de forma permanente.<br> ¿Está seguro?`).subscribe(valido => {
        if (valido) {
          this.eliminarEmail(index);
        }
      }));
  }

  // #### fin manejo Teléfono

  // #### inicio manejo direccion

  nuevoReg() {
    this.nuevo = true;
    this.operacion = false;
  }

  getNombreDireccion(codigo) {
    const dir = this.catalogoDirecciones.find(dir => dir.Codigo === codigo);
    return dir ? dir.Nombre : '';
  }

  getNombrePais(codigo) {
    const pais = this.listaPais.find(pa => pa.Codigo === codigo);
    return pais ? pais.Nombre : '';
  }

  getNombreProvincia(codigo) {
    const provincia = this.listaProvincia.find(pro => pro.Codigo === codigo);
    return provincia ? provincia.Nombre : '';
  }

  getNombreCanton(codigo) {
    const canton = this.listaCanton.find(can => can.Codigo === codigo);
    return canton ? canton.Nombre : '';
  }

  addUpdateDireccion(_direccion) {
    if (!this.operacion) {
      this.direccion = new Direccion();
      this.direccion.IdCliente = this.formCliente.IdCliente;
      this.direccion.CodigoPais = _direccion.CodigoPais;
      this.direccion.CodigoProvincia = _direccion.CodigoProvincia;
      this.direccion.CodigoCanton = _direccion.CodigoCanton;
      this.direccion.TipoDireccion = _direccion.TipoDireccion;
      this.direccion.EsPrincipal = _direccion.EsPrincipal;
      this.direccion.CallePrincipal = _direccion.CallePrincipal;
      this.direccion.CalleSecundaria = _direccion.CalleSecundaria;
      this.direccion.Numeracion = _direccion.Numeracion;
      this.direccion.SitioReferencia = _direccion.SitioReferencia;
      this.direccion.EntregaCorrespondencia = _direccion.EntregaCorrespondencia;
      this.direccion.Activo = true;
      if (!this.direccion.EntregaCorrespondencia) {
        this.direccion.EntregaCorrespondencia = false;
      }
      if (!this.direccion.EsPrincipal) {
        this.direccion.EsPrincipal = false;
      }
      if (this.indexAux >= 0) {
        this.cambiarPrincipal(this.indexAux, this.listaDirecciones);
      }

      if (this.indexAux2 >= 0) {
        this.cambiarPrincipalCorrespondecia(this.indexAux2, this.listaDirecciones);
      }

      this.listaDirecciones.push(this.direccion);

    } else {

      if (this.indexAux >= 0) {
        this.cambiarPrincipal(this.indexAux, this.listaDirecciones);
      }

      if (this.indexAux2 >= 0) {
        this.cambiarPrincipalCorrespondecia(this.indexAux2, this.listaDirecciones);
      }

      const oldData = this.listaDirecciones[this.indexTmp];
      if (!oldData.EntregaCorrespondencia) {
        oldData.EntregaCorrespondencia = false;
      }
      this.listaDirecciones.splice(this.indexTmp, 1, this.modificarFila(oldData, _direccion));

    }
    this.cancelarDireccion();
    this.principalDireccion();
    this.letura = false;
  }

  cambiarPrincipal(index, lista) {
    const oldPrin = lista[index];
    if (oldPrin) {
      oldPrin.EsPrincipal = false;
      lista.splice(index, 1, oldPrin);
    }
  }

  cambiarPrincipalCorrespondecia(index, lista) {
    const oldPrin = lista[index];
    if (oldPrin) {
      oldPrin.EntregaCorrespondencia = false;
      lista.splice(index, 1, oldPrin);
    }
  }

  modificarFila(oldData: Direccion, newData: Direccion): Direccion {
    oldData.CodigoPais = newData.CodigoPais;
    oldData.CodigoProvincia = newData.CodigoProvincia;
    oldData.CodigoCanton = newData.CodigoCanton;
    oldData.TipoDireccion = newData.TipoDireccion;
    oldData.EsPrincipal = newData.EsPrincipal;
    oldData.CallePrincipal = newData.CallePrincipal;
    oldData.Numeracion = newData.Numeracion;
    oldData.CalleSecundaria = newData.CalleSecundaria;
    oldData.SitioReferencia = newData.SitioReferencia;
    oldData.EntregaCorrespondencia = newData.EntregaCorrespondencia;
    oldData.Activo = newData.Activo;
    return oldData;
  }

  verificarEntregaCorrespondecia() {
    const controName = this.frmDirecion.get('EntregaCorrespondencia');
    const mensaje = "Hay una dirección marcada para entrega de correspondencia.";
    this.validarCorrespondecia(this.listaDirecciones, controName, mensaje);
  }

  verificarDireccionPrincipal() {
    const controName = this.frmDirecion.get('EsPrincipal');
    const mensaje = "Hay una dirección marcada como principal.";
    this.validarEsPrincipal(this.listaDirecciones, controName, mensaje);
  }

  validarEsPrincipal(lista, controName, mensaje) {
    const principal = controName;
    if (principal.value) {
      const index = lista.findIndex(item => item.EsPrincipal === principal.value);
      if (index >= 0) {
        this.indexAux = index;
        this.validarCambio(principal, mensaje);
      }
    } else {
      const index = lista.findIndex(item => item.EsPrincipal === true);
      if (index >= 0) {
        this.validarCambioFalse(principal, "Tiene que activar otro registro como Principal.");
      }
    }
  }

  validarCorrespondecia(lista, controName, mensaje) {
    const principal = controName;
    if (principal.value) {
      const index = lista.findIndex(item => item.EntregaCorrespondencia === principal.value);
      if (index >= 0) {
        this.indexAux2 = index;
        this.validarCambio(principal, mensaje);
      }
    }
  }

  validarCambio(controName, mensaje) {
    this.subscription.add(
      this.comun.confirmDialog("Aviso", `${mensaje}<br> ¿Desea cambiar?`).subscribe(valido => {
        if (valido) {
          controName.setValue(true);
        } else {
          controName.setValue(false);
          this.indexAux = -1;
          this.indexAux2 = -1;
        }
      }));
  }

  validarCambioFalse(controName, mensaje) {
    this.subscription.add(
      this.comun.confirmDialog("Aviso", `${mensaje}<br> ¿Desea cambiar?`).subscribe(valido => {
        if (valido) {
          controName.setValue(false);
        } else {
          controName.setValue(true);
          this.indexAux = -1;
          this.indexAux2 = -1;
        }
      }));
  }

  principalDireccion() {
    let direccioDomicilio = this.listaDirecciones.find(dir => dir.EsPrincipal == true);
    if (direccioDomicilio) {
      this.formulario.patchValue({
        PaisDomicilio: direccioDomicilio.CodigoPais,
        ProvinciaDomicilio: direccioDomicilio.CodigoProvincia,
        CantonDomicilio: direccioDomicilio.CodigoCanton,
        DireccionDomicilio: `${direccioDomicilio.CallePrincipal} ${direccioDomicilio.Numeracion ? direccioDomicilio.Numeracion : ''} ${direccioDomicilio.CalleSecundaria ? direccioDomicilio.CalleSecundaria : ''}`
      });
    } else {
      this.formulario.patchValue({ PaisDomicilio: '', ProvinciaDomicilio: '', CantonDomicilio: '', DireccionDomicilio: '' });
    }
  }

  direccionXtipo(tipoDirecion) {
    let direccion = this.listaDirecciones.find(dir => dir.TipoDireccion === tipoDirecion && dir.EsPrincipal == true);
    return direccion ? direccion : this.listaDirecciones.find(dir => dir.TipoDireccion === tipoDirecion);
  }

  emailXtipo(tipoEmail) {
    let email = this.listaCorreos.find(dir => dir.TipoLocalizacion === tipoEmail && dir.EsPrincipal == true);
    return email ? email : this.listaCorreos.find(cor => cor.TipoLocalizacion === tipoEmail);
  }

  telefonoXtipo(tipo) {
    let telefono = this.listaTelefonos.find(dir => dir.TipoLocalizacion === tipo && dir.EsPrincipal == true);
    return telefono ? telefono : this.listaTelefonos.find(dir => dir.TipoLocalizacion === tipo);
  }

  eliminarDireccion(index) {
    let oldData = this.listaDirecciones[index];
    oldData.Activo = false;
    oldData.EsPrincipal = false;
    oldData.EntregaCorrespondencia = false;
    this.listaDirecciones.splice(index, 1, oldData)
    $(`#fila_${index}`).children('td, th').css('background-color', '#f39ea7');
  }

  validarEliminar(index) {
    this.subscription.add(
      this.comun.confirmDialog("Eliminar Registro", `El registro se eliminará de forma permanente.<br> ¿Está seguro?`).subscribe(valido => {
        if (valido) {
          this.eliminarDireccion(index);
        }
      }));
  }

  getFilaDireccion(direccion, index) {
    this.nuevo = true;
    this.operacion = true;
    this.indexTmp = index;
    direccion.CodigoPais === 'EC' ? this.letura = false : this.letura = true;
    this.frmDirecion.patchValue({
      CodigoPais: direccion.CodigoPais,
      CodigoProvincia: direccion.CodigoProvincia,
      CodigoCanton: direccion.CodigoCanton,
      TipoDireccion: direccion.TipoDireccion,
      EsPrincipal: direccion.EsPrincipal,
      CallePrincipal: direccion.CallePrincipal,
      CalleSecundaria: direccion.CalleSecundaria,
      Numeracion: direccion.Numeracion,
      SitioReferencia: direccion.SitioReferencia,
      EntregaCorrespondencia: direccion.EntregaCorrespondencia,
      Activo: direccion.Activo
    });
    this.rupDireccion = this.esUnicoPrincipal(this.listaDirecciones);
  }

  checkValidar(valor) {
    var campos = Direccion.campos();
    if (valor === "EC") {
      this.frmDirecion.controls["CodigoProvincia"].setValidators(campos.find(campo => campo.id === 'CodigoProvincia').validar);
      this.frmDirecion.controls["CodigoCanton"].setValidators(campos.find(campo => campo.id === 'CodigoCanton').validar);
      this.letura = false;
    } else {
      this.frmDirecion.controls["CodigoCanton"].setValue('');
      this.frmDirecion.controls["CodigoProvincia"].setValue('');
      this.frmDirecion.controls["CodigoProvincia"].clearValidators();
      this.frmDirecion.controls["CodigoCanton"].clearValidators();
      this.letura = true;
    }
    this.frmDirecion.controls["CodigoCanton"].updateValueAndValidity();
    this.frmDirecion.controls["CodigoProvincia"].updateValueAndValidity();

  }

  cancelarDireccion() {
    this.frmDirecion.reset()
    this.direccion = new Direccion();
    this.nuevo = false;
    this.operacion = false;
    this.indexTmp = -1;
    this.indexAux = -1;
    this.indexAux2 = -1;
    this.rupDireccion = false;
  }

  cambiarEstadoDireccion() {
    let nameControl = this.frmDirecion.get('Activo');
    if (!nameControl.value)
      this.frmDirecion.get('EsPrincipal').setValue(false)
  }

  //###### fin manejo direccion


  //Obtener Catálogo//

  obtenerCanton(idProvincia) {
    if (idProvincia) {
      this.cargarCantonFrm = true;
      this.listaCanton = new Array<any>();
      this.subscription.add(
        this.crud.obtener(`${this.url}${config.sigsIntg.catalogo.cantones}${idProvincia}&${config.tokenCalagolo}`).subscribe((response: any) => {
          this.listaCanton = response;
          this.cargarCantonFrm = false;
        }, error => { this.cargarCantonFrm = false; this.alertify.error("No hay respuesta del servidor.<br> Vuelva a intentar más tarde."); }));
    }
  }

  obtenerCantonPopup(idProvincia) {
    this.cargandoCanton = true;
    this.listaCantones = new Array<any>();
    this.subscription.add(
      this.crud.obtener(`${this.url}${config.sigsIntg.catalogo.cantones}${idProvincia}&${config.tokenCalagolo}`).subscribe((response: any) => {
        this.listaCantones = response;
        this.cargandoCanton = false;
      }, error => {
        this.cargandoCanton = false;
        this.alertify.error("No hay respuesta del servidor.<br> Vuelva a intentar más tarde.");
      }));
  }

  obtenerFuerzaVenta(codigoSegmento) {
    this.cargarFv = true;
    this.subscription.add(
      this.crud.obtener(`${this.url}${config.sigsIntg.catalogo.fventas}${codigoSegmento}&${config.tokenCalagolo}`).
        subscribe((fventa: any) => {
          this.listaFuerzaVenta = fventa;
          this.formulario.get('FuerzaVenta').setValue(this.listaFuerzaVenta.length > 0 ? this.listaFuerzaVenta[0].Codigo : '');
          this.cargarFv = false;
        }, error => {
          this.alertify.error("No hay respuesta del servidor.<br> Vuelva a intentar más tarde.");
          this.cargarFv = false;
        }));
  }

  obtenerTODO() {
    this.crud.obtener(`${this.url}${config.sigsIntg.catalogo.segmentos}${this.TODOS}&${config.tokenCalagolo}`).subscribe((response: any) => {
      this.listaSegmento = response;
    });
  }

  obtenerCatalogos(): Observable<any> {
    const cat_telefonos = this.crud.obtener(`${this.url}${config.sigsIntg.catalogo.telefono}${config.tpTelefono}`);
    const cat_direcciones = this.crud.obtener(`${this.url}${config.sigsIntg.catalogo.direccion}${config.tokenCalagolo}`);
    const cat_correos = this.crud.obtener(`${this.url}${config.sigsIntg.catalogo.correo}${config.tpEmail}`);
    const cat_generos = this.crud.obtener(`${this.url}${config.sigsIntg.catalogo.generos}${config.tokenCalagolo}`);
    const cat_estadoCivil = this.crud.obtener(`${this.url}${config.sigsIntg.catalogo.estadoCivil}${config.tokenCalagolo}`);
    const cat_paises = this.crud.obtener(`${this.url}${config.sigsIntg.catalogo.paises}${config.tokenCalagolo}`);
    const cat_provincias = this.crud.obtener(`${this.url}${config.sigsIntg.catalogo.provincias}${config.tokenCalagolo}`);
    const cat_tIdentificacocion = this.crud.obtener(`${this.url}${config.sigsIntg.catalogo.tpIdentificaciones}${config.tokenCalagolo}`);
    const cat_segmentos = this.crud.obtener(`${this.url}${config.sigsIntg.catalogo.segmentos}${this.TODOS}&${config.tokenCalagolo}`);
    const cat_parentescos = this.crud.obtener(`${this.url}${config.sigsIntg.catalogo.parentesco}${config.tokenCalagolo}`);
    return forkJoin([cat_telefonos, cat_direcciones, cat_correos, cat_generos, cat_estadoCivil, cat_paises, cat_provincias, cat_tIdentificacocion, cat_segmentos, cat_parentescos]);
  }

  catalogos() {
    this.cargandoCata = true;
    this.subscription.add(
      this.obtenerCatalogos().subscribe(catalogos => {
        this.catalogoTelefonos = catalogos[0];
        this.catalogoDirecciones = catalogos[1];
        this.catalogoCorreos = catalogos[2];
        this.listaGenero = catalogos[3];
        this.listaEstadoCivil = catalogos[4];
        this.listaPais = catalogos[5];
        this.listaProvincia = catalogos[6];
        this.listaTipoIdentificacion = catalogos[7];
        this.listaSegmento = catalogos[8];
        this.listaSegmentoAll = catalogos[8];
        this.listaParentesco = catalogos[9];
        this.cargandoCata = false;
        this.cargarData.emit(false);
        this.catalogoDirecciones = this.catalogoDirecciones.filter(item => item.Codigo !== "DB");
        this.verificarSwich(this.esEmpresa);
        //this.listaCambiante = this.listaTipoIdentificacion.filter(item => item.Codigo === "E" || item.Codigo === "P" || item.Codigo === "C" || item.Codigo === "R");
      }, error => {
        this.alertify.error("No hay respuesta del servidor.<br> Vuelva a intentar más tarde.");
        this.cargaFallida();
        this.cargandoCata = false;
      }));
  }


  cargaFallida() {
    this.subscription.add(
      this.comun.confirmDialog("Aviso", `No hay respuesta del servidor.<br> ¿Desea recargar la ventana?`).subscribe(valido => {
        if (valido) {
          if (!this.identificacionURL) {
            this.cargarData.emit(true);
            this.catalogos();
          }
          else location.reload();
        } else {
          if (this.identificacionURL) {
            window.close();
          }
        }
      }));
  }

  isInfo(value: string) {
    return value ? value.length < 5 ? true : false : true;
  }

  ///Valicaciones Parciales

  validacionCliente() {
    var campos = Cliente.campos();
    this.formulario.controls["PrimerNombre"].setValidators(campos.find(campo => campo.id === 'PrimerNombre').validar);
    this.formulario.controls["PrimerNombre"].updateValueAndValidity();
    this.formulario.controls["PrimerApellido"].setValidators(campos.find(campo => campo.id === 'PrimerApellido').validar);
    this.formulario.controls["PrimerApellido"].updateValueAndValidity();
    this.formulario.controls["FechaNacimiento"].setValidators(campos.find(campo => campo.id === 'FechaNacimiento').validar);
    this.formulario.controls["FechaNacimiento"].updateValueAndValidity();
    this.formulario.controls["Genero"].setValidators(campos.find(campo => campo.id === 'Genero').validar);
    this.formulario.controls["Genero"].updateValueAndValidity();
    this.formulario.controls["EstadoCivil"].setValidators(campos.find(campo => campo.id === 'EstadoCivil').validar);
    this.formulario.controls["EstadoCivil"].updateValueAndValidity();
  }

  limpiarValidacionCliente() {
    this.formulario.controls["PrimerNombre"].clearValidators();
    this.formulario.controls["PrimerNombre"].updateValueAndValidity();
    this.formulario.controls["PrimerApellido"].clearValidators();
    this.formulario.controls["PrimerApellido"].updateValueAndValidity();
    this.formulario.controls["FechaNacimiento"].clearValidators();
    this.formulario.controls["FechaNacimiento"].updateValueAndValidity();
    this.formulario.controls["Genero"].clearValidators();
    this.formulario.controls["Genero"].updateValueAndValidity();
    this.formulario.controls["EstadoCivil"].clearValidators();
    this.formulario.controls["EstadoCivil"].updateValueAndValidity();
  }

  limpiarValidacionEmpresa() {
    this.formulario.controls["RazonSocial"].clearValidators();
    this.formulario.controls["RazonSocial"].updateValueAndValidity();
    this.formulario.controls["FechaConstitucion"].clearValidators();
    this.formulario.controls["FechaConstitucion"].updateValueAndValidity();
    this.formulario.controls["NombreJuridico"].clearValidators();
    this.formulario.controls["NombreJuridico"].updateValueAndValidity();
    this.formulario.controls["NombreRepresentante"].clearValidators();
    this.formulario.controls["NombreRepresentante"].updateValueAndValidity();
  }

  limpiarValidacionSegmento() {
    this.formulario.controls["Segmento"].clearValidators();
    this.formulario.controls["Segmento"].updateValueAndValidity();
  }

  validacionEmpresa() {
    this.formulario.controls["RazonSocial"].setValidators([Validators.nullValidator, Validators.required]);
    this.formulario.controls["RazonSocial"].updateValueAndValidity();
    this.formulario.controls["FechaConstitucion"].setValidators([Validators.nullValidator, Validators.required, ValidarFecha]);
    this.formulario.controls["FechaConstitucion"].updateValueAndValidity();
    this.formulario.controls["NombreJuridico"].setValidators([Validators.nullValidator, Validators.required]);
    this.formulario.controls["NombreJuridico"].updateValueAndValidity();
    this.formulario.controls["NombreRepresentante"].setValidators([Validators.nullValidator, Validators.required]);
    this.formulario.controls["NombreRepresentante"].updateValueAndValidity();
  }

  isEmpresa(value) {

    this.verificarSwich(value);
    this.esEmpresa = value;
    this.formulario.controls["TipoIdentificacion"].setValue("");
    this.cambiarTipoIdentificacion();
  }

  verificarSwich(value) {
    this.listaCambiante = new Array<any>();
    if (value) {
      this.limpiarValidacionCliente();
      this.validacionEmpresa();
      this.listaCambiante = this.listaTipoIdentificacion.filter(item => item.Codigo === "X" || item.Codigo === "R");
    } else {
      this.validacionCliente();
      this.limpiarValidacionEmpresa();
      this.listaCambiante = this.listaTipoIdentificacion.filter(item => item.Codigo === "E" || item.Codigo === "P" || item.Codigo === "C" || item.Codigo === "R");
    }
  }


  inicializarFormularios() {

    this.frmContacto = this.formService.generar(ContactoCliente.campos());
    this.subscription.add(
      this.frmContacto.valueChanges.subscribe((data) => {
        this.frmErrorContacto = this.formService.validateForm(this.frmContacto, this.frmErrorContacto, ContactoCliente.getCampos(), true)
      }));

    this.formulario = this.formService.generar(Cliente.campos());
    this.subscription.add(
      this.formulario.valueChanges.subscribe((data) => {
        this.formErrors = this.formService.validateForm(this.formulario, this.formErrors, Cliente.getCampos(), true)
      }));

    this.frmDirecion = this.formService.generar(Direccion.campos());
    this.subscription.add(
      this.frmDirecion.valueChanges.subscribe((data) => {
        this.frmErrorsDireccion = this.formService.validateForm(this.frmDirecion, this.frmErrorsDireccion, Direccion.getCampos(), true)
      }));

    this.frmTelefono = this.formService.generar(LocalizaciónCliente.camposT());
    this.subscription.add(
      this.frmTelefono.valueChanges.subscribe((data) => {
        this.frmErrorsTelefono = this.formService.validateForm(this.frmTelefono, this.frmErrorsTelefono, LocalizaciónCliente.getCampos(), true)
      }));

    this.frmEmail = this.formService.generar(LocalizaciónCliente.camposE());
    this.subscription.add(
      this.frmEmail.valueChanges.subscribe((data) => {
        this.frmErrorsEmail = this.formService.validateForm(this.frmEmail, this.frmErrorsEmail, LocalizaciónCliente.getCampos(), true)
      }));
  }

  ////######### Check Validación en formularios
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

  /*############# Abrir popup ############*/

  openDireccion(modal) {
    this.open(modal);
  }

  openTelefono(modal) {
    this.open(modal);
  }

  openEmail(modal) {
    this.open(modal);
  }

  openFiltro() {
    this.popoupFiltro = true;
  }

  openCCpopup() {
    this.popupCCli = true;
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.identificacionURL = false;
  }

  open(modalID) {
    this.comun.openClose(modalID, 'show');
  }

  close(modalID) {
    this.comun.openClose(modalID, 'hide');
  }

}

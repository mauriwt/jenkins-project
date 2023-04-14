import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ComunService, AlertifyService, CRUDService } from 'src/app/shared/services';
import { DxDataGridComponent } from "devextreme-angular";

import { ActivatedRoute, Router } from '@angular/router';
import { Cliente, Cancelacion, Documento, Constantes } from '../../models';

import { config } from 'src/app/shared/servicios.config';
import { Subscription, Observable } from 'rxjs';
import { ResumenCuadro } from '../../models/resumenCuotas';
import { EncrDecrService } from 'src/app/shared/services/encryDecryService';
import { Base } from 'src/app/shared/AppDominio';

import { environment } from '../../../environments/environment';


declare var $;


@Component({
  templateUrl: 'cancelacion.component.html',
  styleUrls: ['./cancelacion.component.scss'],
  providers: [ComunService]
})

export class CancelacionComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  @ViewChild('grid', { static: false }) grid: DxDataGridComponent;
  private apiBase = config.sigsIntg.dominio;
  public cliente: Cliente;
  public dataSource: any;
  public cancelacion: Cancelacion;
  cargando: boolean;
  producto: any;
  IdVentaPGS: number;

  parametro: any;
  private zohoData: any;
  public identificacion: string;
  public popupVisible: boolean;
  public urlDocumento: string;
  public DatosDevolucion: ResumenCuadro;
  public SwitchCancelar: boolean;
  public SwitchDevolver: boolean;
  public deAqui: string = Documento.getCodigoDetalleCatalogo()[1];

  nohay = "";
  public pos = -1;

  constructor(private cifrar: EncrDecrService, private crud: CRUDService, private aroute: ActivatedRoute, private comun: ComunService, private alertify: AlertifyService, private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
  }

  ngOnInit() {
    this.parametro = { IdVentaPGS: '', identificacion: '', nombres: '' };
    this.cancelacion = new Cancelacion();
    this.cliente = new Cliente();
    this.DatosDevolucion = new ResumenCuadro();
    this.recibirParametro();
  }

  recibirParametro() {
    const paramsURL = this.aroute.snapshot.params.zohoParams;
    if (paramsURL) {
      const listaParams = this.convertirParametro(this.aroute.snapshot.params.zohoParams);
      if (environment.cifrar) {
        this.permitirGestion(listaParams);
      } else {
        this.cargando = true;
        this.permitirGestionSinDesCifrar(listaParams);
      }
    }
  }

  permitirGestion(args: any[]) {
    if (args.length === 2) {
      this.cliente = new Cliente();
      this.cargando = true;
      this.validarTokenTransaccional(args[0]).subscribe((obj: any) => {
        if (obj.Valido) {
          this.permitirGestionSinDesCifrar(this.convertirParametro(this.cifrar.decode64(args[1])));
        } else {
          this.comun.confirmDialog("Error al cargar información", "Cierre la ventana e intente nuevamente", true).subscribe(valido => {
            if (valido) {
              window.close();
            }
          });
          this.cargando = false;
        }
      });
    } else {
      this.comun.confirmDialog("Parámetros Incorrectos", "Cierre la ventana e intente nuevamente", true).subscribe(valido => {
        if (valido) {
          window.close();
        }
      });
    }
  }

  permitirGestionSinDesCifrar(args: any[]) {
    if (this.validArray(args)) {
      this.zohoData = args;
      this.identificacion = args[0];
      this.obtenerCliente(this.identificacion);
      if (args[3] === Constantes.tipoCancelacion[0]) {
        this.SwitchCancelar = true;
      }
      if (args[3] === Constantes.tipoCancelacion[1] || args[3] === Constantes.tipoCancelacion[2]) {
        this.SwitchDevolver = true;
      }
    } else {
      this.comun.confirmDialog("Error al cargar información", "Cierre la ventana e intente nuevamente", true).subscribe(valido => {
        if (valido) {
          window.close();
        }
      });
      this.cargando = false;
    }
  }

  private validarTokenTransaccional(token) {
    return new Observable(observer => {
      this.crud.obtener(`${Base.integracionRest}${config.sigsIntg.accesoLimitado.tokenTransaccional}${token}`).subscribe(response => {
        observer.next(response);
      }, error => { this.cargando = false; });
    });
  }

  obtenerCliente(identificacion) {
    this.subscription.add(
      this.comun.getCliente(identificacion).subscribe((cliente: Cliente) => {
        if (cliente) {
          this.nohay = "";
          this.cliente = cliente;
          this.obtenerProductosCliente(this.identificacion);
        } else {
          this.cliente = new Cliente();
          this.nohay = "SI";
          this.cargando = false;
        }
      }, error => { this.nohay = ""; this.cargando = false; }));
  }

  obtenerProductosCliente(identificacion: string) {
    this.pos = -1;
    this.subscription.add(
      this.comun.obtenerProductosCliente(identificacion).subscribe(producto => {
        this.dataSource = producto;
        this.cargando = false;
      }, error => this.cargando = false));
  }

  elementoFila(producto) {
    if (typeof producto !== 'undefined') {
      if (this.validArray(this.zohoData)) {
        this.cancelacion = new Cancelacion();
        this.cancelacion.id = this.zohoData[2];
        this.cancelacion.Identificacion = this.zohoData[0];
        this.cancelacion.NumeroCancelacion = this.zohoData[1];
        this.cancelacion.IdCRM = this.zohoData[2];
        this.cancelacion.IdTicket = this.zohoData.length === 5 ? this.zohoData[this.zohoData.length - 1] : '';
        this.cancelacion.NumeroCertificado = producto.NumeroCertificado;
        this.cancelacion.Proveedor = producto.Compania;
        this.cancelacion.Ramo = producto.Ramo;
        this.cancelacion.NombreProducto = producto.NombreProducto;
        this.cancelacion.IdPoliza = producto.IdPoliza;
        this.cancelacion.NumeroPoliza = producto.NumeroPoliza;
        this.cancelacion.IdVenta = producto.IdVenta;
        this.cancelacion.IdProducto = producto.IdProducto;
        this.cancelacion.IdCliente = producto.IdCliente;
        this.cancelacion.IdCertificado = producto.IdCertificado;
        this.cancelacion.NombreCompleto = this.cliente.NombreCompleto;
        this.cancelacion.NombrePlan = producto.NombrePlan;
        this.cancelacion.NombreEstadoVenta = producto.NombreEstadoVenta;

        this.cancelacion.NumeroCuentaTarjeta = producto.NumeroCuentaTarjeta;
        this.cancelacion.TipoCuentaTarjeta = producto.TipoCuentaTarjeta;
        this.cancelacion.NombreSponsor = producto.NombreSponsor;
        this.cancelacion.NombreClienteAsegurado = producto.NombreClienteAsegurado;
        this.cancelacion.FechaUltimoCobro = producto.FechaUltimoCobro;
        this.cancelacion.MotivoCancelacion = producto.MotivoCancelacion;
        this.cancelacion.TipoCancelacion = this.zohoData[3];
        this.cancelacion.FechaInicioVigencia = producto.VigenciaDesde;
        this.registroCancelado(this.SwitchCancelar, this.cancelacion.NombreEstadoVenta);
      }
    }
  }

  registroCancelado(tipoCancelacion, estadoVenta) {
    if (tipoCancelacion && estadoVenta === Constantes.estadoVenta[0]) {
      this.quitarSeleccion();
      this.alertify.openSnackBar('El registro esta cancelado.', 'Seleccione otro producto.');
    }
  }

  color(e) {
    if (e.rowType === "data") {
      /* if (this.pos === -1) {
        this.pos = e.columns.find(h => h.caption === "Estado").index;
      } */
      switch (e.data.NombreEstadoVenta.toUpperCase()) {
        case Constantes.estadoVenta[0]:
          e.rowElement.bgColor = Constantes.colorFila[1];
          // e.rowElement.cells[this.pos].bgColor = Constantes.colorFila[1];
          break;
        default:
          break;
      }
    }
  }



  confirmSave() {
    if (this.isEmptyObject(this.cancelacion)) {
      this.alertify.openSnackBar('Es necesario seleccionar un producto', 'Intente nuevamente');
      this.cancelacion = new Cancelacion();
    } else {
      this.subscription.add(
        this.comun.confirmDialog("Cancelar producto", `Esta seguro que desea cancelar el producto ${this.cancelacion.NombreProducto}.`).subscribe(valido => {
          if (valido) {
            this.cargando = true;
            this.subscription.add(
              this.crud.post(`${this.apiBase}${config.sigsIntg.cancelacion.producto}`, this.cancelacion).subscribe(response => {
                if (typeof response !== 'undefined') {
                  if (response.code === config.zohoSuccess) {
                    this.cancelacion = new Cancelacion();
                    this.statusOk();
                    this.alertify.message("El proceso finalizó correctamente.");
                  } else {
                    this.quitarSeleccion();
                    this.alertify.error(response.message);
                  }
                } else {
                  this.quitarSeleccion();
                  this.alertify.error("No hay respuesta desde el servidor, intente mas tarde.");
                }
                this.cargando = false;
              }, error => { this.quitarSeleccion(); console.log(error); }));
          } else {
            this.quitarSeleccion();
          }
        }));
    }
  }

  quitarSeleccion() {
    this.grid.instance.deselectAll();
    this.grid.instance.option("focusedRowIndex", -1);
    this.cancelacion = new Cancelacion();
  }

  convertirParametro(zohoParams: string) {
    return zohoParams.split('|');
  }

  isEmptyObject(obj) {
    return this.comun.isEmptyObject(obj);
  }

  cancelar() {
    this.subscription.add(
      this.comun.confirmDialog("Salir", `Desea cerrar la ventanta ?`).subscribe(valido => {
        if (valido) {
          window.close();
          this.cancelacion = new Cancelacion();
        } else {
          this.quitarSeleccion();
        }
      }));
  }

  cancelarDevolucion(e) {
    this.quitarSeleccion();
  }

  statusOk() {
    this.subscription.add(
      this.comun.confirmDialog("Aviso", `Es necesario actualizar la página de ${config.zoho} <b>CRM</b> para visualizar los cambios.<br> Presione <b>SI</b> para salir de la ventana.`).subscribe(valido => {
        if (valido) {
          window.close();
          this.cancelacion = new Cancelacion();
        } else {
          this.quitarSeleccion();
        }
      }));
  }

  redirect(url): void {
    window.open(url, '_blank');
  }

  verDocumento(url) {
    this.popupVisible = true;
    this.urlDocumento = url;
  }

  irDocumentos(idVentaGps: number, modalId) {
    this.parametro = {
      IdVentaPGS: idVentaGps,
      identificacion: this.cliente.Identificacion,
      nombres: this.cliente.NombreCompleto
    };
    this.comun.openClose(modalId, 'show');
  }

  validArray(array) {
    return array.length >= 4;
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  limpiarIdVentaGps() {
    this.parametro = { IdVentaPGS: '', identificacion: '', nombres: '' };
  }
}

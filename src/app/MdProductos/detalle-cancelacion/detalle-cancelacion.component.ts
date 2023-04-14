import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core';
import { ComunService, AlertifyService, CRUDService } from 'src/app/shared/services';
import { ListaCuotas, ResumenCuotas, AdicionalesCuotas, Cancelacion, Constantes } from 'src/app/models';
import { config } from 'src/app/shared/servicios.config';
import { ResumenCuadro } from '../../models/resumenCuotas';
import { Subscription } from 'rxjs';

declare var $;

@Component({
  selector: 'app-detalle-cancelacion',
  templateUrl: './detalle-cancelacion.component.html',
  styleUrls: ['./detalle-cancelacion.component.scss'],
  providers: [ComunService]
})

export class DetalleCancelacionComponent implements OnInit, OnChanges, OnDestroy {

  //  VARIABLE DE ENTRADA
  @Input() DatosCertificado: any;

  @Output() public LimpiarData = new EventEmitter();

  // URL DEL SERVICIO
  private URLCuotas = config.confProducto.dominio;
  private URLAdicionales = config.sigsIntg.dominio;

  public cargando: boolean;
  private subscription: Subscription = new Subscription();

  // VARIABLES PARA LOS CUADROS ADICIONALES
  public listaCuotas: ListaCuotas[];
  public cuotasMarcadas: ListaCuotas[];
  public resumenCuotas: ResumenCuotas[];
  public adicionalesCuotas: AdicionalesCuotas[];
  public Impuestos: any[];
  public cancelaconVenta: any;

  // VARIABLE PARA EL CALCULO DEL RESUMEN
  public numeroCuotas: number;
  public Resumen = 0;
  public ResumenCuadro: ResumenCuadro;
  public CancelarDevolver: Cancelacion;
  public BloquearBoton: boolean;

  public TotalValorCuotas = 0;

  // CONSTRUCTOR - INICIALIZACION DE SERVICIOS
  constructor(private comun: ComunService,
    private alertify: AlertifyService,
    private crud: CRUDService) { }

  ngOnInit() {
    // INICIALIZA EL ARREGLO
    this.adicionalesCuotas = new Array<AdicionalesCuotas>();
    this.ObtenerValoresAdicionales();
  }


  ngOnChanges(changes: SimpleChanges): void {
    this.listaCuotas = new Array<ListaCuotas>();
    this.resumenCuotas = new Array<ResumenCuotas>();
    const tabData = changes.DatosCertificado;
    if (tabData !== undefined) {
      if (tabData.currentValue !== undefined && !this.comun.isEmptyObject(tabData.currentValue)) {
        this.numeroCuotas = null;
        this.ResumenCuadro = new ResumenCuadro();
        this.CancelarDevolver = new Cancelacion();
        this.CancelarDevolver = tabData.currentValue;
        this.ResumenCuadro.Certificado = this.CancelarDevolver.IdCertificado;
        this.ResumenCuadro.Cliente = this.CancelarDevolver.NombreCompleto;
        this.ResumenCuadro.Producto = this.CancelarDevolver.NombreProducto;
        this.BloquearBoton = this.btnBloquear(this.CancelarDevolver.NombreEstadoVenta, this.CancelarDevolver.TipoCancelacion);
        this.getCuotasByIdVenta(this.CancelarDevolver.IdVenta, this.CancelarDevolver.IdCertificado);
      }
    }
    this.LimpiarDatosCuadros();
  }

  btnBloquear(estadoVenta, tipo) {
    if ((estadoVenta === Constantes.estadoVenta[0] && tipo === Constantes.tipoCancelacion[2]) || estadoVenta === Constantes.estadoVenta[2]) {
      return true;
    } else { return false; }
  }

  getCuotasByIdVenta(idVenta: number, idCertificado: number) {
    this.cargando = true;
    this.subscription.add(
      this.crud.obtener(`${this.URLAdicionales}${config.sigsIntg.cancelacion.cuotas}${idCertificado}`).subscribe((response: any) => {
        this.cancelaconVenta = response;
        if (response.IdCancelacionVenta > 0) {
          this.mostrarResumen(this.cancelaconVenta.Total, this.cancelaconVenta.NumeroRequerimiento);
          this.ObtenerListaCuotas(idCertificado);
        } else {
          this.ObtenerListaCuotas(idCertificado);
        }
      }, error => this.cargando = false));
  }

  mostrarResumen(valoTotal: number, ticket: string) {
    this.comun.confirmDialog("Resumen - Devolución", `Tiene un ticket generado: <b>${ticket}</b>
                                                      <br><br>
                                                      <p><strong>Cliente: </strong>${this.ResumenCuadro.Cliente}<br>
                                                      <strong>Certificado: </strong>${this.ResumenCuadro.Certificado}<br>
                                                      <strong>Producto: </strong>${this.ResumenCuadro.Producto}<br>
                                                      <strong>Total Devolución: </strong>${this.comun.decimalPipe(valoTotal, '1.2-2')}</p>
                                                      <p><b>¿Desea modificar las cuotas a devolver?</b><p>`)
      .subscribe(valido => {
        if (valido) {
          // this.cuotasByEditar(this.cancelaconVenta)
        } else {
          this.Cancelar();
        }
      });
  }

  validarEntrada(event) {
    return this.comun.isNumberKey(event);
  }

  validarDecimalKey(event) {
    return this.comun.isDecimalKey(event);
  }

  //  METODO PARA OBTENER LOS DATOS DE LAS CUOTAS
  ObtenerListaCuotas(IdCertificado: number) {
    this.listaCuotas = new Array<ListaCuotas>();
    this.cargando = true;
    this.subscription.add(
      this.crud.obtener(`${this.URLCuotas}${config.confProducto.producto.cuotas}${IdCertificado}`)
        .subscribe((listaCuotas: any) => {
          this.cuotasTransformar(listaCuotas);

          this.cargando = false;
          if (listaCuotas.length === 0) {
            this.Cancelar();
            this.alertify.warning("No hay cuotas disponibles para el producto " + this.ResumenCuadro.Producto + ".");
          }
        }, error => this.cargando = false));
  }

  cuotasTransformar(lista: any[]) {
    this.TotalValorCuotas = 0;
    if (lista.length > 0) {
      for (const item of lista) {
        let obj = new ListaCuotas();
        obj = item;
        obj.checked = false;
        this.TotalValorCuotas += obj.PVPCobrado;
        this.listaCuotas.push(obj);
      }
    }
    this.cuotasByEditar(this.cancelaconVenta);
  }

  cuotasByEditar(objCuotas) {
    this.numeroCuotas = objCuotas.NumeroCuotas;
    this.CalcularResumen();
    if (objCuotas.IdCancelacionVenta > 0) {
      this.adicionalesCuotas = objCuotas.Adicional;
    }

  }

  //  METODO PARA OBTENER LOS VALORES ADICIONALES
  ObtenerValoresAdicionales() {
    this.subscription.add(
      this.crud.obtener(`${this.URLAdicionales}${config.sigsIntg.catalogo.valoresAdicionales}${config.tokenCalagolo}`)
        .subscribe((catalogoAdicionales: any) => {
          catalogoAdicionales.forEach(item => {
            const dato = new AdicionalesCuotas();
            dato.CodigoDetalleCatalogo = item.Codigo;
            dato.NombreAdicionales = item.Nombre;
            dato.Valor = 0;
            this.adicionalesCuotas.push(dato);
          });
          this.LimpiarDatosCuadros();
        }));
  }

  //  CALCULO DEL RESUMEN DE VALORES A DEVOLVER
  CalcularResumen() {

    if (this.listaCuotas.length > 0) {
      if (this.listaCuotas.length >= this.numeroCuotas) {
        // MARCA LOS CHECK
        this.MarcarCuotas();
        // CALCULA LA TABLA RESUMEN
        this.resumenCuotas = new Array<ResumenCuotas>();
        this.Impuestos = new Array<ResumenCuotas>();

        this.Impuestos = this.comun.obtenerRegistroUnicos(this.listaCuotas, "IVANombre");
        const numeroGrupos = this.Impuestos.length;

        for (let i = 0; i < numeroGrupos; i++) {
          let cantidad = 0;
          let sumatoria = 0;
          let IVANombre = "";
          let PVPCobrado = 0;
          const NuevoArreglo = this.cuotasMarcadas.filter(item => item.IVANombre === this.Impuestos[i].IVANombre);

          if (NuevoArreglo != null && NuevoArreglo.length > 0) {
            // tslint:disable-next-line:prefer-for-of
            for (let j = 0; j < NuevoArreglo.length; j++) {
              cantidad++;
              sumatoria = sumatoria + NuevoArreglo[j].PVPCobrado;
              IVANombre = NuevoArreglo[0].IVANombre === "" ? "ND" : NuevoArreglo[0].IVANombre;
              PVPCobrado = NuevoArreglo[0].PVPCobrado;
            }

            this.resumenCuotas.push({
              NumeroCuotas: cantidad,
              Tipo: IVANombre,
              PVP: PVPCobrado,
              Subtotal: Number(sumatoria.toFixed(2))
            });
          }

          this.Resumen = 1;
        }

      } else {
        this.Resumen = 0;
        this.alertify.error("El valor ingresado en el campo número de cuotas debe ser menor o igual al número de cuotas presentadas");
      }
    } else {
      this.Resumen = 0;
      this.alertify.error("No existe información para presentar.");
    }
  }

  //  MARCA LOS CHECK DEL GRID DE CUOTAS Y LLENA EL ARREGLO CON LAS CUOTAS MARCADAS
  MarcarCuotas() {
    this.cuotasMarcadas = new Array<ListaCuotas>();
    for (let i = 0; i < this.listaCuotas.length; i++) {
      this.listaCuotas[i].checked = false;
    }
    for (let i = 0; i < this.numeroCuotas; i++) {
      this.listaCuotas[i].checked = true;
      this.cuotasMarcadas.push(this.listaCuotas[i]);
    }
    this.LimpiarDatosCuadros();
  }


  //  MUESTRA EL CUADRO DE RESUMEN Y ENVIA EL RESULTADO AL METODO EN SIGS INTEGRACION
  MostrarResumen() {
    if (this.numeroCuotas > 0 && this.Resumen !== 0) {
      this.CuadroAdicionales();
      this.SumatoriaTotal();
      if (+this.TotalValorCuotas.toFixed(2) < +this.ResumenCuadro.Total.toFixed(2)) {
        this.alertify.warning("El Total a Devolver no puede ser mayor al Total de valor cobrado");
      } else {
        this.CancelarDevolver.ResumenDevolucion = this.resumenCuotas;
        this.CancelarDevolver.ValorAdicionalDevolucion = this.adicionalesCuotas;
        this.CancelarDevolver.TotalADevolver = this.ResumenCuadro.Total;
        this.CancelarDevolver.CuotaDevolucion = this.cuotasMarcadas;
        this.comun.confirmDialog("Resumen - Devolución", `Confirma que desea registrar los siguientes valores de devolución:
                                                        <br><br>
                                                        <p><strong>Cliente: </strong>${this.ResumenCuadro.Cliente}<br>
                                                        <strong>Certificado: </strong>${this.ResumenCuadro.Certificado}<br>
                                                        <strong>Producto: </strong>${this.ResumenCuadro.Producto}<br>
                                                        <strong>Total Devolución: </strong>${this.comun.decimalPipe(this.ResumenCuadro.Total, '1.2-2')}</p>`)
          .subscribe(valido => {
            if (valido) {
              this.cargando = true;
              this.subscription.add(
                this.crud.post(`${this.URLAdicionales}${config.sigsIntg.cancelacion.producto}`, this.CancelarDevolver).subscribe(response => {
                  if (typeof response !== 'undefined') {
                    if (response.code === config.zohoSuccess) {
                      this.CancelarDevolver = new Cancelacion();
                      this.statusOk();
                      this.alertify.message("El proceso finalizó correctamente.");
                    } else {
                      this.Cancelar();
                      this.alertify.error("No hay respuesta de CRM, intente mas tarde.");
                    }
                  } else {
                    this.Cancelar();
                    this.alertify.error("No hay respuesta de CRM, intente mas tarde.");
                  }
                  this.cargando = false;
                }, error => { this.Cancelar(); console.log(error); }));
            }
          });
      }
    } else {
      this.Resumen = 0;
      this.alertify.error("No existe información suficiente para realizar el cálculo.");
    }
  }

  //  CALCULO DE VALORES ADICIONALES
  CuadroAdicionales() {
    if (this.adicionalesCuotas.length > 0) {
      for (let i = 0; i < this.adicionalesCuotas.length; i++) {
        const valor = document.getElementById("valoradicional_" + i) as HTMLInputElement;
        this.adicionalesCuotas[i].Valor = parseFloat(valor.value ? valor.value : '0.00');
      }
    }
  }

  //  SUMA LOS VALORES DEL CUADRO RESUMEN Y VALORES ADICIONALES
  SumatoriaTotal() {
    let sumatoria = 0;
    for (const item of this.resumenCuotas) {
      sumatoria += item.Subtotal;
    }
    for (const item of this.adicionalesCuotas) {
      sumatoria += item.Valor ? item.Valor : 0;
    }
    this.ResumenCuadro.Total = Number(sumatoria.toFixed(2));
  }

  //  CANCELA EL PROCESO Y REGRESA A LA PANTALLA SIN SELECCION
  Cancelar() {
    this.CancelarDevolver = new Cancelacion();
    this.DatosCertificado = null;
    this.numeroCuotas = 0;
    this.LimpiarData.emit(1);
  }

  //  PRESENTA MENSAJE DE SUCCESS Y LIMPIA EL FORM
  statusOk() {
    this.subscription.add(
      this.comun.confirmDialog("Aviso", `Es necesario actualizar la página de ${config.zoho} <b>CRM</b> para visualizar los cambios.<br> Presione <b>SI</b> para salir de la ventana.`).subscribe(valido => {
        if (valido) {
          window.close();
          this.CancelarDevolver = new Cancelacion();
        } else {
          this.Cancelar();
        }
      }));
  }

  LimpiarDatosCuadros() {
    if (this.adicionalesCuotas != null && this.adicionalesCuotas.length > 0) {
      let i = 0;
      for (const item of this.adicionalesCuotas) {
        const valor = document.getElementById("valoradicional_" + i) as HTMLInputElement;
        if (valor != null) {
          valor.value = "0.00";
          i++;
        }
      }
    }
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.Cancelar();
  }
}

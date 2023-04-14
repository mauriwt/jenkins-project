import { Component, OnInit, OnDestroy, ViewChild, Input, SimpleChanges, OnChanges } from '@angular/core';
import { config } from 'src/app/shared/servicios.config';
import CustomStore from 'devextreme/data/custom_store';
import { DxDataGridComponent } from "devextreme-angular";
import { CRUDService, ComunService, AlertifyService } from 'src/app/shared/services';
import { Documento } from 'src/app/models';


@Component({
  selector: 'listaDoc',
  templateUrl: './listaDoc.component.html',
  styleUrls: ['./listaDoc.component.scss'],
  providers: [ComunService]
})
export class ListaDocComponent implements OnInit, OnDestroy, OnChanges {
  @Input() zohoIdentificacion: string;
  @Input() desdeProveedor: any;
  @Input() certificadoDesdeCancelacion: string;
  @Input() deDonde: string;
  @ViewChild('grid', {static: true}) gridClientes: DxDataGridComponent;
  private url = config.confProducto.dominio;
  private urlDoc = config.sigsDoc.dominio;
  gcargando: boolean;
  documento: Documento;
  docEdit: Documento;
  listaDocCliente: any;
  listaCertCliente: any[];
  popupVisible: boolean = false;
  urlDocumento: string;
  modalHearder: string;
  public noVisible: boolean = false;
  public labelCertificado: string;
  constructor(private crud: CRUDService, private comun: ComunService, private mjs: AlertifyService) {
  }

  ngOnInit() {
    this.docEdit = new Documento();
    this.listaCertCliente = new Array<any>();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.documento = new Documento();
    if (changes.zohoIdentificacion !== undefined) {
      const data = changes.zohoIdentificacion.currentValue;
      if (data !== undefined) {
        this.getClienteCertificado(data);
      }
    }

    if (changes.certificadoDesdeCancelacion !== undefined) {
      const data = changes.certificadoDesdeCancelacion.currentValue;
      if (data !== undefined && this.comun.noVacios(data)) {
        this.documento.ReferenciaExterna = data.identificacion;
        this.documento.ReferenciaNegocio = data.IdVentaPGS;
        this.documento.Nombre = data.nombres;
        this.labelCertificado = data.IdVentaPGS;
        this.getClienteDocumentos(data.IdVentaPGS, this.deDonde);
        this.noVisible = true;
      }
    }

    if (changes.desdeProveedor !== undefined) {
      const data = changes.desdeProveedor.currentValue;

      if (data !== undefined && this.comun.noVacios(data)) {
        this.documento.ReferenciaExterna = data.identificacion;
        this.documento.ReferenciaNegocio = data.IdVentaPGS;
        this.documento.Nombre = data.nombres;
        this.labelCertificado = data.IdVentaPGS;
        this.getClienteDocumentos(data.IdVentaPGS, this.deDonde);
        this.noVisible = true;
      }
    }
  }

  abrirVentana(modalId) {
    this.docEdit = new Documento();
    this.documento.IdImpresion = 0;
    this.comun.openClose(modalId, 'show');
    console.log("Abrir");
  }

  getClienteCertificado(identificacion: string) {
    this.gcargando = true;
    this.crud.obtener(`${this.url}${config.confProducto.producto.certificado}${identificacion}`).subscribe((response: any) => {
      this.noEsVacio(response, identificacion);
      this.gcargando = false;
    }, error => this.gcargando = false);
  }

  getClienteDocumentos(referenciaNegocio: string, CodigoDetalleCatalogo: string) {
    this.gcargando = true;
    this.crud.obtener(`${this.urlDoc}${config.sigsDoc.edocumental.documentos}${referenciaNegocio}${config.sigsDoc.codigo}${CodigoDetalleCatalogo}`).subscribe((response: any) => {
      this.listaDocCliente = response;
      this.gcargando = false;
    }, error => this.gcargando = false);
  }

  getReferenciaNegocio(referenciaNegocio: string) {
    this.documento.ReferenciaNegocio = referenciaNegocio;
  }

  recargarGrid(e) {
    this.docEdit = new Documento();
    this.comun.openClose('mdCargaDocumento', 'hide');
    if (e) {
      this.getClienteDocumentos(e, this.deDonde);
    }

  }

  eliminar(IdImpresion: number) {
    this.gcargando = true;
    this.crud.obtener(`${this.urlDoc}${config.sigsDoc.archivo.eliminar}${IdImpresion}`).subscribe((response: any) => {
      this.getClienteDocumentos(this.documento.ReferenciaNegocio, this.deDonde);
    }, error => this.gcargando = false);
  }

  editar(doctmp, modalId) {
    this.docEdit = new Documento();
    this.docEdit = doctmp;
    this.documento.IdImpresion = doctmp.IdImpresion;
    this.comun.openClose(modalId, 'show');
  }

  verDocumento(url, nombre) {
    this.popupVisible = true;
    this.urlDocumento = url;
    this.modalHearder = nombre;
  }

  noEsVacio(lista, identificacion) {
    if (lista.length > 0) {
      this.listaCertCliente = lista;
      let dato = lista[0];
      this.documento.ReferenciaExterna = dato.IdentificacionCliente;
      this.documento.ReferenciaNegocio = dato.IdentificacionCliente;
      this.labelCertificado = dato.NumeroCertificadoGPS;
      this.documento.Nombre = dato.NombreClienteAsegurado;
      this.getClienteDocumentos(this.documento.ReferenciaExterna, this.deDonde);
    } else {
      this.mjs.warning(`EL cliente con la identificaciónn ${identificacion} no tiene registros disponibles.`);
    }
  }

  getConfiguracionProductos(value) {
    if (value) {

      this.listaDocCliente = new CustomStore({
        key: 'IdVenta',
        load: () => this.crud.peticioDevExtreme(`${this.urlDoc}${config.sigsDoc.edocumental.documentos}${value}`),
      });
    } else {
      this.listaDocCliente = null;
    }
  }

  ngOnDestroy(): void {
    this.certificadoDesdeCancelacion = "";
    this.documento = new Documento();
  }
}

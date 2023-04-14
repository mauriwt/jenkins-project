import { environment } from '../../environments/environment';
export const config = {
  zohoSuccess: 'SUCCESS',
  keyCaptcha: '6LeyGakZAAAAANgYC6EbMQu2ekDgPw7OPqZ43J2l',
  keyCaptchaV3: '6Lc5E6wZAAAAAHtdiQ4Y-wm6uoenCBaY4YEvv9x0',
  TieneCaptcha: environment.captcha,
  zoho: "<b class='text-danger'>Z</b><b class='text-success'>O</b><b class='text-primary'>H</b><b class='text-warning'>O</b>",
  emailDefault: "@masivos.com",
  sigsIntg:
  {
    dominio: environment.sigs_integracion,
    cancelacion: {
      producto: 'Cancelaciones/ActualizarCancelacionResumido?TokenUsuario=111221',
      buscarXDniNombre: 'Cancelaciones/ObtenerClientesPorIdentificacionNombre?Parametro=',
      buscarXDni: 'Cancelaciones/ObtenerDetalleClientePorIdentificacion?Identificacion=',
      direcciones: 'Cancelaciones/ConsultaDireccionClienteXIdCliente?IdCliente=',
      localizacion: 'Cancelaciones/ConsultaLocalizacionClienteXIdClienteTipo?IdCliente=',
      upsertClienteEmpresa: 'Cancelaciones/InsertarActualizarCliente?TokenUsuario=12121',
      cuotas: 'Cancelaciones/ObtenerCancelacionVenta?IdCertificado=',
      crearCancelacion: 'Pruebas/CrearCancelacionZoho',
      gestionDC: 'Cancelaciones/CancelarDevolverEnSIGS',
      verDuplicidad: 'Cancelaciones/verDuplicidad/',
      historialproceso: 'Cancelaciones/ObtenerCancelacionesDevoluciones/',
      historialprocesoBGRLoja: 'Cancelaciones/ObtenerCancelDevolucion_BGR_Loja/',
      historialprocesoFecha: 'Cancelaciones/ObtenerProcesoIntegracionDevolucion?TokenUsuario=',
      historialprocesoCodigoLote: 'Cancelaciones/ObtenerDetalleProcesoIntegracionDevolucion?TokenUsuario=',
      procesoRespuesta: 'Cancelaciones/ProcesarDevolucionSgin/',
      procesoRespuestaBGRLoja: 'Cancelaciones/ProcesarDevolucionSgin_BGR_Loja/',
      procesos: 'cancelaciones/procesos/',
      servicios: 'cancelaciones/servicios',
      serviciosByTipoEntidad: 'cancelaciones/servicios/tipoEntidad',
      procesoIntegracion: 'cancelaciones/proceso/integracion',
      procesoIntegracionByProceso: 'Cancelaciones/ConsultaProcesoIntegracion/',
      servicioIntegracion: 'cancelaciones/servicio/integracion',
      tablaDinamica: 'Cancelaciones/ConsultaProcesoServicioIntegracion',
      encriptarArchivo: 'Cancelaciones/EncriptarArchivo',
    },
    accesoLimitado: {
      tokenTransaccional: 'accesoLimitado/validarToken/'
    },

    procesoServicio: {
      proceso: 'Proceso/',
      servicio: 'Servicio/',
      procesoServicioEntidad: 'ProcesoServicioEntidad/',
      productoServicio: 'ProductoServicio/',
      lista: 'lista',
      porId: 'porId',
      guardar: 'guardar',
      editar: 'editar',
      eliminar: 'eliminar',
      duplicado: 'duplicado/'
    },
    catalogo: {
      tpIdentificaciones: 'Catalogo/ObtenerTipoIdentificacion?',
      generos: 'Catalogo/ObtenerGeneroPersona?',
      estadoCivil: 'Catalogo/ObtenerEstadosCiviles?',
      fventas: 'Catalogo/ObtenerFuerzaVentaPorSegmento?CodigoSegmento=',
      segmentos: 'Catalogo/ObtenerSegmentoPersona?idSegmento=',
      provincias: 'Catalogo/ObtenerProvincias?',
      cantones: 'Catalogo/ObtenerCantones?codigoProvincia=',
      paises: 'Catalogo/ObtenerPaises?',
      telefono: 'Cancelaciones/ObtenerTipoLocalizacionXTipo?',
      correo: 'Cancelaciones/ObtenerTipoLocalizacionXTipo?',
      direccion: 'Catalogo/ObtenerTipoDireccion?',
      edocumental: 'Catalogo/ObtenerEntidadDocumental?codigoEntidadDocumental=',
      valoresAdicionales: 'Catalogo/ObtenerValoresAdicionalesDevolver?',
      parentesco: 'Catalogo/ObtenerContactoClienteEmpresas?',
      catalogo: 'Catalogo/ObtenerCatalogo/',
      sistema: 'Catalogo/ObtenerCatalogoSistema',
      tipoProceso: 'Catalogo/ObtenerTipoProceso',
      tipoEntidad: 'Catalogo/ObtenerTipoEntidad',
      servicios: 'Catalogo/ObtenerCatalogoServicio',
      productos: 'Catalogo/ObtenerCatalogoProducto',
      entidad: 'Catalogo/ObtenerCatalogoEntidadXIdProceso?IdProceso=',
      estadoProcesoIntegracion: 'Catalogo/ObtenerCatalogoEstadoProcesoIntegracion',
      estadoServicioIntegracion: 'Catalogo/ObtenerCatalogoEstadoServicioIntegracion',
      servicioByIdProceso: 'Catalogo/ObtenerCatalogoServicioXIdProceso?IdProceso=',
      campoError: 'Catalogo/ObtenerCatalogoErroresIntegracionEmision?Tipo='
    },
    integracionError: {
      emision: 'IntegracionEmisionError/porError',
      editar: 'IntegracionEmisionError/editar',
      catalogoByCodigo: 'Catalogo/ObtenerCatalogoSdp?codigoTabla=',
      servicio: 'cancelaciones/servicios/proceso/',
      resumenError: 'IntegracionEmisionError/resumen/',
      listaOrigen: 'Catalogo/ObtenerCatalogoOrigen?TokenUsuario=',
      descargarError: 'descargar/integracionEmisionError',
    },
    canalDigital: {
      codigoSistema:'canalDigital/codigo-sistema',
      validarCapcha: 'canalDigital/validar/tokencaptcha',
      editarEstado: 'canalDigital/editar/estados',
      validarAsesor: 'canalDigital/reunion/asesor/',
      totalLlamadas: 'canalDigital/total-llamadas',
      totalLlamadasFiltro: 'canalDigital/total-llamadas/filtro',
      detalleLlamadas: 'canalDigital/detalle-llamadas/',
      detalleLlamadasFitro: 'canalDigital/filtro/detalle-llamadas',
      detalleLlamadasPerdidas: 'canalDigital/detalle-llamadas/perdidas',
      contacto: {
        add: 'canalDigital/atencion/contacto',
        respuesta: 'canalDigital/respuesta/contacto',
        obtenerDatos: 'canalDigital/contacto/obtenerDatos?tokenUsuario=',
        productos: 'portalcliente/productos?identificacion='
      },
      reunion: {
        cambiarEstado: 'canalDigital/cambiar/estado/reunion'
      },
      asesor: {
        lista: 'canalDigital/asesor/lista',
        standbyLibre: 'canalDigital/asesor/estado/enlinea/',
        disponible: 'canalDigital/asesor/disponible/',
        buscar: 'canalDigital/asesor/buscarusuario/',
        insertar: 'canalDigital/asesor/insertar',
        editar: 'canalDigital/asesor/actualizar',
        asesorById: 'canalDigital/asesor/byId/',
        estados: 'canalDigital/estado/asesores',
      },
      sala: {
        lista: 'canalDigital/sala/lista',
        insertar: 'canalDigital/sala/insertar',
        editar: 'canalDigital/sala/actualizar',
      },
      equipo: {
        lista: 'canalDigital/equipo/lista',
        equiposActivos: 'canalDigital/equipo/activos',
        catalogo: 'canalDigital/equipo/catalogo',
        insertar: 'canalDigital/equipo/insertar',
        editar: 'canalDigital/equipo/actualizar',
        arbol: 'canalDigital/equipo/zona/ubicacion'
      },
      catalogos: {
        provincias: 'canalDigital/provincias',
        cantones: 'canalDigital/cantones/',
        ramos: 'canalDigital/gruposramos',
        segmentos: 'canalDigital/segmentos',
      },
      zona: {
        insertar: 'canalDigital/zona-equipo/insertar',
        editar: 'canalDigital/zona-equipo/editar',
      }
    },
token: '&TokenUsuario=111221',
    portalcliente:{
      lista: 'formulario/ObtenerFormulariosParam?tipoFormulario=&tokenUsuario=',
      insertar: 'Formulario/InsertarFormulario',
      editar: 'Formulario/ActualizarFormulario',
      archivo: 'formulario/archivosFormularios',
      ver: "http://10.200.2.35:8098/Formularios/"
    },
    oracle: {
      getByState: 'gps/list/state/',
      changeState: 'gps/update/state',
      notify: 'gps/send/notify'
    }
  },
  tokenCalagolo: 'TokenUsuario=43c44eea-f675-4020-95fe-5cb2ad2a05c4',
  tpTelefono: 'Tipo=Telefono',
  tpEmail: 'Tipo=Correo',
  confProducto:
  {
    dominio: environment.productos_core,
    producto: {
      base: 'ConfiguracionProducto/ObtenerListadoConfiguracionProducto?nombreProveedor=',
      update: 'ConfiguracionProducto/ActualizarConfiguracionProducto?token=',
      aseguradoras: 'ConfiguracionProducto/ObtenerDatosAseguradorasParaCatalogo',
      ramos: 'ConfiguracionProducto/ObtenerDatosRamosParaCatalogo',
      aseguradoRamo: 'ConfiguracionProducto/ObtenerDatosProductosParaCatalogo?codigoProveedor=',
      codigoRamo: '&codigoRamo=',
      cliente: 'ConfiguracionProducto/ObtenerListadoVentasCliente?Identificacion=',
      certificado: 'ConfiguracionProducto/ObtenerReferenciaNegocio?Identificacion=',
      cuotas: 'ConfiguracionProducto/ObtenerCuotasVentasDevoluciones?IdCertificado='
    },
    catalogo: {
      base: 'Catalogo/ObtenerAdministradorDelProducto'
    },
    cliente: {
      base: 'Cliente/ObtenerDatosClientePorIdentificacion?Identificacion=',
    }
  },
  sigsDoc:
  {
    dominio: environment.documentos_core,
    edocumental: {
      base: 'EntidadDocumental/ObtenerTipoEntidadDocumental?codigoDetalleCatalogo=',
      documentos: 'EntidadDocumental/ConsultarListaImagenXReferenciasNegocio?parametroBusqueda=',
    },
    archivo: {
      subir: 'Archivos/UploadFile',
      eliminar: 'EntidadDocumental/EliminarImpresionDocumento?IdImpresion='
    },
    codigo: '&CodigoDetalleCatalogo='
  },
  portalCliente:
  {
    dominio: 'http://localhost:54663/api/',
    producto: {
      cliente: 'PortalCliente/ObtenerProductosCliente?Identificacion=',
      detalle: 'PortalCliente/ObtenerDetallesProductoCliente?identificacion=',
      codigo: '&codigoProducto='
    },
  },

  sigsHomologacion:
  {
    dominio: environment.sigs_integracion,
    lista: {
      homologacion: 'Homologacion/ObtenerHomologacionLista?tokenUsuario=',
      insert: 'Homologacion/InsertarCamposHomologacionyDetalleHomologacion',
      obtenerCabeceraDetalle: 'Homologacion/ObtenerUnHomologacionyDetalle',
      update: 'Homologacion/ActualizarCamposHomologacionyHomologacion',
      delete: 'Homologacion/EliminarHomologacionyDetalleHomologacion',
      tokenUsuario: '?tokenUsuario=',
      idHomologacion: 'IdHomologacion=',
      idHomologacionRecibido: 'IdHomologacionRecibido='
    },
  },
  notifyModule: {
    dominio: environment.notify_module,
    services: {
      sendEmail: 'services/app/Message/ProcessMessage'
    }
  }
};

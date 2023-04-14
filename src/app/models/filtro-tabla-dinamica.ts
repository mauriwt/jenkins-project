export class Emision {
  TipoAsegurado: string; ApellidoPaterno: string; ApellidoMaterno: string; PrimerNombre: string; SegundoNombre: string; TipoIdentificacion: string; NumeroIdentificacion: string;
  Nacionalidad: string; FechaNacimiento: string; Genero: string; EstadoCivil: string; DireccionTitular: string; DireccionBienAsegurado: string; CodigoCanton: string; CodigoProvincia: string; CodigoPais: string;
  TelefonoDomicilio: string; TelefonoCelular: string; Email: string; CodigoAgente: string; FormaPago: string; CodigoPeriodicidad: string; TipoCuenta: string; PrimaNetaCuota: string; PrimaTotalCuota: string;
  CodigoPlan: string; NumeroCuota: string; CodigoActividadEconomica: string; Ingresos: string; Patrimonio: string; InicioVigencia: string; CertificadoCliente: string; FechaDebito: string;
  SumaAsegurada: string; TasaRiesgo: string; PorcentajeComision: string; ValorComision: string; CodigoCertificadoNova: string; CodigoDebitoNova: string; NombreServicio:String;
}
export class DevolucionEnvio {
  Identificacion: string; NumeroCetificadoPoliza: string; Producto: string;
  IdCancelacionVenta: string; IdServicioIntegracion: string; CodigoCertificadoPoliza: string; CodigoAplicativo: string; FechaPedidoDevolucion: string; NumeroRequerimiento: string; ReferenciaProceso: string; FechaDevolucion: string; Valor: string; UsuarioPropietario: string; Activo: string; ObservacionInactivacion: string; NumeroCuotaDevolver12: string; PvpIva12: string; TotalDevolver12: string; NumeroCuotaDevolver14: string; PvpIva14: string; TotalDevolver14: string; TotalDevolverProrrata: string; FechaCierreCobranzas: string; CodigoLote: string;
}

export class EmisionError {
  FechaInicio: Date;
  FechaFin: Date;
  IdServicio = "0";
  TipoOrigen: string;
  DataField: string;
  tokenUsuario: string;
  skip: string;
  take: string;
  RequireTotalCount: boolean;
}


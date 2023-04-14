export class ErrorZoho {
  public static errores = [
  { code: 'DUPLICATE_DATA', msj: 'Dato duplicado. (Identificación/Email)' },
  { code: 'INVALID_DATA', msj: 'Dato no válido.' },
  { code: 'MANDATORY_NOT_FOUND', msj: 'Campo obligatorio no enviado.' },
  { code: 'INTERNAL_ERROR', msj: 'No hay respuesta del servidor.' },
  { code: 'AUTHORIZATION_FAILED', msj: 'No tiene permisos.' },
  { code: 'EMAIL_UPDATE_NOT_ALL_OWED', msj: 'No es posible actualizar el email.' },
  { code: 'ID_ALREADY_DEACTIVATED', msj: 'El usuario esta desactivado.' },
  { code: 'INVALID_REQUEST', msj: 'Solicitud incorrecta.' },
  { code: 'INVALID_TOKEN', msj: 'Token no válido.' },
  ];
}

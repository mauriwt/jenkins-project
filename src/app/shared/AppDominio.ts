import { config } from './servicios.config';
import { environment } from '../../environments/environment';

export class Base {
  public static get integracionRest(): string { return config.sigsIntg.dominio; }
  public static get productosRest(): string { return config.confProducto.dominio; }
  public static get documentosRest(): string { return config.sigsDoc.dominio; }
  public static get formCanalDigital(): string { return environment.formCanalDigital; }
  public static get notifyModule(): string { return environment.notify_module; }
}

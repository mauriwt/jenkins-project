import { Routes } from '@angular/router';
import { ProductosRoutes } from './MdProductos/productos.routes';
import { FormularioRoutes } from './MdFormulario/formulario.routes';
import { ArchivoRoutes } from './+CargaArchivo/archivo.routes';
import { NoPageRoutes } from './no-page/no-page.routes';
import { IndexRoutes } from './index/index.routes';
import { IntegracionSDPRoutes } from './MdIntegracionSDP/integracion-sdp.routes';
import {PortalCliente} from './MdPortalCliente/PortalCliente.routes'
import { CanalDigitalRoutes } from './CanalDigitalAtencion/canal-digital.routes';
import { RucRoutes } from './MdAprobacionRuc/ruc.routes';


export const routes: Routes = [...IndexRoutes, ...ProductosRoutes, ...FormularioRoutes, ...ArchivoRoutes, ...IntegracionSDPRoutes, ...CanalDigitalRoutes,...PortalCliente, ...RucRoutes, ...NoPageRoutes];

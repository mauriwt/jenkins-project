// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  //sigs_integracion:'http://localhost:54663/api/',
   sigs_integracion: 'http://10.201.105.12:8098/api/',
 // productos_core: 'http://10.201.104.71:8091/api/',
  //productos_core: 'http://localhost:58759/api/',
  //documentos_core: 'http://localhost:61316/api/',
  //sigs_integracion: 'http://10.201.104.71:8088/api/',
  //sigs_integracion: 'http://10.200.2.35:8098/api/',
  productos_core: 'http://10.200.2.35:8076/api/',
  documentos_core: 'http://10.200.2.35:8041/api/',
  formCanalDigital: 'http://localhost:2525/#/formulario/canal/digital',
  notify_module: 'https://msgdev.novaseguroslatam.com:453/api/',
  cifrar: true,
  captcha: true,
  publicKey : `-----BEGIN PUBLIC KEY-----
  MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzPmKrQK3/4TIZ6XbTW9/
  o+MyIXJxjCUM3ZyiuO+QOmcYP00TNhVqRgazEZWThm1vO4q7naH7hBtafaTpXOPn
  fCbp2OT/GS3scCJqfC500ApPUhjXh7tNMdMuOa6mdy6dzHUtlNE/v2QndMRStu+Q
  CkDygvkliKmLAQyJcvh5qg2G+eITMwt4mdbZfxEFtieHuOqyhwTeI+bIa8R1JunW
  FHDcwv3b0ia+JJy98ciMP2uIuv2OsTYU1snMk3m+/yTX/ohJl4zAptI3aw0r1AGD
  lDA28e3OLhxl2XUN8fUZ2GQLZuI0CeJtoY3UZoRhxdFOlmzsdiUFTCzDTBBds39y
  yQIDAQAB
  -----END PUBLIC KEY-----`
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'domseguro'
})
export class DomseguroPipe implements PipeTransform {

  constructor(private domsani: DomSanitizer) {

  }
  transform(url, estado?): any {
    if (estado) {
      let video, results;
      if (url === null) {
        return '';
      }
      results = url.match('[\\?&]v=([^&#]*)');
      video = (results === null) ? url : results[1];
      return this.domsani.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + video);
    }else{
      return this.domsani.bypassSecurityTrustResourceUrl(url);
    }

  }

}

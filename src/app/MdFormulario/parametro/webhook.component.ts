import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComunService } from 'src/app/shared/services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-webhook',
  templateUrl: './webhook.component.html',
  styleUrls: ['./webhook.component.scss']
})
export class WebHookComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();
  public zohoIdentificacion: string;
  public cargando: boolean;

  constructor(private aroute: ActivatedRoute, private comun: ComunService, private router: Router) { }


  ngOnInit() {
    this.cargando = true;
    this.recibirParametro();
  }

  recibirParametro() {
    this.subscription.add(
      this.aroute.params.subscribe(param => {
        if (param['zohoIdentificacion']) {
          this.verifyID(param['zohoIdentificacion']);
        }
      }));
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  verifyID(data: string) {
    if (this.comun.checkIdentificacion(data)) {
      this.zohoIdentificacion = data;
    } else {
      this.router.navigate(['noPage']);
    }
    this.cargando = false;
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ComunService } from 'src/app/shared/services';

@Component({
  selector: 'nuevo-cliente',
  templateUrl: './nuevo.component.html',
})
export class NuevoComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();

  private tipo = ['empresa', 'contacto'];

  public enviarTipo: string;

  constructor(private aroute: ActivatedRoute, private comun: ComunService, private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
   }


  ngOnInit() {
    this.recibirParametro();
  }


  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  recibirParametro() {
    this.subscription.add(
      this.aroute.params.subscribe(param => {
        if (param.tipo) {
          this.verifcarTipo(param.tipo);
        }
      }));
  }

  verifcarTipo(data: string) {
    if (this.tipo[0] === data || this.tipo[1] === data) {
      this.enviarTipo = data;
    } else {
      this.router.navigate(['noPage']);
    }
  }

}

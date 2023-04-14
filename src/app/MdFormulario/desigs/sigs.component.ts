import { Component, OnInit, OnDestroy } from '@angular/core';
import { ComunService } from 'src/app/shared/services';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
declare var $;
@Component({
  selector: 'app-sigs',
  templateUrl: './sigs.component.html',
  styleUrls: ['./sigs.component.scss'],
})
export class SigsComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();
  public tokenSigs: string;
  constructor(private aroute: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.recibirParametro();
  }

  recibirParametro() {
    this.subscription.add(
      this.aroute.params.subscribe(param => {
        if (param['token']) {
          this.tokenSigs = param['token'];
        }
      }));
  }

  ngOnDestroy(): void {
    this.tokenSigs = "";
    this.subscription.unsubscribe();
  }
}

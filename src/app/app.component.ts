import { Component, OnInit } from '@angular/core';

import ecMessages from 'devextreme/localization/messages/es.json';

import { loadMessages, locale } from 'devextreme/localization';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  ngOnInit() {
    this.initGlobalize();
  }

  initGlobalize() {
    loadMessages(ecMessages);
    locale('es');
  }
}

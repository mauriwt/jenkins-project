import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CRUDService } from 'src/app/shared/services';
declare var $;

@Component({
  selector: 'app-crud-portal-cliente',
  templateUrl: './crud-portal-cliente.component.html',
  styleUrls: ['./crud-portal-cliente.component.scss']
})
export class CrudPortalClienteComponent implements OnInit {
  constructor(private aroute: ActivatedRoute,private http: CRUDService) { }

  ngOnInit(): void {
  
  }

}

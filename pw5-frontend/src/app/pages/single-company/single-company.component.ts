import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-single-company',
  imports: [],
  templateUrl: './single-company.component.html',
  styleUrl: './single-company.component.css'
})
export class SingleCompanyComponent implements OnInit {
  companyId: number | undefined;
  company: any| null = null;
  constructor(private route: ActivatedRoute, private router: Router) { }
 
  ngOnInit(): void {
    // Recupera l'id del relatore dall'URL
    this.companyId = Number(this.route.snapshot.paramMap.get('id'));
    this.company = this.company.find((sp: { id: number | undefined; }) => sp.id === this.companyId);
  }
}

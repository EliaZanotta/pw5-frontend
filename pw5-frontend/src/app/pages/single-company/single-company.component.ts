import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-single-company',
  templateUrl: './single-company.component.html',
  styleUrls: ['./single-company.component.css']
})
export class SingleCompanyComponent implements OnInit {
  companyId: number | undefined;
  company: any | null = null;

  partnerCompanies = [
    { 
      id: 1, 
      name: 'Azienda 1', 
      logoUrl: 'https://www.supero.com.mt/wp-content/uploads/2015/05/azienda-1024x682.jpg', 
      description: 'Descrizione della prima azienda.', 
      coverImage: 'https://source.unsplash.com/1000x400/?office',
      address: 'Via Roma, 10, Milano',
      website: 'https://www.azienda1.com',
      email: 'info@azienda1.com'
    },
    { 
      id: 2, 
      name: 'Azienda 2', 
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Deloitte_Building%2C_Christchurch%2C_New_Zealand.jpg/300px-Deloitte_Building%2C_Christchurch%2C_New_Zealand.jpg', 
      description: 'Descrizione della seconda azienda.',
      coverImage: 'https://source.unsplash.com/1000x400/?building',
      address: 'Corso Italia, 5, Torino',
      website: 'https://www.azienda2.com',
      email: 'contact@azienda2.com'
    }
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.companyId = Number(this.route.snapshot.paramMap.get('id'));

    if (!isNaN(this.companyId)) {
      this.company = this.partnerCompanies.find(c => c.id === this.companyId) || null;
    }

    if (!this.company) {
      console.error('Azienda non trovata! Reindirizzamento...');
      this.router.navigate(['/partner-companies']);
    }
  }
  goBack(): void {
    this.router.navigate(['/partner-companies']);
  }
}

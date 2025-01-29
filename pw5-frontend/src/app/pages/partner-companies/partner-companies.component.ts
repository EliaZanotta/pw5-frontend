import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-partner-companies',
  imports: [],
  templateUrl: './partner-companies.component.html',
  styleUrl: './partner-companies.component.css'
})
export class PartnerCompaniesComponent {
  partnerCompanies = [
    { id: 1, name: 'Azienda 1', logoUrl: 'https://www.supero.com.mt/wp-content/uploads/2015/05/azienda-1024x682.jpg', description: 'Descrizione della prima azienda' },
    { id: 2, name: 'Azienda 2', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Deloitte_Building%2C_Christchurch%2C_New_Zealand.jpg/300px-Deloitte_Building%2C_Christchurch%2C_New_Zealand.jpg', description: 'Descrizione della seconda azienda' },
    { id: 3, name: 'Azienda 3', logoUrl: 'https://fatturapro.click/wp-content/uploads/2021/12/Donazione-di-azienda-.jpg', description: 'Descrizione della seconda azienda' },
    { id: 4, name: 'Azienda 4', logoUrl: 'https://www.spotsocial.it/images/blog/full/racc-azienda.jpg', description: 'Descrizione della seconda azienda' },
    { id: 5, name: 'Azienda 5', logoUrl: 'https://www.vetromarca.com/images/galcms/850x635c50q80/galleryone/azienda/zoom/_mg_4390_71816.jpg', description: 'Descrizione della seconda azienda' },
    { id: 6, name: 'Azienda 6', logoUrl: 'https://glastebo.com/wp-content/uploads/2020/04/Ritoccomuro.jpg', description: 'Descrizione della seconda azienda' }
  ];

  constructor(private router: Router) {}

  goToCompany(id: number): void {
    this.router.navigate(['/partner-companies', id]);
    console.log('Navigating to partner with id:', id);
  }
  
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-single-company',
  templateUrl: './single-company.component.html',
  styleUrls: ['./single-company.component.css']
})
export class SingleCompanyComponent implements OnInit {
  companyId: number | undefined;
  company: any = {}; // Dati dell'azienda visualizzata
  selectedTab: string = 'about';
  userRole: string = '';
  userCompanyId: number | null = null; // ID dell'azienda dell'utente loggato

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // Recupera l'id dell'azienda dall'URL
    this.companyId = Number(this.route.snapshot.paramMap.get('id'));

    // Simula il login dell'azienda
    localStorage.setItem('userRole', 'company');
    localStorage.setItem('userCompanyId', '1'); 

    // Recuperiamo ruolo e ID azienda dal localStorage
    this.userRole = localStorage.getItem('userRole') || '';
    this.userCompanyId = localStorage.getItem('userCompanyId') 
      ? Number(localStorage.getItem('userCompanyId')) 
      : null;

    // Simula il recupero dell'azienda visualizzata
    this.company = {
      id: 2,
      name: 'Azienda Test',
      description: 'Descrizione dell’azienda test',
      address: 'Via Test, 123, Milano',
      website: 'https://www.testcompany.com',
      email: 'info@testcompany.com',
      about: 'Siamo un’azienda di test...',
      social: {
        facebook: 'https://www.facebook.com/testcompany',
        instagram: 'https://www.instagram.com/testcompany',
        linkedin: 'https://www.linkedin.com/company/testcompany'
      },
      events: [{ name: 'Evento Test', date: '20 Febbraio 2024' }]
    };

    // Debug in console
    console.log('Ruolo attuale:', this.userRole);
    console.log('ID Azienda loggata:', this.userCompanyId);
    console.log('ID Azienda visualizzata:', this.company.id);
  }

  setTab(tab: string): void {
    this.selectedTab = tab;
  }

  goBack(): void {
    this.router.navigate(['/partner-companies']);
  }

  goEvents(): void {
    this.router.navigate(['/events']);
  }

  isCompany(): boolean {
    return this.userRole === 'company' && this.userCompanyId === this.company.id;
  }

  logout(): void {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userCompanyId');
    this.router.navigate(['/events']); 
    console.log(localStorage.getItem('userRole'));
    console.log(localStorage.getItem('userCompanyId'));
  }
}

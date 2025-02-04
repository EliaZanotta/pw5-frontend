import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-single-company',
  templateUrl: './single-company.component.html',
  styleUrls: ['./single-company.component.css']
})
export class SingleCompanyComponent implements OnInit {
  company: any = {}; // Dati dell'azienda visualizzata
  selectedTab: string = 'about';
  userRole: string = '';
  userCompanyId: number | null = null; // ID dell'azienda dell'utente loggato

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Simula l'ID dell'azienda che l'utente ha dopo il login
    localStorage.setItem('userRole', 'company'); // Simula che l'utente sia un'azienda
    localStorage.setItem('userCompanyId', '1'); // Simula che l'azienda loggata abbia ID 1

    // Recuperiamo il ruolo e l'ID dell'azienda dell'utente autenticato
    this.userRole = localStorage.getItem('userRole') || '';
    this.userCompanyId = localStorage.getItem('userCompanyId') ? Number(localStorage.getItem('userCompanyId')) : null;

    // Simula il recupero dell'azienda visualizzata
    this.company = {
      id: 1, // 🔹 METTI QUESTO UGUALE A userCompanyId PER VEDERE "Crea Evento"
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
      events: [
        { name: 'Evento Test', date: '20 Febbraio 2024' }
      ]
    };

    // Debug: Verifica ID e ruolo in console
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
    // Rimuove i dati dell'utente dal localStorage
    localStorage.removeItem('userRole');
    localStorage.removeItem('userCompanyId');
  
    // Reindirizza alla pagina di login o homepage
    this.router.navigate(['/events']); // Cambia con la tua pagina di destinazione
    console.log(localStorage.getItem('userRole'));
    console.log(localStorage.getItem('userCompanyId'));

  }

  
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-single-company',
  templateUrl: './single-company.component.html',
  styleUrls: ['./single-company.component.css']
})
export class SingleCompanyComponent {
  company = {
    id: 1,
    name: 'Azienda Esempio',
    logoUrl: 'https://source.unsplash.com/150x150/?company,logo',
    coverImage: 'https://source.unsplash.com/1920x500/?office',
    description: 'Una breve descrizione della nostra azienda e dei nostri valori.',
    address: 'Via Roma, 10, Milano',
    website: 'https://www.aziendaesempio.com',
    email: 'info@aziendaesempio.com',
    about: 'Siamo un’azienda leader nel settore della tecnologia e innovazione...',
    social: {
      facebook: 'https://www.facebook.com/aziendaesempio',
      instagram: 'https://www.instagram.com/aziendaesempio',
      linkedin: 'https://www.linkedin.com/company/aziendaesempio'
    },
    events: [
      { name: 'Conferenza Tech 2024', date: '15 Marzo 2024' },
      { name: 'Networking Day', date: '10 Maggio 2024' }
    ]
  };

  selectedTab: string = 'about';

  constructor(private router: Router) {}

  setTab(tab: string): void {
    this.selectedTab = tab;
  }

  goBack(): void {
    this.router.navigate(['/partner-companies']);
  }
}


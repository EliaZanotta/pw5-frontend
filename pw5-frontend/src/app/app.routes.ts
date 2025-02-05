import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { EventsComponent } from './pages/events/events.component';
import { SingleEventComponent } from './pages/single-event/single-event.component';
import { SpeakerComponent } from './pages/speaker/speaker.component';
import { PartnerCompaniesComponent } from './pages/partner-companies/partner-companies.component';
import { UserAreaComponent } from './pages/user-area/user-area.component';
import { SingleCompanyComponent } from './pages/single-company/single-company.component';
import { ContactComponent } from './pages/contact/contact.component';
import { RegisterComponent } from './auth/register/register.component';
import { PastEventsComponent } from './pages/past-events/past-events.component';
import { FutureEventsComponent } from './pages/future-events/future-events.component';
import { ConfirmEmailComponent } from './auth/confirm-email/confirm-email.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { LoginComponent } from './auth/login/login.component';
import { Step1Component } from './auth/register/step-1/step-1.component';
import { Step2Component } from './auth/register/step-2/step-2.component';
import { Step3Component } from './auth/register/step-3/step-3.component';
import { Step4Component } from './auth/register/step-4/step-4.component';
import { Step5Component } from './auth/register/step-5/step-5.component';
import { AllSpeakerComponent } from './all-speaker/all-speaker.component';
import { EventRegistrationFormComponent } from './pages/event-registration-form/event-registration-form.component';

export const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'events', component: EventsComponent },
  { path: 'events/:id', component: SingleEventComponent },
  { path: 'speaker/:id', component: SpeakerComponent },
  { path: 'partner-companies', component: PartnerCompaniesComponent },
  { path: 'partner-companies/:id', component: SingleCompanyComponent },
  { path: 'user-area', component: UserAreaComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'auth/register/step-1', component: Step1Component },
  { path: 'auth/register/step-2', component: Step2Component },
  { path: 'auth/register/step-3', component: Step3Component },
  { path: 'auth/register/step-4', component: Step4Component },
  { path: 'auth/register/step-5', component: Step5Component },
  { path: 'auth/confirm-email/:token', component: ConfirmEmailComponent },
  { path: 'past-events', component: PastEventsComponent },
  { path: 'future-events', component: FutureEventsComponent },
  {
    path: 'event-registration-form',
    component: EventRegistrationFormComponent,
  },
  { path: 'all-speaker', component: AllSpeakerComponent },
  { path: '**', component: NotFoundComponent },
];

import {Routes} from '@angular/router';
import {HomepageComponent} from './homepage/homepage.component';
import {EventsComponent} from './pages/events/events.component';
import {SingleEventComponent} from './pages/single-event/single-event.component';
import {SpeakerComponent} from './pages/speaker/speaker.component';
import {BookingComponent} from './pages/booking/booking.component';
import {PartnerCompaniesComponent} from './pages/partner-companies/partner-companies.component';
import {UserAreaComponent} from './pages/user-area/user-area.component';
import {SingleCompanyComponent} from './pages/single-company/single-company.component';
import {ContactComponent} from './pages/contact/contact.component';
import {RegisterComponent} from './auth/register/register.component';
import {PastEventsComponent} from './pages/past-events/past-events.component';
import {FutureEventsComponent} from './pages/future-events/future-events.component';
import {ConfirmEmailComponent} from './pages/confirm-email/confirm-email.component';
import {NotFoundComponent} from './pages/not-found/not-found.component';
import {LoginComponent} from './auth/login/login.component';

export const routes: Routes = [
  {path: '', component: HomepageComponent},
  {path: 'events', component: EventsComponent},
  {path: 'events/:id', component: SingleEventComponent},
  {path: 'speaker/:id', component: SpeakerComponent},
  {path: 'booking', component: BookingComponent},
  {path: 'partner-companies', component: PartnerCompaniesComponent},
  {path: 'partner-companies/:id', component: SingleCompanyComponent},
  {path: 'user-area', component: UserAreaComponent},
  {path: 'contact', component: ContactComponent},
  {path: 'auth/login', component: LoginComponent},
  {path: 'auth/register', component: RegisterComponent},
  {path: 'confirm-email', component: ConfirmEmailComponent},
  {path: 'past-events', component: PastEventsComponent},
  {path: 'future-events', component: FutureEventsComponent},
  {path: '**', component: NotFoundComponent}
];

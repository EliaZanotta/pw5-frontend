import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, NgForOf, NgIf, SlicePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatNativeDateModule, MatOptionModule} from '@angular/material/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {MatSelect} from '@angular/material/select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatTooltip} from "@angular/material/tooltip";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatOptionModule,
    FontAwesomeModule,
    SlicePipe,
    MatSelect,
    FormsModule,
    MatDatepickerToggle,
    MatDatepicker,
    MatDatepickerInput,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatTooltip
  ],
  exports: [
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatOptionModule,
    NgForOf,
    DatePipe,
    NgIf,
    FontAwesomeModule,
    SlicePipe,
    MatSelect,
    FormsModule,
    MatDatepickerToggle,
    MatDatepicker,
    MatDatepickerInput,
    MatNativeDateModule,
    CommonModule,
    ReactiveFormsModule,
    MatTooltip
  ]
})
export class FiltersModule { }

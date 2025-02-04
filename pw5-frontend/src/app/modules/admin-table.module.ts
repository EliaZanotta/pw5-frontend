import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {MatPaginator} from '@angular/material/paginator';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef, MatTable
} from '@angular/material/table';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {ReactiveFormsModule} from "@angular/forms";
import {MatInput} from "@angular/material/input";



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatPaginator,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatHeaderCell,
    MatColumnDef,
    MatCell,
    MatCellDef,
    MatHeaderCellDef,
    DatePipe,
    MatTable,
    MatButton,
    MatLabel,
    MatFormField,
    ReactiveFormsModule,
    MatInput
  ],
  exports: [
    CommonModule,
    MatPaginator,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatHeaderCell,
    MatColumnDef,
    MatCell,
    MatCellDef,
    MatHeaderCellDef,
    DatePipe,
    MatTable,
    MatButton,
    MatLabel,
    MatFormField,
    ReactiveFormsModule,
    MatInput
  ]
})
export class AdminTableModule { }

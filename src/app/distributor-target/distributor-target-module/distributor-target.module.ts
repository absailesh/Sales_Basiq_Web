import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule, MatDialogModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AppUtilityModule } from 'src/app/app-utility.module';
import { MaterialModule } from 'src/app/material';
import { AuthComponentGuard } from 'src/app/auth-component.guard';
import { DistributorTargetComponent } from '../distributor-target.component';


const targetRoutes = [
  { path: "", component: DistributorTargetComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
]

@NgModule({
  declarations: [
    DistributorTargetComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(targetRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    MaterialModule,
    AutocompleteLibModule,
    MatIconModule,
    MatDialogModule,
    NgxMatSelectSearchModule,
    AppUtilityModule
  ]
})
export class DistributorTargetModule {constructor(){
  console.log('this is distributor target module')
}}


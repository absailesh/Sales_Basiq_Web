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
import { AttendenceComponent } from '../attendence.component';
import { AttendancemodalComponent } from 'src/app/attendancemodal/attendancemodal.component';
import { AttendanceDetailComponent } from 'src/app/attendance-detail/attendance-detail.component';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';


const attendenceRoutes = [
  { path: "", component: AttendenceComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
]
@NgModule({
  declarations: [AttendenceComponent, AttendancemodalComponent, AttendanceDetailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(attendenceRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    MaterialModule,
    AutocompleteLibModule,
    MatIconModule,
    MatDialogModule,
    NgxMatSelectSearchModule,
    AppUtilityModule,
    AgmDirectionModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyA7CQa3gq7kA3RUbGRJVHBoMz8IrBw5AUs'
    }),
  ],
  
  entryComponents:[
    AttendancemodalComponent,
    AttendanceDetailComponent,
  ]
})
export class AttendenceModule {constructor(){
  console.log('this is attendence module')
} }

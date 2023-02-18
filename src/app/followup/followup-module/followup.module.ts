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
import { FollowupDetailComponent } from '../followup-detail/followup-detail.component';
import { FollowupListComponent } from '../followup-list/followup-list.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FollowupEditComponent } from '../followup-edit/followup-edit.component';
import { DistributionDetailComponent } from 'src/app/distribution/distribution-detail/distribution-detail.component';
import { AgmCoreModule } from '@agm/core';
const followupRoutes = [
  { path: "", children:[
    { path: "", component: FollowupListComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
    { path: "followup-detail/:id", component: FollowupDetailComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1','2']}},
    {path:"distribution-detail/:id", component: DistributionDetailComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1','2']}},

  ]},
]
@NgModule({
  declarations: [
    FollowupListComponent,
    FollowupDetailComponent,
    FollowupEditComponent,
    
  ],
  imports: [
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBZ4zXanVSs4A1kSVIDCIzDqtMbk6Tv3bg'
      /* apiKey is required, unless you are a
      premium customer, in which case you can
      use clientId
      */
  }),
    CommonModule,
    RouterModule.forChild(followupRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    MaterialModule,
    AutocompleteLibModule,
    MatIconModule,
    MatDialogModule,
    NgxMatSelectSearchModule,
    AppUtilityModule,
    InfiniteScrollModule,
  ],
  entryComponents:[FollowupEditComponent]
})
export class FollowupModule {constructor(){
  console.log('followup module')
} }

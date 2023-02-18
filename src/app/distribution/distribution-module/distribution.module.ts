import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule, MatDialogModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AppUtilityModule } from 'src/app/app-utility.module';
import { AuthComponentGuard } from 'src/app/auth-component.guard';
import { MaterialModule } from 'src/app/material';
import { AddDistributionComponent } from '../add-distribution/add-distribution.component';
import { DistributionDetailComponent } from '../distribution-detail/distribution-detail.component';
import { DistributionListComponent } from '../distribution-list/distribution-list.component';
import { DistributionOrderListComponent } from '../distribution-order-list/distribution-order-list.component';
import { DistributionEditComponent } from '../distribution-edit/distribution-edit.component';
import { AgmCoreModule } from '@agm/core';
import { DistributorModelComponent } from '../distributor-model/distributor-model.component';
import { InvoiceListModalComponent } from 'src/app/invoice-list-modal/invoice-list-modal.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { DealerComponent } from '../dealer/dealer.component';
import { OrderDetailComponent } from 'src/app/order/order-detail/order-detail.component';

const distributionRoutes = [
  { path: "", children:[
    { path: "", component: DistributionListComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
    { path: "distribution-detail/:id", children:[
      {path:"", component: DistributionDetailComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1','2']}},
      {path:'order-detail/:id', component:OrderDetailComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1','2']}},
      { path: "edit-distribution/:type/:id/:pageType", component: AddDistributionComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},

    ]},
    { path: "distribution-order-list", component: DistributionOrderListComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
  { path: "add-distribution/:type/:id/:pageType", component: AddDistributionComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
  { path: "dealer", component: DealerComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
  

]},
]

@NgModule({
  declarations: [
    AddDistributionComponent,
    DistributionListComponent,
    DistributionOrderListComponent,
    DealerComponent,
    DistributionEditComponent,
    DistributorModelComponent,
    InvoiceListModalComponent,
    // DistributionLegderModelComponent,
  ],
  imports: [
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBZ4zXanVSs4A1kSVIDCIzDqtMbk6Tv3bg'

  }),
    CommonModule,
    RouterModule.forChild(distributionRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    MaterialModule,
    AutocompleteLibModule,
    MatIconModule,
    MatDialogModule,
    NgxMatSelectSearchModule,
    InfiniteScrollModule,
    AppUtilityModule
  ],
  entryComponents:[
    DistributionEditComponent,
    DistributorModelComponent,
    InvoiceListModalComponent
  ],
})
export class DistributionModule {constructor(){
  console.log('this is distribution module')
} }

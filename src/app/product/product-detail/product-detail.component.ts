import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DialogService } from 'src/app/dialog.service';
import { ExportexcelService } from 'src/app/service/exportexcel.service';
import { Location } from '@angular/common';
import { sessionStorage } from 'src/app/localstorage.service';


@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  animations: [slideToTop()]
  
})
export class ProductDetailComponent implements OnInit {
  
  
  product_id;
  getData:any ={};
  skLoading:boolean = false;
  url:any;
  assign_login_data:any={};
  logined_user_data:any={};
  stateDetail:any =[];
  product_size:any =[];
  featureFlag :boolean = false;
  allMrpFlag :boolean = false;

  
  constructor( public location: Location, public session: sessionStorage, private router: Router, public alert: DialogComponent, public service: DatabaseService, public editdialog: DialogService, public dialog: MatDialog, public route: ActivatedRoute, public toast: ToastrManager, public excelservice: ExportexcelService, public dialog1: DialogComponent) {
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value.data;
    
    
    this.route.params.subscribe(params => {
      this.product_id = params.id;
      this.service.currentUserID = params.id
      this.url = this.service.uploadUrl + 'product_image/';
      
      
      
      if(this.product_id){
        this.getProductDetail();
        this.getStateFeature();
      }
    });
    
    
  }
  ngOnInit() {
    
  }
  
  
  back(): void {
    this.location.back()
  }
  
  // Product detail fetch function start
  
  getProductDetail()
  {
    this.skLoading = true;
    this.service.post_rqst({'product_id':this.product_id},"Master/productDetail").subscribe((result=>
      {
        this.getData = result['product_detail'];
        this.skLoading = false;
        this.getFeature();
      }
      ));
      
    }
    
    productSize:any =[];
    getFeature()
    {
      this.service.post_rqst({'product_id':this.product_id},"Master/productSizeListForProductDetail").subscribe((result=>
        {
          this.productSize = result['product_size_array']
        }
        ));
        
      }
      // Product detail fetch function end
      
      
      
      // Product go to add page 
      editProduct(){
        this.router.navigate(['add-product/' +this.product_id]);
      }
      // Product go to add page
      
      
      // State wise fetaure

      clearValidation(){
        this.featureFlag = false;
        this.allMrpFlag = false;


      }
      getStateFeature()
      {
        setTimeout(() => {
          this.service.post_rqst({'id':this.product_id, 'created_by_id':this.logined_user_data.id, 'created_by_name':this.logined_user_data.name},"Master/stateWiseProductList").subscribe((result=>
            {
              this.stateDetail =result['state_name']
            }
            ));
        }, 3000);
       
          
        }
        // State wise Feature
        
        // update product mrp start
        state_data: any = {};
        
        updateMrp(action, i, j) {
          let stateWise = []
          
          if (action == 'all') {
            for (let index = 0; index < this.stateDetail.length; index++) {
              stateWise.push({ 'state_name': this.stateDetail[index].state_name, 'product_size': this.state_data['product_size'], 'product_id': this.product_id, "product_mrp": this.state_data.product_mrp})
            }
          }
          
          else if (action == 'multiple') {
            stateWise.push({ 'state_name': this.stateDetail[i].state_name, 'product_size': this.stateDetail[i].product_feature[j].product_size, 'product_id': this.stateDetail[i].product_feature[j].product_id, "product_mrp": this.stateDetail[i].product_feature[j].product_mrp, 'id': this.stateDetail[i].product_feature[j].id })
          }
          else{
            stateWise.push({ 'state_name': this.stateDetail[i].state_name,  "product_mrp": this.stateDetail[i].product_mrp, 'product_name':this.getData.product_name, 'product_id':this.product_id})
          }
          let mrp_type = action
          if(this.getData.feature_apply == 'Yes' && action == 'all'){
            if(!this.state_data.product_size){
              this.toast.errorToastr('Please select Feature!');
              this.featureFlag = true;
              return
            }
            if(!this.state_data.product_mrp){
              this.toast.errorToastr('Please Enter Mrp!');
              this.allMrpFlag = true;
              return;
            }
          }
          if((this.getData.feature_apply == 'No' && !this.state_data.product_mrp) && action == 'all'){
            this.toast.errorToastr('Please Enter Mrp!');
              this.allMrpFlag = true;
              return;
          }
        
          this.service.post_rqst({ 'stateWise': stateWise, 'mrp_type': mrp_type , 'feature_apply':this.getData.feature_apply, 'created_by_id':this.logined_user_data.id, 'created_by_name':this.logined_user_data.name}, "Master/stateWiseProductPriceUpdate").subscribe((result) => {
            if(result['statusCode'] == 200){
              this.toast.successToastr('MRP Update Successfully!');
              this.state_data = {};
              this.getStateFeature();
            }
            else{
              this.toast.errorToastr(result['statusMsg'])
            }
          })
          
        }
        
        // update product mrp end
        
        
      }
      
      
      
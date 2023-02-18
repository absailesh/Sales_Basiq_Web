import { Component,Inject, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import { MatDialog ,MAT_DIALOG_DATA} from '@angular/material';
import { MatDialogRef } from '@angular/material';
import { sessionStorage } from 'src/app/localstorage.service';
import * as moment from 'moment';
import { Location } from '@angular/common';
import { ToastrManager } from 'ng6-toastr-notifications';
import { OrderDetailComponent } from '../order/order-detail/order-detail.component';




@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss']
})
export class AddItemComponent implements OnInit {
  userData: any = {};
  orderData: any = {};
  tabActiveType: any = {};
  state_list: any = [];
  states: any = [];
  rsm_list: any;
  report_manager: any = [];
  data: any = {};
  district_list: any = [];
  city_list: any = [];
  area_list: any = [];
  pinCode_list: any = [];
  isslected;
  user_type;
  usertype = true;
  basicdetails = false;
  userrole;
  active: any = {};
  sales_type: any = [];
  reporting_sales_type: any = [];
  rsm: any = [];
  ass_user: any = [];
  tmp_userList: any = [];
  search: any = {};
  tmpsearch: any = {};
  submit = false;
  loader: any;
  module_name: any = [];
  access: any = {};
  exist: boolean = false;
  assign_module_data: any = [];
  segmentList: any = [];
  productlist: any = [];
  product_price_list: any = [];
  userId: any;
  userName: any;
  savingFlag: boolean = false;
  product_resp: boolean = false;
  assign_login_data: any = {};
  logined_user_data: any = {};
  Param_data: any = {};
  type: any = ''
  company_name: any = ''
  name: any = ''
  contact_person: any = ''
  order_id: any = ''
  dr_id: any = ''


  constructor(@Inject(MAT_DIALOG_DATA) public params: any, public dialogRef: MatDialogRef<OrderDetailComponent>,public serve: DatabaseService,
    private route: ActivatedRoute,
    public toast: ToastrManager, public location: Location, public session: sessionStorage, public rout: Router, public dialog: DialogComponent,public model:MatDialog) {

      this.orderData.state = params.state
      this.dr_id = params.dr_id
      this.orderData.order_id = params.order_id
      this.orderData.type = params.type
      this.orderData.company_name = params.company_name
      this.orderData.name = params.name
      this.orderData.contact_person = params.contact_person
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value.data;

  }

  tabActive(tab: any) {
    this.tabActiveType = {};
    this.tabActiveType[tab] = true;
  }



  ngOnInit() {
    this.getSegment()
  }



  getSegment() {
    this.serve.post_rqst({}, "Order/getProductCategoryList").subscribe((result => {
      if(result['statusCode']==200){
      this.segmentList = result['result'];
    }else{
      this.toast.errorToastr(result['statusMsg'])
    }
    }))

  }


  getProductList(segment_id) {

    let index = this.segmentList.findIndex( row => row.id == segment_id)
    if(index != -1){
      this.orderData.segment_name = this.segmentList[index].category
    }
    this.serve.post_rqst({'cat_id': segment_id}, "Order/segmentItems").subscribe((result) => {
      if(result['statusCode']==200){
      this.productlist = result['result'];
      }else{
        this.toast.errorToastr(result['statusMsg'])
      }
    })
  }


  get_product_Size(product_id) {
    let index = this.productlist.findIndex(row => row.id == product_id)
    if (index != -1) {
      this.orderData.product_name = this.productlist[index].product_name
      this.orderData.gst_percent = this.productlist[index].gst
      this.orderData.feature_apply = this.productlist[index].feature_apply;
      this.orderData.product_code = this.productlist[index].product_code;

      console.log(this.orderData.gst_percent)
    }
    console.log(this.data.product_name);
    this.serve.post_rqst({ 'feature_apply': this.orderData.feature_apply, 'state_name': this.orderData.state, 'dr_id': this.dr_id, 'product_id': product_id }, "Order/segmentItemsSizes")
      .subscribe(resp => {
        console.log(resp);
        if (resp['statusCode'] == 200) {

          this.product_resp = true
         
          if(this.orderData.feature_apply == 'Yes'){

            this.product_price_list = resp['result'];
          }else{
            console.log('====================================');
            console.log('In else case');
            console.log('====================================');
            this.product_price_list = resp['result'][0];
            this.orderData.product_price = this.product_price_list.product_price
            this.orderData.discounted_price =( this.product_price_list.discounted_price ? this.product_price_list.discounted_price : 0)
            this.orderData.dr_disc = this.product_price_list.dr_disc
            this.orderData.net_price = this.product_price_list.net_price
          }

          console.log(this.orderData)
          if (this.product_price_list.length > 0) {
            for (let i = 0; i < this.product_price_list.length; i++) {
              this.product_price_list[i].edit_true = false;
            }
            console.log(this.product_price_list);
          }
        } else  {
          this.product_resp = false
          this.toast.errorToastr(resp['statusMsg'])
        }
      },
        err => {
        })
  }
  Feature_Product_Price(product_size) {
    let index = this.product_price_list.findIndex(row => row.product_size == product_size)
    if (index != -1) {
      this.orderData.product_price = this.product_price_list[index].product_price
      this.orderData.discounted_price = this.product_price_list[index].discounted_price
      this.orderData.dr_disc = this.product_price_list[index].dr_disc
      this.orderData.net_price = this.product_price_list[index].net_price
    }
  }

  Calc(){
    this.orderData.amount = this.orderData.qty*this.orderData.net_price
    // this.orderData.total_item_discount = this.orderData.qty*this.orderData.discounted_price
    this.orderData.gst_amount = (((this.orderData.amount) * (this.orderData.gst_percent)) / 100).toFixed();
    this.orderData.total_amount = parseFloat(this.orderData.gst_amount) + parseFloat(this.orderData.amount);
  }
  save_order() {
    let cartData = []
    cartData.push(this.orderData)
   
    this.savingFlag = true;
    this.serve.post_rqst({ "cart_data": cartData, "orderId": this.orderData.order_id }, "Order/primaryOrderAddItem").subscribe(resp => {
      console.log(resp);
      if (resp['statusCode'] == 200) {
          let id = this.order_id
          this.toast.successToastr(resp['statusMsg']);
          this.dialogRef.close();
          this.savingFlag = false;
      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
        this.savingFlag = false;
      }
    })



  }



  designation_type: any = []
  department_type: any = []













  back(): void {
    this.location.back()
  }
}

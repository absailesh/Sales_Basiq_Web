import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from '../dialog.component';
// import { Router } from '@angular/router';
// import { DialogComponent } from '../dialog.component';
import * as moment from 'moment';
import {  sessionStorage} from 'src/app/localstorage.service';



@Component({
  selector: 'app-editlead',
  templateUrl: './editlead.component.html'
})
export class EditleadComponent implements OnInit {
  id:any
  state_list: any = [];
  district_list: any = [];
  city_list: any = [];
  pinCode_list: any = [];
  countryList: any = [];
  lead_data: any = {};
  lead_data2: any = {};
  cityAreaList: any = [];
  lead_type_id:any;
  today_date: any;
  length: any = {};
  userData: any;
  userId: any;
  userName: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data, public serve: DatabaseService,  public session: sessionStorage,public dialog2: MatDialog, public dialog: DialogComponent) {
    this.today_date = new Date();
    console.log(data);
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId=this.userData['data']['id'];
    this.userName=this.userData['data']['name'];
    console.log(data['type']);
    if (data['type'] == 'basic_information') {
      this.lead_data = JSON.parse(JSON.stringify(data['value']));
      console.log(this.lead_data);
      this.lead_type_id = this.lead_data.type
      console.log(this.lead_type_id);

    }
    else {
      this.getStateList();
      this.getDistrict(data.value.state, 1);
      this.getCityAreaList(data.value.district, data.value.state, 1);
      this.getarea(data.value.district,data.value.state,data.value.city,);

      this.getPinCodeList(data.value.state, data.value.district, data.value.city, 1);
      this.lead_data2 = JSON.parse(JSON.stringify(data['value']));
      console.log(this.lead_data2);
      this.lead_data2.cityArea = this.data.value.area;
      console.log(this.lead_data2);


    }



  }



  ngOnInit() {
    this.getsource_list();

  }

  no_vaild: any = false;

  editPincode(pin) {
    console.log(pin);
    this.length = pin.length;
    console.log(this.length);
    this.lead_data2.state = '';
    this.lead_data2.district = '';
    this.lead_data2.city = '';
    // this.no_vaild= false;


    if (this.length == 6) {
      console.log("Test Funcation");
      this.serve.post_rqst('', "Lead/getAddress/" + pin).subscribe((result => {
        console.log(result);
        if (this['status'] = 'Success') {
          this.lead_data2.state = result['data']['state_name'];
          this.lead_data2.district = result['data']['district_name'];
          this.lead_data2.city = result['data']['city'];
          console.log(this.lead_data2.state);
          console.log(this.lead_data2.district);
          console.log(this.lead_data2.city);
          this.getCityAreaList(this.lead_data2.district, this.lead_data2.state, 2);
        }

        else {
          this.no_vaild = true;
        }

        // this.dialog.success("Save","Success");
      }))
    }
  }



  update() {
    console.log(this.data.value);
  }




  update_address() {


    console.log(this.lead_data2);
    this.lead_data2.area = this.lead_data2.cityArea;
    this.lead_data2.cityArea = '';
    this.lead_data2.uid = this.userId;
    this.lead_data2.uname = this.userName;


    console.log(this.lead_data2);

    this.serve.post_rqst(this.lead_data2,"Lead/updateAddress").subscribe((result => {
      console.log(result);
      this.dialog2.closeAll();
      this.dialog.success("Save", "Success");
    }))


  }


  update_detail(data) {
    console.log(data);

    let leadData = {
      'dr_id': data['id'],
      'company_name': data['company_name'],
      'change_lead': data['change_lead'],
      'name': data['name'],
      'mobile_no': data['mobile'],
      'email_id': data['email'],
      'source': data['source'],
      'status': data['status'],
      'gst_no': data['gst'],
      'stage': data['stage'],
      'whatsapp_no': data['whatsapp_no'],
      'type': data['type'],
      'date_of_birth': moment(data['date_of_birth']).format('YYYY-MM-DD'),
      'date_of_anniversary': moment(data['date_of_anniversary']).format('YYYY-MM-DD'),
      'description': data['description'],
      'reason':data['reason'],

    }

    console.log(leadData);
    this.serve.post_rqst({ data: leadData,'uid':this.userId,'uname':this.userName}, "Lead/leadDetailUpdate").subscribe((result => {
      console.log(result);
      this.dialog2.closeAll();
      this.serve.count_list();
      // this.update_lead()
      this.dialog.success("Save", "Success");
    }))
  }
  update_lead() {






    this.serve.post_rqst({ 'id': this.lead_data.id,'type':this.lead_data.change_lead,'login_id':this.userId}, "Lead/update_type").subscribe((result => {
      console.log(result);
      this.dialog2.closeAll();
      this.serve.count_list();
      this.dialog.success("Save", "Success");
    }))
  }
  // getCountryList()
  // {
  //   console.log("addUser");
  //   this.serve.post_rqst(0,"User/country_list").subscribe((response=>{
  //     console.log(response);
  //     this.countryList=response['query']['country_name'];
  //     console.log(this.countryList);
  //   }));

  // }
  // getStateList(country_name, src)
  // {
  //   console.log("addUser");
  //   this.serve.post_rqst(0,"User/state_user_list").subscribe((response=>{
  //     console.log(response);
  //     this.state_list=response['query']['state_name'];
  //     // this.state_list=this.state
  //     console.log(this.state_list);


  //   }));

  // }
  //   getDistrict(state_name, src)
  //   {
  //     console.log(state_name);

  //     if(src == 2) {
  //       this.data.district = '';
  //       this.data.city = '';
  //       this.data.pincode = '';
  //     }
  //     this.serve.post_rqst(state_name,"User/district_user_list").subscribe((response=>{
  //       // console.log(response);
  //       this.district_list=response['query']['district_name'];
  //       console.log(this.district_list);

  //     }));

  //   }
  MobileNumber(event: any) {
    console.log(event);

    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }
  }

  //   getCityList(district,state, src)
  //   {
  //     console.log(district);
  //     console.log(state);

  //     if(src == 2) {
  //       this.data.city = '';
  //       this.data.pincode = '';
  //     }

  //     let value={"state":state,"district":district}
  //     this.serve.post_rqst(value,"User/city_user_list").subscribe((response=>{
  //       console.log(response);
  //       this.city_list=response['query']['city'];
  //       console.log(this.city_list);

  //     }));
  //   }

  getPinCodeList(state, district, city, src) {

    if (src == 2) {
      this.data.pincode = '';
    }

    console.log(district, state, city);
    let value = { "state": state, "district": district, "city": city }
    this.serve.post_rqst(value, "User/pincode_user_list").subscribe((response => {
      console.log(response);
      this.pinCode_list = response['query']['pincode'];
      console.log(this.pinCode_list);

    }));
  }


  getStateList() {
    this.serve.post_rqst(0, "User/state_user_list").subscribe((response => {
      console.log(response);
      this.state_list = response['query']['state_name'];
      // this.state_list=this.state

    }));

  }

  source_list:any=[];
  getsource_list() {
    this.serve.post_rqst('', "Lead/lead_source_list").subscribe((result => {
      console.log(result);
      this.source_list = result['lead_source_list'];
    }))
  }


  getDistrict(state_name, src) {

    if (src == 2) {
      this.lead_data2.district = '';
      this.lead_data2.cityArea = '';
      this.lead_data2.city='';
      this.lead_data2.pincode='';
      console.log(this.lead_data2);

    }
    console.log(this.lead_data2);


    this.serve.post_rqst(state_name, "User/district_user_list").subscribe((response => {
      console.log(response);
      this.district_list = response['query']['district_name'];

    }));
  }

  getCityAreaList(district, state, src) {
    if (src == 2) {
      this.lead_data2.cityArea = '';
      this.lead_data2.city='';
      this.lead_data2.pincode='';



    }
    let value = { "state": state, "district": district }


    this.serve.post_rqst(value, "User/city_user_list").subscribe((response => {
      console.log(response);
      this.city_list = response['query']['city'];


    }));





  }

  getarea(district, state,city){
  let value1 = { "state": state, "district": district,'city':city,};

    this.serve.post_rqst(value1, "User/area_user_list").subscribe((response => {
      console.log(response);
      this.cityAreaList = response['query']['area'];
    }));

  }
}

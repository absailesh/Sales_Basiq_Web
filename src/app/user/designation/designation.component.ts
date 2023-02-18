import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { sessionStorage } from 'src/app/localstorage.service';
import { DatabaseService } from 'src/_services/DatabaseService';

@Component({
  selector: 'app-designation',
  templateUrl: './designation.component.html'
})
export class DesignationComponent implements OnInit {
  
  savingFlag:boolean = false;
  data:any ={};
  assign_login_data:any={};
  logined_user_data:any ={};
  users:any =[];
  

  constructor(public toast:ToastrManager, @Inject(MAT_DIALOG_DATA)public modelData, public rout: Router, public session: sessionStorage, public service: DatabaseService,public dialogRef: MatDialogRef<DesignationComponent>) { 
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value.data;

    if(modelData.type == 'transferData'){
      this.getReportManager('');
      this.data.user_id = modelData.user_detail.id;
      this.data.name = modelData.user_detail.name + ' ' + modelData.user_detail.employee_id;
      this.data.employee_id = modelData.user_detail.employee_id;
    }
    if(modelData.type == 'updatePassword'){
      this.data.user_id = modelData.user_detail.id;
      this.data.password = modelData.user_detail.password;
    }
  }
  
  ngOnInit() {
  }
  


  getReportManager(searcValue) {
    this.service.post_rqst({'search':searcValue}, "Master/getSalesUserForReporting").subscribe((result => {
      if(result['all_sales_user']['statusCode'] ==  200){
        this.users = result['all_sales_user']['all_sales_user'];
      }
      else{
        this.toast.errorToastr(result['all_sales_user']['statusMsg'])
      }
    }));
  }

  
  
  
  submitDetail(type) {
    this.savingFlag = true;
    this.data.created_by_name=this.logined_user_data.name;
    this.data.created_by_id=this.logined_user_data.id;
    let header
    if(type == 'designation'){
      header = this.service.post_rqst({'data':this.data}, "Master/addDesignation")
    }
    if(type == 'transfer-data'){
      header = this.service.post_rqst({'data':this.data}, "Master/userDataTransfer")
    }
    if(type == 'update-password'){
      header = this.service.post_rqst({'data':this.data}, "Master/updateUserPassword")
    }
    header.subscribe((response => {
      if(response['statusCode']==200){
        this.toast.successToastr(response['statusMsg']);
        this.rout.navigate(['/user-add']);
        this.dialogRef.close(true);
        this.savingFlag = false;
      }
      else{
        this.toast.errorToastr(response['statusMsg']);
        this.savingFlag = false;
      }
    }));
  }
  
}

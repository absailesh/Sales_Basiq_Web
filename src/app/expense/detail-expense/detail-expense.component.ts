import { Component, OnInit } from '@angular/core';
import { ExpenseModalComponent } from '../expense-modal/expense-modal.component';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';
import { ImageModuleComponent } from 'src/app/image-module/image-module.component';
import { ExpesneEditComponent } from '../expesne-edit/expesne-edit.component';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-detail-expense',
  templateUrl: './detail-expense.component.html',
  styleUrls: ['./detail-expense.component.scss']
})
export class DetailExpenseComponent implements OnInit {
  skLoading:boolean= false;
  expenseDetail:any={};
  expenseId:any
  loader:any;
  travel:any=[];
  localConv:any=[];
  hotel:any=[];
  miscExp:any=[];
  food:any=[];
  assign_login_data: any = [];
  assign_login_data2: any = []

  constructor(public toast: ToastrManager, public route:ActivatedRoute,public serve:DatabaseService,public router :Router,public dialog: MatDialog,public alert:DialogComponent,public session: sessionStorage){
    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data2 = this.assign_login_data.data;
    this.assign_login_data = this.assign_login_data.assignModule;
    this.route.params.subscribe( params => {
      console.log(params);
      this.expenseId = params.id;
      this.serve.currentUserID = params.id
    });
    
    this.getExpenseDetail();
    
  }
  
  ngOnInit() {}
  
  openImage(url){
    console.log(url);
    window.open(url);
  }
  
  getExpenseDetail(){
    this.loader=1;
    this.skLoading = true;
    this.serve.post_rqst({'expenseId':this.expenseId},"Expense/expenseDetail").subscribe(result=>{
     if(result['statusCode']==200){
      this.skLoading = false;
      this.expenseDetail = result['result'];
      this.travel=result['travel'];
      this.localConv=result['localConv'];
      this.hotel=result['hotel'];
      this.miscExp=result['miscExp'];
      this.food=result['food'];
     }else{
      this.skLoading = false;
      this.toast.errorToastr(result['statusMsg']);
     }
    }, err=>{
      this.skLoading = false;
      this.toast.errorToastr('Something went wrong');
    })
  } 
  
  
  
  expModal(type,id,totalAmt){
    const dialogRef = this.dialog.open(ExpenseModalComponent,{
      width:'400px',
      data:{
        type,
        id,
        totalAmt
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.getExpenseDetail();
      
    }); 
  }
  
  
  imageModel(image){
    const dialogRef = this.dialog.open( ImageModuleComponent, {
      // width: '500px',
      data:{
        image,
        
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      console.log('The dialog was closed');  
    });
  }
  
  
  goTo(){
    console.log("goto method calls");
    this.router.navigate(['/allowances', { from: 'expense-detail' }]);
  }
  
  
  edit_details(expense_type) {
    const dialogRef = this.dialog.open(ExpesneEditComponent, {
      width: expense_type == 'Travelentitlement' ? '950px' : '750px',
      data: {
        'from':'expense detail page',
        'expense_type':expense_type,
        'expense_detail':expense_type == 'Travelentitlement' ? this.expenseDetail.travel: 
        expense_type == 'hotel'?this.expenseDetail.hotel:
        expense_type == 'food'?this.expenseDetail.food:
        expense_type == 'local conveyance'?this.expenseDetail.localConv:
        expense_type == 'misc expense information'?this.expenseDetail.miscExp:'no data found'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getExpenseDetail();
    });
  }
  print1() {
    
    const printContents = document.getElementById('print-section1').innerHTML;
    console.log(printContents);
    
    const originalContents = document.body.innerHTML;
    console.log(originalContents);
    
    
    document.body.innerHTML = printContents;
    
    window.print();
    
    document.body.innerHTML = originalContents;
    
    setTimeout(() => {
      
      $('#print').hide();
      
    }, 1000);
  }
  
}

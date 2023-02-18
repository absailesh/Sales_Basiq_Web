import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from '../dialog.component';

@Component({
  selector: 'app-checkin-view',
  templateUrl: './checkin-view.component.html'
})
export class CheckinViewComponent implements OnInit {
  skLoading:boolean = false;
  user_details:any ={};
  attedence_data:any ={}
  check_in_data:any =[];
  waypoints = [];
  location:any =[];
  origin ={};
  destination ={};
  lat:any;
  lng:any;
  constructor(@Inject(MAT_DIALOG_DATA)public data, public dialogs: MatDialog, public toast: ToastrManager,public service: DatabaseService,public dialog: DialogComponent,public dialogRef: MatDialogRef<CheckinViewComponent>) {
    this.getDetails();
  }
  
  ngOnInit() {
  }
  
  close(){
    this.dialogRef.close();
  }
  
  
  getDetails(){
    this.skLoading = true;
    this.service.post_rqst({'id':this.data.user_id,'date':this.data.date}, "Checkin/checkinDetail")
    .subscribe((result => {
      if(result['statusCode']==200){
      this.user_details  = result['result'];
      this.attedence_data = this.user_details.attedence_data;
      this.check_in_data = this.attedence_data.check_in_data;
      this.location = result['result']['location'];

      if(this.location.length > 0){
        for (let i = 0; i < this.location.length; i++) {
            this.waypoints.push({'location': {'lat':this.location[i]['lat'], 'lng':this.location[i]['lng'],}, 'stopover': false});
        }
      }

      if(this.attedence_data.start_lat &&  this.attedence_data.start_lng){
        this.lat = this.attedence_data.start_lat;
        this.lng = this.attedence_data.start_lng;
        this.origin = { 'lat':this.attedence_data.start_lat , 'lng': this.attedence_data.start_lng};
      }
      if(this.attedence_data.stop_lat && this.attedence_data.stop_lng){
        this.destination = { 'lat':this.attedence_data.stop_lat , 'lng':this.attedence_data.stop_lng};
      }
      else{
        this.destination = { 'lat':this.location[this.location.length-1]['lat'] , 'lng': this.location[this.location.length-1]['lng']};
      }



      this.skLoading = false;
      }else{
        this.toast.errorToastr(result['statusMsg'])
      }
    }))
  }
  

  renderOptions = {
    suppressMarkers: false,
  };
  
  markerOptions = {
    origin: {
      infoWindow: 'Origin.',
      // label:'Start',
      icon: './assets/location/start_point.png',
    },
    waypoints: [
      {
        // infoWindow: `<h4>Crowne Plaza New Delhi Mayur Vihar Noida, an IHG Hotel<h4>
        // <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
        // <a href='http://google.com' target='_blank'>Aaa</a>
        // `,
        // label:'KEI Wires',
        icon: './assets/location/checkin_point.png'
      }, {
        icon: './assets/location/checkin_point.png'
      },
      {
        icon: './assets/location/checkin_point.png'
      },
      {
        icon: './assets/location/checkin_point.png'
      },
      {
        icon: './assets/location/checkin_point.png'
      },
      {
        icon: './assets/location/checkin_point.png'
      },
      {
        icon: './assets/location/checkin_point.png'
      },
      {
        icon: './assets/location/checkin_point.png'
      },
      {
        icon: './assets/location/checkin_point.png'
      },
      {
        icon: './assets/location/checkin_point.png'
      },
      {
        icon: './assets/location/checkin_point.png'
      },
      {
        icon: './assets/location/checkin_point.png'
      },
      {
        icon: './assets/location/checkin_point.png'
      },
      {
        icon: './assets/location/checkin_point.png'
      },
      {
        icon: './assets/location/checkin_point.png'
      },
      {
        icon: './assets/location/checkin_point.png'
      }
      

      
    ],
    destination: {
      infoWindow: 'Destination',
      icon: './assets/location/end_point.png',
    },
  };
  


}

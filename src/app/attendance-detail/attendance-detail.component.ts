import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from '../dialog.component';
import { ImageModuleComponent } from '../image-module/image-module.component';
import { sessionStorage } from '../localstorage.service';

@Component({
  selector: 'app-attendance-detail',
  templateUrl: './attendance-detail.component.html'
})
export class AttendanceDetailComponent implements OnInit {
  skLoading:boolean = false;
  attendance_data:any ={};
  checkin_data:any =[];
  waypoints = [];
  origin ={};
  destination ={};
  url:any;
  lat: Number;
  lng: Number;
  location:any =[];
  constructor(@Inject(MAT_DIALOG_DATA)public data, public dialogs: MatDialog, public toast: ToastrManager,public service: DatabaseService,public dialog: DialogComponent,public dialogRef: MatDialogRef<AttendanceDetailComponent>) {
    this.getDetails();
    this.url = this.service.uploadUrl + 'attendence/';
  }
  
  ngOnInit() {
    this.service.currentUserID = this.data.attendance_id 
  }
  
  
  
  markerDragEnd(m, $event: MouseEvent) {
    console.log('dragEnd', m, $event);
  }
  
  
  getDetails(){
    this.skLoading = true;
    this.service.post_rqst({'attendance_id':this.data.attendance_id, 'user_id':this.data.user_id,'date':this.data.date}, "Attendance/attendenceForTravelDetail")
    .subscribe((result => {
      if(result['statusCode']==200){
        this.attendance_data = result['result'];
        this.checkin_data = this.attendance_data['check_in_data'];
        this.location = result['location_array'];
        if(this.location.length > 0){
          for (let i = 0; i < this.location.length; i++) {
              this.waypoints.push({'location': {'lat':this.location[i]['lat'], 'lng':this.location[i]['lng'],}, 'stopover': false});
          }
        }

        if(this.attendance_data.start_lat &&  this.attendance_data.start_lng){
          this.lat = this.attendance_data.start_lat;
          this.lng = this.attendance_data.start_lng;
          this.origin = { 'lat':this.attendance_data.start_lat , 'lng': this.attendance_data.start_lng};
        }
        if(this.attendance_data.stop_lat && this.attendance_data.stop_lng){
          this.destination = { 'lat':this.attendance_data.stop_lat , 'lng':this.attendance_data.stop_lng};
        }
        else{
          this.destination = { 'lat':this.location[this.location.length-1]['lat'] , 'lng': this.location[this.location.length-1]['lng']};
        }

        this.skLoading = false;
      }else{
        this.toast.errorToastr(result['statusMsg'])
        this.skLoading = false;
      }
    }))
  }
  
  

  

  
  // waypoints = [
  //   {
  //     location: { lat: 28.5102, lng: 77.2986 },
  //     stopover: false,
  //   },
  //   {
  //     location: { lat: 28.5484, lng: 77.2513 },
  //     stopover: false,
  //   }, {
  //     location: { lat: 28.6304, lng: 77.2177 },
  //     stopover: false,
  //   }
  // ];
  
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
  
  
  
  
  
  close(){
    this.dialogRef.close();
  }
  
  
  
  
  goToImage(image)
  {
    const dialogRef = this.dialogs.open(ImageModuleComponent, {
      panelClass:'Image-modal',
      data:{
        'image':image,
        'type':'base64'
      }});
      dialogRef.afterClosed().subscribe(result => {
        
      });
      
    }
  }
  
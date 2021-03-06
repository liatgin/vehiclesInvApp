import { Component, OnInit } from '@angular/core';
import { Vehicle, CAR_TYPE } from '../vehicle/vehicle.component';
import { EditVehicleComponent } from '../edit-vehicle/edit-vehicle.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ServerApiService } from '../server-api.service';


@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css']
})
export class VehiclesComponent implements OnInit {

  vehicles: Array<Vehicle>;
  panelOpenState = false;

  constructor(public dialog: MatDialog, public serverApiService: ServerApiService) { }

  ngOnInit() {
    this.serverApiService.vehicles()
      .then((newVehicles) => {
          this.vehicles = newVehicles;
      });
  }


  onAddClick() {
    this.fillDetailsWindow()
    .then((vehicle: Vehicle) => {
      this.addVehicle(vehicle);
    })
    .catch((err) => console.log(err));
  }

  addVehicle(vehicle) {
    this.serverApiService.addVehicle(vehicle)
      .then ((newVehicles) => {
        this.vehicles  = newVehicles;
      });
  }

  onDeleteClick(vehicle) {
    this.serverApiService.deleteVehicle(vehicle)
      .then((newVehicles) => {
        this.vehicles = newVehicles;
      });
  }

  onEditClick(vehicle) {
    this.fillDetailsWindow(vehicle)
    .then((newVehicle) => {
      this.editVehicle(newVehicle);
    })
    .catch((err) => console.log(err));
  }

  editVehicle(vehicle: Vehicle) {
    this.serverApiService.editVehicle(vehicle)
    .then(() => {
      this.serverApiService.vehicles()
      .then((newVehicles) => {
      this.vehicles = newVehicles;
      });
    });
  }

  async fillDetailsWindow(vehicle?: Vehicle): Promise<Vehicle> {

    const data = {
      id:  vehicle && vehicle.id,
      name: vehicle && vehicle.name,
      car_type: vehicle && vehicle.car_type,
      time_created: vehicle && vehicle.time_created,
      last_successful_connection: vehicle && vehicle.last_successful_connection
    };

    const dialogRef = this.dialog.open(EditVehicleComponent, {
      width: '40vw',
      data
    });

    return new Promise<Vehicle>((resolve, reject) => {
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          const newVehicle: Vehicle = {
            id:  result.id,
            name: result.name,
            car_type: result.car_type,
            time_created: result.time_created,
            last_successful_connection: result.last_successful_connection
          };
          resolve( newVehicle );
        } else {
          reject();
        }
      });
    });
  }

}

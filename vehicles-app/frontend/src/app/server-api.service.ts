import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Vehicle } from '../app/vehicle/vehicle.component';

@Injectable({
  providedIn: 'root'
})
export class ServerApiService {
  rootUrl = (window.location.hostname === 'localhost') ? 'http://localhost:3000' : `${window.location.origin}`;
  vehiclesUrl = `${this.rootUrl}/vehicles`;
  vehicleUrl = `${this.rootUrl}/vehicle`;

  constructor(private http: Http) { }

  vehicles() {
    return this.http.get(this.vehiclesUrl)
    .toPromise()
    .then((response: Response) => {
      const vehicles = response.json();
      return vehicles.response;
    })
    .catch((err) => {});
  }

  editVehicle(vehicle: Vehicle) {
    const reqParams = {
      id: vehicle.id,
      name: vehicle.name,
      car_type: vehicle.car_type,
      last_successful_connection: vehicle.last_successful_connection,
      time_created: vehicle.time_created
    };

    return this.http.put(this.vehicleUrl, reqParams)
      .toPromise();
  }

  addVehicle(vehicle: Vehicle) {
    const reqParams = {
      id: vehicle.id,
      name: vehicle.name,
      car_type: vehicle.car_type,
      last_successful_connection: vehicle.last_successful_connection,
      time_created: vehicle.time_created
    };

    return this.http.post(this.vehicleUrl, reqParams)
      .toPromise()
      .then((response: Response) => {
        return this.vehicles();
      });
  }

  deleteVehicle(vehicle: Vehicle) {
    return this.http
    .delete(`${this.vehicleUrl}/${vehicle.id}`)
    .toPromise()
    .then(() => {
      return this.vehicles();
    });
  }
}

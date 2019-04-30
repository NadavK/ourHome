import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { OnetimeSchedule } from '../models/onetime-schedule';
import { Api } from './api';

@Injectable()
export class OnetimeSchedules {

  constructor(public api: Api) {
  }

  query(params?: any): Observable<OnetimeSchedule[]> {
    return this.api.get('onetimeschedules/', params)
      .map(resp => resp.json())
      //.catch((error:any) => Observable.throw(console.log('ERROR2', error.json().error) || 'Server error'));
      .catch((error:any) => Observable.throw('Server error'));
  }

  save_or_add(onetimeSchedule: OnetimeSchedule): Observable<OnetimeSchedule[]> {
    if (isNaN(onetimeSchedule.id))
      return this.add(onetimeSchedule);
    else
      return this.save(onetimeSchedule);
  }

  save(onetimeSchedule: OnetimeSchedule): Observable<OnetimeSchedule[]> {
    return this.api.put('onetimeschedules/' + onetimeSchedule.id + '/', onetimeSchedule)
      .map(resp => resp.json())
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  add(onetimeSchedule: OnetimeSchedule): Observable<OnetimeSchedule[]> {      //why is this an array?
    return this.api.post('onetimeschedules/', onetimeSchedule)
      .map(resp => resp.json())
      //.catch((error: any) => Observable.throw(error.json().error || 'Server error'));
      .catch((error: any) => Observable.throw(console.log('ERROR', error) || 'Server error'));
  }

  delete(onetimeSchedule: OnetimeSchedule) {
  }
}

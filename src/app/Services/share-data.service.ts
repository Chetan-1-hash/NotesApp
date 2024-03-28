import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareDataService {

  private value = new BehaviorSubject<boolean>(true);
  mode = this.value.asObservable();

  setMode(type:boolean){
    this.value.next(type);
  }

  private sideBarValue = new BehaviorSubject<boolean>(false);
  action = this.sideBarValue.asObservable();

  setSectionLocation(actionTaken:boolean){
    this.sideBarValue.next(actionTaken);
  }

  private HeightValue = new BehaviorSubject<number>(0);
  changeheightvalue = this.HeightValue.asObservable();

  setComponentHeight(ht:number){
    this.HeightValue.next(ht);
  }

  private DeletedId = new BehaviorSubject<number>(0);
  d_id = this.DeletedId.asObservable();
  
  setD_ID(id:number){
    this.DeletedId.next(id);
  }

}

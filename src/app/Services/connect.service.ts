import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConnectService {

  constructor(private httpclient : HttpClient) { }

  getAllNotes(){
    return this.httpclient.get<Notes[]>("http://localhost:8080/getAllNotes");
  }

  saveNotes(n:Notes){
    return this.httpclient.post<string>("http://localhost:8080/saveNotes",n , {responseType: 'text' as 'json'});
  }

  updateNotes(id:number,n:Notes){
    return this.httpclient.put("http://localhost:8080/updateNote/"+id,n);
  }

  deleteNote(id:number){
    return this.httpclient.delete("http://localhost:8080/deleteNote/"+id);
  }

  selectBoxColor(id:number, color:string){
    return this.httpclient.get("http://localhost:8080/setBoxColor/"+id+"/"+color);
  }

  saveDeletedNote(n:Notes){
    return this.httpclient.post("http://localhost:8080/saveDeletedNote",n );
  }

  getDeletedNotes(){
    return this.httpclient.get<DeletedNote[]>("http://localhost:8080/getDeletedNotes");
  }

  deleteTrashNote(id:number){
    return this.httpclient.delete("http://localhost:8080/deleteTrashNote/"+id);
  }

  getAllRemainder(){
    return this.httpclient.get<Notes[]>("http://localhost:8080/getAllRemainder");
  }

  saveRemainder(n:Notes){
    return this.httpclient.post<string>("http://localhost:8080/saveRemainder",n , {responseType: 'text' as 'json'});
  }

  updateRemainder(id:number,n:Notes){
    return this.httpclient.put("http://localhost:8080/updateRemainder/"+id,n);
  }

  deleteRemainder(id:number){
    return this.httpclient.delete("http://localhost:8080/deleteRemainder/"+id);
  }

  selectRemainderBoxColor(id:number, color:string){
    return this.httpclient.get("http://localhost:8080/setRemainderBoxColor/"+id+"/"+color);
  }

}

export class Notes{
  _id:number;
  title:string;
  text:string[];
  boxColor:string;

  constructor(_id:number, title:string, text:string[], boxColor:string){
    this._id = _id;
    this.title = title;
    this.text = text;
    this.boxColor = boxColor;
  }
}

export class DeletedNote{
  _id:number;
  title:string;
  text:string[];
  boxColor:string;

  constructor(_id:number, title:string, text:string[], boxColor:string){
    this._id = _id;
    this.title = title;
    this.text = text;
    this.boxColor = boxColor;
  }
}

export class Remainder{
  _id:number;
  title:string;
  text:string[];
  boxColor:string;

  constructor(_id:number, title:string, text:string[], boxColor:string){
    this._id = _id;
    this.title = title;
    this.text = text;
    this.boxColor = boxColor;
  }
}
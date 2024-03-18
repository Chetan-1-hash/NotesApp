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

}

export class Notes{
  _id:number;
  title:string;
  text:string[];

  constructor(_id:number, title:string, text:string[]){
    this._id = _id;
    this.title = title;
    this.text = text;
  }
}
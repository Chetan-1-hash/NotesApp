import { Component } from '@angular/core';
import { ShareDataService } from '../Services/share-data.service';
import { ConnectService, DeletedNote, Notes } from '../Services/connect.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrashCan, faTrashRestore } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-trash',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './trash.component.html',
  styleUrl: './trash.component.css'
})
export class TrashComponent {

  constructor(private s: ShareDataService, private conn: ConnectService) { }

  isDark!: boolean;
  isOpened: boolean = true;

  faDelete = faTrashCan;
  faRestore = faTrashRestore;

  // deletedNoteID:number[]=[];
  deletednotes: DeletedNote[] = [];
  restoreNote!:Notes;

  ngOnInit() {
    this.s.mode.subscribe(
      (value) => {
        this.isDark = value;
        if (this.isDark) {
          document.querySelector('.btn-close')?.classList.add('btn-close-white');
        }
        else {
          document.querySelector('.btn-close')?.classList.remove('btn-close-white');
        }
      }
    );

    this.s.action.subscribe(
      (value) => {
        this.isOpened = value;
      }
    );

    

    this.getDeletedNote();
  }

  getDeletedNote(){
    this.conn.getDeletedNotes().subscribe(
      (value : DeletedNote[]) => {
        this.deletednotes = value;
      }
    );
  }

  deleteTrashNoteFromAngular(id:number) {
    this.conn.deleteTrashNote(id).subscribe(
      () => {
        this.getDeletedNote();
      }
    );
  }

  RestoreNote(rN:Notes){
      this.conn.saveNotes(rN).subscribe();
      this.deleteTrashNoteFromAngular(rN._id);
  }



}

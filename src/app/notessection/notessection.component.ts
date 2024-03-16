import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ShareDataService } from '../Services/share-data.service';
import { notes } from '../notessection/Notes-List/notelist';
import { ConnectService, Notes } from '../Services/connect.service';

@Component({
  selector: 'app-notessection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notessection.component.html',
  styleUrl: './notessection.component.css'
})
export class NotessectionComponent {

  constructor(private s: ShareDataService, private conn : ConnectService) { }

  isDark!: boolean;
  isOpened: boolean = true;
  ShowAddNote: boolean = false;

  @ViewChild('titlebox') titleBox!: ElementRef;
  @ViewChild('textsbox') textsBox!: ElementRef;
  @ViewChild('notesBoxes') notesBoxes!: ElementRef;
  n! :Notes;

  note : Notes[] = [];

  ngOnInit() {
    this.s.mode.subscribe(
      (value) => {
        this.isDark = value;
      }
    );

    this.s.action.subscribe(
      (value) => {
        this.isOpened = value;
      }
    );

    this.getAllNoteFromAngular();
  }

  addNoteContainer() {
    this.ShowAddNote = true;
    setTimeout(() => {
      this.titleBox.nativeElement.focus();
    });

  }

  onBlur() {
    setTimeout(() => {
      const titleActive = this.titleBox?.nativeElement.contains(document.activeElement);
      const textsActive = this.textsBox?.nativeElement.contains(document.activeElement);



      if (this.titleBox.nativeElement.value && this.textsBox.nativeElement.value) {
        const newNote :Notes = {
          _id: this.note.length + 1,
          title: this.titleBox.nativeElement.value,
          text: this.textsBox.nativeElement.value,
        };
        this.n = newNote;
        console.log(this.n);
        // this.saveNotesFromAngular();
      }

      if (!titleActive && !textsActive) {
        this.ShowAddNote = false;
      }
    }, 100);
  }

  previousHeight: number = 0;
  viewChecked: boolean = false;

  ngAfterViewChecked() {
    if (!this.viewChecked) {
      this.calculateNotesBoxesHeight();
      this.viewChecked = true;
    }
  }

  calculateNotesBoxesHeight() {
    setTimeout(() => {
      const height = this.notesBoxes.nativeElement.clientHeight;
      if (height !== this.previousHeight) {
        // console.log('Height of notes-boxes:', height);
        this.s.setComponentHeight(height);
        this.previousHeight = height;
      }
      this.viewChecked = false; // Reset the flag after calculation
    }, 0);
  }


  getAllNoteFromAngular(){
    this.conn.getAllNotes().subscribe(
      (value:Notes[]) => {
        this.note = value;
      }
    );
  }

  saveNotesFromAngular(){
    this.conn.saveNotes(this.n).subscribe();
  }

}

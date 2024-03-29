import { CommonModule } from '@angular/common';
import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { ShareDataService } from '../Services/share-data.service';
import { notes } from '../notessection/Notes-List/notelist';
import { ConnectService, Notes } from '../Services/connect.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faDeleteLeft, faDropletSlash, faEdit, faPalette, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notessection',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './notessection.component.html',
  styleUrl: './notessection.component.css'
})
export class NotessectionComponent {

  constructor(private s: ShareDataService, private conn: ConnectService, private renderer: Renderer2) { }

  isDark!: boolean;
  isOpened: boolean = true;
  ShowAddNote: boolean = false;
  previousHeight: number = 0;
  viewChecked: boolean = false;
  selectBoxIndex: number = 0;
  selectedColor!: string;
  showNotes!: Notes;
  n!: Notes;
  note: Notes[] = [];
  deletedNote: Notes[] = [];

  faDelete = faTrashCan;
  faUpdate = faEdit
  faColor = faPalette;
  faNoColor = faDropletSlash;

  @ViewChild('insertionModalInput', { static: false }) titleBox?: ElementRef;
  @ViewChild('insertionText', { static: false }) textsBox?: ElementRef;
  @ViewChild('notesBoxes') notesBoxes!: ElementRef;
  @ViewChild('Crossbtn') Crossbtn!: ElementRef;
  @ViewChild('insertionModal', { static: false }) insertmodal?: ElementRef;
  @ViewChild('updationModal', { static: false }) modal?: ElementRef;
  @ViewChild('updationModalContent') updationModalContent?: ElementRef;
  @ViewChild('colorPickerModal') colorPickerModal?: ElementRef;
  @ViewChild('boxes') boxes?: ElementRef;
  @ViewChild('uTitle') uTitle!: ElementRef;
  @ViewChild('uText') uText!: ElementRef;

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

    this.getAllNoteFromAngular();

    //Performing closechangeColor() when click outside anywhere
    this.renderer.listen('document', 'click', (event: MouseEvent) => {
      if (this.modal && !this.modal.nativeElement.contains(event.target)) {
        this.closechangeColor();
      }
    });
  }

  //Opertaion-1 -> Insertion of notes

  addNoteContainer() {
    this.ShowAddNote = true;
    (this.insertmodal?.nativeElement as HTMLElement).style.display = 'block';
    document.body.classList.add('modal-open');
    (this.titleBox?.nativeElement as HTMLElement).focus();
  }

  onBlur() {

    setTimeout(() => {
      let titleActive = this.titleBox?.nativeElement.contains(document.activeElement);
      let textsActive = this.textsBox?.nativeElement.contains(document.activeElement);
      let newTextArray = this.textsBox?.nativeElement.value.split('\n');

      if (this.titleBox?.nativeElement.value && this.textsBox?.nativeElement.value) {
        // Split text by newline
        const newNote: Notes = {
          _id: this.note[this.note.length-1]._id + 1,
          title: this.titleBox.nativeElement.value,
          text: newTextArray, // Save as array of strings 
          boxColor: "inherit",
        };
        this.n = newNote;
        this.saveNotesFromAngular();
      }

      if (!titleActive && !textsActive) {
        if (this.titleBox?.nativeElement) {
          this.titleBox.nativeElement.value = '';
        }
        if (this.textsBox?.nativeElement) {
          this.textsBox.nativeElement.value = '';
        }
        (this.insertmodal?.nativeElement as HTMLElement).style.display = 'none';
        document.body.classList.remove('modal-open')
        this.ShowAddNote = false;
      }
    }, 100);

  }

  saveNotesFromAngular() {
    this.conn.saveNotes(this.n).subscribe(
      () => {
        this.getAllNoteFromAngular();
      }
    );
  }


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
        this.s.setComponentHeight(height);
        this.previousHeight = height;
      }
      this.viewChecked = false;
    }, 0);
  }


  //Operation-2 -> Updation of note

  open(uN: Notes) {
    this.showNotes = uN;
    console.log(this.showNotes);
    (this.modal?.nativeElement as HTMLElement).style.display = 'block';
    document.body.classList.add('modal-open')
    console.log((this.modal?.nativeElement as HTMLElement).style.display)
  }

  close() {
    (this.modal?.nativeElement as HTMLElement).style.display = 'none';
    document.body.classList.remove('modal-open')
    this.selectBoxIndex = 0
    this.getAllNoteFromAngular();
  }

  changeColor(event: MouseEvent) {

    (this.colorPickerModal?.nativeElement as HTMLElement).style.display = 'block';
    document.body.classList.add('modal-open')

    event.stopPropagation();
  }

  selectBox(index: number) {
    this.selectBoxIndex = index;
  }

  selectColor(color: string) {
    this.selectedColor = color;
    this.showNotes.boxColor = color;
    if (this.selectBoxIndex !== null && this.uTitle && this.uText && this.boxes && this.updationModalContent) {
      this.conn.selectBoxColor(this.selectBoxIndex, color).subscribe(
        () => {
          this.closechangeColor();
        }
      );
    }
  }

  closechangeColor() {
    (this.colorPickerModal?.nativeElement as HTMLElement).style.display = 'none';
    document.body.classList.remove('modal-open')
    this.getAllNoteFromAngular();
  }

  updateNoteFromAngular() {
    const stext = this.uText.nativeElement.value.split('\n');
    const updationNotes: Notes = {
      _id: this.showNotes._id,
      title: this.uTitle.nativeElement.value,
      text: stext,
      boxColor: this.showNotes.boxColor,
    };
    this.conn.updateNotes(updationNotes._id, updationNotes).subscribe(
      () => {
        this.close();
        this.getAllNoteFromAngular();
      }
    );
  }

  //Operation-3 -> Show all notes

  getAllNoteFromAngular() {
    this.conn.getAllNotes().subscribe(
      (value: Notes[]) => {
        this.note = value
      },
      (error) => {
        console.log("error" + error);
      }
    );
  }

  //Operation-4 -> Delete a single note

  deleteNote(id: number, event: MouseEvent) {
    this.conn.deleteNote(id).subscribe(
      () => {
        for (let i = 0; i < this.note.length; i++) {
          if (id === this.note[i]._id) {
            const deletedItem = this.note.splice(i, 1)[0]; // Remove the item from this.note and get it
            this.deletedNote.push(deletedItem);
            this.saveDeletedNote(deletedItem);
            break;
          }
        }
        this.getAllNoteFromAngular();
        this.s.setD_ID(id);
        this.close();
        console.log(this.note)
        console.log(this.showNotes)
      }
    );


    event.stopPropagation();
  }

  saveDeletedNote(n: Notes) {
    this.conn.saveDeletedNote(n).subscribe();
  }

}

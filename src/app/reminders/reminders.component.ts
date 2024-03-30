import { CommonModule } from '@angular/common';
import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faDropletSlash, faEdit, faPalette, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { ShareDataService } from '../Services/share-data.service';
import { ConnectService, Remainder } from '../Services/connect.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-reminders',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './reminders.component.html',
  styleUrl: './reminders.component.css'
})
export class RemindersComponent implements OnInit, AfterViewChecked {

  constructor(private s: ShareDataService, private conn: ConnectService, private renderer: Renderer2) { }

  isDark!: boolean;
  isOpened: boolean = true;
  ShowAddRemainder: boolean = false;
  previousHeight: number = 0;
  viewChecked: boolean = false;
  selectBoxIndex: number = 0;
  selectedColor!: string;
  showRemainder!: Remainder;
  n!: Remainder;
  remainder: Remainder[] = [];
  notificationTimer:Date[] = [];
  notificationText:string[] = [];

  faDelete = faTrashCan;
  faUpdate = faEdit;
  faColor = faPalette;
  faNoColor = faDropletSlash;

  @ViewChild('insertionModalInput', { static: false }) titleBox?: ElementRef;
  @ViewChild('insertionText', { static: false }) textsBox?: ElementRef;
  @ViewChild('insertDateTime', { static: false }) DateTimeBox?: ElementRef;
  @ViewChild('RemainderBoxes') remainderBoxes!: ElementRef;
  @ViewChild('Crossbtn') Crossbtn!: ElementRef;
  @ViewChild('insertionModal', { static: false }) insertmodal?: ElementRef;
  @ViewChild('updationModal', { static: false }) modal?: ElementRef;
  @ViewChild('updationModalContent') updationModalContent?: ElementRef;
  @ViewChild('colorPickerModal') colorPickerModal?: ElementRef;
  @ViewChild('updateDateTime', { static: false }) updateDateTimeBox?: ElementRef;
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

     //Performing closechangeColor() when click outside anywhere
     this.renderer.listen('document', 'click', (event: MouseEvent) => {
      if (this.modal && !this.modal.nativeElement.contains(event.target)) {
        this.closechangeColor();
      }
    });

    this.getAllRemainderFromAngular();

    setInterval(() => {
      this.getNotification();
    },10000)
  }

  //Opertaion-1 -> Insertion of remainder

  addRemainderContainer() {
    this.ShowAddRemainder = true;
    (this.insertmodal?.nativeElement as HTMLElement).style.display = 'block';
    document.body.classList.add('modal-open');
    (this.titleBox?.nativeElement as HTMLElement).focus();
  }

  onBlur() {

    setTimeout(() => {
      let titleActive = this.titleBox?.nativeElement.contains(document.activeElement);
      let textsActive = this.textsBox?.nativeElement.contains(document.activeElement);
      let datetimeActive = this.DateTimeBox?.nativeElement.contains(document.activeElement);
      let newTextArray = this.textsBox?.nativeElement.value.split('\n');

      if (this.titleBox?.nativeElement.value && this.textsBox?.nativeElement.value && this.DateTimeBox?.nativeElement.value) {
        // Split text by newline
        const newremainder: Remainder = {
          _id: this.remainder.length > 0? this.remainder[this.remainder.length-1]?._id + 1: 1,
          title: this.titleBox.nativeElement.value,
          text: newTextArray, // Save as array of strings
          boxColor: "inherit",
          date: new Date(this.DateTimeBox.nativeElement.value)
        };
        this.n = newremainder;
        console.log(this.n);
        this.saveRemainderFromAngular();
      }

      if (!titleActive && !textsActive && !datetimeActive) {
        if (this.titleBox?.nativeElement) {
          this.titleBox.nativeElement.value = '';
        }
        if (this.textsBox?.nativeElement) {
          this.textsBox.nativeElement.value = '';
        }
        if (this.DateTimeBox?.nativeElement) {
          this.DateTimeBox.nativeElement.value = '';
        }
        (this.insertmodal?.nativeElement as HTMLElement).style.display = 'none';
        document.body.classList.remove('modal-open')
        this.ShowAddRemainder = false;
      }
    }, 100);

  }

  saveRemainderFromAngular() {
    this.conn.saveRemainder(this.n).subscribe(
      () => {
        this.getAllRemainderFromAngular();
      }
    );
  }


  ngAfterViewChecked() {
    if (this.remainderBoxes && this.remainderBoxes.nativeElement && !this.viewChecked) {
      this.calculateRemainderBoxesHeight();
      this.viewChecked = true;
    }
  }

  calculateRemainderBoxesHeight() {
    setTimeout(() => {
      const height = this.remainderBoxes.nativeElement.clientHeight;
      if (height !== this.previousHeight) {
        this.s.setComponentHeight(height);
        this.previousHeight = height;
      }
      this.viewChecked = false;
    }, 0);
  }


  //Operation-2 -> Updation of remainder

  open(uN: Remainder) {
    this.showRemainder = uN;
    (this.modal?.nativeElement as HTMLElement).style.display = 'block';
    document.body.classList.add('modal-open')
  }

  close() {
    (this.modal?.nativeElement as HTMLElement).style.display = 'none';
    document.body.classList.remove('modal-open')
    this.selectBoxIndex = 0
    this.getAllRemainderFromAngular();
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
    this.showRemainder.boxColor = color;
    if (this.selectBoxIndex !== null && this.uTitle && this.uText && this.boxes && this.updationModalContent) {
      this.conn.selectRemainderBoxColor(this.selectBoxIndex, color).subscribe(
        () => {
          this.closechangeColor();
        }
      );
    }
  }

  closechangeColor() {
    (this.colorPickerModal?.nativeElement as HTMLElement).style.display = 'none';
    document.body.classList.remove('modal-open')
    this.getAllRemainderFromAngular();
  }

  updateRemainderFromAngular() {
    const stext = this.uText.nativeElement.value.split('\n');
    const udatetime = this.updateDateTimeBox?.nativeElement.value;
    const updationRemainder: Remainder = {
      _id: this.showRemainder._id,
      title: this.uTitle.nativeElement.value,
      text: stext,
      boxColor: this.showRemainder.boxColor,
      date: udatetime,
    };
    this.conn.updateRemainder(updationRemainder._id, updationRemainder).subscribe(
      () => {
        this.close();
        this.getAllRemainderFromAngular();
      }
    );
  }

  //Operation-3 -> Show all remainder

  getAllRemainderFromAngular() {
    this.conn.getAllRemainder().subscribe(
      (value: Remainder[]) => {
        this.remainder = value;
        for(let i=0;i<this.remainder.length;i++){
          this.notificationTimer[i] = this.remainder[i].date; 
        }
      },
      (error) => {
        console.log("error" + error);
      }
    );
  }

  getNotification(){
    this.conn.showNotificationRemainder().subscribe(
      (value) => {
        this.notificationText = value;
        console.log(this.notificationText);
      }
    );
  }


  //Operation-4 -> Delete a single Remainder

  deleteRemainder(id: number, event: MouseEvent) {
    this.conn.deleteRemainder(id).subscribe(
      () => {
        for (let i = 0; i < this.remainder.length; i++) {
          if (id === this.remainder[i]._id) {
            this.remainder.splice(i, 1)[0]; // Remove the item from this.remainder and get it
            this.close()
            this.getAllRemainderFromAngular();
            break;
          }
        }
      }
    );


    event.stopPropagation();
  }

}

import { Routes } from '@angular/router';
import { NotessectionComponent } from './notessection/notessection.component';
import { RemindersComponent } from './reminders/reminders.component';
import { TrashComponent } from './trash/trash.component';

export const routes: Routes = [
    { path: "notes", component: NotessectionComponent },
    { path: "reminders", component: RemindersComponent },
    { path: "trash", component: TrashComponent },
];

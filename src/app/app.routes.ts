import { Routes } from '@angular/router';
import { ClienteTable } from './features/cliente-table/cliente-table';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'cliente-table',
    pathMatch: 'full',
  },
  {
    path: 'cliente-table',
    component: ClienteTable,
  },
];

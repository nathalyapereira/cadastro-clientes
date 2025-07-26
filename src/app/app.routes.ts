import { Routes } from '@angular/router';
import { ClienteForm } from './features/cliente-form/cliente-form';
import { ClienteTable } from './features/cliente-table/cliente-table';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'cliente-form',
    pathMatch: 'full',
  },
  {
    path: 'cliente-form',
    component: ClienteForm,
  },
  {
    path: 'cliente-table',
    component: ClienteTable,
  },
];

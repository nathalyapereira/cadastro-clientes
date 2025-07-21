import { Routes } from '@angular/router';
import { ClienteForm } from './features/cliente-form/cliente-form';

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
];

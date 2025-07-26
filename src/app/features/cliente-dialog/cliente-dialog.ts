import { Component } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-cliente-dialog',
  imports: [DialogModule, ButtonModule, InputTextModule],
  templateUrl: './cliente-dialog.html',
  styleUrl: './cliente-dialog.css',
  standalone: true,
})
export class ClienteDialog {
  public visible = false;

  showDialog() {
    this.visible = true;
  }
}

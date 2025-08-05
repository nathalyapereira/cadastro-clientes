import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-cliente-dialog',
  imports: [DialogModule, ButtonModule, InputTextModule],
  templateUrl: './cliente-dialog.html',
  styleUrl: './cliente-dialog.css',
  standalone: true,
})
export class ClienteDialog implements OnInit, OnChanges, OnDestroy {
  @Input() displayModal: boolean = false;
  @Output() displayModalChange = new EventEmitter<boolean>();

  private readonly destroy$ = new Subject<void>();
  public visible = false;

  ngOnInit(): void {
    this.visible = this.displayModal;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['displayModal']) {
      this.visible = changes['displayModal'].currentValue;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

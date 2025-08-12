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
  selector: 'app-confirmation-modal',
  imports: [DialogModule, ButtonModule, InputTextModule],
  templateUrl: './confirmation-modal.html',
  styleUrl: './confirmation-modal.css',
  standalone: true,
})
export class ConfirmationModal implements OnInit, OnChanges, OnDestroy {
  // Properties
  @Input() displayModal: boolean = false;
  @Input() icon: string = 'Confirmação';
  @Input() titulo: string = 'Confirmação';
  @Input() mensagem: string = 'Você tem certeza que deseja continuar?';
  @Output() displayModalChange = new EventEmitter<boolean>();
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

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

  constructor() {}

  onConfirm() {
    this.confirm.emit();
    this.closeModal();
  }

  onCancel() {
    this.cancel.emit();
    this.closeModal();
  }

  closeModal(): void {
    this.visible = false;
    this.displayModalChange.emit(this.visible);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { InputMaskModule } from 'primeng/inputmask';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { Localidade } from '../../core/services/localidade/localidade';
import { Subject, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';
import { CpfValidatorDirective } from '../../shared/validators/cpf-validator.directive';
import {
  LocalidadeEstadosResponse,
  LocalidadePaisesResponse,
} from '../../../models/localidade/LocalidadeResponse';

@Component({
  selector: 'app-cliente-form',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    NgxMaskDirective,
    // PrimeNG
    CardModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    RippleModule,
    InputMaskModule,
    DatePickerModule,
    SelectModule,
    // Directive
    CpfValidatorDirective,
  ],
  templateUrl: './cliente-form.html',
  styleUrl: './cliente-form.css',
  standalone: true,
  providers: [MessageService],
})
export class ClienteForm implements OnInit, OnDestroy {
  // Injects
  private readonly formBuilder = inject(FormBuilder);
  private readonly messageService = inject(MessageService);
  private readonly localidadeService = inject(Localidade);
  // Properties
  private readonly destroy$ = new Subject<void>();
  loading = false;
  CEL_TEL = '';
  maxDate: Date | undefined;
  telefoneControl = new FormControl('');
  paisesData: LocalidadePaisesResponse[] = [];
  estadosData: LocalidadeEstadosResponse[] = [];
  clienteForm = this.formBuilder.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    cpf: ['', []],
    dataNascimento: ['', [Validators.required]],
    contato: ['', [Validators.required, Validators.minLength(10)]],
    pais: ['', [Validators.required]],
    estado: ['', [Validators.required]],
  });

  constructor() {
    const telefoneControl = this.clienteForm.get('contato');

    telefoneControl!.valueChanges.subscribe((value) => {
      console.log('Valor do telefone:', value);
    });
  }

  public telefoneMask = this.clienteForm
    .get('contato')!
    .valueChanges.subscribe((value: string | null) => {
      const CEL = '(00) 0 0000-0000';
      const TEL = '(00) 0000-00009';
      if (value?.length) this.CEL_TEL = value.length == 11 ? CEL : TEL;
    });

  ngOnInit(): void {
    this.maxDate = new Date();
    this.messageService.add({
      severity: 'info',
      summary: 'Teste',
      detail: 'Este toast deveria aparecer!',
      life: 3000,
    });
    this.getPaises();
    this.loading = false;
  }

  getPaises(): void {
    this.localidadeService
      .getPaises()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response !== null) {
            this.paisesData = response;
          }
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail:
              'Falha ao buscar os paises. Por favor, tente novamente mais tarde.',
            life: 3000,
          });
        },
      });
  }

  getEstados(): void {
    const paisSelecionado = this.clienteForm.get('pais')?.value ?? '';
    if (paisSelecionado.length) {
      this.localidadeService
        .getEstados(paisSelecionado)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response !== null) {
              this.estadosData = response;
            }
          },
          error: (err) => {
            console.error('Erro ao buscar estados:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail:
                'Falha ao buscar os estados. Por favor, tente novamente mais tarde.',
              life: 3000,
            });
            this.estadosData = [];
          },
        });
    } else {
      this.estadosData = [];
    }
  }

  getError(fieldName: string, article: string, controlName: string): string {
    const control = this.clienteForm.get(controlName);
    if (!control?.errors) return '';

    if (control.errors['required'])
      return `${fieldName} é obrigatóri${article}.`;
    if (control.errors['email'])
      return `Formato de ${fieldName} inválid${article}.`;
    if (control.errors['minlength']) {
      const required = control.errors['minlength'].requiredLength;
      return `Mínimo de ${required} caracteres.`;
    }

    return `${fieldName} inválid${article}.`;
  }

  validarCpf() {
    const pais = this.clienteForm.get('pais')?.value;
    const cpfControl = this.clienteForm.get('cpf');

    console.log(pais);

    if (!cpfControl) return;

    const currentValidators = cpfControl.validator
      ? [cpfControl.validator]
      : [];

    if (pais === 'BR') {
      const hasRequired = currentValidators.some(
        (v) => v === Validators.required
      );

      if (!hasRequired) {
        cpfControl.setValidators([...currentValidators, Validators.required]);
      }
    } else {
      const newValidators = currentValidators.filter(
        (v) => v !== Validators.required
      );
      cpfControl.setValidators(newValidators);
    }

    cpfControl.updateValueAndValidity();
  }

  validarTelefone() {
    const telefoneValueControl = this.clienteForm.get('contato')!.value;
    if (
      telefoneValueControl &&
      (telefoneValueControl.length === 13 || telefoneValueControl.length === 11)
    ) {
      return null;
    }
    return { telefoneInvalido: true };
  }

  onSubmitClienteForm() {
    console.log('onSubmitClienteForm');
  }

  //Lifecycle
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

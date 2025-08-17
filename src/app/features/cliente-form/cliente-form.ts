import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  Validators,
  ReactiveFormsModule,
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
import {
  catchError,
  filter,
  map,
  Observable,
  of,
  Subject,
  takeUntil,
} from 'rxjs';
import { MessageService } from 'primeng/api';
import { CpfValidatorDirective } from '../../shared/validators/cpf-validator.directive';
import {
  LocalidadeEstadosResponse,
  LocalidadePaisesResponse,
} from '../../../models/localidade/LocalidadeResponse';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { Cliente } from '../../core/services/cliente/cliente';
import { ClienteResponse } from '../../../models/cliente/ClienteResponse';

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
    DialogModule,
    DividerModule,
    // Directive
    CpfValidatorDirective,
  ],
  templateUrl: './cliente-form.html',
  styleUrl: './cliente-form.css',
  standalone: true,
  providers: [MessageService],
})
export class ClienteForm implements OnInit, OnChanges, OnDestroy {
  // Injects
  private readonly formBuilder = inject(FormBuilder);
  private readonly messageService = inject(MessageService);
  private readonly localidadeService = inject(Localidade);
  private readonly clienteService = inject(Cliente);

  // Properties
  private readonly destroy$ = new Subject<void>();
  @Input() displayModal: boolean = false;
  @Input() idCliente: number | undefined;
  @Output() displayModalChange = new EventEmitter<boolean>();
  @Output() idClienteChange = new EventEmitter<number | undefined>();

  visible = false;
  loading = false;
  CEL_TEL = '';
  maxDate: Date | undefined;
  paisesData$: Observable<LocalidadePaisesResponse[] | undefined> = of([]);
  estadosData$: Observable<LocalidadeEstadosResponse[] | undefined> = of([]);
  clienteForm = this.formBuilder.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    cpf: ['', []],
    dataNascimento: [new Date(), [Validators.required]],
    contato: ['', [Validators.required, Validators.minLength(10)]],
    pais: [{} as LocalidadePaisesResponse, Validators.required],
    estado: [{} as LocalidadeEstadosResponse, Validators.required],
  });

  constructor() {}

  ngOnInit(): void {
    this.maxDate = new Date();
    this.getPaises();
    this.clienteForm
      .get('contato')!
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value: string | null) => {
        const CEL = '(00) 0 0000-0000';
        const TEL = '(00) 0000-00009';
        if (value?.length) this.CEL_TEL = value.length === 11 ? CEL : TEL;
      });
    this.clienteForm
      .get('pais')!
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        filter((pais) => !!pais)
      )
      .subscribe(() => {
        this.getEstados();
        this.validarCpf();
      });
    this.loading = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['displayModal']) {
      this.visible = changes['displayModal'].currentValue;
    }

    if (changes['idCliente']) {
      const id = changes['idCliente'].currentValue;
      if (id) {
        this.obterCliente(id);
      } else {
        this.clienteForm.reset();
      }
    }
  }

  obterCliente(id: number): void {
    this.clienteService
      .obterClientePorId(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const cliente: ClienteResponse = {
            id: this.idCliente ?? 0,
            nome: response.nome ?? '',
            email: response.email ?? '',
            cpf: response.cpf ?? '',
            dataNascimento: response.dataNascimento ?? new Date(),
            contato: response.contato ?? '',
            pais: response.pais ?? ({} as LocalidadePaisesResponse),
            estado: response.estado ?? ({} as LocalidadeEstadosResponse),
          };
          this.clienteForm.patchValue(cliente);
          this.clienteForm.markAllAsTouched();
          this.clienteForm.updateValueAndValidity();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail:
              'Falha ao buscar os dados do cliente. Por favor, tente novamente mais tarde.',
            life: 3000,
          });
        },
      });
  }

  getPaises(): void {
    this.paisesData$ = this.localidadeService.getPaises().pipe(
      map((data) => data ?? []),
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail:
            'Falha ao buscar os paises. Por favor, tente novamente mais tarde.',
          life: 3000,
        });
        return of([]);
      })
    );
  }

  getEstados(): void {
    const paisSelecionado = this.clienteForm.get('pais')?.value?.iso2 ?? '';
    if (paisSelecionado.length) {
      this.estadosData$ = this.localidadeService
        .getEstados(paisSelecionado)
        .pipe(
          map((data) => {
            return data ?? [];
          }),
          catchError((err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail:
                'Falha ao buscar os estados. Por favor, tente novamente mais tarde.',
              life: 3000,
            });
            return of([]);
          })
        );
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
    const pais = this.clienteForm.get('pais')?.value?.iso2 ?? '';
    const cpfControl = this.clienteForm.get('cpf');

    if (!cpfControl || !pais?.length) return;

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

  onSubmitClienteForm(): void {
    const formValue = this.clienteForm.value;
    const cliente: ClienteResponse = {
      id: this.idCliente ?? 0,
      nome: formValue.nome ?? '',
      email: formValue.email ?? '',
      cpf: formValue.cpf ?? '',
      dataNascimento: formValue.dataNascimento ?? new Date(),
      contato: formValue.contato ?? '',
      pais: formValue.pais ?? ({} as LocalidadePaisesResponse),
      estado: formValue.estado ?? ({} as LocalidadeEstadosResponse),
    };
    this.clienteService.salvarCliente(cliente);
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Cliente salvo com sucesso!',
      life: 3000,
    });
    this.closeModal();
  }

  closeModal(): void {
    this.visible = false;
    this.displayModalChange.emit(this.visible);
    this.idClienteChange.emit(undefined);
    this.clienteForm.reset();
  }

  //Lifecycle
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

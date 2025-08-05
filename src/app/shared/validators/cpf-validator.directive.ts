import { Directive } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';

@Directive({
  selector: '[cpfValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: CpfValidatorDirective,
      multi: true,
    },
  ],
  standalone: true,
})
export class CpfValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    const cpf = control.value?.replace(/\D/g, '');
    if (cpf.length) {
      let soma = 0;
      for (let i = 0; i < 9; i++) soma += +cpf[i] * (10 - i);
      let dig1 = 11 - (soma % 11);
      if (dig1 >= 10) dig1 = 0;
      if (dig1 !== +cpf[9]) return { cpfInvalido: true };

      soma = 0;
      for (let i = 0; i < 10; i++) soma += +cpf[i] * (11 - i);
      let dig2 = 11 - (soma % 11);
      if (dig2 >= 10) dig2 = 0;
      if (dig2 !== +cpf[10]) return { cpfInvalido: true };
    }

    return null;
  }
}

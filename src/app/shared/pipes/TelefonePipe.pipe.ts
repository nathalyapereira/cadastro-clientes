import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'telefone',
  standalone: true,
})
export class TelefonePipe implements PipeTransform {
  transform(value: string | number | null): string {
    if (!value) {
      return '';
    }
    const telefone = String(value).replace(/\D/g, '');

    if (telefone.length < 10 || telefone.length > 11) {
      return value.toString();
    }

    const ddd = telefone.substring(0, 2);
    const numero = telefone.substring(2);
    if (numero.length === 9) {
      return `(${ddd}) ${numero.substring(0, 1)} ${numero.substring(
        1,
        5
      )}-${numero.substring(5)}`;
    } else {
      return `(${ddd}) ${numero.substring(0, 4)}-${numero.substring(4)}`;
    }
  }
}

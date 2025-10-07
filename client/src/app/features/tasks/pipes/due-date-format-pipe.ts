import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dueDateFormat'
})
export class DueDateFormatPipe implements PipeTransform {
  transform(value: string | null): string {
    if (value == null) {
      return "";
    }

    const now = new Date();
    const due = new Date(value);

    if (now > due) {
      return `Task was due ${due.toLocaleDateString()}`;
    }

    return `Task is due ${due.toLocaleDateString()}`;
  }
}

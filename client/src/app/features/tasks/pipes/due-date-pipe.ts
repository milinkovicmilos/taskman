import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dueDate'
})
export class DueDatePipe implements PipeTransform {
  transform(value: string, dueDate: string): string {
    const now = new Date();
    const date = new Date(dueDate);
    if (now > date) {
      const behindMs = now.getTime() - date.getTime();
      const behindDays = Math.floor(behindMs / (1000 * 60 * 60 * 24));

      if (behindDays === 0) {
        return `Task is due today (${date.toLocaleDateString()})`;
      }

      return `Behind ${behindDays} days. Task was due: ${date.toLocaleDateString()}`;
    }
    return `Task is due: ${date.toLocaleDateString()}`;
  }
}

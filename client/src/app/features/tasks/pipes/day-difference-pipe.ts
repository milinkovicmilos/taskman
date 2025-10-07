import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dayDifference'
})
export class DayDifferencePipe implements PipeTransform {
  transform(value: string, dueDate: string): string {
    const completed = new Date(value);
    const due = new Date(dueDate);

    const behindMs = completed.getTime() - due.getTime();
    const behindDays = Math.floor(behindMs / (1000 * 60 * 60 * 24));

    if (behindDays === 0) {
      return `Task completed on due date (${due.toLocaleDateString()})`;
    }

    if (behindDays > 0) {
      return `Task was completed ${behindDays} days late on ${completed.toLocaleDateString()}`;
    }

    return `Task was completed in time ${Math.abs(behindDays)} days earlier on ${completed.toLocaleDateString()}`;
  }
}

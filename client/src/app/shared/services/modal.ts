import { Injectable, signal, WritableSignal } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Modal {
  text: WritableSignal<string> = signal('');
  state: WritableSignal<boolean> = signal(false);
  confirmed: Subject<boolean> = new Subject<boolean>();

  private changeState(): void {
    this.state.set(!this.state());
  }

  generate(text: string) {
    this.text.set(text);
    this.state.set(true);
  }

  onConfirm(): Observable<boolean> {
    return this.confirmed.asObservable();
  }

  confirm(): void {
    this.confirmed.next(true);
    this.changeState();
  }

  cancel(): void {
    this.confirmed.next(false);
    this.changeState();
  }
}

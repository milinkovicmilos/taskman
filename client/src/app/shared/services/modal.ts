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
    const newOverflowState = document.body.style.overflow === 'hidden' ? 'scroll' : 'hidden';
    document.body.style.overflow = newOverflowState;
  }

  generate(text: string) {
    this.text.set(text);
    this.state.set(true);
    document.body.style.overflow = 'hidden';
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

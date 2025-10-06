import { EventEmitter, Injectable, Output, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Modal {
  text: WritableSignal<string> = signal('');
  state: WritableSignal<boolean> = signal(false);

  changeState(): void {
    this.state.set(!this.state());
    const newOverflowState = document.body.style.overflow === 'hidden' ? 'scroll' : 'hidden';
    document.body.style.overflow = newOverflowState;
  }

  generate(text: string) {
    this.text.set(text);
    this.state.set(true);
    document.body.style.overflow = 'hidden';
  }
}

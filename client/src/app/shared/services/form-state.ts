import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormState {
  visible: WritableSignal<number | null> = signal(null);

  changeState(state: number | null): void {
    if (this.visible() === state) {
      this.visible.set(null);
      return;
    }
    this.visible.set(state);
  }
}

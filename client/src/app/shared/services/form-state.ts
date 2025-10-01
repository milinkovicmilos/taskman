import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormState {
  visible: WritableSignal<boolean> = signal(false);

  changeState(): void {
    this.visible.set(!this.visible());
  }
}

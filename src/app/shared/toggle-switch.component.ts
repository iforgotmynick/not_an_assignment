import { Component, Input, computed, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toggle-switch',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toggle-switch.component.html',
  styleUrls: ['./toggle-switch.component.scss'],
})
export class ToggleSwitchComponent<T> {
  @Input({ required: true }) model!: WritableSignal<T>;
  @Input({ required: true }) options!: [T, T];

  isRight = computed(() => this.model() === this.options[1]);

  toggle(): void {
    const next = this.model() === this.options[0] ? this.options[1] : this.options[0];
    this.model.set(next);
  }
}

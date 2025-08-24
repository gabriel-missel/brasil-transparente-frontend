import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, input, InputSignal, output, computed, signal, inject } from '@angular/core';
import { DataService } from '../../services/data/data.service';

@Component({
  selector: 'app-toggle-bar-item',
  templateUrl: './toggle-bar-item.component.html',
  styleUrls: ['./toggle-bar-item.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ToggleBarItemComponent {
  private readonly dataService: DataService = inject(DataService);

  name: InputSignal<string> = input.required<string>();
  level: InputSignal<number> = input(0);
  isExpanded: InputSignal<boolean> = input(false);
  totalValueSpent: InputSignal<number> = input.required<number>();
  percentageOfTotal: InputSignal<number> = input.required<number>();
  barColor: InputSignal<string> = input('#3db6f2');
  isLastLevel: InputSignal<boolean> = input(false);
  showRawTotal = signal(false);

  toggle = output<void>();

  onToggle(): void {
    if (!this.isLastLevel()) {
      this.toggle.emit();
    }
  }

  formatLargeCurrency(value: number): string {
    return this.dataService.formatLargeCurrency(value);
  }

  formatCurrency(value: number): string {
    return this.dataService.formatCurrency(value);
  }
}
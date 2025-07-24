import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'deactivate-btn',
  imports: [TooltipModule],
  templateUrl: './deactivate-btn.html',
  styleUrl: './deactivate-btn.scss'
})
export class DeactivateBtn {

  @Input() disabled: boolean = false;
  @Output() onClick: EventEmitter<void> = new EventEmitter<void>();
  onDeactivateClick = () => this.onClick.emit();
  
}

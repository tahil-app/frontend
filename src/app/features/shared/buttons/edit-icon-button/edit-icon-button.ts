import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'edit-icon-button',
  imports: [TooltipModule],
  templateUrl: './edit-icon-button.html',
  styleUrl: './edit-icon-button.scss'
})
export class EditIconButton {

  @Input() disabled: boolean = false;
  @Output() onClick: EventEmitter<void> = new EventEmitter<void>();
  onEditClick = () => this.onClick.emit();
  
}

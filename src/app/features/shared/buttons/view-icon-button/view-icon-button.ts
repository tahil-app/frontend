import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'view-icon-button',
  imports: [TooltipModule],
  templateUrl: './view-icon-button.html',
  styleUrl: './view-icon-button.scss'
})
export class ViewIconButton {

  @Input() disabled: boolean = false;
  @Output() onClick: EventEmitter<void> = new EventEmitter<void>();
  onViewClick = () => this.onClick.emit();

}

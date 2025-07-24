import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'save-btn',
  templateUrl: './save-btn.html',
  styleUrl: './save-btn.scss'
})
export class SaveBtn {

  @Input() disabled: boolean = false;
  @Output() onClick: EventEmitter<void> = new EventEmitter<void>();
  onSaveClick = () => this.onClick.emit();
}

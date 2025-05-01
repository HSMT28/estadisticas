import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent implements OnChanges {
  @Input() showModal: boolean = false;
  @Output() closedModal = new EventEmitter<any>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['showModal']) {
      const current = changes['showModal'].currentValue;
      this.showModal = current;
    }
  }

  closeModal() {
    this.closedModal.emit();
  }
}

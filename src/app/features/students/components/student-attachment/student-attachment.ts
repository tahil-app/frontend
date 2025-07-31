import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { DeleteIconButton } from '../../../shared/buttons/delete-icon-button/delete-icon-button';
import { DownloadIconButton } from '../../../shared/buttons/download-icon-button/download-icon-button';
import { ViewIconButton } from '../../../shared/buttons/view-icon-button/view-icon-button';
import { DeleteConfirmation } from '../../../shared/components/delete-confirmation/delete-confirmation';
import { Student } from '../../../../core/models/student.model';
import { Attachment } from '../../../../core/models/attachment.model';
import { StudentService } from '../../../../core/services/student.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { ToastService } from '../../../shared/services/toast.service';
import { AttachmentHelper } from '../../../../core/helpers/attachmet-helper';
import { DateHelper } from '../../../../core/helpers/date.helper';

@Component({
  selector: 'app-student-attachment',
  imports: [CommonModule, DeleteIconButton, DownloadIconButton, ViewIconButton, DeleteConfirmation],
  templateUrl: './student-attachment.html',
  styleUrl: './student-attachment.scss'
})
export class StudentAttachmentComponent {

  @Input() student!: Student;

  deleteAttachment!: Attachment;
  showDelete: boolean = false;
  deleteMessage: string = 'هل أنت متأكد من حذف هذا المرفق؟';

  //#region Services
  private studentService = inject(StudentService);
  private loaderService = inject(LoaderService);
  private toastr = inject(ToastService);
  //#endregion


  onDownloadAttachment(attachment: Attachment): void {
    const url = this.studentService.getDownloadAttachment(attachment.fileName);
  
    window.open(url, '_blank');
  }  

  onViewAttachment(attachment: Attachment) {
    let url = this.studentService.getViewAttachmentUrl(attachment.fileName);
    window.open(url, '_blank');
  }

  getAttachmentIcon(attachment: Attachment) {
    return AttachmentHelper.getIcon(attachment.fileName);
  }

  onDeleteAttachment(attachment: Attachment) {
    this.deleteAttachment = attachment;
    this.deleteMessage = `هل أنت متأكد من حذف هذا المرفق <b>${attachment.displayName}</b> ؟`;
    this.showDelete = true;
  }

  onDeleteConfirm() {
    this.loaderService.show();
    this.studentService.deleteAttachment(this.deleteAttachment.id).subscribe(res => {
      if (res) {
        this.showDelete = false;
        this.student.attachments = this.student.attachments.filter(a => a.id !== this.deleteAttachment.id);
        this.toastr.showSuccess('تم حذف المرفق بنجاح');
      }
    },_ => {},
    () => this.loaderService.hide());
  }

  onDeleteCancel() {
    this.showDelete = false;
  }

  displayDate(date: string) {
    return DateHelper.toDate(date);
  }

}

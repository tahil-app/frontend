import { Component, inject, Input } from '@angular/core';
import { Teacher } from '../../../../core/models/teacher.model';
import { CommonModule } from '@angular/common';
import { ViewIconButton } from '../../../shared/buttons/view-icon-button/view-icon-button';
import { DownloadIconButton } from '../../../shared/buttons/download-icon-button/download-icon-button';
import { DeleteIconButton } from '../../../shared/buttons/delete-icon-button/delete-icon-button';
import { Attachment } from '../../../../core/models/attachment.model';
import { TeacherService } from '../../../../core/services/teacher.service';
import { AttachmentHelper } from '../../../../core/helpers/attachmet-helper';
import { DataHelper } from '../../../../core/helpers/data.helper';
import { DeleteConfirmation } from '../../../shared/components/delete-confirmation/delete-confirmation';
import { LoaderService } from '../../../shared/services/loader.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-teacher-attachment',
  imports: [CommonModule, DeleteIconButton, DownloadIconButton, ViewIconButton, DeleteConfirmation],
  templateUrl: './teacher-attachment.html',
  styleUrl: './teacher-attachment.scss'
})
export class TeacherAttachmentComponent {

  @Input() teacher!: Teacher;

  deleteAttachment!: Attachment;
  showDelete: boolean = false;
  deleteMessage: string = 'هل أنت متأكد من حذف هذا المرفق؟';

  //#region Services
  private teacherService = inject(TeacherService);
  private loaderService = inject(LoaderService);
  private toastr = inject(ToastService);
  //#endregion


  onDownloadAttachment(attachment: Attachment): void {
    const url = this.teacherService.getDownloadAttachment(attachment.fileName);
  
    window.open(url, '_blank');
  }  

  onViewAttachment(attachment: Attachment) {
    let url = this.teacherService.getViewAttachmentUrl(attachment.fileName);
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
    this.teacherService.deleteAttachment(this.deleteAttachment.id).subscribe(res => {
      if (res) {
        this.showDelete = false;
        this.teacher.attachments = this.teacher.attachments.filter(a => a.id !== this.deleteAttachment.id);
        this.toastr.showSuccess('تم حذف المرفق بنجاح');
      }
    },_ => {},
    () => this.loaderService.hide());
  }

  onDeleteCancel() {
    this.showDelete = false;
  }

  displayDate(date: string) {
    return DataHelper.toDate(date);
  }

}

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

@Component({
  selector: 'app-teacher-attachment',
  imports: [CommonModule, DeleteIconButton, DownloadIconButton, ViewIconButton],
  templateUrl: './teacher-attachment.html',
  styleUrl: './teacher-attachment.scss'
})
export class TeacherAttachmentComponent {

  @Input() teacher!: Teacher;

  //#region Services
  private teacherService = inject(TeacherService);
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

  onDeleteAttachment(attachmentId: number) {
    // console.log(attachment);
  }

  displayDate(date: string) {
    return DataHelper.toDate(date);
  }

}

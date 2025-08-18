import { Component, inject, ViewChild } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { ProgressBarModule } from 'primeng/progressbar';
import { BadgeModule } from 'primeng/badge';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { PdfExportService } from '../../../shared/services/pdf-export.service';
import { DailySchedulePdfTemplateComponent } from '../../../shared/components/daily-schedule-pdf-template/daily-schedule-pdf-template';
import { DailySchedule } from '../../../../core/models/daily-schedule.model';

@Component({
  selector: 'app-student-data',
  imports: [
    TabsModule, 
    TooltipModule, 
    CommonModule, 
    TableModule, 
    ChartModule, 
    ProgressBarModule, 
    BadgeModule, 
    TranslateModule,
    ButtonModule,
    CardModule,
    DividerModule,
    RatingModule,
    FormsModule,
    DailySchedulePdfTemplateComponent
  ],
  templateUrl: './student-data.html',
  styleUrl: './student-data.scss'
})
export class StudentData {
  @ViewChild(DailySchedulePdfTemplateComponent, { static: false }) pdfTemplate!: DailySchedulePdfTemplateComponent;
  
  private pdfExportService: PdfExportService = inject(PdfExportService);

  // Sample student data
  student = {
    id: 1,
    name: 'Ahmed Mohamed Ali',
    email: 'ahmed.mohamed@example.com',
    phoneNumber: '+20 123 456 7890',
    birthDate: '2005-03-15',
    age: 18,
    gender: 'Male',
    joinedDate: '2023-09-01',
    imagePath: 'assets/icons/avatar-student.svg',
    address: 'Cairo, Egypt',
    parentName: 'Mohamed Ali Hassan',
    parentPhone: '+20 987 654 3210',
    emergencyContact: '+20 111 222 3333',
    bloodType: 'O+',
    medicalConditions: 'None',
    allergies: 'None',
    currentGrade: '12th Grade',
    gpa: 3.8,
    totalCredits: 120,
    attendanceRate: 95.5,
    status: 'Active'
  };

  // Sample daily schedules data for PDF export
  dailySchedules: DailySchedule[] = [
    {
      dayName: 'Sunday',
      day: 0,
      startTime: '08:00',
      endTime: '09:30',
      courseName: 'Mathematics',
      teacherName: 'Dr. Sarah Johnson',
      roomName: 'Room 101',
      groupName: 'Group A'
    },
    {
      dayName: 'Sunday',
      day: 0,
      startTime: '10:00',
      endTime: '11:30',
      courseName: 'Physics',
      teacherName: 'Prof. Michael Brown',
      roomName: 'Lab 205',
      groupName: 'Group A'
    },
    {
      dayName: 'Monday',
      day: 1,
      startTime: '08:00',
      endTime: '09:30',
      courseName: 'Chemistry',
      teacherName: 'Dr. Robert Wilson',
      roomName: 'Lab 201',
      groupName: 'Group A'
    },
    {
      dayName: 'Monday',
      day: 1,
      startTime: '10:00',
      endTime: '11:30',
      courseName: 'History',
      teacherName: 'Prof. Lisa Anderson',
      roomName: 'Room 105',
      groupName: 'Group A'
    },
    {
      dayName: 'Tuesday',
      day: 2,
      startTime: '08:00',
      endTime: '09:30',
      courseName: 'English Literature',
      teacherName: 'Ms. Emily Davis',
      roomName: 'Room 103',
      groupName: 'Group A'
    },
    {
      dayName: 'Wednesday',
      day: 3,
      startTime: '08:00',
      endTime: '09:30',
      courseName: 'Computer Science',
      teacherName: 'Mr. David Chen',
      roomName: 'Computer Lab',
      groupName: 'Group A'
    }
  ];

  // Sample schedules data
  schedules = [
    {
      id: 1,
      day: 'Monday',
      time: '08:00 - 09:30',
      subject: 'Mathematics',
      teacher: 'Dr. Sarah Johnson',
      room: 'Room 101',
      type: 'Lecture'
    },
    {
      id: 2,
      day: 'Monday',
      time: '10:00 - 11:30',
      subject: 'Physics',
      teacher: 'Prof. Michael Brown',
      room: 'Lab 205',
      type: 'Lab'
    },
    {
      id: 3,
      day: 'Tuesday',
      time: '08:00 - 09:30',
      subject: 'English Literature',
      teacher: 'Ms. Emily Davis',
      room: 'Room 103',
      type: 'Discussion'
    },
    {
      id: 4,
      day: 'Wednesday',
      time: '08:00 - 09:30',
      subject: 'Chemistry',
      teacher: 'Dr. Robert Wilson',
      room: 'Lab 201',
      type: 'Lab'
    },
    {
      id: 5,
      day: 'Thursday',
      time: '08:00 - 09:30',
      subject: 'History',
      teacher: 'Prof. Lisa Anderson',
      room: 'Room 105',
      type: 'Lecture'
    },
    {
      id: 6,
      day: 'Friday',
      time: '08:00 - 09:30',
      subject: 'Computer Science',
      teacher: 'Mr. David Chen',
      room: 'Computer Lab',
      type: 'Practical'
    }
  ];

  // Sample academic performance data
  academicPerformance = {
    subjects: [
      { name: 'Mathematics', grade: 'A+', score: 95, credits: 4 },
      { name: 'Physics', grade: 'A', score: 88, credits: 4 },
      { name: 'English Literature', grade: 'A-', score: 87, credits: 3 },
      { name: 'Chemistry', grade: 'B+', score: 85, credits: 4 },
      { name: 'History', grade: 'A', score: 90, credits: 3 },
      { name: 'Computer Science', grade: 'A+', score: 96, credits: 4 }
    ],
    semesterGPA: 3.85,
    cumulativeGPA: 3.78,
    totalCredits: 22,
    rank: 5,
    totalStudents: 150
  };

  // Sample attendance data
  attendanceData = {
    totalSessions: 180,
    attendedSessions: 172,
    absentSessions: 8,
    attendanceRate: 95.5,
    monthlyData: [
      { month: 'September', rate: 96.2 },
      { month: 'October', rate: 94.8 },
      { month: 'November', rate: 95.1 },
      { month: 'December', rate: 96.5 },
      { month: 'January', rate: 94.2 },
      { month: 'February', rate: 95.8 }
    ]
  };

  // Sample quiz results
  quizResults = [
    {
      id: 1,
      subject: 'Mathematics',
      quizName: 'Algebra Quiz 1',
      date: '2024-01-15',
      score: 95,
      totalQuestions: 20,
      correctAnswers: 19,
      timeTaken: '25 minutes',
      status: 'Completed'
    },
    {
      id: 2,
      subject: 'Physics',
      quizName: 'Mechanics Quiz',
      date: '2024-01-20',
      score: 88,
      totalQuestions: 15,
      correctAnswers: 13,
      timeTaken: '30 minutes',
      status: 'Completed'
    },
    {
      id: 3,
      subject: 'English Literature',
      quizName: 'Shakespeare Quiz',
      date: '2024-01-25',
      score: 92,
      totalQuestions: 25,
      correctAnswers: 23,
      timeTaken: '35 minutes',
      status: 'Completed'
    },
    {
      id: 4,
      subject: 'Chemistry',
      quizName: 'Organic Chemistry Quiz',
      date: '2024-02-01',
      score: 85,
      totalQuestions: 18,
      correctAnswers: 15,
      timeTaken: '28 minutes',
      status: 'Completed'
    },
    {
      id: 5,
      subject: 'Computer Science',
      quizName: 'Programming Quiz',
      date: '2024-02-05',
      score: 96,
      totalQuestions: 22,
      correctAnswers: 21,
      timeTaken: '40 minutes',
      status: 'Completed'
    }
  ];

  // Sample feedback data
  feedbackData = [
    {
      id: 1,
      subject: 'Mathematics',
      teacher: 'Dr. Sarah Johnson',
      date: '2024-01-30',
      rating: 5,
      comment: 'Excellent problem-solving skills and mathematical reasoning. Shows great potential in advanced topics.',
      areas: ['Problem Solving', 'Critical Thinking', 'Mathematical Logic'],
      recommendations: ['Consider advanced calculus', 'Join math competition team']
    },
    {
      id: 2,
      subject: 'Physics',
      teacher: 'Prof. Michael Brown',
      date: '2024-01-25',
      rating: 4,
      comment: 'Good understanding of fundamental concepts. Needs improvement in experimental procedures.',
      areas: ['Theoretical Knowledge', 'Conceptual Understanding'],
      recommendations: ['Practice more lab work', 'Review experimental methods']
    },
    {
      id: 3,
      subject: 'English Literature',
      teacher: 'Ms. Emily Davis',
      date: '2024-01-20',
      rating: 5,
      comment: 'Outstanding analytical skills and creative writing abilities. Excellent class participation.',
      areas: ['Literary Analysis', 'Creative Writing', 'Class Participation'],
      recommendations: ['Submit work to school magazine', 'Consider literature club leadership']
    }
  ];

  // Sample upcoming events
  upcomingEvents = [
    {
      id: 1,
      title: 'Final Mathematics Exam',
      date: '2024-03-15',
      time: '09:00 AM',
      type: 'Exam',
      subject: 'Mathematics',
      location: 'Room 101'
    },
    {
      id: 2,
      title: 'Science Fair Project Submission',
      date: '2024-03-20',
      time: '02:00 PM',
      type: 'Project',
      subject: 'Physics',
      location: 'Science Lab'
    },
    {
      id: 3,
      title: 'Parent-Teacher Conference',
      date: '2024-03-25',
      time: '04:00 PM',
      type: 'Meeting',
      subject: 'General',
      location: 'Conference Room'
    },
    {
      id: 4,
      title: 'School Sports Day',
      date: '2024-04-01',
      time: '08:00 AM',
      type: 'Event',
      subject: 'Physical Education',
      location: 'School Grounds'
    }
  ];

  // Sample student attachments
  studentAttachments = [
    {
      id: 1,
      name: 'Student ID Card',
      description: 'Official student identification card',
      type: 'image',
      size: '2.5 MB',
      uploadDate: '2024-01-10',
      url: '#'
    },
    {
      id: 2,
      name: 'Medical Certificate',
      description: 'Health examination certificate',
      type: 'pdf',
      size: '1.8 MB',
      uploadDate: '2024-01-08',
      url: '#'
    },
    {
      id: 3,
      name: 'Academic Transcript',
      description: 'Previous semester transcript',
      type: 'pdf',
      size: '3.2 MB',
      uploadDate: '2024-01-05',
      url: '#'
    },
    {
      id: 4,
      name: 'Parent Consent Form',
      description: 'Signed parental consent for activities',
      type: 'pdf',
      size: '0.8 MB',
      uploadDate: '2024-01-03',
      url: '#'
    },
    {
      id: 5,
      name: 'Profile Photo',
      description: 'Student profile picture',
      type: 'image',
      size: '1.2 MB',
      uploadDate: '2024-01-01',
      url: '#'
    },
    {
      id: 6,
      name: 'Emergency Contact Form',
      description: 'Emergency contact information',
      type: 'pdf',
      size: '0.5 MB',
      uploadDate: '2023-12-28',
      url: '#'
    }
  ];

  // Sample extracurricular activities
  extracurricularActivities = [
    {
      id: 1,
      name: 'Math Club',
      role: 'Member',
      description: 'Participating in mathematical competitions and problem-solving sessions',
      hours: 20,
      achievements: ['Regional Math Competition - 2nd Place', 'School Math Olympiad - 1st Place']
    },
    {
      id: 2,
      name: 'Science Club',
      role: 'Vice President',
      description: 'Leading science experiments and organizing science fairs',
      hours: 35,
      achievements: ['Science Fair Project - Best Innovation Award', 'Science Quiz Competition - 1st Place']
    },
    {
      id: 3,
      name: 'Debate Team',
      role: 'Member',
      description: 'Participating in inter-school debate competitions',
      hours: 15,
      achievements: ['Inter-School Debate - Best Speaker Award']
    }
  ];

  // Sample financial information
  financialInfo = {
    tuitionFee: 5000,
    paidAmount: 4500,
    remainingAmount: 500,
    paymentHistory: [
      { date: '2024-01-15', amount: 1500, method: 'Bank Transfer', status: 'Paid' },
      { date: '2024-02-15', amount: 1500, method: 'Credit Card', status: 'Paid' },
      { date: '2024-03-15', amount: 1500, method: 'Cash', status: 'Paid' },
      { date: '2024-04-15', amount: 500, method: 'Pending', status: 'Pending' }
    ],
    scholarships: [
      { name: 'Academic Excellence Scholarship', amount: 1000, year: '2024' },
      { name: 'Merit Scholarship', amount: 500, year: '2024' }
    ]
  };

  // Chart data for academic performance
  chartData = {
    labels: ['Mathematics', 'Physics', 'English', 'Chemistry', 'History', 'Computer Science'],
    datasets: [
      {
        label: 'Current Scores',
        data: [95, 88, 87, 85, 90, 96],
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(255, 205, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 2
      }
    ]
  };

  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  // Attendance chart data
  attendanceChartData = {
    labels: ['September', 'October', 'November', 'December', 'January', 'February'],
    datasets: [
      {
        label: 'Attendance Rate (%)',
        data: [96.2, 94.8, 95.1, 96.5, 94.2, 95.8],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  attendanceChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  // GPA trend chart data
  gpaTrendData = {
    labels: ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Current'],
    datasets: [
      {
        label: 'GPA Trend',
        data: [3.2, 3.4, 3.6, 3.7, 3.75, 3.85],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  gpaTrendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 4.0
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  // Methods
  getGradeColor(grade: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'success';
      case 'A-':
      case 'B+':
        return 'info';
      case 'B':
      case 'B-':
        return 'warn';
      default:
        return 'danger';
    }
  }

  getStatusColor(status: string): 'success' | 'danger' | 'warning' | 'secondary' {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Inactive':
        return 'danger';
      case 'Pending':
        return 'warning';
      default:
        return 'secondary';
    }
  }

  getEventTypeColor(type: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch (type) {
      case 'Exam':
        return 'danger';
      case 'Project':
        return 'warn';
      case 'Meeting':
        return 'info';
      case 'Event':
        return 'success';
      default:
        return 'secondary';
    }
  }

  calculateAverageScore(): number {
    const total = this.academicPerformance.subjects.reduce((sum, subject) => sum + subject.score, 0);
    return Math.round(total / this.academicPerformance.subjects.length);
  }

  getAttendanceStatus(): string {
    if (this.attendanceData.attendanceRate >= 95) return 'Excellent';
    if (this.attendanceData.attendanceRate >= 90) return 'Good';
    if (this.attendanceData.attendanceRate >= 85) return 'Fair';
    return 'Needs Improvement';
  }

  getAttendanceStatusColor(): 'success' | 'danger' | 'warning' | 'info' {
    if (this.attendanceData.attendanceRate >= 95) return 'success';
    if (this.attendanceData.attendanceRate >= 90) return 'info';
    if (this.attendanceData.attendanceRate >= 85) return 'warning';
    return 'danger';
  }

  // Attachment methods
  getFileIcon(type: string): string {
    switch (type.toLowerCase()) {
      case 'pdf':
        return 'fas fa-file-pdf';
      case 'image':
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'fas fa-file-image';
      case 'doc':
      case 'docx':
        return 'fas fa-file-word';
      case 'xls':
      case 'xlsx':
        return 'fas fa-file-excel';
      case 'ppt':
      case 'pptx':
        return 'fas fa-file-powerpoint';
      case 'txt':
        return 'fas fa-file-alt';
      default:
        return 'fas fa-file';
    }
  }

  getFileIconColor(type: string): string {
    switch (type.toLowerCase()) {
      case 'pdf':
        return 'text-danger';
      case 'image':
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'text-success';
      case 'doc':
      case 'docx':
        return 'text-primary';
      case 'xls':
      case 'xlsx':
        return 'text-success';
      case 'ppt':
      case 'pptx':
        return 'text-warning';
      case 'txt':
        return 'text-secondary';
      default:
        return 'text-muted';
    }
  }

  downloadAttachment(attachment: any): void {
    console.log('Downloading attachment:', attachment.name);
    // In a real application, this would trigger a file download
    // For now, we'll just log the action
  }

  viewAttachment(attachment: any): void {
    console.log('Viewing attachment:', attachment.name);
    // In a real application, this would open the file in a viewer
    // For now, we'll just log the action
  }

  onProfileImageUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        console.error('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        console.error('File size should be less than 5MB');
        return;
      }

      // Create a preview URL
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.student.imagePath = e.target.result;
        console.log('Profile image uploaded:', file.name);
        // In a real application, you would upload the file to the server here
      };
      reader.readAsDataURL(file);
    }
  }

  getPaymentStatusColor(status: string): 'success' | 'danger' | 'warning' | 'secondary' {
    switch (status) {
      case 'Paid':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Overdue':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  calculatePaymentProgress(): number {
    return (this.financialInfo.paidAmount / this.financialInfo.tuitionFee) * 100;
  }

  getTotalScholarshipAmount(): number {
    return this.financialInfo.scholarships.reduce((sum, scholarship) => sum + scholarship.amount, 0);
  }

  getTotalExtracurricularHours(): number {
    return this.extracurricularActivities.reduce((sum, activity) => sum + activity.hours, 0);
  }

  getBestSubject(): string {
    const bestSubject = this.academicPerformance.subjects.reduce((best, current) => 
      current.score > best.score ? current : best
    );
    return bestSubject.name;
  }

  getNeedsImprovementSubject(): string {
    const worstSubject = this.academicPerformance.subjects.reduce((worst, current) => 
      current.score < worst.score ? current : worst
    );
    return worstSubject.name;
  }

  async exportDailyScheduleToPdf(): Promise<void> {
    try {
      if (this.pdfTemplate && this.pdfTemplate.pdfContent) {
        const filename = `${this.student.name}_Daily_Schedule_${new Date().toISOString().split('T')[0]}.pdf`;
        await this.pdfExportService.exportToPdf(
          this.pdfTemplate.pdfContent.nativeElement,
          filename,
          { orientation: 'portrait', format: 'a4' }
        );
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  }
}

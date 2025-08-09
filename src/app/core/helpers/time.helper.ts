export class TimeHelper {
  
    static toDate(timeString: string): Date | null {
    if (!timeString) return null;
    
    // Handle both HH:mm and HH:mm:ss formats
    const timeParts = timeString.split(':');
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    const seconds = timeParts[2] ? parseInt(timeParts[2], 10) : 0;
    
    if (isNaN(hours) || isNaN(minutes)) return null;
    
    const date = new Date();
    date.setHours(hours, minutes, seconds, 0);
    return date;
  }

  static toTime(date: Date | string): string {
    if (!date) return '';
    
    // If it's already a string, return as is
    if (typeof date === 'string') return date;
    
    // Convert Date to HH:mm:ss format for C# TimeOnly
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    return `${hours}:${minutes}:${seconds}`;
  }

}

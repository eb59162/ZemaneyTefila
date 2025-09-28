import { Component, OnInit } from '@angular/core';
import { TefilotService } from '../../services/tefilot.service';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TefilosTime } from '../../models/tefilos-time.model';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';
import { HalachicTime, HalachicTimeDictionary } from '../../models/types';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { HeaderComponent } from '../header/header.component';
import { RulesComponent } from '../rules/rules.component';
import { CalendarModule } from 'primeng/calendar';
import { HolidayTefilos } from '../../models/holiday-tefilos.model';
@Component({
  selector: 'app-prayers',
  templateUrl: './prayers.component.html',
  styleUrls: ['./prayers.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    HeaderComponent,
    RulesComponent,
    CalendarModule,
  ],
})
export class PrayersComponent {
  supportEmail: string = 'zmaneytfilot@gmail.com';
  designEmail: string = 'm0556704176@gmail.com';
  holidays: any[]=[];
  prayers: any[] = [];
  halachicTimes: HalachicTimeDictionary = {};
  sortedHalachicTimes: HalachicTime[] = [];
  userId: number = 0;
  selectedHolidays:HolidayTefilos[]=[];
  selectedHoliday:HolidayTefilos={
    id:0,
    hebrewDate:"",
    gregorianDate:new Date(),
    userId:0,
    tefilos:[]
  }
  selectedPrayers: TefilosTime[] = [];
  timeInput: string = '';
  isBeforeTime: boolean = false;
  displayTime = '';
  roundToNearFiveMinutes: boolean = false;
  timeTypes = [
    { value: 'dynamic', label: 'חישוב לפי זמני היום' },
    { value: 'fixed', label: 'שעה קבועה' },
  ];
  specialHalachicTimes: string[] = [
    'חצות היום',
    'מנחה גדולה',
    'מנחה קטנה',
    'פלג המנחה',
    'שקיעה',
    'צה״כ',
  ];
  dayTypes = [
    { value: 'friday', label: 'ערב שבת/חג' },
    { value: 'shabbat', label: 'שבת/חג' },
  ];
  isLoadingWord = false;
  isLoadingExcel = false;
  hasSaved: boolean = false;
  isAddSuccess: boolean = false;
  isExcelCreatedSuccess: boolean = false;
  showValidationErrors: boolean = false;
  //להצגת זמני תפילות שמורים
  tefilaId:number=0
userHolidays:HolidayTefilos[]=[]
  currentHolidaySelection:HolidayTefilos={
    id:0,
  gregorianDate:new Date(),
  hebrewDate: "",
  userId: 0,
  tefilos: []
  }
  //להוסיף את החג הנבחר בצורה שלא תדרוס את הנתונים הקודמים שבDB 
  currentSelection: TefilosTime = {
    id: 0,
    tefila: -1,
    halachicTimeId: undefined,
    personalCalculationTime: '00:00',
    isBeforeTime: false,
    finalCalculatedTime: new Date(), // Explicitly set to default
    userId: 0,
    isFixedTime: false,
    fixedTime: undefined,
    dayType: undefined,
    roundToNearFiveMinutes: false,
  };
  personalCalculationTime: number = 0;
  selectedTime: string = '';
  isSaveSuccess: boolean = false;
  areSaveSuccess:boolean=false
  isCreatedSuccess: boolean = false;
  showCustomInput: boolean = false;
  selectedPrayersDetails:any[]=[] ;
  //לבחירת זמני תפילה שמורה במערכת
 keepedTefilaTimes: TefilosTime = {
    id: 0,
    tefila: -1,
    halachicTimeId: undefined,
    personalCalculationTime: '00:00',
    isBeforeTime: false,
    finalCalculatedTime: new Date(), // Explicitly set to default
    userId: 0,
    isFixedTime: false,
    fixedTime: undefined,
    dayType: undefined,
    roundToNearFiveMinutes: false,
  };
  helpTexts = {
    selectPrayer: 'בחר את התפילה שברצונך להגדיר',
    selectTime: 'בחר את הזמן ההלכתי הרצוי',
    personalTime: 'הגדר זמן חישוב  (אופציונלי)',
    beforeAfter: 'האם התפילה תתקיים לפני או אחרי הזמן שנבחר?',
  };

  tooltips = {
    prayerSelect: 'בחר מהרשימה את התפילה שברצונך לקבוע לה זמן',
    timeSelect: 'בחר את הזמן ההלכתי שישמש כבסיס לחישוב',
    personalTime: 'הוסף זמן בדקות לפני/אחרי הזמן ההלכתי',
    saveButton: 'שמור את ההגדרות שבחרת',
  };

  constructor(
    private tefilotService: TefilotService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userId = this.authService.getCurrentUserId();
    this.currentHolidaySelection.userId=this.userId;
    this.currentSelection.userId = this.userId;
    this.LoadChagimDates();
    this.loadPrayers();
    this.loadHalachicTimes();
    this.loadUserPrayers();
    this.hasSaved = false;
  }
private LoadChagimDates(){
   this.tefilotService.getChagimDates().subscribe({
      next: (data) => {
        this.holidays = data;   
      },
      error: (error) => console.error('Error loading chagim:', error),
    });
}
  private loadPrayers() {
    this.tefilotService.getPrayers().subscribe({
      next: (data) => {
        this.prayers = data;  
      },
      error: (error) => console.error('Error loading holidays prayers:', error),
    });
  }

  private loadHalachicTimes() {
    this.tefilotService.getHalachicTimes().subscribe({
      next: (data) => {
        this.halachicTimes = data;
        // Create a sorted array of halachic times for display purposes
        this.sortedHalachicTimes = Object.values(data).sort(
          (a, b) => a.order - b.order
        );
      },
      error: (error) => console.error('Error loading halachic times:', error),
    });
  }
  holidaysTefilos:any[]=[]
  openHolidayIndex: number | null = null; // אינדקס החג הפתוח
  toggleHoliday(index: number): void {
    this.openHolidayIndex = this.openHolidayIndex === index ? null : index;
  }
  private loadUserPrayers(): void {
        this.tefilotService.getTefilosTimesByUserId(this.userId).subscribe({
      next: (prayers) => {
        if (prayers.length > 0) this.holidaysTefilos = prayers;      },
      error: (error) => {
        console.error('Failed to load prayers:', error);
      },
    });
  }
onSelectedPrayerSelect(event:any){
  const keepedTefilaTimes = (event.target as HTMLSelectElement).value;
        const parts=keepedTefilaTimes.split(":");
        const id=Number(parts[1])
     const tefila=this.selectedPrayers.filter(s=>s.id===id)[0]
      this.currentSelection.isFixedTime=tefila.isFixedTime;
      this.currentSelection.halachicTimeId=tefila.halachicTimeId;
      this.currentSelection.personalCalculationTime=tefila.personalCalculationTime;
      this.currentSelection.dayType=tefila.dayType;
      this.currentSelection.isBeforeTime=tefila.isBeforeTime;
      this.currentSelection.customTefilaName=tefila.customTefilaName;
      this.currentSelection.finalCalculatedTime=tefila.finalCalculatedTime;
      this.currentSelection.fixedTime=tefila.fixedTime;
      this.currentSelection.roundToNearFiveMinutes=tefila.roundToNearFiveMinutes;
}
  onHolidaySelect(event: any) {
    const selectedValue = event.target.value;  
  }
  onPrayerSelect(event: any) {
    const selectedValue = event.target.value;
        const selectElement = (event.target as HTMLSelectElement).value;
        const parts=selectElement.split(":");
        this.tefilaId=Number (parts[1]);
        const id=Number(parts[0])
     this.selectedPrayersDetails=this.selectedPrayers.filter(s=>s.tefila===this.tefilaId)
    if (selectedValue === 'custom') {
      this.showCustomInput = true;
      this.currentSelection.tefila = -1;
    } else {
      this.showCustomInput = false;
      this.currentSelection.customTefilaName = undefined;
    }
  }
  formatTimeWithUnits(time: string): string {
    const [hours, minutes] = time.split(':');
    if (parseInt(hours) > 0) {
      return `${minutes} : ${hours} שעות`;
    }
    return `${minutes} דקות`;
  }

  isSelectionValid(): boolean {
    // Check prayer name (either from list or custom)
    const hasValidPrayer =
      this.currentSelection.tefila > -1 ||
      (!!this.currentSelection.customTefilaName &&
        this.currentSelection.customTefilaName.trim().length > 0);

    // Check time settings (either fixed or halachic)
    const hasValidTime = this.currentSelection.isFixedTime
      ? !!this.currentSelection.fixedTime
      : !!this.currentSelection.halachicTimeId;

    return hasValidPrayer && hasValidTime;
  }
  // Add this method to check if the selected halachic time requires day selection
  requiresDaySelection(): boolean {
    if (!this.currentSelection.halachicTimeId) return false;
    const selectedTime =this.halachicTimes[this.currentSelection.halachicTimeId];
    if (!selectedTime) return false;
    return this.specialHalachicTimes.includes(selectedTime.hebrewName);
  }

  // Add these methods
  getValidationErrors(): string[] {
    const errors: string[] = [];
  // Holiday name validation
    if (
      !this.currentHolidaySelection.hebrewDate
    ) {
      errors.push('יש לבחור חג מהרשימה או להזין שם חג  ');
    }
    // Prayer name validation
    if (
      this.currentSelection.tefila < 0 &&
      !this.currentSelection.customTefilaName
    ) {
      errors.push('יש לבחור תפילה מהרשימה או להזין שם תפילה  ');
    }

    // Time validation
    if (this.currentSelection.isFixedTime) {
      if (!this.currentSelection.fixedTime) {
        errors.push('יש להזין שעה קבועה');
      }
    } else {
      if (!this.currentSelection.halachicTimeId) {
        errors.push('יש לבחור זמן מזמני היום');
      }
      if (this.requiresDaySelection() && !this.currentSelection.dayType) {
        errors.push('/חגיש לבחור האם לחשב לפי זמני ערב שבת/חג או שבת');
      }
    }
    return errors;
  }
  getPrayerName(item: TefilosTime): string {
    if (item.customTefilaName) {
      return item.customTefilaName;
    }
    const prayer = this.prayers.find((p) => p.id === item.tefila);
    return prayer ? prayer.name : '';
  }
getPrayerId(item:any):number{
  const prayer = this.prayers.find((p) => p.name === item);
    return prayer ? prayer.id : -1;
}
  getHalachicTimeName(id: string): string {
    return this.halachicTimes[id]?.hebrewName || '';
  }

  formatTimeInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    // Get cursor position before we modify the value
    const cursorPosition = inputElement.selectionStart;

    // Get raw input without formatting
    let rawInput = inputElement.value.replace(/[^0-9]/g, '');

    // Store original length to calculate cursor adjustment
    const originalLength = inputElement.value.length;

    // Format the time based on number of digits
    let formattedInput = '';

    if (rawInput.length >= 4) {
      // Handle 4 or more digits (take first 4)
      const hours = rawInput.substring(0, 2);
      let minutes = rawInput.substring(2, 4);

      // Validate minutes
      if (parseInt(minutes) > 59) {
        minutes = '59';
      }

      formattedInput = `${hours}:${minutes}`;
    } else if (rawInput.length === 3) {
      // Handle 3 digits (e.g., 130 -> 01:30)
      const hour = rawInput.substring(0, 1);
      let minutes = rawInput.substring(1, 3);

      // Validate minutes
      if (parseInt(minutes) > 59) {
        minutes = '59';
      }

      formattedInput = `${hour}:${minutes}`;
    } else if (rawInput.length === 2) {
      // Just show the 2 digits (will be interpreted as hours)
      formattedInput = rawInput;
    } else if (rawInput.length === 1) {
      // Just show the 1 digit
      formattedInput = rawInput;
    } else {
      formattedInput = '';
    }
    // Update the display value
    this.displayTime = formattedInput;

    // Update the input value
    inputElement.value = formattedInput;

    // Adjust cursor position if a colon was added
    if (formattedInput.includes(':') && cursorPosition !== null) {
      // Calculate new cursor position
      const lengthDiff = formattedInput.length - originalLength;
      const newPosition = cursorPosition + lengthDiff;

      // Set cursor position after the update
      setTimeout(() => {
        inputElement.setSelectionRange(newPosition, newPosition);
      }, 0);
    }

    // Update the model value
    if (formattedInput.includes(':')) {
      this.currentSelection.personalCalculationTime = `${formattedInput}:00`;
    } else if (formattedInput.length > 0) {
      // If only hours entered, add zeros for minutes
      if (formattedInput.length <= 2) {
        this.currentSelection.personalCalculationTime = `00:${formattedInput}:00`;
      } else {
        this.currentSelection.personalCalculationTime = `00:${formattedInput}:00`;
      }
    } else {
      this.currentSelection.personalCalculationTime = '00:00:00';
    }
  }

  removeSelection(index: number): void {
    this.selectedPrayers.splice(index, 1);
    this.selectedHoliday.tefilos.splice(index,1) 
    this.hasSaved = false;
  }

  addSelection(): void {
    this.showValidationErrors = true;
    if (this.isSelectionValid()) {
      const selection = {
        ...this.currentSelection,
      };

      this.selectedPrayers.push(selection);
            const holidaySelection = {
        ...this.currentHolidaySelection,
    
      }

      holidaySelection.tefilos.push(selection)
      this.selectedHoliday=(holidaySelection);
      // Set success state and reset after delay
      this.isAddSuccess = true;
      
      setTimeout(() => {
        this.isAddSuccess = false;
        this.resetSelection();
       
        this.showValidationErrors = false; // Hide validation errors after successful add
      }, 2000);
      this.resetSelection();
      this.hasSaved = false;
    }
  }
  // הצגת כל החגים והתפילות שנבחרו
    showHolidays: boolean = false;
  toggleHolidays() {
    this.showHolidays = !this.showHolidays;
  }
  showSelectedHoliday = new Array(this.holidays.length).fill(false);
toggleTefilos(index: number) {
    this.showSelectedHoliday[index] = !this.showSelectedHoliday[index];
}
  addHolidaySelection(): void {
    this.showValidationErrors = true;
    if (this.isSelectionValid()) {
      const selection = {
        ...this.currentHolidaySelection,
      };
      // Set success state and reset after delay
      this.isAddSuccess = true;
      setTimeout(() => {
        this.isAddSuccess = false;
        this.resetSelection();
        this.showValidationErrors = false; // Hide validation errors after successful add
      }, 2000);
      this.resetSelection();
      this.hasSaved = false;
    }
  }
 resetHolidaySelection(): void {
    this.currentHolidaySelection = {
    id:0,
  gregorianDate:new Date(),
  hebrewDate: "",
  userId: this.authService.getCurrentUserId(),
  tefilos: this.selectedPrayers
    };
    this.displayTime = '';
    this.timeInput = '';
    this.showValidationErrors = false;
  }
  resetSelection(): void {
    this.currentSelection = {
      tefila: -1,
      halachicTimeId: undefined,
      personalCalculationTime: '00:00',
      isBeforeTime: false,
      finalCalculatedTime: new Date(), // Explicitly set to default
      userId: this.authService.getCurrentUserId(),
      isFixedTime: false,
      fixedTime: undefined,
      dayType: undefined,
      roundToNearFiveMinutes: false,
    };
    this.keepedTefilaTimes={
      id:0,
      tefila:-1,
      halachicTimeId:undefined,
      finalCalculatedTime:new Date(),
      isBeforeTime:false,
      userId:this.authService.getCurrentUserId(),
      customTefilaName:undefined,
      personalCalculationTime:'00:00',
      isFixedTime: false,
      fixedTime: undefined,
      dayType: undefined,
      roundToNearFiveMinutes: false,
    }
    this.displayTime = '';
    this.timeInput = '';
    this.showValidationErrors = false;
  }

  saveSelectedPrayers(): void {
    this.selectedHolidays.push(this.selectedHoliday)
        this.isSaveSuccess = true;
        this.hasSaved = true;
        setTimeout(() => {
          this.isSaveSuccess = false;
        }, 3000);
        this.currentHolidaySelection={id:0,
  gregorianDate:new Date(),
  hebrewDate: "",
  userId: this.userId,
  tefilos: []};
  }
saveSelectedHolidaysWithPrayers(): void {
    this.tefilotService.saveTefilosTimes(this.selectedHolidays).subscribe({
      next: (data) => {             
        this.selectedHolidays = data;     
        this.areSaveSuccess = true;
        this.hasSaved = true;
        setTimeout(() => {
          this.areSaveSuccess = false;
        }, 3000);
      },
      error: (error) => {
        console.error('Error saving selections:', error);
      },
    });
  }
  timeRelation: string = 'before';
  getCurrentHalachicTime(): string {
    if (!this.currentSelection?.halachicTimeId) {
      return '';
    }
    const selectedTime =
      this.halachicTimes[this.currentSelection.halachicTimeId];
    return selectedTime ? selectedTime.hebrewName : '';
  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/welcome']);
  }

  createFilePrayers(): void {
    this.isLoadingWord = true;
    this.tefilotService.downloadShabbatSchedule(this.userId).subscribe({
      next: (blob) => {
        this.isLoadingWord = false;
        const fileName = `תפילות חגי תשרי תשפ''ו.docx`;
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(link.href);
        this.isCreatedSuccess = true;
        setTimeout(() => {
          const designSection = document.getElementById('designSection');
          if (designSection) {
            designSection.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          }
          setTimeout(() => (this.isCreatedSuccess = false), 2000);
        }, 1000);
      },
      error: (error) => {
        this.isLoadingWord = false;
        console.error('Error downloading file:', error);
      },
    });
  }
  createExcelPrayers(): void {
    this.isLoadingExcel = true;
    this.tefilotService.downloadShabbatScheduleExcel(this.userId).subscribe({
      next: (blob) => {
        this.isLoadingExcel = false;
        const fileName = `תפילות חגי תשרי תשפ''ו.xlsx`;
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(link.href);
        this.isExcelCreatedSuccess = true;
        setTimeout(() => {
          const designSection = document.getElementById('designSection');
          if (designSection) {
            designSection.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          }
          setTimeout(() => (this.isExcelCreatedSuccess = false), 2000);
        }, 1000);
      },
      error: (error) => {
        this.isLoadingExcel = false;
        console.error('Error downloading Excel file:', error);
      },
    });
  }

  drop(event: CdkDragDrop<TefilosTime[]>) {
    moveItemInArray(
      this.selectedPrayers,
      event.previousIndex,
      event.currentIndex
    );
    moveItemInArray(
      this.selectedHoliday.tefilos,
      event.previousIndex,
     event.currentIndex
    )
    this.hasSaved = false;
  }
}

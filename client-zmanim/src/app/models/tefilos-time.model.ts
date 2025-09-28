export interface TefilosTime {
  id?: number;
  tefila: number;
  customTefilaName?: string;
  halachicTimeId?: string;
  personalCalculationTime?: string;
  isBeforeTime: boolean; // true for before (negative), false for after (positive)
  finalCalculatedTime: Date; // Default to current date/time
  userId: number;
  isFixedTime: boolean;
  fixedTime?: Date;
  dayType?: string; // 'friday' or 'shabbat'
  roundToNearFiveMinutes: boolean;
}

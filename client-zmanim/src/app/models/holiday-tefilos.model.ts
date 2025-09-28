import { TefilosTime } from "./tefilos-time.model";

export interface HolidayTefilos {
  id: number;
  gregorianDate: Date;
  hebrewDate: string;
  userId: number;
  tefilos: TefilosTime[];
}

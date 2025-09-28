export enum TefilosName {
  Shacharis = 0,
  Mincha = 1,
  Maariv = 2,
}

export interface HalachicTime {
  id: string;
  englishName: string;
  hebrewName: string;
  order: number;
}
export interface HalachicTimeDictionary {
  [key: string]: HalachicTime;
}
export interface TefilosTime {
  id: number;
  tefila: TefilosName;
  halachicTime: HalachicTime;
  personalCalculationTime: Date;
  userId: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  synagogue: string;
  city: string;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}
export interface HolidayTefilos {
  id: number;
  gregorianDate: Date;
  hebrewDate: string;
  userId: number;
  tefilos: TefilosTime[];
}

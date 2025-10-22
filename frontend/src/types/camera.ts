export interface CameraError {
  id: string;
  date: string;
  description: string;
}

export interface Camera {
  id: string;
  name: string;
  ip: string;
  address: string;
  status: CameraStatus;
  lastUpdate: string;
  errorHistory: CameraError[];
}

export enum CameraStatus {
  WORKING = 'working',
  NOT_WORKING = 'not_working',
  DEFECT = 'defect'
}
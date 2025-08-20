export interface SensorData {
  connected: boolean;
  time: string;
  date: string;
  ph: number;
  turbid: number;
  water_temp: number;
  tds: number;
  is_water_lvl_normal: boolean;
  nh3_gas: number;
  fraction_nh3: number;
  total_ammonia: number;
  web_time: number;
}
export interface Program {
  id: string;
  program_area_id: string;
  name: string;
  criteria: string;
}

export interface ProgramDbModel {
  program_area_id: string;
  name: string;
  criteria: string;
}

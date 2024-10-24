export interface Column {
  id: ID;
  title: string;
}

export type ID = string | number;

export interface Task {
  id: ID;
  columId: ID;
  content: string;
}

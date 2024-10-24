import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Column, Task } from "../types";

interface KanbanState {
  columns: Column[];
  tasks: Task[];
  setColumns: (columns: Column[]) => void;
  setTasks: (tasks: Task[]) => void;
}

export const useKanbanStore = create<KanbanState>()(
  persist(
    (set) => ({
      columns: [],
      tasks: [],
      setColumns: (columns) => set({ columns }),
      setTasks: (tasks) => set({ tasks }),
    }),
    { name: "kanban-store" }
  )
);

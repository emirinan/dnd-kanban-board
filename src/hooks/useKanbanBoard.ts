import {
  useSensors,
  useSensor,
  PointerSensor,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useState, useMemo } from "react";
import { useKanbanStore } from "../stores/kanban.store";
import { Column, Task, ID } from "../types";

export const useKanbanBoard = () => {
  const columns = useKanbanStore((state) => state.columns);
  const tasks = useKanbanStore((state) => state.tasks);
  const setColumns = useKanbanStore((state) => state.setColumns);
  const setTasks = useKanbanStore((state) => state.setTasks);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );
  const columnsId = useMemo(
    () => columns.map((column) => column.id),
    [columns]
  );
  const createTask = (columnId: ID) => {
    const newTask: Task = {
      id: generateId(),
      columId: columnId,
      content: `Task ${tasks.length + 1}`,
    };
    setTasks([...tasks, newTask]);
  };

  const deleteTask = (id: ID) => {
    const filteredTasks = tasks.filter((task) => task.id !== id);
    setTasks(filteredTasks);
  };
  const updateTask = (id: ID, content: string) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, content };
      }
      return task;
    });
    setTasks(updatedTasks);
  };
  const createColumn = () => {
    const columnToAdd: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };
    setColumns([...columns, columnToAdd]);
  };

  const generateId = () => {
    return Math.floor(Math.random() * 10001);
  };
  const deleteColumn = (id: ID) => {
    const filteredColumns = columns.filter((column) => column.id !== id);
    setColumns(filteredColumns);
    const filteredTasks = tasks.filter((task) => task.columId !== id);
    setTasks(filteredTasks);
  };

  const updateColumn = (id: ID, title: string) => {
    const updatedColumns = columns.map((column) => {
      if (column.id === id) {
        return { ...column, title };
      }
      return column;
    });
    setColumns(updatedColumns);
  };
  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveColumn(null);
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;
    const activeColumId = active.id;
    const overColumId = over.id;
    if (activeColumId === overColumId) return;
    const activeColumnIndex = columns.findIndex(
      (column) => column.id === activeColumId
    );
    const overColumnIndex = columns.findIndex(
      (column) => column.id === overColumId
    );
    setColumns(arrayMove(columns, activeColumnIndex, overColumnIndex));
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;
    //Dropping a task over a another task
    if (isActiveATask && isOverATask) {
      const activeTaskIndex = tasks.findIndex((task) => task.id === activeId);
      const overTaskIndex = tasks.findIndex((task) => task.id === overId);
      tasks[activeTaskIndex].columId = tasks[overTaskIndex].columId;
      setTasks(arrayMove(tasks, activeTaskIndex, overTaskIndex));
    }
    const isOverAColumn = over.data.current?.type === "Column";
    //Dropping a task over a column
    if (isActiveATask && isOverAColumn) {
      const activeTaskIndex = tasks.findIndex((task) => task.id === activeId);
      tasks[activeTaskIndex].columId = overId;
      setTasks(arrayMove(tasks, activeTaskIndex, activeTaskIndex));
    }
  };
  return {
    sensors,
    onDragStart,
    onDragEnd,
    onDragOver,
    columns,
    columnsId,
    createColumn,
    deleteColumn,
    updateColumn,
    createTask,
    deleteTask,
    updateTask,
    tasks,
    activeColumn,
    activeTask,
  };
};

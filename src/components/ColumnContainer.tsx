import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TrashIcon } from "../icons/TrashIcon";
import { Column, ID, Task } from "../types";
import { useMemo, useState } from "react";
import { PlusIcon } from "../icons/PlusIcon";
import { TaskCard } from "./TaskCard";

interface Props {
  column: Column;
  deleteColumn: (id: ID) => void;
  updateColumn: (id: ID, title: string) => void;
  createTask: (columnId: ID) => void;
  deleteTask: (id: ID) => void;
  updateTask: (id: ID, content: string) => void;
  tasks: Task[];
}
export const ColumnContainer = ({
  column,
  deleteColumn,
  updateColumn,
  createTask,
  deleteTask,
  updateTask,
  tasks,
}: Props) => {
  const [editMode, setEditMode] = useState(false);
  const tasksIds = useMemo(() => tasks.map((task) => task.id), [tasks]);
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-columnBackgroundColor opacity-40 border-2 border-rose-500 w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
      ></div>
    );
  }
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
    >
      <div
        {...attributes}
        {...listeners}
        onClick={() => setEditMode(true)}
        className="bg-mainBackgroundColor text-base h-[60px] !cursor-grab rounded-md rounded-b-none
      p-3 font-bold border-4 border-columnBackgroundColor flex items-center justify-between"
      >
        <div className="flex gap-2">
          <div className="flex justify-center items-center bg-columnBackgroundColor px-2.5 py-1 text-sm rounded-full">
            {tasks.length}
          </div>
          {!editMode && column.title}
          {editMode && (
            <input
              className="bg-black focus:border-rose-500 border rounded outline-none px-2"
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
              autoFocus
              onBlur={() => setEditMode(false)}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          )}
        </div>
        <button
          onClick={() => deleteColumn(column.id)}
          className="stroke-gray-500 hover:stroke-white hover:bg-columnBackgroundColor rounded px-1 py-2"
        >
          <TrashIcon />
        </button>
      </div>
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div>
      <button
        onClick={() => createTask(column.id)}
        className="flex gap-2 items-center border-columnBackgroundColor border-2 rounded-md p-4 border-x-columnBackgroundColor hover:bg-mainBackgroundColor hover:text-rose-500 active:bg-black"
      >
        <PlusIcon />
        Add task
      </button>
    </div>
  );
};

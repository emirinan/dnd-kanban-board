import { createPortal } from "react-dom";
import { PlusIcon } from "../icons/PlusIcon";
import { ColumnContainer } from "./ColumnContainer";
import { SortableContext } from "@dnd-kit/sortable";
import { TaskCard } from "./TaskCard";
import { useKanbanBoard } from "../hooks/useKanbanBoard";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { Column, Task } from "../types";

export const KanbanBoard = () => {
  const {
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
  } = useKanbanBoard();
  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map((column: Column) => (
                <ColumnContainer
                  key={column.id}
                  column={column}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  tasks={tasks.filter(
                    (task: Task) => task.columId === column.id
                  )}
                />
              ))}
            </SortableContext>
          </div>
          <button
            onClick={createColumn}
            className="h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-4 ring-rose-500 hover:ring-2 flex gap-2"
          >
            <PlusIcon />
            Add Column
          </button>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter(
                  (task: Task) => task.columId === activeColumn.id
                )}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
};

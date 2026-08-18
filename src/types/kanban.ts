import { FullTask, BoardColumn } from './database';

export interface DragItem {
  id: string;
  columnId: string;
  type: 'task' | 'column';
  task?: FullTask;
  column?: BoardColumn;
}

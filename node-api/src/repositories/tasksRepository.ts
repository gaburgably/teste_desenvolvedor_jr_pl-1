import fs from 'fs';

const FILE_PATH = './tasks.json';

interface Task {
  id: number;
  text: string;
  summary: string | null;
  lang: string;
}

export class TasksRepository {
  private tasks: Task[] = this.loadFromFile();
  private currentId: number = (this.tasks[this.tasks.length - 1]?.id ?? 0) + 1;

  private loadFromFile(): Task[] {
    if (fs.existsSync(FILE_PATH)) {
      return JSON.parse(fs.readFileSync(FILE_PATH, 'utf-8'));
    }
    return [];
  }

  private saveToFile() {
    fs.writeFileSync(FILE_PATH, JSON.stringify(this.tasks, null, 2));
  }

  createTask(text: string, lang: string): Task {
    const task: Task = { id: this.currentId++, text, summary: null, lang };
    this.tasks.push(task);
    this.saveToFile();
    return task;
  }

  updateTask(id: number, summary: string): Task | null {
    const taskIndex = this.tasks.findIndex(t => t.id === id);
    if (taskIndex > -1) {
      this.tasks[taskIndex].summary = summary;
      this.saveToFile();
      return this.tasks[taskIndex];
    }
    return null;
  }

  getTaskById(id: number): Task | null {
    return this.tasks.find(t => t.id === id) || null;
  }

  getAllTasks(): Task[] { return this.tasks; }

  deleteTask(id: number): boolean {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index > -1) {
      this.tasks.splice(index, 1);
      this.saveToFile();
      return true;
    }
    return false;
  }
}
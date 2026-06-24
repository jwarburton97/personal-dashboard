import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  newTaskText: string = '';

  ngOnInit() {
    // Load tasks from localStorage
    this.loadTasks();
  }

  addTask() {
    if (this.newTaskText.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        text: this.newTaskText.trim(),
        completed: false,
        createdAt: new Date()
      };
      this.tasks.unshift(task);
      this.newTaskText = '';
      this.saveTasks();
    }
  }

  toggleTask(task: Task) {
    task.completed = !task.completed;
    this.saveTasks();
  }

  deleteTask(taskId: string) {
    this.tasks = this.tasks.filter(t => t.id !== taskId);
    this.saveTasks();
  }

  private loadTasks() {
    const saved = localStorage.getItem('dashboard_tasks');
    if (saved) {
      this.tasks = JSON.parse(saved);
    }
  }

  private saveTasks() {
    localStorage.setItem('dashboard_tasks', JSON.stringify(this.tasks));
  }

  get activeTasks() {
    return this.tasks.filter(t => !t.completed);
  }

  get completedTasks() {
    return this.tasks.filter(t => t.completed);
  }
}

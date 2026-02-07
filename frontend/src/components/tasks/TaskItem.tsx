import React, { useState } from 'react';

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface TaskItemProps {
  task: Task;
  onTaskUpdated: () => void;
  onTaskDeleted: () => void;
}

export default function TaskItem({ task, onTaskUpdated, onTaskDeleted }: TaskItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleCompletion = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${task.user_id}/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('better-auth-session-token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...task,
          completed: !task.completed
        }),
      });

      if (response.ok) {
        onTaskUpdated();
      }
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteTask = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${task.user_id}/tasks/${task.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('better-auth-session-token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        onTaskDeleted();
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <li className={`py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between ${task.completed ? 'opacity-70' : ''} bg-white shadow-sm rounded-lg p-4`}>
      <div className="flex items-start w-full sm:w-auto">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={toggleCompletion}
          disabled={isUpdating}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1 sm:mt-0"
        />
        <div className="ml-3 flex-1">
          <p className={`text-base font-medium ${task.completed ? 'line-through' : ''} ${
            task.completed ? 'text-gray-500' : 'text-gray-900'
          }`}>
            {task.title}
          </p>
          {task.description && (
            <p className="text-sm text-gray-500 mt-1">{task.description}</p>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2 mt-3 sm:mt-0">
        <span className="text-xs text-gray-500">
          {new Date(task.updated_at).toLocaleDateString()}
        </span>
        <button
          onClick={deleteTask}
          disabled={isDeleting}
          className="inline-flex items-center px-2.5 py-0.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </li>
  );
}

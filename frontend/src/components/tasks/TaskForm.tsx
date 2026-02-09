import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { API_CONFIG } from '@/config/api';

interface TaskFormProps {
  onTaskCreated: () => void;
}

export default function TaskForm({ onTaskCreated }: TaskFormProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/${user?.id}/tasks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('better-auth-session-token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          completed,
          user_id: user?.id
        }),
      });

      if (response.ok) {
        setTitle('');
        setDescription('');
        setCompleted(false);
        onTaskCreated(); // Refresh the task list
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to create task');
      }
    } catch (err) {
      setError('Error creating task');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title *
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
                placeholder="What needs to be done?"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <div className="mt-1">
              <textarea
                id="description"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
                placeholder="Add details..."
                disabled={loading}
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <input
            id="completed"
            name="completed"
            type="checkbox"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            disabled={loading}
          />
          <label htmlFor="completed" className="ml-2 block text-sm text-gray-900">
            Mark as completed
          </label>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
}

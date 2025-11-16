import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Save } from 'lucide-react';

const TaskManager = () => {
  const [activeSection, setActiveSection] = useState('team');
  const [editingItem, setEditingItem] = useState(null);
  const [editText, setEditText] = useState('');
  
  const [teamTasks, setTeamTasks] = useState({
    Jake: [
      { id: 1, task: 'Pour', status: '' },
      { id: 2, task: 'Seal', status: '' },
      { id: 3, task: 'Pack Gift Sets', status: '' },
      { id: 4, task: 'Load Bins', status: '' }
    ],
    Ang: [
      { id: 5, task: 'Upload market schedule', status: 'Priority Today' },
      { id: 6, task: 'Sales Analysis BFCM 24', status: 'Priority Today' },
      { id: 7, task: 'Alibaba for Glo project', status: '' },
      { id: 8, task: 'October numbers update', status: 'Priority Today' },
      { id: 9, task: 'LinkedIn lead gen', status: '' }
    ],
    Jordan: [
      { id: 18, task: 'Discount Code IG', status: 'Priority Today' },
      { id: 19, task: 'Finalize Calendar', status: '' }
    ],
    Bren: [
      { id: 30, task: 'Cricut projects', status: '' },
      { id: 31, task: 'Make gift boxes', status: '' }
    ]
  });

  const [categories, setCategories] = useState({
    'Check-Ins': {
      color: 'blue',
      tasks: [
        { id: 500, task: 'Horseshoe Market', status: '' },
        { id: 501, task: 'GLO', status: '' },
        { id: 503, task: 'Boulder Premium Space Program', status: 'Priority Today' }
      ]
    },
    'Payments To Make': {
      color: 'blue',
      tasks: [
        { id: 600, task: 'Mile High Payment $575', status: '' },
        { id: 608, task: 'GumPop 3 $375', status: 'Priority Today' }
      ]
    },
    'Black Friday Actions': {
      color: 'red',
      tasks: [
        { id: 700, task: 'Edit photos', status: '' },
        { id: 701, task: 'Launch Faire promo', status: '' }
      ]
    },
    'Corporate Gifting': {
      color: 'purple',
      tasks: [
        { id: 1600, task: 'Continue outreach', status: '' },
        { id: 1603, task: 'Update Line Sheet', status: '', highlight: true }
      ]
    }
  });

  const statuses = ['', 'Priority Today', 'Priority This Week', 'Future', 'Completed'];

  const getCategoryColor = (color) => {
    const colors = {
      blue: 'bg-blue-100 border-blue-400',
      red: 'bg-red-100 border-red-400',
      green: 'bg-green-100 border-green-400',
      purple: 'bg-purple-100 border-purple-400'
    };
    return colors[color] || 'bg-gray-100 border-gray-400';
  };

  const getCategoryHeaderColor = (color) => {
    const colors = {
      blue: 'bg-blue-600 text-white',
      red: 'bg-red-600 text-white',
      green: 'bg-green-600 text-white',
      purple: 'bg-purple-600 text-white'
    };
    return colors[color] || 'bg-gray-600 text-white';
  };

  const getStatusColor = (status) => {
    const colors = {
      'Completed': 'bg-green-600 text-white',
      'Priority Today': 'bg-red-600 text-white',
      'Priority This Week': 'bg-orange-600 text-white',
      'Future': 'bg-blue-600 text-white'
    };
    return colors[status] || 'bg-gray-300 text-gray-700';
  };

  const getMasterTodoTasks = () => {
    const allTasks = [];
    
    Object.entries(teamTasks).forEach(([member, tasks]) => {
      tasks.forEach(task => {
        allTasks.push({ ...task, source: `Team: ${member}` });
      });
    });
    
    Object.entries(categories).forEach(([category, data]) => {
      data.tasks.forEach(task => {
        allTasks.push({ ...task, source: category });
      });
    });

    return {
      'Priority Today': allTasks.filter(t => t.status === 'Priority Today'),
      'Priority This Week': allTasks.filter(t => t.status === 'Priority This Week'),
      'Future': allTasks.filter(t => t.status === 'Future'),
      'Other Brain Dump': allTasks.filter(t => t.status === '' || t.status === 'Completed')
    };
  };

  const updateTeamTaskStatus = (member, taskId, newStatus) => {
    setTeamTasks({
      ...teamTasks,
      [member]: teamTasks[member].map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    });
  };

  const updateCategoryTaskStatus = (category, taskId, newStatus) => {
    setCategories({
      ...categories,
      [category]: {
        ...categories[category],
        tasks: categories[category].tasks.map(task =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      }
    });
  };

  const addTeamTask = (member) => {
    const newTask = prompt(`Add new task for ${member}:`);
    if (newTask) {
      const allIds = Object.values(teamTasks).flat().map(t => t.id);
      const newId = Math.max(...allIds, 0) + 1;
      setTeamTasks({
        ...teamTasks,
        [member]: [...teamTasks[member], { id: newId, task: newTask, status: '' }]
      });
    }
  };

  const deleteTeamTask = (member, taskId) => {
    if (window.confirm('Delete this task?')) {
      setTeamTasks({
        ...teamTasks,
        [member]: teamTasks[member].filter(task => task.id !== taskId)
      });
    }
  };

  const addCategoryTask = (category) => {
    const newTask = prompt(`Add new task to ${category}:`);
    if (newTask) {
      const allIds = Object.values(categories).flatMap(cat => cat.tasks.map(t => t.id));
      const newId = Math.max(...allIds, 0) + 1;
      setCategories({
        ...categories,
        [category]: {
          ...categories[category],
          tasks: [...categories[category].tasks, { id: newId, task: newTask, status: '' }]
        }
      });
    }
  };

  const deleteCategoryTask = (category, taskId) => {
    if (window.confirm('Delete this task?')) {
      setCategories({
        ...categories,
        [category]: {
          ...categories[category],
          tasks: categories[category].tasks.filter(task => task.id !== taskId)
        }
      });
    }
  };

  const startEdit = (type, identifier, taskId, currentText) => {
    setEditingItem({ type, identifier, taskId });
    setEditText(currentText);
  };

  const saveEdit = () => {
    if (!editingItem || !editText.trim()) return;

    if (editingItem.type === 'team') {
      setTeamTasks({
        ...teamTasks,
        [editingItem.identifier]: teamTasks[editingItem.identifier].map(task =>
          task.id === editingItem.taskId ? { ...task, task: editText } : task
        )
      });
    } else if (editingItem.type === 'category') {
      setCategories({
        ...categories,
        [editingItem.identifier]: {
          ...categories[editingItem.identifier],
          tasks: categories[editingItem.identifier].tasks.map(task =>
            task.id === editingItem.taskId ? { ...task, task: editText } : task
          )
        }
      });
    }

    setEditingItem(null);
    setEditText('');
  };

  const isEditing = (type, identifier, taskId) => {
    return editingItem && 
           editingItem.type === type && 
           editingItem.identifier === identifier && 
           editingItem.taskId === taskId;
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">CPD Master Task Manager</h1>
        <p className="text-gray-600">Concrete Poppy Design</p>
      </div>

      <div className="flex gap-2 mb-6 border-b-2 border-gray-300">
        <button
          onClick={() => setActiveSection('team')}
          className={`px-6 py-3 font-bold transition ${
            activeSection === 'team'
              ? 'bg-yellow-300 border-2 border-gray-900'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          TEAM MEMBER TASKS
        </button>
        <button
          onClick={() => setActiveSection('master')}
          className={`px-6 py-3 font-bold transition ${
            activeSection === 'master'
              ? 'bg-yellow-300 border-2 border-gray-900'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          MASTER TO-DO
        </button>
        <button
          onClick={() => setActiveSection('categories')}
          className={`px-6 py-3 font-bold transition ${
            activeSection === 'categories'
              ? 'bg-yellow-300 border-2 border-gray-900'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          TASK CATEGORIES
        </button>
      </div>

      {activeSection === 'team' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(teamTasks).map(([member, tasks]) => (
            <div key={member} className="bg-white border-2 border-gray-900">
              <div className="bg-yellow-300 px-4 py-2 border-b-2 border-gray-900 font-bold text-center flex justify-between items-center">
                <span></span>
                <span>{member}</span>
                <button onClick={() => addTeamTask(member)} className="hover:text-gray-600">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="p-3 space-y-2">
                {tasks.map(task => (
                  <div key={task.id}>
                    {isEditing('team', member, task.id) ? (
                      <div className="flex gap-1">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="flex-grow text-xs border border-gray-300 px-2 py-1"
                          autoFocus
                        />
                        <button onClick={saveEdit} className="px-2 bg-green-500 text-white rounded">
                          <Save className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-start gap-1 group">
                        <select
                          value={task.status}
                          onChange={(e) => updateTeamTaskStatus(member, task.id, e.target.value)}
                          className={`text-xs px-2 py-1 rounded ${getStatusColor(task.status)} font-semibold`}
                        >
                          {statuses.map(status => (
                            <option key={status} value={status}>
                              {status || 'None'}
                            </option>
                          ))}
                        </select>
                        <span className={`flex-grow text-xs ${task.status === 'Completed' ? 'line-through text-gray-500' : ''}`}>
                          {task.task}
                        </span>
                        <button
                          onClick={() => startEdit('team', member, task.id, task.task)}
                          className="opacity-0 group-hover:opacity-100"
                        >
                          <Edit2 className="w-3 h-3 text-gray-600" />
                        </button>
                        <button
                          onClick={() => deleteTeamTask(member, task.id)}
                          className="opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-3 h-3 text-red-500" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSection === 'master' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(getMasterTodoTasks()).map(([priority, tasks]) => (
            <div key={priority} className="bg-white border-2 border-gray-900">
              <div className="bg-yellow-300 px-4 py-2 border-b-2 border-gray-900 font-bold text-center">
                {priority} ({tasks.length})
              </div>
              <div className="p-3 space-y-2">
                {tasks.length === 0 ? (
                  <p className="text-gray-400 text-xs italic">No tasks</p>
                ) : (
                  tasks.map((task, idx) => (
                    <div key={`${task.source}-${task.id}-${idx}`} className="text-xs">
                      <div className={`font-semibold ${task.status === 'Completed' ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                        {task.task}
                      </div>
                      <div className="text-gray-500 italic text-[10px]">
                        {task.source}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSection === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(categories).map(([category, data]) => (
            <div key={category} className={`border-2 ${getCategoryColor(data.color)}`}>
              <div className={`px-4 py-2 border-b-2 border-gray-900 font-bold text-center text-xs ${getCategoryHeaderColor(data.color)} flex justify-between items-center`}>
                <span></span>
                <span className="flex-grow">{category}</span>
                <button onClick={() => addCategoryTask(category)} className="hover:opacity-70">
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <div className="p-3 space-y-2 bg-white">
                {data.tasks.map(task => (
                  <div key={task.id}>
                    {isEditing('category', category, task.id) ? (
                      <div className="flex gap-1">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="flex-grow text-xs border border-gray-300 px-2 py-1"
                          autoFocus
                        />
                        <button onClick={saveEdit} className="px-2 bg-green-500 text-white rounded">
                          <Save className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className={`flex items-start gap-1 group ${task.highlight ? 'bg-yellow-200 px-1' : ''}`}>
                        <select
                          value={task.status}
                          onChange={(e) => updateCategoryTaskStatus(category, task.id, e.target.value)}
                          className={`text-xs px-2 py-1 rounded ${getStatusColor(task.status)} font-semibold flex-shrink-0`}
                        >
                          {statuses.map(status => (
                            <option key={status} value={status}>
                              {status || 'None'}
                            </option>
                          ))}
                        </select>
                        <span className={`flex-grow text-xs ${task.status === 'Completed' ? 'line-through text-gray-500' : ''}`}>
                          {task.task}
                        </span>
                        <button
                          onClick={() => startEdit('category', category, task.id, task.task)}
                          className="opacity-0 group-hover:opacity-100 flex-shrink-0"
                        >
                          <Edit2 className="w-3 h-3 text-gray-600" />
                        </button>
                        <button
                          onClick={() => deleteCategoryTask(category, task.id)}
                          className="opacity-0 group-hover:opacity-100 flex-shrink-0"
                        >
                          <Trash2 className="w-3 h-3 text-red-500" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskManager;
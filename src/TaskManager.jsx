import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, Palette } from 'lucide-react';
import { db } from './firebase';
import { collection, doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';

const TaskManager = () => {
  const [activeSection, setActiveSection] = useState('team');
  const [editingItem, setEditingItem] = useState(null);
  const [editText, setEditText] = useState('');
  const [loading, setLoading] = useState(true);
  
  const getInitialTeamTasks = () => {
    return {
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
    };
  };

  const getInitialCategories = () => {
    return {
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
    };
  };

  const getInitialMasterTodo = () => {
    return {
      'Priority Today': { color: 'yellow' },
      'Priority This Week': { color: 'yellow' },
      'Future': { color: 'yellow' },
      'Other Brain Dump': { color: 'yellow' }
    };
  };

  const [teamTasks, setTeamTasks] = useState(getInitialTeamTasks);
  const [categories, setCategories] = useState(getInitialCategories);
  const [masterTodoCategories, setMasterTodoCategories] = useState(getInitialMasterTodo);

  // Firebase: Load data on mount and set up real-time listener
  useEffect(() => {
    const loadFromFirebase = async () => {
      try {
        const docRef = doc(db, 'cpdTasks', 'mainData');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTeamTasks(data.teamTasks || getInitialTeamTasks());
          setCategories(data.categories || getInitialCategories());
          setMasterTodoCategories(data.masterTodoCategories || getInitialMasterTodo());
        } else {
          // Initialize Firebase with default data
          await setDoc(docRef, {
            teamTasks: getInitialTeamTasks(),
            categories: getInitialCategories(),
            masterTodoCategories: getInitialMasterTodo()
          });
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading from Firebase:', error);
        setLoading(false);
      }
    };

    loadFromFirebase();

    // Set up real-time listener
    const docRef = doc(db, 'cpdTasks', 'mainData');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTeamTasks(data.teamTasks || getInitialTeamTasks());
        setCategories(data.categories || getInitialCategories());
        setMasterTodoCategories(data.masterTodoCategories || getInitialMasterTodo());
      }
    });

    return () => unsubscribe();
  }, []);

  // Firebase: Save to Firestore whenever state changes
  const saveToFirebase = async (updatedTeamTasks, updatedCategories, updatedMasterTodo) => {
    try {
      const docRef = doc(db, 'cpdTasks', 'mainData');
      await setDoc(docRef, {
        teamTasks: updatedTeamTasks,
        categories: updatedCategories,
        masterTodoCategories: updatedMasterTodo
      });
    } catch (error) {
      console.error('Error saving to Firebase:', error);
    }
  };

  const statuses = ['', 'Priority Today', 'Priority This Week', 'Future', 'Completed'];
  const availableColors = ['blue', 'red', 'green', 'purple', 'yellow', 'pink', 'indigo', 'orange'];

  const getCategoryColor = (color) => {
    const colors = {
      blue: 'bg-blue-100 border-blue-400',
      red: 'bg-red-100 border-red-400',
      green: 'bg-green-100 border-green-400',
      purple: 'bg-purple-100 border-purple-400',
      yellow: 'bg-yellow-100 border-yellow-400',
      pink: 'bg-pink-100 border-pink-400',
      indigo: 'bg-indigo-100 border-indigo-400',
      orange: 'bg-orange-100 border-orange-400'
    };
    return colors[color] || 'bg-gray-100 border-gray-400';
  };

  const getCategoryHeaderColor = (color) => {
    const colors = {
      blue: 'bg-blue-600 text-white',
      red: 'bg-red-600 text-white',
      green: 'bg-green-600 text-white',
      purple: 'bg-purple-600 text-white',
      yellow: 'bg-yellow-300 text-gray-900',
      pink: 'bg-pink-600 text-white',
      indigo: 'bg-indigo-600 text-white',
      orange: 'bg-orange-600 text-white'
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

    const result = {};
    Object.keys(masterTodoCategories).forEach(category => {
      if (category === 'Other Brain Dump') {
        result[category] = allTasks.filter(t => t.status === '' || t.status === 'Completed');
      } else {
        result[category] = allTasks.filter(t => t.status === category);
      }
    });
    
    return result;
  };

  const updateTeamTaskStatus = (member, taskId, newStatus) => {
    const updatedTeamTasks = {
      ...teamTasks,
      [member]: teamTasks[member].map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    };
    setTeamTasks(updatedTeamTasks);
    saveToFirebase(updatedTeamTasks, categories, masterTodoCategories);
  };

  const updateCategoryTaskStatus = (category, taskId, newStatus) => {
    const updatedCategories = {
      ...categories,
      [category]: {
        ...categories[category],
        tasks: categories[category].tasks.map(task =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      }
    };
    setCategories(updatedCategories);
    saveToFirebase(teamTasks, updatedCategories, masterTodoCategories);
  };

  const addTeamMember = () => {
    const newMember = prompt('Enter new team member name:');
    if (newMember && !teamTasks[newMember]) {
      const updatedTeamTasks = {
        ...teamTasks,
        [newMember]: []
      };
      setTeamTasks(updatedTeamTasks);
      saveToFirebase(updatedTeamTasks, categories, masterTodoCategories);
    }
  };

  const renameTeamMember = (oldName) => {
    const newName = prompt('Rename team member:', oldName);
    if (newName && newName !== oldName && !teamTasks[newName]) {
      const tasks = teamTasks[oldName];
      const newTeamTasks = {};
      Object.keys(teamTasks).forEach(key => {
        if (key === oldName) {
          newTeamTasks[newName] = tasks;
        } else {
          newTeamTasks[key] = teamTasks[key];
        }
      });
      setTeamTasks(newTeamTasks);
      saveToFirebase(newTeamTasks, categories, masterTodoCategories);
    }
  };

  const deleteTeamMember = (member) => {
    if (window.confirm(`Delete team member "${member}" and all their tasks?`)) {
      const newTeamTasks = {};
      Object.keys(teamTasks).forEach(key => {
        if (key !== member) {
          newTeamTasks[key] = teamTasks[key];
        }
      });
      setTeamTasks(newTeamTasks);
      saveToFirebase(newTeamTasks, categories, masterTodoCategories);
    }
  };

  const addTeamTask = (member) => {
    const newTask = prompt(`Add new task for ${member}:`);
    if (newTask) {
      const allIds = Object.values(teamTasks).flat().map(t => t.id);
      const newId = Math.max(...allIds, 0) + 1;
      const updatedTeamTasks = {
        ...teamTasks,
        [member]: [...teamTasks[member], { id: newId, task: newTask, status: '' }]
      };
      setTeamTasks(updatedTeamTasks);
      saveToFirebase(updatedTeamTasks, categories, masterTodoCategories);
    }
  };

  const deleteTeamTask = (member, taskId) => {
    if (window.confirm('Delete this task?')) {
      const updatedTeamTasks = {
        ...teamTasks,
        [member]: teamTasks[member].filter(task => task.id !== taskId)
      };
      setTeamTasks(updatedTeamTasks);
      saveToFirebase(updatedTeamTasks, categories, masterTodoCategories);
    }
  };const addNewCategory = () => {
    const categoryName = prompt('Enter new category name:');
    if (categoryName && !categories[categoryName]) {
      const color = prompt(`Choose color (${availableColors.join(', ')}):`, 'blue');
      const updatedCategories = {
        ...categories,
        [categoryName]: { color: color || 'blue', tasks: [] }
      };
      setCategories(updatedCategories);
      saveToFirebase(teamTasks, updatedCategories, masterTodoCategories);
    }
  };

  const renameCategory = (oldName) => {
    const newName = prompt('Rename category:', oldName);
    if (newName && newName !== oldName && !categories[newName]) {
      const categoryData = categories[oldName];
      const newCategories = {};
      Object.keys(categories).forEach(key => {
        if (key === oldName) {
          newCategories[newName] = categoryData;
        } else {
          newCategories[key] = categories[key];
        }
      });
      setCategories(newCategories);
      saveToFirebase(teamTasks, newCategories, masterTodoCategories);
    }
  };

  const changeCategoryColor = (categoryName) => {
    const newColor = prompt(`Choose color for "${categoryName}" (${availableColors.join(', ')}):`, categories[categoryName].color);
    if (newColor && availableColors.includes(newColor)) {
      const updatedCategories = {
        ...categories,
        [categoryName]: {
          ...categories[categoryName],
          color: newColor
        }
      };
      setCategories(updatedCategories);
      saveToFirebase(teamTasks, updatedCategories, masterTodoCategories);
    }
  };

  const deleteCategory = (category) => {
    if (window.confirm(`Delete category "${category}" and all its tasks?`)) {
      const newCategories = {};
      Object.keys(categories).forEach(key => {
        if (key !== category) {
          newCategories[key] = categories[key];
        }
      });
      setCategories(newCategories);
      saveToFirebase(teamTasks, newCategories, masterTodoCategories);
    }
  };

  const addCategoryTask = (category) => {
    const newTask = prompt(`Add new task to ${category}:`);
    if (newTask) {
      const allIds = Object.values(categories).flatMap(cat => cat.tasks.map(t => t.id));
      const newId = Math.max(...allIds, 0) + 1;
      const updatedCategories = {
        ...categories,
        [category]: {
          ...categories[category],
          tasks: [...categories[category].tasks, { id: newId, task: newTask, status: '' }]
        }
      };
      setCategories(updatedCategories);
      saveToFirebase(teamTasks, updatedCategories, masterTodoCategories);
    }
  };

  const deleteCategoryTask = (category, taskId) => {
    if (window.confirm('Delete this task?')) {
      const updatedCategories = {
        ...categories,
        [category]: {
          ...categories[category],
          tasks: categories[category].tasks.filter(task => task.id !== taskId)
        }
      };
      setCategories(updatedCategories);
      saveToFirebase(teamTasks, updatedCategories, masterTodoCategories);
    }
  };

  const addMasterTodoCategory = () => {
    const categoryName = prompt('Enter new Master To-Do category name:');
    if (categoryName && !masterTodoCategories[categoryName]) {
      const color = prompt(`Choose color (${availableColors.join(', ')}):`, 'yellow');
      const updatedMasterTodo = {
        ...masterTodoCategories,
        [categoryName]: { color: color || 'yellow' }
      };
      setMasterTodoCategories(updatedMasterTodo);
      saveToFirebase(teamTasks, categories, updatedMasterTodo);
      if (!statuses.includes(categoryName) && categoryName !== 'Other Brain Dump') {
        statuses.push(categoryName);
      }
    }
  };

  const renameMasterTodoCategory = (oldName) => {
    const newName = prompt('Rename Master To-Do category:', oldName);
    if (newName && newName !== oldName && !masterTodoCategories[newName]) {
      const categoryData = masterTodoCategories[oldName];
      const newMasterCategories = {};
      Object.keys(masterTodoCategories).forEach(key => {
        if (key === oldName) {
          newMasterCategories[newName] = categoryData;
        } else {
          newMasterCategories[key] = masterTodoCategories[key];
        }
      });
      setMasterTodoCategories(newMasterCategories);
      saveToFirebase(teamTasks, categories, newMasterCategories);
    }
  };

  const changeMasterTodoCategoryColor = (categoryName) => {
    const newColor = prompt(`Choose color for "${categoryName}" (${availableColors.join(', ')}):`, masterTodoCategories[categoryName].color);
    if (newColor && availableColors.includes(newColor)) {
      const updatedMasterTodo = {
        ...masterTodoCategories,
        [categoryName]: {
          ...masterTodoCategories[categoryName],
          color: newColor
        }
      };
      setMasterTodoCategories(updatedMasterTodo);
      saveToFirebase(teamTasks, categories, updatedMasterTodo);
    }
  };

  const deleteMasterTodoCategory = (category) => {
    if (window.confirm(`Delete Master To-Do category "${category}"?`)) {
      const newMasterCategories = {};
      Object.keys(masterTodoCategories).forEach(key => {
        if (key !== category) {
          newMasterCategories[key] = masterTodoCategories[key];
        }
      });
      setMasterTodoCategories(newMasterCategories);
      saveToFirebase(teamTasks, categories, newMasterCategories);
    }
  };

  const startEdit = (type, identifier, taskId, currentText) => {
    setEditingItem({ type, identifier, taskId });
    setEditText(currentText);
  };

  const saveEdit = () => {
    if (!editingItem || !editText.trim()) return;

    if (editingItem.type === 'team') {
      const updatedTeamTasks = {
        ...teamTasks,
        [editingItem.identifier]: teamTasks[editingItem.identifier].map(task =>
          task.id === editingItem.taskId ? { ...task, task: editText } : task
        )
      };
      setTeamTasks(updatedTeamTasks);
      saveToFirebase(updatedTeamTasks, categories, masterTodoCategories);
    } else if (editingItem.type === 'category') {
      const updatedCategories = {
        ...categories,
        [editingItem.identifier]: {
          ...categories[editingItem.identifier],
          tasks: categories[editingItem.identifier].tasks.map(task =>
            task.id === editingItem.taskId ? { ...task, task: editText } : task
          )
        }
      };
      setCategories(updatedCategories);
      saveToFirebase(teamTasks, updatedCategories, masterTodoCategories);
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

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-700">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">CPD Master Task Manager</h1>
        <p className="text-gray-600">Concrete Poppy Design - Synced across all devices</p>
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
        <div>
          <button
            onClick={addTeamMember}
            className="mb-4 px-4 py-2 bg-yellow-300 border-2 border-gray-900 font-bold hover:bg-yellow-400 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Team Member
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(teamTasks).map(([member, tasks]) => (
              <div key={member} className="bg-white border-2 border-gray-900">
                <div className="bg-yellow-300 px-4 py-2 border-b-2 border-gray-900 font-bold text-center flex justify-between items-center">
                  <button onClick={() => renameTeamMember(member)} className="hover:text-gray-600" title="Rename">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <span>{member}</span>
                  <div className="flex gap-1">
                    <button onClick={() => addTeamTask(member)} className="hover:text-gray-600" title="Add Task">
                      <Plus className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteTeamMember(member)} className="hover:text-red-600" title="Delete Member">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
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
        </div>
      )}

      {activeSection === 'master' && (
        <div>
          <button
            onClick={addMasterTodoCategory}
            className="mb-4 px-4 py-2 bg-yellow-300 border-2 border-gray-900 font-bold hover:bg-yellow-400 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Master To-Do Category
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(getMasterTodoTasks()).map(([priority, tasks]) => (
              <div key={priority} className="bg-white border-2 border-gray-900">
                <div className={`px-4 py-2 border-b-2 border-gray-900 font-bold text-center flex justify-between items-center ${getCategoryHeaderColor(masterTodoCategories[priority]?.color || 'yellow')}`}>
                  <button onClick={() => renameMasterTodoCategory(priority)} className="hover:opacity-70" title="Rename">
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <span className="flex-grow">{priority} ({tasks.length})</span>
                  <div className="flex gap-1">
                    <button onClick={() => changeMasterTodoCategoryColor(priority)} className="hover:opacity-70" title="Change Color">
                      <Palette className="w-3 h-3" />
                    </button>
                    <button onClick={() => deleteMasterTodoCategory(priority)} className="hover:opacity-70" title="Delete Category">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
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
        </div>
      )}

      {activeSection === 'categories' && (
        <div>
          <button
            onClick={addNewCategory}
            className="mb-4 px-4 py-2 bg-yellow-300 border-2 border-gray-900 font-bold hover:bg-yellow-400 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add New Category
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(categories).map(([category, data]) => (
              <div key={category} className={`border-2 ${getCategoryColor(data.color)}`}>
                <div className={`px-4 py-2 border-b-2 border-gray-900 font-bold text-center text-xs ${getCategoryHeaderColor(data.color)} flex justify-between items-center`}>
                  <button onClick={() => renameCategory(category)} className="hover:opacity-70" title="Rename">
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <span className="flex-grow">{category}</span>
                  <div className="flex gap-1">
                    <button onClick={() => changeCategoryColor(category)} className="hover:opacity-70" title="Change Color">
                      <Palette className="w-3 h-3" />
                    </button>
                    <button onClick={() => addCategoryTask(category)} className="hover:opacity-70" title="Add Task">
                      <Plus className="w-3 h-3" />
                    </button>
                    <button onClick={() => deleteCategory(category)} className="hover:opacity-70 text-red-200" title="Delete Category">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div<div className="p-3 space-y-2 bg-white">
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
        </div>
      )}
    </div>
  );
};

export default TaskManager;
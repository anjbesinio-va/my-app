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
        { id: 3, task: 'Pack Gift Sets', status: '' }
      ],
      Ang: [
        { id: 4, task: 'Upload Market Schedule', status: '' },
        { id: 5, task: 'Sales Analysis BFCM 24', status: '' },
        { id: 6, task: 'Alibaba', status: '' }
      ],
      Jordan: [
        { id: 7, task: 'Discount Code IG', status: '' },
        { id: 8, task: 'Finalize Calendar', status: '' }
      ],
      Bren: [
        { id: 9, task: 'Cricut Projects', status: '' },
        { id: 10, task: 'Make Gift Boxes', status: '' }
      ]
    };
  };

  const getInitialCategoryTasks = () => {
    return {
      'Candle Production': {
        color: 'blue',
        tasks: [
          { id: 101, task: 'Pour Candles', status: '' },
          { id: 102, task: 'Cure Candles', status: '' }
        ]
      },
      'Order Fulfillment': {
        color: 'blue',
        tasks: [
          { id: 201, task: 'Pack Orders', status: '' },
          { id: 202, task: 'Print Labels', status: '' }
        ]
      },
      'Markets': {
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
      'Black Friday Ac
      'Black Friday Accounting': {
        color: 'blue',
        tasks: [
          { id: 700, task: 'Track Discounts', status: '' },
          { id: 701, task: 'Update Sales Sheets', status: '' }
        ]
      }
    };
  };

  const [teamTasks, setTeamTasks] = useState(getInitialTeamTasks);
  const [categoryTasks, setCategoryTasks] = useState(getInitialCategoryTasks);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'taskManager', 'data'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTeamTasks(data.teamTasks || getInitialTeamTasks());
        setCategoryTasks(data.categoryTasks || getInitialCategoryTasks());
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const saveToFirebase = async () => {
    await setDoc(doc(db, 'taskManager', 'data'), {
      teamTasks,
      categoryTasks
    });
  };

  const startEditing = (section, personOrCategory, taskId, field = 'task') => {
    setEditingItem({ section, personOrCategory, taskId, field });
    const current =
      section === 'team'
        ? teamTasks[personOrCategory].find((t) => t.id === taskId)[field]
        : categoryTasks[personOrCategory].tasks.find((t) => t.id === taskId)[field];
    setEditText(current);
  };

  const saveEdit = () => {
    const { section, personOrCategory, taskId, field } = editingItem;

    if (section === 'team') {
      const updated = { ...teamTasks };
      updated[personOrCategory] = updated[personOrCategory].map((t) =>
        t.id === taskId ? { ...t, [field]: editText } : t
      );
      setTeamTasks(updated);
    } else {
      const updated = { ...categoryTasks };
      updated[personOrCategory].tasks = updated[personOrCategory].tasks.map((t) =>
        t.id === taskId ? { ...t, [field]: editText } : t
      );
      setCategoryTasks(updated);
    }

    saveToFirebase();
    setEditingItem(null);
    setEditText('');
  };

  const addTask = (section, personOrCategory) => {
    const newTask = { id: Date.now(), task: 'New Task', status: '' };

    if (section === 'team') {
      const updated = { ...teamTasks };
      updated[personOrCategory].push(newTask);
      setTeamTasks(updated);
    } else {
      const updated = { ...categoryTasks };
      updated[personOrCategory].tasks.push(newTask);
      setCategoryTasks(updated);
    }

    saveToFirebase();
  };

  const deleteTask = (section, personOrCategory, taskId) => {
    if (section === 'team') {
      const updated = { ...teamTasks };
      updated[personOrCategory] = updated[personOrCategory].filter((t) => t.id !== taskId);
      setTeamTasks(updated);
    } else {
      const updated = { ...categoryTasks };
      updated[personOrCategory].tasks = updated[personOrCategory].tasks.filter(
        (t) => t.id !== taskId
      );
      setCategoryTasks(updated);
    }

    saveToFirebase();
  };

  const cycleStatus = (section, person, taskId) => {
    const statuses = ['', 'Doing', 'Priority Today', 'Later', 'Done'];
    const getNext = (s) => statuses[(statuses.indexOf(s) + 1) % statuses.length];

    if (section === 'team') {
      const updated = { ...teamTasks };
      updated[person] = updated[person].map((t) =>
        t.id === taskId ? { ...t, status: getNext(t.status) } : t
      );
      setTeamTasks(updated);
    } else {
      const updated = { ...categoryTasks };
      updated[person].tasks = updated[person].tasks.map((t) =>
        t.id === taskId ? { ...t, status: getNext(t.status) } : t
      );
      setCategoryTasks(updated);
    }

    saveToFirebase();
  };

  if (loading) return <div className="p-6">Loading...</div>;
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveSection('team')}
          className={`px-4 py-2 rounded ${activeSection === 'team' ? 'bg-blue-600 text-white' : 'bg-white'}`}
        >
          Team Tasks
        </button>

        <button
          onClick={() => setActiveSection('category')}
          className={`px-4 py-2 rounded ${activeSection === 'category' ? 'bg-blue-600 text-white' : 'bg-white'}`}
        >
          Category Tasks
        </button>
      </div>

      {/* TEAM TASKS */}
      {activeSection === 'team' && (
        <div className="space-y-6">
          {Object.entries(teamTasks).map(([person, tasks]) => (
            <div key={person} className="bg-white p-5 rounded shadow">
              <h2 className="text-2xl font-bold mb-3">{person}</h2>

              {/* TASK LIST */}
              <div className="space-y-2">
                {tasks.map(({ id, task, status }) => (
                  <div key={id} className="flex items-center justify-between border p-2 rounded">
                    <div className="flex flex-col">
                      <span className="font-semibold">{task}</span>
                      <span className="text-sm text-gray-600">{status}</span>
                    </div>

                    <div className="flex gap-3">
                      <button onClick={() => cycleStatus('team', person, id)}>
                        <Palette size={20} />
                      </button>

                      <button onClick={() => startEditing('team', person, id, 'task')}>
                        <Edit2 size={20} />
                      </button>

                      <button onClick={() => deleteTask('team', person, id)}>
                        <Trash2 size={20} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => addTask('team', person)}
                className="mt-3 flex items-center gap-2 text-blue-700"
              >
                <Plus size={18} /> Add task
              </button>
            </div>
          ))}
        </div>
      )}

      {/* CATEGORY TASKS */}
      {activeSection === 'category' && (
        <div className="space-y-6">
          {Object.entries(categoryTasks).map(([category, data]) => (
            <div key={category} className="bg-white p-5 rounded shadow">
              <h2 className="text-2xl font-bold mb-3">{category}</h2>

              {/* FIXED LINE BELOW */}
              </div>
              <div className="p-3 space-y-2 bg-white">
                {data.tasks.map(task => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between border p-2 rounded"
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold">{task.task}</span>
                      <span className="text-sm text-gray-600">{task.status}</span>
                    </div>

                    <div className="flex gap-3">
                      <button onClick={() => cycleStatus('category', category, task.id)}>
                        <Palette size={20} />
                      </button>

                      <button onClick={() => startEditing('category', category, task.id, 'task')}>
                        <Edit2 size={20} />
                      </button>

                      <button onClick={() => deleteTask('category', category, task.id)}>
                        <Trash2 size={20} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => addTask('category', category)}
                  className="mt-3 flex items-center gap-2 text-blue-700"
                >
                  <Plus size={18} /> Add task
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EDITING POPUP */}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-xl font-bold mb-3">Edit Task</h3>

            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={saveEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                <Save size={18} className="inline-block mr-1" />
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManager;

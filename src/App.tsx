import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { CheckCircle2, Circle, Clock, Calendar, Trash2, Plus, Play, Download } from 'lucide-react'

type Priority = 'low' | 'medium' | 'high' | 'asap'

interface Task {
  id: string
  title: string
  duration: number
  priority: Priority
  due?: string
  completed: boolean
  scheduledStart?: string
  tags: string[]
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', duration: 60, priority: 'medium' as Priority, due: '' })

  useEffect(() => {
    const saved = localStorage.getItem('openmotion-tasks')
    if (saved) setTasks(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('openmotion-tasks', JSON.stringify(tasks))
  }, [tasks])

  const addTask = () => {
    if (!newTask.title) return
    const task: Task = {
      id: Date.now().toString(),
      ...newTask,
      due: newTask.due || undefined,
      completed: false,
      tags: [],
      scheduledStart: dayjs().add(15, 'minute').format()
    }
    setTasks([...tasks, task])
    setNewTask({ title: '', duration: 60, priority: 'medium', due: '' })
    setShowAdd(false)
  }

  const toggleComplete = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  const priorityColor = (p: Priority) => {
    const colors = { asap: 'red', high: 'orange', medium: 'blue', low: 'gray' }
    return colors[p]
  }

  const exportToCalendar = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//OpenMotion//Task Planner//EN',
      ...tasks.filter(t => !t.completed && t.scheduledStart).map(task => {
        const start = dayjs(task.scheduledStart).format('YYYYMMDDTHHmmss')
        const end = dayjs(task.scheduledStart).add(task.duration, 'minute').format('YYYYMMDDTHHmmss')
        return [
          'BEGIN:VEVENT',
          `UID:${task.id}@openmotion.app`,
          `DTSTAMP:${start}`,
          `DTSTART:${start}`,
          `DTEND:${end}`,
          `SUMMARY:${task.title}`,
          `DESCRIPTION:Priority: ${task.priority.toUpperCase()}`,
          'END:VEVENT'
        ].join('\r\n')
      }),
      'END:VCALENDAR'
    ].join('\r\n')

    const blob = new Blob([icsContent], { type: 'text/calendar' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `tasks-${dayjs().format('YYYY-MM-DD')}.ics`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px', fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>OpenMotion - Task Planner</h1>
      
      <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Quick Add Task</h2>
        
        {!showAdd ? (
          <button onClick={() => setShowAdd(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}>
            <Plus size={20} /> Add New Task
          </button>
        ) : (
          <div>
            <input value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} placeholder="Task title" style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '16px', marginBottom: '12px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px', color: '#6b7280' }}>Duration (min)</label>
                <input type="number" value={newTask.duration} onChange={(e) => setNewTask({ ...newTask, duration: parseInt(e.target.value) })} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px', color: '#6b7280' }}>Priority</label>
                <select value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Priority })} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="asap">ASAP</option>
                </select>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px', color: '#6b7280' }}>Due Date</label>
              <input type="datetime-local" value={newTask.due} onChange={(e) => setNewTask({ ...newTask, due: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={addTask} style={{ padding: '10px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Add Task</button>
              <button onClick={() => setShowAdd(false)} style={{ padding: '10px 20px', background: '#e5e7eb', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Tasks ({tasks.filter(t => !t.completed).length})</h2>
          {tasks.length > 0 && (
            <button onClick={exportToCalendar} style={{ background: '#8b5cf6', color: 'white', padding: '12px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
              <Download size={18} /> Export to Calendar
            </button>
          )}
        </div>
        {tasks.length === 0 ? (
          <p style={{ color: '#9ca3af' }}>No tasks yet. Add your first task above!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tasks.map(task => (
              <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                <button onClick={() => toggleComplete(task.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  {task.completed ? <CheckCircle2 size={24} color="#10b981" /> : <Circle size={24} color="#9ca3af" />}
                </button>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '500', textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</h3>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '4px', fontSize: '14px', color: '#6b7280' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {task.duration}m</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: priorityColor(task.priority) }}>!{task.priority.toUpperCase()}</span>
                    {task.due && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14} /> {dayjs(task.due).format('MMM D, h:mm A')}</span>}
                    {task.scheduledStart && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Play size={14} /> {dayjs(task.scheduledStart).format('h:mm A')}</span>}
                  </div>
                </div>
                <button onClick={() => deleteTask(task.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App

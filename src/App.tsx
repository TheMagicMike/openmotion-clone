import { useState } from 'react'

interface Task {
  id: string
  title: string
  duration: number
  priority: number
  due?: Date
  tags: string[]
  completed: boolean
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [quickAdd, setQuickAdd] = useState('')

  const handleQuickAdd = () => {
    // Simple task parsing - in production this would call AI API
    const newTask: Task = {
      id: Date.now().toString(),
      title: quickAdd,
      duration: 60,
      priority: 1,
      tags: [],
      completed: false
    }
    setTasks([...tasks, newTask])
    setQuickAdd('')
  }

  return (
    <div className="container">
      <h1>OpenMotion - Task Planner</h1>
      
      <div className="card">
        <h2>Quick Add Task</h2>
        <div className="row">
          <input 
            type="text" 
            placeholder="e.g., Write blog post #content 60m by Thu 5pm !2"
            value={quickAdd}
            onChange={(e) => setQuickAdd(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleQuickAdd()}
            style={{ flex: 1 }}
          />
          <button onClick={handleQuickAdd}>Add Task</button>
        </div>
        <p className="muted">AI-powered parsing coming soon. For now, enter task title.</p>
      </div>

      <div className="card">
        <h2>Tasks ({tasks.length})</h2>
        {tasks.length === 0 ? (
          <p className="muted">No tasks yet. Add your first task above!</p>
        ) : (
          <div>
            {tasks.map(task => (
              <div key={task.id} className="row" style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
                <input 
                  type="checkbox" 
                  checked={task.completed}
                  onChange={() => {
                    setTasks(tasks.map(t => 
                      t.id === task.id ? { ...t, completed: !t.completed } : t
                    ))
                  }}
                />
                <span style={{ flex: 1, textDecoration: task.completed ? 'line-through' : 'none' }}>
                  {task.title}
                </span>
                <span className="badge">{task.duration}m</span>
                <span className="pill">Priority {task.priority}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h2>Features</h2>
        <ul>
          <li>✅ Quick Add Interface</li>
          <li>🚧 AI-powered task parsing (ChatGPT integration)</li>
          <li>🚧 Auto-scheduler with smart time blocking</li>
          <li>🚧 Calendar sync (.ics export/import)</li>
          <li>🚧 Priority-based scheduling</li>
          <li>🚧 Deep work time windows</li>
        </ul>
        <p className="muted">This is a basic starter. Full Motion features to be implemented!</p>
      </div>
    </div>
  )
}

export default App

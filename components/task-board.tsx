"use client"

import { useState } from "react"
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import {
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Task, TeamMember } from "../lib/types"
import { formatDate } from "../lib/utils"
import { Plus, Users, Calendar, GripVertical } from "lucide-react"

interface TaskBoardProps {
  tasks: Task[]
  teamMembers: TeamMember[]
  onUpdateTask: (task: Task) => void
  onCreateTask: (task: Omit<Task, 'id' | 'createdAt'>) => void
}

interface Column {
  id: string
  title: string
  status: Task['status']
}

const columns: Column[] = [
  { id: 'todo', title: 'To Do', status: 'todo' },
  { id: 'in-progress', title: 'In Progress', status: 'in-progress' },
  { id: 'done', title: 'Done', status: 'done' },
]

interface TaskCardProps {
  task: Task
  teamMembers: TeamMember[]
}

function TaskCard({ task, teamMembers }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const assignee = teamMembers.find(member => member.id === task.assigneeId)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'secondary'
    }
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`cursor-grab hover:shadow-lg transition-all bg-white/80 dark:bg-slate-800/80 backdrop-blur border border-white/20 dark:border-slate-700/50 shadow-sm ${
        isDragging ? 'opacity-50' : ''
      }`}
      {...attributes}
      {...listeners}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-sm leading-tight flex-1 pr-2">{task.title}</h4>
          <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </div>
        
        {task.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {task.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <Badge variant={getPriorityColor(task.priority)} className="text-xs">
            {task.priority.toUpperCase()}
          </Badge>
          
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            {assignee && (
              <div className="flex items-center space-x-1">
                <Users className="h-3 w-3" />
                <span>{assignee.name.split(' ')[0]}</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(task.dueDate).split(',')[0]}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface ColumnProps {
  column: Column
  tasks: Task[]
  teamMembers: TeamMember[]
}

function Column({ column, tasks, teamMembers }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  })

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
          {column.title}
        </h3>
        <Badge variant="secondary" className="text-xs">
          {tasks.length}
        </Badge>
      </div>
      
      <div 
        ref={setNodeRef}
        className={`flex-1 min-h-[200px] bg-white/40 dark:bg-slate-800/40 backdrop-blur rounded-lg p-3 transition-colors border border-white/30 dark:border-slate-700/50 ${
          isOver ? 'bg-primary/20 border-2 border-primary border-dashed' : ''
        }`}
      >
        <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {tasks.map(task => (
              <TaskCard key={task.id} task={task} teamMembers={teamMembers} />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  )
}

interface CreateTaskDialogProps {
  teamMembers: TeamMember[]
  onCreateTask: (task: Omit<Task, 'id' | 'createdAt'>) => void
}

function CreateTaskDialog({ teamMembers, onCreateTask }: CreateTaskDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<Task['priority']>("medium")
  const [assigneeId, setAssigneeId] = useState("")
  const [dueDate, setDueDate] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !assigneeId || !dueDate) return

    const newTask: Omit<Task, 'id' | 'createdAt'> = {
      title: title.trim(),
      description: description.trim(),
      status: 'todo',
      priority,
      assigneeId,
      dueDate,
    }

    onCreateTask(newTask)
    
    // Reset form
    setTitle("")
    setDescription("")
    setPriority("medium")
    setAssigneeId("")
    setDueDate("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mb-6">
          <Plus className="h-4 w-4 mr-2" />
          Add New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 border-0">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create New Task
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              className="w-full min-h-[80px] px-3 py-2 border border-input bg-background rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(value: Task['priority']) => setPriority(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="assignee">Assignee *</Label>
              <Select value={assigneeId} onValueChange={setAssigneeId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map(member => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="dueDate">Due Date *</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Create Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function TaskBoard({ tasks, teamMembers, onUpdateTask, onCreateTask }: TaskBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const task = tasks.find(t => t.id === active.id)
    setActiveTask(task || null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (!over) return
    
    const taskId = active.id as string
    const task = tasks.find(t => t.id === taskId)
    
    if (!task) return
    
    // Determine new status based on drop zone
    let newStatus: Task['status'] = task.status
    
    // Check if dropped on a column
    const overId = over.id as string
    if (columns.some(col => col.id === overId)) {
      newStatus = overId as Task['status']
    } else {
      // If dropped on another task, get the status of that task's column
      const overTask = tasks.find(t => t.id === overId)
      if (overTask) {
        newStatus = overTask.status
      }
    }
    
    if (newStatus !== task.status) {
      onUpdateTask({ ...task, status: newStatus })
    }
    
    setActiveTask(null)
  }

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
        <CreateTaskDialog teamMembers={teamMembers} onCreateTask={onCreateTask} />
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
          {columns.map(column => (
            <div key={column.id} id={column.id}>
              <Column
                column={column}
                tasks={getTasksByStatus(column.status)}
                teamMembers={teamMembers}
              />
            </div>
          ))}
        </div>
        
        <DragOverlay>
          {activeTask ? (
            <TaskCard task={activeTask} teamMembers={teamMembers} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
} 
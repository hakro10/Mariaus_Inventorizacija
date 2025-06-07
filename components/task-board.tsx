"use client"

import { useState } from "react"
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
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
import { Plus, Users, Calendar, GripVertical, Clock, MessageSquare, Tag, User, Trash2, Archive } from "lucide-react"

interface TaskBoardProps {
  tasks: Task[]
  teamMembers: TeamMember[]
  onUpdateTask: (task: Task) => void
  onCreateTask: (task: Omit<Task, 'id' | 'createdAt'>) => void
  onDeleteTask?: (taskId: string) => void
  onCreateHistoryTask?: (task: Task) => void
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
  { id: 'history', title: 'History', status: 'history' },
]

interface TaskCardProps {
  task: Task
  teamMembers: TeamMember[]
  onTaskClick?: (task: Task) => void
  onDeleteTask?: (taskId: string) => void
}

function TaskCard({ task, teamMembers, onTaskClick, onDeleteTask }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    disabled: task.status === 'history', // Disable drag for history tasks
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const assignee = teamMembers.find(member => member.id === task.assigneeId)
  const isHistoryTask = task.status === 'history'

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'secondary'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'away': return 'bg-yellow-500'
      case 'busy': return 'bg-red-500'
      case 'offline': return 'bg-gray-500'
      default: return 'bg-green-500'
    }
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking on delete button
    const target = e.target as HTMLElement
    if (target.closest('.delete-button')) {
      return
    }
    onTaskClick?.(task)
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onDeleteTask && confirm('Are you sure you want to delete this task?')) {
      onDeleteTask(task.id)
    }
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`${isHistoryTask ? 'cursor-default' : 'cursor-grab'} hover:shadow-xl hover:scale-105 transition-all duration-200 ${
        isHistoryTask 
          ? 'bg-slate-50 dark:bg-slate-800/60 border-slate-300 dark:border-slate-600' 
          : 'bg-white dark:bg-slate-800 border'
      } shadow-sm group ${
        isDragging ? 'opacity-50 cursor-grabbing' : ''
      } ${isHistoryTask ? 'opacity-80' : ''}`}
      onClick={handleCardClick}
      {...(!isHistoryTask ? attributes : {})}
      {...(!isHistoryTask ? listeners : {})}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="task-content flex-1 pr-2 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-sm leading-tight mb-1 flex-1 break-words pr-2">{task.title}</h4>
              <div className="flex items-center space-x-1 flex-shrink-0">
                {isHistoryTask && (
                  <Archive className="h-4 w-4 text-muted-foreground" />
                )}
                {!isHistoryTask && onDeleteTask && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="delete-button h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20"
                    onClick={handleDeleteClick}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
                {!isHistoryTask && <GripVertical className="h-4 w-4 text-muted-foreground" />}
              </div>
            </div>
            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {task.tags.slice(0, 2).map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0">
                    {tag}
                  </Badge>
                ))}
                {task.tags.length > 2 && (
                  <Badge variant="outline" className="text-xs px-1.5 py-0">
                    +{task.tags.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
        
        {task.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2 break-words">
            {task.description}
          </p>
        )}
        
        {/* Time tracking */}
        {(task.estimatedHours || task.actualHours) && (
          <div className="flex items-center space-x-2 mb-3 text-xs text-muted-foreground">
            <Clock className="h-3 w-3 flex-shrink-0" />
            <span className="flex-shrink-0">
              {task.actualHours ? `${task.actualHours}h` : '0h'} / {task.estimatedHours || 0}h
            </span>
            {task.estimatedHours && task.actualHours && task.actualHours > task.estimatedHours && (
              <Badge variant="destructive" className="text-xs">Over</Badge>
            )}
            {isHistoryTask && task.actualHours && (
              <Badge variant="secondary" className="text-xs">Completed</Badge>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <Badge variant={getPriorityColor(task.priority)} className="text-xs flex-shrink-0">
              {task.priority.toUpperCase()}
            </Badge>
            
            {task.comments && task.comments.length > 0 && (
              <div className="flex items-center space-x-1 text-xs text-muted-foreground flex-shrink-0">
                <MessageSquare className="h-3 w-3" />
                <span>{task.comments.length}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 flex-shrink-0" />
              <span className="hidden sm:inline whitespace-nowrap">{formatDate(task.dueDate).split(',')[0]}</span>
            </div>
            {assignee && (
              <div className="flex items-center space-x-1 ml-1">
                <div className="relative flex-shrink-0">
                  <img
                    src={assignee.avatar}
                    alt={assignee.name}
                    className="w-7 h-7 rounded-full object-cover border-2 border-white shadow-sm"
                    onError={(e) => {
                      // Fallback if image fails to load
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const fallback = target.nextElementSibling as HTMLElement
                      if (fallback) fallback.style.display = 'flex'
                    }}
                  />
                  <div 
                    className="hidden w-7 h-7 rounded-full bg-slate-300 dark:bg-slate-600 items-center justify-center text-xs font-medium border-2 border-white shadow-sm"
                    style={{ display: 'none' }}
                  >
                    {assignee.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-white ${getStatusColor(assignee.status)}`} />
                </div>
                <span className="text-xs text-muted-foreground hidden lg:inline max-w-[60px] truncate">
                  {assignee.name.split(' ')[0]}
                </span>
              </div>
            )}
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
  onTaskClick?: (task: Task) => void
  onDeleteTask?: (taskId: string) => void
}

function Column({ column, tasks, teamMembers, onTaskClick, onDeleteTask }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    disabled: column.id === 'history', // Disable drop for history column
  })

  const isHistoryColumn = column.id === 'history'
  
  // Sort history tasks by date (most recent first) and group by date
  const processedTasks = isHistoryColumn 
    ? tasks.sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
    : tasks
  
  const renderHistoryTasks = () => {
    if (!isHistoryColumn) return null
    
    const groupedTasks: { [key: string]: typeof tasks } = {}
    
    processedTasks.forEach(task => {
      const date = new Date(task.updatedAt || task.createdAt).toDateString()
      if (!groupedTasks[date]) {
        groupedTasks[date] = []
      }
      groupedTasks[date].push(task)
    })
    
    return Object.entries(groupedTasks).map(([dateString, dateTasks]) => (
      <div key={dateString}>
        <div className="sticky top-0 bg-slate-100 dark:bg-slate-800/40 -mx-3 px-3 py-2 mb-3 border-b border-slate-300 dark:border-slate-600">
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
            {new Date(dateString).toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        </div>
        <div className="space-y-3 mb-6">
          {dateTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              teamMembers={teamMembers} 
              onTaskClick={onTaskClick}
              onDeleteTask={undefined}
            />
          ))}
        </div>
      </div>
    ))
  }

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-280px)]">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h3 className={`font-semibold text-sm uppercase tracking-wide ${
          isHistoryColumn ? 'text-slate-500' : 'text-muted-foreground'
        }`}>
          {column.title}
        </h3>
        <Badge variant={isHistoryColumn ? "outline" : "secondary"} className="text-xs">
          {tasks.length}
        </Badge>
      </div>
      
      <div 
        ref={setNodeRef}
        className={`flex-1 rounded-lg p-3 transition-colors border overflow-y-auto scrollbar scrollbar-thumb-slate-400 scrollbar-track-slate-200 dark:scrollbar-thumb-slate-600 dark:scrollbar-track-slate-800 scrollbar-thin hover:scrollbar-thumb-slate-500 dark:hover:scrollbar-thumb-slate-500 ${
          isHistoryColumn 
            ? 'bg-slate-100 dark:bg-slate-800/20 border-slate-300 dark:border-slate-600' 
            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/50'
        } ${
          isOver && !isHistoryColumn ? 'bg-primary/20 border-2 border-primary border-dashed' : ''
        }`}
        style={{
          maxHeight: 'calc(100vh - 320px)',
        }}
      >
        <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
          {isHistoryColumn ? (
            <div>
              {tasks.length === 0 ? (
                <div className="text-center text-sm text-muted-foreground py-8">
                  <Archive className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No completed tasks yet</p>
                  <p className="text-xs mt-1">Tasks moved to Done will automatically appear here</p>
                </div>
              ) : (
                renderHistoryTasks()
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  teamMembers={teamMembers} 
                  onTaskClick={onTaskClick}
                  onDeleteTask={onDeleteTask}
                />
              ))}
              {tasks.length === 0 && (
                <div className="text-center text-sm text-muted-foreground py-8">
                  <div className="h-8 w-8 mx-auto mb-2 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center opacity-50">
                    <div className="w-3 h-3 rounded-full bg-slate-400 dark:bg-slate-500" />
                  </div>
                  <p>No tasks</p>
                  <p className="text-xs mt-1">Drag tasks here or create new ones</p>
                </div>
              )}
            </div>
          )}
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
  const [estimatedHours, setEstimatedHours] = useState("")
  const [tags, setTags] = useState("")

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
      estimatedHours: estimatedHours ? parseFloat(estimatedHours) : undefined,
      tags: tags.trim() ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
      comments: []
    }

    onCreateTask(newTask)
    
    // Reset form
    setTitle("")
    setDescription("")
    setPriority("medium")
    setAssigneeId("")
    setDueDate("")
    setEstimatedHours("")
    setTags("")
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
              <Label htmlFor="estimatedHours">Estimated Hours</Label>
              <Input
                id="estimatedHours"
                type="number"
                min="0"
                step="0.5"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                placeholder="0"
              />
            </div>
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
                    <div className="flex items-center space-x-2">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <div>
                        <span>{member.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">({member.department})</span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Enter tags separated by commas"
            />
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

interface TaskDetailModalProps {
  task: Task | null
  teamMembers: TeamMember[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateTask: (task: Task) => void
}

function TaskDetailModal({ task, teamMembers, open, onOpenChange, onUpdateTask }: TaskDetailModalProps) {
  if (!task) return null

  const assignee = teamMembers.find(member => member.id === task.assigneeId)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'secondary'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'away': return 'bg-yellow-500'
      case 'busy': return 'bg-red-500'
      case 'offline': return 'bg-gray-500'
      default: return 'bg-green-500'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-xl">{task.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Task Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Priority</Label>
              <div className="mt-1">
                <Badge variant={getPriorityColor(task.priority)}>
                  {task.priority.toUpperCase()}
                </Badge>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Status</Label>
              <div className="mt-1">
                <Badge variant="outline">{task.status.replace('-', ' ').toUpperCase()}</Badge>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Due Date</Label>
              <p className="mt-1 text-sm">{formatDate(task.dueDate)}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Created</Label>
              <p className="mt-1 text-sm">{formatDate(task.createdAt)}</p>
            </div>
          </div>

          {/* Assignee */}
          {assignee && (
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Assignee</Label>
              <div className="flex items-center space-x-3 mt-2">
                <div className="relative">
                  <img
                    src={assignee.avatar}
                    alt={assignee.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(assignee.status)}`} />
                </div>
                <div>
                  <p className="font-medium">{assignee.name}</p>
                  <p className="text-sm text-muted-foreground">{assignee.department} • {assignee.role}</p>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Description</Label>
            <p className="mt-2 text-sm leading-relaxed">{task.description}</p>
          </div>

          {/* Time Tracking */}
          {(task.estimatedHours || task.actualHours) && (
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Time Tracking</Label>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Estimated: {task.estimatedHours || 0} hours</span>
                  <span>Actual: {task.actualHours || 0} hours</span>
                </div>
                {task.estimatedHours && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        (task.actualHours || 0) > task.estimatedHours ? 'bg-red-500' : 'bg-blue-500'
                      }`}
                      style={{ 
                        width: `${Math.min(((task.actualHours || 0) / task.estimatedHours) * 100, 100)}%` 
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Tags</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {task.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          {task.comments && task.comments.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Comments</Label>
              <div className="mt-2 space-y-3">
                {task.comments.map(comment => {
                  const author = teamMembers.find(member => member.id === comment.authorId)
                  return (
                    <div key={comment.id} className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="flex items-start space-x-3">
                        {author && (
                          <>
                            <img
                              src={author.avatar}
                              alt={author.name}
                              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="font-medium text-sm">{author.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(comment.createdAt)}
                                </span>
                              </div>
                              <p className="text-sm leading-relaxed">{comment.content}</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function TaskBoard({ tasks, teamMembers, onUpdateTask, onCreateTask, onDeleteTask, onCreateHistoryTask }: TaskBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 8,
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
    
    if (!task || task.status === 'history') return // Prevent moving history tasks
    
    // Determine new status based on drop zone
    let newStatus: Task['status'] = task.status
    
    // Check if dropped on a column
    const overId = over.id as string
    if (columns.some(col => col.id === overId)) {
      // Don't allow dropping into history column
      if (overId === 'history') return
      newStatus = overId as Task['status']
    } else {
      // If dropped on another task, get the status of that task's column
      const overTask = tasks.find(t => t.id === overId)
      if (overTask && overTask.status !== 'history') {
        newStatus = overTask.status
      }
    }
    
    if (newStatus !== task.status) {
      const updatedTask = { ...task, status: newStatus, updatedAt: new Date().toISOString() }
      onUpdateTask(updatedTask)
      
      // If task is moved to 'done', automatically create a copy in history
      if (newStatus === 'done' && onCreateHistoryTask) {
        const historyTask: Task = {
          ...updatedTask,
          id: `${task.id}-history-${Date.now()}`, // Create unique ID for history copy
          status: 'history',
          updatedAt: new Date().toISOString(),
          comments: [
            ...(task.comments || []),
            {
              id: `comment-${Date.now()}`,
              taskId: '',
              authorId: task.assigneeId,
              content: `Task completed and archived on ${new Date().toLocaleDateString()}`,
              createdAt: new Date().toISOString()
            }
          ]
        }
        onCreateHistoryTask(historyTask)
      }
    }
    
    setActiveTask(null)
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setIsDetailModalOpen(true)
  }

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status)
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between flex-shrink-0">
        <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
        <CreateTaskDialog teamMembers={teamMembers} onCreateTask={onCreateTask} />
      </div>

      <div className="flex-1 min-h-0">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 h-full">
            {columns.map(column => (
              <div key={column.id} id={column.id} className="flex flex-col min-h-0">
                <Column
                  column={column}
                  tasks={getTasksByStatus(column.status)}
                  teamMembers={teamMembers}
                  onTaskClick={handleTaskClick}
                  onDeleteTask={onDeleteTask}
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

      <TaskDetailModal
        task={selectedTask}
        teamMembers={teamMembers}
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        onUpdateTask={onUpdateTask}
      />
    </div>
  )
} 
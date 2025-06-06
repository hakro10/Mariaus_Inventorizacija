export interface InventoryItem {
  id: string
  name: string
  quantity: number
  purchasePrice: number
  purchaseDate: string
  purchasedFrom: string
  serialNumber?: string
  categoryId?: string
  locationId?: string
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'sold' | 'damaged'
  minStockLevel?: number
  internalId: string
  qrCode?: string
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  description?: string
  color: string
  itemCount: number
  createdAt: string
}

export interface Location {
  id: string
  name: string
  description?: string
  level: number
  parentId?: string
  qrCode?: string
  qrCodeImage?: string
  capacity?: number
  currentUsage?: number
  items?: InventoryItem[]
  createdAt: string
  updatedAt?: string
}

export interface Sale {
  id: string
  inventoryItemId: string
  quantitySold: number
  soldPrice: number
  soldTo: string
  soldDate: string
  profit: number
  createdAt: string
  // Seller credentials
  sellerName: string
  sellerEmail: string
  customerPhone?: string
}

export interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'done' | 'history'
  priority: 'low' | 'medium' | 'high'
  assigneeId: string
  dueDate: string
  createdAt: string
  updatedAt?: string
  estimatedHours?: number
  actualHours?: number
  tags?: string[]
  comments?: TaskComment[]
  attachments?: string[]
}

export interface TaskComment {
  id: string
  taskId: string
  authorId: string
  content: string
  createdAt: string
}

export interface TeamMember {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'user'
  avatar: string
  department?: string
  phone?: string
  status: 'active' | 'away' | 'busy' | 'offline'
  createdAt: string
}

export interface DashboardStats {
  totalItems: number
  totalValue: number
  lowStockAlerts: number
  totalSales: number
  monthlyProfit: number
  weeklySales: number
} 
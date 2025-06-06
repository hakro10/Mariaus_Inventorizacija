import { InventoryItem, Category, Location, Sale, Task, TeamMember, DashboardStats } from './types'
import { generateId, generateInternalId, generateSerialNumber } from './utils'

// Categories
export const mockCategories: Category[] = [
  {
    id: generateId(),
    name: 'Electronics',
    description: 'Electronic devices and components',
    color: '#3B82F6',
    itemCount: 4,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: generateId(),
    name: 'Furniture',
    description: 'Office and home furniture',
    color: '#10B981',
    itemCount: 3,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: generateId(),
    name: 'Office Supplies',
    description: 'General office supplies and stationery',
    color: '#F59E0B',
    itemCount: 2,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: generateId(),
    name: 'Tools',
    description: 'Hardware tools and equipment',
    color: '#EF4444',
    itemCount: 1,
    createdAt: '2024-01-01T00:00:00Z'
  }
]

// Locations - Created step by step to avoid circular references
const warehouseAId = generateId()
const zone1Id = generateId()

export const mockLocations: Location[] = [
  {
    id: warehouseAId,
    name: 'Warehouse A',
    description: 'Main warehouse facility',
    level: 1,
    capacity: 1000,
    currentUsage: 750,
    qrCode: 'WH-A-001',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: zone1Id,
    name: 'Zone 1',
    description: 'Electronics zone',
    level: 2,
    parentId: warehouseAId,
    capacity: 300,
    currentUsage: 245,
    qrCode: 'WH-A-Z1-001',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: generateId(),
    name: 'Aisle A',
    description: 'First aisle in Zone 1',
    level: 3,
    parentId: zone1Id,
    capacity: 100,
    currentUsage: 85,
    qrCode: 'WH-A-Z1-A1-001',
    createdAt: '2024-01-01T00:00:00Z'
  }
]

// Team Members
export const mockTeamMembers: TeamMember[] = [
  {
    id: generateId(),
    name: 'John Smith',
    email: 'john.smith@company.com',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: generateId(),
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'manager',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: generateId(),
    name: 'Mike Davis',
    email: 'mike.davis@company.com',
    role: 'user',
    createdAt: '2024-01-01T00:00:00Z'
  }
]

// Inventory Items
export const mockInventoryItems: InventoryItem[] = [
  {
    id: generateId(),
    name: 'Dell Laptop XPS 13',
    quantity: 5,
    purchasePrice: 1200,
    purchaseDate: '2024-01-15',
    purchasedFrom: 'Dell Direct',
    serialNumber: generateSerialNumber('DL-XPS13'),
    categoryId: mockCategories[0].id,
    locationId: mockLocations[1].id,
    status: 'in-stock',
    minStockLevel: 2,
    internalId: generateInternalId(),
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: generateId(),
    name: 'Office Chair Ergonomic',
    quantity: 1,
    purchasePrice: 350,
    purchaseDate: '2024-01-10',
    purchasedFrom: 'Office Depot',
    categoryId: mockCategories[1].id,
    locationId: mockLocations[0].id,
    status: 'low-stock',
    minStockLevel: 3,
    internalId: generateInternalId(),
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  },
  {
    id: generateId(),
    name: 'Wireless Mouse Logitech',
    quantity: 15,
    purchasePrice: 45,
    purchaseDate: '2024-01-05',
    purchasedFrom: 'Amazon',
    serialNumber: generateSerialNumber('LG-M705'),
    categoryId: mockCategories[0].id,
    locationId: mockLocations[2].id,
    status: 'in-stock',
    minStockLevel: 5,
    internalId: generateInternalId(),
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z'
  },
  {
    id: generateId(),
    name: 'iPhone 15 Pro',
    quantity: 8,
    purchasePrice: 999,
    purchaseDate: '2024-01-20',
    purchasedFrom: 'Apple Store',
    serialNumber: generateSerialNumber('IP-15P'),
    categoryId: mockCategories[0].id,
    locationId: mockLocations[1].id,
    status: 'in-stock',
    minStockLevel: 3,
    internalId: generateInternalId(),
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z'
  },
  {
    id: generateId(),
    name: 'Standing Desk Adjustable',
    quantity: 3,
    purchasePrice: 450,
    purchaseDate: '2024-01-12',
    purchasedFrom: 'IKEA',
    categoryId: mockCategories[1].id,
    locationId: mockLocations[0].id,
    status: 'in-stock',
    minStockLevel: 2,
    internalId: generateInternalId(),
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z'
  },
  {
    id: generateId(),
    name: 'Printer Paper A4 - 500 sheets',
    quantity: 25,
    purchasePrice: 8,
    purchaseDate: '2024-01-08',
    purchasedFrom: 'Staples',
    categoryId: mockCategories[2].id,
    locationId: mockLocations[2].id,
    status: 'in-stock',
    minStockLevel: 10,
    internalId: generateInternalId(),
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-01-08T00:00:00Z'
  },
  {
    id: generateId(),
    name: 'Drill Set Professional',
    quantity: 0,
    purchasePrice: 180,
    purchaseDate: '2024-01-03',
    purchasedFrom: 'Home Depot',
    serialNumber: generateSerialNumber('HD-DRILL'),
    categoryId: mockCategories[3].id,
    locationId: mockLocations[0].id,
    status: 'out-of-stock',
    minStockLevel: 2,
    internalId: generateInternalId(),
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-25T00:00:00Z'
  },
  {
    id: generateId(),
    name: 'Monitor 27" 4K Dell',
    quantity: 6,
    purchasePrice: 320,
    purchaseDate: '2024-01-18',
    purchasedFrom: 'Dell Direct',
    serialNumber: generateSerialNumber('DL-MON27'),
    categoryId: mockCategories[0].id,
    locationId: mockLocations[1].id,
    status: 'in-stock',
    minStockLevel: 2,
    internalId: generateInternalId(),
    createdAt: '2024-01-18T00:00:00Z',
    updatedAt: '2024-01-18T00:00:00Z'
  },
  {
    id: generateId(),
    name: 'Filing Cabinet 4-Drawer',
    quantity: 2,
    purchasePrice: 125,
    purchaseDate: '2024-01-14',
    purchasedFrom: 'Office Depot',
    categoryId: mockCategories[1].id,
    locationId: mockLocations[0].id,
    status: 'low-stock',
    minStockLevel: 4,
    internalId: generateInternalId(),
    createdAt: '2024-01-14T00:00:00Z',
    updatedAt: '2024-01-14T00:00:00Z'
  },
  {
    id: generateId(),
    name: 'Whiteboard Markers Set',
    quantity: 12,
    purchasePrice: 15,
    purchaseDate: '2024-01-07',
    purchasedFrom: 'Amazon',
    categoryId: mockCategories[2].id,
    locationId: mockLocations[2].id,
    status: 'in-stock',
    minStockLevel: 5,
    internalId: generateInternalId(),
    createdAt: '2024-01-07T00:00:00Z',
    updatedAt: '2024-01-07T00:00:00Z'
  }
]

// Sales
export const mockSales: Sale[] = [
  {
    id: generateId(),
    inventoryItemId: mockInventoryItems[0].id,
    quantitySold: 2,
    soldPrice: 2600,
    soldTo: 'Tech Startup Inc.',
    soldDate: '2024-01-20',
    profit: 200,
    createdAt: '2024-01-20T00:00:00Z',
    sellerName: 'Sarah Johnson',
    sellerEmail: 'sarah.johnson@company.com',
    customerPhone: '+1 (555) 123-4567'
  }
]

// Tasks
export const mockTasks: Task[] = [
  {
    id: generateId(),
    title: 'Inventory Audit - Zone 1',
    description: 'Complete physical count of all items in Zone 1 electronics section',
    status: 'in-progress',
    priority: 'high',
    assigneeId: mockTeamMembers[1].id,
    dueDate: '2024-02-01',
    createdAt: '2024-01-25T00:00:00Z'
  },
  {
    id: generateId(),
    title: 'Restock Office Chairs',
    description: 'Order new office chairs - running low on inventory. Contact supplier.',
    status: 'todo',
    priority: 'medium',
    assigneeId: mockTeamMembers[2].id,
    dueDate: '2024-01-30',
    createdAt: '2024-01-26T00:00:00Z'
  },
  {
    id: generateId(),
    title: 'Update QR Code Labels',
    description: 'Print and apply new QR codes to recently moved items',
    status: 'done',
    priority: 'low',
    assigneeId: mockTeamMembers[0].id,
    dueDate: '2024-01-25',
    createdAt: '2024-01-20T00:00:00Z'
  },
  {
    id: generateId(),
    title: 'System Backup & Maintenance',
    description: 'Perform monthly system backup and database maintenance tasks',
    status: 'todo',
    priority: 'high',
    assigneeId: mockTeamMembers[0].id,
    dueDate: '2024-02-05',
    createdAt: '2024-01-27T00:00:00Z'
  },
  {
    id: generateId(),
    title: 'Train New Employee',
    description: 'Conduct orientation training for new warehouse staff member',
    status: 'in-progress',
    priority: 'medium',
    assigneeId: mockTeamMembers[1].id,
    dueDate: '2024-02-03',
    createdAt: '2024-01-28T00:00:00Z'
  },
  {
    id: generateId(),
    title: 'Review Supplier Contracts',
    description: 'Annual review of supplier contracts and pricing agreements',
    status: 'done',
    priority: 'medium',
    assigneeId: mockTeamMembers[0].id,
    dueDate: '2024-01-20',
    createdAt: '2024-01-15T00:00:00Z'
  }
]

// Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  totalItems: mockInventoryItems.reduce((sum, item) => sum + item.quantity, 0),
  totalValue: mockInventoryItems.reduce((sum, item) => sum + (item.quantity * item.purchasePrice), 0),
  lowStockAlerts: mockInventoryItems.filter(item => item.status === 'low-stock').length,
  totalSales: mockSales.reduce((sum, sale) => sum + sale.soldPrice, 0),
  monthlyProfit: mockSales.reduce((sum, sale) => sum + sale.profit, 0),
  weeklySales: 3
} 
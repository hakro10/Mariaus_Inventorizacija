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
    name: 'Vilnius',
    description: 'Pagrindinis miestas',
    level: 1,
    capacity: 1000,
    currentUsage: 750,
    qrCode: 'LOC-VIL-L1-001',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: zone1Id,
    name: 'Sandėlys Nr. 1',
    description: 'Elektronikos sandėlys',
    level: 2,
    parentId: warehouseAId,
    capacity: 300,
    currentUsage: 245,
    qrCode: 'LOC-SAN-L2-001',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: generateId(),
    name: 'Sekcija A',
    description: 'Pirmoji sekcija sandėlyje',
    level: 3,
    parentId: zone1Id,
    capacity: 100,
    currentUsage: 85,
    qrCode: 'LOC-SEK-L3-001',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
]

// Team Members
export const mockTeamMembers: TeamMember[] = [
  {
    id: generateId(),
    name: 'John Smith',
    email: 'john.smith@company.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format',
    department: 'Management',
    phone: '+1 (555) 123-0001',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: generateId(),
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'manager',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face&auto=format',
    department: 'Operations',
    phone: '+1 (555) 123-0002',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: generateId(),
    name: 'Mike Davis',
    email: 'mike.davis@company.com',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face&auto=format',
    department: 'Warehouse',
    phone: '+1 (555) 123-0003',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: generateId(),
    name: 'Emily Chen',
    email: 'emily.chen@company.com',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face&auto=format',
    department: 'Quality Control',
    phone: '+1 (555) 123-0004',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: generateId(),
    name: 'Alex Rodriguez',
    email: 'alex.rodriguez@company.com',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format',
    department: 'IT',
    phone: '+1 (555) 123-0005',
    status: 'away',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: generateId(),
    name: 'Lisa Wang',
    email: 'lisa.wang@company.com',
    role: 'manager',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face&auto=format',
    department: 'Logistics',
    phone: '+1 (555) 123-0006',
    status: 'busy',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: generateId(),
    name: 'James Wilson',
    email: 'james.wilson@company.com',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f82?w=150&h=150&fit=crop&crop=face&auto=format',
    department: 'Security',
    phone: '+1 (555) 123-0007',
    status: 'active',
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
    createdAt: '2024-01-25T00:00:00Z',
    updatedAt: '2024-01-27T10:30:00Z',
    estimatedHours: 8,
    actualHours: 5,
    tags: ['audit', 'electronics', 'urgent'],
    comments: [
      {
        id: generateId(),
        taskId: '',
        authorId: mockTeamMembers[1].id,
        content: 'Started the audit this morning. Zone 1A completed, moving to 1B.',
        createdAt: '2024-01-27T10:30:00Z'
      }
    ]
  },
  {
    id: generateId(),
    title: 'Restock Office Chairs',
    description: 'Order new office chairs - running low on inventory. Contact supplier.',
    status: 'todo',
    priority: 'medium',
    assigneeId: mockTeamMembers[2].id,
    dueDate: '2024-01-30',
    createdAt: '2024-01-26T00:00:00Z',
    estimatedHours: 3,
    tags: ['procurement', 'furniture'],
    comments: []
  },
  {
    id: generateId(),
    title: 'Update QR Code Labels',
    description: 'Print and apply new QR codes to recently moved items',
    status: 'done',
    priority: 'low',
    assigneeId: mockTeamMembers[0].id,
    dueDate: '2024-01-25',
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-25T16:45:00Z',
    estimatedHours: 4,
    actualHours: 3.5,
    tags: ['labeling', 'maintenance'],
    comments: [
      {
        id: generateId(),
        taskId: '',
        authorId: mockTeamMembers[0].id,
        content: 'All QR codes updated and tested. Task completed successfully.',
        createdAt: '2024-01-25T16:45:00Z'
      }
    ]
  },
  {
    id: generateId(),
    title: 'System Backup & Maintenance',
    description: 'Perform monthly system backup and database maintenance tasks',
    status: 'todo',
    priority: 'high',
    assigneeId: mockTeamMembers[4].id,
    dueDate: '2024-02-05',
    createdAt: '2024-01-27T00:00:00Z',
    estimatedHours: 6,
    tags: ['maintenance', 'system', 'backup'],
    comments: []
  },
  {
    id: generateId(),
    title: 'Train New Employee',
    description: 'Conduct orientation training for new warehouse staff member',
    status: 'in-progress',
    priority: 'medium',
    assigneeId: mockTeamMembers[5].id,
    dueDate: '2024-02-03',
    createdAt: '2024-01-28T00:00:00Z',
    estimatedHours: 12,
    actualHours: 4,
    tags: ['training', 'onboarding'],
    comments: [
      {
        id: generateId(),
        taskId: '',
        authorId: mockTeamMembers[5].id,
        content: 'Day 1 training completed. Employee shows good understanding of safety protocols.',
        createdAt: '2024-01-29T17:00:00Z'
      }
    ]
  },
  {
    id: generateId(),
    title: 'Review Supplier Contracts',
    description: 'Annual review of supplier contracts and pricing agreements',
    status: 'done',
    priority: 'medium',
    assigneeId: mockTeamMembers[0].id,
    dueDate: '2024-01-20',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-20T14:20:00Z',
    estimatedHours: 16,
    actualHours: 18,
    tags: ['contracts', 'procurement', 'annual'],
    comments: [
      {
        id: generateId(),
        taskId: '',
        authorId: mockTeamMembers[0].id,
        content: 'Contract review completed. Negotiated 5% cost reduction with main supplier.',
        createdAt: '2024-01-20T14:20:00Z'
      }
    ]
  },
  {
    id: generateId(),
    title: 'Security System Upgrade',
    description: 'Install new security cameras and update access control system',
    status: 'in-progress',
    priority: 'high',
    assigneeId: mockTeamMembers[6].id,
    dueDate: '2024-02-10',
    createdAt: '2024-01-29T00:00:00Z',
    estimatedHours: 20,
    actualHours: 8,
    tags: ['security', 'hardware', 'upgrade'],
    comments: [
      {
        id: generateId(),
        taskId: '',
        authorId: mockTeamMembers[6].id,
        content: 'Cameras installed in zones 1-3. Working on access control integration.',
        createdAt: '2024-01-30T11:15:00Z'
      }
    ]
  },
  {
    id: generateId(),
    title: 'Quality Control Testing',
    description: 'Perform quality checks on incoming electronics shipment',
    status: 'todo',
    priority: 'medium',
    assigneeId: mockTeamMembers[3].id,
    dueDate: '2024-02-02',
    createdAt: '2024-01-28T00:00:00Z',
    estimatedHours: 5,
    tags: ['quality', 'testing', 'electronics'],
    comments: []
  },
  {
    id: generateId(),
    title: 'Equipment Maintenance',
    description: 'Monthly maintenance of warehouse equipment and machinery',
    status: 'history',
    priority: 'medium',
    assigneeId: mockTeamMembers[2].id,
    dueDate: '2024-01-15',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T16:30:00Z',
    estimatedHours: 6,
    actualHours: 5.5,
    tags: ['maintenance', 'equipment'],
    comments: [
      {
        id: generateId(),
        taskId: '',
        authorId: mockTeamMembers[2].id,
        content: 'All equipment checked and serviced. Replaced worn belts on conveyor system.',
        createdAt: '2024-01-15T16:30:00Z'
      }
    ]
  },
  {
    id: generateId(),
    title: 'Staff Safety Training',
    description: 'Quarterly safety training session for all warehouse staff',
    status: 'history',
    priority: 'high',
    assigneeId: mockTeamMembers[1].id,
    dueDate: '2024-01-10',
    createdAt: '2023-12-20T00:00:00Z',
    updatedAt: '2024-01-10T14:00:00Z',
    estimatedHours: 8,
    actualHours: 8,
    tags: ['training', 'safety', 'compliance'],
    comments: [
      {
        id: generateId(),
        taskId: '',
        authorId: mockTeamMembers[1].id,
        content: 'Training completed successfully. All 15 staff members attended and passed the safety assessment.',
        createdAt: '2024-01-10T14:00:00Z'
      }
    ]
  },
  {
    id: generateId(),
    title: 'Inventory System Migration',
    description: 'Migrate from old inventory system to new WIMS platform',
    status: 'history',
    priority: 'high',
    assigneeId: mockTeamMembers[4].id,
    dueDate: '2023-12-31',
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: '2023-12-30T18:45:00Z',
    estimatedHours: 40,
    actualHours: 42,
    tags: ['migration', 'system', 'data'],
    comments: [
      {
        id: generateId(),
        taskId: '',
        authorId: mockTeamMembers[4].id,
        content: 'Migration completed ahead of schedule. All data successfully transferred with zero data loss.',
        createdAt: '2023-12-30T18:45:00Z'
      }
    ]
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
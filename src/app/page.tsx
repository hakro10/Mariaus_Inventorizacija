"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Button } from "../../components/ui/button"
import { Header } from "../../components/header"
import { DashboardStatsComponent } from "../../components/dashboard-stats"
import { InventoryGrid } from "../../components/inventory-grid"
import { AddCategoryModal } from "../../components/add-category-modal"
import { AddMemberModal } from "../../components/add-member-modal"
import { AddItemModal } from "../../components/add-item-modal"
import { EditItemModal } from "../../components/edit-item-modal"
import { SellItemModal } from "../../components/sell-item-modal"
import { TaskBoard } from "../../components/task-board"
import { AddLocationModal } from "../../components/add-location-modal"
import { LocationDetailModal } from "../../components/location-detail-modal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { 
  mockInventoryItems, 
  mockCategories, 
  mockLocations, 
  mockSales, 
  mockTasks, 
  mockTeamMembers, 
  mockDashboardStats 
} from "../../lib/mock-data"
import { InventoryItem, Category, Location, Sale, Task, TeamMember, DashboardStats } from "../../lib/types"
import { formatCurrency, formatDate, getLocationLevelName } from "../../lib/utils"
import { Package, Users, ClipboardList, MapPin, Tag, ShoppingCart, Calendar, Clock, AlertCircle, Plus } from "lucide-react"

export default function WarehouseManagementPage() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(mockInventoryItems)
  const [categories, setCategories] = useState<Category[]>(mockCategories)
  const [locations, setLocations] = useState<Location[]>(mockLocations)
  const [sales, setSales] = useState<Sale[]>(mockSales)
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers)
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>(mockDashboardStats)
  
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [addItemOpen, setAddItemOpen] = useState(false)
  const [addCategoryOpen, setAddCategoryOpen] = useState(false)
  const [addMemberOpen, setAddMemberOpen] = useState(false)
  const [addLocationOpen, setAddLocationOpen] = useState(false)
  const [editItemOpen, setEditItemOpen] = useState(false)
  const [sellItemOpen, setSellItemOpen] = useState(false)
  const [locationDetailOpen, setLocationDetailOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)

  // Team member for sales
  const currentUser = teamMembers[1] // Sarah Johnson as default user

  // Filter items based on search and category
  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.internalId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.serialNumber?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory === null || item.categoryId === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const handleAddItem = () => {
    setAddItemOpen(true)
  }

  const handleCreateItem = (newItem: InventoryItem) => {
    setInventoryItems(prev => [...prev, newItem])
    
    // Update category item count
    setCategories(prev => 
      prev.map(category => 
        category.id === newItem.categoryId 
          ? { ...category, itemCount: category.itemCount + 1 }
          : category
      )
    )
    
    // Recalculate dashboard stats
    updateDashboardStats()
  }

  const handleEditItem = (item: InventoryItem) => {
    setSelectedItem(item)
    setEditItemOpen(true)
  }

  const handleSellItem = (item: InventoryItem) => {
    setSelectedItem(item)
    setSellItemOpen(true)
  }

  const handleAddCategory = (newCategory: Category) => {
    setCategories(prev => [...prev, newCategory])
  }

  const handleAddMember = (newMemberData: Omit<TeamMember, 'id' | 'createdAt'>) => {
    const newMember: TeamMember = {
      ...newMemberData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    }
    setTeamMembers(prev => [...prev, newMember])
  }

  const handleUpdateItem = (updatedItem: InventoryItem) => {
    setInventoryItems(prev => 
      prev.map(item => item.id === updatedItem.id ? updatedItem : item)
    )
    
    // Recalculate dashboard stats
    updateDashboardStats()
  }

  const handleCompleteSale = (sale: Sale, quantitySold: number) => {
    // Add sale
    setSales(prev => [...prev, sale])
    
    // Update inventory quantity
    setInventoryItems(prev => 
      prev.map(item => 
        item.id === sale.inventoryItemId 
          ? { 
              ...item, 
              quantity: item.quantity - quantitySold,
              status: item.quantity - quantitySold === 0 ? 'out-of-stock' : 
                     item.quantity - quantitySold <= (item.minStockLevel || 1) ? 'low-stock' : 'in-stock',
              updatedAt: new Date().toISOString()
            }
          : item
      )
    )
    
    // Recalculate dashboard stats
    updateDashboardStats()
  }

  const updateDashboardStats = () => {
    const totalItems = inventoryItems.reduce((sum, item) => sum + item.quantity, 0)
    const totalValue = inventoryItems.reduce((sum, item) => sum + (item.quantity * item.purchasePrice), 0)
    const lowStockAlerts = inventoryItems.filter(item => item.status === 'low-stock' || item.status === 'out-of-stock').length
    const totalSalesValue = sales.reduce((sum, sale) => sum + sale.soldPrice, 0)
    const monthlyProfit = sales.reduce((sum, sale) => sum + sale.profit, 0)
    
    setDashboardStats({
      totalItems,
      totalValue,
      lowStockAlerts,
      totalSales: totalSalesValue,
      monthlyProfit,
      weeklySales: sales.length
    })
  }

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => 
      prev.map(task => task.id === updatedTask.id ? updatedTask : task)
    )
  }

  const handleCreateTask = (newTaskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    }
    setTasks(prev => [...prev, newTask])
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
  }

  const handleCreateHistoryTask = (historyTask: Task) => {
    setTasks(prev => [...prev, historyTask])
  }

  const handleAddLocation = (newLocation: Location) => {
    setLocations(prev => [...prev, newLocation])
  }

  const handleLocationClick = (location: Location) => {
    setSelectedLocation(location)
    setLocationDetailOpen(true)
  }

  const handleUpdateLocationQR = (locationId: string, qrCodeImage: string) => {
    setLocations(prev => 
      prev.map(location => 
        location.id === locationId 
          ? { ...location, qrCodeImage, updatedAt: new Date().toISOString() }
          : location
      )
    )
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-blue-900 dark:to-slate-800 flex flex-col overflow-hidden">
      <Header 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddItem={handleAddItem}
      />
      
      <main className="container mx-auto px-4 py-6 flex-1 flex flex-col min-h-0 overflow-hidden">
        <Tabs defaultValue="dashboard" className="space-y-6 flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-6 flex-shrink-0">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
              <div className="text-sm text-muted-foreground">
                Last updated: {formatDate(new Date())}
              </div>
            </div>
            
            <DashboardStatsComponent stats={dashboardStats} />

            <div className="grid gap-6 md:grid-cols-2">
              {/* Recent Sales */}
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur border border-white/20 dark:border-slate-700/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ShoppingCart className="h-5 w-5" />
                    <span>Recent Sales</span>
                  </CardTitle>
                  <CardDescription>Latest sales transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sales.slice(0, 5).map((sale) => {
                      const item = inventoryItems.find(i => i.id === sale.inventoryItemId)
                      return (
                        <div key={sale.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{item?.name || 'Unknown Item'}</p>
                            <p className="text-sm text-muted-foreground">
                              {sale.quantitySold} units • {formatDate(sale.soldDate)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatCurrency(sale.soldPrice)}</p>
                            <p className="text-sm text-green-600">+{formatCurrency(sale.profit)}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Categories Overview */}
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur border border-white/20 dark:border-slate-700/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Tag className="h-5 w-5" />
                    <span>Categories</span>
                  </CardTitle>
                  <CardDescription>Inventory breakdown by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-end">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setAddCategoryOpen(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Category
                      </Button>
                    </div>
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: category.color }}
                          />
                          <div>
                            <p className="font-medium">{category.name}</p>
                            <p className="text-sm text-muted-foreground">{category.description}</p>
                          </div>
                        </div>
                        <Badge variant="secondary">{category.itemCount} items</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
              <div className="flex items-center space-x-2">
                <div className="text-sm text-muted-foreground">
                  {filteredItems.length} of {inventoryItems.length} items
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                All Categories
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <div 
                    className="w-2 h-2 rounded-full mr-2" 
                    style={{ backgroundColor: category.color }}
                  />
                  {category.name}
                </Button>
              ))}
            </div>

            <InventoryGrid 
              items={filteredItems}
              categories={categories}
              locations={locations}
              onEditItem={handleEditItem}
              onSellItem={handleSellItem}
            />
          </TabsContent>

          {/* Sales Tab */}
          <TabsContent value="sales" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold tracking-tight">Sales History</h2>
              <Button>Record New Sale</Button>
            </div>

            <div className="space-y-4">
              {sales.map((sale) => {
                const item = inventoryItems.find(i => i.id === sale.inventoryItemId)
                return (
                  <Card key={sale.id} className="bg-white/60 dark:bg-slate-700/60 backdrop-blur border border-white/30 dark:border-slate-600/50">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{item?.name || 'Unknown Item'}</h3>
                          <p className="text-sm text-muted-foreground">
                            Sold to: {sale.soldTo} • {formatDate(sale.soldDate)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {sale.quantitySold} units • Seller: {sale.sellerName}
                          </p>
                          {sale.customerPhone && (
                            <p className="text-xs text-muted-foreground">
                              Customer Phone: {sale.customerPhone}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold">{formatCurrency(sale.soldPrice)}</p>
                          <p className="text-sm text-green-600">Profit: {formatCurrency(sale.profit)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="flex-1 flex flex-col min-h-0">
            <TaskBoard 
              tasks={tasks}
              teamMembers={teamMembers}
              onUpdateTask={handleUpdateTask}
              onCreateTask={handleCreateTask}
              onDeleteTask={handleDeleteTask}
              onCreateHistoryTask={handleCreateHistoryTask}
            />
          </TabsContent>

          {/* Locations Tab */}
          <TabsContent value="locations" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold tracking-tight">Locations</h2>
              <Button onClick={() => setAddLocationOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Location
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {locations.map((location) => {
                const locationItems = inventoryItems.filter(item => item.locationId === location.id)
                const currentUsage = locationItems.length
                
                return (
                  <Card 
                    key={location.id} 
                    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur border border-white/20 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all cursor-pointer"
                    onClick={() => handleLocationClick(location)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span>{location.name}</span>
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                          {location.qrCode && (
                            <Badge variant="outline" className="text-xs">{location.qrCode}</Badge>
                          )}
                          <Badge variant="secondary" className="text-xs">
                            {getLocationLevelName(location.level)}
                          </Badge>
                        </div>
                      </div>
                      {location.description && (
                        <CardDescription>{location.description}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Items:</span>
                          <span className="font-medium">{currentUsage}</span>
                        </div>
                        
                        {location.capacity && (
                          <>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Capacity:</span>
                              <span className="font-medium">{currentUsage}/{location.capacity}</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className={`rounded-full h-2 transition-all ${
                                  (currentUsage / location.capacity) >= 0.9 ? 'bg-red-500' :
                                  (currentUsage / location.capacity) >= 0.7 ? 'bg-yellow-500' :
                                  'bg-green-500'
                                }`}
                                style={{ 
                                  width: `${Math.min((currentUsage / location.capacity) * 100, 100)}%` 
                                }}
                              />
                            </div>
                            <div className="text-xs text-center text-muted-foreground">
                              {Math.round((currentUsage / location.capacity) * 100)}% filled
                            </div>
                          </>
                        )}
                        
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Created: {formatDate(location.createdAt).split(',')[0]}</span>
                          {location.updatedAt && (
                            <span>Updated: {formatDate(location.updatedAt).split(',')[0]}</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold tracking-tight">Team Members</h2>
              <Button onClick={() => setAddMemberOpen(true)}>Add Member</Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map((member) => {
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
                  <Card key={member.id} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur border border-white/20 dark:border-slate-700/50 shadow-sm">
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-4">
                        <div className="relative flex-shrink-0">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                            onError={(e) => {
                              // Fallback if image fails to load
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                              const fallback = target.nextElementSibling as HTMLElement
                              if (fallback) fallback.style.display = 'flex'
                            }}
                          />
                          <div 
                            className="hidden w-12 h-12 rounded-full bg-slate-300 dark:bg-slate-600 items-center justify-center text-sm font-medium border-2 border-white shadow-sm"
                            style={{ display: 'none' }}
                          >
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(member.status)}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm">{member.name}</h3>
                          <p className="text-xs text-muted-foreground mb-1">{member.email}</p>
                          {member.department && (
                            <p className="text-xs text-muted-foreground mb-2">{member.department}</p>
                          )}
                          {member.phone && (
                            <p className="text-xs text-muted-foreground mb-2">{member.phone}</p>
                          )}
                          <div className="flex items-center justify-between">
                            <Badge 
                              variant={member.role === 'admin' ? 'default' : member.role === 'manager' ? 'secondary' : 'outline'}
                              className="text-xs"
                            >
                              {member.role.toUpperCase()}
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className={`text-xs capitalize ${
                                member.status === 'active' ? 'text-green-600 border-green-200' :
                                member.status === 'away' ? 'text-yellow-600 border-yellow-200' :
                                member.status === 'busy' ? 'text-red-600 border-red-200' :
                                'text-gray-600 border-gray-200'
                              }`}
                            >
                              {member.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Modals */}
      <AddCategoryModal
        open={addCategoryOpen}
        onOpenChange={setAddCategoryOpen}
        onAddCategory={handleAddCategory}
      />

      <AddMemberModal
        open={addMemberOpen}
        onOpenChange={setAddMemberOpen}
        onAddMember={handleAddMember}
      />

      <AddItemModal
        open={addItemOpen}
        onOpenChange={setAddItemOpen}
        onAddItem={handleCreateItem}
        categories={categories}
        locations={locations}
      />

      <EditItemModal
        open={editItemOpen}
        onOpenChange={setEditItemOpen}
        item={selectedItem}
        categories={categories}
        locations={locations}
        onUpdateItem={handleUpdateItem}
      />

      <SellItemModal
        open={sellItemOpen}
        onOpenChange={setSellItemOpen}
        item={selectedItem}
        currentUser={currentUser}
        onSellItem={handleCompleteSale}
      />

      <AddLocationModal
        open={addLocationOpen}
        onOpenChange={setAddLocationOpen}
        onAddLocation={handleAddLocation}
        locations={locations}
      />

      <LocationDetailModal
        location={selectedLocation}
        open={locationDetailOpen}
        onOpenChange={setLocationDetailOpen}
        inventoryItems={inventoryItems}
        onUpdateLocationQR={handleUpdateLocationQR}
      />
    </div>
  )
} 
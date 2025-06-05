"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Button } from "../../components/ui/button"
import { Header } from "../../components/header"
import { DashboardStatsComponent } from "../../components/dashboard-stats"
import { InventoryGrid } from "../../components/inventory-grid"
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
import { InventoryItem, Category, Location, Sale, Task, TeamMember } from "../../lib/types"
import { formatCurrency, formatDate } from "../../lib/utils"
import { Package, Users, ClipboardList, MapPin, Tag, ShoppingCart, Calendar, Clock, AlertCircle } from "lucide-react"

export default function WarehouseManagementPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Filter items based on search query and selected category
  const filteredItems = mockInventoryItems.filter(item => {
    const matchesSearch = searchQuery === "" || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.serialNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.internalId.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory === null || item.categoryId === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const handleAddItem = () => {
    // TODO: Implement add item functionality
    console.log("Add item clicked")
  }

  const handleEditItem = (item: InventoryItem) => {
    // TODO: Implement edit item functionality
    console.log("Edit item:", item)
  }

  const handleSellItem = (item: InventoryItem) => {
    // TODO: Implement sell item functionality
    console.log("Sell item:", item)
  }

  const getTaskPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive'
      case 'medium': return 'warning'
      case 'low': return 'default'
      default: return 'secondary'
    }
  }

  const getTaskStatusVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default'
      case 'in-progress': return 'warning'
      case 'pending': return 'secondary'
      default: return 'secondary'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddItem={handleAddItem}
      />
      
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
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
            
            <DashboardStatsComponent stats={mockDashboardStats} />

            <div className="grid gap-6 md:grid-cols-2">
              {/* Recent Sales */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ShoppingCart className="h-5 w-5" />
                    <span>Recent Sales</span>
                  </CardTitle>
                  <CardDescription>Latest sales transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockSales.slice(0, 5).map((sale) => {
                      const item = mockInventoryItems.find(i => i.id === sale.inventoryItemId)
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Tag className="h-5 w-5" />
                    <span>Categories</span>
                  </CardTitle>
                  <CardDescription>Inventory breakdown by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockCategories.map((category) => (
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
                  {filteredItems.length} of {mockInventoryItems.length} items
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
              {mockCategories.map((category) => (
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
              categories={mockCategories}
              locations={mockLocations}
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
              {mockSales.map((sale) => {
                const item = mockInventoryItems.find(i => i.id === sale.inventoryItemId)
                return (
                  <Card key={sale.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{item?.name || 'Unknown Item'}</h3>
                          <p className="text-sm text-muted-foreground">
                            Sold to: {sale.soldTo} • {formatDate(sale.soldDate)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {sale.quantitySold} units
                          </p>
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
          <TabsContent value="tasks" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
              <Button>Add New Task</Button>
            </div>

            <div className="space-y-4">
              {mockTasks.map((task) => {
                const assignee = mockTeamMembers.find(member => member.id === task.assigneeId)
                return (
                  <Card key={task.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{task.title}</h3>
                            <Badge variant={getTaskStatusVariant(task.status)}>
                              {task.status.replace('-', ' ').toUpperCase()}
                            </Badge>
                            <Badge variant={getTaskPriorityVariant(task.priority)}>
                              {task.priority.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Users className="h-3 w-3" />
                              <span>Assigned to: {assignee?.name}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>Due: {formatDate(task.dueDate)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Locations Tab */}
          <TabsContent value="locations" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold tracking-tight">Locations</h2>
              <Button>Add Location</Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockLocations.map((location) => (
                <Card key={location.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{location.name}</span>
                      </CardTitle>
                      {location.qrCode && (
                        <Badge variant="outline">{location.qrCode}</Badge>
                      )}
                    </div>
                    <CardDescription>{location.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Level:</span>
                        <span className="font-medium">{location.level}</span>
                      </div>
                      {location.capacity && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Capacity:</span>
                            <span className="font-medium">{location.currentUsage}/{location.capacity}</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary rounded-full h-2 transition-all" 
                              style={{ 
                                width: `${((location.currentUsage || 0) / location.capacity) * 100}%` 
                              }}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold tracking-tight">Team Members</h2>
              <Button>Add Member</Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockTeamMembers.map((member) => (
                <Card key={member.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                        <Badge 
                          variant={member.role === 'admin' ? 'default' : member.role === 'manager' ? 'secondary' : 'outline'}
                          className="mt-1"
                        >
                          {member.role.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
} 
"use client"

import { Package, MapPin, Calendar, DollarSign, Hash, ShoppingBasket, Edit, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { InventoryItem, Category, Location } from "../lib/types"
import { formatCurrency, formatDate } from "../lib/utils"

interface InventoryGridProps {
  items: InventoryItem[]
  categories: Category[]
  locations: Location[]
  onEditItem: (item: InventoryItem) => void
  onSellItem: (item: InventoryItem) => void
  onDeleteItem: (item: InventoryItem) => void
  onItemClick: (item: InventoryItem) => void
}

export function InventoryGrid({ items, categories, locations, onEditItem, onSellItem, onDeleteItem, onItemClick }: InventoryGridProps) {
  const getCategoryName = (categoryId?: string) => {
    const category = categories.find(c => c.id === categoryId)
    return category?.name || 'Uncategorized'
  }

  const getCategoryColor = (categoryId?: string) => {
    const category = categories.find(c => c.id === categoryId)
    return category?.color || '#6B7280'
  }

  const getLocationName = (locationId?: string) => {
    const location = locations.find(l => l.id === locationId)
    return location?.name || 'No Location'
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'in-stock':
        return 'default'
      case 'low-stock':
        return 'warning'
      case 'out-of-stock':
        return 'destructive'
      case 'sold':
        return 'secondary'
      case 'damaged':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Package className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No items found</h3>
        <p className="text-muted-foreground">Try adjusting your search or add new items to get started.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Card key={item.id} className="transition-all hover:shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur border border-white/20 dark:border-slate-700/50 shadow-sm">
          <CardHeader className="pb-3 cursor-pointer" onClick={() => onItemClick(item)}>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg leading-none">{item.name}</CardTitle>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: getCategoryColor(item.categoryId) }}
                  />
                  <CardDescription>{getCategoryName(item.categoryId)}</CardDescription>
                </div>
              </div>
              <Badge variant={getStatusVariant(item.status)}>
                {item.status.replace('-', ' ').toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-3">
            <div className="cursor-pointer space-y-3" onClick={() => onItemClick(item)}>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center space-x-1">
                  <Package className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Qty:</span>
                  <span className="font-medium">{item.quantity}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <DollarSign className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Value:</span>
                  <span className="font-medium">{formatCurrency(item.quantity * item.purchasePrice)}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium text-xs">{getLocationName(item.locationId)}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Added:</span>
                  <span className="font-medium text-xs">{formatDate(item.createdAt)}</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-1 text-xs">
                  <Hash className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">ID:</span>
                  <span className="font-mono font-medium text-blue-600 dark:text-blue-400">{item.internalId}</span>
                </div>
                
                {item.serialNumber && (
                  <div className="flex items-center space-x-1 text-xs">
                    <Hash className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Serial:</span>
                    <span className="font-mono font-medium">{item.serialNumber}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 h-9 sm:h-8 border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/20"
                onClick={(e) => {
                  e.stopPropagation()
                  onEditItem(item)
                }}
              >
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
              <Button 
                size="sm" 
                className="flex-1 h-9 sm:h-8 bg-green-600 hover:bg-green-700 text-white"
                onClick={(e) => {
                  e.stopPropagation()
                  onSellItem(item)
                }}
                disabled={item.status === 'sold' || item.quantity === 0}
              >
                <ShoppingBasket className="h-3 w-3 mr-1" />
                Sell
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 h-9 sm:h-8 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                onClick={(e) => {
                  e.stopPropagation()
                  if (confirm(`Are you sure you want to delete "${item.name}"? This action cannot be undone.`)) {
                    onDeleteItem(item)
                  }
                }}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 
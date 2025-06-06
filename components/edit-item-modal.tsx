"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { InventoryItem, Category, Location } from "../lib/types"

interface EditItemModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: InventoryItem | null
  categories: Category[]
  locations: Location[]
  onUpdateItem: (item: InventoryItem) => void
}

export function EditItemModal({ 
  open, 
  onOpenChange, 
  item, 
  categories, 
  locations, 
  onUpdateItem 
}: EditItemModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    quantity: 0,
    purchasePrice: 0,
    purchaseDate: "",
    purchasedFrom: "",
    serialNumber: "",
    categoryId: "",
    locationId: "",
    status: "in-stock" as InventoryItem['status'],
    minStockLevel: 1
  })

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        quantity: item.quantity,
        purchasePrice: item.purchasePrice,
        purchaseDate: item.purchaseDate,
        purchasedFrom: item.purchasedFrom,
        serialNumber: item.serialNumber || "",
        categoryId: item.categoryId || "",
        locationId: item.locationId || "",
        status: item.status,
        minStockLevel: item.minStockLevel || 1
      })
    }
  }, [item])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!item || !formData.name.trim()) return

    const updatedItem: InventoryItem = {
      ...item,
      name: formData.name.trim(),
      quantity: formData.quantity,
      purchasePrice: formData.purchasePrice,
      purchaseDate: formData.purchaseDate,
      purchasedFrom: formData.purchasedFrom.trim(),
      serialNumber: formData.serialNumber.trim() || undefined,
      categoryId: formData.categoryId || undefined,
      locationId: formData.locationId || undefined,
      status: formData.status,
      minStockLevel: formData.minStockLevel,
      updatedAt: new Date().toISOString()
    }

    onUpdateItem(updatedItem)
    onOpenChange(false)
  }

  const statusOptions = [
    { value: 'in-stock', label: 'In Stock' },
    { value: 'low-stock', label: 'Low Stock' },
    { value: 'out-of-stock', label: 'Out of Stock' },
    { value: 'sold', label: 'Sold' },
    { value: 'damaged', label: 'Damaged' }
  ]

  if (!item) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 border-0">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Edit Item
          </DialogTitle>
          <DialogDescription>
            Update the details for {item.name}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="item-name">Item Name</Label>
              <Input
                id="item-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purchase-price">Purchase Price ($)</Label>
              <Input
                id="purchase-price"
                type="number"
                min="0"
                step="0.01"
                value={formData.purchasePrice}
                onChange={(e) => setFormData({ ...formData, purchasePrice: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchase-date">Purchase Date</Label>
              <Input
                id="purchase-date"
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purchased-from">Purchased From</Label>
            <Input
              id="purchased-from"
              value={formData.purchasedFrom}
              onChange={(e) => setFormData({ ...formData, purchasedFrom: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="serial-number">Serial Number (Optional)</Label>
            <Input
              id="serial-number"
              value={formData.serialNumber}
              onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <Select value={formData.locationId} onValueChange={(value) => setFormData({ ...formData, locationId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="min-stock">Minimum Stock Level</Label>
              <Input
                id="min-stock"
                type="number"
                min="1"
                value={formData.minStockLevel}
                onChange={(e) => setFormData({ ...formData, minStockLevel: parseInt(e.target.value) || 1 })}
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!formData.name.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Update Item
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 
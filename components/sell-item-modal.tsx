"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { InventoryItem, Sale, TeamMember } from "../lib/types"
import { generateId, formatCurrency } from "../lib/utils"

interface SellItemModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: InventoryItem | null
  currentUser: TeamMember // The logged-in staff member
  onSellItem: (sale: Sale, quantitySold: number) => void
}

export function SellItemModal({ 
  open, 
  onOpenChange, 
  item, 
  currentUser,
  onSellItem 
}: SellItemModalProps) {
  const [formData, setFormData] = useState({
    quantityToSell: 1,
    salePrice: 0,
    customerName: "",
    customerPhone: ""
  })

  useEffect(() => {
    if (item) {
      // Default sale price to 20% markup from purchase price
      const defaultPrice = Math.round(item.purchasePrice * 1.2 * 100) / 100
      setFormData(prev => ({
        ...prev,
        quantityToSell: 1,
        salePrice: defaultPrice
      }))
    }
  }, [item])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!item || formData.quantityToSell <= 0 || formData.quantityToSell > item.quantity) return

    const totalSalePrice = formData.salePrice * formData.quantityToSell
    const totalCost = item.purchasePrice * formData.quantityToSell
    const profit = totalSalePrice - totalCost

    const sale: Sale = {
      id: generateId(),
      inventoryItemId: item.id,
      quantitySold: formData.quantityToSell,
      soldPrice: totalSalePrice,
      soldTo: formData.customerName.trim() || "Walk-in Customer",
      soldDate: new Date().toISOString().split('T')[0],
      profit: profit,
      createdAt: new Date().toISOString(),
      sellerName: currentUser.name,
      sellerEmail: currentUser.email,
      customerPhone: formData.customerPhone.trim() || undefined
    }

    onSellItem(sale, formData.quantityToSell)
    
    // Reset form
    setFormData({
      quantityToSell: 1,
      salePrice: 0,
      customerName: "",
      customerPhone: ""
    })
    onOpenChange(false)
  }

  const totalSalePrice = formData.salePrice * formData.quantityToSell
  const totalCost = item ? item.purchasePrice * formData.quantityToSell : 0
  const profit = totalSalePrice - totalCost

  if (!item) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 border-0">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Sell Item
          </DialogTitle>
          <DialogDescription>
            Record a sale for {item.name} (Available: {item.quantity} units)
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity-to-sell">Quantity to Sell</Label>
              <Input
                id="quantity-to-sell"
                type="number"
                min="1"
                max={item.quantity}
                value={formData.quantityToSell}
                onChange={(e) => setFormData({ ...formData, quantityToSell: parseInt(e.target.value) || 1 })}
                required
              />
              <p className="text-xs text-muted-foreground">
                Max available: {item.quantity}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sale-price">Price per Unit ($)</Label>
              <Input
                id="sale-price"
                type="number"
                min="0"
                step="0.01"
                value={formData.salePrice}
                onChange={(e) => setFormData({ ...formData, salePrice: parseFloat(e.target.value) || 0 })}
                required
              />
              <p className="text-xs text-muted-foreground">
                Cost: {formatCurrency(item.purchasePrice)}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer-name">Customer Name (Optional)</Label>
            <Input
              id="customer-name"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              placeholder="Customer name or company..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer-phone">Customer Phone (Optional)</Label>
            <Input
              id="customer-phone"
              type="tel"
              value={formData.customerPhone}
              onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
              placeholder="+1 (555) 123-4567"
            />
          </div>

          {/* Sale Summary */}
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <h4 className="font-medium">Sale Summary</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Total Sale Price:</span>
                <span className="font-medium">{formatCurrency(totalSalePrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Cost:</span>
                <span>{formatCurrency(totalCost)}</span>
              </div>
              <div className="flex justify-between font-medium border-t pt-1">
                <span>Profit:</span>
                <span className={profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {formatCurrency(profit)}
                </span>
              </div>
            </div>
          </div>

          {/* Seller Info */}
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Seller Information</h4>
            <div className="text-xs space-y-1 text-muted-foreground">
              <div>Name: {currentUser.name}</div>
              <div>Email: {currentUser.email}</div>
              <div>Role: {currentUser.role}</div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={
                formData.quantityToSell <= 0 || 
                formData.quantityToSell > item.quantity ||
                formData.salePrice <= 0
              }
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Complete Sale
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 
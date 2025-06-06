"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { InventoryItem, Category, Location } from "../lib/types"
import { generateId, generateInternalId, generateSerialNumber } from "../lib/utils"
import QRCode from "qrcode"

interface AddItemModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddItem: (item: InventoryItem) => void
  categories: Category[]
  locations: Location[]
}

export function AddItemModal({ 
  open, 
  onOpenChange, 
  onAddItem, 
  categories, 
  locations 
}: AddItemModalProps) {
  const [name, setName] = useState("")
  const [quantity, setQuantity] = useState("")
  const [purchasePrice, setPurchasePrice] = useState("")
  const [purchasedFrom, setPurchasedFrom] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [locationId, setLocationId] = useState("")
  const [minStockLevel, setMinStockLevel] = useState("")
  const [serialNumber, setSerialNumber] = useState("")
  const [autoGenerateSerial, setAutoGenerateSerial] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const generateQRCodeData = async (item: Partial<InventoryItem>): Promise<string> => {
    const location = locations.find(loc => loc.id === item.locationId)
    
    const qrData = {
      name: item.name,
      location: location?.name || "Unknown Location",
      serialNumber: item.serialNumber || "N/A",
      supplier: item.purchasedFrom,
      internalId: item.internalId,
      createdAt: item.createdAt
    }
    
    try {
      // Generate QR code as data URL
      const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      return qrCodeDataUrl
    } catch (error) {
      console.error('Error generating QR code:', error)
      return ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim() || !quantity || !purchasePrice || !purchasedFrom || !categoryId || !locationId) {
      return
    }

    setIsLoading(true)

    try {
      const finalSerialNumber = autoGenerateSerial 
        ? generateSerialNumber(name.substring(0, 6).toUpperCase())
        : serialNumber

      const newItem: Partial<InventoryItem> = {
        id: generateId(),
        name: name.trim(),
        quantity: parseInt(quantity),
        purchasePrice: parseFloat(purchasePrice),
        purchaseDate: new Date().toISOString().split('T')[0],
        purchasedFrom: purchasedFrom.trim(),
        serialNumber: finalSerialNumber || undefined,
        categoryId,
        locationId,
        status: 'in-stock' as const,
        minStockLevel: minStockLevel ? parseInt(minStockLevel) : undefined,
        internalId: generateInternalId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // Generate QR code
      const qrCodeData = await generateQRCodeData(newItem)
      
      const finalItem: InventoryItem = {
        ...newItem,
        qrCode: qrCodeData
      } as InventoryItem

      onAddItem(finalItem)
      
      // Reset form
      setName("")
      setQuantity("")
      setPurchasePrice("")
      setPurchasedFrom("")
      setCategoryId("")
      setLocationId("")
      setMinStockLevel("")
      setSerialNumber("")
      setAutoGenerateSerial(true)
      
      onOpenChange(false)
    } catch (error) {
      console.error('Error creating item:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 border-0">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Add New Item
          </DialogTitle>
          <DialogDescription>
            Add a new item to your inventory. A QR code will be automatically generated.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="item-name">Item Name *</Label>
              <Input
                id="item-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter item name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchase-price">Purchase Price *</Label>
              <Input
                id="purchase-price"
                type="number"
                min="0"
                step="0.01"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier *</Label>
              <Input
                id="supplier"
                value={purchasedFrom}
                onChange={(e) => setPurchasedFrom(e.target.value)}
                placeholder="Supplier name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Select value={locationId} onValueChange={setLocationId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(location => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="min-stock">Min Stock Level</Label>
              <Input
                id="min-stock"
                type="number"
                min="0"
                value={minStockLevel}
                onChange={(e) => setMinStockLevel(e.target.value)}
                placeholder="Optional"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="auto-serial"
                  checked={autoGenerateSerial}
                  onChange={(e) => setAutoGenerateSerial(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="auto-serial">Auto-generate Serial Number</Label>
              </div>
              {!autoGenerateSerial && (
                <Input
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  placeholder="Enter serial number"
                />
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !name.trim() || !quantity || !purchasePrice || !purchasedFrom || !categoryId || !locationId}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isLoading ? "Creating..." : "Add Item"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 
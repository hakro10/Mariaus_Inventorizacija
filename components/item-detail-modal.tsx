"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Card, CardContent } from "./ui/card"
import { Separator } from "./ui/separator"
import { InventoryItem, Category, Location } from "../lib/types"
import { formatCurrency, formatDate, getLocationLevelName } from "../lib/utils"
import { Package, MapPin, Calendar, DollarSign, Hash, Barcode, FileText, Tag, User, Clock } from "lucide-react"
import QRCode from 'qrcode'

interface ItemDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: InventoryItem | null
  categories: Category[]
  locations: Location[]
  onEditItem: (item: InventoryItem) => void
  onSellItem: (item: InventoryItem) => void
  onDeleteItem: (item: InventoryItem) => void
}

export function ItemDetailModal({ 
  open, 
  onOpenChange, 
  item,
  categories,
  locations,
  onEditItem,
  onSellItem,
  onDeleteItem
}: ItemDetailModalProps) {
  const [qrCodeImage, setQrCodeImage] = useState<string>("")

  useEffect(() => {
    if (item && open) {
      generateItemQRCode(item)
    }
  }, [item, open])

  const generateItemQRCode = async (item: InventoryItem) => {
    try {
      const location = locations.find(loc => loc.id === item.locationId)
      const locationInfo = location 
        ? `${location.name} (${getLocationLevelName(location.level)})`
        : 'No location assigned'

             const qrData = {
         itemId: item.id,
         internalId: item.internalId,
         name: item.name,
         serialNumber: item.serialNumber || 'N/A',
         location: locationInfo
       }

      const qrString = Object.entries(qrData)
        .map(([key, value]) => `${key.toUpperCase()}: ${value}`)
        .join('\n')

      const qrCodeDataURL = await QRCode.toDataURL(qrString, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      
      setQrCodeImage(qrCodeDataURL)
    } catch (error) {
      console.error('Error generating QR code:', error)
      setQrCodeImage("")
    }
  }

  const getCategoryInfo = (categoryId?: string) => {
    return categories.find(c => c.id === categoryId)
  }

  const getLocationInfo = (locationId?: string) => {
    return locations.find(l => l.id === locationId)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'low-stock': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'out-of-stock': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'sold': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  if (!item) return null

  const category = getCategoryInfo(item.categoryId)
  const location = getLocationInfo(item.locationId)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 border-0">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {item.name}
          </DialogTitle>
          <DialogDescription>
            Complete item details and QR code
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Left Column - Item Details */}
          <div className="space-y-4">
            {/* Basic Info Card */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur border-white/20 dark:border-slate-700/50">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center">
                      <Package className="h-5 w-5 mr-2" />
                      Basic Information
                    </h3>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status.replace('-', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Internal ID</p>
                      <p className="font-medium flex items-center">
                        <Hash className="h-4 w-4 mr-1" />
                        {item.internalId}
                      </p>
                    </div>
                    {item.serialNumber && (
                      <div>
                        <p className="text-muted-foreground">Serial Number</p>
                        <p className="font-medium flex items-center">
                          <Barcode className="h-4 w-4 mr-1" />
                          {item.serialNumber}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-muted-foreground">Quantity</p>
                      <p className="font-medium text-lg">{item.quantity}</p>
                    </div>
                    {item.minStockLevel && (
                      <div>
                        <p className="text-muted-foreground">Min Stock Level</p>
                        <p className="font-medium">{item.minStockLevel}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Category & Location Card */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur border-white/20 dark:border-slate-700/50">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Tag className="h-5 w-5 mr-2" />
                    Category & Location
                  </h3>
                  
                  <div className="space-y-3">
                    {category ? (
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        <div>
                          <p className="font-medium">{category.name}</p>
                          {category.description && (
                            <p className="text-sm text-muted-foreground">{category.description}</p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No category assigned</p>
                    )}
                    
                    <Separator />
                    
                    {location ? (
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{location.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {getLocationLevelName(location.level)}
                          </p>
                          {location.description && (
                            <p className="text-xs text-muted-foreground">{location.description}</p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        No location assigned
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing Card */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur border-white/20 dark:border-slate-700/50">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Pricing Information
                  </h3>
                  
                                     <div className="grid grid-cols-2 gap-4">
                     <div>
                       <p className="text-muted-foreground">Purchase Price</p>
                       <p className="font-bold text-lg">{formatCurrency(item.purchasePrice)}</p>
                     </div>
                     <div>
                       <p className="text-muted-foreground">Purchase Date</p>
                       <p className="font-medium">{formatDate(item.purchaseDate)}</p>
                     </div>
                     <div>
                       <p className="text-muted-foreground">Purchased From</p>
                       <p className="font-medium">{item.purchasedFrom}</p>
                     </div>
                     <div>
                       <p className="text-muted-foreground">Total Value</p>
                       <p className="font-bold text-lg">{formatCurrency(item.quantity * item.purchasePrice)}</p>
                     </div>
                   </div>
                </div>
              </CardContent>
            </Card>

            

            {/* Timestamps Card */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur border-white/20 dark:border-slate-700/50">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Timeline
                  </h3>
                  
                                     <div className="space-y-2 text-sm">
                     <div className="flex items-center justify-between">
                       <span className="text-muted-foreground">Created:</span>
                       <span className="font-medium">{formatDate(item.createdAt)}</span>
                     </div>
                     {item.updatedAt && (
                       <div className="flex items-center justify-between">
                         <span className="text-muted-foreground">Last Updated:</span>
                         <span className="font-medium">{formatDate(item.updatedAt)}</span>
                       </div>
                     )}
                   </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - QR Code & Actions */}
          <div className="space-y-4">
            {/* QR Code Card */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur border-white/20 dark:border-slate-700/50">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-center">Item QR Code</h3>
                  
                  {qrCodeImage ? (
                    <div className="flex flex-col items-center space-y-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <img 
                          src={qrCodeImage} 
                          alt="Item QR Code" 
                          className="w-64 h-64"
                        />
                      </div>
                                             <p className="text-xs text-center text-muted-foreground max-w-xs">
                         QR code contains: Item ID, Internal ID, Name, Serial Number, and Location
                       </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const link = document.createElement('a')
                          link.download = `${item.internalId}-qr-code.png`
                          link.href = qrCodeImage
                          link.click()
                        }}
                      >
                        Download QR Code
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64">
                      <p className="text-muted-foreground">Generating QR code...</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={() => {
                  onEditItem(item)
                  onOpenChange(false)
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Edit Item
              </Button>
              
              <Button 
                onClick={() => {
                  onSellItem(item)
                  onOpenChange(false)
                }}
                disabled={item.status === 'sold' || item.quantity === 0}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Sell Item
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => {
                  if (confirm(`Are you sure you want to delete "${item.name}"? This action cannot be undone.`)) {
                    onDeleteItem(item)
                    onOpenChange(false)
                  }
                }}
                className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                Delete Item
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 
"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Badge } from "./ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Location, InventoryItem } from "../lib/types"
import { formatDate, formatCurrency, getLocationLevelName } from "../lib/utils"
import { MapPin, Package, QrCode, Calendar, Download, RefreshCw } from "lucide-react"
import { Button } from "./ui/button"
import QRCode from "qrcode"

interface LocationDetailModalProps {
  location: Location | null
  open: boolean
  onOpenChange: (open: boolean) => void
  inventoryItems: InventoryItem[]
  onUpdateLocationQR?: (locationId: string, qrCodeImage: string) => void
}

export function LocationDetailModal({ 
  location, 
  open, 
  onOpenChange, 
  inventoryItems,
  onUpdateLocationQR 
}: LocationDetailModalProps) {
  const [qrCodeImage, setQrCodeImage] = useState<string>("")
  const [isGeneratingQR, setIsGeneratingQR] = useState(false)

  // Get items in this location
  const locationItems = inventoryItems.filter(item => item.locationId === location?.id)

  const generateLocationQRCode = async () => {
    if (!location) return

    setIsGeneratingQR(true)
    
    try {
      // Use the static QR code if it exists, otherwise generate simple one
      if (location.qrCodeImage) {
        setQrCodeImage(location.qrCodeImage)
      } else {
        // Generate simplified QR code with basic location info only
        const qrData = {
          locationId: location.id,
          locationCode: location.qrCode,
          name: location.name,
          level: location.level,
          type: 'location'
        }
        
        const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        })
        
        setQrCodeImage(qrCodeDataUrl)
        
        // Update the location with the generated QR code
        if (onUpdateLocationQR) {
          onUpdateLocationQR(location.id, qrCodeDataUrl)
        }
      }
    } catch (error) {
      console.error('Error generating QR code:', error)
    } finally {
      setIsGeneratingQR(false)
    }
  }

  useEffect(() => {
    if (location && open) {
      generateLocationQRCode()
    }
  }, [location?.id, open])

  const downloadQRCode = () => {
    if (!qrCodeImage || !location) return

    const link = document.createElement('a')
    link.download = `${location.name.replace(/[^a-zA-Z0-9]/g, '_')}_QR.png`
    link.href = qrCodeImage
    link.click()
  }

  const getCapacityColor = (usage: number, capacity: number) => {
    const percentage = (usage / capacity) * 100
    if (percentage >= 90) return 'text-red-600'
    if (percentage >= 70) return 'text-yellow-600'
    return 'text-green-600'
  }

  if (!location) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-xl">
            <MapPin className="h-5 w-5" />
            <span>{location.name}</span>
            {location.qrCode && (
              <Badge variant="outline" className="text-xs">
                {location.qrCode}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Location Info */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Location Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {location.description && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Description</p>
                    <p className="text-sm">{location.description}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Level</p>
                    <p className="text-sm font-medium">{getLocationLevelName(location.level)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Created</p>
                    <p className="text-sm">{formatDate(location.createdAt)}</p>
                  </div>
                </div>

                {location.capacity && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Capacity</p>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">
                        <span className={getCapacityColor(locationItems.length, location.capacity)}>
                          {locationItems.length}
                        </span> / {location.capacity} items
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {Math.round((locationItems.length / location.capacity) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          (locationItems.length / location.capacity) >= 0.9 ? 'bg-red-500' :
                          (locationItems.length / location.capacity) >= 0.7 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ 
                          width: `${Math.min((locationItems.length / location.capacity) * 100, 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Items in Location */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Package className="h-4 w-4" />
                  <span>Items ({locationItems.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {locationItems.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {locationItems.map(item => (
                      <div 
                        key={item.id} 
                        className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded border"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.internalId} • Qty: {item.quantity}
                          </p>
                        </div>
                        <Badge 
                          variant={
                            item.status === 'in-stock' ? 'default' :
                            item.status === 'low-stock' ? 'secondary' :
                            item.status === 'out-of-stock' ? 'destructive' :
                            'outline'
                          }
                          className="text-xs"
                        >
                          {item.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No items in this location</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* QR Code */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg">
                  <div className="flex items-center space-x-2">
                    <QrCode className="h-4 w-4" />
                    <span>QR Code</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={generateLocationQRCode}
                      disabled={isGeneratingQR}
                    >
                      <RefreshCw className={`h-3 w-3 mr-1 ${isGeneratingQR ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                    {qrCodeImage && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={downloadQRCode}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                {qrCodeImage ? (
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg border inline-block">
                      <img 
                        src={qrCodeImage} 
                        alt={`QR Code for ${location.name}`}
                        className="w-64 h-64 mx-auto"
                      />
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>This QR code contains:</p>
                      <ul className="text-left max-w-xs mx-auto space-y-1">
                        <li>• Location ID: {location.id}</li>
                        <li>• Location Code: {location.qrCode}</li>
                        <li>• Location Name: {location.name}</li>
                        <li>• Level: {location.level}</li>
                      </ul>
                      <p className="text-center text-xs mt-2 text-muted-foreground">
                        Static QR code assigned at creation
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="py-8">
                    <QrCode className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-sm text-muted-foreground">
                      {isGeneratingQR ? "Generating QR code..." : "QR code will appear here"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 
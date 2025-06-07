"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { QRScanner } from "./qr-scanner"
import { QRGenerator } from "./qr-generator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { QrCode, Scan, History, Trash2 } from "lucide-react"
import { formatDate } from "../lib/utils"
import { InventoryItem, Location } from "../lib/types"

interface QRHistoryItem {
  id: string
  type: 'scan' | 'generate'
  data: string
  timestamp: string
  qrImageUrl?: string
}

interface QRCodesSectionProps {
  inventoryItems: InventoryItem[]
  locations: Location[]
  onItemFound: (item: InventoryItem) => void
  onLocationFound: (location: Location) => void
}

export function QRCodesSection({ 
  inventoryItems, 
  locations, 
  onItemFound, 
  onLocationFound 
}: QRCodesSectionProps) {
  const [history, setHistory] = useState<QRHistoryItem[]>([])
  const [activeTab, setActiveTab] = useState("scanner")

  const handleScanSuccess = (result: string) => {
    const historyItem: QRHistoryItem = {
      id: crypto.randomUUID(),
      type: 'scan',
      data: result,
      timestamp: new Date().toISOString()
    }
    setHistory(prev => [historyItem, ...prev].slice(0, 50)) // Keep last 50 items
    
    // Parse and handle the scanned QR code
    parseAndHandleQRCode(result)
  }

  const parseAndHandleQRCode = (qrData: string) => {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(qrData)
      
      if (parsed.type === 'inventory') {
        // Find the inventory item
        const foundItem = inventoryItems.find(item => 
          item.internalId === parsed.itemId || 
          item.name === parsed.itemName ||
          item.id === parsed.itemId
        )
        
        if (foundItem) {
          onItemFound(foundItem)
        } else {
          // Show notification that item was not found
          console.warn('Inventory item not found:', parsed)
        }
      } else if (parsed.type === 'location') {
        // Find the location by matching the generated structure
        const foundLocation = locations.find(location => {
          // Try to match by ID or by matching the building structure components
          return location.id === parsed.locationId ||
                 location.name === parsed.buildingId ||
                 location.name === parsed.floorId ||
                 location.name === parsed.roomId ||
                 location.name === parsed.shelfId ||
                 // Also try to match by description containing the components
                 (location.description && (
                   location.description.includes(parsed.buildingId) ||
                   location.description.includes(parsed.floorId) ||
                   location.description.includes(parsed.roomId) ||
                   location.description.includes(parsed.shelfId)
                 ))
        })
        
        if (foundLocation) {
          onLocationFound(foundLocation)
        } else {
          console.warn('Location not found:', parsed)
        }
      }
    } catch (error) {
      // Not a JSON QR code, might be a simple text/URL
      // Check if it matches any item internal ID or name directly
      const foundItem = inventoryItems.find(item => 
        item.internalId === qrData || 
        item.serialNumber === qrData ||
        item.name.toLowerCase() === qrData.toLowerCase()
      )
      
      if (foundItem) {
        onItemFound(foundItem)
        return
      }
      
      // Check if it matches any location name, qrCode, or ID
      const foundLocation = locations.find(location => 
        location.qrCode === qrData ||
        location.name.toLowerCase() === qrData.toLowerCase() ||
        location.id === qrData
      )
      
      if (foundLocation) {
        onLocationFound(foundLocation)
        return
      }
      
      // If no matches found, just log for debugging
      console.log('QR code scanned but no matching item/location found:', qrData)
    }
  }

  const handleScanError = (error: string) => {
    console.error('QR Scan Error:', error)
  }

  const handleQRGenerated = (qrCodeDataUrl: string, data: string) => {
    const historyItem: QRHistoryItem = {
      id: crypto.randomUUID(),
      type: 'generate',
      data: data,
      timestamp: new Date().toISOString(),
      qrImageUrl: qrCodeDataUrl
    }
    setHistory(prev => [historyItem, ...prev].slice(0, 50)) // Keep last 50 items
  }

  const clearHistory = () => {
    setHistory([])
  }

  const removeHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id))
  }

  const formatQRData = (data: string) => {
    try {
      const parsed = JSON.parse(data)
      if (typeof parsed === 'object') {
        return JSON.stringify(parsed, null, 2)
      }
    } catch {
      // Not JSON, return as is
    }
    return data
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold truncate">QR Codes</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Scan and generate QR codes for inventory management</p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1 self-start sm:self-auto flex-shrink-0">
          <History className="h-3 w-3" />
          <span className="text-xs">{history.length} items</span>
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-auto">
          <TabsTrigger value="scanner" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-1.5">
            <Scan className="h-4 w-4" />
            <span className="text-xs sm:text-sm">Scanner</span>
          </TabsTrigger>
          <TabsTrigger value="generator" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-1.5">
            <QrCode className="h-4 w-4" />
            <span className="text-xs sm:text-sm">Generator</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-1.5">
            <History className="h-4 w-4" />
            <span className="text-xs sm:text-sm">History</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scanner" className="space-y-4">
          <QRScanner onScanSuccess={handleScanSuccess} onScanError={handleScanError} />
        </TabsContent>

        <TabsContent value="generator" className="space-y-4">
          <QRGenerator onQRGenerated={handleQRGenerated} />
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    QR Code History
                  </CardTitle>
                  <CardDescription>
                    View your recent QR code scans and generations
                  </CardDescription>
                </div>
                {history.length > 0 && (
                  <Button 
                    onClick={clearHistory} 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Clear All
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <QrCode className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No QR code history yet</p>
                  <p className="text-sm">Start scanning or generating QR codes to see them here</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {history.map((item) => (
                    <div key={item.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50">
                      <div className="flex-shrink-0">
                        {item.type === 'scan' ? (
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                            <Scan className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                            <QrCode className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={item.type === 'scan' ? 'default' : 'secondary'} className="text-xs">
                            {item.type === 'scan' ? 'Scanned' : 'Generated'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(item.timestamp)}
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          <pre className="text-xs bg-muted p-2 rounded font-mono whitespace-pre-wrap max-w-full overflow-hidden">
                            {formatQRData(item.data).length > 200 
                              ? formatQRData(item.data).substring(0, 200) + '...'
                              : formatQRData(item.data)
                            }
                          </pre>
                          
                          {item.qrImageUrl && (
                            <div className="flex items-center gap-2">
                              <img 
                                src={item.qrImageUrl} 
                                alt="Generated QR Code" 
                                className="w-12 h-12 border rounded"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => removeHistoryItem(item.id)}
                        variant="ghost"
                        size="sm"
                        className="flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 
"use client"

import { useState, useRef, useEffect } from "react"
import QRCode from "qrcode"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Badge } from "./ui/badge"
import { QrCode, Download, Copy, RefreshCw, Package, MapPin, Link, FileText } from "lucide-react"

interface QRGeneratorProps {
  onQRGenerated?: (qrCodeDataUrl: string, data: string) => void
}

type QRDataType = 'text' | 'url' | 'inventory' | 'location' | 'custom'

interface QROptions {
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H'
  type: 'image/png' | 'image/jpeg'
  quality: number
  margin: number
  color: {
    dark: string
    light: string
  }
  width: number
}

export function QRGenerator({ onQRGenerated }: QRGeneratorProps) {
  const [dataType, setDataType] = useState<QRDataType>('text')
  const [qrData, setQrData] = useState<string>("")
  const [generatedQR, setGeneratedQR] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string>("")
  
  // QR Options
  const [options, setOptions] = useState<QROptions>({
    errorCorrectionLevel: 'M',
    type: 'image/png',
    quality: 0.92,
    margin: 1,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    },
    width: 256
  })

  // Form data for different types
  const [inventoryData, setInventoryData] = useState({
    itemId: "",
    itemName: "",
    location: "",
    category: ""
  })

  const [locationData, setLocationData] = useState({
    buildingId: "",
    floorId: "",
    roomId: "",
    shelfId: "",
    description: ""
  })

  const [urlData, setUrlData] = useState("")
  const [textData, setTextData] = useState("")
  const [customData, setCustomData] = useState("")

  const generateQRData = (): string => {
    switch (dataType) {
      case 'text':
        return textData
      case 'url':
        return urlData
      case 'inventory':
        return JSON.stringify({
          type: 'inventory',
          ...inventoryData,
          timestamp: new Date().toISOString()
        })
      case 'location':
        return JSON.stringify({
          type: 'location',
          locationId: `${locationData.buildingId}-${locationData.floorId}-${locationData.roomId}-${locationData.shelfId}`,
          ...locationData,
          timestamp: new Date().toISOString()
        })
      case 'custom':
        return customData
      default:
        return qrData
    }
  }

  const generateQRCode = async () => {
    try {
      setError("")
      setIsGenerating(true)
      
      const data = generateQRData()
      if (!data.trim()) {
        throw new Error("Please enter data to encode")
      }

      const qrCodeDataUrl = await QRCode.toDataURL(data, options)
      setGeneratedQR(qrCodeDataUrl)
      setQrData(data)
      onQRGenerated?.(qrCodeDataUrl, data)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to generate QR code"
      setError(errorMsg)
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadQRCode = () => {
    if (!generatedQR) return
    
    const link = document.createElement('a')
    link.download = `qrcode-${Date.now()}.${options.type.split('/')[1]}`
    link.href = generatedQR
    link.click()
  }

  const copyQRData = async () => {
    if (!qrData) return
    
    try {
      await navigator.clipboard.writeText(qrData)
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const copyQRImage = async () => {
    if (!generatedQR) return
    
    try {
      const response = await fetch(generatedQR)
      const blob = await response.blob()
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ])
    } catch (err) {
      console.error('Failed to copy image:', err)
    }
  }

  const getDataTypeIcon = (type: QRDataType) => {
    switch (type) {
      case 'inventory': return <Package className="h-4 w-4" />
      case 'location': return <MapPin className="h-4 w-4" />
      case 'url': return <Link className="h-4 w-4" />
      case 'text': return <FileText className="h-4 w-4" />
      case 'custom': return <QrCode className="h-4 w-4" />
      default: return <QrCode className="h-4 w-4" />
    }
  }

  const renderDataInput = () => {
    switch (dataType) {
      case 'text':
        return (
          <div className="space-y-2">
            <Label htmlFor="text-data">Text Content</Label>
            <Textarea
              id="text-data"
              placeholder="Enter the text you want to encode..."
              value={textData}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTextData(e.target.value)}
              rows={3}
            />
          </div>
        )
      
      case 'url':
        return (
          <div className="space-y-2">
            <Label htmlFor="url-data">URL</Label>
            <Input
              id="url-data"
              type="url"
              placeholder="https://example.com"
              value={urlData}
              onChange={(e) => setUrlData(e.target.value)}
            />
          </div>
        )
      
      case 'inventory':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="item-id">Item ID</Label>
                <Input
                  id="item-id"
                  placeholder="INV-001"
                  value={inventoryData.itemId}
                  onChange={(e) => setInventoryData(prev => ({ ...prev, itemId: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="item-name">Item Name</Label>
                <Input
                  id="item-name"
                  placeholder="Product Name"
                  value={inventoryData.itemName}
                  onChange={(e) => setInventoryData(prev => ({ ...prev, itemName: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="item-location">Location</Label>
                <Input
                  id="item-location"
                  placeholder="A-1-2-3"
                  value={inventoryData.location}
                  onChange={(e) => setInventoryData(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="item-category">Category</Label>
                <Input
                  id="item-category"
                  placeholder="Electronics"
                  value={inventoryData.category}
                  onChange={(e) => setInventoryData(prev => ({ ...prev, category: e.target.value }))}
                />
              </div>
            </div>
          </div>
        )
      
      case 'location':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="building-id">Building ID</Label>
                <Input
                  id="building-id"
                  placeholder="Building A"
                  value={locationData.buildingId}
                  onChange={(e) => setLocationData(prev => ({ ...prev, buildingId: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="floor-id">Floor ID</Label>
                <Input
                  id="floor-id"
                  placeholder="Floor 1"
                  value={locationData.floorId}
                  onChange={(e) => setLocationData(prev => ({ ...prev, floorId: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="room-id">Room ID</Label>
                <Input
                  id="room-id"
                  placeholder="Room 101"
                  value={locationData.roomId}
                  onChange={(e) => setLocationData(prev => ({ ...prev, roomId: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="shelf-id">Shelf ID</Label>
                <Input
                  id="shelf-id"
                  placeholder="Shelf A"
                  value={locationData.shelfId}
                  onChange={(e) => setLocationData(prev => ({ ...prev, shelfId: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="location-description">Description</Label>
              <Textarea
                id="location-description"
                placeholder="Additional location details..."
                value={locationData.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setLocationData(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
              />
            </div>
          </div>
        )
      
      case 'custom':
        return (
          <div className="space-y-2">
            <Label htmlFor="custom-data">Custom Data (JSON or Text)</Label>
            <Textarea
              id="custom-data"
              placeholder='{"type": "custom", "data": "your data here"}'
              value={customData}
                             onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCustomData(e.target.value)}
              rows={4}
            />
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            QR Code Generator
          </CardTitle>
          <CardDescription>
            Generate QR codes for inventory items, locations, URLs, and custom data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Data Type Selection */}
          <div className="space-y-2">
            <Label>Data Type</Label>
            <div className="flex flex-wrap gap-2">
              {(['text', 'url', 'inventory', 'location', 'custom'] as QRDataType[]).map((type) => (
                <Button
                  key={type}
                  variant={dataType === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDataType(type)}
                  className="flex items-center gap-2 capitalize"
                >
                  {getDataTypeIcon(type)}
                  {type}
                </Button>
              ))}
            </div>
          </div>

          {/* Data Input */}
          {renderDataInput()}

          {/* QR Options */}
          <details className="space-y-2">
            <summary className="cursor-pointer text-sm font-medium">Advanced Options</summary>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <Label htmlFor="error-correction">Error Correction</Label>
                <Select
                  value={options.errorCorrectionLevel}
                  onValueChange={(value: 'L' | 'M' | 'Q' | 'H') => 
                    setOptions(prev => ({ ...prev, errorCorrectionLevel: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L">Low (7%)</SelectItem>
                    <SelectItem value="M">Medium (15%)</SelectItem>
                    <SelectItem value="Q">Quartile (25%)</SelectItem>
                    <SelectItem value="H">High (30%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="qr-size">Size (px)</Label>
                <Input
                  id="qr-size"
                  type="number"
                  min="128"
                  max="1024"
                  step="32"
                  value={options.width}
                  onChange={(e) => setOptions(prev => ({ ...prev, width: parseInt(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="dark-color">Dark Color</Label>
                <Input
                  id="dark-color"
                  type="color"
                  value={options.color.dark}
                  onChange={(e) => setOptions(prev => ({ 
                    ...prev, 
                    color: { ...prev.color, dark: e.target.value }
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="light-color">Light Color</Label>
                <Input
                  id="light-color"
                  type="color"
                  value={options.color.light}
                  onChange={(e) => setOptions(prev => ({ 
                    ...prev, 
                    color: { ...prev.color, light: e.target.value }
                  }))}
                />
              </div>
            </div>
          </details>

          {/* Generate Button */}
          <Button 
            onClick={generateQRCode} 
            disabled={isGenerating}
            className="w-full flex items-center gap-2"
          >
            {isGenerating ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <QrCode className="h-4 w-4" />
            )}
            {isGenerating ? 'Generating...' : 'Generate QR Code'}
          </Button>

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Generated QR Code */}
          {generatedQR && (
            <div className="space-y-3">
              <div className="flex items-center justify-center p-4 bg-white rounded-lg border">
                <img src={generatedQR} alt="Generated QR Code" className="max-w-full" />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={downloadQRCode} variant="outline" size="sm" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button onClick={copyQRData} variant="outline" size="sm" className="flex items-center gap-2">
                  <Copy className="h-4 w-4" />
                  Copy Data
                </Button>
                <Button onClick={copyQRImage} variant="outline" size="sm" className="flex items-center gap-2">
                  <Copy className="h-4 w-4" />
                  Copy Image
                </Button>
              </div>

              {/* QR Data Preview */}
              {qrData && (
                <div className="p-3 bg-muted rounded-lg">
                  <Label className="text-xs font-medium">Encoded Data:</Label>
                  <p className="text-xs font-mono mt-1 break-all">{qrData}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 
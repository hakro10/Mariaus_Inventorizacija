"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Location } from "../lib/types"
import { generateId } from "../lib/utils"
import QRCode from "qrcode"

interface AddLocationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddLocation: (location: Location) => void
  locations: Location[]
}

export function AddLocationModal({ 
  open, 
  onOpenChange, 
  onAddLocation, 
  locations 
}: AddLocationModalProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [level, setLevel] = useState("1")
  const [parentId, setParentId] = useState("")
  const [capacity, setCapacity] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const generateQRCode = async (locationData: Partial<Location>): Promise<string> => {
    // Simplified QR code with just essential location info
    const qrData = {
      locationId: locationData.id,
      locationCode: locationData.qrCode,
      name: locationData.name,
      level: locationData.level,
      type: 'location'
    }
    
    try {
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

  const generateLocationCode = (name: string, level: number): string => {
    const cleanName = name.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 3)
    const timestamp = Date.now().toString().slice(-4)
    return `LOC-${cleanName}-L${level}-${timestamp}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) return

    setIsLoading(true)

    try {
      const locationId = generateId()
      const locationLevel = parseInt(level)
      const qrCode = generateLocationCode(name, locationLevel)
      const now = new Date().toISOString()
      
      const newLocationData = {
        id: locationId,
        name: name.trim(),
        description: description.trim() || undefined,
        level: locationLevel,
        parentId: parentId || undefined,
        capacity: capacity ? parseInt(capacity) : undefined,
        currentUsage: 0,
        qrCode,
        createdAt: now,
        updatedAt: now,
        items: []
      }

      // Generate QR code image
      const qrCodeImage = await generateQRCode(newLocationData)
      
      const newLocation: Location = {
        ...newLocationData,
        qrCodeImage
      }

      onAddLocation(newLocation)
      
      // Reset form
      setName("")
      setDescription("")
      setLevel("1")
      setParentId("")
      setCapacity("")
      onOpenChange(false)
    } catch (error) {
      console.error('Error creating location:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Filter locations that can be parents (must be at least one level lower)
  const availableParents = locations.filter(location => 
    location.level < parseInt(level)
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 border-0">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Add New Location
          </DialogTitle>
          <DialogDescription>
            Create a new location with automatic QR code generation
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Location Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter location name"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter location description"
              className="w-full min-h-[80px] px-3 py-2 border border-input bg-background rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="level">Level *</Label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Level 1 (Warehouse)</SelectItem>
                  <SelectItem value="2">Level 2 (Zone)</SelectItem>
                  <SelectItem value="3">Level 3 (Aisle)</SelectItem>
                  <SelectItem value="4">Level 4 (Shelf)</SelectItem>
                  <SelectItem value="5">Level 5 (Bin)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="Max items"
              />
            </div>
          </div>
          
          {parseInt(level) > 1 && availableParents.length > 0 && (
            <div>
              <Label htmlFor="parent">Parent Location</Label>
              <Select value={parentId} onValueChange={setParentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select parent location" />
                </SelectTrigger>
                <SelectContent>
                  {availableParents.map(location => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name} (Level {location.level})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isLoading ? "Creating..." : "Create Location"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 
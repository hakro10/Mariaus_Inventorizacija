import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function generateId(): string {
  return crypto.randomUUID()
}

let internalIdCounter = 1001

export function generateInternalId(): string {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `INV-${timestamp}-${random}`
}

export function generateSerialNumber(prefix: string): string {
  const timestamp = Date.now().toString().slice(-8)
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

// Get location level name by number
export function getLocationLevelName(level: number): string {
  const levelNames: { [key: number]: string } = {
    1: 'Miestas',
    2: 'Sandelys',
    3: 'Lokacija - 1',
    4: 'Lokacija - 2',
    5: 'Lokacija - 3',
    6: 'Lokacija - 4',
    7: 'Lokacija - 5',
    8: 'Lokacija - 6',
    9: 'Lokacija - 7',
    10: 'Lokacija - 8',
    11: 'Lokacija - 9'
  }
  
  return levelNames[level] || `Level ${level}`
}

// Utility to decode location QR codes
export function decodeLocationQR(qrData: string): {
  locationId: string
  locationCode: string
  name: string
  level: number
  type: string
} | null {
  try {
    const parsed = JSON.parse(qrData)
    if (parsed.type === 'location') {
      return {
        locationId: parsed.locationId,
        locationCode: parsed.locationCode,
        name: parsed.name,
        level: parsed.level,
        type: parsed.type
      }
    }
    return null
  } catch (error) {
    console.error('Error decoding QR code:', error)
    return null
  }
} 
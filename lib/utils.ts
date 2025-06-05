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
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

let internalIdCounter = 1001

export function generateInternalId(): string {
  const year = new Date().getFullYear()
  const counter = internalIdCounter++
  return `WH-${year}-${counter.toString().padStart(4, '0')}`
}

export function generateSerialNumber(prefix: string): string {
  const randomNum = Math.floor(Math.random() * 9000) + 1000
  return `${prefix}-${randomNum}`
} 
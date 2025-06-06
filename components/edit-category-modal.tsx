"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Category } from "../lib/types"

interface EditCategoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: Category | null
  onUpdateCategory: (category: Category) => void
}

export function EditCategoryModal({ 
  open, 
  onOpenChange, 
  category,
  onUpdateCategory 
}: EditCategoryModalProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [color, setColor] = useState("#6B7280")

  useEffect(() => {
    if (category) {
      setName(category.name)
      setDescription(category.description || "")
      setColor(category.color)
    }
  }, [category])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!category || !name.trim()) return

    const updatedCategory: Category = {
      ...category,
      name: name.trim(),
      description: description.trim() || undefined,
      color
    }

    onUpdateCategory(updatedCategory)
    onOpenChange(false)
  }

  if (!category) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 border-0">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Edit Category
          </DialogTitle>
          <DialogDescription>
            Update the category information
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Category Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter category description"
            />
          </div>
          
          <div>
            <Label htmlFor="color">Color</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-20 h-10"
              />
              <Input
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="#6B7280"
                className="flex-1"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Update Category
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 
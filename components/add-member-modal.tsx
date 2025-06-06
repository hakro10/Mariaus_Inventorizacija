"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { TeamMember } from "../lib/types"

interface AddMemberModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddMember: (member: Omit<TeamMember, 'id' | 'createdAt'>) => void
}

const departments = [
  'Management',
  'Operations', 
  'Warehouse',
  'Quality Control',
  'IT',
  'Logistics',
  'Security',
  'HR',
  'Finance',
  'Customer Service'
]

const defaultAvatars = [
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format',
  'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face&auto=format',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face&auto=format',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face&auto=format',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face&auto=format',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f82?w=150&h=150&fit=crop&crop=face&auto=format',
  'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face&auto=format',
  'https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?w=150&h=150&fit=crop&crop=face&auto=format',
  'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=150&h=150&fit=crop&crop=face&auto=format'
]

export function AddMemberModal({ open, onOpenChange, onAddMember }: AddMemberModalProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<TeamMember['role']>("user")
  const [department, setDepartment] = useState("")
  const [phone, setPhone] = useState("")
  const [selectedAvatar, setSelectedAvatar] = useState(defaultAvatars[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim() || !email.trim() || !department) return

    const newMember: Omit<TeamMember, 'id' | 'createdAt'> = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      department,
      phone: phone.trim() || undefined,
      avatar: selectedAvatar,
      status: 'active'
    }

    onAddMember(newMember)
    
    // Reset form
    setName("")
    setEmail("")
    setRole("user")
    setDepartment("")
    setPhone("")
    setSelectedAvatar(defaultAvatars[0])
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 border-0">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Add New Team Member
          </DialogTitle>
          <DialogDescription>
            Add a new member to your team with their details and role.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="member-name">Full Name *</Label>
            <Input
              id="member-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., John Smith"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="member-email">Email Address *</Label>
            <Input
              id="member-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john.smith@company.com"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="member-role">Role *</Label>
              <Select value={role} onValueChange={(value: TeamMember['role']) => setRole(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="member-department">Department *</Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="member-phone">Phone Number</Label>
            <Input
              id="member-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 123-0000"
            />
          </div>

          <div className="space-y-2">
            <Label>Profile Avatar</Label>
            <div className="grid grid-cols-5 gap-3">
              {defaultAvatars.map((avatar, index) => (
                <button
                  key={avatar}
                  type="button"
                  className={`relative w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${
                    selectedAvatar === avatar 
                      ? 'border-blue-500 ring-2 ring-blue-500/30 scale-110' 
                      : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:scale-105'
                  }`}
                  onClick={() => setSelectedAvatar(avatar)}
                >
                  <img
                    src={avatar}
                    alt={`Avatar ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!name.trim() || !email.trim() || !department}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Add Member
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 
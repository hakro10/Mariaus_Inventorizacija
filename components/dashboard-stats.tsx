"use client"

import { Package, DollarSign, AlertTriangle, TrendingUp, ShoppingCart, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { DashboardStats } from "../lib/types"
import { formatCurrency } from "../lib/utils"

interface DashboardStatsProps {
  stats: DashboardStats
}

export function DashboardStatsComponent({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      title: "Total Items",
      value: stats.totalItems.toString(),
      description: "Items in inventory",
      icon: Package,
      color: "text-blue-600"
    },
    {
      title: "Total Value",
      value: formatCurrency(stats.totalValue),
      description: "Inventory value",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Low Stock Alerts",
      value: stats.lowStockAlerts.toString(),
      description: "Items need restocking",
      icon: AlertTriangle,
      color: "text-orange-600"
    },
    {
      title: "Monthly Profit",
      value: formatCurrency(stats.monthlyProfit),
      description: "This month's profit",
      icon: TrendingUp,
      color: "text-emerald-600"
    },
    {
      title: "Total Sales",
      value: formatCurrency(stats.totalSales),
      description: "All-time sales",
      icon: ShoppingCart,
      color: "text-purple-600"
    },
    {
      title: "Weekly Sales",
      value: stats.weeklySales.toString(),
      description: "Sales this week",
      icon: Calendar,
      color: "text-indigo-600"
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {statCards.map((stat, index) => {
        const IconComponent = stat.icon
        return (
          <Card key={index} className="transition-all hover:shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur border border-white/20 dark:border-slate-700/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <IconComponent className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
} 
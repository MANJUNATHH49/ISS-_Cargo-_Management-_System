"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ItemPlacement from "@/components/item-placement"
import ItemSearch from "@/components/item-search"
import WasteManagement from "@/components/waste-management"
import TimeSimulation from "@/components/time-simulation"
import LogViewer from "@/components/log-viewer"
import ImportExport from "@/components/import-export"
import { Button } from "@/components/ui/button"
import { MoonIcon, SunIcon, Rocket, AlertTriangle, Package, Clock, RotateCcw } from "lucide-react"
import { useTheme } from "next-themes"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { supabase } from "@/lib/supabase"

export default function Dashboard() {
  const { setTheme, theme } = useTheme()
  const [currentDate, setCurrentDate] = useState<string>(new Date().toISOString())
  const [mounted, setMounted] = useState(false)
  const [systemStatus, setSystemStatus] = useState({
    storageUsed: 68,
    criticalItems: 3,
    wasteItems: 5,
    uptime: "14d 6h 32m",
  })
  const [loading, setLoading] = useState(true)

  // Fetch system settings from Supabase
  useEffect(() => {
    async function fetchSystemSettings() {
      try {
        // First, try to initialize the database
        await fetch("/api/init-db")

        // Then fetch system settings
        const { data, error } = await supabase
          .from("system_settings")
          .select("*")
          .order("id", { ascending: true })
          .limit(1)

        if (error) {
          console.error("Error fetching system settings:", error)
          // Continue with default values if there's an error
          setLoading(false)
          return
        }

        if (data && data.length > 0) {
          setSystemStatus({
            storageUsed: data[0].storage_used,
            criticalItems: data[0].critical_items,
            wasteItems: data[0].waste_items,
            uptime: data[0].uptime,
          })
          setCurrentDate(data[0].system_date)
        }
      } catch (error) {
        console.error("Error fetching system settings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSystemSettings()
  }, [])

  // Update system date in Supabase when it changes
  useEffect(() => {
    async function updateSystemDate() {
      try {
        await supabase.from("system_settings").update({ system_date: currentDate }).eq("id", 1)
      } catch (error) {
        console.error("Error updating system date:", error)
      }
    }

    if (!loading && mounted) {
      updateSystemDate()
    }
  }, [currentDate, loading, mounted])

  // Ensure theme is only accessed on client side
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 iss-header">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex">
            <a className="mr-6 flex items-center space-x-2" href="/">
              <Rocket className="h-6 w-6 text-primary" />
              <span className="hidden font-bold sm:inline-block space-gradient text-xl">ISS Cargo Management</span>
            </a>
          </div>
          <div className="flex flex-1 items-center justify-between md:justify-end space-x-2">
            <div className="hidden md:flex items-center space-x-4 mr-4">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm">System Online</span>
              </div>
              <Badge variant="outline" className="text-xs">
                Uptime: {systemStatus.uptime}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Storage: {systemStatus.storageUsed}% Used
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="mr-2"
                title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                <span className="sr-only">Toggle theme</span>
              </Button>
              <div className="flex items-center">
                <Badge variant="secondary" className="text-xs">
                  Current Date:{" "}
                  {new Date(currentDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Storage Capacity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Used Space</span>
                  <span className="text-xs font-bold">{systemStatus.storageUsed}%</span>
                </div>
                <Progress value={systemStatus.storageUsed} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {systemStatus.storageUsed > 80
                    ? "Storage critical. Consider rearrangement."
                    : "Storage capacity within normal parameters."}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Critical Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-amber-500 mr-2" />
                <div>
                  <div className="text-2xl font-bold">{systemStatus.criticalItems}</div>
                  <p className="text-xs text-muted-foreground">High priority items requiring attention</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Waste Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Package className="h-8 w-8 text-primary mr-2" />
                <div>
                  <div className="text-2xl font-bold">{systemStatus.wasteItems}</div>
                  <p className="text-xs text-muted-foreground">Items marked for disposal</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="placement" className="space-y-4">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
            <TabsTrigger value="placement" className="space-x-1">
              <Package className="h-4 w-4 md:mr-1" />
              <span className="hidden md:inline-block">Placement</span>
            </TabsTrigger>
            <TabsTrigger value="search" className="space-x-1">
              <Search className="h-4 w-4 md:mr-1" />
              <span className="hidden md:inline-block">Search & Retrieval</span>
            </TabsTrigger>
            <TabsTrigger value="waste" className="space-x-1">
              <Trash className="h-4 w-4 md:mr-1" />
              <span className="hidden md:inline-block">Waste Management</span>
            </TabsTrigger>
            <TabsTrigger value="time" className="space-x-1">
              <Clock className="h-4 w-4 md:mr-1" />
              <span className="hidden md:inline-block">Time Simulation</span>
            </TabsTrigger>
            <TabsTrigger value="logs" className="space-x-1">
              <FileText className="h-4 w-4 md:mr-1" />
              <span className="hidden md:inline-block">Logs</span>
            </TabsTrigger>
            <TabsTrigger value="import" className="space-x-1">
              <Upload className="h-4 w-4 md:mr-1" />
              <span className="hidden md:inline-block">Import/Export</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="placement" className="space-y-4">
            <Card className="space-container">
              <CardHeader>
                <CardTitle>Item Placement</CardTitle>
                <CardDescription>
                  Efficiently place new items in containers based on priority and space availability.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ItemPlacement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="search" className="space-y-4">
            <Card className="space-container">
              <CardHeader>
                <CardTitle>Item Search & Retrieval</CardTitle>
                <CardDescription>
                  Search for items and get retrieval instructions with minimal movement of other items.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ItemSearch />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="waste" className="space-y-4">
            <Card className="space-container">
              <CardHeader>
                <CardTitle>Waste Management</CardTitle>
                <CardDescription>Identify waste items and plan for their return during undocking.</CardDescription>
              </CardHeader>
              <CardContent>
                <WasteManagement currentDate={currentDate} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="time" className="space-y-4">
            <Card className="space-container">
              <CardHeader>
                <CardTitle>Time Simulation</CardTitle>
                <CardDescription>Simulate the passage of time to test the system's behavior.</CardDescription>
              </CardHeader>
              <CardContent>
                <TimeSimulation currentDate={currentDate} onDateChange={setCurrentDate} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            <Card className="space-container">
              <CardHeader>
                <CardTitle>Log Viewer</CardTitle>
                <CardDescription>View logs of all actions performed in the system.</CardDescription>
              </CardHeader>
              <CardContent>
                <LogViewer />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="import" className="space-y-4">
            <Card className="space-container">
              <CardHeader>
                <CardTitle>Import/Export</CardTitle>
                <CardDescription>Import items and containers, and export the current arrangement.</CardDescription>
              </CardHeader>
              <CardContent>
                <ImportExport />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t py-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <Rocket className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">ISS Cargo Management System</span>
          </div>
          <div className="flex items-center space-x-4 mt-2 md:mt-0">
            <Button variant="ghost" size="sm" className="text-xs">
              <RotateCcw className="h-3 w-3 mr-1" />
              System Reset
            </Button>
            <span className="text-xs text-muted-foreground">Version 1.0.2</span>
            <span className="text-xs text-muted-foreground">© 2025 Space Agency</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Import missing icons
import { Search, Trash, Upload, FileText } from "lucide-react"


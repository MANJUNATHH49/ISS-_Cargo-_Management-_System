"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, Info, Loader2, Package, Box, Boxes, Plus, ArrowRight, X, AlertTriangle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"

// Types for the placement API
interface Item {
  itemId: string
  name: string
  width: number
  depth: number
  height: number
  mass: number
  priority: number
  expiryDate: string
  usageLimit: number
  preferredZone: string
}

interface Container {
  containerId: string
  zone: string
  width: number
  depth: number
  height: number
}

interface Position {
  startCoordinates: {
    width: number
    depth: number
    height: number
  }
  endCoordinates: {
    width: number
    depth: number
    height: number
  }
}

interface Placement {
  itemId: string
  containerId: string
  position: Position
}

interface Rearrangement {
  step: number
  action: string
  itemId: string
  fromContainer: string
  fromPosition: Position
  toContainer: string
  toPosition: Position
}

interface PlacementResponse {
  success: boolean
  placements: Placement[]
  rearrangements: Rearrangement[]
}

export default function ItemPlacement() {
  const [items, setItems] = useState<Item[]>([])
  const [containers, setContainers] = useState<Container[]>([])
  const [newItem, setNewItem] = useState<Partial<Item>>({
    priority: 50,
    usageLimit: 1,
  })
  const [newContainer, setNewContainer] = useState<Partial<Container>>({})
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<PlacementResponse | null>(null)
  const [containerCapacity, setContainerCapacity] = useState<Record<string, number>>({})

  // Calculate container capacity usage
  useEffect(() => {
    if (response && response.placements.length > 0) {
      const capacityUsage: Record<string, number> = {}

      // Initialize with 0% for all containers
      containers.forEach((container) => {
        capacityUsage[container.containerId] = 0
      })

      // Calculate volume usage for each container
      response.placements.forEach((placement) => {
        const container = containers.find((c) => c.containerId === placement.containerId)
        if (container) {
          const item = items.find((i) => i.itemId === placement.itemId)
          if (item) {
            const itemVolume = item.width * item.depth * item.height
            const containerVolume = container.width * container.depth * container.height
            const currentUsage = capacityUsage[container.containerId] || 0
            capacityUsage[container.containerId] = currentUsage + (itemVolume / containerVolume) * 100
          }
        }
      })

      setContainerCapacity(capacityUsage)
    }
  }, [response, containers, items])

  const handleAddItem = () => {
    if (
      newItem.itemId &&
      newItem.name &&
      newItem.width &&
      newItem.depth &&
      newItem.height &&
      newItem.mass &&
      newItem.priority &&
      newItem.expiryDate &&
      newItem.usageLimit &&
      newItem.preferredZone
    ) {
      setItems([...items, newItem as Item])
      setNewItem({
        priority: 50,
        usageLimit: 1,
      })
    }
  }

  const handleRemoveItem = (itemId: string) => {
    setItems(items.filter((item) => item.itemId !== itemId))
  }

  const handleAddContainer = () => {
    if (
      newContainer.containerId &&
      newContainer.zone &&
      newContainer.width &&
      newContainer.depth &&
      newContainer.height
    ) {
      setContainers([...containers, newContainer as Container])
      setNewContainer({})
    }
  }

  const handleRemoveContainer = (containerId: string) => {
    setContainers(containers.filter((container) => container.containerId !== containerId))
  }

  const handlePlacement = async () => {
    if (items.length === 0 || containers.length === 0) {
      return
    }

    setLoading(true)
    try {
      // In a real application, this would be an API call
      // const response = await fetch('/api/placement', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ items, containers }),
      // });
      // const data = await response.json();

      // For demo purposes, we'll simulate a response
      setTimeout(() => {
        const mockResponse: PlacementResponse = {
          success: true,
          placements: items.map((item, index) => ({
            itemId: item.itemId,
            containerId: containers[index % containers.length].containerId,
            position: {
              startCoordinates: { width: 0, depth: 0, height: 0 },
              endCoordinates: { width: item.width, depth: item.depth, height: item.height },
            },
          })),
          rearrangements:
            items.length > containers.length
              ? [
                  {
                    step: 1,
                    action: "move",
                    itemId: items[0].itemId,
                    fromContainer: containers[0].containerId,
                    fromPosition: {
                      startCoordinates: { width: 0, depth: 0, height: 0 },
                      endCoordinates: { width: items[0].width, depth: items[0].depth, height: items[0].height },
                    },
                    toContainer: containers[1].containerId,
                    toPosition: {
                      startCoordinates: { width: 0, depth: 0, height: 0 },
                      endCoordinates: { width: items[0].width, depth: items[0].depth, height: items[0].height },
                    },
                  },
                ]
              : [],
        }
        setResponse(mockResponse)
        setLoading(false)
      }, 1500)
    } catch (error) {
      console.error("Error placing items:", error)
      setLoading(false)
    }
  }

  const getPriorityColor = (priority: number) => {
    if (priority >= 80) return "text-red-500"
    if (priority >= 50) return "text-amber-500"
    return "text-green-500"
  }

  const getCapacityColor = (percentage: number) => {
    if (percentage >= 80) return "bg-red-500"
    if (percentage >= 50) return "bg-amber-500"
    return "bg-green-500"
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <Tabs defaultValue="items" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="items" className="flex items-center space-x-1">
              <Package className="h-4 w-4 mr-1" />
              <span>Items</span>
            </TabsTrigger>
            <TabsTrigger value="containers" className="flex items-center space-x-1">
              <Boxes className="h-4 w-4 mr-1" />
              <span>Containers</span>
            </TabsTrigger>
            <TabsTrigger value="placement" className="flex items-center space-x-1">
              <ArrowRight className="h-4 w-4 mr-1" />
              <span>Placement</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="items" className="space-y-4">
            <Card className="card-hover">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="itemId">Item ID</Label>
                    <Input
                      id="itemId"
                      value={newItem.itemId || ""}
                      onChange={(e) => setNewItem({ ...newItem, itemId: e.target.value })}
                      placeholder="e.g., ITEM-001"
                      className="font-mono"
                    />
                  </div>
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newItem.name || ""}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      placeholder="e.g., Food Packet"
                    />
                  </div>
                  <div>
                    <Label htmlFor="width">Width (cm)</Label>
                    <Input
                      id="width"
                      type="number"
                      value={newItem.width || ""}
                      onChange={(e) => setNewItem({ ...newItem, width: Number(e.target.value) })}
                      placeholder="e.g., 10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="depth">Depth (cm)</Label>
                    <Input
                      id="depth"
                      type="number"
                      value={newItem.depth || ""}
                      onChange={(e) => setNewItem({ ...newItem, depth: Number(e.target.value) })}
                      placeholder="e.g., 10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={newItem.height || ""}
                      onChange={(e) => setNewItem({ ...newItem, height: Number(e.target.value) })}
                      placeholder="e.g., 20"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mass">Mass (kg)</Label>
                    <Input
                      id="mass"
                      type="number"
                      value={newItem.mass || ""}
                      onChange={(e) => setNewItem({ ...newItem, mass: Number(e.target.value) })}
                      placeholder="e.g., 5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="priority" className="flex items-center">
                      <span>Priority (1-100)</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 ml-1 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-[200px] text-xs">
                            Higher priority items (80-100) are critical and should be easily accessible. Medium priority
                            (50-79) are important but not critical. Low priority (1-49) can be placed in less accessible
                            locations.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="priority"
                        type="range"
                        min="1"
                        max="100"
                        value={newItem.priority || 50}
                        onChange={(e) => setNewItem({ ...newItem, priority: Number(e.target.value) })}
                        className="flex-1"
                      />
                      <span className={`w-8 text-center font-medium ${getPriorityColor(newItem.priority || 50)}`}>
                        {newItem.priority || 50}
                      </span>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      type="date"
                      value={newItem.expiryDate ? new Date(newItem.expiryDate).toISOString().split("T")[0] : ""}
                      onChange={(e) => setNewItem({ ...newItem, expiryDate: new Date(e.target.value).toISOString() })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="usageLimit">Usage Limit</Label>
                    <Input
                      id="usageLimit"
                      type="number"
                      value={newItem.usageLimit || ""}
                      onChange={(e) => setNewItem({ ...newItem, usageLimit: Number(e.target.value) })}
                      placeholder="e.g., 10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="preferredZone">Preferred Zone</Label>
                    <Select
                      onValueChange={(value) => setNewItem({ ...newItem, preferredZone: value })}
                      value={newItem.preferredZone}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select zone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Crew Quarters">Crew Quarters</SelectItem>
                        <SelectItem value="Airlock">Airlock</SelectItem>
                        <SelectItem value="Laboratory">Laboratory</SelectItem>
                        <SelectItem value="Medical Bay">Medical Bay</SelectItem>
                        <SelectItem value="Storage">Storage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Button className="w-full" onClick={handleAddItem}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Item
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Items List ({items.length})</h3>
                {items.length > 0 && (
                  <Button variant="outline" size="sm" onClick={() => setItems([])}>
                    Clear All
                  </Button>
                )}
              </div>
              <ScrollArea className="h-[300px] rounded-md border">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                    <Package className="h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No items added yet. Add items using the form above.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Dimensions (W×D×H)</TableHead>
                        <TableHead>Mass</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Expiry</TableHead>
                        <TableHead>Zone</TableHead>
                        <TableHead className="w-[50px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item) => (
                        <TableRow key={item.itemId}>
                          <TableCell className="font-mono text-xs">{item.itemId}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{`${item.width}×${item.depth}×${item.height} cm`}</TableCell>
                          <TableCell>{item.mass} kg</TableCell>
                          <TableCell>
                            <Badge className={`${getPriorityColor(item.priority)} bg-transparent`}>
                              {item.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(item.expiryDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.preferredZone}</Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveItem(item.itemId)}
                              className="h-8 w-8"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="containers" className="space-y-4">
            <Card className="card-hover">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="containerId">Container ID</Label>
                    <Input
                      id="containerId"
                      value={newContainer.containerId || ""}
                      onChange={(e) => setNewContainer({ ...newContainer, containerId: e.target.value })}
                      placeholder="e.g., CONT-A"
                      className="font-mono"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zone">Zone</Label>
                    <Select
                      onValueChange={(value) => setNewContainer({ ...newContainer, zone: value })}
                      value={newContainer.zone}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select zone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Crew Quarters">Crew Quarters</SelectItem>
                        <SelectItem value="Airlock">Airlock</SelectItem>
                        <SelectItem value="Laboratory">Laboratory</SelectItem>
                        <SelectItem value="Medical Bay">Medical Bay</SelectItem>
                        <SelectItem value="Storage">Storage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="containerWidth">Width (cm)</Label>
                    <Input
                      id="containerWidth"
                      type="number"
                      value={newContainer.width || ""}
                      onChange={(e) => setNewContainer({ ...newContainer, width: Number(e.target.value) })}
                      placeholder="e.g., 100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="containerDepth">Depth (cm)</Label>
                    <Input
                      id="containerDepth"
                      type="number"
                      value={newContainer.depth || ""}
                      onChange={(e) => setNewContainer({ ...newContainer, depth: Number(e.target.value) })}
                      placeholder="e.g., 85"
                    />
                  </div>
                  <div>
                    <Label htmlFor="containerHeight">Height (cm)</Label>
                    <Input
                      id="containerHeight"
                      type="number"
                      value={newContainer.height || ""}
                      onChange={(e) => setNewContainer({ ...newContainer, height: Number(e.target.value) })}
                      placeholder="e.g., 200"
                    />
                  </div>
                  <div className="col-span-2">
                    <Button className="w-full" onClick={handleAddContainer}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Container
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Containers List ({containers.length})</h3>
                {containers.length > 0 && (
                  <Button variant="outline" size="sm" onClick={() => setContainers([])}>
                    Clear All
                  </Button>
                )}
              </div>
              <ScrollArea className="h-[300px] rounded-md border">
                {containers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                    <Box className="h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">
                      No containers added yet. Add containers using the form above.
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Zone</TableHead>
                        <TableHead>Dimensions (W×D×H)</TableHead>
                        <TableHead>Volume</TableHead>
                        <TableHead className="w-[50px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {containers.map((container) => (
                        <TableRow key={container.containerId}>
                          <TableCell className="font-mono text-xs">{container.containerId}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{container.zone}</Badge>
                          </TableCell>
                          <TableCell>{`${container.width}×${container.depth}×${container.height} cm`}</TableCell>
                          <TableCell>{container.width * container.depth * container.height} cm³</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveContainer(container.containerId)}
                              className="h-8 w-8"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="placement" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Placement Recommendations</h3>
                <p className="text-sm text-muted-foreground">
                  Generate optimal placement recommendations for items in containers.
                </p>
              </div>
              <Button
                onClick={handlePlacement}
                disabled={loading || items.length === 0 || containers.length === 0}
                className="space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Calculating...</span>
                  </>
                ) : (
                  <>
                    <ArrowRight className="h-4 w-4" />
                    <span>Generate Placement</span>
                  </>
                )}
              </Button>
            </div>

            {items.length === 0 || containers.length === 0 ? (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>No data available</AlertTitle>
                <AlertDescription>
                  Please add items and containers before generating placement recommendations.
                </AlertDescription>
              </Alert>
            ) : null}

            {response && (
              <>
                <Alert className="bg-green-50 dark:bg-green-950">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertTitle>Placement successful</AlertTitle>
                  <AlertDescription>
                    {response.placements.length} items have been placed in{" "}
                    {new Set(response.placements.map((p) => p.containerId)).size} containers.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Placement Details</h3>
                    <ScrollArea className="h-[300px] rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Item ID</TableHead>
                            <TableHead>Item Name</TableHead>
                            <TableHead>Container ID</TableHead>
                            <TableHead>Position</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {response.placements.map((placement) => {
                            const item = items.find((i) => i.itemId === placement.itemId)
                            return (
                              <TableRow key={placement.itemId}>
                                <TableCell className="font-mono text-xs">{placement.itemId}</TableCell>
                                <TableCell>{item?.name || "Unknown"}</TableCell>
                                <TableCell className="font-mono text-xs">{placement.containerId}</TableCell>
                                <TableCell className="text-xs">
                                  {`(${placement.position.startCoordinates.width}, ${placement.position.startCoordinates.depth}, ${placement.position.startCoordinates.height}) to (${placement.position.endCoordinates.width}, ${placement.position.endCoordinates.depth}, ${placement.position.endCoordinates.height})`}
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Container Capacity Usage</h3>
                    <div className="space-y-4 p-4 border rounded-md">
                      {Object.entries(containerCapacity).map(([containerId, percentage]) => (
                        <div key={containerId} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{containerId}</span>
                            <span className="text-sm">{Math.round(percentage)}% Used</span>
                          </div>
                          <Progress value={percentage} className={`h-2 ${getCapacityColor(percentage)}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {response.rearrangements.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Rearrangement Steps</h3>
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Rearrangement Required</AlertTitle>
                      <AlertDescription>
                        Some items need to be rearranged to optimize space usage. Follow the steps below.
                      </AlertDescription>
                    </Alert>
                    <ScrollArea className="h-[300px] rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Step</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead>Item ID</TableHead>
                            <TableHead>From</TableHead>
                            <TableHead>To</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {response.rearrangements.map((rearrangement) => (
                            <TableRow key={`${rearrangement.step}-${rearrangement.itemId}`}>
                              <TableCell>{rearrangement.step}</TableCell>
                              <TableCell className="capitalize">{rearrangement.action}</TableCell>
                              <TableCell className="font-mono text-xs">{rearrangement.itemId}</TableCell>
                              <TableCell className="font-mono text-xs">{rearrangement.fromContainer}</TableCell>
                              <TableCell className="font-mono text-xs">{rearrangement.toContainer}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  )
}


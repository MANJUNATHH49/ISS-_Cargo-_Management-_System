"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Info, Calendar, FastForward, Clock, Package, AlertTriangle, CalendarIcon } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"

// Types for the time simulation API
interface SimulationItem {
  itemId: string
  name: string
}

interface SimulationResponse {
  success: boolean
  newDate: string
  changes: {
    itemsUsed: {
      itemId: string
      name: string
      remainingUses: number
    }[]
    itemsExpired: {
      itemId: string
      name: string
    }[]
    itemsDepletedToday: {
      itemId: string
      name: string
    }[]
  }
}

interface TimeSimulationProps {
  currentDate: string
  onDateChange: (date: string) => void
}

export default function TimeSimulation({ currentDate, onDateChange }: TimeSimulationProps) {
  const [numOfDays, setNumOfDays] = useState(1)
  const [toDate, setToDate] = useState("")
  const [itemsToUse, setItemsToUse] = useState<SimulationItem[]>([
    { itemId: "ITEM-001", name: "Food Packet" },
    { itemId: "ITEM-002", name: "Oxygen Cylinder" },
  ])
  const [newItemId, setNewItemId] = useState("")
  const [newItemName, setNewItemName] = useState("")
  const [loading, setLoading] = useState(false)
  const [simulationResult, setSimulationResult] = useState<SimulationResponse | null>(null)

  const addItemToUse = () => {
    if (newItemId || newItemName) {
      setItemsToUse([
        ...itemsToUse,
        {
          itemId: newItemId || `ITEM-${Math.floor(Math.random() * 1000)}`,
          name: newItemName || `Item ${Math.floor(Math.random() * 1000)}`,
        },
      ])
      setNewItemId("")
      setNewItemName("")
    }
  }

  const removeItemToUse = (index: number) => {
    setItemsToUse(itemsToUse.filter((_, i) => i !== index))
  }

  const simulateTime = async () => {
    setLoading(true)
    try {
      // In a real application, this would be an API call
      // const response = await fetch('/api/simulate/day', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     numOfDays: toDate ? undefined : numOfDays,
      //     toTimestamp: toDate || undefined,
      //     itemsToBeUsedPerDay: itemsToUse,
      //   }),
      // });
      // const data = await response.json();

      // For demo purposes, we'll simulate a response
      setTimeout(() => {
        const currentDateObj = new Date(currentDate)
        const daysToAdd = toDate
          ? Math.floor((new Date(toDate).getTime() - currentDateObj.getTime()) / (1000 * 60 * 60 * 24))
          : numOfDays

        const newDateObj = new Date(currentDateObj)
        newDateObj.setDate(newDateObj.getDate() + daysToAdd)

        const mockSimulationResult: SimulationResponse = {
          success: true,
          newDate: newDateObj.toISOString(),
          changes: {
            itemsUsed: itemsToUse.map((item) => ({
              itemId: item.itemId,
              name: item.name,
              remainingUses: Math.floor(Math.random() * 10),
            })),
            itemsExpired: Array.from({ length: Math.floor(Math.random() * 3) }, (_, i) => ({
              itemId: `EXPIRED-${i + 1}`,
              name: ["Food Packet", "Medicine", "Experimental Sample"][i % 3],
            })),
            itemsDepletedToday: Array.from({ length: Math.floor(Math.random() * 2) }, (_, i) => ({
              itemId: `DEPLETED-${i + 1}`,
              name: ["Oxygen Cylinder", "Water Filter", "Battery Pack"][i % 3],
            })),
          },
        }

        setSimulationResult(mockSimulationResult)
        onDateChange(mockSimulationResult.newDate)
        setLoading(false)
      }, 1500)
    } catch (error) {
      console.error("Error simulating time:", error)
      setLoading(false)
    }
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="card-hover">
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Time Simulation</h3>
              <div className="space-y-4">
                <div className="p-4 border rounded-md bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Current Date</span>
                    <Badge variant="outline" className="font-mono">
                      {new Date(currentDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Badge>
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="h-10 w-10 text-primary mr-3" />
                    <div>
                      <div className="text-2xl font-bold">
                        {new Date(currentDate).toLocaleDateString("en-US", {
                          weekday: "long",
                        })}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Mission Day{" "}
                        {Math.floor(
                          (new Date(currentDate).getTime() - new Date("2025-01-01").getTime()) / (1000 * 60 * 60 * 24),
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="numOfDays" className="flex items-center">
                      <span>Number of Days</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 ml-1 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-[200px] text-xs">
                            Advance time by this many days. Items will be used each day according to the list.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="numOfDays"
                        type="range"
                        min="1"
                        max="30"
                        value={numOfDays}
                        onChange={(e) => setNumOfDays(Number(e.target.value))}
                        disabled={!!toDate}
                        className="flex-1"
                      />
                      <span className="w-8 text-center font-medium">{numOfDays}</span>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="toDate">Or Specific Date</Label>
                    <Input
                      id="toDate"
                      type="date"
                      value={toDate ? new Date(toDate).toISOString().split("T")[0] : ""}
                      onChange={(e) => setToDate(e.target.value ? new Date(e.target.value).toISOString() : "")}
                      min={new Date(currentDate).toISOString().split("T")[0]}
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => {
                      setNumOfDays(1)
                      setToDate("")
                      simulateTime()
                    }}
                    disabled={loading}
                    className="flex-1"
                    variant="outline"
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Next Day
                  </Button>
                  <Button onClick={simulateTime} disabled={loading || (numOfDays <= 0 && !toDate)} className="flex-1">
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Simulating...
                      </>
                    ) : (
                      <>
                        <FastForward className="mr-2 h-4 w-4" />
                        Fast Forward
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Items to Use Each Day</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="newItemId">Item ID (optional)</Label>
                    <Input
                      id="newItemId"
                      value={newItemId}
                      onChange={(e) => setNewItemId(e.target.value)}
                      placeholder="e.g., ITEM-123"
                      className="font-mono"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newItemName">Item Name</Label>
                    <Input
                      id="newItemName"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      placeholder="e.g., Food Packet"
                    />
                  </div>
                </div>
                <Button onClick={addItemToUse} disabled={!newItemId && !newItemName} className="w-full">
                  <Package className="mr-2 h-4 w-4" />
                  Add Item to Use
                </Button>
                <ScrollArea className="h-[200px] rounded-md border">
                  {itemsToUse.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                      <Package className="h-12 w-12 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No items added yet. Add items using the form above.</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead className="w-[100px]">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {itemsToUse.map((item, index) => (
                          <TableRow key={`${item.itemId}-${index}`}>
                            <TableCell className="font-mono text-xs">{item.itemId}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItemToUse(index)}
                                className="h-8 w-8 p-0"
                              >
                                ✕
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {simulationResult && (
          <div className="space-y-6">
            <Alert className="bg-green-50 dark:bg-green-950">
              <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertTitle>Time simulation complete</AlertTitle>
              <AlertDescription>
                Date advanced to{" "}
                {new Date(simulationResult.newDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                .
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="card-hover">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Items Used</h3>
                  <ScrollArea className="h-[200px]">
                    {simulationResult.changes.itemsUsed.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                        <Package className="h-12 w-12 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No items were used during this period.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {simulationResult.changes.itemsUsed.map((item) => (
                          <div key={item.itemId} className="p-3 border rounded-md">
                            <div className="flex justify-between items-center mb-2">
                              <div>
                                <span className="font-medium">{item.name}</span>
                                <div className="text-xs text-muted-foreground font-mono">{item.itemId}</div>
                              </div>
                              <Badge
                                variant={item.remainingUses <= 3 ? "outline" : "secondary"}
                                className={
                                  item.remainingUses <= 3
                                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                                    : ""
                                }
                              >
                                {item.remainingUses} uses left
                              </Badge>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-muted-foreground">Usage</span>
                                <span className="text-xs">{10 - item.remainingUses} / 10</span>
                              </div>
                              <Progress value={(10 - item.remainingUses) * 10} className="h-1" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Items Expired</h3>
                  <ScrollArea className="h-[200px]">
                    {simulationResult.changes.itemsExpired.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                        <Calendar className="h-12 w-12 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No items expired during this period.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {simulationResult.changes.itemsExpired.map((item) => (
                          <div
                            key={item.itemId}
                            className="p-3 border rounded-md border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="font-medium">{item.name}</span>
                                <div className="text-xs text-muted-foreground font-mono">{item.itemId}</div>
                              </div>
                              <Badge variant="destructive">Expired</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Items Depleted</h3>
                  <ScrollArea className="h-[200px]">
                    {simulationResult.changes.itemsDepletedToday.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                        <AlertTriangle className="h-12 w-12 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No items were fully depleted during this period.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {simulationResult.changes.itemsDepletedToday.map((item) => (
                          <div
                            key={item.itemId}
                            className="p-3 border rounded-md border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="font-medium">{item.name}</span>
                                <div className="text-xs text-muted-foreground font-mono">{item.itemId}</div>
                              </div>
                              <Badge
                                variant="outline"
                                className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                              >
                                Depleted
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}


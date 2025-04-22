"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Info, CheckCircle, Trash2, AlertTriangle, Package, Rocket } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Types for the waste management API
interface WasteItem {
  itemId: string
  name: string
  reason: string
  containerId: string
  position: {
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
}

interface WasteResponse {
  success: boolean
  wasteItems: WasteItem[]
}

interface ReturnPlanStep {
  step: number
  itemId: string
  itemName: string
  fromContainer: string
  toContainer: string
}

interface RetrievalStep {
  step: number
  action: string
  itemId: string
  itemName: string
}

interface ReturnManifest {
  undockingContainerId: string
  undockingDate: string
  returnItems: {
    itemId: string
    name: string
    reason: string
  }[]
  totalVolume: number
  totalWeight: number
}

interface ReturnPlanResponse {
  success: boolean
  returnPlan: ReturnPlanStep[]
  retrievalSteps: RetrievalStep[]
  returnManifest: ReturnManifest
}

interface UndockingResponse {
  success: boolean
  itemsRemoved: number
}

interface WasteManagementProps {
  currentDate: string
}

export default function WasteManagement({ currentDate }: WasteManagementProps) {
  const [loading, setLoading] = useState(false)
  const [wasteItems, setWasteItems] = useState<WasteItem[]>([])
  const [returnPlan, setReturnPlan] = useState<ReturnPlanResponse | null>(null)
  const [undockingContainerId, setUndockingContainerId] = useState("")
  const [maxWeight, setMaxWeight] = useState(100)
  const [undockingComplete, setUndockingComplete] = useState(false)
  const [undockingResult, setUndockingResult] = useState<UndockingResponse | null>(null)
  const [activeStep, setActiveStep] = useState<number | null>(null)

  const identifyWaste = async () => {
    setLoading(true)
    try {
      // In a real application, this would be an API call
      // const response = await fetch('/api/waste/identify');
      // const data = await response.json();

      // For demo purposes, we'll simulate a response
      setTimeout(() => {
        const mockWasteItems: WasteItem[] = Array.from({ length: 5 }, (_, i) => ({
          itemId: `WASTE-${i + 1}`,
          name: [
            "Expired Food Packet",
            "Empty Oxygen Cylinder",
            "Used First Aid Kit",
            "Broken Tool",
            "Contaminated Sample",
          ][i],
          reason: i % 2 === 0 ? "Expired" : "Out of Uses",
          containerId: `CONT-${Math.floor(Math.random() * 5) + 1}`,
          position: {
            startCoordinates: {
              width: Math.floor(Math.random() * 50),
              depth: Math.floor(Math.random() * 50),
              height: Math.floor(Math.random() * 50),
            },
            endCoordinates: {
              width: Math.floor(Math.random() * 50) + 50,
              depth: Math.floor(Math.random() * 50) + 50,
              height: Math.floor(Math.random() * 50) + 50,
            },
          },
        }))

        setWasteItems(mockWasteItems)
        setLoading(false)
      }, 1500)
    } catch (error) {
      console.error("Error identifying waste:", error)
      setLoading(false)
    }
  }

  const generateReturnPlan = async () => {
    if (!undockingContainerId) return

    setLoading(true)
    try {
      // In a real application, this would be an API call
      // const response = await fetch('/api/waste/return-plan', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     undockingContainerId,
      //     undockingDate: currentDate,
      //     maxWeight,
      //   }),
      // });
      // const data = await response.json();

      // For demo purposes, we'll simulate a response
      setTimeout(() => {
        const mockReturnPlan: ReturnPlanResponse = {
          success: true,
          returnPlan: wasteItems.map((item, index) => ({
            step: index + 1,
            itemId: item.itemId,
            itemName: item.name,
            fromContainer: item.containerId,
            toContainer: undockingContainerId,
          })),
          retrievalSteps: wasteItems.flatMap((item, itemIndex) => [
            {
              step: itemIndex * 3 + 1,
              action: "remove",
              itemId: `BLOCKING-${itemIndex}-1`,
              itemName: `Blocking Item ${itemIndex}-1`,
            },
            {
              step: itemIndex * 3 + 2,
              action: "retrieve",
              itemId: item.itemId,
              itemName: item.name,
            },
            {
              step: itemIndex * 3 + 3,
              action: "placeBack",
              itemId: `BLOCKING-${itemIndex}-1`,
              itemName: `Blocking Item ${itemIndex}-1`,
            },
          ]),
          returnManifest: {
            undockingContainerId,
            undockingDate: currentDate,
            returnItems: wasteItems.map((item) => ({
              itemId: item.itemId,
              name: item.name,
              reason: item.reason,
            })),
            totalVolume: Math.floor(Math.random() * 5000) + 5000,
            totalWeight: Math.floor(Math.random() * maxWeight * 0.8) + maxWeight * 0.1,
          },
        }

        setReturnPlan(mockReturnPlan)
        setLoading(false)
        setActiveStep(null)
      }, 1500)
    } catch (error) {
      console.error("Error generating return plan:", error)
      setLoading(false)
    }
  }

  const completeUndocking = async () => {
    if (!returnPlan) return

    setLoading(true)
    try {
      // In a real application, this would be an API call
      // const response = await fetch('/api/waste/complete-undocking', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     undockingContainerId,
      //     timestamp: currentDate,
      //   }),
      // });
      // const data = await response.json();

      // For demo purposes, we'll simulate a response
      setTimeout(() => {
        const mockUndockingResponse: UndockingResponse = {
          success: true,
          itemsRemoved: returnPlan.returnManifest.returnItems.length,
        }

        setUndockingResult(mockUndockingResponse)
        setUndockingComplete(true)
        setLoading(false)
      }, 1500)
    } catch (error) {
      console.error("Error completing undocking:", error)
      setLoading(false)
    }
  }

  const resetWasteManagement = () => {
    setWasteItems([])
    setReturnPlan(null)
    setUndockingContainerId("")
    setMaxWeight(100)
    setUndockingComplete(false)
    setUndockingResult(null)
    setActiveStep(null)
  }

  const getReasonBadge = (reason: string) => {
    if (reason === "Expired") {
      return <Badge variant="destructive">Expired</Badge>
    }
    return <Badge variant="outline">Out of Uses</Badge>
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <Tabs defaultValue="identify" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="identify" className="flex items-center space-x-1">
              <Trash2 className="h-4 w-4 mr-1" />
              <span>Identify Waste</span>
            </TabsTrigger>
            <TabsTrigger value="plan" disabled={wasteItems.length === 0} className="flex items-center space-x-1">
              <Package className="h-4 w-4 mr-1" />
              <span>Return Plan</span>
            </TabsTrigger>
            <TabsTrigger value="undock" disabled={!returnPlan} className="flex items-center space-x-1">
              <Rocket className="h-4 w-4 mr-1" />
              <span>Complete Undocking</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="identify" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Waste Identification</h3>
                <p className="text-sm text-muted-foreground">Identify items that have expired or are out of uses.</p>
              </div>
              <Button onClick={identifyWaste} disabled={loading} className="space-x-2">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Scanning...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    <span>Scan for Waste</span>
                  </>
                )}
              </Button>
            </div>

            {wasteItems.length === 0 && !loading ? (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>No waste items identified yet</AlertTitle>
                <AlertDescription>
                  Click the "Scan for Waste" button to identify expired or depleted items.
                </AlertDescription>
              </Alert>
            ) : null}

            {wasteItems.length > 0 && (
              <>
                <Alert className="bg-amber-50 dark:bg-amber-950">
                  <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <AlertTitle>Waste items identified</AlertTitle>
                  <AlertDescription>
                    {wasteItems.length} items have been identified as waste and should be prepared for return.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Waste Items</h3>
                    <ScrollArea className="h-[300px] rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Item ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>Container</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {wasteItems.map((item) => (
                            <TableRow key={item.itemId}>
                              <TableCell className="font-mono text-xs">{item.itemId}</TableCell>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>{getReasonBadge(item.reason)}</TableCell>
                              <TableCell className="font-mono text-xs">{item.containerId}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Waste Distribution</h3>
                    <Card className="p-4">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">By Reason</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col items-center justify-center p-4 border rounded-md">
                              <span className="text-2xl font-bold">
                                {wasteItems.filter((item) => item.reason === "Expired").length}
                              </span>
                              <span className="text-xs text-muted-foreground">Expired Items</span>
                            </div>
                            <div className="flex flex-col items-center justify-center p-4 border rounded-md">
                              <span className="text-2xl font-bold">
                                {wasteItems.filter((item) => item.reason === "Out of Uses").length}
                              </span>
                              <span className="text-xs text-muted-foreground">Depleted Items</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">By Container</span>
                          </div>
                          <div className="space-y-2">
                            {Array.from(new Set(wasteItems.map((item) => item.containerId))).map((containerId) => {
                              const count = wasteItems.filter((item) => item.containerId === containerId).length
                              const percentage = (count / wasteItems.length) * 100
                              return (
                                <div key={containerId} className="space-y-1">
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs font-mono">{containerId}</span>
                                    <span className="text-xs">
                                      {count} items ({Math.round(percentage)}%)
                                    </span>
                                  </div>
                                  <Progress value={percentage} className="h-2" />
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="plan" className="space-y-4">
            <Card className="card-hover">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="undockingContainerId">Undocking Container ID</Label>
                    <Input
                      id="undockingContainerId"
                      value={undockingContainerId}
                      onChange={(e) => setUndockingContainerId(e.target.value)}
                      placeholder="Enter container ID for undocking"
                      className="font-mono"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxWeight" className="flex items-center">
                      <span>Maximum Weight (kg)</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 ml-1 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-[200px] text-xs">
                            The maximum weight capacity of the undocking container. Items exceeding this limit will need
                            to be split across multiple undockings.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="maxWeight"
                        type="range"
                        min="50"
                        max="500"
                        step="10"
                        value={maxWeight}
                        onChange={(e) => setMaxWeight(Number(e.target.value))}
                        className="flex-1"
                      />
                      <span className="w-12 text-center font-medium">{maxWeight} kg</span>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <Button className="w-full" onClick={generateReturnPlan} disabled={loading || !undockingContainerId}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating Plan...
                        </>
                      ) : (
                        <>
                          <Package className="mr-2 h-4 w-4" />
                          Generate Return Plan
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {returnPlan && (
              <>
                <Alert className="bg-green-50 dark:bg-green-950">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertTitle>Return plan generated</AlertTitle>
                  <AlertDescription>
                    A plan has been generated to move {returnPlan.returnManifest.returnItems.length} waste items to
                    container {returnPlan.returnManifest.undockingContainerId}.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Return Plan Steps</h3>
                    <ScrollArea className="h-[300px] rounded-md border">
                      <div className="p-2">
                        {returnPlan.returnPlan.map((step) => (
                          <div
                            key={`${step.step}-${step.itemId}`}
                            className={`mb-2 p-3 rounded-md border transition-colors cursor-pointer ${
                              activeStep === step.step ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                            }`}
                            onClick={() => setActiveStep(activeStep === step.step ? null : step.step)}
                          >
                            <div className="flex items-center justify-between">
                              <Badge className="mr-3 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                Step {step.step}
                              </Badge>
                              <span className="text-sm">
                                Move <span className="font-medium">{step.itemName}</span>
                              </span>
                            </div>

                            {activeStep === step.step && (
                              <div className="mt-3 pt-3 border-t text-sm">
                                <div className="flex justify-between mb-1">
                                  <span className="font-medium">Item ID:</span>
                                  <span className="font-mono">{step.itemId}</span>
                                </div>
                                <div className="flex justify-between mb-1">
                                  <span className="font-medium">From:</span>
                                  <span className="font-mono">{step.fromContainer}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-medium">To:</span>
                                  <span className="font-mono">{step.toContainer}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Return Manifest</h3>
                    <div className="rounded-md border p-4 space-container">
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="font-medium">Undocking Container:</dt>
                          <dd className="font-mono">{returnPlan.returnManifest.undockingContainerId}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="font-medium">Undocking Date:</dt>
                          <dd>{new Date(returnPlan.returnManifest.undockingDate).toLocaleDateString()}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="font-medium">Total Items:</dt>
                          <dd>{returnPlan.returnManifest.returnItems.length}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="font-medium">Total Volume:</dt>
                          <dd>{returnPlan.returnManifest.totalVolume.toLocaleString()} cm³</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="font-medium">Total Weight:</dt>
                          <dd>
                            {returnPlan.returnManifest.totalWeight} kg
                            {returnPlan.returnManifest.totalWeight > maxWeight && (
                              <Badge variant="destructive" className="ml-2">
                                Exceeds Limit
                              </Badge>
                            )}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    <h3 className="text-lg font-medium">Items to Return</h3>
                    <ScrollArea className="h-[150px] rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Item ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Reason</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {returnPlan.returnManifest.returnItems.map((item) => (
                            <TableRow key={item.itemId}>
                              <TableCell className="font-mono text-xs">{item.itemId}</TableCell>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>{getReasonBadge(item.reason)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="undock" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Complete Undocking</h3>
                <p className="text-sm text-muted-foreground">
                  Finalize the undocking process and remove waste items from the system.
                </p>
              </div>
              <Button
                onClick={completeUndocking}
                disabled={loading || undockingComplete || !returnPlan}
                variant={undockingComplete ? "outline" : "default"}
                className="space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : undockingComplete ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Undocking Complete</span>
                  </>
                ) : (
                  <>
                    <Rocket className="h-4 w-4" />
                    <span>Complete Undocking</span>
                  </>
                )}
              </Button>
            </div>

            {returnPlan && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="card-hover">
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-medium mb-4">Undocking Summary</h3>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="font-medium">Container ID:</dt>
                        <dd className="font-mono">{returnPlan.returnManifest.undockingContainerId}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">Undocking Date:</dt>
                        <dd>{new Date(returnPlan.returnManifest.undockingDate).toLocaleDateString()}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">Items to Remove:</dt>
                        <dd>{returnPlan.returnManifest.returnItems.length}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">Total Weight:</dt>
                        <dd>{returnPlan.returnManifest.totalWeight} kg</dd>
                      </div>
                    </dl>

                    <div className="mt-6 pt-6 border-t">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Undocking Progress</span>
                      </div>
                      {undockingComplete ? (
                        <Progress value={100} className="h-2 bg-green-500" />
                      ) : (
                        <Progress value={0} className="h-2" />
                      )}
                    </div>
                  </CardContent>
                </Card>

                {undockingResult && (
                  <Card className="card-hover">
                    <CardContent className="pt-6">
                      <h3 className="text-lg font-medium mb-4">Undocking Result</h3>
                      <Alert className="bg-green-50 dark:bg-green-950">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <AlertTitle>Undocking successful</AlertTitle>
                        <AlertDescription>
                          {undockingResult.itemsRemoved} items have been successfully removed from the system.
                        </AlertDescription>
                      </Alert>
                      <div className="mt-4 p-4 border rounded-md bg-muted/50">
                        <h4 className="text-sm font-medium mb-2">System Update</h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center">
                            <CheckCircle className="h-3 w-3 text-green-600 mr-2" />
                            Waste items removed from inventory
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="h-3 w-3 text-green-600 mr-2" />
                            Container space reclaimed
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="h-3 w-3 text-green-600 mr-2" />
                            Undocking logs recorded
                          </li>
                        </ul>
                      </div>
                      <Button onClick={resetWasteManagement} className="w-full mt-4">
                        Start New Waste Management Cycle
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {!returnPlan && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>No return plan available</AlertTitle>
                <AlertDescription>
                  Please generate a return plan before completing the undocking process.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  )
}


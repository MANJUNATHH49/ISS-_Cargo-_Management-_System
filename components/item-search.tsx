"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Search, Info, CheckCircle, Package, ArrowRight, ArrowDown, ArrowUp } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Types for the search and retrieval API
interface ItemPosition {
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

interface SearchResult {
  success: boolean
  found: boolean
  item: {
    itemId: string
    name: string
    containerId: string
    zone: string
    position: ItemPosition
  }
  retrievalSteps: {
    step: number
    action: string
    itemId: string
    itemName: string
  }[]
}

export default function ItemSearch() {
  const [searchTerm, setSearchTerm] = useState("")
  const [userId, setUserId] = useState("")
  const [loading, setLoading] = useState(false)
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null)
  const [retrieving, setRetrieving] = useState(false)
  const [retrieved, setRetrieved] = useState(false)
  const [activeStep, setActiveStep] = useState<number | null>(null)

  const handleSearch = async () => {
    if (!searchTerm) return

    setLoading(true)
    try {
      // In a real application, this would be an API call
      // const response = await fetch(`/api/search?${searchTerm.includes('-') ? 'itemId' : 'itemName'}=${searchTerm}&userId=${userId}`);
      // const data = await response.json();

      // For demo purposes, we'll simulate a response
      setTimeout(() => {
        const mockResult: SearchResult = {
          success: true,
          found: true,
          item: {
            itemId: searchTerm.includes("-") ? searchTerm : `ITEM-${Math.floor(Math.random() * 1000)}`,
            name: searchTerm.includes("-") ? `Item ${searchTerm.split("-")[1]}` : searchTerm,
            containerId: `CONT-${Math.floor(Math.random() * 100)}`,
            zone: ["Crew Quarters", "Airlock", "Laboratory", "Medical Bay", "Storage"][Math.floor(Math.random() * 5)],
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
          },
          retrievalSteps: [
            {
              step: 1,
              action: "remove",
              itemId: `ITEM-${Math.floor(Math.random() * 1000)}`,
              itemName: "Blocking Item 1",
            },
            {
              step: 2,
              action: "setAside",
              itemId: `ITEM-${Math.floor(Math.random() * 1000)}`,
              itemName: "Blocking Item 2",
            },
            {
              step: 3,
              action: "retrieve",
              itemId: searchTerm.includes("-") ? searchTerm : `ITEM-${Math.floor(Math.random() * 1000)}`,
              itemName: searchTerm.includes("-") ? `Item ${searchTerm.split("-")[1]}` : searchTerm,
            },
            {
              step: 4,
              action: "placeBack",
              itemId: `ITEM-${Math.floor(Math.random() * 1000)}`,
              itemName: "Blocking Item 2",
            },
            {
              step: 5,
              action: "placeBack",
              itemId: `ITEM-${Math.floor(Math.random() * 1000)}`,
              itemName: "Blocking Item 1",
            },
          ],
        }
        setSearchResult(mockResult)
        setLoading(false)
        setActiveStep(null)
      }, 1500)
    } catch (error) {
      console.error("Error searching for item:", error)
      setLoading(false)
    }
  }

  const handleRetrieve = async () => {
    if (!searchResult || !searchResult.found) return

    setRetrieving(true)
    try {
      // In a real application, this would be an API call
      // const response = await fetch('/api/retrieve', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     itemId: searchResult.item.itemId,
      //     userId,
      //     timestamp: new Date().toISOString(),
      //   }),
      // });
      // const data = await response.json();

      // For demo purposes, we'll simulate a response
      setTimeout(() => {
        setRetrieving(false)
        setRetrieved(true)
      }, 1500)
    } catch (error) {
      console.error("Error retrieving item:", error)
      setRetrieving(false)
    }
  }

  const handleReset = () => {
    setSearchTerm("")
    setSearchResult(null)
    setRetrieved(false)
    setActiveStep(null)
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case "remove":
        return <ArrowUp className="h-4 w-4 text-amber-500" />
      case "setAside":
        return <ArrowRight className="h-4 w-4 text-blue-500" />
      case "retrieve":
        return <Package className="h-4 w-4 text-green-500" />
      case "placeBack":
        return <ArrowDown className="h-4 w-4 text-purple-500" />
      default:
        return null
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "remove":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
      case "setAside":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "retrieve":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "placeBack":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="md:col-span-2 card-hover">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="searchTerm">Search by Item ID or Name</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="searchTerm"
                      placeholder="Enter item ID or name"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearch()
                      }}
                    />
                    <Button onClick={handleSearch} disabled={loading || !searchTerm}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="mr-2 h-4 w-4" />
                          Search
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="userId">User ID (optional)</Label>
                  <Input
                    id="userId"
                    placeholder="Enter your user ID for logging"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Quick Actions</h3>
                <div className="space-y-2">
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("Oxygen Cylinder")
                      handleSearch()
                    }}
                  >
                    <Package className="mr-2 h-4 w-4" />
                    Find Oxygen Cylinder
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("First Aid Kit")
                      handleSearch()
                    }}
                  >
                    <Package className="mr-2 h-4 w-4" />
                    Find First Aid Kit
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("Food Packet")
                      handleSearch()
                    }}
                  >
                    <Package className="mr-2 h-4 w-4" />
                    Find Food Packet
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {!searchResult && !loading && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Search for an item</AlertTitle>
            <AlertDescription>
              Enter an item ID or name to search for its location and retrieval instructions.
            </AlertDescription>
          </Alert>
        )}

        {searchResult && (
          <div className="space-y-6">
            {searchResult.found ? (
              <>
                <Alert className="bg-green-50 dark:bg-green-950">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertTitle>Item found</AlertTitle>
                  <AlertDescription>
                    {searchResult.item.name} is located in container {searchResult.item.containerId} in the{" "}
                    {searchResult.item.zone} zone.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Item Details</h3>
                    <div className="rounded-md border p-4 space-container">
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="font-medium">Item ID:</dt>
                          <dd className="font-mono">{searchResult.item.itemId}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="font-medium">Name:</dt>
                          <dd>{searchResult.item.name}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="font-medium">Container:</dt>
                          <dd className="font-mono">{searchResult.item.containerId}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="font-medium">Zone:</dt>
                          <dd>
                            <Badge variant="outline">{searchResult.item.zone}</Badge>
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="font-medium">Position:</dt>
                          <dd className="text-right text-xs">
                            <div>
                              Start: ({searchResult.item.position.startCoordinates.width},{" "}
                              {searchResult.item.position.startCoordinates.depth},{" "}
                              {searchResult.item.position.startCoordinates.height})
                            </div>
                            <div>
                              End: ({searchResult.item.position.endCoordinates.width},{" "}
                              {searchResult.item.position.endCoordinates.depth},{" "}
                              {searchResult.item.position.endCoordinates.height})
                            </div>
                          </dd>
                        </div>
                      </dl>
                    </div>

                    <div className="flex space-x-2">
                      <Button onClick={handleRetrieve} disabled={retrieving || retrieved} className="flex-1">
                        {retrieving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Retrieving...
                          </>
                        ) : retrieved ? (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Retrieved
                          </>
                        ) : (
                          <>
                            <Package className="mr-2 h-4 w-4" />
                            Retrieve Item
                          </>
                        )}
                      </Button>
                      <Button onClick={handleReset} variant="outline" className="flex-1">
                        New Search
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Retrieval Steps</h3>
                    <div className="rounded-md border">
                      <div className="p-4 border-b bg-muted/50">
                        <p className="text-sm text-muted-foreground">
                          Follow these steps in order to retrieve the item with minimal disruption. Click on a step to
                          see details.
                        </p>
                      </div>
                      <ScrollArea className="h-[300px]">
                        <div className="p-2">
                          {searchResult.retrievalSteps.map((step) => (
                            <div
                              key={`${step.step}-${step.itemId}`}
                              className={`mb-2 p-3 rounded-md border transition-colors cursor-pointer ${
                                activeStep === step.step ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                              }`}
                              onClick={() => setActiveStep(activeStep === step.step ? null : step.step)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <Badge className={`mr-3 ${getActionColor(step.action)}`}>Step {step.step}</Badge>
                                  <div className="flex items-center">
                                    {getActionIcon(step.action)}
                                    <span className="ml-2 capitalize">
                                      {step.action.replace(/([A-Z])/g, " $1").toLowerCase()}
                                    </span>
                                  </div>
                                </div>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-4 w-4 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="w-[200px] text-xs">
                                      {step.action === "remove" && "Remove this item from the container and set aside."}
                                      {step.action === "setAside" && "Move this item to a temporary location."}
                                      {step.action === "retrieve" && "This is the target item to be retrieved."}
                                      {step.action === "placeBack" && "Return this item to its original position."}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>

                              {activeStep === step.step && (
                                <div className="mt-3 pt-3 border-t text-sm">
                                  <div className="flex justify-between mb-1">
                                    <span className="font-medium">Item ID:</span>
                                    <span className="font-mono">{step.itemId}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="font-medium">Item Name:</span>
                                    <span>{step.itemName}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <Alert variant="destructive">
                <Info className="h-4 w-4" />
                <AlertTitle>Item not found</AlertTitle>
                <AlertDescription>No item with the ID or name "{searchTerm}" was found in the system.</AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}


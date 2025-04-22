"use client"

import { TooltipContent } from "@/components/ui/tooltip"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {
  Loader2,
  Search,
  FileText,
  Filter,
  Download,
  Calendar,
  User,
  Package,
  Activity,
  Trash,
  Info,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"

// Types for the logs API
interface LogEntry {
  timestamp: string
  userId: string
  actionType: string
  itemId: string
  details: {
    fromContainer?: string
    toContainer?: string
    reason?: string
  }
}

interface LogsResponse {
  logs: LogEntry[]
}

export default function LogViewer() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [itemId, setItemId] = useState("")
  const [userId, setUserId] = useState("")
  const [actionType, setActionType] = useState("all")
  const [loading, setLoading] = useState(false)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const fetchLogs = async () => {
    setLoading(true)
    try {
      // In a real application, this would be an API call
      // const queryParams = new URLSearchParams();
      // if (startDate) queryParams.append('startDate', new Date(startDate).toISOString());
      // if (endDate) queryParams.append('endDate', new Date(endDate).toISOString());
      // if (itemId) queryParams.append('itemId', itemId);
      // if (userId) queryParams.append('userId', userId);
      // if (actionType && actionType !== 'all') queryParams.append('actionType', actionType);
      //
      // const response = await fetch(`/api/logs?${queryParams.toString()}`);
      // const data = await response.json();

      // For demo purposes, we'll simulate a response
      setTimeout(() => {
        const actionTypes = ["placement", "retrieval", "rearrangement", "disposal"]
        const userIds = ["ASTRO-001", "ASTRO-002", "ASTRO-003"]
        const containerIds = ["CONT-A", "CONT-B", "CONT-C", "CONT-D"]

        const mockLogs: LogEntry[] = Array.from({ length: 20 }, (_, i) => {
          const randomActionType =
            actionType && actionType !== "all"
              ? actionType
              : actionTypes[Math.floor(Math.random() * actionTypes.length)]
          const randomUserId = userId || userIds[Math.floor(Math.random() * userIds.length)]
          const randomItemId = itemId || `ITEM-${Math.floor(Math.random() * 100)}`

          const date = new Date()
          date.setDate(date.getDate() - Math.floor(Math.random() * 30))

          return {
            timestamp: date.toISOString(),
            userId: randomUserId,
            actionType: randomActionType,
            itemId: randomItemId,
            details: {
              fromContainer: containerIds[Math.floor(Math.random() * containerIds.length)],
              toContainer: containerIds[Math.floor(Math.random() * containerIds.length)],
              reason:
                randomActionType === "disposal" ? ["Expired", "Out of Uses"][Math.floor(Math.random() * 2)] : undefined,
            },
          }
        })

        // Filter by date if provided
        let filteredLogs = [...mockLogs]
        if (startDate) {
          const startDateObj = new Date(startDate)
          filteredLogs = filteredLogs.filter((log) => new Date(log.timestamp) >= startDateObj)
        }
        if (endDate) {
          const endDateObj = new Date(endDate)
          filteredLogs = filteredLogs.filter((log) => new Date(log.timestamp) <= endDateObj)
        }

        // Sort by timestamp (newest first)
        filteredLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

        setLogs(filteredLogs)
        setLoading(false)
      }, 1500)
    } catch (error) {
      console.error("Error fetching logs:", error)
      setLoading(false)
    }
  }

  const getActionTypeColor = (type: string) => {
    switch (type) {
      case "placement":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "retrieval":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "rearrangement":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "disposal":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getActionTypeIcon = (type: string) => {
    switch (type) {
      case "placement":
        return <Package className="h-3 w-3" />
      case "retrieval":
        return <Package className="h-3 w-3" />
      case "rearrangement":
        return <Activity className="h-3 w-3" />
      case "disposal":
        return <Trash className="h-3 w-3" />
      default:
        return null
    }
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">System Logs</h3>
            <p className="text-sm text-muted-foreground">
              View and filter logs of all actions performed in the system.
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center"
            >
              <Filter className="h-4 w-4 mr-1" />
              Filters
            </Button>
            <Button variant="outline" size="sm" className="flex items-center">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>

        <Collapsible open={showFilters} onOpenChange={setShowFilters}>
          <CollapsibleContent>
            <Card className="mb-4 card-hover">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="startDate" className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                      <span>Start Date</span>
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate ? new Date(startDate).toISOString().split("T")[0] : ""}
                      onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value).toISOString() : "")}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate" className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                      <span>End Date</span>
                    </Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate ? new Date(endDate).toISOString().split("T")[0] : ""}
                      onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value).toISOString() : "")}
                    />
                  </div>
                  <div>
                    <Label htmlFor="actionType" className="flex items-center">
                      <Activity className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                      <span>Action Type</span>
                    </Label>
                    <Select value={actionType} onValueChange={setActionType}>
                      <SelectTrigger>
                        <SelectValue placeholder="All actions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All actions</SelectItem>
                        <SelectItem value="placement">Placement</SelectItem>
                        <SelectItem value="retrieval">Retrieval</SelectItem>
                        <SelectItem value="rearrangement">Rearrangement</SelectItem>
                        <SelectItem value="disposal">Disposal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="itemId" className="flex items-center">
                      <Package className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                      <span>Item ID</span>
                    </Label>
                    <Input
                      id="itemId"
                      placeholder="Filter by item ID"
                      value={itemId}
                      onChange={(e) => setItemId(e.target.value)}
                      className="font-mono"
                    />
                  </div>
                  <div>
                    <Label htmlFor="userId" className="flex items-center">
                      <User className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                      <span>User ID</span>
                    </Label>
                    <Input
                      id="userId"
                      placeholder="Filter by user ID"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      className="font-mono"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={fetchLogs} disabled={loading} className="w-full">
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <Search className="mr-2 h-4 w-4" />
                          Search Logs
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Log Entries ({logs.length})</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => setLogs([])}>
                Clear
              </Button>
              {!showFilters && (
                <Button variant="outline" size="sm" onClick={fetchLogs} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              )}
            </div>
          </div>
          <ScrollArea className="h-[400px] rounded-md border">
            {logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No logs to display. Use the filters above to search for logs.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Item ID</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log, index) => (
                    <TableRow key={index} className="group hover:bg-muted/50">
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>{new Date(log.timestamp).toLocaleString()}</TooltipTrigger>
                        </Tooltip>
                      </TableCell>
                      <TableCell>{log.userId}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span
                            className={`mr-2 rounded-md px-2 py-1 text-xs font-medium ${getActionTypeColor(log.actionType)}`}
                          >
                            {log.actionType}
                          </span>
                          <Tooltip>
                            <TooltipTrigger asChild>{getActionTypeIcon(log.actionType)}</TooltipTrigger>
                          </Tooltip>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">{log.itemId}</TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            {log.details.reason ? (
                              <p>Reason: {log.details.reason}</p>
                            ) : (
                              <>
                                {log.details.fromContainer && log.details.toContainer ? (
                                  <p>
                                    From: {log.details.fromContainer} <br />
                                    To: {log.details.toContainer}
                                  </p>
                                ) : (
                                  <p>No details available</p>
                                )}
                              </>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </ScrollArea>
        </div>
      </div>
    </TooltipProvider>
  )
}


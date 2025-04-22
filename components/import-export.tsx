"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Upload, Download, FileUp, FileDown, Info, CheckCircle, FileText, Database } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TooltipProvider } from "@/components/ui/tooltip"

// Types for the import/export API
interface ImportResponse {
  success: boolean
  itemsImported?: number
  containersImported?: number
  errors: {
    row: number
    message: string
  }[]
}

export default function ImportExport() {
  const [itemsFile, setItemsFile] = useState<File | null>(null)
  const [containersFile, setContainersFile] = useState<File | null>(null)
  const [loadingItems, setLoadingItems] = useState(false)
  const [loadingContainers, setLoadingContainers] = useState(false)
  const [itemsImportResult, setItemsImportResult] = useState<ImportResponse | null>(null)
  const [containersImportResult, setContainersImportResult] = useState<ImportResponse | null>(null)
  const [exportSuccess, setExportSuccess] = useState(false)
  const [loadingExport, setLoadingExport] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleItemsFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setItemsFile(e.target.files[0])
      setItemsImportResult(null)
    }
  }

  const handleContainersFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setContainersFile(e.target.files[0])
      setContainersImportResult(null)
    }
  }

  const importItems = async () => {
    if (!itemsFile) return

    setLoadingItems(true)
    setUploadProgress(0)

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + Math.floor(Math.random() * 10)
      })
    }, 200)

    try {
      // In a real application, this would be an API call
      // const formData = new FormData();
      // formData.append('file', itemsFile);
      // const response = await fetch('/api/import/items', {
      //   method: 'POST',
      //   body: formData,
      // });
      // const data = await response.json();

      // For demo purposes, we'll simulate a response
      setTimeout(() => {
        clearInterval(progressInterval)
        setUploadProgress(100)

        const mockResponse: ImportResponse = {
          success: true,
          itemsImported: Math.floor(Math.random() * 50) + 10,
          errors:
            Math.random() > 0.8
              ? [
                  { row: 3, message: "Invalid priority value" },
                  { row: 7, message: "Missing expiry date" },
                ]
              : [],
        }

        setItemsImportResult(mockResponse)
        setLoadingItems(false)
      }, 1500)
    } catch (error) {
      clearInterval(progressInterval)
      console.error("Error importing items:", error)
      setLoadingItems(false)
    }
  }

  const importContainers = async () => {
    if (!containersFile) return

    setLoadingContainers(true)
    setUploadProgress(0)

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + Math.floor(Math.random() * 10)
      })
    }, 200)

    try {
      // In a real application, this would be an API call
      // const formData = new FormData();
      // formData.append('file', containersFile);
      // const response = await fetch('/api/import/containers', {
      //   method: 'POST',
      //   body: formData,
      // });
      // const data = await response.json();

      // For demo purposes, we'll simulate a response
      setTimeout(() => {
        clearInterval(progressInterval)
        setUploadProgress(100)

        const mockResponse: ImportResponse = {
          success: true,
          containersImported: Math.floor(Math.random() * 10) + 5,
          errors: Math.random() > 0.9 ? [{ row: 2, message: "Invalid zone value" }] : [],
        }

        setContainersImportResult(mockResponse)
        setLoadingContainers(false)
      }, 1500)
    } catch (error) {
      clearInterval(progressInterval)
      console.error("Error importing containers:", error)
      setLoadingContainers(false)
    }
  }

  const exportArrangement = async () => {
    setLoadingExport(true)
    try {
      // In a real application, this would be an API call
      // const response = await fetch('/api/export/arrangement');
      // const blob = await response.blob();
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = 'arrangement.csv';
      // document.body.appendChild(a);
      // a.click();
      // a.remove();

      // For demo purposes, we'll simulate a response
      setTimeout(() => {
        setExportSuccess(true)
        setLoadingExport(false)

        // Reset success message after 3 seconds
        setTimeout(() => {
          setExportSuccess(false)
        }, 3000)
      }, 1500)
    } catch (error) {
      console.error("Error exporting arrangement:", error)
      setLoadingExport(false)
    }
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <Tabs defaultValue="import" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="import" className="flex items-center space-x-1">
              <Upload className="h-4 w-4 mr-1" />
              <span>Import</span>
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center space-x-1">
              <Download className="h-4 w-4 mr-1" />
              <span>Export</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="import" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="card-hover">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Import Items</h3>
                      <FileUp className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Upload a CSV file with item data to import into the system.
                    </p>
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="itemsFile"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-primary" />
                          <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">CSV file only</p>
                        </div>
                        <input
                          id="itemsFile"
                          type="file"
                          accept=".csv"
                          className="hidden"
                          onChange={handleItemsFileChange}
                        />
                      </label>
                    </div>
                    {itemsFile && (
                      <div className="p-4 border rounded-md bg-muted/50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-primary" />
                            <span className="text-sm font-medium truncate max-w-[200px]">{itemsFile.name}</span>
                          </div>
                          <Badge variant="outline">{(itemsFile.size / 1024).toFixed(1)} KB</Badge>
                        </div>
                        {loadingItems && (
                          <div className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-muted-foreground">Uploading...</span>
                              <span className="text-xs">{uploadProgress}%</span>
                            </div>
                            <Progress value={uploadProgress} className="h-1" />
                          </div>
                        )}
                        <Button onClick={importItems} disabled={loadingItems} className="w-full mt-2">
                          {loadingItems ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Importing...
                            </>
                          ) : (
                            <>
                              <Database className="mr-2 h-4 w-4" />
                              Import Items
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                    {itemsImportResult && (
                      <Alert
                        className={
                          itemsImportResult.success ? "bg-green-50 dark:bg-green-950" : "bg-red-50 dark:bg-red-950"
                        }
                      >
                        {itemsImportResult.success ? (
                          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <Info className="h-4 w-4 text-red-600 dark:text-red-400" />
                        )}
                        <AlertTitle>{itemsImportResult.success ? "Import successful" : "Import failed"}</AlertTitle>
                        <AlertDescription>
                          {itemsImportResult.success
                            ? `${itemsImportResult.itemsImported} items imported successfully.`
                            : "Failed to import items. Please check the file format and try again."}
                        </AlertDescription>
                      </Alert>
                    )}
                    {itemsImportResult && itemsImportResult.errors.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Import Errors</h4>
                        <ScrollArea className="h-[100px] rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Row</TableHead>
                                <TableHead>Error</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {itemsImportResult.errors.map((error, index) => (
                                <TableRow key={index}>
                                  <TableCell>{error.row}</TableCell>
                                  <TableCell>{error.message}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </ScrollArea>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Import Containers</h3>
                      <FileUp className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Upload a CSV file with container data to import into the system.
                    </p>
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="containersFile"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-primary" />
                          <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">CSV file only</p>
                        </div>
                        <input
                          id="containersFile"
                          type="file"
                          accept=".csv"
                          className="hidden"
                          onChange={handleContainersFileChange}
                        />
                      </label>
                    </div>
                    {containersFile && (
                      <div className="p-4 border rounded-md bg-muted/50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-primary" />
                            <span className="text-sm font-medium truncate max-w-[200px]">{containersFile.name}</span>
                          </div>
                          <Badge variant="outline">{(containersFile.size / 1024).toFixed(1)} KB</Badge>
                        </div>
                        {loadingContainers && (
                          <div className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-muted-foreground">Uploading...</span>
                              <span className="text-xs">{uploadProgress}%</span>
                            </div>
                            <Progress value={uploadProgress} className="h-1" />
                          </div>
                        )}
                        <Button onClick={importContainers} disabled={loadingContainers} className="w-full mt-2">
                          {loadingContainers ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Importing...
                            </>
                          ) : (
                            <>
                              <Database className="mr-2 h-4 w-4" />
                              Import Containers
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                    {containersImportResult && (
                      <Alert
                        className={
                          containersImportResult.success ? "bg-green-50 dark:bg-green-950" : "bg-red-50 dark:bg-red-950"
                        }
                      >
                        {containersImportResult.success ? (
                          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <Info className="h-4 w-4 text-red-600 dark:text-red-400" />
                        )}
                        <AlertTitle>
                          {containersImportResult.success ? "Import successful" : "Import failed"}
                        </AlertTitle>
                        <AlertDescription>
                          {containersImportResult.success
                            ? `${containersImportResult.containersImported} containers imported successfully.`
                            : "Failed to import containers. Please check the file format and try again."}
                        </AlertDescription>
                      </Alert>
                    )}
                    {containersImportResult && containersImportResult.errors.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Import Errors</h4>
                        <ScrollArea className="h-[100px] rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Row</TableHead>
                                <TableHead>Error</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {containersImportResult.errors.map((error, index) => (
                                <TableRow key={index}>
                                  <TableCell>{error.row}</TableCell>
                                  <TableCell>{error.message}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </ScrollArea>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="export" className="space-y-4">
            <Card className="card-hover">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Export Current Arrangement</h3>
                    <FileDown className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Export the current arrangement of items in containers as a CSV file.
                  </p>
                  <div className="flex items-center justify-center w-full p-8 border-2 border-dashed rounded-lg bg-muted/50">
                    <div className="flex flex-col items-center text-center">
                      <Download className="w-12 h-12 mb-4 text-primary" />
                      <p className="mb-2 text-sm">
                        Export a CSV file with the current arrangement of all items in containers.
                      </p>
                      <Button onClick={exportArrangement} disabled={loadingExport} className="mt-2">
                        {loadingExport ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Exporting...
                          </>
                        ) : (
                          <>
                            <Download className="mr-2 h-4 w-4" />
                            Export Arrangement
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  {exportSuccess && (
                    <Alert className="bg-green-50 dark:bg-green-950">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <AlertTitle>Export successful</AlertTitle>
                      <AlertDescription>The current arrangement has been exported successfully.</AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Export Options</h3>
                    <FileDown className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                      <FileText className="h-8 w-8 mb-2 text-primary" />
                      <span className="font-medium">Export Inventory</span>
                      <span className="text-xs text-muted-foreground mt-1">All items with details</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                      <Database className="h-8 w-8 mb-2 text-primary" />
                      <span className="font-medium">Export Containers</span>
                      <span className="text-xs text-muted-foreground mt-1">All container details</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                      <Trash2 className="h-8 w-8 mb-2 text-primary" />
                      <span className="font-medium">Export Waste Items</span>
                      <span className="text-xs text-muted-foreground mt-1">Items marked for disposal</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                      <FileText className="h-8 w-8 mb-2 text-primary" />
                      <span className="font-medium">Export Logs</span>
                      <span className="text-xs text-muted-foreground mt-1">System activity logs</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  )
}


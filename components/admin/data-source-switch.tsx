"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Database, 
  Server, 
  AlertTriangle, 
  CheckCircle, 
  Settings,
  RefreshCw
} from "lucide-react"
import { useState, useEffect } from "react"

interface DataSourceStatus {
  dataSource: 'mock' | 'real' | 'error'
  status: 'connected' | 'fallback' | 'enabled' | 'failed'
  data: {
    users: number
    stations: number
    attendance: number
    leaveRequests: number
  }
  message: string
  environment?: string
  setupInstructions?: {
    enableRealDatabase: string
    setupDatabase: string
  }
}

export function DataSourceSwitch() {
  const [status, setStatus] = useState<DataSourceStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStatus = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/data-source')
      const result = await response.json()
      
      if (result.success) {
        setStatus(result)
        setError(null)
      } else {
        setError(result.error || 'Failed to fetch status')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
  }, [])

  const handleSwitch = async (dataSource: 'mock' | 'real') => {
    try {
      const response = await fetch('/api/data-source', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dataSource }),
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Show message that restart is needed
        alert(result.message + '\n\n' + result.note)
        fetchStatus()
      } else {
        setError(result.error || 'Failed to switch data source')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Data Source Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin" />
            <span className="ml-2">Loading...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Data Source Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={fetchStatus} className="mt-4">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!status) return null

  const getStatusIcon = () => {
    switch (status.status) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'fallback':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case 'enabled':
        return <CheckCircle className="w-5 h-5 text-blue-600" />
      case 'failed':
        return <AlertTriangle className="w-5 h-5 text-red-600" />
      default:
        return <Database className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusColor = () => {
    switch (status.status) {
      case 'connected':
        return 'bg-green-100 text-green-800'
      case 'fallback':
        return 'bg-yellow-100 text-yellow-800'
      case 'enabled':
        return 'bg-blue-100 text-blue-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Data Source Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <div className="font-medium capitalize">
                {status.dataSource} Database
              </div>
              <div className="text-sm text-muted-foreground">
                {status.message}
              </div>
            </div>
          </div>
          <Badge className={getStatusColor()}>
            {status.status}
          </Badge>
        </div>

        {/* Data Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold">{status.data.users}</div>
            <div className="text-xs text-muted-foreground">Users</div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold">{status.data.stations}</div>
            <div className="text-xs text-muted-foreground">Stations</div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold">{status.data.attendance}</div>
            <div className="text-xs text-muted-foreground">Attendance</div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold">{status.data.leaveRequests}</div>
            <div className="text-xs text-muted-foreground">Leave Requests</div>
          </div>
        </div>

        {/* Environment Info */}
        {status.environment && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Server className="w-4 h-4" />
            Environment: {status.environment}
          </div>
        )}

        {/* Setup Instructions */}
        {status.setupInstructions && (
          <Alert>
            <Settings className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <div>
                  <strong>To enable real database:</strong>
                </div>
                <div className="font-mono text-xs bg-muted p-2 rounded">
                  {status.setupInstructions.enableRealDatabase}
                </div>
                <div>
                  <strong>To setup database:</strong>
                </div>
                <div className="font-mono text-xs bg-muted p-2 rounded">
                  {status.setupInstructions.setupDatabase}
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Switch Controls */}
        <div className="flex gap-2">
          <Button
            variant={status.dataSource === 'mock' ? 'default' : 'outline'}
            onClick={() => handleSwitch('mock')}
            className="flex-1"
          >
            Use Mock Data
          </Button>
          <Button
            variant={status.dataSource === 'real' ? 'default' : 'outline'}
            onClick={() => handleSwitch('real')}
            className="flex-1"
          >
            Use Real Database
          </Button>
        </div>

        {/* Refresh Button */}
        <Button
          variant="outline"
          onClick={fetchStatus}
          className="w-full"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Status
        </Button>
      </CardContent>
    </Card>
  )
}

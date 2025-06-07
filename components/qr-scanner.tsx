"use client"

import { useEffect, useRef, useState } from "react"
import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Camera, Scan, Wifi, WifiOff, AlertCircle, CheckCircle2 } from "lucide-react"

interface QRScannerProps {
  onScanSuccess: (result: string) => void
  onScanError?: (error: string) => void
}

export function QRScanner({ onScanSuccess, onScanError }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [scanMode, setScanMode] = useState<'camera' | 'external'>('camera')
  const [lastScannedResult, setLastScannedResult] = useState<string>("")
  const [externalScannerConnected, setExternalScannerConnected] = useState(false)
  const [error, setError] = useState<string>("")
  
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)
  const qrCodeRef = useRef<Html5Qrcode | null>(null)
  const externalInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Simulate external scanner connection check
    const checkExternalScanner = () => {
      // This would be replaced with actual external scanner detection logic
      setExternalScannerConnected(Math.random() > 0.5)
    }
    
    checkExternalScanner()
    const interval = setInterval(checkExternalScanner, 5000)
    
    return () => clearInterval(interval)
  }, [])

  const startCameraScanning = async () => {
    try {
      setError("")
      setIsScanning(true)
      
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true,
        supportedScanTypes: []
      }

      scannerRef.current = new Html5QrcodeScanner("qr-reader", config, false)
      
      scannerRef.current.render(
        (decodedText) => {
          setLastScannedResult(decodedText)
          onScanSuccess(decodedText)
          stopScanning()
        },
        (error) => {
          console.log("QR scan error:", error)
        }
      )
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to start camera scanner"
      setError(errorMsg)
      onScanError?.(errorMsg)
      setIsScanning(false)
    }
  }

  const stopScanning = () => {
    try {
      if (scannerRef.current) {
        scannerRef.current.clear()
        scannerRef.current = null
      }
      if (qrCodeRef.current) {
        qrCodeRef.current.stop()
        qrCodeRef.current = null
      }
    } catch (err) {
      console.log("Error stopping scanner:", err)
    } finally {
      setIsScanning(false)
    }
  }

  const handleExternalScan = () => {
    if (externalInputRef.current) {
      externalInputRef.current.focus()
    }
  }

  const handleExternalInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const value = e.currentTarget.value.trim()
      if (value) {
        setLastScannedResult(value)
        onScanSuccess(value)
        e.currentTarget.value = ""
      }
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5" />
            QR Code Scanner
          </CardTitle>
          <CardDescription>
            Scan QR codes using your camera or external scanner
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Scanner Mode Selection */}
          <div className="flex gap-2">
            <Button
              variant={scanMode === 'camera' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setScanMode('camera')}
              className="flex items-center gap-2"
            >
              <Camera className="h-4 w-4" />
              Camera
            </Button>
            <Button
              variant={scanMode === 'external' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setScanMode('external')}
              className="flex items-center gap-2"
              disabled={!externalScannerConnected}
            >
              {externalScannerConnected ? (
                <Wifi className="h-4 w-4" />
              ) : (
                <WifiOff className="h-4 w-4" />
              )}
              External Scanner
            </Button>
          </div>

          {/* External Scanner Status */}
          <div className="flex items-center gap-2">
            <Badge variant={externalScannerConnected ? 'default' : 'secondary'}>
              {externalScannerConnected ? (
                <>
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Scanner Connected
                </>
              ) : (
                <>
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Scanner Disconnected
                </>
              )}
            </Badge>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* Camera Scanner */}
          {scanMode === 'camera' && (
            <div className="space-y-3">
              <div className="flex gap-2">
                {!isScanning ? (
                  <Button onClick={startCameraScanning} className="flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Start Camera Scanner
                  </Button>
                ) : (
                  <Button onClick={stopScanning} variant="secondary">
                    Stop Scanner
                  </Button>
                )}
              </div>
              
              {isScanning && (
                <div className="border rounded-lg p-4 bg-black">
                  <div id="qr-reader" className="w-full"></div>
                </div>
              )}
            </div>
          )}

          {/* External Scanner */}
          {scanMode === 'external' && (
            <div className="space-y-3">
              <Button
                onClick={handleExternalScan}
                disabled={!externalScannerConnected}
                className="flex items-center gap-2"
              >
                <Scan className="h-4 w-4" />
                Activate External Scanner
              </Button>
              
              <div className="p-4 border rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-2">
                  {externalScannerConnected
                    ? "External scanner ready. Scan a QR code or enter manually below:"
                    : "Connect your external scanner to continue."}
                </p>
                <input
                  ref={externalInputRef}
                  type="text"
                  placeholder="Scan result will appear here..."
                  className="w-full p-2 border rounded bg-background"
                  onKeyDown={handleExternalInput}
                  disabled={!externalScannerConnected}
                />
              </div>
            </div>
          )}

          {/* Last Scanned Result */}
          {lastScannedResult && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-700 dark:text-green-400">
                    Last Scanned Result:
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-300 font-mono break-all">
                    {lastScannedResult}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 
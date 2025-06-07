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
      
      // Check for camera permission first
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          // Request camera permission
          const stream = await navigator.mediaDevices.getUserMedia({ video: true })
          // Stop the stream immediately, we just needed permission
          stream.getTracks().forEach(track => track.stop())
        } catch (permissionError) {
          throw new Error("Camera permission denied. Please allow camera access and try again.")
        }
      } else {
        throw new Error("Camera not supported by this browser.")
      }

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true,
        supportedScanTypes: [],
        showTorchButtonIfSupported: true,
        showZoomSliderIfSupported: true,
        defaultZoomValueIfSupported: 2,
        useBarCodeDetectorIfSupported: true
      }

      scannerRef.current = new Html5QrcodeScanner("qr-reader", config, false)
      
      scannerRef.current.render(
        (decodedText) => {
          setLastScannedResult(decodedText)
          onScanSuccess(decodedText)
          stopScanning()
        },
        (error) => {
          // Don't show errors for scanning attempts, only real errors
          if (!error.includes("No QR code found")) {
            console.log("QR scan error:", error)
          }
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

  const requestCameraPermission = async () => {
    try {
      setError("")
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        stream.getTracks().forEach(track => track.stop())
        setError("")
        // Permission granted, show success message briefly
        setLastScannedResult("Camera permission granted! You can now start scanning.")
      }
    } catch (err) {
      setError("Unable to access camera. Please check your browser settings and ensure this site has camera permissions.")
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setError("")
      const { default: jsQR } = await import('jsqr')
      
      // Create canvas to read image
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        throw new Error('Could not create canvas context')
      }

      // Create image element
      const img = new Image()
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const code = jsQR(imageData.data, imageData.width, imageData.height)
        
        if (code) {
          setLastScannedResult(code.data)
          onScanSuccess(code.data)
        } else {
          setError("No QR code found in the uploaded image.")
        }
      }
      
      img.onerror = () => {
        setError("Failed to load the uploaded image.")
      }
      
      img.src = URL.createObjectURL(file)
    } catch (err) {
      setError("Failed to process the uploaded image.")
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
              <div className="flex items-start gap-2 text-red-700 dark:text-red-400">
                <AlertCircle className="h-4 w-4 mt-0.5" />
                <div className="flex-1">
                  <span className="text-sm">{error}</span>
                  {error.includes("permission") && (
                    <div className="mt-2 space-y-2">
                      <p className="text-xs text-red-600 dark:text-red-300">
                        To use the camera scanner:
                      </p>
                      <ul className="text-xs text-red-600 dark:text-red-300 list-disc list-inside space-y-1">
                        <li>Click the camera icon in your browser's address bar</li>
                        <li>Select "Allow" when prompted for camera access</li>
                        <li>Refresh the page if needed</li>
                        <li>Make sure you're using HTTPS (not HTTP)</li>
                      </ul>
                      <Button 
                        onClick={requestCameraPermission}
                        size="sm" 
                        variant="outline"
                        className="mt-2"
                      >
                        Request Camera Permission
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Camera Scanner */}
          {scanMode === 'camera' && (
            <div className="space-y-3">
              <div className="flex gap-2 flex-wrap">
                {!isScanning ? (
                  <>
                    <Button onClick={startCameraScanning} className="flex items-center gap-2">
                      <Camera className="h-4 w-4" />
                      Start Camera Scanner
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="qr-file-input"
                    />
                    <Button 
                      onClick={() => document.getElementById('qr-file-input')?.click()}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      📷 Upload QR Image
                    </Button>
                  </>
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
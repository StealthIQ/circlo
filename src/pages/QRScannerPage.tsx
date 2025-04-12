import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { NavBar } from '@/components/layout/NavBar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Scan, CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { scanQrCode } from '@/services/qrCodeService';
import { useAuth } from '@/contexts/AuthContext';

const QRScannerPage: React.FC = () => {
  const { user } = useAuth();
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanPoints, setScanPoints] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const scannerRef = useRef<any>(null);
  const scannerContainerId = "html5qr-code-full-region";

  useEffect(() => {
    // Initialize scanner when component mounts and scanning is active
    if (isScanning) {
      const onScanSuccess = async (decodedText: string) => {
        console.log(`QR Code detected: ${decodedText}`);
        setScanResult(decodedText);
        setIsScanning(false);
        
        // Process the QR Code data
        await processQrCode(decodedText);
      };

      const onScanFailure = (error: any) => {
        // Handle scan failure if needed
        console.log(`QR scan error: ${error}`);
      };

      // Configure scanner
      scannerRef.current = new Html5QrcodeScanner(
        scannerContainerId,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          formatsToSupport: [ 0x1 ] // QR code format only
        },
        /* verbose= */ false
      );
      
      scannerRef.current.render(onScanSuccess, onScanFailure);

      // Clean up function
      return () => {
        if (scannerRef.current && scannerRef.current.clear) {
          try {
            scannerRef.current.clear();
          } catch (error) {
            console.error("Error clearing scanner:", error);
          }
        }
      };
    }
  }, [isScanning]);

  const startScanning = () => {
    setScanResult(null);
    setIsScanning(true);
  };

  const stopScanning = () => {
    setIsScanning(false);
    // Clear the scanner if it's initialized
    if (scannerRef.current && scannerRef.current.clear) {
      try {
        scannerRef.current.clear();
      } catch (error) {
        console.error("Error clearing scanner:", error);
      }
    }
  };

  const processQrCode = async (qrData: string) => {
    // Here you would process the QR code data by sending it to backend
    if (!user) {
      toast.error("You must be logged in to scan QR codes");
      return;
    }

    setIsProcessing(true);

    try {
      const result = await scanQrCode(qrData, user.id);
      if (result.success) {
        const points = result.points || Math.floor(Math.random() * 76) + 25; // Fallback if points not returned
        setScanPoints(points);
        
        // Show success toast with animation
        toast.success("Points awarded!", {
          description: `You've earned ${points} points for recycling!`,
          icon: <CheckCircle2 className="text-green-500 h-5 w-5" />
        });
      } else {
        toast.error(result.message || "Failed to process QR code", {
          icon: <ShieldAlert className="text-red-500 h-5 w-5" />
        });
      }
    } catch (error) {
      console.error("Error processing QR code:", error);
      toast.error("Something went wrong while processing the QR code", {
        icon: <ShieldAlert className="text-red-500 h-5 w-5" />
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen pb-20">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-primary text-white pt-12 pb-6 px-4 rounded-b-3xl shadow-lg"
      >
        <h1 className="text-2xl font-bold flex items-center">
          <Scan className="mr-2" /> Scan QR Code
        </h1>
        <p className="text-primary-foreground/80 text-sm mt-1">
          Recycle items and earn points
        </p>
      </motion.div>
      
      <div className="px-4 py-6">
        {!isScanning && !scanResult ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center"
          >
            <div className="bg-white p-6 rounded-xl shadow-md mb-6 border border-gray-100">
              <motion.div 
                className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Scan size={36} className="text-primary" />
              </motion.div>
              
              <h2 className="text-lg font-medium mb-4">Ready to Recycle?</h2>
              <p className="text-gray-600 mb-6">
                Find the QR code on the recycling bin and scan it to earn points for your recycling activity.
              </p>
              <Button 
                onClick={startScanning} 
                className="w-full font-medium text-primary-foreground flex items-center justify-center gap-2 group"
              >
                Start Scanning 
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h3 className="text-md font-medium mb-3">How it works:</h3>
              <ol className="text-left text-gray-600 space-y-3 list-decimal pl-5">
                <motion.li 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  Find a Circlo QR code on a participating recycling bin
                </motion.li>
                <motion.li 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  Click "Start Scanning" and point your camera at the code
                </motion.li>
                <motion.li 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  Hold steady until the QR code is recognized
                </motion.li>
                <motion.li 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                >
                  Earn points automatically for your recycling activity
                </motion.li>
              </ol>
            </div>
          </motion.div>
        ) : isScanning ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
          >
            <div className="relative">
              <motion.div 
                className="absolute inset-0 border-4 border-dashed border-primary/50 rounded-lg pointer-events-none z-10"
                animate={{
                  borderColor: ['rgba(8, 59, 76, 0.3)', 'rgba(8, 59, 76, 0.8)', 'rgba(8, 59, 76, 0.3)']
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div id={scannerContainerId} className="mb-4 relative z-0" />
            </div>
            <p className="text-center text-sm text-gray-500 mb-4">Point camera at QR code</p>
            <Button 
              onClick={stopScanning} 
              variant="secondary" 
              className="w-full"
            >
              Cancel Scanning
            </Button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 rounded-xl shadow-md text-center border border-gray-100"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2"
            >
              <CheckCircle2 size={40} className="text-secondary" />
            </motion.div>
            
            <h2 className="text-xl font-medium mb-2 text-green-600">Success!</h2>
            <p className="mb-2">You've successfully scanned a QR code.</p>
            
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-green-50 p-4 rounded-lg mb-6"
            >
              <p className="text-lg font-bold text-secondary">+{scanPoints} points</p>
              <p className="text-sm text-gray-600">added to your account</p>
            </motion.div>
            
            <p className="text-gray-500 text-xs mb-6 break-all">
              {scanResult}
            </p>
            <Button 
              onClick={startScanning} 
              className="w-full"
            >
              Scan Another Code
            </Button>
          </motion.div>
        )}
      </div>
      
      <NavBar />
    </div>
  );
};

export default QRScannerPage;

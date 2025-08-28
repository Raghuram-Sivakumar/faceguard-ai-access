import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Camera, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const UserVerification = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<'granted' | 'denied' | null>(null);

  const startCamera = useCallback(async () => {
    try {
      console.log("Starting camera...");
      
      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera not supported in this browser");
      }

      console.log("Requesting camera access...");
      setIsCapturing(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false,
      });
      
      console.log("Camera stream obtained:", mediaStream);
      setStream(mediaStream);
      
      if (videoRef.current) {
        console.log("Setting video source...");
        videoRef.current.srcObject = mediaStream;
        videoRef.current.muted = true;

        const tryPlay = async () => {
          try {
            await videoRef.current!.play();
            console.log("Video playing successfully");
          } catch (err) {
            console.error("Video play failed:", err);
          }
        };

        videoRef.current.onloadedmetadata = () => {
          console.log("Video metadata loaded");
          tryPlay();
        };
        videoRef.current.oncanplay = () => {
          console.log("Video can play (event)");
        };

        // Attempt immediate play as well
        tryPlay();
      }
    } catch (error) {
      console.error("Camera error:", error);
      setIsCapturing(false);
      toast({
        title: "Camera Error", 
        description: error instanceof Error ? error.message : "Unable to access camera. Please check permissions and try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCapturing(false);
  }, [stream]);

  const captureImage = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    if (video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
      toast({
        title: "Camera not ready",
        description: "Please wait a moment and try again.",
        variant: "destructive",
      });
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);
    const imageData = canvas.toDataURL('image/jpeg');
    setCapturedImage(imageData);
    stopCamera();
  }, [stopCamera, toast]);
  
  const onFileSelected = useCallback((e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setCapturedImage(reader.result as string);
      stopCamera();
    };
    reader.readAsDataURL(file);
  }, [stopCamera]);

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const verifyUser = useCallback(async () => {
    if (!capturedImage) return;
    
    setIsVerifying(true);
    
    // Simulate AI verification process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Random result for demo (in real app, this would call AI service)
    const isGranted = Math.random() > 0.3;
    setVerificationResult(isGranted ? 'granted' : 'denied');
    setIsVerifying(false);
    
    toast({
      title: isGranted ? "Access Granted" : "Access Denied",
      description: isGranted 
        ? "Welcome! Your identity has been verified." 
        : "Access denied. Please try again or contact administrator.",
      variant: isGranted ? "default" : "destructive",
    });
  }, [capturedImage, toast]);

  const resetVerification = useCallback(() => {
    setCapturedImage(null);
    setVerificationResult(null);
    setIsVerifying(false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-foreground">User Verification</h1>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Identity Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!capturedImage ? (
              <div className="space-y-4">
                <div className="relative bg-muted rounded-lg overflow-hidden">
                  {isCapturing ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-80 object-cover"
                      onCanPlay={() => {
                        console.log("Video can play");
                        if (videoRef.current) {
                          videoRef.current.play().catch(console.error);
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-80 flex items-center justify-center">
                      <div className="text-center">
                        <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Click "Start Camera" to begin</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-4">
                  {!isCapturing ? (
                    <>
                      <Button onClick={startCamera} className="flex-1">
                        Start Camera
                      </Button>
                      <Button variant="secondary" onClick={triggerFileInput}>
                        Upload/Take Photo
                      </Button>
                    </>
                  ) : (
                    <> 
                      <Button onClick={captureImage} className="flex-1">
                        Capture Photo
                      </Button>
                      <Button onClick={() => videoRef.current?.play()} variant="outline">
                        Play Video
                      </Button>
                      <Button onClick={stopCamera} variant="outline">
                        Stop Camera
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative bg-muted rounded-lg overflow-hidden">
                  <img
                    src={capturedImage}
                    alt="Captured"
                    className="w-full h-80 object-cover"
                  />
                </div>
                
                <div className="flex gap-4">
                  <Button
                    onClick={verifyUser}
                    disabled={isVerifying}
                    className="flex-1"
                  >
                    {isVerifying ? "Verifying..." : "Verify Identity"}
                  </Button>
                  <Button onClick={resetVerification} variant="outline">
                    Retake Photo
                  </Button>
                </div>
              </div>
            )}

            {verificationResult && (
              <Alert className={verificationResult === 'granted' ? 'border-success' : 'border-destructive'}>
                <div className="flex items-center gap-2">
                  {verificationResult === 'granted' ? (
                    <CheckCircle className="w-4 h-4 text-success" />
                  ) : (
                    <XCircle className="w-4 h-4 text-destructive" />
                  )}
                  <AlertDescription className={verificationResult === 'granted' ? 'text-success' : 'text-destructive'}>
                    {verificationResult === 'granted' 
                      ? "Access Granted - Identity verified successfully!"
                      : "Access Denied - Unable to verify identity. Please try again."
                    }
                  </AlertDescription>
                </div>
              </Alert>
            )}
          </CardContent>
        </Card>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="user"
          className="hidden"
          onChange={onFileSelected}
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default UserVerification;
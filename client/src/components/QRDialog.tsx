import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QrCode, Download, ExternalLink } from "lucide-react";
import { useQRCode } from "next-qrcode";
import { Badge } from "@shared/schema";

interface QRDialogProps {
  badge: Badge;
}

export function QRDialog({ badge }: QRDialogProps) {
  const { Canvas } = useQRCode();
  const url = `${window.location.origin}/view/${badge.qrCodeId}`;

  const downloadQR = () => {
    const canvas = document.getElementById(`qr-${badge.id}`) as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `badge-${badge.name.replace(/\s+/g, '-').toLowerCase()}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 h-9 text-xs font-medium">
          <QrCode className="w-3.5 h-3.5" /> View QR
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm text-center">
        <DialogHeader>
          <DialogTitle className="text-center font-display text-xl">{badge.name}</DialogTitle>
          <p className="text-sm text-muted-foreground text-center">Scan to view schedule</p>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-border/50 shadow-inner my-4">
          <Canvas
            text={url}
            options={{
              errorCorrectionLevel: 'M',
              margin: 3,
              scale: 4,
              width: 240,
              color: {
                dark: '#020617', // var(--foreground) roughly
                light: '#ffffff',
              },
            }}
          />
          {/* Hidden canvas for downloading since the lib renders SVG sometimes or we need ref access */}
          {/* Actually next-qrcode renders a canvas element directly */}
          {/* We'll use a specific ID to grab it for download */}
          <div className="hidden">
             <Canvas text={url} options={{ width: 500 }} />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={downloadQR} className="w-full gap-2">
            <Download className="w-4 h-4" /> Save Image
          </Button>
          <Button asChild className="w-full gap-2">
            <a href={`/view/${badge.qrCodeId}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" /> Open Page
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

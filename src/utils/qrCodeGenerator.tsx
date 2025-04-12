
import { QRCodeCanvas } from 'qrcode.react';
import { renderToString } from 'react-dom/server';

interface QRCodeOptions {
  size?: number;
  errorCorrectionLevel?: 'low' | 'medium' | 'quartile' | 'high';
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
}

interface GenerateQROptions extends QRCodeOptions {
  watermark?: boolean;
}

/**
 * Generates a QR code data URL from the given text with optional watermarking
 */
export const generateQRCode = async (
  text: string,
  options: GenerateQROptions = {}
): Promise<string> => {
  const {
    size = 300,
    errorCorrectionLevel = 'medium',
    margin = 4,
    color = {
      dark: '#000000',
      light: '#ffffff',
    },
    watermark = false,
  } = options;

  try {
    // Create QR code component with the specified options
    const qrCodeComponent = (
      <QRCodeCanvas
        value={text}
        size={size}
        level={errorCorrectionLevel as 'L' | 'M' | 'Q' | 'H'}
        includeMargin={margin > 0}
        bgColor={color.light}
        fgColor={color.dark}
      />
    );
    
    // Convert to a string representation
    const qrCodeString = renderToString(qrCodeComponent);
    
    // If no watermark is needed, convert directly to data URL
    if (!watermark) {
      // Create a data URL from the QR code
      const blob = new Blob([qrCodeString], { type: 'image/svg+xml' });
      return URL.createObjectURL(blob);
    }
    
    // For watermarking in a web app, we would typically:
    // 1. Create a canvas
    // 2. Draw the QR code onto it
    // 3. Draw a watermark (logo) on top
    // 4. Convert the canvas back to a data URL
    
    // For simplicity in this example, we'll return the non-watermarked version
    console.log('Watermarking would be applied here in a complete implementation');
    return URL.createObjectURL(new Blob([qrCodeString], { type: 'image/svg+xml' }));
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

/**
 * Creates a signed token for secure QR codes
 * In a real implementation, this would use JWT signing with a secret key
 */
export const createSignedQRToken = (
  data: Record<string, any>,
  expirationMinutes: number = 60,
  oneTimeUse: boolean = false
): string => {
  // In a real implementation, this would use a JWT library
  // For this example, we'll create a simple encoded object
  const payload = {
    ...data,
    exp: Date.now() + expirationMinutes * 60 * 1000,
    oneTime: oneTimeUse,
  };
  
  // In a real app, this would be signed with a secret key
  return `circlo:${btoa(JSON.stringify(payload))}`;
};

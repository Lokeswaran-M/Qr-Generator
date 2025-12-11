import React, { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import Barcode from "react-barcode";

function App() {
  const [text, setText] = useState("");
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [codeType, setCodeType] = useState("qr"); // "qr" or "barcode"
  
  const [qrConfig, setQrConfig] = useState({
    size: 256,
    fgColor: "#000000",
    bgColor: "#ffffff",
    level: "H",
    includeMargin: true
  });
  
  const [barcodeConfig, setBarcodeConfig] = useState({
    format: "CODE128",
    width: 2,
    height: 100,
    displayValue: true,
    textAlign: "center",
    textPosition: "bottom",
    fontSize: 16
  });
  
  const [shapeConfig, setShapeConfig] = useState({
    borderStyle: "square",
    centerStyle: "square"
  });
  
  const [logoConfig, setLogoConfig] = useState({
    enabled: false,
    file: null,
    type: "upload",
    size: 40,
    removeBg: false
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const qrRef = useRef(null);
  const barcodeRef = useRef(null);
  const fileInputRef = useRef(null);

  // Barcode formats
  const barcodeFormats = [
    { value: "CODE128", label: "CODE128", description: "General purpose" },
    { value: "CODE39", label: "CODE39", description: "Alphanumeric" },
    { value: "EAN13", label: "EAN13", description: "Product codes" },
    { value: "EAN8", label: "EAN8", description: "Small product codes" },
    { value: "UPC", label: "UPC", description: "US products" },
    { value: "ITF14", label: "ITF14", description: "Shipping" },
    { value: "MSI", label: "MSI", description: "Inventory" },
    { value: "pharmacode", label: "Pharmacode", description: "Pharmaceutical" }
  ];

  // Background removal function using Canvas API
  const removeBackground = (imageUrl, threshold = 200) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the original image
        ctx.drawImage(img, 0, 0);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Simple background removal based on color threshold
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // Calculate brightness
          const brightness = (r + g + b) / 3;
          
          // If pixel is close to white, make it transparent
          if (brightness > threshold) {
            data[i + 3] = 0; // Set alpha to 0 (transparent)
          }
        }
        
        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL());
      };
      img.src = imageUrl;
    });
  };

  // Enhanced logo upload with background removal
  const handleLogoUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const originalUrl = URL.createObjectURL(file);
      
      if (logoConfig.removeBg) {
        setIsRemovingBg(true);
        try {
          const processedUrl = await removeBackground(originalUrl);
          setLogoConfig(prev => ({
            ...prev,
            file: processedUrl,
            enabled: true
          }));
        } catch (error) {
          console.error("Background removal failed:", error);
          // Fallback to original image
          setLogoConfig(prev => ({
            ...prev,
            file: originalUrl,
            enabled: true
          }));
        }
        setIsRemovingBg(false);
      } else {
        setLogoConfig(prev => ({
          ...prev,
          file: originalUrl,
          enabled: true
        }));
      }
    }
  };

  // Download function for both QR and Barcode
  const handleDownload = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      if (codeType === "qr") {
        downloadQRCode();
      } else {
        downloadBarcode();
      }
    }, 100);
  };

  const downloadQRCode = () => {
    if (!qrRef.current) {
      setIsGenerating(false);
      return;
    }
    
    const canvas = qrRef.current.querySelector("canvas");
    if (canvas) {
      if (logoConfig.enabled && logoConfig.file) {
        const finalCanvas = document.createElement('canvas');
        const ctx = finalCanvas.getContext('2d');
        
        finalCanvas.width = canvas.width;
        finalCanvas.height = canvas.height;
        
        // Handle transparent background
        if (qrConfig.bgColor === "transparent") {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        } else {
          ctx.fillStyle = qrConfig.bgColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        ctx.drawImage(canvas, 0, 0);
        
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const iconSize = logoConfig.size;
          
          if (!logoConfig.removeBg) {
            ctx.fillStyle = 'white';
            ctx.fillRect(
              centerX - iconSize/2 - 4, 
              centerY - iconSize/2 - 4, 
              iconSize + 8, 
              iconSize + 8
            );
          }
          
          ctx.drawImage(
            img, 
            centerX - iconSize/2, 
            centerY - iconSize/2, 
            iconSize, 
            iconSize
          );
          
          downloadCanvas(finalCanvas);
        };
        img.onerror = () => {
          downloadCanvas(canvas);
        };
        img.src = logoConfig.file;
      } else {
        downloadCanvas(canvas);
      }
    } else {
      setIsGenerating(false);
    }
  };
const downloadBarcode = () => {
  const svg = barcodeRef.current?.querySelector("svg");
  if (!svg) return;

  const bbox = svg.getBBox();
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = bbox.width;
  canvas.height = bbox.height + (barcodeConfig.displayValue ? 20 : 0);

  // ⚡ Transparent background
  if (qrConfig.bgColor === "transparent") {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = qrConfig.bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  const svgData = new XMLSerializer().serializeToString(svg);
  const img = new Image();
  img.src = "data:image/svg+xml;base64," + btoa(svgData);

  img.onload = () => {
    ctx.drawImage(img, 0, 0);
    downloadCanvas(canvas);
  };
};

  const downloadCanvas = (canvas) => {
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${codeType}-${Date.now()}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    setIsGenerating(false);
  };

  const presetColors = [
    { fg: "#000000", bg: "#ffffff", name: "Classic" },
    { fg: "#000000", bg: "transparent", name: "Transparent" },
    { fg: "#3B82F6", bg: "#EFF6FF", name: "Blue" },
    { fg: "#10B981", bg: "#ECFDF5", name: "Green" },
    { fg: "#8B5CF6", bg: "#F5F3FF", name: "Purple" },
    { fg: "#EF4444", bg: "#FEF2F2", name: "Red" },
    { fg: "#F59E0B", bg: "#FFFBEB", name: "Amber" },
    { fg: "#06B6D4", bg: "#ECFEFF", name: "Cyan" },
    { fg: "#EC4899", bg: "#FDF2F8", name: "Pink" }
  ];

  const borderStyles = [
    { id: "square", name: "Square", description: "Default sharp corners" },
    { id: "rounded", name: "Rounded", description: "Smooth rounded borders" },
  ];

  const applyPreset = (preset) => {
    setQrConfig(prev => ({
      ...prev,
      fgColor: preset.fg,
      bgColor: preset.bg
    }));
  };

  const removeLogo = () => {
    setLogoConfig(prev => ({
      ...prev,
      file: null,
      enabled: false,
      removeBg: false
    }));
  };

  const invertColors = () => {
    setQrConfig(prev => ({
      ...prev,
      fgColor: prev.bgColor === "transparent" ? "#000000" : prev.bgColor,
      bgColor: prev.fgColor === "transparent" ? "#ffffff" : prev.fgColor
    }));
  };

  const getQRCodeProps = () => {
    const bgColor = qrConfig.bgColor === "transparent" ? undefined : qrConfig.bgColor;
    
    return {
      value: text || " ",
      size: qrConfig.size,
      fgColor: qrConfig.fgColor,
      bgColor: bgColor,
      level: qrConfig.level,
      includeMargin: qrConfig.includeMargin,
      style: { 
        display: 'block',
        margin: '0 auto',
        ...getQRCodeStyle()
      }
    };
  };

const getBarcodeProps = () => {
  return {
    value: text || " ",
    format: barcodeConfig.format,
    width: barcodeConfig.width,
    height: barcodeConfig.height,
    displayValue: barcodeConfig.displayValue,
    textAlign: barcodeConfig.textAlign,
    textPosition: barcodeConfig.textPosition,
    fontSize: barcodeConfig.fontSize,
    lineColor: qrConfig.fgColor,               // black bars
    background: qrConfig.bgColor,              // <-- accepts transparent now
    margin: 0                                  // remove extra white space
  };
};


  const getQRCodeStyle = () => {
    const style = {};
    
    switch(shapeConfig.borderStyle) {
      case "rounded":
        style.borderRadius = "20px";
        break;
      default:
        style.borderRadius = "0px";
    }
    
    return style;
  };

  const getPreviewSize = () => {
    return 320;
  };

  const renderCenterIcon = (sizeMultiplier = 1) => {
    if (!logoConfig.enabled || !logoConfig.file || codeType !== "qr") return null;
    
    const iconSize = logoConfig.size * sizeMultiplier;
    const iconStyle = {
      width: iconSize,
      height: iconSize,
      backgroundColor: logoConfig.removeBg ? 'transparent' : 'white',
      border: logoConfig.removeBg ? 'none' : '2px solid #f3f4f6',
      borderRadius: '8px'
    };
    
    return (
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-lg p-1 shadow-lg"
        style={iconStyle}
      >
        <img
          src={logoConfig.file}
          alt="Logo"
          className="object-contain w-full h-full rounded"
        />
      </div>
    );
  };

  // Vector SVG Icons
  const DownloadIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );

  const QrCodeIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
    </svg>
  );

  const BarcodeIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m-4-4h8M8 8h8m4 0h2a2 2 0 012 2v8a2 2 0 01-2 2h-2M4 4h2a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" />
    </svg>
  );

  const LinkIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );

  const PaletteIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  );

  const ZapIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );

  const ShapesIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm12 0a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  );

  const ImageIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  const SettingsIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  const MaximizeIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
    </svg>
  );

  const CloseIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  const CheckIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );

  const MagicIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                QR & Barcode Designer Pro
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Create stunning QR codes and professional barcodes with advanced customization
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 mb-8 border border-white/20">
          <div className="grid xl:grid-cols-3 gap-8">
            {/* Left Column - Controls */}
            <div className="xl:col-span-2 space-y-8 max-h-[80vh] overflow-y-auto pr-4">
              {/* Code Type Selection */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-100">
                <label className="flex items-center gap-3 text-lg font-semibold text-gray-800 mb-4">
                  <span className="w-5 h-5 text-blue-600 flex items-center justify-center">
                    <LinkIcon />
                  </span>
                  Code Type & Content
                </label>
                
                {/* Code Type Toggle */}
                <div className="flex gap-4 mb-4">
                  <button
                    onClick={() => setCodeType("qr")}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-medium transition-all ${
                      codeType === "qr" 
                        ? "border-blue-500 bg-blue-500 text-white shadow-lg" 
                        : "border-gray-200 bg-white text-gray-700 hover:border-blue-300"
                    }`}
                  >
                    <QrCodeIcon />
                    QR Code
                  </button>
                  <button
                    onClick={() => setCodeType("barcode")}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-medium transition-all ${
                      codeType === "barcode" 
                        ? "border-green-500 bg-green-500 text-white shadow-lg" 
                        : "border-gray-200 bg-white text-gray-700 hover:border-green-300"
                    }`}
                  >
                    <BarcodeIcon />
                    Barcode
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder={
                      codeType === "qr" 
                        ? "https://example.com or any text you want to encode..." 
                        : "Enter numbers or text for barcode..."
                    }
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  />
                </div>
              </div>

              {/* Design Sections Grid */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* QR Code Specific Settings */}
                {codeType === "qr" && (
                  <>
                    {/* Shape Section */}
                    <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-lg">
                      <div className="flex items-center gap-3 text-lg font-semibold text-gray-800 mb-4">
                        <span className="w-5 h-5 text-green-600 flex items-center justify-center">
                          <ShapesIcon />
                        </span>
                        Shape Design
                      </div>
                      <div className="space-y-6">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-3 block">
                            Border Style
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            {borderStyles.map((style) => (
                              <button
                                key={style.id}
                                onClick={() => setShapeConfig(prev => ({ ...prev, borderStyle: style.id }))}
                                className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all duration-200 ${
                                  shapeConfig.borderStyle === style.id
                                    ? "border-blue-500 bg-blue-50 shadow-md scale-105"
                                    : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                                }`}
                                title={style.description}
                              >
                                <span className="text-lg">{style.id === "square" ? "⬜" : "⭕"}</span>
                                <span className="text-xs font-medium">{style.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Center Logo Section */}
                    <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-lg">
                      <div className="flex items-center gap-3 text-lg font-semibold text-gray-800 mb-4">
                        <span className="w-5 h-5 text-purple-600 flex items-center justify-center">
                          <ImageIcon />
                        </span>
                        Center Logo
                      </div>
                      <div className="space-y-4">
                        {!logoConfig.enabled && (
                          <div className="space-y-3">
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleLogoUpload}
                              className="hidden"
                            />
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
                            >
                              Upload Center Image
                            </button>
                          </div>
                        )}

                        {logoConfig.enabled && (
                          <>
                            <div className="text-center p-4 border-2 border-green-200 bg-green-50 rounded-xl">
                              <div className="flex items-center justify-center gap-2 text-green-700 font-medium">
                                <CheckIcon />
                                Image uploaded successfully!
                              </div>
                              <p className="text-green-600 text-sm mt-1">It will appear in downloaded QR codes</p>
                            </div>

                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-2 block">
                                Size: {logoConfig.size}px
                              </label>
                              <input
                                type="range"
                                min="20"
                                max="80"
                                value={logoConfig.size}
                                onChange={(e) => setLogoConfig(prev => ({ ...prev, size: parseInt(e.target.value) }))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                              />
                            </div>

                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                id="removeBg"
                                checked={logoConfig.removeBg}
                                onChange={(e) => setLogoConfig(prev => ({ ...prev, removeBg: e.target.checked }))}
                                className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                              />
                              <label htmlFor="removeBg" className="text-sm font-medium text-gray-700">
                                Remove logo background
                              </label>
                            </div>

                            {logoConfig.removeBg && (
                              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                                <div className="flex items-center gap-2 text-yellow-800 text-sm">
                                  <MagicIcon />
                                  <span>Background removal works best with logos on plain backgrounds</span>
                                </div>
                              </div>
                            )}

                            <button
                              onClick={removeLogo}
                              className="w-full px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                            >
                              <CloseIcon />
                              Remove Center Image
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Barcode Specific Settings */}
                {codeType === "barcode" && (
                  <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-lg lg:col-span-2">
                    <div className="flex items-center gap-3 text-lg font-semibold text-gray-800 mb-4">
                      <span className="w-5 h-5 text-green-600 flex items-center justify-center">
                        <BarcodeIcon />
                      </span>
                      Barcode Settings
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-3 block">
                          Barcode Format
                        </label>
                        <select
                          value={barcodeConfig.format}
                          onChange={(e) => setBarcodeConfig(prev => ({ ...prev, format: e.target.value }))}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                        >
                          {barcodeFormats.map(format => (
                            <option key={format.value} value={format.value}>
                              {format.label} - {format.description}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Bar Width: {barcodeConfig.width}px
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="3"
                          step="0.1"
                          value={barcodeConfig.width}
                          onChange={(e) => setBarcodeConfig(prev => ({ ...prev, width: parseFloat(e.target.value) }))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Height: {barcodeConfig.height}px
                        </label>
                        <input
                          type="range"
                          min="50"
                          max="200"
                          value={barcodeConfig.height}
                          onChange={(e) => setBarcodeConfig(prev => ({ ...prev, height: parseInt(e.target.value) }))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Font Size: {barcodeConfig.fontSize}px
                        </label>
                        <input
                          type="range"
                          min="10"
                          max="24"
                          value={barcodeConfig.fontSize}
                          onChange={(e) => setBarcodeConfig(prev => ({ ...prev, fontSize: parseInt(e.target.value) }))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="displayValue"
                          checked={barcodeConfig.displayValue}
                          onChange={(e) => setBarcodeConfig(prev => ({ ...prev, displayValue: e.target.checked }))}
                          className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                        />
                        <label htmlFor="displayValue" className="text-sm font-medium text-gray-700">
                          Show text value
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* QR Settings */}
                <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-lg">
                  <div className="flex items-center gap-3 text-lg font-semibold text-gray-800 mb-4">
                    <span className="w-5 h-5 text-orange-600 flex items-center justify-center">
                      <SettingsIcon />
                    </span>
                    {codeType === "qr" ? "QR Settings" : "General Settings"}
                  </div>
                  <div className="space-y-4">
                    {codeType === "qr" && (
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-3 block">Error Correction</label>
                        <select
                          value={qrConfig.level}
                          onChange={(e) => setQrConfig(prev => ({ ...prev, level: e.target.value }))}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                        >
                          <option value="L">Low (7%) - Smallest</option>
                          <option value="M">Medium (15%) - Balanced</option>
                          <option value="Q">Quartile (25%) - Recommended</option>
                          <option value="H">High (30%) - Most Robust</option>
                        </select>
                      </div>
                    )}
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-3 block">
                        {codeType === "qr" ? "QR Size" : "Output Size"}
                      </label>
                      <select
                        value={qrConfig.size}
                        onChange={(e) => setQrConfig(prev => ({ ...prev, size: parseInt(e.target.value) }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                      >
                        <option value={128}>Small (128px)</option>
                        <option value={256}>Medium (256px)</option>
                        <option value={384}>Large (384px)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Color Customization */}
              <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-lg">
                <div className="flex items-center gap-3 text-lg font-semibold text-gray-800 mb-6">
                  <span className="w-5 h-5 text-pink-600 flex items-center justify-center">
                    <PaletteIcon />
                  </span>
                  Color Design
                </div>
                
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-700 mb-4 block">Color Presets</label>
                  <div className="grid grid-cols-4 gap-3">
                    {presetColors.map((preset, index) => (
                      <button
                        key={index}
                        onClick={() => applyPreset(preset)}
                        className="p-3 rounded-xl border-2 border-gray-200 hover:border-blue-500 transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
                        style={{ backgroundColor: preset.bg === "transparent" ? "rgba(255,255,255,0.5)" : preset.bg }}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full border border-gray-300 shadow-inner"
                            style={{ backgroundColor: preset.fg }}
                          />
                          <span className="text-xs font-medium" style={{ color: preset.fg }}>
                            {preset.name}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block">
                      {codeType === "qr" ? "Dots Color" : "Bars Color"}
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={qrConfig.fgColor}
                        onChange={(e) => setQrConfig(prev => ({ ...prev, fgColor: e.target.value }))}
                        className="w-16 h-16 rounded-2xl cursor-pointer border-2 border-gray-200 shadow-inner"
                      />
                      <div className="flex-1">
                        <input
                          type="text"
                          value={qrConfig.fgColor}
                          onChange={(e) => setQrConfig(prev => ({ ...prev, fgColor: e.target.value }))}
                          className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm font-mono"
                          placeholder="#000000"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block">Background Color</label>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <input
                          type="color"
                          value={qrConfig.bgColor === "transparent" ? "#ffffff" : qrConfig.bgColor}
                          onChange={(e) => setQrConfig(prev => ({ ...prev, bgColor: e.target.value }))}
                          className="w-16 h-16 rounded-2xl cursor-pointer border-2 border-gray-200 shadow-inner"
                        />
                        {qrConfig.bgColor === "transparent" && (
                          <div className="absolute inset-0 bg-checkerboard rounded-2xl border-2 border-gray-300"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={qrConfig.bgColor}
                          onChange={(e) => setQrConfig(prev => ({ ...prev, bgColor: e.target.value }))}
                          className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm font-mono"
                          placeholder="#FFFFFF or transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={invertColors}
                    className="px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl font-medium hover:from-gray-700 hover:to-gray-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <ZapIcon />
                    Invert Colors
                  </button>
                  <button
                    onClick={() => {
                      setQrConfig(prev => ({ ...prev, fgColor: "#000000", bgColor: "#FFFFFF" }));
                    }}
                    className="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    Reset Colors
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Code Preview */}
            <div className="xl:col-span-1">
              <div className="sticky top-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Live Preview</h3>
                  <p className="text-gray-600">See your {codeType === "qr" ? "QR code" : "barcode"} in real-time</p>
                </div>

                {/* Preview Container */}
                <div 
                  ref={codeType === "qr" ? qrRef : barcodeRef}
                  className="p-8 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border-2 border-gray-200 mb-6 transition-all duration-500 hover:shadow-3xl hover:scale-105 flex items-center justify-center min-h-[400px] overflow-hidden"
                  style={qrConfig.bgColor === "transparent" ? { backgroundImage: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px' } : {}}
                >
                  {text ? (
                    <div className="relative flex items-center justify-center w-full max-w-full">
                      {codeType === "qr" ? (
                        <>
                          <QRCodeCanvas {...getQRCodeProps()} />
                          {renderCenterIcon()}
                        </>
                      ) : (
                        <div className="w-full overflow-auto">
                          <Barcode {...getBarcodeProps()} />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-64 flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-4 opacity-30 flex items-center justify-center">
                          {codeType === "qr" ? <QrCodeIcon /> : <BarcodeIcon />}
                        </div>
                        <p className="text-lg font-medium text-gray-500">
                          Enter content to generate {codeType === "qr" ? "QR code" : "barcode"}
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                          Your beautiful {codeType === "qr" ? "QR code" : "barcode"} will appear here
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleDownload}
                    disabled={isGenerating || !text}
                    className={`w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ${
                      isGenerating || !text ? 'opacity-50 cursor-not-allowed' : 'hover:from-blue-700 hover:to-indigo-700'
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <DownloadIcon />
                        Download {codeType === "qr" ? "QR Code" : "Barcode"}
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => setShowPreviewModal(true)}
                    disabled={!text}
                    className={`w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ${
                      !text ? 'opacity-50 cursor-not-allowed' : 'hover:from-purple-700 hover:to-pink-700'
                    }`}
                  >
                    <MaximizeIcon />
                    Preview in Modal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        {showPreviewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-800">
                    {codeType === "qr" ? "QR Code" : "Barcode"} Preview
                  </h3>
                  <button
                    onClick={() => setShowPreviewModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <CloseIcon />
                  </button>
                </div>
              </div>
              
              <div className="p-8">
                <div className="flex items-center justify-center mb-6 overflow-hidden">
                  <div className="relative w-full max-w-full">
                    {codeType === "qr" ? (
                      <>
                        <QRCodeCanvas 
                          value={text}
                          size={getPreviewSize()}
                          fgColor={qrConfig.fgColor}
                          bgColor={qrConfig.bgColor === "transparent" ? undefined : qrConfig.bgColor}
                          level={qrConfig.level}
                          includeMargin={qrConfig.includeMargin}
                          style={{ display: 'block', margin: '0 auto' }}
                        />
                        {renderCenterIcon(getPreviewSize() / qrConfig.size)}
                      </>
                    ) : (
                      <div className="w-full overflow-auto">
                        <Barcode 
                          value={text}
                          format={barcodeConfig.format}
                          width={barcodeConfig.width * 1.5}
                          height={barcodeConfig.height * 1.2}
                          displayValue={barcodeConfig.displayValue}
                          textAlign={barcodeConfig.textAlign}
                          textPosition={barcodeConfig.textPosition}
                          fontSize={barcodeConfig.fontSize * 1.2}
                          lineColor={qrConfig.fgColor}
                          background={qrConfig.bgColor === "transparent" ? undefined : qrConfig.bgColor}
                          margin={15}
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleDownload}
                    disabled={isGenerating}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <DownloadIcon />
                    Download
                  </button>
                  <button
                    onClick={() => setShowPreviewModal(false)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add CSS for checkerboard pattern */}
      <style jsx>{`
        .bg-checkerboard {
          background-image: 
            linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
            linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
            linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}

export default App;


// import React, { useState, useRef } from "react";
// import { QRCodeCanvas } from "qrcode.react";

// function App() {
//   const [text, setText] = useState("");
//   const [showPreviewModal, setShowPreviewModal] = useState(false);
//   const [qrConfig, setQrConfig] = useState({
//     size: 256,
//     fgColor: "#000000",
//     bgColor: "#ffffff",
//     level: "H",
//     includeMargin: true
//   });
  
//   const [shapeConfig, setShapeConfig] = useState({
//     borderStyle: "square",
//     centerStyle: "square"
//   });
  
//   const [logoConfig, setLogoConfig] = useState({
//     enabled: false,
//     file: null,
//     type: "upload",
//     size: 40,
//     removeBg: false
//   });
//   const [isGenerating, setIsGenerating] = useState(false);
//   const qrRef = useRef(null);
//   const fileInputRef = useRef(null);

//   // Fixed download function that properly handles center images
//   const handleDownload = () => {
//     if (!qrRef.current) return;
    
//     setIsGenerating(true);
    
//     setTimeout(() => {
//       const canvas = qrRef.current.querySelector("canvas");
//       if (canvas) {
//         if (logoConfig.enabled && logoConfig.file) {
//           // Create a new canvas to combine QR code + image
//           const finalCanvas = document.createElement('canvas');
//           const ctx = finalCanvas.getContext('2d');
          
//           // Set final canvas size
//           finalCanvas.width = canvas.width;
//           finalCanvas.height = canvas.height;
          
//           // Draw white background
//           ctx.fillStyle = qrConfig.bgColor;
//           ctx.fillRect(0, 0, canvas.width, canvas.height);
          
//           // Draw QR code
//           ctx.drawImage(canvas, 0, 0);
          
//           // Load and draw the center image
//           const img = new Image();
//           img.crossOrigin = "anonymous";
//           img.onload = () => {
//             const centerX = canvas.width / 2;
//             const centerY = canvas.height / 2;
//             const iconSize = logoConfig.size;
            
//             // Draw white background for the icon if needed
//             if (!logoConfig.removeBg) {
//               ctx.fillStyle = 'white';
//               ctx.fillRect(
//                 centerX - iconSize/2 - 4, 
//                 centerY - iconSize/2 - 4, 
//                 iconSize + 8, 
//                 iconSize + 8
//               );
//             }
            
//             // Draw the image
//             ctx.drawImage(
//               img, 
//               centerX - iconSize/2, 
//               centerY - iconSize/2, 
//               iconSize, 
//               iconSize
//             );
            
//             // Download the combined image
//             downloadCanvas(finalCanvas);
//           };
//           img.onerror = () => {
//             console.error("Failed to load image");
//             // Fallback: download just the QR code
//             downloadCanvas(canvas);
//           };
//           img.src = logoConfig.file;
//         } else {
//           // No logo, just download the QR code
//           downloadCanvas(canvas);
//         }
//       } else {
//         setIsGenerating(false);
//       }
//     }, 100);
//   };

//   const downloadCanvas = (canvas) => {
//     const pngUrl = canvas
//       .toDataURL("image/png")
//       .replace("image/png", "image/octet-stream");
    
//     let downloadLink = document.createElement("a");
//     downloadLink.href = pngUrl;
//     downloadLink.download = `qr-code-${Date.now()}.png`;
//     document.body.appendChild(downloadLink);
//     downloadLink.click();
//     document.body.removeChild(downloadLink);
//     setIsGenerating(false);
//   };

//   const presetColors = [
//     { fg: "#000000", bg: "#ffffff", name: "Classic" },
//     { fg: "#3B82F6", bg: "#EFF6FF", name: "Blue" },
//     { fg: "#10B981", bg: "#ECFDF5", name: "Green" },
//     { fg: "#8B5CF6", bg: "#F5F3FF", name: "Purple" },
//     { fg: "#EF4444", bg: "#FEF2F2", name: "Red" },
//     { fg: "#F59E0B", bg: "#FFFBEB", name: "Amber" },
//     { fg: "#06B6D4", bg: "#ECFEFF", name: "Cyan" },
//     { fg: "#EC4899", bg: "#FDF2F8", name: "Pink" }
//   ];

//   const borderStyles = [
//     { id: "square", name: "Square", description: "Default sharp corners" },
//     { id: "rounded", name: "Rounded", description: "Smooth rounded borders" },
//   ];

//   const centerStyles = [
//     { id: "square", name: "Square", description: "Default filled square" },
//     { id: "circle", name: "Circle", description: "Smooth rounded dot" },
//     { id: "star", name: "Star", description: "Star shape center" },
//   ];

//   const applyPreset = (preset) => {
//     setQrConfig(prev => ({
//       ...prev,
//       fgColor: preset.fg,
//       bgColor: preset.bg
//     }));
//   };

//   const handleLogoUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setLogoConfig(prev => ({
//         ...prev,
//         file: URL.createObjectURL(file),
//         enabled: true
//       }));
//     }
//   };

//   const removeLogo = () => {
//     setLogoConfig(prev => ({
//       ...prev,
//       file: null,
//       enabled: false,
//       removeBg: false
//     }));
//   };

//   const invertColors = () => {
//     setQrConfig(prev => ({
//       ...prev,
//       fgColor: prev.bgColor,
//       bgColor: prev.fgColor
//     }));
//   };

//   const getQRCodeProps = () => {
//     return {
//       value: text || " ",
//       size: qrConfig.size,
//       fgColor: qrConfig.fgColor,
//       bgColor: qrConfig.bgColor,
//       level: qrConfig.level,
//       includeMargin: qrConfig.includeMargin,
//       style: { 
//         display: 'block',
//         margin: '0 auto',
//         ...getQRCodeStyle()
//       }
//     };
//   };

//   const getQRCodeStyle = () => {
//     const style = {};
    
//     switch(shapeConfig.borderStyle) {
//       case "rounded":
//         style.borderRadius = "20px";
//         break;
//       default:
//         style.borderRadius = "0px";
//     }
    
//     return style;
//   };

//   const getPreviewSize = () => {
//     return 320;
//   };

//   const renderCenterIcon = (sizeMultiplier = 1) => {
//     if (!logoConfig.enabled || !logoConfig.file) return null;
    
//     const iconSize = logoConfig.size * sizeMultiplier;
//     const iconStyle = {
//       width: iconSize,
//       height: iconSize,
//       backgroundColor: logoConfig.removeBg ? 'transparent' : 'white',
//       border: logoConfig.removeBg ? 'none' : '2px solid #f3f4f6',
//       borderRadius: '8px'
//     };
    
//     return (
//       <div 
//         className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-lg p-1 shadow-lg"
//         style={iconStyle}
//       >
//         <img
//           src={logoConfig.file}
//           alt="Logo"
//           className="object-contain w-full h-full rounded"
//         />
//       </div>
//     );
//   };

//   // Vector SVG Icons
//   const DownloadIcon = () => (
//     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//     </svg>
//   );

//   const QrCodeIcon = () => (
//     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
//     </svg>
//   );

//   const LinkIcon = () => (
//     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
//     </svg>
//   );

//   const PaletteIcon = () => (
//     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
//     </svg>
//   );

//   const ZapIcon = () => (
//     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//     </svg>
//   );

//   const ShapesIcon = () => (
//     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm12 0a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
//     </svg>
//   );

//   const ImageIcon = () => (
//     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//     </svg>
//   );

//   const SettingsIcon = () => (
//     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//     </svg>
//   );

//   const MaximizeIcon = () => (
//     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
//     </svg>
//   );

//   const CloseIcon = () => (
//     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//     </svg>
//   );

//   const CheckIcon = () => (
//     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//     </svg>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <div className="flex items-center justify-center gap-4 mb-4">
//             <div>
//               <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                 QR Designer Pro
//               </h1>
//               <p className="text-lg text-gray-600 mt-2">
//                 Create stunning, professional QR codes with advanced customization
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 mb-8 border border-white/20">
//           <div className="grid xl:grid-cols-3 gap-8">
//             {/* Left Column - Controls */}
//             <div className="xl:col-span-2 space-y-8 max-h-[80vh] overflow-y-auto pr-4">
//               {/* URL Input */}
//               <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-100">
//                 <label className="flex items-center gap-3 text-lg font-semibold text-gray-800 mb-4">
//                   <span className="w-5 h-5 text-blue-600 flex items-center justify-center">
//                     <LinkIcon />
//                   </span>
//                   Enter your content
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="text"
//                     placeholder="https://example.com or any text you want to encode..."
//                     value={text}
//                     onChange={(e) => setText(e.target.value)}
//                     className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
//                   />
//                 </div>
//               </div>

//               {/* Design Sections Grid */}
//               <div className="grid lg:grid-cols-2 gap-8">
//                 {/* Shape Section */}
//                 <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-lg">
//                   <div className="flex items-center gap-3 text-lg font-semibold text-gray-800 mb-4">
//                     <span className="w-5 h-5 text-green-600 flex items-center justify-center">
//                       <ShapesIcon />
//                     </span>
//                     Shape Design
//                   </div>
//                   <div className="space-y-6">
//                     <div>
//                       <label className="text-sm font-medium text-gray-700 mb-3 block">
//                         Border Style
//                       </label>
//                       <div className="grid grid-cols-2 gap-3">
//                         {borderStyles.map((style) => (
//                           <button
//                             key={style.id}
//                             onClick={() => setShapeConfig(prev => ({ ...prev, borderStyle: style.id }))}
//                             className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all duration-200 ${
//                               shapeConfig.borderStyle === style.id
//                                 ? "border-blue-500 bg-blue-50 shadow-md scale-105"
//                                 : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
//                             }`}
//                             title={style.description}
//                           >
//                             <span className="text-lg">{style.id === "square" ? "⬜" : "⭕"}</span>
//                             <span className="text-xs font-medium">{style.name}</span>
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                     {/* <div>
//                       <label className="text-sm font-medium text-gray-700 mb-3 block">
//                         Center Style
//                       </label>
//                       <div className="grid grid-cols-3 gap-3">
//                         {centerStyles.map((style) => (
//                           <button
//                             key={style.id}
//                             onClick={() => setShapeConfig(prev => ({ ...prev, centerStyle: style.id }))}
//                             className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all duration-200 ${
//                               shapeConfig.centerStyle === style.id
//                                 ? "border-green-500 bg-green-50 shadow-md scale-105"
//                                 : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
//                             }`}
//                             title={style.description}
//                           >
//                             <span className="text-lg">
//                               {style.id === "square" ? "⬜" : style.id === "circle" ? "⭕" : "⭐"}
//                             </span>
//                             <span className="text-xs font-medium">{style.name}</span>
//                           </button>
//                         ))}
//                       </div>
//                     </div> */}
//                   </div>
//                 </div>
                
//                 {/* Center Logo Section */}
//                 <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-lg">
//                   <div className="flex items-center gap-3 text-lg font-semibold text-gray-800 mb-4">
//                     <span className="w-5 h-5 text-purple-600 flex items-center justify-center">
//                       <ImageIcon />
//                     </span>
//                     Center Logo
//                   </div>
//                   <div className="space-y-4">
//                     {!logoConfig.enabled && (
//                       <div className="space-y-3">
//                         <input
//                           ref={fileInputRef}
//                           type="file"
//                           accept="image/*"
//                           onChange={handleLogoUpload}
//                           className="hidden"
//                         />
//                         <button
//                           onClick={() => fileInputRef.current?.click()}
//                           className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
//                         >
//                           Upload Center Image
//                         </button>
//                       </div>
//                     )}

//                     {logoConfig.enabled && (
//                       <>
//                         <div className="text-center p-4 border-2 border-green-200 bg-green-50 rounded-xl">
//                           <div className="flex items-center justify-center gap-2 text-green-700 font-medium">
//                             <CheckIcon />
//                             Image uploaded successfully!
//                           </div>
//                           <p className="text-green-600 text-sm mt-1">It will appear in downloaded QR codes</p>
//                         </div>

//                         <div>
//                           <label className="text-sm font-medium text-gray-700 mb-2 block">
//                             Size: {logoConfig.size}px
//                           </label>
//                           <input
//                             type="range"
//                             min="20"
//                             max="80"
//                             value={logoConfig.size}
//                             onChange={(e) => setLogoConfig(prev => ({ ...prev, size: parseInt(e.target.value) }))}
//                             className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
//                           />
//                         </div>

//                         <div className="flex items-center gap-3">
//                           <input
//                             type="checkbox"
//                             id="removeBg"
//                             checked={logoConfig.removeBg}
//                             onChange={(e) => setLogoConfig(prev => ({ ...prev, removeBg: e.target.checked }))}
//                             className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
//                           />
//                           <label htmlFor="removeBg" className="text-sm font-medium text-gray-700">
//                             Remove icon background
//                           </label>
//                         </div>

//                         <button
//                           onClick={removeLogo}
//                           className="w-full px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
//                         >
//                           <CloseIcon />
//                           Remove Center Image
//                         </button>
//                       </>
//                     )}
//                   </div>
//                 </div>

//                 {/* QR Settings */}
//                 <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-lg">
//                   <div className="flex items-center gap-3 text-lg font-semibold text-gray-800 mb-4">
//                     <span className="w-5 h-5 text-orange-600 flex items-center justify-center">
//                       <SettingsIcon />
//                     </span>
//                     QR Settings
//                   </div>
//                   <div className="space-y-4">
//                     <div>
//                       <label className="text-sm font-medium text-gray-700 mb-3 block">Error Correction</label>
//                       <select
//                         value={qrConfig.level}
//                         onChange={(e) => setQrConfig(prev => ({ ...prev, level: e.target.value }))}
//                         className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
//                       >
//                         <option value="L">Low (7%) - Smallest</option>
//                         <option value="M">Medium (15%) - Balanced</option>
//                         <option value="Q">Quartile (25%) - Recommended</option>
//                         <option value="H">High (30%) - Most Robust</option>
//                       </select>
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium text-gray-700 mb-3 block">QR Size</label>
//                       <select
//                         value={qrConfig.size}
//                         onChange={(e) => setQrConfig(prev => ({ ...prev, size: parseInt(e.target.value) }))}
//                         className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
//                       >
//                         <option value={128}>Small (128px)</option>
//                         <option value={256}>Medium (256px)</option>
//                         <option value={384}>Large (384px)</option>
//                         <option value={512}>Extra Large (512px)</option>
//                       </select>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Color Customization */}
//               <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-lg">
//                 <div className="flex items-center gap-3 text-lg font-semibold text-gray-800 mb-6">
//                   <span className="w-5 h-5 text-pink-600 flex items-center justify-center">
//                     <PaletteIcon />
//                   </span>
//                   Color Design
//                 </div>
                
//                 <div className="mb-6">
//                   <label className="text-sm font-medium text-gray-700 mb-4 block">Color Presets</label>
//                   <div className="grid grid-cols-4 gap-3">
//                     {presetColors.map((preset, index) => (
//                       <button
//                         key={index}
//                         onClick={() => applyPreset(preset)}
//                         className="p-3 rounded-xl border-2 border-gray-200 hover:border-blue-500 transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
//                         style={{ backgroundColor: preset.bg }}
//                       >
//                         <div className="flex items-center justify-center gap-2">
//                           <div 
//                             className="w-4 h-4 rounded-full border border-gray-300 shadow-inner"
//                             style={{ backgroundColor: preset.fg }}
//                           />
//                           <span className="text-xs font-medium" style={{ color: preset.fg }}>
//                             {preset.name}
//                           </span>
//                         </div>
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-6 mb-4">
//                   <div>
//                     <label className="text-sm font-medium text-gray-700 mb-3 block">Dots Color</label>
//                     <div className="flex items-center gap-3">
//                       <input
//                         type="color"
//                         value={qrConfig.fgColor}
//                         onChange={(e) => setQrConfig(prev => ({ ...prev, fgColor: e.target.value }))}
//                         className="w-16 h-16 rounded-2xl cursor-pointer border-2 border-gray-200 shadow-inner"
//                       />
//                       <div className="flex-1">
//                         <input
//                           type="text"
//                           value={qrConfig.fgColor}
//                           onChange={(e) => setQrConfig(prev => ({ ...prev, fgColor: e.target.value }))}
//                           className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm font-mono"
//                           placeholder="#000000"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium text-gray-700 mb-3 block">Background Color</label>
//                     <div className="flex items-center gap-3">
//                       <input
//                         type="color"
//                         value={qrConfig.bgColor}
//                         onChange={(e) => setQrConfig(prev => ({ ...prev, bgColor: e.target.value }))}
//                         className="w-16 h-16 rounded-2xl cursor-pointer border-2 border-gray-200 shadow-inner"
//                       />
//                       <div className="flex-1">
//                         <input
//                           type="text"
//                           value={qrConfig.bgColor}
//                           onChange={(e) => setQrConfig(prev => ({ ...prev, bgColor: e.target.value }))}
//                           className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm font-mono"
//                           placeholder="#FFFFFF"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <button
//                     onClick={invertColors}
//                     className="px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl font-medium hover:from-gray-700 hover:to-gray-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
//                   >
//                     <ZapIcon />
//                     Invert Colors
//                   </button>
//                   <button
//                     onClick={() => {
//                       setQrConfig(prev => ({ ...prev, fgColor: "#000000", bgColor: "#FFFFFF" }));
//                     }}
//                     className="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
//                   >
//                     Reset Colors
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Right Column - QR Code Preview */}
//             <div className="xl:col-span-1">
//               <div className="sticky top-8">
//                 <div className="text-center mb-6">
//                   <h3 className="text-2xl font-bold text-gray-800 mb-2">Live Preview</h3>
//                   <p className="text-gray-600">See your QR code in real-time</p>
//                 </div>

//                 {/* Fixed Preview Container */}
//                 <div 
//                   ref={qrRef}
//                   className="p-8 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border-2 border-gray-200 mb-6 transition-all duration-500 hover:shadow-3xl hover:scale-105 flex items-center justify-center min-h-[400px]"
//                 >
//                   {text ? (
//                     <div className="relative flex items-center justify-center">
//                       <QRCodeCanvas {...getQRCodeProps()} />
//                       {renderCenterIcon()}
//                     </div>
//                   ) : (
//                     <div className="w-full h-64 flex items-center justify-center text-gray-400">
//                       <div className="text-center">
//                         <div className="w-20 h-20 mx-auto mb-4 opacity-30 flex items-center justify-center">
//                           <QrCodeIcon />
//                         </div>
//                         <p className="text-lg font-medium text-gray-500">Enter content to generate QR code</p>
//                         <p className="text-sm text-gray-400 mt-2">Your beautiful QR code will appear here</p>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="space-y-3">
//                   <button
//                     onClick={handleDownload}
//                     disabled={isGenerating || !text}
//                     className={`w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ${
//                       isGenerating || !text ? 'opacity-50 cursor-not-allowed' : 'hover:from-blue-700 hover:to-indigo-700'
//                     }`}
//                   >
//                     {isGenerating ? (
//                       <>
//                         <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                         Generating...
//                       </>
//                     ) : (
//                       <>
//                         <DownloadIcon />
//                         Download QR Code
//                       </>
//                     )}
//                   </button>
                  
//                   <button
//                     onClick={() => setShowPreviewModal(true)}
//                     disabled={!text}
//                     className={`w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ${
//                       !text ? 'opacity-50 cursor-not-allowed' : 'hover:from-purple-700 hover:to-pink-700'
//                     }`}
//                   >
//                     <MaximizeIcon />
//                     Preview in Modal
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Preview Modal */}
//         {showPreviewModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//               <div className="p-6 border-b border-gray-200">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-2xl font-bold text-gray-800">QR Code Preview</h3>
//                   <button
//                     onClick={() => setShowPreviewModal(false)}
//                     className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
//                   >
//                     <CloseIcon />
//                   </button>
//                 </div>
//               </div>
              
//               <div className="p-8">
//                 <div className="flex items-center justify-center mb-6">
//                   <div className="relative">
//                     <QRCodeCanvas 
//                       value={text}
//                       size={getPreviewSize()}
//                       fgColor={qrConfig.fgColor}
//                       bgColor={qrConfig.bgColor}
//                       level={qrConfig.level}
//                       includeMargin={qrConfig.includeMargin}
//                       style={{ display: 'block', margin: '0 auto' }}
//                     />
//                     {renderCenterIcon(getPreviewSize() / qrConfig.size)}
//                   </div>
//                 </div>
                
//                 <div className="flex gap-3">
//                   <button
//                     onClick={handleDownload}
//                     disabled={isGenerating}
//                     className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
//                   >
//                     <DownloadIcon />
//                     Download
//                   </button>
//                   <button
//                     onClick={() => setShowPreviewModal(false)}
//                     className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
//                   >
//                     Close
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;
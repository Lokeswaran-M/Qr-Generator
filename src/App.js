import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import QRCodeStyling from "qr-code-styling";
import { 
  Download, 
  QrCode, 
  ChevronDown, 
  Upload, 
  Moon, 
  Sun, 
  Palette,
  Type,
  Grid3X3,
  ScanEye,
  Maximize2,
  Check,
  X,
  Square,
  Circle,
  Disc,
  Droplets,
  Hexagon
} from "lucide-react";

// ==================== Reusable Components ====================

const AccordionSection = ({ title, icon: Icon, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <motion.div 
      className="border border-gray-200 rounded-xl overflow-hidden bg-white"
      initial={false}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5 text-purple-600" />}
          <span className="font-semibold text-gray-800">{title}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 border-t border-gray-100">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const StyleGrid = ({ items, selected, onSelect, label }) => {
  return (
    <div>
      {label && (
        <p className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wider">
          {label}
        </p>
      )}
      <div className="grid grid-cols-3 gap-3">
        {items.map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(item.id)}
            className={`
              relative p-4 rounded-xl border-2 transition-all duration-300
              flex flex-col items-center gap-2
              ${selected === item.id 
                ? "border-purple-500 bg-purple-50 shadow-lg shadow-purple-200/50 ring-2 ring-purple-300 ring-opacity-30" 
                : "border-gray-200 hover:border-purple-300 bg-white hover:shadow-md"
              }
            `}
          >
            {selected === item.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center"
              >
                <Check className="w-3 h-3 text-white" />
              </motion.div>
            )}
            <div className="w-10 h-10 flex items-center justify-center text-gray-700">
              {item.icon}
            </div>
            <span className="text-xs font-medium text-gray-700 text-center leading-tight">
              {item.name}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

const ColorPicker = ({ color, onChange, label }) => {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-2">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <div className="relative group">
          <input
            type="color"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="w-12 h-12 rounded-xl cursor-pointer border-2 border-gray-200 shadow-sm opacity-0 absolute inset-0 z-10"
          />
          <div 
            className="w-12 h-12 rounded-xl border-2 border-gray-200 shadow-sm cursor-pointer overflow-hidden group-hover:scale-105 transition-transform"
            style={{ backgroundColor: color }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
          </div>
        </div>
        <input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
          placeholder="#000000"
        />
      </div>
    </div>
  );
};

const IconButton = ({ icon: Icon, label, onClick, variant = "primary", className = "", disabled = false }) => {
  const variants = {
    primary: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-200 hover:shadow-xl hover:from-purple-700 hover:to-indigo-700",
    secondary: "border-2 border-purple-200 text-purple-600 hover:bg-purple-50",
    ghost: "bg-gray-100 text-gray-600 hover:bg-gray-200"
  };

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${variants[variant]} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {label}
    </motion.button>
  );
};

// ==================== Style Configurations with ALL Available Types ====================

// From docs: type string ('rounded' 'dots' 'classy' 'classy-rounded' 'square' 'extra-rounded')
const MODULE_STYLES = [
  {
    id: "square",
    name: "Square Modules",
    icon: <Square className="w-8 h-8" fill="currentColor" />
  },
  {
    id: "dots",
    name: "Dots Modules",
    icon: <Circle className="w-8 h-8" fill="currentColor" />
  },
  {
    id: "rounded",
    name: "Rounded Modules",
    icon: <Square className="w-8 h-8 rounded-md" fill="currentColor" />
  },
  {
    id: "classy",
    name: "Classy Modules",
    icon: <Disc className="w-8 h-8" fill="currentColor" />
  },
  {
    id: "classy-rounded",
    name: "Classy Rounded",
    icon: <Droplets className="w-8 h-8" fill="currentColor" />
  },
  {
    id: "extra-rounded",
    name: "Extra Rounded",
    icon: <Hexagon className="w-8 h-8" fill="currentColor" />
  }
];

// From docs: type string ('dot' 'square' 'extra-rounded' 'rounded' 'dots' 'classy' 'classy-rounded')
const FINDER_PATTERN_STYLES = [
  {
    id: "square",
    name: "Square Corners",
    icon: <Square className="w-10 h-10" fill="currentColor" />
  },
  {
    id: "dot",
    name: "Dot Corners",
    icon: <Circle className="w-10 h-10" fill="currentColor" />
  },
  {
    id: "rounded",
    name: "Rounded Corners",
    icon: <Square className="w-10 h-10 rounded-lg" fill="currentColor" />
  },
  {
    id: "extra-rounded",
    name: "Extra Round",
    icon: <Square className="w-10 h-10 rounded-2xl" fill="currentColor" />
  },
  {
    id: "dots",
    name: "Dots Corners",
    icon: <div className="w-10 h-10 grid grid-cols-2 gap-1">
      <Circle className="w-full h-full" fill="currentColor" />
      <Circle className="w-full h-full" fill="currentColor" />
      <Circle className="w-full h-full" fill="currentColor" />
      <Circle className="w-full h-full" fill="currentColor" />
    </div>
  },
  {
    id: "classy",
    name: "Classy Corners",
    icon: <Disc className="w-10 h-10" fill="currentColor" />
  },
  {
    id: "classy-rounded",
    name: "Classy Round",
    icon: <Droplets className="w-10 h-10" fill="currentColor" />
  }
];

// From docs: type string ('dot' 'square' 'rounded' 'dots' 'classy' 'classy-rounded' 'extra-rounded')
const CORNER_DOT_STYLES = [
  {
    id: "square",
    name: "Square Dots",
    icon: <Square className="w-6 h-6" fill="currentColor" />
  },
  {
    id: "dot",
    name: "Round Dots",
    icon: <Circle className="w-6 h-6" fill="currentColor" />
  },
  {
    id: "rounded",
    name: "Rounded Dots",
    icon: <Square className="w-6 h-6 rounded-md" fill="currentColor" />
  },
  {
    id: "dots",
    name: "Dot Pattern",
    icon: <div className="w-6 h-6 grid grid-cols-2 gap-0.5">
      {[...Array(4)].map((_, i) => (
        <Circle key={i} className="w-full h-full" fill="currentColor" />
      ))}
    </div>
  },
  {
    id: "classy",
    name: "Classy Dots",
    icon: <Disc className="w-6 h-6" fill="currentColor" />
  },
  {
    id: "classy-rounded",
    name: "Classy Round",
    icon: <Droplets className="w-6 h-6" fill="currentColor" />
  },
  {
    id: "extra-rounded",
    name: "Extra Round",
    icon: <Circle className="w-6 h-6 rounded-2xl" fill="currentColor" />
  }
];

// QR Code Shape options: 'square' or 'circle'
const SHAPE_OPTIONS = [
  {
    id: "square",
    name: "Square Shape",
    icon: <Square className="w-8 h-8" fill="currentColor" />
  },
  {
    id: "circle",
    name: "Circle Shape",
    icon: <Circle className="w-8 h-8" fill="currentColor" />
  }
];

// Output type options: 'canvas' or 'svg'
const OUTPUT_TYPES = [
  {
    id: "svg",
    name: "SVG Vector",
    icon: <Maximize2 className="w-8 h-8" />
  },
  {
    id: "canvas",
    name: "Canvas Bitmap",
    icon: <Grid3X3 className="w-8 h-8" />
  }
];

// ==================== Main App Component ====================

function App() {
  // State Management
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [qrContent, setQrContent] = useState("https://example.com");
  const [selectedModuleStyle, setSelectedModuleStyle] = useState("square");
  const [selectedFinderStyle, setSelectedFinderStyle] = useState("square");
  const [selectedCornerDot, setSelectedCornerDot] = useState("square");
  const [selectedShape, setSelectedShape] = useState("square");
  const [selectedOutputType, setSelectedOutputType] = useState("svg");
  const [foregroundColor, setForegroundColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [logoUrl, setLogoUrl] = useState(null);
  const [qrSize, setQrSize] = useState(300);
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState("H");
  const [margin, setMargin] = useState(0);
  
  // Use ref for QRCode instance to avoid re-creation
  const qrCodeRef = useRef(null);
  const qrContainerRef = useRef(null);
  const fileInputRef = useRef(null);

  // Initialize QR Code Styling instance only once
  useEffect(() => {
    if (!qrCodeRef.current) {
      qrCodeRef.current = new QRCodeStyling({
        width: qrSize,
        height: qrSize,
        type: selectedOutputType,
        data: qrContent || " ",
        image: logoUrl || undefined,
        shape: selectedShape,
        margin: margin,
        dotsOptions: {
          color: foregroundColor,
          type: selectedModuleStyle
        },
        cornersSquareOptions: {
          color: foregroundColor,
          type: selectedFinderStyle
        },
        cornersDotOptions: {
          color: foregroundColor,
          type: selectedCornerDot
        },
        backgroundOptions: {
          color: backgroundColor,
        },
        qrOptions: {
          errorCorrectionLevel: errorCorrectionLevel,
        },
        imageOptions: {
          crossOrigin: "anonymous",
          margin: 5,
          imageSize: 0.4,
          hideBackgroundDots: true
        }
      });
    }
    
    return () => {
      qrCodeRef.current = null;
    };
  }, []);

  // Update QR Code when parameters change
  useEffect(() => {
    const qrCode = qrCodeRef.current;
    if (!qrCode || !qrContainerRef.current) return;

    const options = {
      width: qrSize,
      height: qrSize,
      type: selectedOutputType,
      data: qrContent || " ",
      image: logoUrl || undefined,
      shape: selectedShape,
      margin: margin,
      dotsOptions: {
        color: foregroundColor,
        type: selectedModuleStyle,
      },
      cornersSquareOptions: {
        color: foregroundColor,
        type: selectedFinderStyle
      },
      cornersDotOptions: {
        color: foregroundColor,
        type: selectedCornerDot
      },
      backgroundOptions: {
        color: backgroundColor,
      },
      qrOptions: {
        errorCorrectionLevel: errorCorrectionLevel,
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 5,
        imageSize: 0.4,
        hideBackgroundDots: true
      }
    };

    qrCode.update(options);
    
    // Clear and re-append
    if (qrContainerRef.current) {
      qrContainerRef.current.innerHTML = '';
      qrCode.append(qrContainerRef.current);
    }
  }, [
    qrContent, 
    selectedModuleStyle, 
    selectedFinderStyle, 
    selectedCornerDot,
    selectedShape,
    selectedOutputType,
    foregroundColor, 
    backgroundColor, 
    logoUrl, 
    qrSize,
    errorCorrectionLevel,
    margin
  ]);

  // Handle Logo Upload
  const handleLogoUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setLogoUrl(e.target.result);
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  // Handle PNG Download
  const handleDownloadPNG = useCallback(() => {
    const qrCode = qrCodeRef.current;
    if (qrCode && qrContent) {
      qrCode.download({
        extension: "png",
        name: `qr-code-${Date.now()}`
      });
    }
  }, [qrContent]);

  // Handle SVG Download
  const handleDownloadSVG = useCallback(() => {
    const qrCode = qrCodeRef.current;
    if (qrCode && qrContent) {
      qrCode.download({
        extension: "svg",
        name: `qr-code-${Date.now()}`
      });
    }
  }, [qrContent]);

  // Handle WebP Download
  const handleDownloadWebP = useCallback(() => {
    const qrCode = qrCodeRef.current;
    if (qrCode && qrContent) {
      qrCode.download({
        extension: "webp",
        name: `qr-code-${Date.now()}`
      });
    }
  }, [qrContent]);

  // Handle JPEG Download
  const handleDownloadJPEG = useCallback(() => {
    const qrCode = qrCodeRef.current;
    if (qrCode && qrContent) {
      qrCode.download({
        extension: "jpeg",
        name: `qr-code-${Date.now()}`
      });
    }
  }, [qrContent]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-sm border-b ${isDarkMode ? 'bg-gray-900/90 border-gray-800' : 'bg-white/90 border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  QR Studio Pro
                </h1>
                <p className="text-xs text-gray-500">Professional QR Code Generator</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <IconButton
                icon={isDarkMode ? Sun : Moon}
                onClick={() => setIsDarkMode(!isDarkMode)}
                variant="ghost"
              />
              
              <div className="hidden sm:flex gap-2">
                <IconButton
                  icon={Download}
                  label="PNG"
                  onClick={handleDownloadPNG}
                  variant="primary"
                  disabled={!qrContent}
                />
                <IconButton
                  icon={Download}
                  label="SVG"
                  onClick={handleDownloadSVG}
                  variant="secondary"
                  disabled={!qrContent}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Customization Controls */}
          <div className="space-y-6">
            {/* Content Input */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-2xl shadow-sm ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
            >
              <div className="flex items-center gap-2 mb-4">
                <Type className="w-5 h-5 text-purple-600" />
                <h2 className="font-semibold text-lg">QR Code Content</h2>
              </div>
              <textarea
                value={qrContent}
                onChange={(e) => setQrContent(e.target.value)}
                placeholder="Enter URL, text, or data to encode..."
                rows={3}
                className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all resize-none ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-200 placeholder-gray-400'
                }`}
              />
              <p className="mt-2 text-xs text-gray-500">
                Your data will be encoded with {errorCorrectionLevel === "H" ? "High (30%)" : 
                  errorCorrectionLevel === "Q" ? "Quartile (25%)" : 
                  errorCorrectionLevel === "M" ? "Medium (15%)" : "Low (7%)"} 
                {' '}error correction
              </p>
            </motion.div>

            {/* Customization Panel */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`p-6 rounded-2xl shadow-sm ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
            >
              <div className="flex items-center gap-2 mb-6">
                <Palette className="w-5 h-5 text-purple-600" />
                <h2 className="font-semibold text-lg">Customise How It Looks</h2>
              </div>

              <div className="space-y-4">
                {/* QR Shape Selection */}
                <AccordionSection 
                  title="QR Code Shape" 
                  icon={Maximize2}
                  defaultOpen={true}
                >
                  <p className="text-xs text-gray-500 mb-3">
                    Choose the overall shape of your QR code (circle adds random extra dots)
                  </p>
                  <StyleGrid
                    items={SHAPE_OPTIONS}
                    selected={selectedShape}
                    onSelect={setSelectedShape}
                  />
                </AccordionSection>

                {/* Output Type Selection */}
                <AccordionSection 
                  title="Output Type" 
                  icon={ScanEye}
                  defaultOpen={true}
                >
                  <p className="text-xs text-gray-500 mb-3">
                    SVG is vector (scalable), Canvas is bitmap (pixel-based)
                  </p>
                  <StyleGrid
                    items={OUTPUT_TYPES}
                    selected={selectedOutputType}
                    onSelect={setSelectedOutputType}
                  />
                </AccordionSection>

                {/* Module Styles */}
                <AccordionSection 
                  title="Data Module Styles" 
                  icon={Grid3X3}
                  defaultOpen={true}
                >
                  <p className="text-xs text-gray-500 mb-3">
                    Choose the shape of individual data modules (dots, rounded, square, classy, extra-rounded)
                  </p>
                  <StyleGrid
                    items={MODULE_STYLES}
                    selected={selectedModuleStyle}
                    onSelect={setSelectedModuleStyle}
                  />
                </AccordionSection>

                {/* Finder Pattern Styles */}
                <AccordionSection 
                  title="Finder Pattern Styles" 
                  icon={ScanEye}
                  defaultOpen={true}
                >
                  <p className="text-xs text-gray-500 mb-3">
                    Customize position detection patterns (dot, square, extra-rounded, rounded, dots, classy, classy-rounded)
                  </p>
                  <StyleGrid
                    items={FINDER_PATTERN_STYLES}
                    selected={selectedFinderStyle}
                    onSelect={setSelectedFinderStyle}
                  />
                </AccordionSection>

                {/* Corner Dot Styles */}
                <AccordionSection 
                  title="Corner Dot Styles" 
                  icon={Maximize2}
                  defaultOpen={false}
                >
                  <p className="text-xs text-gray-500 mb-3">
                    All available styles: dot, square, rounded, dots, classy, classy-rounded, extra-rounded
                  </p>
                  <StyleGrid
                    items={CORNER_DOT_STYLES}
                    selected={selectedCornerDot}
                    onSelect={setSelectedCornerDot}
                  />
                </AccordionSection>

                {/* Colors */}
                <AccordionSection 
                  title="Colors" 
                  icon={Palette}
                  defaultOpen={true}
                >
                  <div className="space-y-4">
                    <ColorPicker
                      color={foregroundColor}
                      onChange={setForegroundColor}
                      label="Module Foreground Color"
                    />
                    <ColorPicker
                      color={backgroundColor}
                      onChange={setBackgroundColor}
                      label="Background Color"
                    />
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        onClick={() => setBackgroundColor("transparent")}
                        className="text-xs px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-50"
                      >
                        Make Transparent
                      </button>
                    </div>
                  </div>
                </AccordionSection>

                {/* Advanced Settings */}
                <AccordionSection 
                  title="Advanced Settings" 
                  icon={Maximize2}
                  defaultOpen={false}
                >
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">
                        Error Correction Level
                      </label>
                      <select
                        value={errorCorrectionLevel}
                        onChange={(e) => setErrorCorrectionLevel(e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                          isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'
                        }`}
                      >
                        <option value="L">Low (7%) - Maximum data</option>
                        <option value="M">Medium (15%) - Balanced</option>
                        <option value="Q">Quartile (25%) - Recommended</option>
                        <option value="H">High (30%) - Best for logos</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">
                        QR Size: {qrSize}px
                      </label>
                      <input
                        type="range"
                        min="200"
                        max="500"
                        step="20"
                        value={qrSize}
                        onChange={(e) => setQrSize(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>200px</span>
                        <span>500px</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">
                        Margin: {margin}px
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        step="5"
                        value={margin}
                        onChange={(e) => setMargin(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>0px</span>
                        <span>50px</span>
                      </div>
                    </div>
                  </div>
                </AccordionSection>

                {/* Logo Upload */}
                <AccordionSection 
                  title="Center Logo" 
                  icon={Upload}
                  defaultOpen={false}
                >
                  <div className="space-y-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-colors"
                    >
                      <Upload className="w-5 h-5 text-gray-500" />
                      <span className="text-sm font-medium">
                        {logoUrl ? "Change Logo" : "Upload Logo Image"}
                      </span>
                    </motion.button>
                    {logoUrl && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          onClick={() => setLogoUrl(null)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors"
                        >
                          <X className="w-4 h-4" />
                          Remove Logo
                        </motion.button>
                      </motion.div>
                    )}
                    <p className="text-xs text-gray-400">
                      Logo will be placed in center • Max recommended size: 40% of QR
                    </p>
                  </div>
                </AccordionSection>
              </div>
            </motion.div>
          </div>

          {/* Right Panel - Live Preview */}
          <div className="lg:sticky lg:top-24 h-fit">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`p-8 rounded-2xl shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
            >
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold">Live QR Preview</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedShape === "circle" ? "🟢 Circle" : "🟦 Square"} • {' '}
                  {MODULE_STYLES.find(m => m.id === selectedModuleStyle)?.name} • {' '}
                  {selectedOutputType.toUpperCase()}
                </p>
              </div>
              
              {/* QR Code Preview Container */}
              <div className="flex items-center justify-center">
                <motion.div 
                  key={`${selectedModuleStyle}-${selectedShape}-${foregroundColor}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl p-4 shadow-inner"
                >
                  <div 
                    ref={qrContainerRef}
                    className="flex items-center justify-center"
                    style={{ minHeight: `${qrSize}px`, minWidth: `${qrSize}px` }}
                  />
                </motion.div>
              </div>
              
              {/* Preview Information */}
              <div className="mt-6 space-y-3">
                <div className={`rounded-xl p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-xs text-gray-500">Module Style</span>
                      <p className="font-medium">
                        {MODULE_STYLES.find(m => m.id === selectedModuleStyle)?.name}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Finder Pattern</span>
                      <p className="font-medium">
                        {FINDER_PATTERN_STYLES.find(f => f.id === selectedFinderStyle)?.name}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Error Correction</span>
                      <p className="font-medium">
                        {errorCorrectionLevel === "H" ? "High (30%)" : 
                         errorCorrectionLevel === "Q" ? "Quartile (25%)" : 
                         errorCorrectionLevel === "M" ? "Medium (15%)" : "Low (7%)"}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Size & Shape</span>
                      <p className="font-medium">{qrSize}px • {selectedShape}</p>
                    </div>
                  </div>
                </div>
                
                <p className="text-xs text-gray-400 text-center">
                  {qrContent ? "✅ Ready to scan • Real-time preview" : "⚠️ Enter content to generate QR"}
                </p>
              </div>
              
              {/* Download Buttons */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <IconButton
                  icon={Download}
                  label="PNG"
                  onClick={handleDownloadPNG}
                  variant="primary"
                  disabled={!qrContent}
                />
                <IconButton
                  icon={Download}
                  label="SVG"
                  onClick={handleDownloadSVG}
                  variant="secondary"
                  disabled={!qrContent}
                />
                <IconButton
                  icon={Download}
                  label="WebP"
                  onClick={handleDownloadWebP}
                  variant="secondary"
                  disabled={!qrContent}
                />
                <IconButton
                  icon={Download}
                  label="JPEG"
                  onClick={handleDownloadJPEG}
                  variant="secondary"
                  disabled={!qrContent}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`text-center py-6 text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        <p>QR Studio Pro • Built with qr-code-styling v1.9.2</p>
        <p className="text-xs mt-1">All qr-code-styling types supported • Square/Circle shapes • SVG/Canvas output</p>
      </footer>
    </div>
  );
}

export default App;





// import React, { useState, useRef, useCallback, useEffect } from "react";
// import { QRCodeCanvas } from "qrcode.react";
// import Barcode from "react-barcode";
// import { toPng, toSvg, toJpeg } from "html-to-image";
// import { saveAs } from "file-saver";
// import JSZip from "jszip";
// import { debounce } from "lodash";

// function App() {
//   const [text, setText] = useState("");
//   const [showPreviewModal, setShowPreviewModal] = useState(false);
//   const [codeType, setCodeType] = useState("qr");
//   const [history, setHistory] = useState([]);
//   const [historyIndex, setHistoryIndex] = useState(-1);
//   const [theme, setTheme] = useState("light");
//   const [exportFormat, setExportFormat] = useState("png");
  
//   const [qrConfig, setQrConfig] = useState({
//     size: 256,
//     fgColor: "#000000",
//     bgColor: "#ffffff",
//     level: "H",
//     includeMargin: true,
//     marginSize: 4,
//     dotsStyle: "square",
//     markerStyle: "default",
//     markerColor: "auto",
//     innerMarkerStyle: "default",
//     gradient: null
//   });
  
//   const [barcodeConfig, setBarcodeConfig] = useState({
//     format: "CODE128",
//     width: 2,
//     height: 100,
//     displayValue: true,
//     textAlign: "center",
//     textPosition: "bottom",
//     fontSize: 16,
//     fontFamily: "monospace",
//     fontWeight: "bold",
//     textColor: "#000000",
//     checkDigit: true,
//     rotation: 0
//   });
  
//   const [shapeConfig, setShapeConfig] = useState({
//     borderStyle: "square",
//     centerStyle: "square",
//     patternStyle: "default",
//     cornerRadius: 0
//   });
  
//   const [logoConfig, setLogoConfig] = useState({
//     enabled: false,
//     file: null,
//     type: "upload",
//     size: 40,
//     removeBg: false,
//     bgRemovalThreshold: 200,
//     opacity: 1,
//     borderWidth: 2,
//     borderColor: "#ffffff",
//     shadow: false
//   });
  
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [isRemovingBg, setIsRemovingBg] = useState(false);
//   const [error, setError] = useState(null);
//   const [batchMode, setBatchMode] = useState(false);
//   const [batchTexts, setBatchTexts] = useState([]);
//   const [dragActive, setDragActive] = useState(false);
//   const [showSettings, setShowSettings] = useState(false);
  
//   const qrRef = useRef(null);
//   const barcodeRef = useRef(null);
//   const fileInputRef = useRef(null);
//   const previewRef = useRef(null);

//   // Advanced barcode formats with descriptions
//   const barcodeFormats = [
//     { value: "CODE128", label: "CODE128", description: "Auto-selects Code 128A/B/C", category: "Linear" },
//     { value: "CODE128A", label: "CODE128A", description: "ASCII 00-95", category: "Linear" },
//     { value: "CODE128B", label: "CODE128B", description: "ASCII 32-127", category: "Linear" },
//     { value: "CODE128C", label: "CODE128C", description: "Numeric only", category: "Linear" },
//     { value: "EAN13", label: "EAN13", description: "Product codes (12+1)", category: "Linear" },
//     { value: "EAN8", label: "EAN8", description: "Small product codes (7+1)", category: "Linear" },
//     { value: "UPC", label: "UPC", description: "US products", category: "Linear" },
//     { value: "CODE39", label: "CODE39", description: "Alphanumeric, LOGISTICS", category: "Linear" },
//     { value: "ITF14", label: "ITF14", description: "Shipping containers", category: "Linear" },
//     { value: "ITF", label: "ITF", description: "Interleaved 2 of 5", category: "Linear" },
//     { value: "MSI", label: "MSI", description: "Inventory management", category: "Linear" },
//     { value: "MSI10", label: "MSI10", description: "Inventory (mod 10)", category: "Linear" },
//     { value: "MSI11", label: "MSI11", description: "Inventory (mod 11)", category: "Linear" },
//     { value: "MSI1010", label: "MSI1010", description: "Inventory (mod 10/10)", category: "Linear" },
//     { value: "pharmacode", label: "Pharmacode", description: "Pharmaceutical", category: "Linear" },
//     { value: "codabar", label: "Codabar", description: "Blood banks", category: "Linear" }
//   ];

//   // QR Code dot styles
//   const dotStyles = [
//     { id: "square", name: "Square", preview: "◼" },
//     { id: "rounded", name: "Rounded", preview: "●" },
//     { id: "dots", name: "Dots", preview: "⊙" },
//     { id: "classy", name: "Classy", preview: "◆" },
//     { id: "classy-rounded", name: "Classy Rounded", preview: "⬟" }
//   ];

//   // QR Code marker styles
//   const markerStyles = [
//     { id: "default", name: "Default", preview: "⊞" },
//     { id: "rounded", name: "Rounded", preview: "◉" },
//     { id: "dots", name: "Dots", preview: "◎" },
//     { id: "diamond", name: "Diamond", preview: "◇" },
//     { id: "star", name: "Star", preview: "☆" }
//   ];

//   // Color palettes
//   const colorPalettes = [
//     { name: "Classic", fg: "#000000", bg: "#ffffff" },
//     { name: "Night Mode", fg: "#ffffff", bg: "#000000" },
//     { name: "Ocean", fg: "#006994", bg: "#e0f7fa" },
//     { name: "Forest", fg: "#2d5016", bg: "#f1f8e9" },
//     { name: "Sunset", fg: "#d84315", bg: "#fff3e0" },
//     { name: "Berry", fg: "#880e4f", bg: "#fce4ec" },
//     { name: "Tech", fg: "#1a237e", bg: "#e8eaf6" },
//     { name: "Mint", fg: "#004d40", bg: "#e0f2f1" },
//     { name: "Gold", fg: "#b8860b", bg: "#fff8e1" },
//     { name: "Steel", fg: "#37474f", bg: "#eceff1" }
//   ];

//   // Gradient definitions
//   const gradientPresets = [
//     { name: "Sunrise", from: "#ff6b6b", to: "#4ecdc4" },
//     { name: "Purple Haze", from: "#a8e063", to: "#56ab2f" },
//     { name: "Ocean Blue", from: "#2193b0", to: "#6dd5fa" },
//     { name: "Fire", from: "#f12711", to: "#f5af19" },
//     { name: "Deep Space", from: "#000000", to: "#434343" }
//   ];

//   // Advanced background removal with AI-like edge detection
//   const removeBackground = useCallback(async (imageUrl, threshold = 200, edgeSmoothing = 2) => {
//     return new Promise((resolve, reject) => {
//       const img = new Image();
//       img.crossOrigin = "anonymous";
//       img.onload = () => {
//         const canvas = document.createElement('canvas');
//         const ctx = canvas.getContext('2d');
        
//         canvas.width = img.width;
//         canvas.height = img.height;
//         ctx.drawImage(img, 0, 0);
        
//         const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//         const data = imageData.data;
//         const processedData = new Uint8ClampedArray(data);
        
//         // Edge detection kernel (simple Sobel operator)
//         for (let y = 1; y < canvas.height - 1; y++) {
//           for (let x = 1; x < canvas.width - 1; x++) {
//             const idx = (y * canvas.width + x) * 4;
//             const topIdx = ((y - 1) * canvas.width + x) * 4;
//             const bottomIdx = ((y + 1) * canvas.width + x) * 4;
//             const leftIdx = (y * canvas.width + (x - 1)) * 4;
//             const rightIdx = (y * canvas.width + (x + 1)) * 4;
            
//             const brightness = (
//               data[idx] + data[idx + 1] + data[idx + 2]
//             ) / 3;
            
//             // Check if it's a background pixel
//             if (brightness > threshold) {
//               // Check surroundings for edges
//               const surroundingBrightness = [
//                 (data[topIdx] + data[topIdx + 1] + data[topIdx + 2]) / 3,
//                 (data[bottomIdx] + data[bottomIdx + 1] + data[bottomIdx + 2]) / 3,
//                 (data[leftIdx] + data[leftIdx + 1] + data[leftIdx + 2]) / 3,
//                 (data[rightIdx] + data[rightIdx + 1] + data[rightIdx + 2]) / 3
//               ];
              
//               const isEdge = surroundingBrightness.some(b => b < threshold);
              
//               if (isEdge) {
//                 // Smooth transition for edges
//                 processedData[idx + 3] = 128; // Semi-transparent
//               } else {
//                 processedData[idx + 3] = 0; // Fully transparent
//               }
//             }
//           }
//         }
        
//         ctx.putImageData(new ImageData(processedData, canvas.width, canvas.height), 0, 0);
//         resolve(canvas.toDataURL("image/png"));
//       };
//       img.onerror = reject;
//       img.src = imageUrl;
//     });
//   }, []);

//   // Handle drag and drop for logo uploads
//   const handleDrag = useCallback((e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === "dragenter" || e.type === "dragover") {
//       setDragActive(true);
//     } else if (e.type === "dragleave") {
//       setDragActive(false);
//     }
//   }, []);

//   const handleDrop = useCallback((e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);
    
//     const file = e.dataTransfer.files[0];
//     if (file && file.type.startsWith("image/")) {
//       handleLogoFile(file);
//     }
//   }, [logoConfig]);

//   const handleLogoFile = async (file) => {
//     const originalUrl = URL.createObjectURL(file);
    
//     if (logoConfig.removeBg) {
//       setIsRemovingBg(true);
//       try {
//         const processedUrl = await removeBackground(originalUrl, logoConfig.bgRemovalThreshold);
//         setLogoConfig(prev => ({
//           ...prev,
//           file: processedUrl,
//           enabled: true
//         }));
//       } catch (error) {
//         console.error("Background removal failed:", error);
//         setLogoConfig(prev => ({
//           ...prev,
//           file: originalUrl,
//           enabled: true
//         }));
//       }
//       setIsRemovingBg(false);
//     } else {
//       setLogoConfig(prev => ({
//         ...prev,
//         file: originalUrl,
//         enabled: true
//       }));
//     }
//   };

//   const handleLogoUpload = async (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       await handleLogoFile(file);
//     }
//   };

//   // Batch generation
//   const addBatchText = () => {
//     setBatchTexts([...batchTexts, ""]);
//   };

//   const updateBatchText = (index, value) => {
//     const updated = [...batchTexts];
//     updated[index] = value;
//     setBatchTexts(updated);
//   };

//   const removeBatchText = (index) => {
//     setBatchTexts(batchTexts.filter((_, i) => i !== index));
//   };

//   const generateBatchCodes = async () => {
//     setIsGenerating(true);
//     const zip = new JSZip();
    
//     for (let i = 0; i < batchTexts.length; i++) {
//       const text = batchTexts[i];
//       if (!text) continue;
      
//       const canvas = document.createElement('canvas');
//       canvas.width = qrConfig.size;
//       canvas.height = qrConfig.size;
      
//       // Create temporary QR code
//       const tempDiv = document.createElement('div');
//       const pngUrl = await toPng(tempDiv);
      
//       zip.file(`${codeType}_${i + 1}.png`, pngUrl.split('base64,')[1], { base64: true });
//     }
    
//     const content = await zip.generateAsync({ type: "blob" });
//     saveAs(content, "batch_codes.zip");
//     setIsGenerating(false);
//   };

//   // Export in multiple formats
//   const handleExport = async (format) => {
//     if (!previewRef.current) return;
    
//     setIsGenerating(true);
//     try {
//       let dataUrl;
//       switch (format) {
//         case "png":
//           dataUrl = await toPng(previewRef.current, { quality: 1.0 });
//           break;
//         case "jpeg":
//           dataUrl = await toJpeg(previewRef.current, { quality: 0.95 });
//           break;
//         case "svg":
//           dataUrl = await toSvg(previewRef.current);
//           break;
//         default:
//           dataUrl = await toPng(previewRef.current);
//       }
      
//       const link = document.createElement("a");
//       link.download = `${codeType}_${Date.now()}.${format}`;
//       link.href = dataUrl;
//       link.click();
//     } catch (error) {
//       setError("Export failed. Please try again.");
//       setTimeout(() => setError(null), 3000);
//     }
//     setIsGenerating(false);
//   };

//   // Download function with advanced features
//   const handleDownload = async () => {
//     setIsGenerating(true);
    
//     setTimeout(async () => {
//       if (codeType === "qr") {
//         await downloadQRCode();
//       } else {
//         await downloadBarcode();
//       }
//       setIsGenerating(false);
//     }, 100);
//   };

//   const downloadQRCode = async () => {
//     if (!qrRef.current) return;
    
//     const canvas = qrRef.current.querySelector("canvas");
//     if (!canvas) return;
    
//     const finalCanvas = document.createElement('canvas');
//     const ctx = finalCanvas.getContext('2d');
    
//     finalCanvas.width = canvas.width;
//     finalCanvas.height = canvas.height;
    
//     // Handle transparent background
//     if (qrConfig.bgColor === "transparent") {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//     } else {
//       // Apply gradient if configured
//       if (qrConfig.gradient) {
//         const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
//         gradient.addColorStop(0, qrConfig.gradient.from);
//         gradient.addColorStop(1, qrConfig.gradient.to);
//         ctx.fillStyle = gradient;
//         ctx.fillRect(0, 0, canvas.width, canvas.height);
//       } else {
//         ctx.fillStyle = qrConfig.bgColor;
//         ctx.fillRect(0, 0, canvas.width, canvas.height);
//       }
//     }
    
//     ctx.drawImage(canvas, 0, 0);
    
//     if (logoConfig.enabled && logoConfig.file) {
//       const img = new Image();
//       img.crossOrigin = "anonymous";
      
//       await new Promise((resolve) => {
//         img.onload = () => {
//           const centerX = canvas.width / 2;
//           const centerY = canvas.height / 2;
//           const iconSize = logoConfig.size;
          
//           // Add shadow if enabled
//           if (logoConfig.shadow) {
//             ctx.shadowColor = 'rgba(0,0,0,0.3)';
//             ctx.shadowBlur = 10;
//             ctx.shadowOffsetX = 2;
//             ctx.shadowOffsetY = 2;
//           }
          
//           // Add border if configured
//           if (logoConfig.borderWidth > 0 && !logoConfig.removeBg) {
//             ctx.fillStyle = logoConfig.borderColor;
//             ctx.beginPath();
//             ctx.arc(centerX, centerY, iconSize/2 + logoConfig.borderWidth, 0, Math.PI * 2);
//             ctx.fill();
            
//             ctx.fillStyle = 'white';
//             ctx.beginPath();
//             ctx.arc(centerX, centerY, iconSize/2, 0, Math.PI * 2);
//             ctx.fill();
//           }
          
//           ctx.globalAlpha = logoConfig.opacity;
//           ctx.drawImage(
//             img, 
//             centerX - iconSize/2, 
//             centerY - iconSize/2, 
//             iconSize, 
//             iconSize
//           );
//           ctx.globalAlpha = 1;
          
//           resolve();
//         };
//         img.src = logoConfig.file;
//       });
//     }
    
//     downloadCanvas(finalCanvas);
//   };

//   const downloadBarcode = async () => {
//     const svg = barcodeRef.current?.querySelector("svg");
//     if (!svg) return;
    
//     const canvas = document.createElement("canvas");
//     const ctx = canvas.getContext("2d");
    
//     const bbox = svg.getBBox();
//     canvas.width = bbox.width + 40;
//     canvas.height = bbox.height + 40;
    
//     // Apply background
//     if (qrConfig.bgColor === "transparent") {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//     } else {
//       ctx.fillStyle = qrConfig.bgColor;
//       ctx.fillRect(0, 0, canvas.width, canvas.height);
//     }
    
//     const svgData = new XMLSerializer().serializeToString(svg);
//     const img = new Image();
//     img.src = "data:image/svg+xml;base64," + btoa(svgData);
    
//     await new Promise((resolve) => {
//       img.onload = () => {
//         // Apply rotation if configured
//         if (barcodeConfig.rotation !== 0) {
//           ctx.translate(canvas.width/2, canvas.height/2);
//           ctx.rotate(barcodeConfig.rotation * Math.PI / 180);
//           ctx.drawImage(img, -img.width/2, -img.height/2);
//           ctx.setTransform(1, 0, 0, 1, 0, 0);
//         } else {
//           ctx.drawImage(img, 20, 20);
//         }
//         resolve();
//       };
//     });
    
//     downloadCanvas(canvas);
//   };

//   const downloadCanvas = (canvas) => {
//     const pngUrl = canvas.toDataURL("image/png");
//     const link = document.createElement("a");
//     link.download = `${codeType}_${Date.now()}.png`;
//     link.href = pngUrl;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // History management
//   const saveToHistory = useCallback((newState) => {
//     const newHistory = history.slice(0, historyIndex + 1);
//     newHistory.push(newState);
//     setHistory(newHistory);
//     setHistoryIndex(newHistory.length - 1);
//   }, [history, historyIndex]);

//   const undo = () => {
//     if (historyIndex > 0) {
//       const newIndex = historyIndex - 1;
//       setHistoryIndex(newIndex);
//       // Restore state from history
//     }
//   };

//   const redo = () => {
//     if (historyIndex < history.length - 1) {
//       const newIndex = historyIndex + 1;
//       setHistoryIndex(newIndex);
//       // Restore state from history
//     }
//   };

//   // Debounced state updates
//   const debouncedSetQrConfig = useCallback(
//     debounce((newConfig) => setQrConfig(newConfig), 300),
//     []
//   );

//   const debouncedSetBarcodeConfig = useCallback(
//     debounce((newConfig) => setBarcodeConfig(newConfig), 300),
//     []
//   );

//   // Get QR code styling
//   const getQRCodeStyle = () => {
//     const style = {
//       borderRadius: shapeConfig.cornerRadius || "0px"
//     };
    
//     if (qrConfig.gradient) {
//       style.background = `linear-gradient(135deg, ${qrConfig.gradient.from}, ${qrConfig.gradient.to})`;
//     }
    
//     return style;
//   };

//   // Renders
//   const renderCenterIcon = (sizeMultiplier = 1) => {
//     if (!logoConfig.enabled || !logoConfig.file || codeType !== "qr") return null;
    
//     const iconSize = logoConfig.size * sizeMultiplier;
//     const iconStyle = {
//       width: iconSize,
//       height: iconSize,
//       backgroundColor: logoConfig.removeBg ? 'transparent' : 'white',
//       borderRadius: logoConfig.borderWidth > 0 ? '50%' : '8px',
//       border: logoConfig.borderWidth > 0 ? `${logoConfig.borderWidth}px solid ${logoConfig.borderColor}` : 'none',
//       opacity: logoConfig.opacity,
//       boxShadow: logoConfig.shadow ? '0 4px 12px rgba(0,0,0,0.3)' : 'none'
//     };
    
//     return (
//       <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center" style={iconStyle}>
//         <img
//           src={logoConfig.file}
//           alt="Logo"
//           className="object-contain w-full h-full"
//           style={{ borderRadius: logoConfig.borderWidth > 0 ? '50%' : '4px' }}
//         />
//       </div>
//     );
//   };

//   // Toast notifications
//   const [toast, setToast] = useState(null);

//   const showToast = (message, type = "success") => {
//     setToast({ message, type });
//     setTimeout(() => setToast(null), 3000);
//   };

//   // Keyboard shortcuts
//   useEffect(() => {
//     const handleKeyboard = (e) => {
//       if (e.ctrlKey || e.metaKey) {
//         switch(e.key) {
//           case 'z':
//             e.preventDefault();
//             undo();
//             break;
//           case 'y':
//             e.preventDefault();
//             redo();
//             break;
//           case 's':
//             e.preventDefault();
//             handleDownload();
//             break;
//           case 'p':
//             e.preventDefault();
//             setShowPreviewModal(true);
//             break;
//         }
//       }
//     };

//     window.addEventListener('keydown', handleKeyboard);
//     return () => window.removeEventListener('keydown', handleKeyboard);
//   }, []);

//   return (
//     <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 transition-colors duration-300`}>
//       {/* Toast Notification */}
//       {toast && (
//         <div className="fixed top-4 right-4 z-50">
//           <div className={`px-6 py-3 rounded-lg shadow-lg ${
//             toast.type === "success" ? "bg-green-500" : "bg-red-500"
//           } text-white font-medium animate-fade-in-down`}>
//             {toast.message}
//           </div>
//         </div>
//       )}

//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <header className="text-center mb-12">
//           <div className="flex items-center justify-center gap-4 mb-6">
//             <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
//               QR & Barcode Studio Pro
//             </h1>
//           </div>
//           <p className="text-xl text-gray-600 dark:text-gray-400">
//             Professional QR Codes & Barcodes • Advanced Customization • Batch Export
//           </p>
          
//           {/* Keyboard shortcuts hint */}
//           <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
//             <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded mr-2">Ctrl+Z</span> Undo
//             <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded mx-2">Ctrl+Y</span> Redo
//             <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded mx-2">Ctrl+S</span> Download
//             <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded ml-2">Ctrl+P</span> Preview
//           </div>
//         </header>

//         {/* Error display */}
//         {error && (
//           <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl animate-shake">
//             {error}
//             <button onClick={() => setError(null)} className="float-right font-bold">×</button>
//           </div>
//         )}

//         {/* Main Content */}
//         <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 border border-white/20 dark:border-gray-700/20">
//           <div className="grid xl:grid-cols-3 gap-8">
//             {/* Left Column - Controls */}
//             <div className="xl:col-span-2 space-y-8 max-h-[80vh] overflow-y-auto pr-4">
//               {/* Code Type Selection */}
//               <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/50 dark:to-purple-900/50 p-6 rounded-2xl border border-blue-100 dark:border-blue-700">
//                 <label className="flex items-center gap-3 text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
//                   <span className="text-blue-600">🔗</span>
//                   Code Generation
//                 </label>
                
//                 <div className="flex gap-4 mb-4">
//                   <button
//                     onClick={() => setCodeType("qr")}
//                     className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-medium transition-all ${
//                       codeType === "qr" 
//                         ? "border-blue-500 bg-blue-500 text-white shadow-lg scale-105" 
//                         : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-300"
//                     }`}
//                   >
//                     QR Code
//                   </button>
//                   <button
//                     onClick={() => setCodeType("barcode")}
//                     className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-medium transition-all ${
//                       codeType === "barcode" 
//                         ? "border-green-500 bg-green-500 text-white shadow-lg scale-105" 
//                         : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-green-300"
//                     }`}
//                   >
//                     Barcode
//                   </button>
//                 </div>

//                 {/* Batch Mode Toggle */}
//                 <div className="flex items-center gap-3 mb-4">
//                   <input
//                     type="checkbox"
//                     id="batchMode"
//                     checked={batchMode}
//                     onChange={(e) => setBatchMode(e.target.checked)}
//                     className="w-4 h-4"
//                   />
//                   <label htmlFor="batchMode" className="text-sm font-medium dark:text-gray-300">
//                     Batch Mode (Multiple {codeType === "qr" ? "QR Codes" : "Barcodes"})
//                   </label>
//                 </div>

//                 {!batchMode ? (
//                   <div className="relative">
//                     <textarea
//                       placeholder={
//                         codeType === "qr" 
//                           ? "Enter text or URL for QR code generation..."
//                           : "Enter numbers or text for barcode..."
//                       }
//                       value={text}
//                       onChange={(e) => setText(e.target.value)}
//                       rows={3}
//                       className="w-full px-6 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800 focus:border-blue-500 transition-all duration-300 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm dark:text-gray-200"
//                     />
//                     {text && (
//                       <div className="absolute bottom-3 right-3 text-xs text-gray-500 dark:text-gray-400">
//                         {text.length} characters
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   <div className="space-y-3">
//                     {batchTexts.map((batchText, index) => (
//                       <div key={index} className="flex gap-2">
//                         <input
//                           type="text"
//                           value={batchText}
//                           onChange={(e) => updateBatchText(index, e.target.value)}
//                           className="flex-1 px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-gray-200"
//                           placeholder={`${codeType === "qr" ? "QR" : "Barcode"} #${index + 1}`}
//                         />
//                         <button
//                           onClick={() => removeBatchText(index)}
//                           className="px-3 py-2 bg-red-500 text-white rounded-xl"
//                         >
//                           ×
//                         </button>
//                       </div>
//                     ))}
//                     <button
//                       onClick={addBatchText}
//                       className="w-full px-4 py-2 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
//                     >
//                       + Add Another
//                     </button>
//                   </div>
//                 )}
//               </div>

//               {/* Design Grid */}
//               <div className="grid lg:grid-cols-2 gap-8">
//                 {/* QR Code Specific Settings */}
//                 {codeType === "qr" && (
//                   <>
//                     {/* Marker & Pattern Styles */}
//                     <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border-2 border-gray-100 dark:border-gray-700 shadow-lg">
//                       <div className="flex items-center gap-3 text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
//                         <span className="text-purple-600">✦</span>
//                         Marker Style
//                       </div>
                      
//                       <div className="space-y-4">
//                         <div>
//                           <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
//                             Pattern Style
//                           </label>
//                           <div className="grid grid-cols-5 gap-2">
//                             {markerStyles.map(style => (
//                               <button
//                                 key={style.id}
//                                 onClick={() => setShapeConfig(prev => ({ ...prev, patternStyle: style.id }))}
//                                 className={`p-2 rounded-lg border-2 transition-all ${
//                                   shapeConfig.patternStyle === style.id
//                                     ? "border-purple-500 bg-purple-50 dark:bg-purple-900 scale-110"
//                                     : "border-gray-200 dark:border-gray-600 hover:border-purple-300"
//                                 }`}
//                               >
//                                 <div className="text-lg">{style.preview}</div>
//                                 <div className="text-xs mt-1">{style.name}</div>
//                               </button>
//                             ))}
//                           </div>
//                         </div>

//                         <div>
//                           <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
//                             Dot Style
//                           </label>
//                           <div className="grid grid-cols-5 gap-2">
//                             {dotStyles.map(style => (
//                               <button
//                                 key={style.id}
//                                 onClick={() => setQrConfig(prev => ({ ...prev, dotsStyle: style.id }))}
//                                 className={`p-2 rounded-lg border-2 transition-all ${
//                                   qrConfig.dotsStyle === style.id
//                                     ? "border-blue-500 bg-blue-50 dark:bg-blue-900 scale-110"
//                                     : "border-gray-200 dark:border-gray-600 hover:border-blue-300"
//                                 }`}
//                               >
//                                 <div className="text-lg">{style.preview}</div>
//                                 <div className="text-xs mt-1">{style.name}</div>
//                               </button>
//                             ))}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
                    
//                     {/* Logo Configuration */}
//                     <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border-2 border-gray-100 dark:border-gray-700 shadow-lg">
//                       <div className="flex items-center gap-3 text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
//                         <span className="text-pink-600">🖼️</span>
//                         Center Logo
//                       </div>
                      
//                       <div
//                         onDragEnter={handleDrag}
//                         onDragLeave={handleDrag}
//                         onDragOver={handleDrag}
//                         onDrop={handleDrop}
//                         className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
//                           dragActive 
//                             ? "border-blue-500 bg-blue-50 dark:bg-blue-900/50" 
//                             : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
//                         }`}
//                       >
//                         {!logoConfig.enabled ? (
//                           <div>
//                             <div className="text-4xl mb-2">📁</div>
//                             <p className="text-gray-600 dark:text-gray-400 mb-2">
//                               Drag & drop logo image here
//                             </p>
//                             <p className="text-gray-500 dark:text-gray-500 mb-4">- or -</p>
//                             <input
//                               ref={fileInputRef}
//                               type="file"
//                               accept="image/*"
//                               onChange={handleLogoUpload}
//                               className="hidden"
//                             />
//                             <button
//                               onClick={() => fileInputRef.current?.click()}
//                               className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all"
//                             >
//                               Browse Files
//                             </button>
//                           </div>
//                         ) : (
//                           <div className="space-y-4">
//                             <div className="p-4 border-2 border-green-200 bg-green-50 dark:bg-green-900/50 rounded-xl">
//                               <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-400 font-medium">
//                                 <span>✓</span> Logo uploaded
//                               </div>
//                             </div>
                            
//                             <div>
//                               <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
//                                 Size: {logoConfig.size}px
//                               </label>
//                               <input
//                                 type="range"
//                                 min="20"
//                                 max="100"
//                                 value={logoConfig.size}
//                                 onChange={(e) => setLogoConfig(prev => ({ ...prev, size: parseInt(e.target.value) }))}
//                                 className="w-full"
//                               />
//                             </div>

//                             <div className="flex items-center gap-3">
//                               <input
//                                 type="checkbox"
//                                 id="removeBg"
//                                 checked={logoConfig.removeBg}
//                                 onChange={(e) => setLogoConfig(prev => ({ ...prev, removeBg: e.target.checked }))}
//                                 className="w-4 h-4"
//                               />
//                               <label htmlFor="removeBg" className="text-sm font-medium dark:text-gray-300">
//                                 Remove background
//                               </label>
//                             </div>

//                             <div className="flex items-center gap-3">
//                               <input
//                                 type="checkbox"
//                                 id="shadow"
//                                 checked={logoConfig.shadow}
//                                 onChange={(e) => setLogoConfig(prev => ({ ...prev, shadow: e.target.checked }))}
//                                 className="w-4 h-4"
//                               />
//                               <label htmlFor="shadow" className="text-sm font-medium dark:text-gray-300">
//                                 Add shadow
//                               </label>
//                             </div>

//                             <button
//                               onClick={() => setLogoConfig(prev => ({ ...prev, enabled: false, file: null }))}
//                               className="w-full px-4 py-2 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
//                             >
//                               Remove Logo
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </>
//                 )}

//                 {/* Barcode Settings */}
//                 {codeType === "barcode" && (
//                   <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border-2 border-gray-100 dark:border-gray-700 shadow-lg lg:col-span-2">
//                     <div className="flex items-center gap-3 text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
//                       <span className="text-green-600">|||</span>
//                       Barcode Configuration
//                     </div>
                    
//                     <div className="grid md:grid-cols-3 gap-4">
//                       <div>
//                         <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
//                           Format
//                         </label>
//                         <select
//                           value={barcodeConfig.format}
//                           onChange={(e) => setBarcodeConfig(prev => ({ ...prev, format: e.target.value }))}
//                           className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-gray-200"
//                         >
//                           {barcodeFormats.map(format => (
//                             <option key={format.value} value={format.value}>
//                               {format.label} - {format.description}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
                      
//                       <div>
//                         <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
//                           Width: {barcodeConfig.width}
//                         </label>
//                         <input
//                           type="range"
//                           min="1"
//                           max="4"
//                           step="0.1"
//                           value={barcodeConfig.width}
//                           onChange={(e) => setBarcodeConfig(prev => ({ ...prev, width: parseFloat(e.target.value) }))}
//                           className="w-full"
//                         />
//                       </div>
                      
//                       <div>
//                         <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
//                           Height: {barcodeConfig.height}
//                         </label>
//                         <input
//                           type="range"
//                           min="50"
//                           max="300"
//                           value={barcodeConfig.height}
//                           onChange={(e) => setBarcodeConfig(prev => ({ ...prev, height: parseInt(e.target.value) }))}
//                           className="w-full"
//                         />
//                       </div>

//                       <div>
//                         <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
//                           Rotation: {barcodeConfig.rotation}°
//                         </label>
//                         <input
//                           type="range"
//                           min="0"
//                           max="90"
//                           step="90"
//                           value={barcodeConfig.rotation}
//                           onChange={(e) => setBarcodeConfig(prev => ({ ...prev, rotation: parseInt(e.target.value) }))}
//                           className="w-full"
//                         />
//                       </div>

//                       <div>
//                         <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
//                           Font Size: {barcodeConfig.fontSize}
//                         </label>
//                         <input
//                           type="range"
//                           min="8"
//                           max="32"
//                           value={barcodeConfig.fontSize}
//                           onChange={(e) => setBarcodeConfig(prev => ({ ...prev, fontSize: parseInt(e.target.value) }))}
//                           className="w-full"
//                         />
//                       </div>

//                       <div className="flex items-center gap-3">
//                         <input
//                           type="checkbox"
//                           checked={barcodeConfig.displayValue}
//                           onChange={(e) => setBarcodeConfig(prev => ({ ...prev, displayValue: e.target.checked }))}
//                           className="w-4 h-4"
//                         />
//                         <label className="text-sm font-medium dark:text-gray-300">
//                           Show Text
//                         </label>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Color & Gradient Customization */}
//               <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border-2 border-gray-100 dark:border-gray-700 shadow-lg">
//                 <div className="flex items-center gap-3 text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6">
//                   <span className="text-pink-600">🎨</span>
//                   Color Palette
//                 </div>
                
//                 <div className="grid grid-cols-5 gap-3 mb-6">
//                   {colorPalettes.map((palette, index) => (
//                     <button
//                       key={index}
//                       onClick={() => setQrConfig(prev => ({ ...prev, fgColor: palette.fg, bgColor: palette.bg }))}
//                       className="p-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-blue-500 transition-all hover:scale-105"
//                       style={{ backgroundColor: palette.bg }}
//                     >
//                       <div className="h-8 rounded-lg" style={{ backgroundColor: palette.fg }}></div>
//                       <div className="text-xs mt-2 font-medium" style={{ color: palette.fg }}>
//                         {palette.name}
//                       </div>
//                     </button>
//                   ))}
//                 </div>

//                 <div className="space-y-4">
//                   <div className="flex items-center gap-4">
//                     <div>
//                       <label className="text-sm font-medium dark:text-gray-300 block mb-2">Foreground</label>
//                       <input
//                         type="color"
//                         value={qrConfig.fgColor}
//                         onChange={(e) => setQrConfig(prev => ({ ...prev, fgColor: e.target.value }))}
//                         className="w-16 h-16 rounded-lg cursor-pointer"
//                       />
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium dark:text-gray-300 block mb-2">Background</label>
//                       <div className="relative">
//                         <input
//                           type="color"
//                           value={qrConfig.bgColor === "transparent" ? "#ffffff" : qrConfig.bgColor}
//                           onChange={(e) => setQrConfig(prev => ({ ...prev, bgColor: e.target.value }))}
//                           className="w-16 h-16 rounded-lg cursor-pointer"
//                         />
//                       </div>
//                     </div>
//                     <button
//                       onClick={() => setQrConfig(prev => ({ ...prev, bgColor: "transparent" }))}
//                       className="px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:border-gray-400"
//                     >
//                       Transparent
//                     </button>
//                   </div>

//                   <div>
//                     <label className="text-sm font-medium dark:text-gray-300 block mb-2">
//                       Gradient (Experimental)
//                     </label>
//                     <div className="flex gap-2">
//                       {gradientPresets.map((gradient, index) => (
//                         <button
//                           key={index}
//                           onClick={() => setQrConfig(prev => ({ 
//                             ...prev, 
//                             gradient: { from: gradient.from, to: gradient.to }
//                           }))}
//                           className="px-3 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-transform"
//                           style={{
//                             background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
//                             color: 'white'
//                           }}
//                         >
//                           {gradient.name}
//                         </button>
//                       ))}
//                       <button
//                         onClick={() => setQrConfig(prev => ({ ...prev, gradient: null }))}
//                         className="px-3 py-2 rounded-lg text-xs font-medium bg-gray-200 dark:bg-gray-700 hover:bg-gray-300"
//                       >
//                         Clear
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Right Column - Live Preview */}
//             <div className="xl:col-span-1">
//               <div className="sticky top-8">
//                 <div className="text-center mb-6">
//                   <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
//                     Live Preview
//                   </h3>
//                   <div className="flex justify-center gap-4">
//                     <select
//                       value={exportFormat}
//                       onChange={(e) => setExportFormat(e.target.value)}
//                       className="px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm dark:bg-gray-700 dark:text-gray-200"
//                     >
//                       <option value="png">PNG</option>
//                       <option value="svg">SVG</option>
//                       <option value="jpeg">JPEG</option>
//                     </select>
//                     <button
//                       onClick={() => handleExport(exportFormat)}
//                       className="px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600"
//                     >
//                       Export
//                     </button>
//                   </div>
//                 </div>

//                 {/* Preview Container */}
//                 <div
//                   ref={previewRef}
//                   className={`p-8 rounded-3xl shadow-2xl border-2 border-gray-200 dark:border-gray-600 mb-6 transition-all duration-500 hover:shadow-3xl flex items-center justify-center min-h-[400px] overflow-hidden ${
//                     qrConfig.bgColor === "transparent" 
//                       ? "bg-checkerboard" 
//                       : ""
//                   }`}
//                   style={{
//                     backgroundColor: qrConfig.bgColor !== "transparent" ? qrConfig.bgColor : undefined,
//                     backgroundImage: qrConfig.gradient 
//                       ? `linear-gradient(135deg, ${qrConfig.gradient.from}, ${qrConfig.gradient.to})` 
//                       : undefined
//                   }}
//                 >
//                   {text ? (
//                     <div className="relative flex items-center justify-center w-full max-w-full" ref={codeType === "qr" ? qrRef : barcodeRef}>
//                       {codeType === "qr" ? (
//                         <>
//                           <QRCodeCanvas
//                             value={text}
//                             size={Math.min(320, window.innerWidth - 100)}
//                             fgColor={qrConfig.fgColor}
//                             bgColor={qrConfig.bgColor === "transparent" ? undefined : qrConfig.bgColor}
//                             level={qrConfig.level}
//                             includeMargin={qrConfig.includeMargin}
//                             style={{ display: 'block', margin: '0 auto' }}
//                           />
//                           {renderCenterIcon()}
//                         </>
//                       ) : (
//                         <div className="w-full overflow-auto">
//                           <Barcode
//                             value={text}
//                             format={barcodeConfig.format}
//                             width={barcodeConfig.width}
//                             height={barcodeConfig.height}
//                             displayValue={barcodeConfig.displayValue}
//                             textAlign={barcodeConfig.textAlign}
//                             textPosition={barcodeConfig.textPosition}
//                             fontSize={barcodeConfig.fontSize}
//                             lineColor={qrConfig.fgColor}
//                             background={qrConfig.bgColor === "transparent" ? undefined : qrConfig.bgColor}
//                             margin={10}
//                           />
//                         </div>
//                       )}
//                     </div>
//                   ) : (
//                     <div className="w-full h-64 flex items-center justify-center">
//                       <div className="text-center text-gray-400 dark:text-gray-500">
//                         <div className="text-6xl mb-4">⚡</div>
//                         <p className="text-lg font-medium">
//                           Enter content to generate
//                         </p>
//                         <p className="text-sm mt-2">
//                           Supports URLs, text, emails, vCards & more
//                         </p>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="space-y-3">
//                   <button
//                     onClick={handleDownload}
//                     disabled={isGenerating || (!text && !batchMode)}
//                     className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
//                   >
//                     {isGenerating ? (
//                       <>
//                         <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                         Generating...
//                       </>
//                     ) : (
//                       <>
//                         <span>↓</span>
//                         Download {codeType === "qr" ? "QR Code" : "Barcode"}
//                       </>
//                     )}
//                   </button>
                  
//                   {batchMode && batchTexts.length > 0 && (
//                     <button
//                       onClick={generateBatchCodes}
//                       disabled={isGenerating}
//                       className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
//                     >
//                       <span>📦</span>
//                       Export All as ZIP
//                     </button>
//                   )}
                  
//                   <button
//                     onClick={() => setShowPreviewModal(true)}
//                     disabled={!text}
//                     className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
//                   >
//                     <span>⛶</span>
//                     Full Screen Preview
//                   </button>
//                 </div>

//                 {/* Quick Actions */}
//                 <div className="mt-4 grid grid-cols-2 gap-2">
//                   <button
//                     onClick={undo}
//                     className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-xl text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
//                     disabled={historyIndex <= 0}
//                   >
//                     ← Undo
//                   </button>
//                   <button
//                     onClick={redo}
//                     className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-xl text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
//                     disabled={historyIndex >= history.length - 1}
//                   >
//                     Redo →
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Full Screen Preview Modal */}
//         {showPreviewModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4" onClick={() => setShowPreviewModal(false)}>
//             <div className="max-w-4xl max-h-full" onClick={e => e.stopPropagation()}>
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-2xl font-bold text-white">
//                   {codeType === "qr" ? "QR Code" : "Barcode"} Preview
//                 </h3>
//                 <button
//                   onClick={() => setShowPreviewModal(false)}
//                   className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
//                 >
//                   ✕
//                 </button>
//               </div>
              
//               <div className="p-8 bg-white rounded-3xl shadow-2xl flex items-center justify-center min-h-[500px]">
//                 {codeType === "qr" ? (
//                   <div className="relative">
//                     <QRCodeCanvas
//                       value={text}
//                       size={Math.min(512, window.innerWidth - 100)}
//                       fgColor={qrConfig.fgColor}
//                       bgColor={qrConfig.bgColor === "transparent" ? undefined : qrConfig.bgColor}
//                       level={qrConfig.level}
//                       includeMargin={qrConfig.includeMargin}
//                     />
//                     {renderCenterIcon(2)}
//                   </div>
//                 ) : (
//                   <Barcode
//                     value={text}
//                     format={barcodeConfig.format}
//                     width={barcodeConfig.width * 2}
//                     height={barcodeConfig.height * 1.5}
//                     displayValue={barcodeConfig.displayValue}
//                     fontSize={barcodeConfig.fontSize * 1.5}
//                     lineColor={qrConfig.fgColor}
//                     background={qrConfig.bgColor === "transparent" ? undefined : qrConfig.bgColor}
//                     margin={20}
//                   />
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Styles */}
//       <style jsx>{`
//         .bg-checkerboard {
//           background-image: 
//             linear-gradient(45deg, #e0e0e0 25%, transparent 25%),
//             linear-gradient(-45deg, #e0e0e0 25%, transparent 25%),
//             linear-gradient(45deg, transparent 75%, #e0e0e0 75%),
//             linear-gradient(-45deg, transparent 75%, #e0e0e0 75%);
//           background-size: 20px 20px;
//           background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
//         }
        
//         @keyframes fade-in-down {
//           0% {
//             opacity: 0;
//             transform: translateY(-20px);
//           }
//           100% {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
        
//         .animate-fade-in-down {
//           animation: fade-in-down 0.3s ease-out;
//         }
        
//         @keyframes shake {
//           0%, 100% { transform: translateX(0); }
//           25% { transform: translateX(-5px); }
//           75% { transform: translateX(5px); }
//         }
        
//         .animate-shake {
//           animation: shake 0.3s ease-in-out;
//         }
        
//         .hover\\:shadow-3xl:hover {
//           box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.3);
//         }
//       `}</style>
//     </div>
//   );
// }

// export default App;
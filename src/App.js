import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ReactQRCode } from "@lglab/react-qr-code"; // or @igb-lab/react-qr-code
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
  Hexagon,
  Image as ImageIcon,
  Leaf,
  Star,
  Heart,
  Minus,
  RotateCw,
  Scissors,
  Globe,
  Phone,
  Mail,
  MessageSquare,
  Wifi,
  User,
  MapPin,
  Calendar,
  Wallet,
  History,
  Trash2,
  Save,
  ScanLine,
  Video as VideoIcon,
} from "lucide-react";

// ==================== Reusable Components ====================

const AccordionSection = ({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
}) => {
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
     <div className="flex flex-wrap gap-4">
        {items.map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(item.id)}
         className={`
  relative w-[92px] h-[110px]
  rounded-2xl border-2 transition-all duration-300
  flex flex-col items-center justify-center gap-3
  shrink-0
              ${
                selected === item.id
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
<div className="w-10 h-10 flex items-center justify-center text-gray-700">              {item.icon}
            </div>
<span className="text-[13px] font-medium text-gray-700 text-center leading-tight min-h-[32px] flex items-center">              {item.name}
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

const IconButton = ({
  icon: Icon,
  label,
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
}) => {
  const variants = {
    primary:
      "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-200 hover:shadow-xl hover:from-purple-700 hover:to-indigo-700",
    secondary:
      "border-2 border-purple-200 text-purple-600 hover:bg-purple-50",
    ghost: "bg-gray-100 text-gray-600 hover:bg-gray-200",
  };

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${variants[variant]} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {label}
    </motion.button>
  );
};

// ==================== Style Configurations ====================

const MODULE_STYLES = [
  { id: "square", name: "Square", icon: <Square className="w-8 h-8" /> },
  { id: "rounded", name: "Rounded", icon: <Square className="w-8 h-8 rounded-md" /> },
  { id: "circle", name: "Circle", icon: <Circle className="w-8 h-8" /> },
  { id: "diamond", name: "Diamond", icon: <Disc className="w-8 h-8" /> },
  { id: "star", name: "Star", icon: <Star className="w-8 h-8" /> },
  { id: "heart", name: "Heart", icon: <Heart className="w-8 h-8" /> },
  { id: "leaf", name: "Leaf", icon: <Leaf className="w-8 h-8" /> },
  { id: "hashtag", name: "Hashtag", icon: <span className="text-xl font-bold">#</span> },
  { id: "vertical-line", name: "Vertical", icon: <span className="text-xl font-bold">|</span> },
  { id: "horizontal-line", name: "Horizontal", icon: <Minus className="w-8 h-8" /> },
  { id: "circuit-board", name: "Circuit", icon: <span className="text-xl">⎔</span> },
  { id: "pinched-square", name: "Pinched", icon: <Hexagon className="w-8 h-8" /> },
  { id: "square-sm", name: "Square SM", icon: <Square className="w-6 h-6" /> },
];

const FINDER_OUTER_STYLES = [
  { id: "circle", name: "Circle", icon: <Circle className="w-8 h-8" /> },
  { id: "inpoint", name: "Inpoint", icon: <span className="text-xl">◉</span> },
  { id: "inpoint-lg", name: "Inpoint LG", icon: <span className="text-xl">⬤</span> },
  { id: "inpoint-sm", name: "Inpoint SM", icon: <span className="text-xl">◌</span> },
  { id: "leaf", name: "Leaf", icon: <Leaf className="w-8 h-8" /> },
  { id: "leaf-lg", name: "Leaf LG", icon: <Leaf className="w-9 h-9" /> },
  { id: "leaf-sm", name: "Leaf SM", icon: <Leaf className="w-7 h-7" /> },
  { id: "outpoint", name: "Outpoint", icon: <span className="text-xl">◈</span> },
  { id: "outpoint-lg", name: "Outpoint LG", icon: <span className="text-xl">⬥</span> },
  { id: "outpoint-sm", name: "Outpoint SM", icon: <span className="text-xl">◇</span> },
  { id: "pinched-square", name: "Pinched", icon: <Hexagon className="w-8 h-8" /> },
  { id: "rounded", name: "Rounded", icon: <Square className="w-8 h-8 rounded-lg" /> },
  { id: "rounded-lg", name: "Rounded LG", icon: <Square className="w-9 h-9 rounded-2xl" /> },
  { id: "rounded-sm", name: "Rounded SM", icon: <Square className="w-7 h-7 rounded-sm" /> },
  { id: "square", name: "Square", icon: <Square className="w-8 h-8" /> },
];

const FINDER_INNER_STYLES = [
  { id: "circle", name: "Circle", icon: <Circle className="w-6 h-6" /> },
  { id: "diamond", name: "Diamond", icon: <span className="text-lg">◆</span> },
  { id: "hashtag", name: "Hashtag", icon: <span className="text-lg font-bold">#</span> },
  { id: "heart", name: "Heart", icon: <Heart className="w-6 h-6" /> },
  { id: "inpoint", name: "Inpoint", icon: <span className="text-lg">◉</span> },
  { id: "inpoint-lg", name: "Inpoint LG", icon: <span className="text-lg">⬤</span> },
  { id: "inpoint-sm", name: "Inpoint SM", icon: <span className="text-lg">◌</span> },
  { id: "leaf", name: "Leaf", icon: <Leaf className="w-6 h-6" /> },
  { id: "leaf-lg", name: "Leaf LG", icon: <Leaf className="w-7 h-7" /> },
  { id: "leaf-sm", name: "Leaf SM", icon: <Leaf className="w-5 h-5" /> },
  { id: "microchip", name: "Microchip", icon: <span className="text-lg">⬡</span> },
  { id: "outpoint", name: "Outpoint", icon: <span className="text-lg">◈</span> },
  { id: "outpoint-lg", name: "Outpoint LG", icon: <span className="text-lg">⬥</span> },
  { id: "outpoint-sm", name: "Outpoint SM", icon: <span className="text-lg">◇</span> },
  { id: "pinched-square", name: "Pinched", icon: <Hexagon className="w-6 h-6" /> },
  { id: "rounded", name: "Rounded", icon: <Square className="w-6 h-6 rounded-md" /> },
  { id: "rounded-lg", name: "Rounded LG", icon: <Square className="w-7 h-7 rounded-xl" /> },
  { id: "rounded-sm", name: "Rounded SM", icon: <Square className="w-5 h-5 rounded-sm" /> },
  { id: "square", name: "Square", icon: <Square className="w-6 h-6" /> },
  { id: "star", name: "Star", icon: <Star className="w-6 h-6" /> },
];

// ==================== Image Settings Editor (with upload + background removal) ====================

const ImageSettingsEditor = ({
  includeImage,
  setIncludeImage,
  imageUrl,
  setImageUrl,
  excavate,
  setExcavate,
  imageWidth,
  setImageWidth,
  imageHeight,
  setImageHeight,
  imageOpacity,
  setImageOpacity,
  centerImage,
  setCenterImage,
  imageX,
  setImageX,
  imageY,
  setImageY,
  isDarkMode,
}) => {
  const fileInputRef = useRef(null);
  const [isRemovingBg, setIsRemovingBg] = useState(false);

  const handleFileUpload = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => setImageUrl(ev.target.result);
        reader.readAsDataURL(file);
      }
      // reset file input so the same file can be re-uploaded
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [setImageUrl]
  );

  const handleRemoveBackground = useCallback(async () => {
    if (!imageUrl) return;
    setIsRemovingBg(true);
    try {
      const { removeBackground } = await import("@imgly/background-removal");
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const resultBlob = await removeBackground(blob, {
        model: "medium",
        output: { format: "image/png", quality: 0.8 },
      });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
        setIsRemovingBg(false);
      };
      reader.onerror = () => {
        setIsRemovingBg(false);
        alert("Failed to process image");
      };
      reader.readAsDataURL(resultBlob);
    } catch (error) {
      console.error("Background removal failed:", error);
      setIsRemovingBg(false);
      alert("Background removal failed. Make sure @imgly/background-removal is installed.");
    }
  }, [imageUrl, setImageUrl]);

  return (
    <div className="space-y-5">
      {/* Include Image toggle */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={includeImage}
          onChange={(e) => setIncludeImage(e.target.checked)}
          className="w-4 h-4 accent-purple-600"
        />
        <span className="text-sm font-medium">Include Image</span>
      </label>

      {includeImage && (
        <>
          {/* Upload & URL section */}
          <div className="space-y-3">
            <div className="flex gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                    : "bg-white hover:bg-gray-100 text-gray-700 border border-gray-300"
                }`}
              >
                <Upload className="w-4 h-4" />
                Upload
              </button>
              <button
                onClick={handleRemoveBackground}
                disabled={isRemovingBg || !imageUrl}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isRemovingBg
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg"
                }`}
              >
                {isRemovingBg ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    Removing...
                  </>
                ) : (
                  <>
                    <Scissors className="w-4 h-4" />
                    Remove BG
                  </>
                )}
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            <div>
              <label className="block text-sm font-medium mb-1">
                Image URL
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/logo.png or data:image/..."
                className={`w-full px-3 py-2 rounded-xl border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-200"
                }`}
              />
            </div>

            {imageUrl && (
              <div className="flex items-center justify-center p-2 bg-white rounded-lg border">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="max-h-24 object-contain"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* Excavation */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={excavate}
              onChange={(e) => setExcavate(e.target.checked)}
              className="w-4 h-4 accent-purple-600"
            />
            <span className="text-sm font-medium">Excavate (remove QR behind)</span>
          </label>

          {/* Width */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Width ({imageWidth}px)
            </label>
            <input
              type="range"
              min="20"
              max="200"
              step="1"
              value={imageWidth}
              onChange={(e) => setImageWidth(Number(e.target.value))}
              className="w-full accent-purple-600"
            />
          </div>

          {/* Height */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Height ({imageHeight}px)
            </label>
            <input
              type="range"
              min="20"
              max="200"
              step="1"
              value={imageHeight}
              onChange={(e) => setImageHeight(Number(e.target.value))}
              className="w-full accent-purple-600"
            />
          </div>

          {/* Opacity */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Opacity ({imageOpacity.toFixed(1)})
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={imageOpacity}
              onChange={(e) => setImageOpacity(Number(e.target.value))}
              className="w-full accent-purple-600"
            />
          </div>

          {/* Center Image */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={centerImage}
              onChange={(e) => setCenterImage(e.target.checked)}
              className="w-4 h-4 accent-purple-600"
            />
            <span className="text-sm font-medium">Center Image</span>
          </label>

          {/* Manual Position */}
          {!centerImage && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  X Position
                </label>
                <input
                  type="number"
                  value={imageX}
                  onChange={(e) => setImageX(e.target.value)}
                  placeholder="x"
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-200"
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Y Position
                </label>
                <input
                  type="number"
                  value={imageY}
                  onChange={(e) => setImageY(e.target.value)}
                  placeholder="y"
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-200"
                  }`}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ==================== Main App Component ====================

// ==================== Advanced Feature Config ====================

const QR_TYPES = [
  { id: "text", name: "Text", icon: <Type className="w-4 h-4" /> },
  { id: "url", name: "URL", icon: <Globe className="w-4 h-4" /> },
  { id: "phone", name: "Phone", icon: <Phone className="w-4 h-4" /> },
  { id: "email", name: "Email", icon: <Mail className="w-4 h-4" /> },
  { id: "sms", name: "SMS", icon: <MessageSquare className="w-4 h-4" /> },
  { id: "wifi", name: "Wi-Fi", icon: <Wifi className="w-4 h-4" /> },
  { id: "vcard", name: "Contact", icon: <User className="w-4 h-4" /> },
  { id: "location", name: "Location", icon: <MapPin className="w-4 h-4" /> },
  { id: "event", name: "Event", icon: <Calendar className="w-4 h-4" /> },
  { id: "upi", name: "UPI", icon: <Wallet className="w-4 h-4" /> },
];

const QR_DEFAULTS = {
  text: { text: "" },
  url: { url: "https://example.com" },
  phone: { phone: "+1234567890" },
  email: { email: "you@example.com", subject: "", body: "" },
  sms: { number: "+1234567890", message: "" },
  wifi: { ssid: "MyNetwork", password: "", encryption: "WPA", hidden: false },
  vcard: { first: "", last: "", org: "", title: "", phone: "", email: "", website: "", address: "" },
  location: { lat: "", lng: "" },
  event: { title: "", start: "", end: "", location: "", description: "" },
  upi: { upiId: "", name: "", amount: "", note: "" },
};

function buildContent(type, f) {
  switch (type) {
    case "text":
      return f.text || "";
    case "url":
      return f.url || "";
    case "phone":
      return `tel:${f.phone || ""}`;
    case "email": {
      let s = `mailto:${f.email || ""}`;
      const q = [];
      if (f.subject) q.push(`subject=${encodeURIComponent(f.subject)}`);
      if (f.body) q.push(`body=${encodeURIComponent(f.body)}`);
      if (q.length) s += `?${q.join("&")}`;
      return s;
    }
    case "sms":
      return `SMSTO:${f.number || ""}:${encodeURIComponent(f.message || "")}`;
    case "wifi": {
      const auth = f.encryption || "WPA";
      const hid = f.hidden ? "true" : "false";
      return `WIFI:T:${auth};S:${f.ssid || ""};P:${f.password || ""};H:${hid};;`;
    }
    case "vcard": {
      const lines = ["BEGIN:VCARD", "VERSION:3.0"];
      lines.push(`N:${f.last || ""};${f.first || ""}`);
      if (f.first || f.last)
        lines.push(`FN:${[f.first, f.last].filter(Boolean).join(" ")}`);
      if (f.org) lines.push(`ORG:${f.org}`);
      if (f.title) lines.push(`TITLE:${f.title}`);
      if (f.phone) lines.push(`TEL:${f.phone}`);
      if (f.email) lines.push(`EMAIL:${f.email}`);
      if (f.website) lines.push(`URL:${f.website}`);
      if (f.address) lines.push(`ADR:;;${f.address}`);
      lines.push("END:VCARD");
      return lines.join("\n");
    }
    case "location":
      return `geo:${f.lat || ""},${f.lng || ""}`;
    case "event": {
      const lines = ["BEGIN:VEVENT", "VERSION:2.0"];
      if (f.title) lines.push(`SUMMARY:${f.title}`);
      if (f.start) lines.push(`DTSTART:${f.start.replace(/[-:]/g, "")}`);
      if (f.end) lines.push(`DTEND:${f.end.replace(/[-:]/g, "")}`);
      if (f.location) lines.push(`LOCATION:${f.location}`);
      if (f.description) lines.push(`DESCRIPTION:${f.description}`);
      lines.push("END:VEVENT");
      return lines.join("\n");
    }
    case "upi": {
      const params = [`pa=${f.upiId || ""}`];
      if (f.name) params.push(`pn=${encodeURIComponent(f.name)}`);
      if (f.amount) params.push(`am=${f.amount}&cu=INR`);
      if (f.note) params.push(`tn=${encodeURIComponent(f.note)}`);
      return `upi://pay?${params.join("&")}`;
    }
    default:
      return "";
  }
}

const TEMPLATES = [
  { id: "website", name: "Website", type: "url", icon: <Globe className="w-4 h-4" />, fields: { url: "https://example.com" } },
  { id: "whatsapp", name: "WhatsApp", type: "url", icon: <MessageSquare className="w-4 h-4" />, fields: { url: "https://wa.me/1234567890" } },
  { id: "wifi", name: "Wi-Fi", type: "wifi", icon: <Wifi className="w-4 h-4" />, fields: { ssid: "MyNetwork", password: "your-password", encryption: "WPA" } },
  { id: "contact", name: "Contact", type: "vcard", icon: <User className="w-4 h-4" />, fields: { first: "First", last: "Last", phone: "+1234567890", email: "you@example.com" } },
  { id: "upi", name: "UPI", type: "upi", icon: <Wallet className="w-4 h-4" />, fields: { upiId: "yourname@bank", name: "Your Name" } },
  { id: "email", name: "Email", type: "email", icon: <Mail className="w-4 h-4" />, fields: { email: "you@example.com" } },
  { id: "phone", name: "Phone", type: "phone", icon: <Phone className="w-4 h-4" />, fields: { phone: "+1234567890" } },
  { id: "location", name: "Location", type: "location", icon: <MapPin className="w-4 h-4" />, fields: { lat: "12.9716", lng: "77.5946" } },
];

// ==================== QR Scanner (lazy-loaded decode) ====================

function QrScannerModal({ onClose, onResult, isDarkMode }) {
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const [error, setError] = useState(null);
  const [cameraOn, setCameraOn] = useState(false);

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraOn(false);
  }, []);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  const startCamera = useCallback(async () => {
    setError(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError(
        "Camera scanning isn't supported on this device or connection. You can still scan by uploading an image below."
      );
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraOn(true);
      const jsQR = (await import("jsqr")).default;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      const tick = () => {
        const v = videoRef.current;
        if (v && v.readyState === v.HAVE_ENOUGH_DATA) {
          canvas.width = v.videoWidth;
          canvas.height = v.videoHeight;
          ctx.drawImage(v, 0, 0);
          const id = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(id.data, id.width, id.height, {
            inversionAttempts: "dontInvert",
          });
          if (code && code.data) {
            stop();
            onResult(code.data);
            return;
          }
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch (err) {
      setError(
        "Could not access the camera. Please allow camera permission, or upload an image to scan instead."
      );
    }
  }, [onResult, stop]);

  const scanFile = useCallback(
    (file) => {
      if (!file) return;
      setError(null);
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const jsQR = (await import("jsqr")).default;
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d", { willReadFrequently: true });
            ctx.drawImage(img, 0, 0);
            const id = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(id.data, id.width, id.height, {
              inversionAttempts: "attemptBoth",
            });
            if (code && code.data) {
              stop();
              onResult(code.data);
            } else {
              setError("No QR code was found in that image.");
            }
          };
          img.onerror = () => setError("Could not read that image.");
          img.src = reader.result;
        } catch (e) {
          setError("Could not scan the image.");
        }
      };
      reader.onerror = () => setError("Could not read the file.");
      reader.readAsDataURL(file);
    },
    [onResult, stop]
  );

  return (
<div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`w-full max-w-md rounded-2xl shadow-2xl p-6 ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <ScanLine className="w-5 h-5 text-purple-600" /> Scan QR Code
          </h2>
          <button
            onClick={() => {
              stop();
              onClose();
            }}
            aria-label="Close scanner"
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p
          className={`text-xs mb-4 ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          We'll use your camera only to read a QR code. Everything is decoded on
          your device — nothing is uploaded or stored on any server.
        </p>

        {!cameraOn && (
          <button
            onClick={startCamera}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium shadow-lg"
          >
            <VideoIcon className="w-5 h-5" /> Start Camera
          </button>
        )}

        {cameraOn && (
          <div className="relative mb-3">
            <video
              ref={videoRef}
              muted
              playsInline
              className="w-full rounded-xl bg-black"
              style={{ maxHeight: 260 }}
            />
            <button
              onClick={stop}
              className="absolute top-2 right-2 px-3 py-1 rounded-lg bg-red-500 text-white text-xs font-medium"
            >
              Stop Camera
            </button>
          </div>
        )}

        <div className="mt-3">
          <label
            className={`block text-xs mb-1 ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Or scan from an image:
          </label>
          <button
            onClick={() => fileInputRef.current?.click()}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-gray-200"
                : "bg-white border-gray-300 text-gray-700"
            }`}
          >
            <Upload className="w-4 h-4" /> Upload image to scan
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files[0]) scanFile(e.target.files[0]);
              e.target.value = "";
            }}
          />
        </div>

        {error && (
          <p className="mt-3 text-xs text-red-500 bg-red-100 dark:bg-red-900/40 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}
      </motion.div>
    </div>
  );
}

// ==================== QR Type Fields (config-driven) ====================

const TYPE_FIELDS = {
  url: [{ k: "url", label: "URL" }],
  phone: [{ k: "phone", label: "Phone number", type: "tel" }],
  email: [
    { k: "email", label: "Email", type: "email" },
    { k: "subject", label: "Subject" },
    { k: "body", label: "Message", type: "textarea" },
  ],
  sms: [
    { k: "number", label: "Phone number", type: "tel" },
    { k: "message", label: "Message", type: "textarea" },
  ],
  wifi: [
    { k: "ssid", label: "Network name (SSID)" },
    { k: "password", label: "Password (leave empty for open network)" },
    {
      k: "encryption",
      label: "Encryption",
      type: "select",
      options: ["WPA", "WPA2", "WEP", "nopass"],
    },
  ],
  vcard: [
    { k: "first", label: "First name" },
    { k: "last", label: "Last name" },
    { k: "org", label: "Organization" },
    { k: "title", label: "Job title" },
    { k: "phone", label: "Phone", type: "tel" },
    { k: "email", label: "Email", type: "email" },
    { k: "website", label: "Website" },
    { k: "address", label: "Address" },
  ],
  location: [
    { k: "lat", label: "Latitude", type: "number" },
    { k: "lng", label: "Longitude", type: "number" },
  ],
  event: [
    { k: "title", label: "Event title" },
    { k: "start", label: "Start date & time", type: "datetime-local" },
    { k: "end", label: "End date & time", type: "datetime-local" },
    { k: "location", label: "Location" },
    { k: "description", label: "Description", type: "textarea" },
  ],
  upi: [
    { k: "upiId", label: "UPI ID (e.g. name@bank)" },
    { k: "name", label: "Payee name" },
    { k: "amount", label: "Amount (₹)" },
    { k: "note", label: "Note" },
  ],
};

function QrTypeFields({ type, fields, onField, isDarkMode }) {
  const list = TYPE_FIELDS[type] || [];
  const base = `w-full px-3 py-2 rounded-xl border ${
    isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200"
  }`;
  return (
    <div className="space-y-3">
      {list.map((f) => (
        <div key={f.k}>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            {f.label}
          </label>
          {f.type === "textarea" ? (
            <textarea
              rows={2}
              value={fields[f.k] || ""}
              onChange={(e) => onField(f.k, e.target.value)}
              className={base}
            />
          ) : f.type === "select" ? (
            <select
              value={fields[f.k] || ""}
              onChange={(e) => onField(f.k, e.target.value)}
              className={base}
            >
              {f.options.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={f.type || "text"}
              value={fields[f.k] || ""}
              onChange={(e) => onField(f.k, e.target.value)}
              className={base}
            />
          )}
        </div>
      ))}
      {type === "wifi" && (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={!!fields.hidden}
            onChange={(e) => onField("hidden", e.target.checked)}
            className="w-4 h-4 accent-purple-600"
          />
          Hidden network
        </label>
      )}
    </div>
  );
}

const LINE_WIDTH_SUPPORTED = [
  "vertical-line",
  "horizontal-line",
  "rounded",
  "circuit-board",
];

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [qrContent, setQrContent] = useState("https://example.com");
  const [selectedModuleStyle, setSelectedModuleStyle] = useState("square");
  const [selectedFinderOuter, setSelectedFinderOuter] = useState("square");
  const [selectedFinderInner, setSelectedFinderInner] = useState("square");
  const [foregroundColor, setForegroundColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [qrSize, setQrSize] = useState(300);
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState("H");
  const [margin, setMargin] = useState(5);
  const [lineWidth, setLineWidth] = useState(1);

  // Image settings states
  const [includeImage, setIncludeImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(
    "https://cdn.pixabay.com/photo/2016/02/04/11/57/heart-1179054_1280.png"
  );
  const [excavate, setExcavate] = useState(true);
  const [centerImage, setCenterImage] = useState(true);
  const [imageWidth, setImageWidth] = useState(40);
  const [imageHeight, setImageHeight] = useState(40);
  const [imageX, setImageX] = useState("");
  const [imageY, setImageY] = useState("");
  const [imageOpacity, setImageOpacity] = useState(1);

  const qrRef = useRef(null);

  // ---- Advanced feature state ----
  const [qrType, setQrType] = useState("url");
  const [qrFields, setQrFields] = useState({ ...QR_DEFAULTS.url });
  const [gradientEnabled, setGradientEnabled] = useState(false);
  const [gradientFrom, setGradientFrom] = useState("#3b82f6");
  const [gradientTo, setGradientTo] = useState("#8b5cf6");
  const [gradientType, setGradientType] = useState("linear");
  const [gradientRotation, setGradientRotation] = useState(90);
  const [exportSize, setExportSize] = useState(1024);
  const [showScanner, setShowScanner] = useState(false);
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("qr_history") || "[]");
    } catch {
      return [];
    }
  });

  // Keep structured type fields synced into qrContent.
  const updateFields = useCallback(
    (patch) => {
      setQrFields((prev) => {
        const next = { ...prev, ...patch };
        setQrContent(buildContent(qrType, next));
        return next;
      });
    },
    [qrType]
  );

  const changeQrType = useCallback(
    (type) => {
      setQrType(type);
      setQrFields({ ...QR_DEFAULTS[type] });
      setQrContent(buildContent(type, QR_DEFAULTS[type]));
    },
    []
  );

  const applyTemplate = useCallback((template) => {
    setQrType(template.type);
    setQrFields({ ...template.fields });
    setQrContent(buildContent(template.type, template.fields));
  }, []);

  // ---- History (localStorage only) ----
  const saveToHistory = useCallback(() => {
    if (!qrContent || !qrContent.trim()) return;
    const typeMeta = QR_TYPES.find((t) => t.id === qrType);
    const entry = {
      id: `${Date.now()}-${Math.round(Math.random() * 1e5)}`,
      content: qrContent,
      type: qrType,
      label: typeMeta ? typeMeta.name : "QR",
      ts: Date.now(),
    };
    setHistory((prev) => {
      const next = [entry, ...prev].slice(0, 50);
      try {
        localStorage.setItem("qr_history", JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  }, [qrContent, qrType]);

  const deleteHistoryItem = useCallback((id) => {
    setHistory((prev) => {
      const next = prev.filter((h) => h.id !== id);
      try {
        localStorage.setItem("qr_history", JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem("qr_history");
    } catch (e) {}
  }, []);

  const reuseHistoryItem = useCallback((item) => {
    setQrContent(item.content);
    if (QR_TYPES.some((t) => t.id === item.type)) {
      setQrType(item.type);
      setQrFields({ ...QR_DEFAULTS[item.type] });
    }
  }, []);

  // ---- Export: PNG / SVG / JPG / WebP with high-res sizes ----
  const exportQR = useCallback(
    (format, size) => {
      const svg = qrRef.current?.svg;
      if (!svg || !qrContent) return;
      const serialized = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([serialized], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      if (format === "svg") {
        const a = document.createElement("a");
        a.href = url;
        a.download = `qr-code-${Date.now()}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return;
      }
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        if (format === "jpeg") {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, size, size);
        }
        ctx.drawImage(img, 0, 0, size, size);
        URL.revokeObjectURL(url);
        const mime =
          format === "png"
            ? "image/png"
            : format === "webp"
            ? "image/webp"
            : "image/jpeg";
        const out = canvas.toDataURL(mime, format === "jpeg" ? 0.92 : undefined);
        const a = document.createElement("a");
        a.href = out;
        a.download = `qr-code-${Date.now()}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };
      img.onerror = () => URL.revokeObjectURL(url);
      img.src = url;
    },
    [qrContent]
  );

  const handleDownloadPNG = () => {
    exportQR("png", exportSize);
    saveToHistory();
  };
  const handleDownloadSVG = () => {
    exportQR("svg", exportSize);
    saveToHistory();
  };
  const handleDownloadWebP = () => {
    exportQR("webp", exportSize);
    saveToHistory();
  };
  const handleDownloadJPEG = () => {
    exportQR("jpeg", exportSize);
    saveToHistory();
  };

  const handleScannerResult = (data) => {
    setShowScanner(false);
    setQrContent(data);
    setQrType("text");
    setQrFields({ ...QR_DEFAULTS.text, text: data });
  };

  // Build image settings prop for QR component
  const logoImageSettings = includeImage
    ? {
        src: imageUrl,
        width: imageWidth,
        height: imageHeight,
        excavate,
        opacity: imageOpacity,
        ...(centerImage
          ? {}
          : {
              x: imageX ? Number(imageX) : undefined,
              y: imageY ? Number(imageY) : undefined,
            }),
      }
    : undefined;

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <header
        className={`sticky top-0 z-40 backdrop-blur-sm border-b ${
          isDarkMode
            ? "bg-gray-900/90 border-gray-800"
            : "bg-white/90 border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  QR Designer
                </span>
                <p className="text-xs text-gray-500">
                  Professional QR Code Generator
                </p>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* SEO Intro */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Free QR Code Generator
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-600">
            Create QR codes online quickly and easily. Generate free QR codes
            for websites, URLs, text, and more.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel – Customization */}
          <div className="space-y-6">
            {/* Content Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-2xl shadow-sm ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <Type className="w-5 h-5 text-purple-600" />
                <h2 className="font-semibold text-lg">QR Code Content</h2>
                <div className="ml-auto">
                  <button
                    onClick={() => setShowScanner(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow"
                    title="Scan a QR code with your camera or an image"
                  >
                    <ScanLine className="w-4 h-4" /> Scan QR
                  </button>
                </div>
              </div>

              {/* Quick Templates */}
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">
                  Quick Templates
                </p>
                <div className="flex flex-wrap gap-2">
                  {TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.id}
                      onClick={() => applyTemplate(tpl)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                        isDarkMode
                          ? "border-gray-600 text-gray-200 hover:border-purple-400"
                          : "border-gray-200 text-gray-600 hover:border-purple-300"
                      }`}
                    >
                      {tpl.icon}
                      {tpl.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* QR Type selector */}
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">
                  QR Type
                </p>
                <div className="flex flex-wrap gap-2">
                  {QR_TYPES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => changeQrType(t.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                        qrType === t.id
                          ? "border-purple-500 bg-purple-50 text-purple-700"
                          : isDarkMode
                          ? "border-gray-600 text-gray-200 hover:border-purple-400"
                          : "border-gray-200 text-gray-600 hover:border-purple-300"
                      }`}
                    >
                      {t.icon}
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type-specific fields */}
              <div className="mb-4">
                <QrTypeFields
                  type={qrType}
                  fields={qrFields}
                  onField={(k, v) => updateFields({ [k]: v })}
                  isDarkMode={isDarkMode}
                />
              </div>

              <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">
                Encoded content (auto-generated)
              </label>
              <textarea
                value={qrContent}
                onChange={(e) => setQrContent(e.target.value)}
                placeholder="Your QR code content appears here..."
                rows={3}
                className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all resize-none ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-200 placeholder-gray-400"
                }`}
              />
              <p className="mt-2 text-xs text-gray-500">
                Your data will be encoded with{" "}
                {errorCorrectionLevel === "H"
                  ? "High (30%)"
                  : errorCorrectionLevel === "Q"
                  ? "Quartile (25%)"
                  : errorCorrectionLevel === "M"
                  ? "Medium (15%)"
                  : "Low (7%)"}{" "}
                error correction
              </p>
            </motion.div>

            {/* Customization Accordions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`p-6 rounded-2xl shadow-sm ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex items-center gap-2 mb-6">
                <Palette className="w-5 h-5 text-purple-600" />
                <h2 className="font-semibold text-lg">
                  Customise How It Looks
                </h2>
              </div>

              <div className="space-y-4">
                {/* Data Module Styles */}
                <AccordionSection
                  title="Data Module Styles"
                  icon={Grid3X3}
                  defaultOpen={true}
                >
                  <StyleGrid
                    items={MODULE_STYLES}
                    selected={selectedModuleStyle}
                    onSelect={setSelectedModuleStyle}
                    label="Choose module shape"
                  />

                  {/* Dynamic Line Width Slider */}
                  {LINE_WIDTH_SUPPORTED.includes(selectedModuleStyle) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-5"
                    >
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Line Width ({lineWidth.toFixed(2)})
                      </label>
                      <input
                        type="range"
                        min="0.25"
                        max="1"
                        step="0.01"
                        value={lineWidth}
                        onChange={(e) => setLineWidth(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>0.25</span>
                        <span>1.00</span>
                      </div>
                    </motion.div>
                  )}
                </AccordionSection>

                {/* Finder Outer Pattern */}
                <AccordionSection
                  title="Finder Outer Pattern"
                  icon={ScanEye}
                  defaultOpen={true}
                >
                  <StyleGrid
                    items={FINDER_OUTER_STYLES}
                    selected={selectedFinderOuter}
                    onSelect={setSelectedFinderOuter}
                    label="Outer corners of finder patterns"
                  />
                </AccordionSection>

                {/* Finder Inner Pattern */}
                <AccordionSection
                  title="Finder Inner Pattern"
                  icon={Maximize2}
                  defaultOpen={false}
                >
                  <StyleGrid
                    items={FINDER_INNER_STYLES}
                    selected={selectedFinderInner}
                    onSelect={setSelectedFinderInner}
                    label="Inner eye of finder patterns"
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

                      {/* Gradient */}
                      <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={gradientEnabled}
                            onChange={(e) => setGradientEnabled(e.target.checked)}
                            className="w-4 h-4 accent-purple-600"
                          />
                          <span className="text-sm font-medium">Gradient</span>
                        </label>
                        {gradientEnabled && (
                          <div className="space-y-3 mt-3">
                            <div className="flex gap-2">
                              <ColorPicker
                                color={gradientFrom}
                                onChange={setGradientFrom}
                                label="From"
                              />
                              <ColorPicker
                                color={gradientTo}
                                onChange={setGradientTo}
                                label="To"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-2">
                                Type
                              </label>
                              <select
                                value={gradientType}
                                onChange={(e) => setGradientType(e.target.value)}
                                className={`w-full px-3 py-2 rounded-lg border ${
                                  isDarkMode
                                    ? "bg-gray-700 border-gray-600 text-white"
                                    : "bg-white border-gray-200"
                                }`}
                              >
                                <option value="linear">Linear</option>
                                <option value="radial">Radial</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-2">
                                Rotation ({gradientRotation}°)
                              </label>
                              <input
                                type="range"
                                min="0"
                                max="360"
                                step="5"
                                value={gradientRotation}
                                onChange={(e) =>
                                  setGradientRotation(Number(e.target.value))
                                }
                                className="w-full accent-purple-600"
                              />
                            </div>
                          </div>
                        )}
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
                        onChange={(e) =>
                          setErrorCorrectionLevel(e.target.value)
                        }
                        className={`w-full px-3 py-2 rounded-lg border-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                          isDarkMode
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        <option value="L">Low (7%) - Maximum data</option>
                        <option value="M">Medium (15%) - Balanced</option>
                        <option value="Q">
                          Quartile (25%) - Recommended
                        </option>
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

                {/* Image Settings (with Upload + Background Removal) */}
                <AccordionSection
                  title="Image Settings"
                  icon={ImageIcon}
                  defaultOpen={false}
                >
                  <ImageSettingsEditor
                    includeImage={includeImage}
                    setIncludeImage={setIncludeImage}
                    imageUrl={imageUrl}
                    setImageUrl={setImageUrl}
                    excavate={excavate}
                    setExcavate={setExcavate}
                    imageWidth={imageWidth}
                    setImageWidth={setImageWidth}
                    imageHeight={imageHeight}
                    setImageHeight={setImageHeight}
                    imageOpacity={imageOpacity}
                    setImageOpacity={setImageOpacity}
                    centerImage={centerImage}
                    setCenterImage={setCenterImage}
                    imageX={imageX}
                    setImageX={setImageX}
                    imageY={imageY}
                    setImageY={setImageY}
                    isDarkMode={isDarkMode}
                  />
                </AccordionSection>
              </div>
            </motion.div>
          </div>

          {/* Right Panel – Live Preview */}
          <div className="lg:sticky lg:top-24 h-fit">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`p-8 rounded-2xl shadow-xl ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold">Live QR Preview</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {MODULE_STYLES.find((m) => m.id === selectedModuleStyle)
                    ?.name || selectedModuleStyle}{" "}
                  • {qrSize}px
                </p>
              </div>

              <div className="flex items-center justify-center w-full overflow-hidden">
                <motion.div
                  key={`${selectedModuleStyle}-${foregroundColor}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl p-2 sm:p-4 shadow-inner w-full overflow-hidden"
                >
                  <div
                    className="flex items-center justify-center w-full overflow-hidden"
                    style={{ minHeight: `${Math.min(qrSize, 260)}px` }}
                  >
                    <ReactQRCode
                      ref={qrRef}
                      value={qrContent || " "}
                      size={qrSize}
                      marginSize={margin}
                      level={errorCorrectionLevel}
                      background={
                        backgroundColor === "transparent"
                          ? undefined
                          : backgroundColor
                      }
                      dataModulesSettings={{
                        color: foregroundColor,
                        style: selectedModuleStyle,
                        size: 0.9,
                        lineWidth,
                      }}
                      finderPatternOuterSettings={{
                        color: foregroundColor,
                        style: selectedFinderOuter,
                      }}
                      finderPatternInnerSettings={{
                        color: foregroundColor,
                        style: selectedFinderInner,
                      }}
                      imageSettings={logoImageSettings}
                      gradient={
                        gradientEnabled
                          ? {
                              type: gradientType,
                              rotation: gradientRotation,
                              stops: [
                                { offset: "0%", color: gradientFrom },
                                { offset: "100%", color: gradientTo },
                              ],
                            }
                          : undefined
                      }
                      boostLevel
                    />
                  </div>
                </motion.div>
              </div>

              {/* Info panel */}
              <div className="mt-6 space-y-3">
                <div
                  className={`rounded-xl p-4 ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-50"
                  }`}
                >
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-xs text-gray-500">
                        Module Style
                      </span>
                      <p className="font-medium">
                        {MODULE_STYLES.find((m) => m.id === selectedModuleStyle)
                          ?.name || selectedModuleStyle}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">
                        Finder Outer
                      </span>
                      <p className="font-medium">
                        {FINDER_OUTER_STYLES.find(
                          (f) => f.id === selectedFinderOuter
                        )?.name || selectedFinderOuter}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">
                        Finder Inner
                      </span>
                      <p className="font-medium">
                        {FINDER_INNER_STYLES.find(
                          (f) => f.id === selectedFinderInner
                        )?.name || selectedFinderInner}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">
                        Error Correction
                      </span>
                      <p className="font-medium">
                        {errorCorrectionLevel === "H"
                          ? "High (30%)"
                          : errorCorrectionLevel === "Q"
                          ? "Quartile (25%)"
                          : errorCorrectionLevel === "M"
                          ? "Medium (15%)"
                          : "Low (7%)"}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 text-center">
                  {qrContent
                    ? "Ready to scan • Real-time preview"
                    : "Enter content to generate QR"}
                </p>
              </div>

              {/* Export size + Save */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <select
                  value={exportSize}
                  onChange={(e) => setExportSize(Number(e.target.value))}
                  aria-label="Export resolution"
                  className={`px-3 py-2 rounded-xl border text-sm flex-1 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <option value={512}>512px - Small</option>
                  <option value={1024}>1024px - Standard</option>
                  <option value={2048}>2048px - High Res</option>
                  <option value={4096}>4096px - Ultra HD</option>
                </select>
                <button
                  onClick={saveToHistory}
                  disabled={!qrContent}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors disabled:opacity-50 ${
                    isDarkMode
                      ? "border-gray-600 text-gray-200"
                      : "border-gray-300 text-gray-700"
                  }`}
                >
                  <Save className="w-4 h-4" /> Save to History
                </button>
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

        {/* QR History (localStorage only) */}
        <section className="mt-12">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <History className="w-6 h-6 text-purple-600" /> QR Code History
            </h2>
            <button
              onClick={clearHistory}
              disabled={history.length === 0}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium disabled:opacity-50 ${
                isDarkMode ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-700"
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
          </div>
          <p
            className={`mt-1 text-xs ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Saved only in your browser (localStorage). Nothing is uploaded to any
            server.
          </p>

          {history.length === 0 ? (
            <p
              className={`mt-4 text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              No saved QR codes yet. Download a QR code or use "Save to History"
              to add one.
            </p>
          ) : (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-2xl p-3 shadow-sm ${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <div className="flex items-center justify-center bg-white rounded-xl p-2">
                    <ReactQRCode
                      value={item.content || " "}
                      size={88}
                      marginSize={0}
                      level="Q"
                      dataModulesSettings={{ color: "#000000", style: "square" }}
                    />
                  </div>
                  <div className="mt-2">
                    <span className="text-xs font-semibold text-purple-600">
                      {item.label}
                    </span>
                    <p className="text-xs truncate mt-0.5">{item.content}</p>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => reuseHistoryItem(item)}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg bg-purple-500 text-white text-xs font-medium"
                    >
                      <RotateCw className="w-3 h-3" /> Reuse
                    </button>
                    <button
                      onClick={() => deleteHistoryItem(item.id)}
                      aria-label="Delete history item"
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-xs ${
                        isDarkMode ? "border-gray-600" : "border-gray-300"
                      }`}
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* How to Generate a QR Code */}
        <section className="mt-12">
          <h2 className="text-xl sm:text-2xl font-bold text-center bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            How to Generate a QR Code
          </h2>
          <div className="mt-6 grid sm:grid-cols-3 gap-6">
            <div
              className={`p-5 rounded-2xl shadow-sm ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h3 className="font-semibold text-purple-600">
                1. Add your content
              </h3>
              <p
                className={`mt-2 text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Type or paste the URL, text, or data you want to encode into
                the QR Code Content field above.
              </p>
            </div>
            <div
              className={`p-5 rounded-2xl shadow-sm ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h3 className="font-semibold text-purple-600">
                2. Customize your QR code
              </h3>
              <p
                className={`mt-2 text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Choose colors, shapes, and styling options so your generated QR
                code matches your brand or preference.
              </p>
            </div>
            <div
              className={`p-5 rounded-2xl shadow-sm ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h3 className="font-semibold text-purple-600">
                3. Download and share
              </h3>
              <p
                className={`mt-2 text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Download your ready QR code as PNG, SVG, WebP, or JPEG and use
                it anywhere you like.
              </p>
            </div>
          </div>
        </section>

        {/* What Can You Use a QR Code For? */}
        <section className="mt-12 text-center max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            What Can You Use a QR Code For?
          </h2>
          <p
            className={`mt-4 text-sm ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Use your free QR code to share a website link, hand out contact
            details, connect people to Wi-Fi, point to a product page, or link
            to your social profiles. A QR code generator turns plain text or a
            URL into a scannable code that anyone can open straight from their
            phone camera.
          </p>
        </section>
      </main>

      <footer
        className={`text-center py-6 text-sm ${
          isDarkMode ? "text-gray-500" : "text-gray-400"
        }`}
      >
        <p>&copy; 2026 Lokeswaran M. All rights reserved.</p>
        <p className="text-xs mt-1">
          All qr-code-styling types supported &bull; Square shape &bull; SVG output
        </p>
      </footer>

      {showScanner && (
        <QrScannerModal
          isDarkMode={isDarkMode}
          onClose={() => setShowScanner(false)}
          onResult={handleScannerResult}
        />
      )}
    </div>
  );
}

export default App;



// import React, { useState, useRef, useEffect, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import QRCodeStyling from "qr-code-styling";
// import { 
//   Download, 
//   QrCode, 
//   ChevronDown, 
//   Upload, 
//   Moon, 
//   Sun, 
//   Palette,
//   Type,
//   Grid3X3,
//   ScanEye,
//   Maximize2,
//   Check,
//   X,
//   Square,
//   Circle,
//   Disc,
//   Droplets,
//   Hexagon,
//   Image as ImageIcon,
//   Scissors,
//   Sliders,
//   RotateCw
// } from "lucide-react";

// // ==================== Reusable Components ====================

// const AccordionSection = ({ title, icon: Icon, children, defaultOpen = true }) => {
//   const [isOpen, setIsOpen] = useState(defaultOpen);
  
//   return (
//     <motion.div 
//       className="border border-gray-200 rounded-xl overflow-hidden bg-white"
//       initial={false}
//     >
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
//       >
//         <div className="flex items-center gap-3">
//           {Icon && <Icon className="w-5 h-5 text-purple-600" />}
//           <span className="font-semibold text-gray-800">{title}</span>
//         </div>
//         <motion.div
//           animate={{ rotate: isOpen ? 180 : 0 }}
//           transition={{ duration: 0.3 }}
//         >
//           <ChevronDown className="w-5 h-5 text-gray-500" />
//         </motion.div>
//       </button>
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ height: 0, opacity: 0 }}
//             animate={{ height: "auto", opacity: 1 }}
//             exit={{ height: 0, opacity: 0 }}
//             transition={{ duration: 0.3, ease: "easeInOut" }}
//             className="overflow-hidden"
//           >
//             <div className="px-4 pb-4 pt-2 border-t border-gray-100">
//               {children}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.div>
//   );
// };

// const StyleGrid = ({ items, selected, onSelect, label }) => {
//   return (
//     <div>
//       {label && (
//         <p className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wider">
//           {label}
//         </p>
//       )}
//       <div className="grid grid-cols-3 gap-3">
//         {items.map((item) => (
//           <motion.button
//             key={item.id}
//             whileHover={{ scale: 1.05, y: -2 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => onSelect(item.id)}
//             className={`
//               relative p-4 rounded-xl border-2 transition-all duration-300
//               flex flex-col items-center gap-2
//               ${selected === item.id 
//                 ? "border-purple-500 bg-purple-50 shadow-lg shadow-purple-200/50 ring-2 ring-purple-300 ring-opacity-30" 
//                 : "border-gray-200 hover:border-purple-300 bg-white hover:shadow-md"
//               }
//             `}
//           >
//             {selected === item.id && (
//               <motion.div
//                 initial={{ scale: 0 }}
//                 animate={{ scale: 1 }}
//                 className="absolute -top-2 -right-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center"
//               >
//                 <Check className="w-3 h-3 text-white" />
//               </motion.div>
//             )}
//             <div className="w-10 h-10 flex items-center justify-center text-gray-700">
//               {item.icon}
//             </div>
//             <span className="text-xs font-medium text-gray-700 text-center leading-tight">
//               {item.name}
//             </span>
//           </motion.button>
//         ))}
//       </div>
//     </div>
//   );
// };

// const ColorPicker = ({ color, onChange, label }) => {
//   return (
//     <div>
//       <label className="block text-xs font-medium text-gray-600 mb-2">
//         {label}
//       </label>
//       <div className="flex items-center gap-3">
//         <div className="relative group">
//           <input
//             type="color"
//             value={color}
//             onChange={(e) => onChange(e.target.value)}
//             className="w-12 h-12 rounded-xl cursor-pointer border-2 border-gray-200 shadow-sm opacity-0 absolute inset-0 z-10"
//           />
//           <div 
//             className="w-12 h-12 rounded-xl border-2 border-gray-200 shadow-sm cursor-pointer overflow-hidden group-hover:scale-105 transition-transform"
//             style={{ backgroundColor: color }}
//           >
//             <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
//           </div>
//         </div>
//         <input
//           type="text"
//           value={color}
//           onChange={(e) => onChange(e.target.value)}
//           className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
//           placeholder="#000000"
//         />
//       </div>
//     </div>
//   );
// };

// const IconButton = ({ icon: Icon, label, onClick, variant = "primary", className = "", disabled = false }) => {
//   const variants = {
//     primary: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-200 hover:shadow-xl hover:from-purple-700 hover:to-indigo-700",
//     secondary: "border-2 border-purple-200 text-purple-600 hover:bg-purple-50",
//     ghost: "bg-gray-100 text-gray-600 hover:bg-gray-200"
//   };

//   return (
//     <motion.button
//       whileHover={disabled ? {} : { scale: 1.02 }}
//       whileTap={disabled ? {} : { scale: 0.98 }}
//       onClick={onClick}
//       disabled={disabled}
//       className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
//         disabled ? 'opacity-50 cursor-not-allowed' : ''
//       } ${variants[variant]} ${className}`}
//     >
//       {Icon && <Icon className="w-4 h-4" />}
//       {label}
//     </motion.button>
//   );
// };

// // ==================== Style Configurations ====================

// const MODULE_STYLES = [
//   {
//     id: "square",
//     name: "Square Modules",
//     icon: <Square className="w-8 h-8" fill="none" />
//   },
//   {
//     id: "dots",
//     name: "Dots Modules",
//     icon: <Circle className="w-8 h-8" fill="none" />
//   },
//   {
//     id: "rounded",
//     name: "Rounded Modules",
//     icon: <Square className="w-8 h-8 rounded-md" fill="none" />
//   },
//   {
//     id: "classy",
//     name: "Classy Modules",
//     icon: <Disc className="w-8 h-8" fill="none" />
//   },
//   {
//     id: "classy-rounded",
//     name: "Classy Rounded",
//     icon: <Droplets className="w-8 h-8" fill="none" />
//   },
//   {
//     id: "extra-rounded",
//     name: "Extra Rounded",
//     icon: <Hexagon className="w-8 h-8" fill="none" />
//   }
// ];

// const FINDER_PATTERN_STYLES = [
//   {
//     id: "square",
//     name: "Square Corners",
//     icon: <Square className="w-10 h-10" fill="none" />
//   },
//   {
//     id: "dot",
//     name: "Dot Corners",
//     icon: <Circle className="w-10 h-10" fill="none" />
//   },
//   {
//     id: "rounded",
//     name: "Rounded Corners",
//     icon: <Square className="w-10 h-10 rounded-lg" fill="none" />
//   },
//   {
//     id: "extra-rounded",
//     name: "Extra Round",
//     icon: <Square className="w-10 h-10 rounded-2xl" fill="none" />
//   },
//   {
//     id: "dots",
//     name: "Dots Corners",
//     icon: <div className="w-10 h-10 grid grid-cols-2 gap-1">
//       <Circle className="w-full h-full" fill="none" />
//       <Circle className="w-full h-full" fill="none" />
//       <Circle className="w-full h-full" fill="none" />
//       <Circle className="w-full h-full" fill="none" />
//     </div>
//   },
//   {
//     id: "classy",
//     name: "Classy Corners",
//     icon: <Disc className="w-10 h-10" fill="none" />
//   },
//   {
//     id: "classy-rounded",
//     name: "Classy Round",
//     icon: <Droplets className="w-10 h-10" fill="none" />
//   }
// ];

// const CORNER_DOT_STYLES = [
//   {
//     id: "square",
//     name: "Square Dots",
//     icon: <Square className="w-6 h-6" fill="none" />
//   },
//   {
//     id: "dot",
//     name: "Round Dots",
//     icon: <Circle className="w-6 h-6" fill="none" />
//   },
//   {
//     id: "rounded",
//     name: "Rounded Dots",
//     icon: <Square className="w-6 h-6 rounded-md" fill="none" />
//   },
//   {
//     id: "dots",
//     name: "Dot Pattern",
//     icon: <div className="w-6 h-6 grid grid-cols-2 gap-0.5">
//       {[...Array(4)].map((_, i) => (
//         <Circle key={i} className="w-full h-full" fill="none" />
//       ))}
//     </div>
//   },
//   {
//     id: "classy",
//     name: "Classy Dots",
//     icon: <Disc className="w-6 h-6" fill="none" />
//   },
//   {
//     id: "classy-rounded",
//     name: "Classy Round",
//     icon: <Droplets className="w-6 h-6" fill="none" />
//   },
//   {
//     id: "extra-rounded",
//     name: "Extra Round",
//     icon: <Circle className="w-6 h-6 rounded-2xl" fill="none" />
//   }
// ];

// const SHAPE_OPTIONS = [
//   {
//     id: "square",
//     name: "Square Shape",
//     icon: <Square className="w-8 h-8" fill="none" />
//   },
//   {
//     id: "circle",
//     name: "Circle Shape",
//     icon: <Circle className="w-8 h-8" fill="none" />
//   }
// ];

// const OUTPUT_TYPES = [
//   {
//     id: "svg",
//     name: "SVG Vector",
//     icon: <Maximize2 className="w-8 h-8" />
//   },
//   {
//     id: "canvas",
//     name: "Canvas Bitmap",
//     icon: <Grid3X3 className="w-8 h-8" />
//   }
// ];

// // ==================== Logo Editor Component ====================

// const LogoEditor = ({ logoUrl, onLogoChange, onRemove, isDarkMode }) => {
//   const [showEditor, setShowEditor] = useState(false);
//   const [isRemovingBackground, setIsRemovingBackground] = useState(false);
//   const [logoSize, setLogoSize] = useState(0.4);
//   const [logoMargin, setLogoMargin] = useState(5);
//   const fileInputRef = useRef(null);

//   const removeBackground = useCallback(async (imageUrl) => {
//     setIsRemovingBackground(true);
    
//     try {
//       const { removeBackground } = await import('@imgly/background-removal');
      
//       const response = await fetch(imageUrl);
//       const blob = await response.blob();
      
//       const resultBlob = await removeBackground(blob, {
//         model: 'medium',
//         output: {
//           format: 'image/png',
//           quality: 0.8,
//         },
//       });
      
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         onLogoChange(reader.result, {
//           size: logoSize,
//           margin: logoMargin,
//           hideBackgroundDots: true
//         });
//         setIsRemovingBackground(false);
//       };
//       reader.onerror = () => {
//         setIsRemovingBackground(false);
//         alert('Failed to process image');
//       };
//       reader.readAsDataURL(resultBlob);
      
//     } catch (error) {
//       console.error('Background removal failed:', error);
//       setIsRemovingBackground(false);
//       alert('Background removal failed. Please try again.');
//     }
//   }, [logoSize, logoMargin, onLogoChange]);

//   const handleFileUpload = useCallback((event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         onLogoChange(e.target.result, {
//           size: logoSize,
//           margin: logoMargin,
//           hideBackgroundDots: true
//         });
//         setShowEditor(true);
//       };
//       reader.readAsDataURL(file);
//     }
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   }, [logoSize, logoMargin, onLogoChange]);

//   const updateLogoOptions = useCallback((newSize, newMargin) => {
//     setLogoSize(newSize);
//     setLogoMargin(newMargin);
//     if (logoUrl) {
//       onLogoChange(logoUrl, {
//         size: newSize,
//         margin: newMargin,
//         hideBackgroundDots: true
//       });
//     }
//   }, [logoUrl, onLogoChange]);

//   return (
//     <div className="space-y-4">
//       <input
//         ref={fileInputRef}
//         type="file"
//         accept="image/*"
//         onChange={handleFileUpload}
//         className="hidden"
//       />
      
//       {!logoUrl ? (
//         <motion.button
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           onClick={() => fileInputRef.current?.click()}
//           className={`w-full flex items-center justify-center gap-2 px-4 py-4 border-2 border-dashed rounded-xl transition-colors ${
//             isDarkMode 
//               ? 'border-gray-600 hover:border-purple-400 text-gray-400' 
//               : 'border-gray-300 hover:border-purple-400 text-gray-500'
//           }`}
//         >
//           <Upload className="w-5 h-5" />
//           <span className="text-sm font-medium">
//             Upload Logo Image
//           </span>
//         </motion.button>
//       ) : (
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="space-y-3"
//         >
//           <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
//             <div className="flex items-center gap-4">
//               <div className="w-16 h-16 rounded-lg overflow-hidden bg-white flex items-center justify-center border-2 border-gray-200">
//                 <img 
//                   src={logoUrl} 
//                   alt="Logo preview" 
//                   className="max-w-full max-h-full object-contain"
//                 />
//               </div>
//               <div className="flex-1">
//                 <p className="text-sm font-medium">Logo Active</p>
//                 <p className="text-xs text-gray-500">Size: {Math.round(logoSize * 100)}%</p>
//               </div>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={onRemove}
//                 className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
//               >
//                 <X className="w-4 h-4" />
//               </motion.button>
//             </div>
//           </div>

//           <motion.button
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             onClick={() => setShowEditor(!showEditor)}
//             className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
//               isDarkMode 
//                 ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
//                 : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
//             }`}
//           >
//             <Sliders className="w-4 h-4" />
//             {showEditor ? 'Hide Editor' : 'Edit Logo'}
//           </motion.button>

//           <AnimatePresence>
//             {showEditor && (
//               <motion.div
//                 initial={{ height: 0, opacity: 0 }}
//                 animate={{ height: 'auto', opacity: 1 }}
//                 exit={{ height: 0, opacity: 0 }}
//                 transition={{ duration: 0.3 }}
//                 className="overflow-hidden"
//               >
//                 <div className={`p-4 rounded-xl space-y-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
//                   <div>
//                     <motion.button
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                       onClick={() => removeBackground(logoUrl)}
//                       disabled={isRemovingBackground}
//                       className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
//                         isRemovingBackground
//                           ? 'bg-gray-300 cursor-not-allowed'
//                           : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg'
//                       }`}
//                     >
//                       {isRemovingBackground ? (
//                         <>
//                           <RotateCw className="w-4 h-4 animate-spin" />
//                           Removing Background...
//                         </>
//                       ) : (
//                         <>
//                           <Scissors className="w-4 h-4" />
//                           Remove Background
//                         </>
//                       )}
//                     </motion.button>
//                     <p className="text-xs text-gray-500 mt-1 text-center">
//                       Uses AI to automatically remove background
//                     </p>
//                   </div>

//                   <div>
//                     <label className="block text-xs font-medium text-gray-500 mb-2">
//                       Logo Size: {Math.round(logoSize * 100)}%
//                     </label>
//                     <input
//                       type="range"
//                       min="0.1"
//                       max="0.6"
//                       step="0.05"
//                       value={logoSize}
//                       onChange={(e) => updateLogoOptions(parseFloat(e.target.value), logoMargin)}
//                       className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
//                     />
//                     <div className="flex justify-between text-xs text-gray-400 mt-1">
//                       <span>10%</span>
//                       <span>60%</span>
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-xs font-medium text-gray-500 mb-2">
//                       Logo Margin: {logoMargin}px
//                     </label>
//                     <input
//                       type="range"
//                       min="0"
//                       max="20"
//                       step="1"
//                       value={logoMargin}
//                       onChange={(e) => updateLogoOptions(logoSize, parseInt(e.target.value))}
//                       className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
//                     />
//                     <div className="flex justify-between text-xs text-gray-400 mt-1">
//                       <span>0px</span>
//                       <span>20px</span>
//                     </div>
//                   </div>

//                   <motion.button
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                     onClick={() => fileInputRef.current?.click()}
//                     className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
//                       isDarkMode 
//                         ? 'bg-gray-600 hover:bg-gray-500 text-gray-200' 
//                         : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300'
//                     }`}
//                   >
//                     <ImageIcon className="w-4 h-4" />
//                     Change Logo
//                   </motion.button>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </motion.div>
//       )}
//     </div>
//   );
// };

// // ==================== Main App Component ====================

// function App() {
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [qrContent, setQrContent] = useState("https://example.com");
//   const [selectedModuleStyle, setSelectedModuleStyle] = useState("square");
//   const [selectedFinderStyle, setSelectedFinderStyle] = useState("square");
//   const [selectedCornerDot, setSelectedCornerDot] = useState("square");
//   const [selectedShape, setSelectedShape] = useState("square");
//   const [selectedOutputType, setSelectedOutputType] = useState("svg");
//   const [foregroundColor, setForegroundColor] = useState("#000000");
//   const [backgroundColor, setBackgroundColor] = useState("#ffffff");
//   const [logoUrl, setLogoUrl] = useState(null);
//   const [logoOptions, setLogoOptions] = useState({
//     size: 0.4,
//     margin: 5,
//     hideBackgroundDots: true
//   });
//   const [qrSize, setQrSize] = useState(300);
//   const [errorCorrectionLevel, setErrorCorrectionLevel] = useState("H");
//   const [margin, setMargin] = useState(0);
  
//   const qrCodeRef = useRef(null);
//   const qrContainerRef = useRef(null);

//   useEffect(() => {
//     if (!qrCodeRef.current) {
//       qrCodeRef.current = new QRCodeStyling({
//         width: qrSize,
//         height: qrSize,
//         type: selectedOutputType,
//         data: qrContent || " ",
//         image: logoUrl || undefined,
//         shape: selectedShape,
//         margin: margin,
//         dotsOptions: {
//           color: foregroundColor,
//           type: selectedModuleStyle
//         },
//         cornersSquareOptions: {
//           color: foregroundColor,
//           type: selectedFinderStyle
//         },
//         cornersDotOptions: {
//           color: foregroundColor,
//           type: selectedCornerDot
//         },
//         backgroundOptions: {
//           color: backgroundColor,
//         },
//         qrOptions: {
//           errorCorrectionLevel: errorCorrectionLevel,
//         },
//         imageOptions: {
//           crossOrigin: "anonymous",
//           margin: logoOptions.margin,
//           imageSize: logoOptions.size,
//           hideBackgroundDots: logoOptions.hideBackgroundDots
//         }
//       });
//     }
    
//     return () => {
//       qrCodeRef.current = null;
//     };
//   }, []);

//   useEffect(() => {
//     const qrCode = qrCodeRef.current;
//     if (!qrCode || !qrContainerRef.current) return;

//     const options = {
//       width: qrSize,
//       height: qrSize,
//       type: selectedOutputType,
//       data: qrContent || " ",
//       image: logoUrl || undefined,
//       shape: selectedShape,
//       margin: margin,
//       dotsOptions: {
//         color: foregroundColor,
//         type: selectedModuleStyle,
//       },
//       cornersSquareOptions: {
//         color: foregroundColor,
//         type: selectedFinderStyle
//       },
//       cornersDotOptions: {
//         color: foregroundColor,
//         type: selectedCornerDot
//       },
//       backgroundOptions: {
//         color: backgroundColor,
//       },
//       qrOptions: {
//         errorCorrectionLevel: errorCorrectionLevel,
//       },
//       imageOptions: {
//         crossOrigin: "anonymous",
//         margin: logoOptions.margin,
//         imageSize: logoOptions.size,
//         hideBackgroundDots: logoOptions.hideBackgroundDots
//       }
//     };

//     qrCode.update(options);
    
//     if (qrContainerRef.current) {
//       qrContainerRef.current.innerHTML = '';
//       qrCode.append(qrContainerRef.current);
//     }
//   }, [
//     qrContent, 
//     selectedModuleStyle, 
//     selectedFinderStyle, 
//     selectedCornerDot,
//     selectedShape,
//     selectedOutputType,
//     foregroundColor, 
//     backgroundColor, 
//     logoUrl,
//     logoOptions,
//     qrSize,
//     errorCorrectionLevel,
//     margin
//   ]);

//   const handleLogoChange = useCallback((url, options) => {
//     setLogoUrl(url);
//     if (options) {
//       setLogoOptions(options);
//     }
//   }, []);

//   const handleLogoRemove = useCallback(() => {
//     setLogoUrl(null);
//     setLogoOptions({
//       size: 0.4,
//       margin: 5,
//       hideBackgroundDots: true
//     });
//   }, []);

//   const handleDownloadPNG = useCallback(() => {
//     const qrCode = qrCodeRef.current;
//     if (qrCode && qrContent) {
//       qrCode.download({
//         extension: "png",
//         name: `qr-code-${Date.now()}`
//       });
//     }
//   }, [qrContent]);

//   const handleDownloadSVG = useCallback(() => {
//     const qrCode = qrCodeRef.current;
//     if (qrCode && qrContent) {
//       qrCode.download({
//         extension: "svg",
//         name: `qr-code-${Date.now()}`
//       });
//     }
//   }, [qrContent]);

//   const handleDownloadWebP = useCallback(() => {
//     const qrCode = qrCodeRef.current;
//     if (qrCode && qrContent) {
//       qrCode.download({
//         extension: "webp",
//         name: `qr-code-${Date.now()}`
//       });
//     }
//   }, [qrContent]);

//   const handleDownloadJPEG = useCallback(() => {
//     const qrCode = qrCodeRef.current;
//     if (qrCode && qrContent) {
//       qrCode.download({
//         extension: "jpeg",
//         name: `qr-code-${Date.now()}`
//       });
//     }
//   }, [qrContent]);

//   return (
//     <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
//       {/* Header */}
//       <header className={`sticky top-0 z-40 backdrop-blur-sm border-b ${isDarkMode ? 'bg-gray-900/90 border-gray-800' : 'bg-white/90 border-gray-200'}`}>
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
//                 <QrCode className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
//                   QR Studio Pro
//                 </h1>
//                 <p className="text-xs text-gray-500">Professional QR Code Generator</p>
//               </div>
//             </div>
            
//             <div className="flex items-center gap-3">
//               <IconButton
//                 icon={isDarkMode ? Sun : Moon}
//                 onClick={() => setIsDarkMode(!isDarkMode)}
//                 variant="ghost"
//               />
              
//               <div className="hidden sm:flex gap-2">
//                 <IconButton
//                   icon={Download}
//                   label="PNG"
//                   onClick={handleDownloadPNG}
//                   variant="primary"
//                   disabled={!qrContent}
//                 />
//                 <IconButton
//                   icon={Download}
//                   label="SVG"
//                   onClick={handleDownloadSVG}
//                   variant="secondary"
//                   disabled={!qrContent}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
//         <div className="grid lg:grid-cols-2 gap-8">
//           {/* Left Panel - Customization Controls */}
//           <div className="space-y-6">
//             {/* Content Input */}
//             <motion.div 
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className={`p-6 rounded-2xl shadow-sm ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
//             >
//               <div className="flex items-center gap-2 mb-4">
//                 <Type className="w-5 h-5 text-purple-600" />
//                 <h2 className="font-semibold text-lg">QR Code Content</h2>
//               </div>
//               <textarea
//                 value={qrContent}
//                 onChange={(e) => setQrContent(e.target.value)}
//                 placeholder="Enter URL, text, or data to encode..."
//                 rows={3}
//                 className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all resize-none ${
//                   isDarkMode 
//                     ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
//                     : 'bg-white border-gray-200 placeholder-gray-400'
//                 }`}
//               />
//               <p className="mt-2 text-xs text-gray-500">
//                 Your data will be encoded with {errorCorrectionLevel === "H" ? "High (30%)" : 
//                   errorCorrectionLevel === "Q" ? "Quartile (25%)" : 
//                   errorCorrectionLevel === "M" ? "Medium (15%)" : "Low (7%)"} 
//                 {' '}error correction
//               </p>
//             </motion.div>

//             {/* Customization Panel */}
//             <motion.div 
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.1 }}
//               className={`p-6 rounded-2xl shadow-sm ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
//             >
//               <div className="flex items-center gap-2 mb-6">
//                 <Palette className="w-5 h-5 text-purple-600" />
//                 <h2 className="font-semibold text-lg">Customise How It Looks</h2>
//               </div>

//               <div className="space-y-4">
//                 {/* QR Shape Selection */}
//                 <AccordionSection 
//                   title="QR Code Shape" 
//                   icon={Maximize2}
//                   defaultOpen={true}
//                 >
//                   <p className="text-xs text-gray-500 mb-3">
//                     Choose the overall shape of your QR code (circle adds random extra dots)
//                   </p>
//                   <StyleGrid
//                     items={SHAPE_OPTIONS}
//                     selected={selectedShape}
//                     onSelect={setSelectedShape}
//                   />
//                 </AccordionSection>

//                 {/* Output Type Selection */}
//                 <AccordionSection 
//                   title="Output Type" 
//                   icon={ScanEye}
//                   defaultOpen={true}
//                 >
//                   <p className="text-xs text-gray-500 mb-3">
//                     SVG is vector (scalable), Canvas is bitmap (pixel-based)
//                   </p>
//                   <StyleGrid
//                     items={OUTPUT_TYPES}
//                     selected={selectedOutputType}
//                     onSelect={setSelectedOutputType}
//                   />
//                 </AccordionSection>

//                 {/* Module Styles */}
//                 <AccordionSection 
//                   title="Data Module Styles" 
//                   icon={Grid3X3}
//                   defaultOpen={true}
//                 >
//                   <p className="text-xs text-gray-500 mb-3">
//                     Choose the shape of individual data modules
//                   </p>
//                   <StyleGrid
//                     items={MODULE_STYLES}
//                     selected={selectedModuleStyle}
//                     onSelect={setSelectedModuleStyle}
//                   />
//                 </AccordionSection>

//                 {/* Finder Pattern Styles */}
//                 <AccordionSection 
//                   title="Finder Pattern Styles" 
//                   icon={ScanEye}
//                   defaultOpen={true}
//                 >
//                   <p className="text-xs text-gray-500 mb-3">
//                     Customize position detection patterns
//                   </p>
//                   <StyleGrid
//                     items={FINDER_PATTERN_STYLES}
//                     selected={selectedFinderStyle}
//                     onSelect={setSelectedFinderStyle}
//                   />
//                 </AccordionSection>

//                 {/* Corner Dot Styles */}
//                 <AccordionSection 
//                   title="Corner Dot Styles" 
//                   icon={Maximize2}
//                   defaultOpen={false}
//                 >
//                   <p className="text-xs text-gray-500 mb-3">
//                     All available styles for corner dots
//                   </p>
//                   <StyleGrid
//                     items={CORNER_DOT_STYLES}
//                     selected={selectedCornerDot}
//                     onSelect={setSelectedCornerDot}
//                   />
//                 </AccordionSection>

//                 {/* Colors */}
//                 <AccordionSection 
//                   title="Colors" 
//                   icon={Palette}
//                   defaultOpen={true}
//                 >
//                   <div className="space-y-4">
//                     <ColorPicker
//                       color={foregroundColor}
//                       onChange={setForegroundColor}
//                       label="Module Foreground Color"
//                     />
//                     <ColorPicker
//                       color={backgroundColor}
//                       onChange={setBackgroundColor}
//                       label="Background Color"
//                     />
//                     <div className="flex items-center gap-3 pt-2">
//                       <button
//                         onClick={() => setBackgroundColor("transparent")}
//                         className="text-xs px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-50"
//                       >
//                         Make Transparent
//                       </button>
//                     </div>
//                   </div>
//                 </AccordionSection>

//                 {/* Advanced Settings */}
//                 <AccordionSection 
//                   title="Advanced Settings" 
//                   icon={Maximize2}
//                   defaultOpen={false}
//                 >
//                   <div className="space-y-4">
//                     <div>
//                       <label className="block text-xs font-medium text-gray-600 mb-2">
//                         Error Correction Level
//                       </label>
//                       <select
//                         value={errorCorrectionLevel}
//                         onChange={(e) => setErrorCorrectionLevel(e.target.value)}
//                         className={`w-full px-3 py-2 rounded-lg border-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
//                           isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'
//                         }`}
//                       >
//                         <option value="L">Low (7%) - Maximum data</option>
//                         <option value="M">Medium (15%) - Balanced</option>
//                         <option value="Q">Quartile (25%) - Recommended</option>
//                         <option value="H">High (30%) - Best for logos</option>
//                       </select>
//                     </div>
                    
//                     <div>
//                       <label className="block text-xs font-medium text-gray-600 mb-2">
//                         QR Size: {qrSize}px
//                       </label>
//                       <input
//                         type="range"
//                         min="200"
//                         max="500"
//                         step="20"
//                         value={qrSize}
//                         onChange={(e) => setQrSize(Number(e.target.value))}
//                         className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
//                       />
//                       <div className="flex justify-between text-xs text-gray-400 mt-1">
//                         <span>200px</span>
//                         <span>500px</span>
//                       </div>
//                     </div>

//                     <div>
//                       <label className="block text-xs font-medium text-gray-600 mb-2">
//                         Margin: {margin}px
//                       </label>
//                       <input
//                         type="range"
//                         min="0"
//                         max="50"
//                         step="5"
//                         value={margin}
//                         onChange={(e) => setMargin(Number(e.target.value))}
//                         className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
//                       />
//                       <div className="flex justify-between text-xs text-gray-400 mt-1">
//                         <span>0px</span>
//                         <span>50px</span>
//                       </div>
//                     </div>
//                   </div>
//                 </AccordionSection>

//                 {/* Logo Upload Section */}
//                 <AccordionSection 
//                   title="Center Logo" 
//                   icon={Upload}
//                   defaultOpen={false}
//                 >
//                   <LogoEditor
//                     logoUrl={logoUrl}
//                     onLogoChange={handleLogoChange}
//                     onRemove={handleLogoRemove}
//                     isDarkMode={isDarkMode}
//                   />
//                   <p className="text-xs text-gray-400 mt-3">
//                     Add a logo to the center of your QR code • Background removal available
//                   </p>
//                 </AccordionSection>
//               </div>
//             </motion.div>
//           </div>

//           {/* Right Panel - Live Preview */}
//           <div className="lg:sticky lg:top-24 h-fit">
//             <motion.div 
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.2 }}
//               className={`p-8 rounded-2xl shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
//             >
//               <div className="text-center mb-6">
//                 <h2 className="text-xl font-semibold">Live QR Preview</h2>
//                 <p className="text-sm text-gray-500 mt-1">
//                   {selectedShape === "circle" ? "Circle" : "Square"} • {' '}
//                   {MODULE_STYLES.find(m => m.id === selectedModuleStyle)?.name} • {' '}
//                   {selectedOutputType.toUpperCase()}
//                 </p>
//               </div>
              
//               <div className="flex items-center justify-center w-full overflow-hidden">
//                 <motion.div 
//                   key={`${selectedModuleStyle}-${selectedShape}-${foregroundColor}`}
//                   initial={{ opacity: 0, scale: 0.9 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ duration: 0.3 }}
// className="bg-white rounded-2xl p-2 sm:p-4 shadow-inner w-full overflow-hidden"                >
//                  <div
//   ref={qrContainerRef}
//   className="flex items-center justify-center w-full overflow-hidden"
//   style={{
//     minHeight: `${Math.min(qrSize, 260)}px`,
//     width: '100%',
//   }}
// />
//                 </motion.div>
//               </div>
              
//               <div className="mt-6 space-y-3">
//                 <div className={`rounded-xl p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
//                   <div className="grid grid-cols-2 gap-3 text-sm">
//                     <div>
//                       <span className="text-xs text-gray-500">Module Style</span>
//                       <p className="font-medium">
//                         {MODULE_STYLES.find(m => m.id === selectedModuleStyle)?.name}
//                       </p>
//                     </div>
//                     <div>
//                       <span className="text-xs text-gray-500">Finder Pattern</span>
//                       <p className="font-medium">
//                         {FINDER_PATTERN_STYLES.find(f => f.id === selectedFinderStyle)?.name}
//                       </p>
//                     </div>
//                     <div>
//                       <span className="text-xs text-gray-500">Error Correction</span>
//                       <p className="font-medium">
//                         {errorCorrectionLevel === "H" ? "High (30%)" : 
//                          errorCorrectionLevel === "Q" ? "Quartile (25%)" : 
//                          errorCorrectionLevel === "M" ? "Medium (15%)" : "Low (7%)"}
//                       </p>
//                     </div>
//                     <div>
//                       <span className="text-xs text-gray-500">Size & Shape</span>
//                       <p className="font-medium">{qrSize}px • {selectedShape}</p>
//                     </div>
//                   </div>
//                 </div>
                
//                 <p className="text-xs text-gray-400 text-center">
//                   {qrContent ? "Ready to scan • Real-time preview" : "⚠️ Enter content to generate QR"}
//                 </p>
//               </div>
              
//               <div className="mt-6 grid grid-cols-2 gap-3">
//                 <IconButton
//                   icon={Download}
//                   label="PNG"
//                   onClick={handleDownloadPNG}
//                   variant="primary"
//                   disabled={!qrContent}
//                 />
//                 <IconButton
//                   icon={Download}
//                   label="SVG"
//                   onClick={handleDownloadSVG}
//                   variant="secondary"
//                   disabled={!qrContent}
//                 />
//                 <IconButton
//                   icon={Download}
//                   label="WebP"
//                   onClick={handleDownloadWebP}
//                   variant="secondary"
//                   disabled={!qrContent}
//                 />
//                 <IconButton
//                   icon={Download}
//                   label="JPEG"
//                   onClick={handleDownloadJPEG}
//                   variant="secondary"
//                   disabled={!qrContent}
//                 />
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </main>
// <footer
//   className={`text-center py-6 text-sm ${
//     isDarkMode ? 'text-gray-500' : 'text-gray-400'
//   }`}
// >
//   <p>© 2026 Lokeswaran M. All rights reserved.</p>

//   <p className="text-xs mt-1">
//     All qr-code-styling types supported • Square/Circle shapes • SVG/Canvas output
//   </p>
// </footer>
//     </div>
//   );
// }

// export default App;


"use client";
import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { trpc } from "@/lib/trpc/react";
import { toPng } from "html-to-image";
import { useParams, useRouter } from "next/navigation";

// Arabic fonts available
const ARABIC_FONTS = [
  { label: "طجوال (عصري)", value: "Tajawal" },
  { label: "نسخ قرآني", value: "Noto Naskh Arabic" },
  { label: "شهرزاد", value: "Scheherazade New" },
  { label: "أميري", value: "Amiri" },
];

export default function CardEditorPage() {
  const params = useParams();
  const router = useRouter();
  const cardId = Number(params.id);
  const canvasRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState("");
  const [color, setColor] = useState("#FFFFFF");
  const [fontSize, setFontSize] = useState(48);
  const [posX, setPosX] = useState(50);
  const [posY, setPosY] = useState(50);
  const [fontFamily, setFontFamily] = useState("Tajawal");
  const [textAlign, setTextAlign] = useState<"right" | "center" | "left">("center");
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, posX: 50, posY: 50 });

  const { data: cardData, isLoading } = trpc.cards.getById.useQuery({ id: cardId });
  const recordDownload = trpc.cards.recordDownload.useMutation();

  // Initialize from card defaults
  const card = cardData?.cards;
  const hasInit = useRef(false);
  if (card && !hasInit.current) {
    hasInit.current = true;
    setColor(card.defaultColor);
    setFontSize(card.defaultFontSize);
    setPosX(card.defaultPositionX);
    setPosY(card.defaultPositionY);
    setFontFamily(card.defaultFontFamily);
    setTextAlign(card.defaultTextAlign as "right" | "center" | "left");
  }

  // Drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY, posX, posY });
  }, [posX, posY]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const dx = ((e.clientX - dragStart.x) / rect.width) * 100;
    const dy = ((e.clientY - dragStart.y) / rect.height) * 100;
    setPosX(Math.max(5, Math.min(95, dragStart.posX + dx)));
    setPosY(Math.max(5, Math.min(95, dragStart.posY + dy)));
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  // Touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: touch.clientX, y: touch.clientY, posX, posY });
  }, [posX, posY]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || !canvasRef.current) return;
    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    const dx = ((touch.clientX - dragStart.x) / rect.width) * 100;
    const dy = ((touch.clientY - dragStart.y) / rect.height) * 100;
    setPosX(Math.max(5, Math.min(95, dragStart.posX + dx)));
    setPosY(Math.max(5, Math.min(95, dragStart.posY + dy)));
  }, [isDragging, dragStart]);

  // Download as PNG 4K
  const handleDownload = async () => {
    if (!canvasRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = canvasRef.current;
      const dataUrl = await toPng(canvas, {
        quality: 1,
        pixelRatio: 4, // 4K quality
        cacheBust: true,
        width: canvas.clientWidth,
        height: canvas.clientHeight,
        style: {
          transform: "none",
          transformOrigin: "center",
          margin: "0"
        }
      });

      const link = document.createElement("a");
      link.download = `تهنئة-${name || "من-جمعية-تآزر"}.png`;
      link.href = dataUrl;
      link.click();

      // Record download
      await recordDownload.mutateAsync({
        cardId,
        userName: name || undefined,
      });
    } catch (err) {
      console.error("Download error:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background:'#F9F7F2'}}>
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-4 border-green-500 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-gray-600">جاري تحميل البطاقة...</p>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{background:'#F9F7F2'}}>
        <div className="text-6xl">😕</div>
        <h1 className="text-2xl font-bold text-gray-800">البطاقة غير موجودة</h1>
        <Link href="/cards" className="btn-primary">العودة للبطاقات</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{background:'#F4F6F8'}}>
      {/* Header */}
      <header className="fixed top-0 right-0 left-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/cards" className="flex items-center gap-2 text-gray-600 hover:text-green-700 transition-colors">
            <span>→</span>
            <span className="text-sm font-medium">العودة للبطاقات</span>
          </Link>
          <h1 className="font-bold text-gray-800">محرر البطاقات</h1>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="btn-gold text-sm px-5 py-2.5 gap-2 disabled:opacity-60"
          >
            {isDownloading ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                <span>جاري التحميل...</span>
              </>
            ) : (
              <>
                <span>📥</span>
                <span>تحميل PNG 4K</span>
              </>
            )}
          </button>
        </div>
      </header>

      <div className="pt-20 max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Name input */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm"
                      style={{background:'#0F6B3F'}}>✍️</span>
                <span>الاسم على البطاقة</span>
              </h2>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="اكتب الاسم هنا..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-right text-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                dir="rtl"
                style={{fontFamily}}
                maxLength={50}
              />
              <p className="text-xs text-gray-400 mt-2 text-left">{name.length}/50</p>
            </div>

            {/* Font family */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm"
                      style={{background:'#0F6B3F'}}>🔤</span>
                <span>نوع الخط</span>
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {ARABIC_FONTS.map((font) => (
                  <button
                    key={font.value}
                    onClick={() => setFontFamily(font.value)}
                    className={`p-3 rounded-xl text-sm transition-all border-2 ${
                      fontFamily === font.value
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-100 hover:border-gray-300"
                    }`}
                    style={{fontFamily: font.value}}
                  >
                    {font.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm"
                      style={{background:'#0F6B3F'}}>🎨</span>
                <span>لون النص</span>
              </h2>
              <div className="flex items-center gap-3 flex-wrap">
                {["#FFFFFF","#D4AF37","#0F6B3F","#000000","#FF6B6B","#4ECDC4","#45B7D1"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-10 h-10 rounded-full border-4 transition-transform hover:scale-110 ${color === c ? 'scale-110 border-gray-400' : 'border-gray-200'}`}
                    style={{background: c, boxShadow: color === c ? '0 0 0 2px white, 0 0 0 4px gray' : 'none'}}
                  />
                ))}
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-10 h-10 rounded-full border-2 border-gray-200 cursor-pointer overflow-hidden"
                  title="اختر لوناً مخصصاً"
                />
              </div>
            </div>

            {/* Font size */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm"
                      style={{background:'#0F6B3F'}}>↕️</span>
                <span>حجم الخط: {fontSize}px</span>
              </h2>
              <input
                type="range"
                min={20}
                max={120}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full accent-green-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>120px</span>
                <span>20px</span>
              </div>
            </div>

            {/* Text alignment */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm"
                      style={{background:'#0F6B3F'}}>☰</span>
                <span>محاذاة النص</span>
              </h2>
              <div className="flex gap-2">
                {(["right","center","left"] as const).map((align) => (
                  <button
                    key={align}
                    onClick={() => setTextAlign(align)}
                    className={`flex-1 py-2 rounded-xl text-sm transition-all border-2 ${
                      textAlign === align
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-100 hover:border-gray-300"
                    }`}
                  >
                    {align === "right" ? "يميناً" : align === "center" ? "وسطاً" : "يساراً"}
                  </button>
                ))}
              </div>
            </div>

            {/* Position hint */}
            <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
              <p className="text-green-700 text-sm text-center">
                💡 اسحب النص على البطاقة لتغيير موضعه
              </p>
            </div>
          </div>

          {/* Preview Canvas */}
          <div className="lg:col-span-3">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-bold text-gray-800 mb-4 text-center">معاينة البطاقة</h2>
                <div
                  ref={canvasRef}
                  className="editor-canvas relative w-full mx-auto overflow-hidden rounded-2xl"
                  style={{ maxWidth: "500px", aspectRatio: "3/4" }}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleMouseUp}
                >
                  <img
                    src={card.imageUrl}
                    alt={card.titleAr}
                    className="absolute inset-0 w-full h-full object-cover select-none"
                    crossOrigin="anonymous"
                    draggable={false}
                  />
                  {/* Text overlay */}
                  {name && (
                    <div
                      ref={textRef}
                      className="editor-text-overlay select-none"
                      style={{
                        right: `${posX}%`,
                        top: `${posY}%`,
                        transform: `translate(50%, -50%)`,
                        color: color,
                        fontSize: `${fontSize}px`,
                        fontFamily: fontFamily,
                        textAlign: textAlign,
                        cursor: isDragging ? "grabbing" : "grab",
                        textShadow: "2px 2px 8px rgba(0,0,0,0.6), -1px -1px 4px rgba(0,0,0,0.4)",
                        fontWeight: "bold",
                        lineHeight: 1.3,
                        whiteSpace: "nowrap",
                        zIndex: 10,
                      }}
                      onMouseDown={handleMouseDown}
                      onTouchStart={handleTouchStart}
                    >
                      {name}
                    </div>
                  )}
                  {/* Empty state */}
                  {!name && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center p-6 rounded-xl glass">
                        <div className="text-4xl mb-2">✍️</div>
                        <p className="text-white text-sm">اكتب اسمك لرؤية المعاينة</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Download button */}
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={handleDownload}
                    disabled={isDownloading || !name}
                    className="flex-1 btn-gold py-4 text-lg gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDownloading ? (
                      <>
                        <span className="w-5 h-5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                        <span>جاري التحميل...</span>
                      </>
                    ) : (
                      <>
                        <span>📥</span>
                        <span>تحميل البطاقة PNG 4K</span>
                      </>
                    )}
                  </button>
                </div>
                {!name && (
                  <p className="text-center text-gray-400 text-sm mt-2">
                    أدخل اسمك أولاً لتفعيل التحميل
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

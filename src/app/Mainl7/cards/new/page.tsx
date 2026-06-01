"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { trpc } from "@/lib/trpc/react";

const ARABIC_FONTS = [
  "Tajawal", "Noto Naskh Arabic", "Scheherazade New", "Amiri"
];

export default function NewCardPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    titleAr: "", title: "", imageUrl: "", occasionId: 0,
    defaultColor: "#FFFFFF", defaultFontSize: 48,
    defaultPositionX: 50, defaultPositionY: 50,
    defaultFontFamily: "Tajawal", description: "", isFeatured: false,
  });
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: occasions } = trpc.occasions.getAll.useQuery();
  const createCard = trpc.cards.create.useMutation({
    onSuccess: () => router.push("/Mainl7/cards"),
  });

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        setForm((f) => ({ ...f, imageUrl: data.url }));
        setPreviewUrl(data.url);
      }
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.titleAr) errs.titleAr = "الاسم العربي مطلوب";
    if (!form.title) errs.title = "الاسم الإنجليزي مطلوب";
    if (!form.imageUrl) errs.imageUrl = "الصورة مطلوبة";
    if (!form.occasionId) errs.occasionId = "المناسبة مطلوبة";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await createCard.mutateAsync(form);
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
        >
          →
        </button>
        <div>
          <h1 className="text-2xl font-black text-gray-800">إضافة بطاقة جديدة</h1>
          <p className="text-gray-500 text-sm">أضف بطاقة تهنئة جديدة للمجموعة</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Form */}
        <div className="lg:col-span-3 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image upload */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-gray-800 mb-4">صورة البطاقة *</h2>
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                  errors.imageUrl ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-green-400 hover:bg-green-50"
                }`}
                onClick={() => fileRef.current?.click()}
              >
                {uploading ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-full border-3 border-green-500 border-t-transparent animate-spin" />
                    <p className="text-green-600">جاري الرفع...</p>
                  </div>
                ) : previewUrl ? (
                  <div className="relative w-32 h-44 mx-auto rounded-xl overflow-hidden shadow-md">
                    <Image src={previewUrl} alt="preview" fill className="object-cover" />
                  </div>
                ) : (
                  <div>
                    <div className="text-5xl mb-3">📸</div>
                    <p className="font-semibold text-gray-700">انقر لرفع الصورة</p>
                    <p className="text-sm text-gray-400 mt-1">PNG، JPG، WebP - حتى 5MB</p>
                  </div>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              />
              {errors.imageUrl && <p className="text-red-500 text-xs mt-2">{errors.imageUrl}</p>}
            </div>

            {/* Basic info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="font-bold text-gray-800 mb-2">المعلومات الأساسية</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">اسم البطاقة (عربي) *</label>
                <input
                  type="text"
                  value={form.titleAr}
                  onChange={(e) => setForm(f => ({ ...f, titleAr: e.target.value }))}
                  placeholder="مثال: بطاقة عيد الفطر 1"
                  className={`w-full border rounded-xl px-4 py-3 text-right focus:outline-none focus:ring-2 transition-all ${
                    errors.titleAr ? "border-red-300 focus:ring-red-100" : "border-gray-200 focus:border-green-500 focus:ring-green-100"
                  }`}
                  dir="rtl"
                />
                {errors.titleAr && <p className="text-red-500 text-xs mt-1">{errors.titleAr}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">اسم البطاقة (إنجليزي) *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Eid Al-Fitr Card 1"
                  className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all ${
                    errors.title ? "border-red-300 focus:ring-red-100" : "border-gray-200 focus:border-green-500 focus:ring-green-100"
                  }`}
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المناسبة *</label>
                <select
                  value={form.occasionId}
                  onChange={(e) => setForm(f => ({ ...f, occasionId: Number(e.target.value) }))}
                  className={`w-full border rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 transition-all ${
                    errors.occasionId ? "border-red-300 focus:ring-red-100" : "border-gray-200 focus:border-green-500 focus:ring-green-100"
                  }`}
                  dir="rtl"
                >
                  <option value={0}>اختر المناسبة</option>
                  {occasions?.map((occ) => (
                    <option key={occ.id} value={occ.id}>{occ.titleAr}</option>
                  ))}
                </select>
                {errors.occasionId && <p className="text-red-500 text-xs mt-1">{errors.occasionId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">وصف البطاقة (اختياري)</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-right focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all resize-none"
                  dir="rtl"
                  placeholder="وصف مختصر..."
                />
              </div>
            </div>

            {/* Text defaults */}
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="font-bold text-gray-800 mb-2">إعدادات النص الافتراضية</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">لون النص</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={form.defaultColor}
                      onChange={(e) => setForm(f => ({ ...f, defaultColor: e.target.value }))}
                      className="w-12 h-12 rounded-xl border border-gray-200 cursor-pointer"
                    />
                    <span className="text-sm text-gray-500 font-mono">{form.defaultColor}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">حجم الخط ({form.defaultFontSize}px)</label>
                  <input
                    type="range"
                    min={20}
                    max={120}
                    value={form.defaultFontSize}
                    onChange={(e) => setForm(f => ({ ...f, defaultFontSize: Number(e.target.value) }))}
                    className="w-full accent-green-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نوع الخط</label>
                <select
                  value={form.defaultFontFamily}
                  onChange={(e) => setForm(f => ({ ...f, defaultFontFamily: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  dir="rtl"
                >
                  {ARABIC_FONTS.map(f => (
                    <option key={f} value={f} style={{fontFamily: f}}>{f}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured"
                  checked={form.isFeatured}
                  onChange={(e) => setForm(f => ({ ...f, isFeatured: e.target.checked }))}
                  className="w-5 h-5 rounded accent-green-600"
                />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                  ⭐ بطاقة مميزة (تظهر في الصفحة الرئيسية)
                </label>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={createCard.isPending || uploading}
              className="w-full btn-primary py-4 text-lg gap-3 disabled:opacity-60"
            >
              {createCard.isPending ? (
                <>
                  <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <>
                  <span>💾</span>
                  <span>حفظ البطاقة</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Preview */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-4">معاينة</h2>
            {previewUrl ? (
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-lg">
                <Image src={previewUrl} alt="preview" fill className="object-cover" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    style={{
                      color: form.defaultColor,
                      fontSize: `${Math.min(form.defaultFontSize, 40)}px`,
                      fontFamily: form.defaultFontFamily,
                      fontWeight: "bold",
                      textShadow: "2px 2px 8px rgba(0,0,0,0.6)",
                      textAlign: "center",
                    }}
                  >
                    {form.titleAr || "النص هنا"}
                  </div>
                </div>
              </div>
            ) : (
              <div className="aspect-[3/4] rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="text-4xl mb-2">🖼️</div>
                  <p className="text-sm">ارفع صورة لرؤية المعاينة</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

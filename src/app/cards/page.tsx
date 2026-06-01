"use client";
import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/react";

const SORT_OPTIONS = [
  { value: "newest", label: "الأحدث" },
  { value: "most-downloaded", label: "الأكثر تحميلاً" },
  { value: "occasion", label: "حسب المناسبة" },
];

function CardsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedOccasion, setSelectedOccasion] = useState(
    searchParams.get("occasion") || ""
  );
  const [sortBy, setSortBy] = useState<"newest" | "most-downloaded" | "occasion">("newest");

  const { data: occasions } = trpc.occasions.getAll.useQuery();
  const { data, isLoading } = trpc.cards.getAll.useQuery({
    occasionSlug: selectedOccasion || undefined,
    search: search || undefined,
    sortBy,
    limit: 24,
    offset: 0,
  });

  // Update URL when occasion changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedOccasion) params.set("occasion", selectedOccasion);
    router.replace(`/cards?${params.toString()}`, { scroll: false });
  }, [selectedOccasion]);

  const cards = data?.cards || [];
  const total = data?.total || 0;

  return (
    <div className="min-h-screen" style={{background:'#F9F7F2'}}>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                 style={{background: 'linear-gradient(135deg, #0F6B3F, #1a8f55)'}}>
              <span className="text-white font-black">ت</span>
            </div>
            <span className="font-bold text-gray-800 hidden sm:block">جمعية تآزر</span>
          </Link>
          <h1 className="font-bold text-gray-800">مكتبة البطاقات</h1>
          <Link href="/" className="text-sm text-gray-500 hover:text-green-700 transition-colors flex items-center gap-1">
            <span>الرئيسية</span>
            <span>→</span>
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page title */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black mb-3" style={{color:'#0F6B3F'}}>
            بطاقات التهنئة الإسلامية
          </h2>
          <div className="divider-gold" />
          <p className="text-gray-600 text-sm">{total} بطاقة متاحة</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث عن بطاقة..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-10 text-right focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                dir="rtl"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 bg-white"
              dir="rtl"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Occasion tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedOccasion("")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                !selectedOccasion
                  ? "text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              style={!selectedOccasion ? {background:'#0F6B3F'} : {}}
            >
              الكل ({total})
            </button>
            {occasions?.map((occ) => (
              <button
                key={occ.slug}
                onClick={() => setSelectedOccasion(
                  selectedOccasion === occ.slug ? "" : occ.slug
                )}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                  selectedOccasion === occ.slug
                    ? "text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                style={selectedOccasion === occ.slug ? {background: occ.color || '#0F6B3F'} : {}}
              >
                <span>{occ.icon}</span>
                <span>{occ.titleAr}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Cards grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-[3/4] skeleton rounded-2xl" />
            ))}
          </div>
        ) : cards.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">لا توجد بطاقات</h3>
            <p className="text-gray-500">جرّب تغيير معايير البحث</p>
            <button
              onClick={() => { setSearch(""); setSelectedOccasion(""); }}
              className="mt-4 btn-primary"
            >
              إعادة الضبط
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {cards.map((card: any) => (
              <Link
                key={card.id}
                href={`/editor/${card.id}`}
                className="group relative rounded-2xl overflow-hidden shadow-md card-hover bg-white"
              >
                <div className="aspect-[3/4] relative">
                  <Image
                    src={card.imageUrl}
                    alt={card.titleAr}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 right-0 left-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="btn-gold w-full justify-center py-2 text-sm">
                      استخدم البطاقة ←
                    </div>
                  </div>
                  {/* Downloads badge */}
                  {card.downloadsCount > 0 && (
                    <div className="absolute top-2 left-2 px-2 py-1 rounded-lg text-xs font-bold text-white"
                         style={{background:'rgba(0,0,0,0.5)', backdropFilter:'blur(4px)'}}>
                      📥 {card.downloadsCount.toLocaleString("ar-SA")}
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-semibold text-gray-800 text-sm truncate">{card.titleAr}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{card.occasionTitleAr}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CardsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-green-700 font-bold">جاري التحميل...</div>}>
      <CardsContent />
    </Suspense>
  );
}

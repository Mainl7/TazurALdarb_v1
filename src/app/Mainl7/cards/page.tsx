"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { trpc } from "@/lib/trpc/react";

export default function AdminCardsPage() {
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: cards, isLoading, refetch } = trpc.cards.adminGetAll.useQuery();
  const toggleActive = trpc.cards.toggleActive.useMutation({ onSuccess: () => refetch() });
  const deleteCard = trpc.cards.delete.useMutation({
    onSuccess: () => { setDeleteId(null); refetch(); },
  });

  const filtered = cards?.filter((c) =>
    !search || c.titleAr.includes(search) || c.title.includes(search)
  ) || [];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-800">إدارة البطاقات</h1>
          <p className="text-gray-500 text-sm mt-1">{cards?.length || 0} بطاقة إجمالاً</p>
        </div>
        <Link href="/Mainl7/cards/new" className="btn-primary gap-2 text-sm">
          <span className="text-lg">+</span>
          <span>إضافة بطاقة</span>
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="البحث في البطاقات..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-10 text-right focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
            dir="rtl"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        </div>
      </div>

      {/* Cards table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="w-10 h-10 rounded-full border-3 border-green-500 border-t-transparent animate-spin mx-auto" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500">الصورة</th>
                  <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500">اسم البطاقة</th>
                  <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500">المناسبة</th>
                  <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500">التحميلات</th>
                  <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500">الحالة</th>
                  <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((card) => (
                  <tr key={card.id} className="hover:bg-gray-50 transition-colors group">
                    {/* Image */}
                    <td className="py-4 px-6">
                      <div className="w-14 h-20 rounded-lg overflow-hidden shadow-sm">
                        <Image
                          src={card.imageUrl}
                          alt={card.titleAr}
                          width={56}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>

                    {/* Name */}
                    <td className="py-4 px-6">
                      <div className="font-semibold text-gray-800">{card.titleAr}</div>
                      <div className="text-xs text-gray-400">{card.title}</div>
                      {card.isFeatured && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs mt-1"
                              style={{background:'rgba(212,175,55,0.15)', color:'#B8922A'}}>
                          ⭐ مميزة
                        </span>
                      )}
                    </td>

                    {/* Occasion */}
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{background:'rgba(15,107,63,0.1)', color:'#0F6B3F'}}>
                        {card.occasionTitleAr}
                      </span>
                    </td>

                    {/* Downloads */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1 font-bold text-gray-700">
                        <span>📥</span>
                        <span>{card.downloadsCount.toLocaleString("ar-SA")}</span>
                      </div>
                    </td>

                    {/* Status toggle */}
                    <td className="py-4 px-6">
                      <button
                        onClick={() => toggleActive.mutate({ id: card.id, isActive: !card.isActive })}
                        className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                          card.isActive ? "bg-green-500" : "bg-gray-200"
                        }`}
                      >
                        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
                          card.isActive ? "translate-x-1" : "translate-x-6"
                        }`} />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/editor/${card.id}`}
                          className="p-2 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
                          title="معاينة"
                        >
                          👁️
                        </Link>
                        <Link
                          href={`/Mainl7/cards/${card.id}/edit`}
                          className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                          title="تعديل"
                        >
                          ✏️
                        </Link>
                        <button
                          onClick={() => setDeleteId(card.id)}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                          title="حذف"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <div className="text-5xl mb-4">🎴</div>
                <p>لا توجد بطاقات</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">تأكيد الحذف</h3>
            <p className="text-gray-600 mb-6">هل أنت متأكد من حذف هذه البطاقة؟ لا يمكن التراجع عن هذا الإجراء.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={() => deleteCard.mutate({ id: deleteId })}
                disabled={deleteCard.isPending}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors disabled:opacity-60"
              >
                {deleteCard.isPending ? "جاري الحذف..." : "حذف نهائياً"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

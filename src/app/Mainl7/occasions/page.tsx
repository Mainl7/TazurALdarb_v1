"use client";
import { trpc } from "@/lib/trpc/react";
import { useState } from "react";

// Brand color presets
const BRAND_COLORS = [
  { label: "أخضر رئيسي", value: "#3F806A" },
  { label: "أخضر غامق", value: "#355046" },
  { label: "ذهبي", value: "#C8A969" },
  { label: "ذهبي غامق", value: "#a8893f" },
  { label: "بني", value: "#8B4513" },
  { label: "بنفسجي", value: "#4B0082" },
];

export default function AdminOccasionsPage() {
  const utils = trpc.useUtils();
  const [editingColor, setEditingColor] = useState<number | null>(null);
  const [colorValue, setColorValue] = useState("");

  const { data: occasions, isLoading } = trpc.occasions.adminGetAll.useQuery();
  const updateOccasion = trpc.occasions.update.useMutation({
    onSuccess: () => {
      utils.occasions.adminGetAll.invalidate();
      setEditingColor(null);
    },
  });

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    await updateOccasion.mutateAsync({ id, isActive: !currentStatus });
  };

  const saveColor = async (id: number) => {
    await updateOccasion.mutateAsync({ id, color: colorValue });
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center"><span className="animate-spin text-4xl">⏳</span></div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">إدارة المناسبات</h1>
          <p className="text-gray-500 mt-2">يمكنك من هنا تفعيل أو تعطيل المناسبات التي تظهر في الموقع</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-semibold">المناسبة</th>
              <th className="px-6 py-4 font-semibold">الاسم الإنجليزي</th>
              <th className="px-6 py-4 font-semibold">اللون</th>
              <th className="px-6 py-4 font-semibold">الحالة</th>
              <th className="px-6 py-4 font-semibold">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {occasions?.map((occ) => (
              <tr key={occ.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{occ.icon}</span>
                    <span className="font-bold text-gray-800">{occ.titleAr}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500" dir="ltr">{occ.title}</td>
                <td className="px-6 py-4">
                  {editingColor === occ.id ? (
                    <div className="space-y-2">
                      {/* Color presets */}
                      <div className="flex flex-wrap gap-1.5">
                        {BRAND_COLORS.map((c) => (
                          <button
                            key={c.value}
                            title={c.label}
                            onClick={() => setColorValue(c.value)}
                            className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
                            style={{
                              backgroundColor: c.value,
                              borderColor: colorValue === c.value ? "#000" : "transparent",
                            }}
                          />
                        ))}
                      </div>
                      {/* Custom color picker */}
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={colorValue}
                          onChange={(e) => setColorValue(e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer border border-gray-200"
                        />
                        <input
                          type="text"
                          value={colorValue}
                          onChange={(e) => setColorValue(e.target.value)}
                          className="border border-gray-200 rounded-lg px-2 py-1 text-sm w-24"
                          dir="ltr"
                        />
                      </div>
                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveColor(occ.id)}
                          disabled={updateOccasion.isPending}
                          className="px-3 py-1 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700"
                        >
                          حفظ
                        </button>
                        <button
                          onClick={() => setEditingColor(null)}
                          className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-200"
                        >
                          إلغاء
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setEditingColor(occ.id); setColorValue(occ.color || "#3F806A"); }}
                      className="flex items-center gap-2 hover:opacity-80 transition-opacity group"
                    >
                      <span className="w-7 h-7 rounded-full border-2 border-gray-200 shadow-sm group-hover:border-gray-400 transition-colors" style={{ backgroundColor: occ.color || "#000" }} />
                      <span className="text-sm text-gray-500 font-mono" dir="ltr">{occ.color}</span>
                      <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100">✏️</span>
                    </button>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    occ.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {occ.isActive ? 'نشط' : 'معطل'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleStatus(occ.id, occ.isActive)}
                    disabled={updateOccasion.isPending}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                      occ.isActive
                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                    }`}
                  >
                    {occ.isActive ? 'تعطيل' : 'تفعيل'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!occasions || occasions.length === 0) && (
          <div className="p-12 text-center text-gray-500">
            لا توجد مناسبات مضافة حالياً.
          </div>
        )}
      </div>

      {/* Color usage info */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700">
        💡 <strong>فائدة اللون:</strong> يظهر كخلفية لزر المناسبة في صفحة البطاقات عند الضغط عليه للفلترة
      </div>
    </div>
  );
}

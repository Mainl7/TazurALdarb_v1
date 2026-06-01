"use client";
import { trpc } from "@/lib/trpc/react";

export default function AdminOccasionsPage() {
  const utils = trpc.useUtils();
  
  const { data: occasions, isLoading } = trpc.occasions.adminGetAll.useQuery();
  const updateOccasion = trpc.occasions.update.useMutation({
    onSuccess: () => {
      utils.occasions.adminGetAll.invalidate();
      alert("تم تحديث الحالة بنجاح");
    },
  });

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    await updateOccasion.mutateAsync({
      id,
      isActive: !currentStatus,
    });
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
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full border shadow-sm" style={{backgroundColor: occ.color || '#000'}} />
                    <span className="text-sm text-gray-500" dir="ltr">{occ.color}</span>
                  </div>
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
    </div>
  );
}

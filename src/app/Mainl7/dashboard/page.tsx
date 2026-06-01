"use client";
import { trpc } from "@/lib/trpc/react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import Image from "next/image";
import Link from "next/link";

const COLORS = ["#0F6B3F", "#D4AF37", "#1B3A6B", "#4B0082"];

function StatCard({
  icon, value, label, color, bgColor
}: { icon: string; value: string | number; label: string; color: string; bgColor: string }) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm mb-2">{label}</p>
          <p className="text-4xl font-black" style={{ color }}>{value}</p>
        </div>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
             style={{ background: bgColor }}>
          {icon}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl"
           style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
    </div>
  );
}

export default function DashboardPage() {
  const { data: stats, isLoading } = trpc.cards.getStats.useQuery();

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => <div key={i} className="h-32 skeleton rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 skeleton rounded-2xl" />
          <div className="h-80 skeleton rounded-2xl" />
        </div>
      </div>
    );
  }

  const barData = stats?.downloadsByOccasion?.map((d: any) => ({
    name: d.occasionTitleAr || "غير محدد",
    value: Number(d.total) || 0,
  })) || [];

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-800">لوحة التحكم</h1>
          <p className="text-gray-500 text-sm mt-1">
            {new Date().toLocaleDateString("ar-SA", {
              weekday: "long", year: "numeric", month: "long", day: "numeric",
            })}
          </p>
        </div>
        <Link href="/Mainl7/cards/new" className="btn-primary gap-2 text-sm">
          <span>+</span>
          <span>إضافة بطاقة جديدة</span>
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          icon="🎴" value={stats?.totalCards || 0}
          label="إجمالي البطاقات"
          color="#0F6B3F" bgColor="rgba(15,107,63,0.1)"
        />
        <StatCard
          icon="✅" value={stats?.activeCards || 0}
          label="البطاقات النشطة"
          color="#1B8A53" bgColor="rgba(27,138,83,0.1)"
        />
        <StatCard
          icon="📥" value={(stats?.totalDownloads || 0).toLocaleString("ar-SA")}
          label="إجمالي التحميلات"
          color="#D4AF37" bgColor="rgba(212,175,55,0.1)"
        />
        <StatCard
          icon="🌙" value={stats?.totalOccasions || 0}
          label="عدد المناسبات"
          color="#1B3A6B" bgColor="rgba(27,58,107,0.1)"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar chart - downloads by occasion */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-6">التحميلات حسب المناسبة</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fontFamily: "Tajawal" }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(value: any) => [Number(value ?? 0).toLocaleString("ar-SA"), "تحميل"]}
                contentStyle={{ fontFamily: "Tajawal", borderRadius: "12px" }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {barData.map((_: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-6">توزيع البطاقات</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={barData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {barData.map((_: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any) => [Number(value ?? 0).toLocaleString("ar-SA"), "تحميل"]}
                contentStyle={{ fontFamily: "Tajawal", borderRadius: "12px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top cards table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-800">أكثر البطاقات تحميلاً</h2>
          <Link href="/Mainl7/cards" className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors">
            عرض الكل →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-right py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                <th className="text-right py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">البطاقة</th>
                <th className="text-right py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">المناسبة</th>
                <th className="text-right py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">التحميلات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats?.topCards?.map((card: any, i: number) => (
                <tr key={card.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 text-gray-400 text-sm font-mono">{i + 1}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                        <Image
                          src={card.imageUrl}
                          alt={card.titleAr}
                          width={48}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-semibold text-gray-800 text-sm">{card.titleAr}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{background:'rgba(15,107,63,0.1)', color:'#0F6B3F'}}>
                      {card.occasionTitleAr}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-500">📥</span>
                      <span className="font-bold text-gray-800">
                        {card.downloadsCount.toLocaleString("ar-SA")}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

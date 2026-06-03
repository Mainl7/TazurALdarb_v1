import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 4000,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false },
  });

  try {
    // Update occasion colors to Tazur brand colors
    const updates = [
      { slug: "eid-al-fitr", color: "#3F806A" },    // أخضر متوسط
      { slug: "eid-al-adha", color: "#C8A969" },    // ذهبي
      { slug: "ramadan", color: "#355046" },          // أخضر غامق
    ];

    const results = [];
    for (const u of updates) {
      const [r] = await connection.execute(
        "UPDATE occasions SET color = ? WHERE slug = ?",
        [u.color, u.slug]
      ) as any;
      results.push(`${u.slug}: ${r.affectedRows} updated → ${u.color}`);
    }

    const [occs] = await connection.execute("SELECT title_ar, slug, color FROM occasions") as any;
    results.push("✅ Current colors:");
    occs.forEach((o: any) => results.push(`  ${o.title_ar}: ${o.color}`));

    await connection.end();
    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    await connection.end();
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

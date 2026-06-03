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

  const results: any[] = [];

  try {
    // Update Eid Al-Fitr image URLs
    for (let i = 1; i <= 8; i++) {
      const newUrl = `/cards/eid-fitr/بطاقة تهنئة عيد الفطر ${i}.png`;
      const oldUrl = `/cards/eid-fitr-${i}.png`;
      const [r] = await connection.execute(
        "UPDATE cards SET image_url = ? WHERE image_url = ?",
        [newUrl, oldUrl]
      ) as any;
      results.push(`عيد الفطر ${i}: ${r.affectedRows} row updated`);
    }

    // Update Eid Al-Adha image URLs
    for (let i = 1; i <= 8; i++) {
      const newUrl = `/cards/eid-adha/بطاقة تهنئة عيد الأضحى ${i}.png`;
      const oldUrl = `/cards/eid-adha-${i}.png`;
      const [r] = await connection.execute(
        "UPDATE cards SET image_url = ? WHERE image_url = ?",
        [newUrl, oldUrl]
      ) as any;
      results.push(`عيد الأضحى ${i}: ${r.affectedRows} row updated`);
    }

    // Update Ramadan image URLs
    for (let i = 1; i <= 8; i++) {
      const newUrl = `/cards/ramadan/بطاقة تهنئة رمضان ${i}.png`;
      const oldUrl = `/cards/ramadan-${i}.png`;
      const [r] = await connection.execute(
        "UPDATE cards SET image_url = ? WHERE image_url = ?",
        [newUrl, oldUrl]
      ) as any;
      results.push(`رمضان ${i}: ${r.affectedRows} row updated`);
    }

    // Delete Hijri New Year cards
    const [delCards] = await connection.execute(
      "DELETE FROM cards WHERE occasion_id = 4"
    ) as any;
    results.push(`✅ Deleted ${delCards.affectedRows} Hijri cards`);

    // Delete Hijri New Year occasion
    const [delOcc] = await connection.execute(
      "DELETE FROM occasions WHERE id = 4"
    ) as any;
    results.push(`✅ Deleted ${delOcc.affectedRows} Hijri occasion`);

    // Verify final state
    const [cards] = await connection.execute(
      "SELECT id, title_ar, image_url FROM cards ORDER BY occasion_id, id"
    ) as any;
    results.push(`✅ Total cards remaining: ${cards.length}`);

    const [occasions] = await connection.execute("SELECT id, title_ar FROM occasions") as any;
    results.push(`✅ Occasions: ${occasions.map((o: any) => o.title_ar).join(", ")}`);

    await connection.end();
    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    await connection.end();
    return NextResponse.json({ success: false, error: error.message, results }, { status: 500 });
  }
}

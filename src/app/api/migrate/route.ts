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
    // Check current image URLs
    const [currentCards] = await connection.execute(
      "SELECT id, title_ar, image_url FROM cards ORDER BY occasion_id, id LIMIT 10"
    ) as any;
    results.push(`🔍 Sample image URLs in DB:`);
    currentCards.forEach((c: any) => {
      results.push(`  ID ${c.id}: ${c.image_url}`);
    });

    await connection.end();
    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    await connection.end();
    return NextResponse.json({ success: false, error: error.message, results }, { status: 500 });
  }
}


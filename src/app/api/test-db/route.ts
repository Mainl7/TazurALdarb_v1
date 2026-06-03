import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 4000,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: false },
    });

    const [occasions] = await connection.execute("SELECT COUNT(*) as count FROM occasions");
    const [cards] = await connection.execute("SELECT COUNT(*) as count FROM cards");
    const [activeCards] = await connection.execute("SELECT COUNT(*) as count FROM cards WHERE is_active = 1");
    const [sampleCards] = await connection.execute(
      "SELECT id, title_ar, occasion_id, is_active FROM cards LIMIT 5"
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      occasions,
      cards,
      activeCards,
      sampleCards,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
    }, { status: 500 });
  }
}

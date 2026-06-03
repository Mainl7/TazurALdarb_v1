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

    const [tables] = await connection.execute("SHOW TABLES");
    const [descCards] = await connection.execute("DESCRIBE cards");
    const [cardCount] = await connection.execute("SELECT COUNT(*) as count FROM cards");

    await connection.end();

    return NextResponse.json({
      success: true,
      tables,
      descCards,
      cardCount,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
    }, { status: 500 });
  }
}

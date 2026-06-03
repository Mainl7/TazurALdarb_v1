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
    // Update user role to admin
    const [updateResult] = await connection.execute(
      "UPDATE users SET role = 'admin' WHERE email = 'gnoooodm@gmail.com'"
    ) as any;
    results.push(`✅ Updated ${updateResult.affectedRows} user(s) to admin`);

    // Verify
    const [users] = await connection.execute("SELECT id, name, email, role FROM users");
    results.push(`👤 Users: ${JSON.stringify(users)}`);

    await connection.end();
    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    await connection.end();
    return NextResponse.json({ success: false, error: error.message, results }, { status: 500 });
  }
}

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
    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) NOT NULL UNIQUE,
        email_verified TIMESTAMP NULL,
        image VARCHAR(500),
        role VARCHAR(50) DEFAULT 'user' NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    results.push("✅ users table ready");

    // Create accounts table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS accounts (
        user_id VARCHAR(255) NOT NULL,
        type VARCHAR(255) NOT NULL,
        provider VARCHAR(255) NOT NULL,
        provider_account_id VARCHAR(255) NOT NULL,
        refresh_token TEXT,
        access_token TEXT,
        expires_at INT,
        token_type VARCHAR(255),
        scope VARCHAR(255),
        id_token TEXT,
        session_state VARCHAR(255),
        PRIMARY KEY (provider, provider_account_id)
      )
    `);
    results.push("✅ accounts table ready");

    // Create sessions table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS sessions (
        session_token VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        expires TIMESTAMP NOT NULL
      )
    `);
    results.push("✅ sessions table ready");

    // Create verification_tokens table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS verification_tokens (
        identifier VARCHAR(255) NOT NULL,
        token VARCHAR(255) NOT NULL,
        expires TIMESTAMP NOT NULL,
        PRIMARY KEY (identifier, token)
      )
    `);
    results.push("✅ verification_tokens table ready");

    // Show all tables
    const [tables] = await connection.execute("SHOW TABLES");
    results.push(`📋 Tables: ${(tables as any[]).map((t: any) => Object.values(t)[0]).join(", ")}`);

    await connection.end();
    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    await connection.end();
    return NextResponse.json({ success: false, error: error.message, results }, { status: 500 });
  }
}

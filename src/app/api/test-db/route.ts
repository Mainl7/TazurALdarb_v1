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
    multipleStatements: true,
  });

  const results: any[] = [];

  try {
    // Drop old tables
    await connection.execute("DROP TABLE IF EXISTS cards");
    results.push("✅ Dropped old cards table");

    await connection.execute("DROP TABLE IF EXISTS cardDownloads");
    results.push("✅ Dropped cardDownloads table");

    // Create new cards table with correct schema
    await connection.execute(`
      CREATE TABLE cards (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        title_ar VARCHAR(255) NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        thumbnail_url VARCHAR(500),
        occasion_id INT NOT NULL,
        default_color VARCHAR(20) DEFAULT '#FFFFFF' NOT NULL,
        default_font_size INT DEFAULT 48 NOT NULL,
        default_position_x FLOAT DEFAULT 50 NOT NULL,
        default_position_y FLOAT DEFAULT 50 NOT NULL,
        default_font_family VARCHAR(100) DEFAULT 'Noto Naskh Arabic' NOT NULL,
        default_text_align VARCHAR(20) DEFAULT 'center' NOT NULL,
        description TEXT,
        downloads_count INT DEFAULT 0 NOT NULL,
        is_active BOOLEAN DEFAULT TRUE NOT NULL,
        is_featured BOOLEAN DEFAULT FALSE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
      )
    `);
    results.push("✅ Created new cards table");

    // Create card_downloads table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS card_downloads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        card_id INT NOT NULL,
        user_name VARCHAR(255),
        downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        ip_hash VARCHAR(255)
      )
    `);
    results.push("✅ Created card_downloads table");

    // Insert cards data
    await connection.execute(`
      INSERT INTO cards (title, title_ar, image_url, occasion_id, default_color, default_font_size, default_position_x, default_position_y, is_featured) VALUES
      ('Eid Al-Fitr Card 1', 'بطاقة عيد الفطر 1', '/cards/eid-fitr-1.png', 1, '#FFFFFF', 52, 50, 50, TRUE),
      ('Eid Al-Fitr Card 2', 'بطاقة عيد الفطر 2', '/cards/eid-fitr-2.png', 1, '#D4AF37', 48, 50, 50, FALSE),
      ('Eid Al-Fitr Card 3', 'بطاقة عيد الفطر 3', '/cards/eid-fitr-3.png', 1, '#FFFFFF', 48, 50, 50, FALSE),
      ('Eid Al-Fitr Card 4', 'بطاقة عيد الفطر 4', '/cards/eid-fitr-4.png', 1, '#8B0000', 44, 50, 50, FALSE),
      ('Eid Al-Fitr Card 5', 'بطاقة عيد الفطر 5', '/cards/eid-fitr-5.png', 1, '#FFFFFF', 48, 50, 50, FALSE),
      ('Eid Al-Fitr Card 6', 'بطاقة عيد الفطر 6', '/cards/eid-fitr-6.png', 1, '#D4AF37', 48, 50, 50, FALSE),
      ('Eid Al-Fitr Card 7', 'بطاقة عيد الفطر 7', '/cards/eid-fitr-7.png', 1, '#FFFFFF', 44, 50, 50, FALSE),
      ('Eid Al-Fitr Card 8', 'بطاقة عيد الفطر 8', '/cards/eid-fitr-8.png', 1, '#D4AF37', 48, 50, 50, FALSE),
      ('Eid Al-Adha Card 1', 'بطاقة عيد الأضحى 1', '/cards/eid-adha-1.png', 2, '#FFFFFF', 52, 50, 50, TRUE),
      ('Eid Al-Adha Card 2', 'بطاقة عيد الأضحى 2', '/cards/eid-adha-2.png', 2, '#D4AF37', 48, 50, 50, FALSE),
      ('Eid Al-Adha Card 3', 'بطاقة عيد الأضحى 3', '/cards/eid-adha-3.png', 2, '#FFFFFF', 48, 50, 50, FALSE),
      ('Eid Al-Adha Card 4', 'بطاقة عيد الأضحى 4', '/cards/eid-adha-4.png', 2, '#FFFFFF', 48, 50, 50, FALSE),
      ('Eid Al-Adha Card 5', 'بطاقة عيد الأضحى 5', '/cards/eid-adha-5.png', 2, '#D4AF37', 44, 50, 50, FALSE),
      ('Eid Al-Adha Card 6', 'بطاقة عيد الأضحى 6', '/cards/eid-adha-6.png', 2, '#FFFFFF', 48, 50, 50, FALSE),
      ('Eid Al-Adha Card 7', 'بطاقة عيد الأضحى 7', '/cards/eid-adha-7.png', 2, '#FFFFFF', 48, 50, 50, FALSE),
      ('Eid Al-Adha Card 8', 'بطاقة عيد الأضحى 8', '/cards/eid-adha-8.png', 2, '#D4AF37', 44, 50, 50, FALSE),
      ('Ramadan Card 1', 'بطاقة رمضان 1', '/cards/ramadan-1.png', 3, '#D4AF37', 52, 50, 50, TRUE),
      ('Ramadan Card 2', 'بطاقة رمضان 2', '/cards/ramadan-2.png', 3, '#D4AF37', 48, 50, 50, FALSE),
      ('Ramadan Card 3', 'بطاقة رمضان 3', '/cards/ramadan-3.png', 3, '#FFFFFF', 48, 50, 50, FALSE),
      ('Ramadan Card 4', 'بطاقة رمضان 4', '/cards/ramadan-4.png', 3, '#FFFFFF', 44, 50, 50, FALSE),
      ('Ramadan Card 5', 'بطاقة رمضان 5', '/cards/ramadan-5.png', 3, '#D4AF37', 48, 50, 50, FALSE),
      ('Ramadan Card 6', 'بطاقة رمضان 6', '/cards/ramadan-6.png', 3, '#FFFFFF', 48, 50, 50, FALSE),
      ('Ramadan Card 7', 'بطاقة رمضان 7', '/cards/ramadan-7.png', 3, '#D4AF37', 44, 50, 50, FALSE),
      ('Ramadan Card 8', 'بطاقة رمضان 8', '/cards/ramadan-8.png', 3, '#FFFFFF', 48, 50, 50, FALSE),
      ('Hijri New Year Card 1', 'بطاقة رأس السنة 1', '/cards/hijri-1.png', 4, '#D4AF37', 52, 50, 50, TRUE),
      ('Hijri New Year Card 2', 'بطاقة رأس السنة 2', '/cards/hijri-2.png', 4, '#FFFFFF', 48, 50, 50, FALSE),
      ('Hijri New Year Card 3', 'بطاقة رأس السنة 3', '/cards/hijri-3.png', 4, '#D4AF37', 48, 50, 50, FALSE),
      ('Hijri New Year Card 4', 'بطاقة رأس السنة 4', '/cards/hijri-4.png', 4, '#FFFFFF', 44, 50, 50, FALSE),
      ('Hijri New Year Card 5', 'بطاقة رأس السنة 5', '/cards/hijri-5.png', 4, '#D4AF37', 48, 50, 50, FALSE),
      ('Hijri New Year Card 6', 'بطاقة رأس السنة 6', '/cards/hijri-6.png', 4, '#FFFFFF', 48, 50, 50, FALSE),
      ('Hijri New Year Card 7', 'بطاقة رأس السنة 7', '/cards/hijri-7.png', 4, '#D4AF37', 44, 50, 50, FALSE),
      ('Hijri New Year Card 8', 'بطاقة رأس السنة 8', '/cards/hijri-8.png', 4, '#FFFFFF', 48, 50, 50, FALSE)
    `);
    results.push("✅ Inserted 32 cards");

    const [count] = await connection.execute("SELECT COUNT(*) as count FROM cards");
    results.push(`✅ Total cards: ${(count as any)[0].count}`);

    await connection.end();
    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    await connection.end();
    return NextResponse.json({ success: false, error: error.message, results }, { status: 500 });
  }
}

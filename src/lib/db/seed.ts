import { db } from "./index";
import { occasions, cards } from "./schema";
import { sql } from "drizzle-orm";

async function seed() {
  console.log("🌱 Starting database seed...");

  // ===========================
  // Seed Occasions
  // ===========================
  const occasionData = [
    {
      title: "Eid Al-Fitr",
      titleAr: "عيد الفطر المبارك",
      slug: "eid-al-fitr",
      description: "بطاقات تهنئة بمناسبة عيد الفطر المبارك",
      icon: "🌙",
      color: "#0F6B3F",
      sortOrder: 1,
    },
    {
      title: "Eid Al-Adha",
      titleAr: "عيد الأضحى المبارك",
      slug: "eid-al-adha",
      description: "بطاقات تهنئة بمناسبة عيد الأضحى المبارك",
      icon: "🕌",
      color: "#8B4513",
      sortOrder: 2,
    },
    {
      title: "Ramadan",
      titleAr: "شهر رمضان الكريم",
      slug: "ramadan",
      description: "بطاقات تهنئة بمناسبة شهر رمضان الكريم",
      icon: "🪔",
      color: "#4B0082",
      sortOrder: 3,
    },
    {
      title: "Hijri New Year",
      titleAr: "رأس السنة الهجرية",
      slug: "hijri-new-year",
      description: "بطاقات تهنئة بمناسبة رأس السنة الهجرية",
      icon: "⭐",
      color: "#1B3A6B",
      sortOrder: 4,
    },
  ];

  const insertedOccasions = await db
    .insert(occasions)
    .values(occasionData)
    .onDuplicateKeyUpdate({ set: { title: sql`title` } })
    .$returningId();

  console.log(`✅ Seeded ${occasionData.length} occasions`);

  // ===========================
  // Seed Cards
  // ===========================
  // Get occasion IDs
  const allOccasions = await db.select().from(occasions);
  const eidFitrId = allOccasions.find((o) => o.slug === "eid-al-fitr")?.id!;
  const eidAdhaId = allOccasions.find((o) => o.slug === "eid-al-adha")?.id!;
  const ramadanId = allOccasions.find((o) => o.slug === "ramadan")?.id!;
  const hijriId = allOccasions.find((o) => o.slug === "hijri-new-year")?.id!;

  const cardData = [
    // Eid Al-Fitr Cards (8)
    { title: "Eid Al-Fitr Card 1", titleAr: "بطاقة عيد الفطر 1", imageUrl: "/cards/eid-fitr-1.png", occasionId: eidFitrId, defaultColor: "#FFFFFF", defaultFontSize: 52, defaultPositionX: 50, defaultPositionY: 50, isFeatured: true },
    { title: "Eid Al-Fitr Card 2", titleAr: "بطاقة عيد الفطر 2", imageUrl: "/cards/eid-fitr-2.png", occasionId: eidFitrId, defaultColor: "#D4AF37", defaultFontSize: 48, defaultPositionX: 50, defaultPositionY: 50 },
    { title: "Eid Al-Fitr Card 3", titleAr: "بطاقة عيد الفطر 3", imageUrl: "/cards/eid-fitr-3.png", occasionId: eidFitrId, defaultColor: "#FFFFFF", defaultFontSize: 48, defaultPositionX: 50, defaultPositionY: 50 },
    { title: "Eid Al-Fitr Card 4", titleAr: "بطاقة عيد الفطر 4", imageUrl: "/cards/eid-fitr-4.png", occasionId: eidFitrId, defaultColor: "#8B0000", defaultFontSize: 44, defaultPositionX: 50, defaultPositionY: 50 },
    { title: "Eid Al-Fitr Card 5", titleAr: "بطاقة عيد الفطر 5", imageUrl: "/cards/eid-fitr-5.png", occasionId: eidFitrId, defaultColor: "#FFFFFF", defaultFontSize: 48, defaultPositionX: 50, defaultPositionY: 50 },
    { title: "Eid Al-Fitr Card 6", titleAr: "بطاقة عيد الفطر 6", imageUrl: "/cards/eid-fitr-6.png", occasionId: eidFitrId, defaultColor: "#D4AF37", defaultFontSize: 48, defaultPositionX: 50, defaultPositionY: 50 },
    { title: "Eid Al-Fitr Card 7", titleAr: "بطاقة عيد الفطر 7", imageUrl: "/cards/eid-fitr-7.png", occasionId: eidFitrId, defaultColor: "#FFFFFF", defaultFontSize: 44, defaultPositionX: 50, defaultPositionY: 50 },
    { title: "Eid Al-Fitr Card 8", titleAr: "بطاقة عيد الفطر 8", imageUrl: "/cards/eid-fitr-8.png", occasionId: eidFitrId, defaultColor: "#D4AF37", defaultFontSize: 48, defaultPositionX: 50, defaultPositionY: 50 },
    // Eid Al-Adha Cards (8)
    { title: "Eid Al-Adha Card 1", titleAr: "بطاقة عيد الأضحى 1", imageUrl: "/cards/eid-adha-1.png", occasionId: eidAdhaId, defaultColor: "#FFFFFF", defaultFontSize: 52, defaultPositionX: 50, defaultPositionY: 50, isFeatured: true },
    { title: "Eid Al-Adha Card 2", titleAr: "بطاقة عيد الأضحى 2", imageUrl: "/cards/eid-adha-2.png", occasionId: eidAdhaId, defaultColor: "#D4AF37", defaultFontSize: 48, defaultPositionX: 50, defaultPositionY: 50 },
    { title: "Eid Al-Adha Card 3", titleAr: "بطاقة عيد الأضحى 3", imageUrl: "/cards/eid-adha-3.png", occasionId: eidAdhaId, defaultColor: "#FFFFFF", defaultFontSize: 48, defaultPositionX: 50, defaultPositionY: 50 },
    { title: "Eid Al-Adha Card 4", titleAr: "بطاقة عيد الأضحى 4", imageUrl: "/cards/eid-adha-4.png", occasionId: eidAdhaId, defaultColor: "#FFFFFF", defaultFontSize: 48, defaultPositionX: 50, defaultPositionY: 50 },
    { title: "Eid Al-Adha Card 5", titleAr: "بطاقة عيد الأضحى 5", imageUrl: "/cards/eid-adha-5.png", occasionId: eidAdhaId, defaultColor: "#D4AF37", defaultFontSize: 44, defaultPositionX: 50, defaultPositionY: 50 },
    { title: "Eid Al-Adha Card 6", titleAr: "بطاقة عيد الأضحى 6", imageUrl: "/cards/eid-adha-6.png", occasionId: eidAdhaId, defaultColor: "#FFFFFF", defaultFontSize: 48, defaultPositionX: 50, defaultPositionY: 50 },
    { title: "Eid Al-Adha Card 7", titleAr: "بطاقة عيد الأضحى 7", imageUrl: "/cards/eid-adha-7.png", occasionId: eidAdhaId, defaultColor: "#FFFFFF", defaultFontSize: 48, defaultPositionX: 50, defaultPositionY: 50 },
    { title: "Eid Al-Adha Card 8", titleAr: "بطاقة عيد الأضحى 8", imageUrl: "/cards/eid-adha-8.png", occasionId: eidAdhaId, defaultColor: "#D4AF37", defaultFontSize: 44, defaultPositionX: 50, defaultPositionY: 50 },
    // Ramadan Cards (8)
    { title: "Ramadan Card 1", titleAr: "بطاقة رمضان 1", imageUrl: "/cards/ramadan-1.png", occasionId: ramadanId, defaultColor: "#D4AF37", defaultFontSize: 52, defaultPositionX: 50, defaultPositionY: 50, isFeatured: true },
    { title: "Ramadan Card 2", titleAr: "بطاقة رمضان 2", imageUrl: "/cards/ramadan-2.png", occasionId: ramadanId, defaultColor: "#D4AF37", defaultFontSize: 48, defaultPositionX: 50, defaultPositionY: 50 },
    { title: "Ramadan Card 3", titleAr: "بطاقة رمضان 3", imageUrl: "/cards/ramadan-3.png", occasionId: ramadanId, defaultColor: "#FFFFFF", defaultFontSize: 48, defaultPositionX: 50, defaultPositionY: 50 },
    { title: "Ramadan Card 4", titleAr: "بطاقة رمضان 4", imageUrl: "/cards/ramadan-4.png", occasionId: ramadanId, defaultColor: "#FFFFFF", defaultFontSize: 44, defaultPositionX: 50, defaultPositionY: 50 },
    { title: "Ramadan Card 5", titleAr: "بطاقة رمضان 5", imageUrl: "/cards/ramadan-5.png", occasionId: ramadanId, defaultColor: "#D4AF37", defaultFontSize: 48, defaultPositionX: 50, defaultPositionY: 50 },
    { title: "Ramadan Card 6", titleAr: "بطاقة رمضان 6", imageUrl: "/cards/ramadan-6.png", occasionId: ramadanId, defaultColor: "#FFFFFF", defaultFontSize: 48, defaultPositionX: 50, defaultPositionY: 50 },
    { title: "Ramadan Card 7", titleAr: "بطاقة رمضان 7", imageUrl: "/cards/ramadan-7.png", occasionId: ramadanId, defaultColor: "#D4AF37", defaultFontSize: 44, defaultPositionX: 50, defaultPositionY: 50 },
    { title: "Ramadan Card 8", titleAr: "بطاقة رمضان 8", imageUrl: "/cards/ramadan-8.png", occasionId: ramadanId, defaultColor: "#FFFFFF", defaultFontSize: 48, defaultPositionX: 50, defaultPositionY: 50 },
    // Hijri New Year Cards (8)
    { title: "Hijri New Year Card 1", titleAr: "بطاقة رأس السنة 1", imageUrl: "/cards/hijri-1.png", occasionId: hijriId, defaultColor: "#D4AF37", defaultFontSize: 52, defaultPositionX: 50, defaultPositionY: 50, isFeatured: true },
    { title: "Hijri New Year Card 2", titleAr: "بطاقة رأس السنة 2", imageUrl: "/cards/hijri-2.png", occasionId: hijriId, defaultColor: "#FFFFFF", defaultFontSize: 48, defaultPositionX: 50, defaultPositionY: 50 },
    { title: "Hijri New Year Card 3", titleAr: "بطاقة رأس السنة 3", imageUrl: "/cards/hijri-3.png", occasionId: hijriId, defaultColor: "#D4AF37", defaultFontSize: 48, defaultPositionX: 50, defaultPositionY: 50 },
    { title: "Hijri New Year Card 4", titleAr: "بطاقة رأس السنة 4", imageUrl: "/cards/hijri-4.png", occasionId: hijriId, defaultColor: "#FFFFFF", defaultFontSize: 44, defaultPositionX: 50, defaultPositionY: 50 },
    { title: "Hijri New Year Card 5", titleAr: "بطاقة رأس السنة 5", imageUrl: "/cards/hijri-5.png", occasionId: hijriId, defaultColor: "#D4AF37", defaultFontSize: 48, defaultPositionX: 50, defaultPositionY: 50 },
    { title: "Hijri New Year Card 6", titleAr: "بطاقة رأس السنة 6", imageUrl: "/cards/hijri-6.png", occasionId: hijriId, defaultColor: "#FFFFFF", defaultFontSize: 48, defaultPositionX: 50, defaultPositionY: 50 },
    { title: "Hijri New Year Card 7", titleAr: "بطاقة رأس السنة 7", imageUrl: "/cards/hijri-7.png", occasionId: hijriId, defaultColor: "#D4AF37", defaultFontSize: 44, defaultPositionX: 50, defaultPositionY: 50 },
    { title: "Hijri New Year Card 8", titleAr: "بطاقة رأس السنة 8", imageUrl: "/cards/hijri-8.png", occasionId: hijriId, defaultColor: "#FFFFFF", defaultFontSize: 48, defaultPositionX: 50, defaultPositionY: 50 },
  ];

  await db.insert(cards).values(cardData).onDuplicateKeyUpdate({ set: { title: sql`title` } });
  console.log(`✅ Seeded ${cardData.length} cards`);
  console.log("🎉 Seed completed successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});

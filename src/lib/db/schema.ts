import {
  mysqlTable,
  varchar,
  int,
  boolean,
  text,
  timestamp,
  float,
  index,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

// ===========================
// Users Table
// ===========================
export const users = mysqlTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: timestamp("emailVerified"),
  image: varchar("image", { length: 500 }),
  role: varchar("role", { length: 50 }).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ===========================
// Auth Tables (NextAuth)
// ===========================
export const accounts = mysqlTable("accounts", {
  userId: varchar("userId", { length: 255 }).notNull(),
  type: varchar("type", { length: 255 }).notNull(),
  provider: varchar("provider", { length: 255 }).notNull(),
  providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: int("expires_at"),
  token_type: varchar("token_type", { length: 255 }),
  scope: varchar("scope", { length: 255 }),
  id_token: text("id_token"),
  session_state: varchar("session_state", { length: 255 }),
});

export const sessions = mysqlTable("sessions", {
  sessionToken: varchar("sessionToken", { length: 255 }).primaryKey(),
  userId: varchar("userId", { length: 255 }).notNull(),
  expires: timestamp("expires").notNull(),
});

export const verificationTokens = mysqlTable("verificationTokens", {
  identifier: varchar("identifier", { length: 255 }).notNull(),
  token: varchar("token", { length: 255 }).notNull(),
  expires: timestamp("expires").notNull(),
});

// ===========================
// Occasions Table
// ===========================
export const occasions = mysqlTable("occasions", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 255 }).notNull(),
  titleAr: varchar("titleAr", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  icon: varchar("icon", { length: 100 }),
  color: varchar("color", { length: 20 }).default("#0F6B3F"),
  isActive: boolean("isActive").default(true).notNull(),
  sortOrder: int("sortOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ===========================
// Cards Table
// ===========================
export const cards = mysqlTable(
  "cards",
  {
    id: int("id").primaryKey().autoincrement(),
    title: varchar("title", { length: 255 }).notNull(),
    titleAr: varchar("titleAr", { length: 255 }).notNull(),
    imageUrl: varchar("imageUrl", { length: 500 }).notNull(),
    thumbnailUrl: varchar("thumbnailUrl", { length: 500 }),
    occasionId: int("occasionId").notNull(),
    defaultColor: varchar("defaultColor", { length: 20 }).default("#FFFFFF").notNull(),
    defaultFontSize: int("defaultFontSize").default(48).notNull(),
    defaultPositionX: float("defaultPositionX").default(50).notNull(), // percentage 0-100
    defaultPositionY: float("defaultPositionY").default(50).notNull(), // percentage 0-100
    defaultFontFamily: varchar("defaultFontFamily", { length: 100 }).default("Noto Naskh Arabic").notNull(),
    defaultTextAlign: varchar("defaultTextAlign", { length: 20 }).default("center").notNull(),
    description: text("description"),
    downloadsCount: int("downloadsCount").default(0).notNull(),
    isActive: boolean("isActive").default(true).notNull(),
    isFeatured: boolean("isFeatured").default(false).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    occasionIdx: index("occasion_idx").on(table.occasionId),
    activeIdx: index("active_idx").on(table.isActive),
  })
);

// ===========================
// Card Downloads Table
// ===========================
export const cardDownloads = mysqlTable(
  "cardDownloads",
  {
    id: int("id").primaryKey().autoincrement(),
    cardId: int("cardId").notNull(),
    userName: varchar("userName", { length: 255 }),
    downloadedAt: timestamp("downloadedAt").defaultNow().notNull(),
    ipHash: varchar("ipHash", { length: 255 }), // hashed for privacy
  },
  (table) => ({
    cardIdx: index("card_idx").on(table.cardId),
    dateIdx: index("date_idx").on(table.downloadedAt),
  })
);

// ===========================
// Relations
// ===========================
export const occasionsRelations = relations(occasions, ({ many }) => ({
  cards: many(cards),
}));

export const cardsRelations = relations(cards, ({ one, many }) => ({
  occasion: one(occasions, {
    fields: [cards.occasionId],
    references: [occasions.id],
  }),
  downloads: many(cardDownloads),
}));

export const cardDownloadsRelations = relations(cardDownloads, ({ one }) => ({
  card: one(cards, {
    fields: [cardDownloads.cardId],
    references: [cards.id],
  }),
}));

// ===========================
// Type exports
// ===========================
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Occasion = typeof occasions.$inferSelect;
export type NewOccasion = typeof occasions.$inferInsert;
export type Card = typeof cards.$inferSelect;
export type NewCard = typeof cards.$inferInsert;
export type CardDownload = typeof cardDownloads.$inferSelect;
export type NewCardDownload = typeof cardDownloads.$inferInsert;

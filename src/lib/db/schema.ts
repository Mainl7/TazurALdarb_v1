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
  emailVerified: timestamp("email_verified"),
  image: varchar("image", { length: 500 }),
  role: varchar("role", { length: 50 }).default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ===========================
// Auth Tables (NextAuth)
// ===========================
export const accounts = mysqlTable("accounts", {
  userId: varchar("user_id", { length: 255 }).notNull(),
  type: varchar("type", { length: 255 }).notNull(),
  provider: varchar("provider", { length: 255 }).notNull(),
  providerAccountId: varchar("provider_account_id", { length: 255 }).notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: int("expires_at"),
  token_type: varchar("token_type", { length: 255 }),
  scope: varchar("scope", { length: 255 }),
  id_token: text("id_token"),
  session_state: varchar("session_state", { length: 255 }),
});

export const sessions = mysqlTable("sessions", {
  sessionToken: varchar("session_token", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  expires: timestamp("expires").notNull(),
});

export const verificationTokens = mysqlTable("verification_tokens", {
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
  titleAr: varchar("title_ar", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  icon: varchar("icon", { length: 100 }),
  color: varchar("color", { length: 20 }).default("#0F6B3F"),
  isActive: boolean("is_active").default(true).notNull(),
  sortOrder: int("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ===========================
// Cards Table
// ===========================
export const cards = mysqlTable(
  "cards",
  {
    id: int("id").primaryKey().autoincrement(),
    title: varchar("title", { length: 255 }).notNull(),
    titleAr: varchar("title_ar", { length: 255 }).notNull(),
    imageUrl: varchar("image_url", { length: 500 }).notNull(),
    thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
    occasionId: int("occasion_id").notNull(),
    defaultColor: varchar("default_color", { length: 20 }).default("#FFFFFF").notNull(),
    defaultFontSize: int("default_font_size").default(48).notNull(),
    defaultPositionX: float("default_position_x").default(50).notNull(),
    defaultPositionY: float("default_position_y").default(50).notNull(),
    defaultFontFamily: varchar("default_font_family", { length: 100 }).default("Noto Naskh Arabic").notNull(),
    defaultTextAlign: varchar("default_text_align", { length: 20 }).default("center").notNull(),
    description: text("description"),
    downloadsCount: int("downloads_count").default(0).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    isFeatured: boolean("is_featured").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
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
  "card_downloads",
  {
    id: int("id").primaryKey().autoincrement(),
    cardId: int("card_id").notNull(),
    userName: varchar("user_name", { length: 255 }),
    downloadedAt: timestamp("downloaded_at").defaultNow().notNull(),
    ipHash: varchar("ip_hash", { length: 255 }),
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

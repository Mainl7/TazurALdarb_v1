import { z } from "zod";
import { router, publicProcedure, adminProcedure } from "../init";
import { cards, occasions, cardDownloads } from "@/lib/db/schema";
import { eq, desc, sql, like, and, count } from "drizzle-orm";
import crypto from "crypto";

export const cardsRouter = router({
  // ===========================
  // GET all cards (public)
  // ===========================
  getAll: publicProcedure
    .input(
      z.object({
        occasionSlug: z.string().optional(),
        search: z.string().optional(),
        sortBy: z.enum(["newest", "most-downloaded", "occasion"]).default("newest"),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      let query = ctx.db
        .select({
          id: cards.id,
          title: cards.title,
          titleAr: cards.titleAr,
          imageUrl: cards.imageUrl,
          thumbnailUrl: cards.thumbnailUrl,
          occasionId: cards.occasionId,
          occasionTitleAr: occasions.titleAr,
          occasionSlug: occasions.slug,
          defaultColor: cards.defaultColor,
          defaultFontSize: cards.defaultFontSize,
          defaultPositionX: cards.defaultPositionX,
          defaultPositionY: cards.defaultPositionY,
          defaultFontFamily: cards.defaultFontFamily,
          defaultTextAlign: cards.defaultTextAlign,
          downloadsCount: cards.downloadsCount,
          isFeatured: cards.isFeatured,
          createdAt: cards.createdAt,
        })
        .from(cards)
        .leftJoin(occasions, eq(cards.occasionId, occasions.id))
        .where(
          and(
            eq(cards.isActive, true),
            input.occasionSlug
              ? eq(occasions.slug, input.occasionSlug)
              : undefined,
            input.search
              ? like(cards.titleAr, `%${input.search}%`)
              : undefined
          )
        );

      // Sort
      if (input.sortBy === "most-downloaded") {
        query = query.orderBy(desc(cards.downloadsCount)) as any;
      } else if (input.sortBy === "occasion") {
        query = query.orderBy(cards.occasionId) as any;
      } else {
        query = query.orderBy(desc(cards.createdAt)) as any;
      }

      const results = await (query as any).limit(input.limit).offset(input.offset);

      // Total count
      const totalResult = await ctx.db
        .select({ count: count() })
        .from(cards)
        .leftJoin(occasions, eq(cards.occasionId, occasions.id))
        .where(
          and(
            eq(cards.isActive, true),
            input.occasionSlug
              ? eq(occasions.slug, input.occasionSlug)
              : undefined
          )
        );

      return {
        cards: results,
        total: totalResult[0]?.count ?? 0,
      };
    }),

  // ===========================
  // GET single card (public)
  // ===========================
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select()
        .from(cards)
        .leftJoin(occasions, eq(cards.occasionId, occasions.id))
        .where(eq(cards.id, input.id))
        .limit(1);

      if (!result[0]) {
        throw new Error("البطاقة غير موجودة");
      }

      return result[0];
    }),

  // ===========================
  // GET featured cards (public)
  // ===========================
  getFeatured: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select({
        id: cards.id,
        titleAr: cards.titleAr,
        imageUrl: cards.imageUrl,
        occasionTitleAr: occasions.titleAr,
        occasionSlug: occasions.slug,
        downloadsCount: cards.downloadsCount,
      })
      .from(cards)
      .leftJoin(occasions, eq(cards.occasionId, occasions.id))
      .where(and(eq(cards.isActive, true), eq(cards.isFeatured, true)))
      .orderBy(desc(cards.downloadsCount))
      .limit(8);
  }),

  // ===========================
  // Record download (public)
  // ===========================
  recordDownload: publicProcedure
    .input(
      z.object({
        cardId: z.number(),
        userName: z.string().max(100).optional(),
        ipAddress: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Hash IP for privacy
      const ipHash = input.ipAddress
        ? crypto
            .createHash("sha256")
            .update(input.ipAddress + process.env.IP_HASH_SALT || "salt")
            .digest("hex")
        : null;

      // Record download
      await ctx.db.insert(cardDownloads).values({
        cardId: input.cardId,
        userName: input.userName,
        ipHash: ipHash ?? undefined,
      });

      // Increment counter
      await ctx.db
        .update(cards)
        .set({ downloadsCount: sql`${cards.downloadsCount} + 1` })
        .where(eq(cards.id, input.cardId));

      return { success: true };
    }),

  // ===========================
  // ADMIN: Get all cards with stats
  // ===========================
  adminGetAll: adminProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select({
        id: cards.id,
        title: cards.title,
        titleAr: cards.titleAr,
        imageUrl: cards.imageUrl,
        occasionId: cards.occasionId,
        occasionTitleAr: occasions.titleAr,
        downloadsCount: cards.downloadsCount,
        isActive: cards.isActive,
        isFeatured: cards.isFeatured,
        createdAt: cards.createdAt,
      })
      .from(cards)
      .leftJoin(occasions, eq(cards.occasionId, occasions.id))
      .orderBy(desc(cards.createdAt));
  }),

  // ===========================
  // ADMIN: Create card
  // ===========================
  create: adminProcedure
    .input(
      z.object({
        titleAr: z.string().min(1).max(255),
        title: z.string().min(1).max(255),
        imageUrl: z.string().url().or(z.string().startsWith("/")),
        occasionId: z.number(),
        defaultColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default("#FFFFFF"),
        defaultFontSize: z.number().min(12).max(120).default(48),
        defaultPositionX: z.number().min(0).max(100).default(50),
        defaultPositionY: z.number().min(0).max(100).default(50),
        defaultFontFamily: z.string().default("Noto Naskh Arabic"),
        description: z.string().optional(),
        isFeatured: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.insert(cards).values(input).$returningId();
      return { id: result[0].id, success: true };
    }),

  // ===========================
  // ADMIN: Update card
  // ===========================
  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        titleAr: z.string().min(1).max(255).optional(),
        title: z.string().min(1).max(255).optional(),
        imageUrl: z.string().optional(),
        occasionId: z.number().optional(),
        defaultColor: z.string().optional(),
        defaultFontSize: z.number().optional(),
        defaultPositionX: z.number().optional(),
        defaultPositionY: z.number().optional(),
        defaultFontFamily: z.string().optional(),
        description: z.string().optional(),
        isActive: z.boolean().optional(),
        isFeatured: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      await ctx.db.update(cards).set(data).where(eq(cards.id, id));
      return { success: true };
    }),

  // ===========================
  // ADMIN: Delete card
  // ===========================
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(cards).where(eq(cards.id, input.id));
      return { success: true };
    }),

  // ===========================
  // ADMIN: Toggle active status
  // ===========================
  toggleActive: adminProcedure
    .input(z.object({ id: z.number(), isActive: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(cards)
        .set({ isActive: input.isActive })
        .where(eq(cards.id, input.id));
      return { success: true };
    }),

  // ===========================
  // ADMIN: Dashboard stats
  // ===========================
  getStats: adminProcedure.query(async ({ ctx }) => {
    const [totalCards] = await ctx.db
      .select({ count: count() })
      .from(cards);

    const [activeCards] = await ctx.db
      .select({ count: count() })
      .from(cards)
      .where(eq(cards.isActive, true));

    const [totalDownloads] = await ctx.db
      .select({ total: sql<number>`SUM(${cards.downloadsCount})` })
      .from(cards);

    const [totalOccasions] = await ctx.db
      .select({ count: count() })
      .from(occasions);

    const topCards = await ctx.db
      .select({
        id: cards.id,
        titleAr: cards.titleAr,
        imageUrl: cards.imageUrl,
        downloadsCount: cards.downloadsCount,
        occasionTitleAr: occasions.titleAr,
      })
      .from(cards)
      .leftJoin(occasions, eq(cards.occasionId, occasions.id))
      .orderBy(desc(cards.downloadsCount))
      .limit(5);

    // Downloads per occasion
    const downloadsByOccasion = await ctx.db
      .select({
        occasionTitleAr: occasions.titleAr,
        total: sql<number>`SUM(${cards.downloadsCount})`,
      })
      .from(cards)
      .leftJoin(occasions, eq(cards.occasionId, occasions.id))
      .groupBy(occasions.id, occasions.titleAr);

    return {
      totalCards: totalCards.count,
      activeCards: activeCards.count,
      totalDownloads: totalDownloads.total ?? 0,
      totalOccasions: totalOccasions.count,
      topCards,
      downloadsByOccasion,
    };
  }),
});

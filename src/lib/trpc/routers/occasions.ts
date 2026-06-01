import { z } from "zod";
import { router, publicProcedure, adminProcedure } from "../init";
import { occasions } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

export const occasionsRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(occasions)
      .where(eq(occasions.isActive, true))
      .orderBy(asc(occasions.sortOrder));
  }),

  adminGetAll: adminProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(occasions).orderBy(asc(occasions.sortOrder));
  }),

  create: adminProcedure
    .input(
      z.object({
        title: z.string().min(1).max(255),
        titleAr: z.string().min(1).max(255),
        slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
        description: z.string().optional(),
        icon: z.string().optional(),
        color: z.string().optional(),
        sortOrder: z.number().default(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.insert(occasions).values(input).$returningId();
      return { id: result[0].id, success: true };
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        titleAr: z.string().optional(),
        description: z.string().optional(),
        isActive: z.boolean().optional(),
        sortOrder: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      await ctx.db.update(occasions).set(data).where(eq(occasions.id, id));
      return { success: true };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(occasions).where(eq(occasions.id, input.id));
      return { success: true };
    }),
});

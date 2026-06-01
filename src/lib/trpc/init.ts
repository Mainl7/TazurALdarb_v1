import { initTRPC, TRPCError } from "@trpc/server";
import { type Session } from "next-auth";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ZodError } from "zod";

// Context type
export type Context = {
  db: typeof db;
  session: Session | null;
};

// Create context for each request
export async function createContext(): Promise<Context> {
  const session = (await auth()) as Session | null;
  return { db, session };
}

// Initialize tRPC
const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

// Base router and procedure
export const router = t.router;
export const publicProcedure = t.procedure;

// Auth middleware
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "غير مصرح لك بالوصول" });
  }
  return next({
    ctx: {
      ...ctx,
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

// Admin middleware
const isAdmin = t.middleware(async ({ ctx, next }) => {
  console.log("TRPC Admin Middleware Session:", JSON.stringify(ctx.session, null, 2));
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "غير مصرح لك بالوصول" });
  }
  const role = (ctx.session.user as any).role;
  console.log("TRPC Admin Middleware Role:", role);
  if (role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "هذه العملية تتطلب صلاحيات المدير" });
  }
  return next({ ctx });
});

export const protectedProcedure = t.procedure.use(isAuthed);
export const adminProcedure = t.procedure.use(isAdmin);

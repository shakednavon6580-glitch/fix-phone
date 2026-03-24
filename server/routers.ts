import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";
import { invokeLLM } from "./_core/llm";
import { nanoid } from "nanoid";
import { authenticateUser } from "./tempAuth";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    // Temporary local login for testing
    localLogin: publicProcedure
      .input(z.object({
        username: z.string(),
        password: z.string(),
      }))
      .mutation(({ input }) => {
        return authenticateUser(input.username, input.password);
      }),
  }),

  // Repair management
  repairs: router({
    getByCaseNumber: publicProcedure
      .input(z.object({ caseNumber: z.string() }))
      .query(async ({ input }) => {
        const repair = await db.getRepairByCaseNumber(input.caseNumber);
        if (!repair) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "מספר תיקון לא נמצא במערכת",
          });
        }
        return repair;
      }),

    getAll: protectedProcedure.query(async () => {
      return await db.getAllRepairs();
    }),

    create: protectedProcedure
      .input(z.object({
        caseNumber: z.string(),
        customerName: z.string(),
        customerPhone: z.string(),
        customerEmail: z.string().optional(),
        deviceType: z.string(),
        deviceModel: z.string().optional(),
        issueDescription: z.string(),
        estimatedPrice: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createRepair({
          ...input,
          status: "awaiting_service",
        });
        return { success: true };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["awaiting_service", "in_progress", "awaiting_parts", "completed", "delivered", "canceled"]).optional(),
        finalPrice: z.string().optional(),
        technicianNotes: z.string().optional(),
        completedAt: z.date().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        await db.updateRepair(id, updates);
        return { success: true };
      }),
  }),

  // B2B Lead management
  b2bLeads: router({
    getAll: protectedProcedure.query(async () => {
      return await db.getAllB2BLeads();
    }),

    create: publicProcedure
      .input(z.object({
        companyName: z.string(),
        contactName: z.string(),
        contactEmail: z.string().email(),
        contactPhone: z.string(),
        companySize: z.enum(["1-10", "11-50", "51-100", "100+"]),
        servicesInterested: z.string(), // JSON string
        message: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createB2BLead({
          ...input,
          status: "new",
        });
        return { success: true };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["new", "contacted", "qualified", "proposal_sent", "won", "lost"]).optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        await db.updateB2BLead(id, updates);
        return { success: true };
      }),
  }),

  // Products
  products: router({
    getAll: publicProcedure.query(async () => {
      return await db.getAllProducts();
    }),

    getByCategory: publicProcedure
      .input(z.object({ category: z.string() }))
      .query(async ({ input }) => {
        return await db.getProductsByCategory(input.category);
      }),

    getLowStock: protectedProcedure.query(async () => {
      return await db.getLowStockProducts();
    }),
  }),

  // Blog
  blog: router({
    getAll: publicProcedure.query(async () => {
      return await db.getPublishedBlogPosts();
    }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const post = await db.getBlogPostBySlug(input.slug);
        if (!post) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "פוסט לא נמצא",
          });
        }
        return post;
      }),
  }),

  // Dashboard stats
  dashboard: router({
    getStats: protectedProcedure.query(async () => {
      const allRepairs = await db.getAllRepairs();
      const allLeads = await db.getAllB2BLeads();
      const lowStockProducts = await db.getLowStockProducts();

      const activeRepairs = allRepairs.filter(
        r => r.status === "in_progress" || r.status === "awaiting_parts"
      ).length;

      const newLeads = allLeads.filter(l => l.status === "new").length;

      return {
        activeRepairs,
        newLeads,
        totalCustomers: allRepairs.length,
        lowStockAlerts: lowStockProducts.length,
      };
    }),
  }),

  // Chatbot
  chatbot: router({
    sendMessage: publicProcedure
      .input(z.object({
        sessionId: z.string().optional(),
        message: z.string(),
      }))
      .mutation(async ({ input }) => {
        const sessionId = input.sessionId || nanoid();
        
        // Get existing conversation or create new one
        const existingConversation = await db.getChatConversation(sessionId);
        const messages = existingConversation 
          ? JSON.parse(existingConversation.messages)
          : [];

        // Add user message
        messages.push({
          role: "user",
          content: input.message,
        });

        // System prompt with business context
        const systemPrompt = `אתה עוזר וירטואלי של Fix Phone, מעבדת תיקון מכשירים וספק שירותי IT.

מידע על העסק:
- שירותי תיקון: תיקון מכשירים ניידים, טאבלטים ומחשבים נישאים
- שירותי IT לעסקים: ניהול IT מלא, אבטחת מידע, פתרונות ענן, תמיכה טכנית
- מיקום: רחוב הטכנולוגיה 123, תל אביב
- שעות פעילות: ראשון-חמישי 9:00-18:00, שישי 9:00-14:00
- טלפון: 03-1234567
- דוא"ל: info@fixphone.co.il

אחריות:
- אחריות מלאה על כל תיקון למשך 90 יום
- חלקים מקוריים בלבד
- אם התיקון לא מצליח, לא גובים תשלום

שאלות נפוצות:
1. כמה זמן לוקח תיקון? בדרך כלל 24-48 שעות, תיקונים דחופים תוך מספר שעות
2. האם יש אפשרות למעקב? כן, דרך הפורטל באתר עם מספר התיקון
3. מה כולל שירות IT לעסקים? ניהול תשתיות, תמיכה טכנית, אבטחת מידע, גיבויים, פתרונות ענן
4. האם יש שירות הגעה? כן, לעסקים בלבד

תפקידך:
- ענה בעברית בלבד
- היה ידידותי, מקצועי ועוזר
- ספק מידע מדויק על השירותים
- הפנה ללידים B2B כשמדובר בעסקים
- הפנה לפורטל מעקב תיקונים כשרלוונטי
- אם אין לך תשובה, הצע ליצור קשר ישירות`;

        // Call LLM
        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
          ],
        });

        const messageContent = response.choices[0]?.message?.content;
        const assistantMessage = typeof messageContent === 'string' 
          ? messageContent 
          : "מצטער, לא הצלחתי להבין. אנא נסה שוב.";

        // Add assistant message
        messages.push({
          role: "assistant",
          content: assistantMessage,
        });

        // Save conversation
        await db.upsertChatConversation({
          sessionId,
          messages: JSON.stringify(messages),
        });

        return {
          sessionId,
          message: assistantMessage,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;

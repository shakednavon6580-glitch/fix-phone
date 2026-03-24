import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-admin",
    email: "admin@fixphone.co.il",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

function createPublicContext(): { ctx: TrpcContext } {
  const ctx: TrpcContext = {
    user: undefined,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("repairs router", () => {
  it("should create a new repair with authenticated user", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.repairs.create({
      caseNumber: `TEST-${Date.now()}`,
      customerName: "Test Customer",
      customerPhone: "050-1234567",
      customerEmail: "test@example.com",
      deviceType: "iPhone 13",
      deviceModel: "Pro Max",
      issueDescription: "Screen cracked",
      estimatedPrice: "500",
    });

    expect(result).toEqual({ success: true });
  });

  it("should get all repairs with authenticated user", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const repairs = await caller.repairs.getAll();

    expect(Array.isArray(repairs)).toBe(true);
  });

  it("should update repair status with authenticated user", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // First create a repair
    const caseNumber = `TEST-UPDATE-${Date.now()}`;
    await caller.repairs.create({
      caseNumber,
      customerName: "Update Test",
      customerPhone: "050-9999999",
      deviceType: "Samsung Galaxy",
      issueDescription: "Battery issue",
    });

    // Get the repair
    const repairs = await caller.repairs.getAll();
    const testRepair = repairs.find(r => r.caseNumber === caseNumber);
    
    if (testRepair) {
      const result = await caller.repairs.update({
        id: testRepair.id,
        status: "in_progress",
        technicianNotes: "Started working on battery replacement",
      });

      expect(result).toEqual({ success: true });
    }
  });
});

describe("b2bLeads router", () => {
  it("should create a new B2B lead from public user", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.b2bLeads.create({
      companyName: "Test Company Ltd",
      contactName: "John Doe",
      contactEmail: "john@testcompany.com",
      contactPhone: "03-9999999",
      companySize: "11-50",
      servicesInterested: JSON.stringify(["managed-it", "security"]),
      message: "We need IT support",
    });

    expect(result).toEqual({ success: true });
  });

  it("should get all leads with authenticated user", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const leads = await caller.b2bLeads.getAll();

    expect(Array.isArray(leads)).toBe(true);
  });

  it("should update lead status with authenticated user", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // First create a lead
    await caller.b2bLeads.create({
      companyName: `Test Update Company ${Date.now()}`,
      contactName: "Jane Smith",
      contactEmail: `jane${Date.now()}@test.com`,
      contactPhone: "03-8888888",
      companySize: "1-10",
      servicesInterested: JSON.stringify(["cloud"]),
    });

    // Get all leads
    const leads = await caller.b2bLeads.getAll();
    const testLead = leads[leads.length - 1]; // Get the last one we just created
    
    if (testLead) {
      const result = await caller.b2bLeads.update({
        id: testLead.id,
        status: "contacted",
        notes: "Called and discussed requirements",
      });

      expect(result).toEqual({ success: true });
    }
  });
});

describe("dashboard router", () => {
  it("should return dashboard stats with authenticated user", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const stats = await caller.dashboard.getStats();

    expect(stats).toHaveProperty("activeRepairs");
    expect(stats).toHaveProperty("newLeads");
    expect(stats).toHaveProperty("totalCustomers");
    expect(stats).toHaveProperty("lowStockAlerts");
    expect(typeof stats.activeRepairs).toBe("number");
    expect(typeof stats.newLeads).toBe("number");
    expect(typeof stats.totalCustomers).toBe("number");
    expect(typeof stats.lowStockAlerts).toBe("number");
  });
});

describe("products router", () => {
  it("should get all products from public user", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const products = await caller.products.getAll();

    expect(Array.isArray(products)).toBe(true);
  });

  it("should get low stock products with authenticated user", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const lowStockProducts = await caller.products.getLowStock();

    expect(Array.isArray(lowStockProducts)).toBe(true);
  });
});

describe("blog router", () => {
  it("should get all published blog posts from public user", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const posts = await caller.blog.getAll();

    expect(Array.isArray(posts)).toBe(true);
  });
});

describe("chatbot router", () => {
  it("should send message and get response from public user", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.chatbot.sendMessage({
      message: "מה שעות הפעילות שלכם?",
    });

    expect(result).toHaveProperty("sessionId");
    expect(result).toHaveProperty("message");
    expect(typeof result.sessionId).toBe("string");
    expect(typeof result.message).toBe("string");
    expect(result.message.length).toBeGreaterThan(0);
  });

  it("should maintain conversation with session ID", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // First message
    const firstResult = await caller.chatbot.sendMessage({
      message: "שלום",
    });

    expect(firstResult.sessionId).toBeDefined();

    // Second message with same session
    const secondResult = await caller.chatbot.sendMessage({
      sessionId: firstResult.sessionId,
      message: "תודה",
    });

    expect(secondResult.sessionId).toBe(firstResult.sessionId);
  }, 10000);
});

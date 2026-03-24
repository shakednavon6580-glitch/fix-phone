import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, repairs, b2bLeads, products, blogPosts, chatConversations, InsertRepair, InsertB2BLead, InsertProduct, InsertBlogPost, InsertChatConversation } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Repair queries
export async function getRepairByCaseNumber(caseNumber: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(repairs).where(eq(repairs.caseNumber, caseNumber)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllRepairs() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(repairs);
}

export async function createRepair(repair: InsertRepair) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(repairs).values(repair);
}

export async function updateRepair(id: number, updates: Partial<InsertRepair>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(repairs).set(updates).where(eq(repairs.id, id));
}

// B2B Lead queries
export async function getAllB2BLeads() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(b2bLeads);
}

export async function createB2BLead(lead: InsertB2BLead) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(b2bLeads).values(lead);
}

export async function updateB2BLead(id: number, updates: Partial<InsertB2BLead>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(b2bLeads).set(updates).where(eq(b2bLeads.id, id));
}

// Product queries
export async function getAllProducts() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(products).where(eq(products.isActive, true));
}

export async function getProductsByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(products).where(eq(products.categoryHebrew, category));
}

export async function getLowStockProducts() {
  const db = await getDb();
  if (!db) return [];
  
  const allProducts = await db.select().from(products);
  return allProducts.filter(p => p.stockQuantity <= p.lowStockThreshold);
}

// Blog queries
export async function getPublishedBlogPosts() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(blogPosts).where(eq(blogPosts.isPublished, true));
}

export async function getBlogPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Chat conversation queries
export async function getChatConversation(sessionId: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(chatConversations).where(eq(chatConversations.sessionId, sessionId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertChatConversation(conversation: InsertChatConversation) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(chatConversations).values(conversation).onDuplicateKeyUpdate({
    set: {
      messages: conversation.messages,
      updatedAt: new Date(),
    },
  });
}

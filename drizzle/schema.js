import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean } from "drizzle-orm/mysql-core";
/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
    id: int("id").autoincrement().primaryKey(),
    openId: varchar("openId", { length: 64 }).notNull().unique(),
    name: text("name"),
    email: varchar("email", { length: 320 }),
    loginMethod: varchar("loginMethod", { length: 64 }),
    role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
    lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});
/**
 * Repair cases table - tracks all device repairs
 */
export const repairs = mysqlTable("repairs", {
    id: int("id").autoincrement().primaryKey(),
    caseNumber: varchar("caseNumber", { length: 50 }).notNull().unique(),
    customerName: varchar("customerName", { length: 255 }).notNull(),
    customerPhone: varchar("customerPhone", { length: 50 }).notNull(),
    customerEmail: varchar("customerEmail", { length: 320 }),
    deviceType: varchar("deviceType", { length: 100 }).notNull(), // e.g., iPhone 13, Samsung Galaxy S21
    deviceModel: varchar("deviceModel", { length: 100 }),
    issueDescription: text("issueDescription").notNull(),
    status: mysqlEnum("status", [
        "awaiting_service",
        "in_progress",
        "awaiting_parts",
        "completed",
        "delivered",
        "canceled"
    ]).default("awaiting_service").notNull(),
    estimatedPrice: decimal("estimatedPrice", { precision: 10, scale: 2 }),
    finalPrice: decimal("finalPrice", { precision: 10, scale: 2 }),
    technicianNotes: text("technicianNotes"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
    completedAt: timestamp("completedAt"),
});
/**
 * B2B leads table - tracks business customer inquiries
 */
export const b2bLeads = mysqlTable("b2bLeads", {
    id: int("id").autoincrement().primaryKey(),
    companyName: varchar("companyName", { length: 255 }).notNull(),
    contactName: varchar("contactName", { length: 255 }).notNull(),
    contactEmail: varchar("contactEmail", { length: 320 }).notNull(),
    contactPhone: varchar("contactPhone", { length: 50 }).notNull(),
    companySize: mysqlEnum("companySize", [
        "1-10",
        "11-50",
        "51-100",
        "100+"
    ]).notNull(),
    servicesInterested: text("servicesInterested").notNull(), // JSON array of service names
    message: text("message"),
    status: mysqlEnum("status", [
        "new",
        "contacted",
        "qualified",
        "proposal_sent",
        "won",
        "lost"
    ]).default("new").notNull(),
    notes: text("notes"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
/**
 * Products table - catalog of accessories and parts
 */
export const products = mysqlTable("products", {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    nameHebrew: varchar("nameHebrew", { length: 255 }).notNull(),
    description: text("description"),
    descriptionHebrew: text("descriptionHebrew"),
    category: varchar("category", { length: 100 }).notNull(),
    categoryHebrew: varchar("categoryHebrew", { length: 100 }).notNull(),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    discountPrice: decimal("discountPrice", { precision: 10, scale: 2 }),
    stockQuantity: int("stockQuantity").default(0).notNull(),
    lowStockThreshold: int("lowStockThreshold").default(5).notNull(),
    imageUrl: varchar("imageUrl", { length: 500 }),
    isActive: boolean("isActive").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
/**
 * Blog posts table
 */
export const blogPosts = mysqlTable("blogPosts", {
    id: int("id").autoincrement().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    excerpt: text("excerpt"),
    content: text("content").notNull(),
    category: varchar("category", { length: 100 }).notNull(),
    imageUrl: varchar("imageUrl", { length: 500 }),
    metaTitle: varchar("metaTitle", { length: 255 }),
    metaDescription: text("metaDescription"),
    metaKeywords: text("metaKeywords"),
    isPublished: boolean("isPublished").default(false).notNull(),
    publishedAt: timestamp("publishedAt"),
    authorId: int("authorId").references(() => users.id),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
/**
 * Chatbot conversations table - tracks chat sessions
 */
export const chatConversations = mysqlTable("chatConversations", {
    id: int("id").autoincrement().primaryKey(),
    sessionId: varchar("sessionId", { length: 100 }).notNull().unique(),
    messages: text("messages").notNull(), // JSON array of messages
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

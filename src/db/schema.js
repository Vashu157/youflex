import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable(
    "users",
    {
        id : serial("id").primaryKey(),
        username : varchar("name",{length:30}).notNull(),
        fullName: varchar("full_name", { length: 100 }).notNull(),
        email : varchar("email",{length:200}).notNull(),
        passwordHash: text("password_hash").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().notNull(),
    },
    (table) => [
      uniqueIndex("users_username_idx").on(table.username),
      uniqueIndex("users_email_idx").on(table.email),
    ]
);  

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),

  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),

  bio: text("bio"),
  headline: varchar("headline", { length: 150 }),

  // keep this simple for now
  domain: varchar("domain", { length: 50 }),

  leetcodeUsername: varchar("leetcode_username", { length: 100 }),
  codeforcesUsername: varchar("codeforces_username", { length: 100 }),

  githubUrl: text("github_url"),
  linkedinUrl: text("linkedin_url"),
  replitUrl: text("replit_url"),
  websiteUrl: text("website_url"),

  avatarUrl: text("avatar_url"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),

  userId: integer("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  content: text("content").notNull(),
  upvotes: integer("upvotes").default(0).notNull(),
  downvotes: integer("downvotes").default(0).notNull(),
  comments: integer("comments").default(0).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  varchar,
  boolean,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations, type InferSelectModel } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

export const userTable = pgTable("users", {
  id: serial("id").primaryKey(),
  googleId: varchar("google_id", { length: 255 }).unique(),
  githubId: varchar("github_id", { length: 255 }).unique(),
  username: varchar("username", { length: 255 }),
  email: text("email").unique().notNull(),
  picture: text("picture").notNull(),
  name: varchar("name", { length: 255 }),
  discordId: varchar("discord_id", { length: 255 }).unique(),
});

export const sessionTable = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const projectsTable = pgTable("projects", {
  id: varchar("id", { length: 29 })
    .primaryKey()
    .$defaultFn(() => `proj_${createId()}`),
  userId: integer("user_id")
    .notNull()
    .references(() => userTable.id),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const apiKeysTable = pgTable("api_keys", {
  id: varchar("id", { length: 32 })
    .primaryKey()
    .$defaultFn(() => `key_${createId()}`),
  name: varchar("name", { length: 255 }).notNull(),
  key: text("key").notNull(),
  projectId: varchar("project_id", { length: 29 })
    .notNull()
    .references(() => projectsTable.id),
  isLive: boolean("is_live").notNull().default(false),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  }),
  lastUsedAt: timestamp("last_used_at", {
    withTimezone: true,
    mode: "date",
  }),
  usage: integer("usage").default(0),
});

export const eventTable = pgTable("events", {
  id: varchar("id", { length: 28 })
    .$defaultFn(() => createId())
    .primaryKey(),

  projectId: varchar("project_id", { length: 29 })
    .notNull()
    .references(() => projectsTable.id, {
      onDelete: "cascade",
    }),
  apiKeyId: varchar("api_key_id", { length: 29 })
    .notNull()
    .references(() => apiKeysTable.id, {
      onDelete: "cascade",
    }),

  title: varchar("title", { length: 255 }).notNull(),
  message: text("message"),

  fields: jsonb("fields").$type<Array<{ name: string; value: string }>>(),

  status: varchar("status", { length: 50 })
    .$type<"sent" | "failed">()
    .notNull(),

  errorMessage: text("error_message"),
  retryCount: integer("retry_count").default(0),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
});

export type User = InferSelectModel<typeof userTable>;
export type Session = InferSelectModel<typeof sessionTable>;
export type Project = InferSelectModel<typeof projectsTable>;
export type ApiKey = InferSelectModel<typeof apiKeysTable>;
export type Event = InferSelectModel<typeof eventTable>;

export const userRelations = relations(userTable, ({ many }) => ({
  sessions: many(sessionTable),
  projects: many(projectsTable),
}));

export const sessionRelations = relations(sessionTable, ({ one }) => ({
  user: one(userTable, {
    fields: [sessionTable.userId],
    references: [userTable.id],
  }),
}));

export const projectRelations = relations(projectsTable, ({ one, many }) => ({
  user: one(userTable, {
    fields: [projectsTable.userId],
    references: [userTable.id],
  }),
  apiKeys: many(apiKeysTable),
}));

export const apiKeyRelations = relations(apiKeysTable, ({ one }) => ({
  project: one(projectsTable, {
    fields: [apiKeysTable.projectId],
    references: [projectsTable.id],
  }),
}));

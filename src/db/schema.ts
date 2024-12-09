import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  varchar,
  boolean,
  pgEnum,
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
  id: varchar("id", { length: 25 })
    .primaryKey()
    .$defaultFn(() => `proj_${createId()}`),
  userId: integer("user_id")
    .notNull()
    .references(() => userTable.id),
  name: varchar("name", { length: 255 }).notNull(),
});

export const apiKeysTable = pgTable("api_keys", {
  id: varchar("id", { length: 32 })
    .primaryKey()
    .$defaultFn(() => `key_${createId()}`),
  name: varchar("name", { length: 255 }).notNull(),
  key: text("key").notNull(),
  projectId: integer("project_id")
    .notNull()
    .references(() => projectsTable.id),
  isLive: boolean("is_live").notNull().default(false),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  }),
  lastUsedAt: timestamp("last_used_at", {
    withTimezone: true,
    mode: "date",
  }),
});

export type User = InferSelectModel<typeof userTable>;
export type Session = InferSelectModel<typeof sessionTable>;
export type Project = InferSelectModel<typeof projectsTable>;
export type ApiKey = InferSelectModel<typeof apiKeysTable>;

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

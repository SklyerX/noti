import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  varchar,
  boolean,
  jsonb,
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
  emailVerified: boolean("email_verified").default(false),
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
    .references(() => projectsTable.id, {
      onDelete: "cascade",
    }),
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

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "incomplete",
  "incomplete_expired",
  "trialing",
  "active",
  "past_due",
  "canceled",
  "cancel_pending",
  "unpaid",
  "paused",
]);

export const planTierEnum = pgEnum("plan_tier", ["free", "basic", "plus"]);

export const subscriptionTable = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => userTable.id),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 })
    .notNull()
    .unique(),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }).notNull(),
  stripePriceId: varchar("stripe_price_id", { length: 255 }).notNull(),
  planTier: planTierEnum("plan_tier").notNull().default("free"),
  status: subscriptionStatusEnum("status").notNull(),
  startDate: timestamp("start_date", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  endDate: timestamp("end_date", {
    withTimezone: true,
    mode: "date",
  }),
  cancelDate: timestamp("cancel_date", {
    withTimezone: true,
    mode: "date",
  }),
  trialEndDate: timestamp("trial_end_date", {
    withTimezone: true,
    mode: "date",
  }),
  lastEventDate: timestamp("last_event_date", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
});

export const magicLinkTypeEnum = pgEnum("magic_link_type", [
  "login",
  "email_change",
]);

export const magicLinkTable = pgTable("magic_links", {
  id: serial("id").primaryKey(),
  type: magicLinkTypeEnum("type").notNull(),
  userId: integer("user_id").references(() => userTable.id),
  token: text("token").notNull(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
});

export type MagicLinkMetadata = {
  login: {
    email: string;
  };
  reset_email: {
    email: string;
  };
};

export type User = InferSelectModel<typeof userTable>;
export type Session = InferSelectModel<typeof sessionTable>;
export type Project = InferSelectModel<typeof projectsTable>;
export type ApiKey = InferSelectModel<typeof apiKeysTable>;
export type Event = InferSelectModel<typeof eventTable>;
export type Subscription = InferSelectModel<typeof subscriptionTable>;
export type MagicLink = InferSelectModel<typeof magicLinkTable>;

export const userRelations = relations(userTable, ({ many, one }) => ({
  sessions: many(sessionTable),
  projects: many(projectsTable),
  subscription: one(subscriptionTable, {
    fields: [userTable.id],
    references: [subscriptionTable.userId],
  }),
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

export const subscriptionRelations = relations(
  subscriptionTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [subscriptionTable.userId],
      references: [userTable.id],
    }),
  })
);

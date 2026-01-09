import { pgTable, text, serial, timestamp, varchar, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  password_hash: text("password_hash"),
  created_at: timestamp("created_at").defaultNow(),
  is_active: boolean("is_active").default(true),
  expires_at: timestamp("expires_at"),
  created_by: text("created_by")
});

export const room_participants = pgTable("room_participants", {
  id: serial("id").primaryKey(),
  room_id: text("room_id").notNull(),
  user_id: text("user_id").notNull(),
  user_name: text("user_name"),
  last_seen: timestamp("last_seen").defaultNow()
});

export const callHistory = pgTable("call_history", {
  id: serial("id").primaryKey(),
  room_id: text("room_id").notNull(),
  user_id: text("user_id").notNull(),
  joined_at: timestamp("joined_at").defaultNow(),
  left_at: timestamp("left_at"),
  duration_minutes: integer("duration_minutes").default(0) 
});

export const insertRoomSchema = createInsertSchema(rooms);
export type Room = typeof rooms.$inferSelect;
export type InsertRoom = typeof rooms.$inferInsert;

import { pgTable, text, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  roomId: varchar("room_id", { length: 255 }).unique().notNull(),
  name: text("name").notNull(),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  roomId: varchar("room_id", { length: 255 }).notNull(),
  username: text("username").notNull(),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const callHistory = pgTable("call_history", {
  id: serial("id").primaryKey(),
  roomId: varchar("room_id", { length: 255 }).notNull(),
  username: text("username").notNull(),
  duration: text("duration").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
});

// Create schemas for validation
export const insertRoomSchema = createInsertSchema(rooms);
export const insertMessageSchema = createInsertSchema(messages);
export const insertCallHistorySchema = createInsertSchema(callHistory);

// Define types
export type Room = typeof rooms.$inferSelect;
export type InsertRoom = typeof rooms.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;
export type CallHistory = typeof callHistory.$inferSelect;
export type InsertCallHistory = typeof callHistory.$inferInsert;

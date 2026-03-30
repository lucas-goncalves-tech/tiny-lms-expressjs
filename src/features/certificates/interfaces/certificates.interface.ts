import { certificatesFull } from "../../../db/schema/views.schema";

export type ICertificateFull = typeof certificatesFull.$inferSelect;

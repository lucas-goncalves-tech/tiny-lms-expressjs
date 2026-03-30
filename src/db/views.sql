--> statement-breakpoint
CREATE VIEW IF NOT EXISTS "lessons_completed_full" AS
SELECT "u"."id", "u"."email", "c"."title" AS "course", "l"."title" AS "lesson", "lc"."completed"
FROM "lessons_completed" AS "lc"
JOIN "users" AS "u" ON "u"."id" = "lc"."user_id"
JOIN "lessons" AS "l" ON "l"."id" = "lc"."lesson_id"
JOIN "courses" AS "c" ON "c"."id" = "lc"."course_id";
--> statement-breakpoint
CREATE VIEW IF NOT EXISTS "courses_stats" AS
SELECT 
    "c"."id",
    "c"."slug",
    "c"."title",
    "c"."description",
    "c"."created",
    COALESCE(SUM("l"."seconds"), 0) AS "total_seconds",
    COUNT("l"."id") AS "total_lessons"
FROM "courses" AS "c"
LEFT JOIN "lessons" AS "l" ON "l"."course_id" = "c"."id"
GROUP BY "c"."id";
--> statement-breakpoint
CREATE VIEW IF NOT EXISTS "courses_user_progress" AS
SELECT 
    "cs"."id",
    "cs"."slug",
    "cs"."title",
    "cs"."description",
    "cs"."created",
    "cs"."total_seconds",
    "cs"."total_lessons",
    "u"."id" AS "user_id",
    COALESCE("lc"."completed_count", 0) AS "completed_lessons"
FROM "courses_stats" AS "cs"
CROSS JOIN "users" AS "u"
LEFT JOIN (
    SELECT "course_id", "user_id", COUNT(*) AS "completed_count"
    FROM "lessons_completed"
    GROUP BY "course_id", "user_id"
) AS "lc" ON "lc"."course_id" = "cs"."id" AND "lc"."user_id" = "u"."id";
--> statement-breakpoint
CREATE VIEW IF NOT EXISTS "certificates_full" AS
SELECT 
    "cert"."id", 
    "cert"."user_id", 
    "u"."name",
    "cert"."course_id", 
    "cs"."title", 
    "cs"."total_seconds",
    "cs"."total_lessons",
    "cert"."completed"
FROM "certificates" AS "cert"
JOIN "users" AS "u" ON "u"."id" = "cert"."user_id"
JOIN "courses_stats" AS "cs" ON "cs"."id" = "cert"."course_id";
--> statement-breakpoint
CREATE VIEW IF NOT EXISTS "lesson_nav" AS
SELECT 
  "cl"."slug" AS "current_slug",
  "l".*
FROM "lessons" AS "cl"
JOIN "lessons" AS "l" ON "l"."course_id" = "cl"."course_id"
WHERE "l"."slug" = "cl"."slug"
   OR "l"."id" = (
      SELECT "id" FROM "lessons" 
      WHERE "course_id" = "cl"."course_id" AND "order" < "cl"."order"
      ORDER BY "order" DESC LIMIT 1
   )
   OR "l"."id" = (
      SELECT "id" FROM "lessons" 
      WHERE "course_id" = "cl"."course_id" AND "order" > "cl"."order"
      ORDER BY "order" ASC LIMIT 1
   )
ORDER BY "l"."order";
--> statement-breakpoint
CREATE VIEW IF NOT EXISTS "lessons_user_progress" AS
SELECT 
    "l"."id",
    "l"."course_id",
    "l"."slug",
    "l"."title",
    "l"."seconds",
    "l"."video",
    "l"."description",
    "l"."order",
    "l"."created",
    "u"."id" AS "user_id",
    "lc"."completed"
FROM "lessons" AS "l"
CROSS JOIN "users" AS "u"
LEFT JOIN "lessons_completed" AS "lc" 
    ON "lc"."lesson_id" = "l"."id" AND "lc"."user_id" = "u"."id";


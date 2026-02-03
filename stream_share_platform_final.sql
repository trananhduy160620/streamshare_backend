-- -------------------------------------------------------------
-- TablePlus 6.8.0(654)
--
-- https://tableplus.com/
--
-- Database: ITECH3108_AnhDuyTran_a2
-- Generation Time: 2026-02-03 19:22:02.9370
-- -------------------------------------------------------------


DROP TABLE IF EXISTS "public"."users";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS users_id_seq;

-- Table Definition
CREATE TABLE "public"."users" (
    "id" int4 NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    "name" text NOT NULL,
    "username" text NOT NULL,
    "password" text NOT NULL,
    "points" int4 NOT NULL DEFAULT 0,
    "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."media";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS media_id_seq;

-- Table Definition
CREATE TABLE "public"."media" (
    "id" int4 NOT NULL DEFAULT nextval('media_id_seq'::regclass),
    "title" text NOT NULL,
    "description" text,
    "url" text NOT NULL,
    "author_id" int4 NOT NULL,
    "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."ratings";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS ratings_id_seq;

-- Table Definition
CREATE TABLE "public"."ratings" (
    "id" int4 NOT NULL DEFAULT nextval('ratings_id_seq'::regclass),
    "user_id" int4 NOT NULL,
    "media_id" int4 NOT NULL,
    "value" int2 NOT NULL CHECK (value = ANY (ARRAY[1, '-1'::integer])),
    "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."hidden_media";
-- Table Definition
CREATE TABLE "public"."hidden_media" (
    "user_id" int4 NOT NULL,
    "media_id" int4 NOT NULL,
    "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("user_id","media_id")
);

INSERT INTO "public"."users" ("id", "name", "username", "password", "points", "created_at", "updated_at") VALUES
(1, 'Vincent Moore', 'vincent.m', '$2a$10$qMKA84kkm3OpfjFGS5ofCOzISAW/BJjVVirnVuKsMc3rJBRiPVxJ.', -10, '2026-01-13 15:17:47.487684', '2026-02-01 00:48:31.964025'),
(3, 'Daniel Nguyen', 'dan.nguyen', '$2a$10$3xZvW6e1nAc/jGObO0OO8.omEFOvEB1hvEwFh7VRHPB9G1Or4Qm/u', 30, '2026-01-13 15:18:54.59084', '2026-02-01 14:34:47.347047'),
(4, 'Michael Tran', 'michael.tr', '$2a$10$4sr.GfSHzvx7yIpPT4WtQOU6QgsVlEaktiw.X.yzH7Hi50ZX3z5Du', 20, '2026-01-13 15:20:26.981301', '2026-02-01 00:48:33.318921'),
(5, 'Jason Wong', 'jason.w', '$2a$10$qMKA84kkm3OpfjFGS5ofCOzISAW/BJjVVirnVuKsMc3rJBRiPVxJ.', 30, '2026-01-13 15:22:26.540988', '2026-02-01 00:49:14.343751'),
(6, 'Chris Park', 'chrisp', '$2a$10$MVvU9uQ2lpm6ciFMpIZjXeq7/2zz3FBWG/CCINdJ3RtgsvS/FaQLq', 10, '2026-01-13 15:29:02.486591', '2026-01-31 03:58:49.51352'),
(7, 'Vincezo', 'vin.t', '$2a$10$STWyl1BNG/7GRa97iCQJ8usozxT9yGe6VOCq81NjVoB82MPK9/2HO', 0, '2026-01-17 01:49:51.54526', '2026-01-31 03:58:49.51352'),
(18, 'AnhDuyTran', 'duy.t', '$2a$10$LRNHyFZ8yqz41u8EpAE/h.RwPBZO2kVFGoT/mwODaeZrwkHIcTeKi', 10, '2026-02-03 19:03:20.135941', '2026-02-03 19:07:44.307491');

INSERT INTO "public"."media" ("id", "title", "description", "url", "author_id", "created_at", "updated_at") VALUES
(1, 'HARDSTYLE GYM - Treat You Better [Virtus Hardstyle Remix]', 'HARDSTYLE GYM - Treat You Better [Virtus Hardstyle Remix]

🔱 The BEST place for zyzz hardstyle remixes and workout music! 🔱

Make Sure You Subscribe 
And Like The Video 
For Our Legend Zyzz', 'https://www.youtube.com/watch?v=A2vBUQTDwM0', 6, '2024-01-13 18:23:49.436749', '2024-01-13 18:23:49.436749'),
(3, 'GYM HARDSTYLE - On & On Hardstyle Remix (4K)', 'High energy hardstyle remix for gym motivation and workout sessions.', 'https://www.youtube.com/watch?v=riWch046AqI', 4, '2023-01-14 12:05:19.912779', '2023-01-14 12:05:19.912779'),
(4, 'GYM HARDSTYLE - Lucky (I''m So Lucky) Hardstyle Remix (4K)', 'Gym hardstyle remix to keep motivation high during intense workouts.', 'https://www.youtube.com/watch?v=Y8SJn0x2ebU', 3, '2024-01-14 12:05:19.912779', '2024-01-14 12:05:19.912779'),
(5, 'Calvin Harris ft. Ellie Goulding - Outside (Hardstyle Remix)', 'Hardstyle remix produced by prodbywhippa.', 'https://www.youtube.com/watch?v=IvyCkd-u2bo', 6, '2025-01-14 12:05:19.912779', '2025-01-14 12:05:19.912779'),
(6, 'Zyzz - Hot N Cold (Mqx Remix)', 'Zyzz inspired gym motivation hardstyle remix.', 'https://www.youtube.com/watch?v=1TorbbvEcZY', 5, '2025-01-14 12:05:19.912779', '2025-01-14 12:05:19.912779'),
(7, 'Rihanna - Don''t Stop The Music (Hardstyle Remix)', 'Hardstyle remix of Rihanna classic track.', 'https://www.youtube.com/watch?v=2eEXRJniPng', 1, '2022-01-14 12:05:19.912779', '2022-01-14 12:05:19.912779'),
(8, 'Outside (Hardstyle)', 'Hardstyle track by crypvolk, released in 2022.', 'https://www.youtube.com/watch?v=tz0fb2JOdFQ', 5, '2023-01-14 12:05:19.912779', '2023-01-14 12:05:19.912779'),
(9, 'Zyzz - Chasing The Sun (Velocity Hardstyle Remix)', 'Gym motivation hardstyle remix inspired by Zyzz legacy.', 'https://www.youtube.com/watch?v=sFsTuH55JO4', 6, '2022-01-14 12:05:19.912779', '2022-01-14 12:05:19.912779'),
(10, 'Nightcore - On & On (Sped Up)', 'Nightcore version of On & On by Cartoon feat. Daniel Levi.', 'https://www.youtube.com/watch?v=uE06qZZJjOc', 3, '2024-01-14 12:05:19.912779', '2024-01-14 12:05:19.912779'),
(11, 'Ellie Goulding - Lights (Zyzz Hardstyle Remix)', 'Hardstyle remix featuring Zyzz gym aesthetics.', 'https://www.youtube.com/watch?v=iw8dfu1Hwqg', 1, '2022-01-14 12:05:19.912779', '2022-01-14 12:05:19.912779'),
(12, 'GYM ERA - Only Girl (In The World) Hardstyle Remix', '4K gym hardstyle remix for high intensity workouts.', 'https://www.youtube.com/watch?v=x23Gc5PvYj4', 4, '2021-01-14 12:05:19.912779', '2021-01-14 12:05:19.912779'),
(13, 'GYM HARDSTYLE - Maroon 5 Payphone Hardstyle Remix', 'Gym hardstyle remix designed for workout motivation.', 'https://www.youtube.com/watch?v=hCWOURDUG9U', 1, '2020-01-14 12:05:19.912779', '2020-01-14 12:05:19.912779'),
(14, 'GYM HARDSTYLE - Locked Out Of Heaven Remix', 'Hardstyle remix featuring gym and aesthetic fitness culture.', 'https://www.youtube.com/watch?v=HEiChQbh0LE', 5, '2023-01-14 12:05:19.912779', '2023-01-14 12:05:19.912779'),
(15, 'GYM HARDSTYLE - Demons (Virtus Remix)', 'Hardstyle remix of Demons, perfect for gym sessions.', 'https://www.youtube.com/watch?v=tyh4UOumjvA', 5, '2026-01-28 12:05:19.912779', '2026-01-14 12:05:19.912779'),
(16, 'I''m So Lucky (Hardstyle Remix)', 'Hardstyle remix version of I''m So Lucky.', 'https://www.youtube.com/watch?v=aWQCL7eybIc', 1, '2026-01-28 12:05:19.912779', '2026-01-14 12:05:19.912779'),
(17, 'Zyzz - Summertime Sadness (Hardstyle Remix)', 'Zyzz inspired hardstyle remix for gym motivation.', 'https://www.youtube.com/watch?v=oaKeQMWbiXc', 1, '2026-01-28 12:05:19.912779', '2026-01-14 12:05:19.912779'),
(18, 'GYM HARDSTYLE - Middle Of The Night (Dom Livez Remix)', 'Hardstyle remix for gym motivation and workouts.', 'https://www.youtube.com/watch?v=oGq2S_wrj3s', 4, '2026-01-28 12:05:19.912779', '2026-01-14 12:05:19.912779'),
(19, 'Everytime We Touch (Hardstyle)', 'Classic hardstyle remix popular in gym culture.', 'https://www.youtube.com/watch?v=GSKCITbXNNs', 3, '2026-01-28 12:05:19.912779', '2026-01-14 12:05:19.912779'),
(20, 'GYM HARDSTYLE - Habits (Stay High) Remix', 'Hardstyle remix for intense gym workouts.', 'https://www.youtube.com/watch?v=YYEuzTFPHc0', 5, '2026-01-28 12:05:19.912779', '2026-01-14 12:05:19.912779'),
(21, 'Clean Bandit - Symphony (Hardstyle Remix)', 'Hardstyle remix featuring Clean Bandit and Zara Larsson.', 'https://www.youtube.com/watch?v=R4UFZQETW7s', 3, '2026-01-28 12:05:19.912779', '2026-01-14 12:05:19.912779'),
(22, 'SICK CVNT - Outside (Hardstyle Sped Up)', 'Sped up hardstyle remix for gym and fitness motivation.', 'https://www.youtube.com/watch?v=HlmIcMnfBvk', 1, '2026-01-28 12:05:19.912779', '2026-01-14 12:05:19.912779'),
(23, 'Chẳng Thể Cảm Hóa (Bản Hot TikTok)', 'Chẳng Thể Cảm Hóa (Bản Hot TikTok) - Lương Quý Tuấn x An Clock ♫ Kể Từ Ngày Đổ Vỡ Anh Vội Xóa Hết Đi Mộng Mơ Remix', 'https://www.youtube.com/watch?v=QiyNixKJSdc', 5, '2026-01-30 02:41:23.477406', '2026-01-30 02:41:23.477406'),
(24, 'MUZYKAD LJA DUSHI - JAPANDEE REMIX | LET HIM COOK', 'MUZYKAD LJA DUSHI - JAPANDEE REMIX | LET HIM COOK', 'https://www.youtube.com/watch?v=6p9i-lZvCeM', 5, '2026-01-30 23:24:29.212633', '2026-01-30 23:24:29.212633'),
(25, 'Bloodhounds X Starboy. Kim Geon-Woo', 'Bloodhounds X Starboy. Kim Geon-Woo #bloodhounds #kdrama #starboy #woodohwan #edit
', 'https://www.youtube.com/watch?v=mXFtjkNi3gk', 5, '2026-01-31 02:17:42.088683', '2026-01-31 02:17:42.088683'),
(26, 'MÃI LÀ CÔ DÂU CỦA ANH 🎤', 'MÃI LÀ CÔ DÂU CỦA ANH 🎤', 'https://www.youtube.com/watch?v=5dOfmAUpnMk', 5, '2026-02-01 14:10:22.912959', '2026-02-01 14:10:22.912959'),
(27, 'Naruto | Ending 1 - Wind | VIZ', 'Naruto | Ending 1 - Wind | VIZ
', 'https://www.youtube.com/watch?v=bdCzOWnEJYc', 5, '2026-02-03 18:52:47.279436', '2026-02-03 18:52:47.279436'),
(28, 'NHÀ MA TẬP 305 | BÁN MÁU ĐỒNG BÀO | CHUYỆN MA KINH DỊ | MC DUY THUẬN | FULL 4K', 'NHÀ MA TẬP 305 | BÁN MÁU ĐỒNG BÀO | CHUYỆN MA KINH DỊ | MC DUY THUẬN | FULL 4K
', 'https://www.youtube.com/watch?v=0LdN95ga05k', 5, '2026-02-03 18:56:40.095947', '2026-02-03 18:56:40.095947'),
(29, 'MONARCH’S TRAINING | Jinwoo’s Power Grind (Solo Leveling Workout Album)', '“MONARCH’S TRAINING” is a brutal dark rock workout album inspired by
Jinwoo’s relentless evolution and the path he forged alone inside the Shadow Realm.

Massive guitars, heavy hybrid drums, shadow pulses and cinematic tension
turn this mix into pure training energy, ideal for pushing past your limits
and reaching new levels of strength.

This album feels like grinding inside a dungeon…
until you rise as the Monarch.', 'https://www.youtube.com/watch?v=q7qDgONVV08', 18, '2026-02-03 19:06:27.693327', '2026-02-03 19:06:27.693327');

INSERT INTO "public"."ratings" ("id", "user_id", "media_id", "value", "created_at", "updated_at") VALUES
(106, 1, 1, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(107, 3, 1, -1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(108, 4, 1, -1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(109, 5, 1, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(110, 6, 1, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(111, 1, 3, -1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(112, 3, 3, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(113, 4, 3, -1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(114, 5, 3, -1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(115, 6, 3, -1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(116, 1, 4, -1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(117, 3, 4, -1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(118, 4, 4, -1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(119, 5, 4, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(120, 6, 4, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(121, 1, 5, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(122, 3, 5, -1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(123, 4, 5, -1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(124, 5, 5, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(125, 6, 5, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(126, 1, 6, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(127, 3, 6, -1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(128, 4, 6, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(130, 6, 6, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(131, 1, 7, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(132, 3, 7, -1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(133, 4, 7, -1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(135, 6, 7, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(136, 1, 8, -1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(137, 3, 8, -1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(138, 4, 8, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(139, 5, 8, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(140, 6, 8, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(141, 1, 9, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(142, 3, 9, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(143, 4, 9, -1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(145, 6, 9, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(146, 1, 10, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(147, 3, 10, -1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(148, 4, 10, -1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(150, 6, 10, -1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(151, 1, 11, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(152, 3, 11, -1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(153, 4, 11, -1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(154, 5, 11, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(155, 6, 11, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(156, 1, 12, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(157, 3, 12, -1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(158, 4, 12, -1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(159, 5, 12, -1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(160, 6, 12, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(161, 1, 13, -1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(162, 3, 13, -1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(163, 4, 13, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(164, 5, 13, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(165, 6, 13, -1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(166, 1, 14, -1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(167, 3, 14, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(168, 4, 14, -1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(169, 5, 14, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(170, 6, 14, -1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(171, 1, 15, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(172, 3, 15, -1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(173, 4, 15, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(174, 5, 15, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(175, 6, 15, -1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(176, 1, 16, -1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(177, 3, 16, -1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(178, 4, 16, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(179, 5, 16, -1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(180, 6, 16, -1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(181, 1, 17, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(182, 3, 17, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(183, 4, 17, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(185, 6, 17, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(186, 1, 18, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(187, 3, 18, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(188, 4, 18, -1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(190, 6, 18, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(191, 1, 19, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(192, 3, 19, -1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(193, 4, 19, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(195, 6, 19, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(196, 1, 20, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(197, 3, 20, -1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(198, 4, 20, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(200, 6, 20, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(201, 1, 21, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(202, 3, 21, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(203, 4, 21, -1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(205, 6, 21, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(206, 1, 22, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(207, 3, 22, -1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(208, 4, 22, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(209, 5, 22, -1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(210, 6, 22, 1, '2026-01-14 16:26:10.241674', '2026-01-14 16:26:10.241674'),
(288, 5, 18, 1, '2026-01-29 11:17:39.156866', '2026-01-29 11:17:39.156866'),
(301, 5, 6, -1, '2026-01-29 12:35:51.8744', '2026-01-29 12:35:51.8744'),
(313, 5, 20, 1, '2026-01-29 13:50:51.577417', '2026-01-29 13:50:51.577417'),
(321, 5, 21, 1, '2026-01-29 13:51:49.637972', '2026-01-29 13:51:49.637972'),
(327, 5, 17, -1, '2026-01-29 13:59:31.19213', '2026-01-29 13:59:31.19213'),
(346, 5, 23, 1, '2026-01-30 23:31:02.041025', '2026-01-30 23:31:02.041025'),
(372, 5, 25, 1, '2026-01-31 02:56:47.069257', '2026-01-31 02:56:47.069257'),
(376, 5, 24, 1, '2026-01-31 03:24:54.394594', '2026-01-31 03:24:54.394594'),
(385, 7, 25, -1, '2026-02-01 00:48:52.932965', '2026-02-01 00:48:52.932965'),
(386, 7, 24, 1, '2026-02-01 00:48:54.725246', '2026-02-01 00:48:54.725246'),
(387, 7, 23, 1, '2026-02-01 00:48:56.075203', '2026-02-01 00:48:56.075203'),
(397, 5, 26, 1, '2026-02-01 14:32:17.372631', '2026-02-01 14:32:17.372631'),
(398, 5, 19, -1, '2026-02-01 14:34:47.341419', '2026-02-01 14:34:47.341419'),
(401, 5, 29, 1, '2026-02-03 19:07:44.302417', '2026-02-03 19:07:44.302417'),
(402, 5, 27, -1, '2026-02-03 19:08:08.971832', '2026-02-03 19:08:08.971832');

INSERT INTO "public"."hidden_media" ("user_id", "media_id", "created_at", "updated_at") VALUES
(1, 7, '2026-01-14 16:55:06.113827', '2026-01-14 16:55:06.113827'),
(1, 11, '2026-01-14 16:55:06.113827', '2026-01-14 16:55:06.113827'),
(1, 13, '2026-01-14 16:55:06.113827', '2026-01-14 16:55:06.113827'),
(1, 16, '2026-01-14 16:55:06.113827', '2026-01-14 16:55:06.113827'),
(3, 10, '2026-01-14 16:55:06.113827', '2026-01-14 16:55:06.113827'),
(3, 19, '2026-01-14 16:55:06.113827', '2026-01-14 16:55:06.113827'),
(3, 21, '2026-01-14 16:55:06.113827', '2026-01-14 16:55:06.113827'),
(4, 12, '2026-01-14 16:55:06.113827', '2026-01-14 16:55:06.113827'),
(4, 18, '2026-01-14 16:55:06.113827', '2026-01-14 16:55:06.113827'),
(5, 17, '2026-02-03 19:09:30.612081', '2026-02-03 19:09:30.612081'),
(5, 24, '2026-02-03 19:09:32.117968', '2026-02-03 19:09:32.117968'),
(5, 29, '2026-02-03 19:09:34.079631', '2026-02-03 19:09:34.079631'),
(6, 5, '2026-01-14 16:55:06.113827', '2026-01-14 16:55:06.113827'),
(6, 9, '2026-01-14 16:55:06.113827', '2026-01-14 16:55:06.113827');



-- Indices
CREATE UNIQUE INDEX users_username_key ON public.users USING btree (username);
ALTER TABLE "public"."media" ADD FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;
ALTER TABLE "public"."ratings" ADD FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE CASCADE;
ALTER TABLE "public"."ratings" ADD FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;


-- Indices
CREATE UNIQUE INDEX uq_user_media_rating ON public.ratings USING btree (user_id, media_id);
ALTER TABLE "public"."hidden_media" ADD FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE CASCADE;
ALTER TABLE "public"."hidden_media" ADD FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;

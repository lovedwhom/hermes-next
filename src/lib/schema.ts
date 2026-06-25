import { getDb } from './db';

export function initDatabase(): void {
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS characters (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      gender TEXT NOT NULL,
      age INTEGER NOT NULL,
      body_hair TEXT,
      body_eyes TEXT,
      body_skin TEXT,
      body_face TEXT,
      body_build TEXT,
      outfits TEXT,
      weapon TEXT,
      style TEXT,
      prompt TEXT,
      images_nude TEXT,
      images_clothed TEXT,
      images_clothed_variants TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS clothing (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      type TEXT,
      color TEXT,
      style TEXT,
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS weapons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      type TEXT,
      element TEXT,
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      title TEXT NOT NULL,
      theme TEXT,
      style TEXT,
      duration TEXT,
      format TEXT,
      character TEXT,
      mood TEXT,
      music_vibe TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS scenes (
      id TEXT PRIMARY KEY,
      project_id INTEGER,
      scene_number INTEGER NOT NULL,
      location TEXT,
      time_of_day TEXT,
      description TEXT,
      dialogue TEXT,
      camera TEXT,
      FOREIGN KEY (project_id) REFERENCES projects(id)
    );

    CREATE TABLE IF NOT EXISTS video_clips (
      id TEXT PRIMARY KEY,
      scene_id TEXT,
      project_id INTEGER,
      "order" INTEGER NOT NULL,
      thumbnail_url TEXT,
      video_url TEXT,
      duration INTEGER,
      status TEXT CHECK(status IN ('pending', 'generating', 'ready', 'failed')),
      prompt TEXT,
      FOREIGN KEY (scene_id) REFERENCES scenes(id),
      FOREIGN KEY (project_id) REFERENCES projects(id)
    );

    CREATE TABLE IF NOT EXISTS uploaded_images (
      id TEXT PRIMARY KEY,
      filename TEXT NOT NULL,
      public_url TEXT NOT NULL,
      category TEXT CHECK(category IN ('character', 'project', 'general')),
      reference_id TEXT,
      tag TEXT,
      file_size INTEGER,
      mime_type TEXT,
      created_at TEXT NOT NULL
    );
  `);
}

export function seedDatabase(): void {
  const db = getDb();
  
  const characterCount = db.prepare('SELECT COUNT(*) as count FROM characters').get() as { count: number };
  if (characterCount.count > 0) return;

  const insertCharacter = db.prepare(`
    INSERT INTO characters (id, name, gender, age, body_hair, body_eyes, body_skin, body_face, body_build, outfits, weapon, style, prompt, images_nude, images_clothed, images_clothed_variants, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const characters = [
    {
      id: 'ling-shuang',
      name: '凌霜',
      gender: 'female',
      age: 25,
      body_hair: 'deep plum red wavy long hair, side swept bangs, voluminous waves',
      body_eyes: 'emerald green cat-eyes, sharp alluring gaze, long lashes',
      body_skin: 'porcelain white with cool undertone, flawless complexion',
      body_face: 'stunning V-jawline, high cheekbones, full red lips, elegant nose',
      body_build: '172cm, curvaceous hourglass, long legs, graceful proportions',
      outfits: JSON.stringify(['性感御姐装']),
      weapon: null,
      style: 'Makoto Shinkai anime realistic, soft cinematic lighting, warm color palette, ultra beauty',
      prompt: 'A beautiful woman with deep plum red wavy long hair, emerald green cat-eyes, porcelain white skin, stunning V-jawline, wearing a sexy mature outfit, Makoto Shinkai anime realistic style, soft cinematic lighting, warm color palette, ultra beauty',
      images_nude: '/assets/characters/凌霜/nude.png',
      images_clothed: '/assets/characters/凌霜/clothed_02.png',
      images_clothed_variants: JSON.stringify([
        { name: '定妆照 v1 (新中式)', path: '/assets/characters/凌霜/clothed_01.png' },
        { name: '定妆照 v2 (性感御姐)', path: '/assets/characters/凌霜/clothed_02.png' },
        { name: '定妆照 v4 (赛博朋克)', path: '/assets/characters/凌霜/clothed_04.png' },
      ]),
      created_at: '2026-06-23 17:10:00',
    },
    {
      id: 'lin-yu',
      name: '林羽',
      gender: 'male',
      age: 21,
      body_hair: 'short neat black hair with soft side part',
      body_eyes: 'warm dark brown eyes, almond shape',
      body_skin: 'light beige skin with warm undertone',
      body_face: 'oval face, gentle expression',
      body_build: 'slim athletic, 175cm',
      outfits: JSON.stringify(['深蓝卫衣', '黑色工装裤']),
      weapon: '光剑',
      style: 'Makoto Shinkai anime realistic',
      prompt: 'A handsome young man with short neat black hair, warm dark brown eyes, light beige skin, oval face, slim athletic build, wearing dark blue hoodie and black cargo pants, holding a lightsaber, Makoto Shinkai anime realistic style',
      images_nude: '/assets/characters/林羽/nude.png',
      images_clothed: '/assets/characters/林羽/clothed.png',
      images_clothed_variants: null,
      created_at: '2026-06-22 19:08:22',
    },
    {
      id: 'ling-ye',
      name: '凌夜',
      gender: 'female',
      age: 20,
      body_hair: 'asymmetric short hair, left side buzzed undercut, right side falling to jaw, vivid blue-purple gradient color with neon tips',
      body_eyes: 'glowing neon cyan eyes with subtle LED-like ring pattern in iris',
      body_skin: 'pale cool-toned porcelain skin with bioluminescent circuit tattoos',
      body_face: 'sharp angular features, high cheekbones, confident smirk, silver ear stud',
      body_build: 'slim athletic, toned arms, 170cm',
      outfits: JSON.stringify(['赛博朋克夹克']),
      weapon: null,
      style: 'Cyberpunk, neon aesthetic, dark tech vibe',
      prompt: 'A cyberpunk girl with asymmetric short blue-purple gradient hair, glowing neon cyan eyes with LED ring pattern, pale porcelain skin with bioluminescent circuit tattoos, sharp angular features, wearing cyberpunk jacket, cyberpunk neon aesthetic style',
      images_nude: '/assets/characters/凌夜/nude.png',
      images_clothed: '/assets/characters/凌夜/clothed.png',
      images_clothed_variants: null,
      created_at: '2026-06-23 11:05:54',
    },
    {
      id: 'bai-lu',
      name: '白露',
      gender: 'female',
      age: 19,
      body_hair: 'long flowing silver hair past waist, soft bangs',
      body_eyes: 'large sparkling violet eyes',
      body_skin: 'fair porcelain skin, no blemishes',
      body_face: 'delicate features, gentle warm smile',
      body_build: 'slim graceful, 165cm',
      outfits: JSON.stringify(['白色连衣裙']),
      weapon: '法杖',
      style: 'Fantasy, ethereal, Makoto Shinkai anime realistic',
      prompt: 'A beautiful fantasy girl with long flowing silver hair, large sparkling violet eyes, fair porcelain skin, delicate features, wearing white dress, holding a staff, fantasy ethereal Makoto Shinkai anime realistic style',
      images_nude: '/assets/characters/白露/nude.png',
      images_clothed: '/assets/characters/白露/clothed.png',
      images_clothed_variants: null,
      created_at: '2026-06-22 19:08:22',
    },
  ];

  const insertMany = db.transaction(() => {
    for (const char of characters) {
      insertCharacter.run(
        char.id, char.name, char.gender, char.age,
        char.body_hair, char.body_eyes, char.body_skin, char.body_face, char.body_build,
        char.outfits, char.weapon, char.style, char.prompt,
        char.images_nude, char.images_clothed, char.images_clothed_variants,
        char.created_at
      );
    }
  });

  insertMany();
}

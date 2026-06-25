// 角色数据 — 从 /var/www/videos/assets/characters/ 导入
// 对应 types/index.ts 中的 CharacterData

export interface CharacterAsset {
  id: string;
  name: string;
  gender: string;
  age: number;
  body: {
    hair: string;
    eyes: string;
    skin: string;
    face: string;
    build: string;
  };
  outfits: string[];
  weapon: string | null;
  style: string;
  prompt: string;
  images: {
    nude: string;
    clothed: string;
    clothedVariants?: { name: string; path: string }[];
  };
  created_at: string;
}

export const characters: CharacterAsset[] = [
  {
    id: 'ling-shuang',
    name: '凌霜',
    gender: 'female',
    age: 25,
    body: {
      hair: 'deep plum red wavy long hair, side swept bangs, voluminous waves',
      eyes: 'emerald green cat-eyes, sharp alluring gaze, long lashes',
      skin: 'porcelain white with cool undertone, flawless complexion',
      face: 'stunning V-jawline, high cheekbones, full red lips, elegant nose',
      build: '172cm, curvaceous hourglass, long legs, graceful proportions',
    },
    outfits: ['性感御姐装'],
    weapon: null,
    style: 'Makoto Shinkai anime realistic, soft cinematic lighting, warm color palette, ultra beauty',
    prompt: 'A beautiful woman with deep plum red wavy long hair, emerald green cat-eyes, porcelain white skin, stunning V-jawline, wearing a sexy mature outfit, Makoto Shinkai anime realistic style, soft cinematic lighting, warm color palette, ultra beauty',
    images: {
      nude: '/assets/characters/凌霜/nude.png',
      clothed: '/assets/characters/凌霜/clothed_02.png',
      clothedVariants: [
        { name: '定妆照 v1 (新中式)', path: '/assets/characters/凌霜/clothed_01.png' },
        { name: '定妆照 v2 (性感御姐)', path: '/assets/characters/凌霜/clothed_02.png' },
        { name: '定妆照 v4 (赛博朋克)', path: '/assets/characters/凌霜/clothed_04.png' },
      ],
    },
    created_at: '2026-06-23 17:10:00',
  },
  {
    id: 'lin-yu',
    name: '林羽',
    gender: 'male',
    age: 21,
    body: {
      hair: 'short neat black hair with soft side part',
      eyes: 'warm dark brown eyes, almond shape',
      skin: 'light beige skin with warm undertone',
      face: 'oval face, gentle expression',
      build: 'slim athletic, 175cm',
    },
    outfits: ['深蓝卫衣', '黑色工装裤'],
    weapon: '光剑',
    style: 'Makoto Shinkai anime realistic',
    prompt: 'A handsome young man with short neat black hair, warm dark brown eyes, light beige skin, oval face, slim athletic build, wearing dark blue hoodie and black cargo pants, holding a lightsaber, Makoto Shinkai anime realistic style',
    images: {
      nude: '/assets/characters/林羽/nude.png',
      clothed: '/assets/characters/林羽/clothed.png',
    },
    created_at: '2026-06-22 19:08:22',
  },
  {
    id: 'ling-ye',
    name: '凌夜',
    gender: 'female',
    age: 20,
    body: {
      hair: 'asymmetric short hair, left side buzzed undercut, right side falling to jaw, vivid blue-purple gradient color with neon tips',
      eyes: 'glowing neon cyan eyes with subtle LED-like ring pattern in iris',
      skin: 'pale cool-toned porcelain skin with bioluminescent circuit tattoos',
      face: 'sharp angular features, high cheekbones, confident smirk, silver ear stud',
      build: 'slim athletic, toned arms, 170cm',
    },
    outfits: ['赛博朋克夹克'],
    weapon: null,
    style: 'Cyberpunk, neon aesthetic, dark tech vibe',
    prompt: 'A cyberpunk girl with asymmetric short blue-purple gradient hair, glowing neon cyan eyes with LED ring pattern, pale porcelain skin with bioluminescent circuit tattoos, sharp angular features, wearing cyberpunk jacket, cyberpunk neon aesthetic style',
    images: {
      nude: '/assets/characters/凌夜/nude.png',
      clothed: '/assets/characters/凌夜/clothed.png',
    },
    created_at: '2026-06-23 11:05:54',
  },
  {
    id: 'bai-lu',
    name: '白露',
    gender: 'female',
    age: 19,
    body: {
      hair: 'long flowing silver hair past waist, soft bangs',
      eyes: 'large sparkling violet eyes',
      skin: 'fair porcelain skin, no blemishes',
      face: 'delicate features, gentle warm smile',
      build: 'slim graceful, 165cm',
    },
    outfits: ['白色连衣裙'],
    weapon: '法杖',
    style: 'Fantasy, ethereal, Makoto Shinkai anime realistic',
    prompt: 'A beautiful fantasy girl with long flowing silver hair, large sparkling violet eyes, fair porcelain skin, delicate features, wearing white dress, holding a staff, fantasy ethereal Makoto Shinkai anime realistic style',
    images: {
      nude: '/assets/characters/白露/nude.png',
      clothed: '/assets/characters/白露/clothed.png',
    },
    created_at: '2026-06-22 19:08:22',
  },
];

// 按 types/index.ts CharacterData 格式导出
export const characterDatas = characters.map((c) => ({
  id: c.id,
  name: c.name,
  age: c.age,
  description: `${c.body.hair}, ${c.body.eyes}, ${c.body.skin}, ${c.body.face}`,
  outfit: Array.isArray(c.outfits) ? c.outfits.join(', ') : c.outfits,
  avatarUrl: c.images.clothed,
  nudeRefUrl: c.images.nude,
}));

// 服装和武器资产 — 从 /var/www/videos/assets/ 导入

export interface ClothingAsset {
  name: string;
  description: string;
  type: string;
  color?: string;
  style?: string;
  created_at?: string;
}

export const clothing: ClothingAsset[] = [
  {
    name: '黑色工装裤',
    description: 'black cargo pants with multiple pockets',
    type: 'bottom',
    color: 'black',
    style: 'casual',
    created_at: '2026-06-22 19:08:22',
  },
  {
    name: '白色连衣裙',
    description: 'elegant white dress with silver trim and soft glow',
    type: 'full',
    color: 'white',
    style: 'fantasy',
    created_at: '2026-06-22 19:08:22',
  },
  {
    name: '赛博朋克夹克',
    description: 'black cyberpunk off-shoulder jacket with glowing neon blue circuit patterns on sleeves, high collar with metallic accents, paired with black high-waist cargo pants and silver chain belt',
    type: 'jacket',
    created_at: '2026-06-23 11:05:54',
  },
  {
    name: '深蓝卫衣',
    description: 'dark navy blue oversized hoodie with white drawstrings',
    type: 'top',
    color: 'dark navy blue',
    style: 'casual',
    created_at: '2026-06-22 19:08:22',
  },
];

export interface WeaponAsset {
  name: string;
  description: string;
  type: string;
  element?: string;
  created_at?: string;
}

export const weapons: WeaponAsset[] = [
  {
    name: '法杖',
    description: 'crystal-topped magic staff with swirling energy, fantasy style',
    type: 'magic',
    element: 'arcane',
    created_at: '2026-06-22 19:08:22',
  },
  {
    name: '光剑',
    description: 'glowing blue energy sword with hilt, anime style',
    type: 'melee',
    element: 'light',
    created_at: '2026-06-22 19:08:22',
  },
];

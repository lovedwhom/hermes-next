// 项目/剧本数据 — 从 /var/www/videos/projects/ 导入
// 原始数据: projects/剧本-20260623_110327_AI突破次元壁/

import { ScriptData, VideoProject } from '@/types';

export const projectMeta = {
  name: '剧本-20260623_110327_AI突破次元壁',
  title: 'AI突破次元壁',
  theme: '赛博朋克少女凌霜从虚拟数据流中觉醒，突破代码屏障降临现实世界',
  style: '赛博朋克风 cyberpunk aesthetic, 霓虹灯光, 暗黑科技感',
  duration: '10-15秒',
  format: '9:16竖屏 TikTok',
  character: '凌霜',
  mood: '冷酷、未来感、震撼',
  music_vibe: 'synthwave电子，暗黑科技感，适合TikTok热门BGM',
};

export const script: ScriptData = {
  title: projectMeta.title,
  theme: projectMeta.style,
  scenes: [
    {
      id: 's1',
      sceneNumber: 1,
      location: '赛博城市数据空间',
      timeOfDay: '深夜',
      description: '深夜的赛博朋克城市，全息数据流在空中闪烁。一道数字裂缝撕裂虚空，红色长发从裂缝中伸出。',
      camera: '远景推近景',
    },
    {
      id: 's2',
      sceneNumber: 2,
      location: '数字裂缝边缘',
      timeOfDay: '深夜',
      description: '凌霜挣脱代码屏障从虚拟世界降临现实，霓虹光芒四射，红色长发在数据风暴中飘扬。',
      camera: '中景跟拍',
    },
    {
      id: 's3',
      sceneNumber: 3,
      location: '雨夜霓虹街道',
      timeOfDay: '深夜',
      description: '凌霜站在雨夜的霓虹街道上，身后的数字裂缝化为光点消散。全息数据流在空中闪烁，霓虹灯光倒映在积水中。',
      camera: '固定远景',
    },
  ],
};

export const videoProject: VideoProject = {
  title: projectMeta.title,
  clips: [
    {
      id: 'v1',
      sceneId: 's1',
      order: 1,
      videoUrl: '/projects/剧本-20260623_110327_AI突破次元壁/videos/tiktok.mp4',
      duration: 5,
      status: 'ready',
      prompt: 'cyberpunk city night, holographic data streams, digital rift tearing through reality, crimson red hair reaching out',
    },
    {
      id: 'v2',
      sceneId: 's2',
      order: 2,
      videoUrl: '/projects/剧本-20260623_110327_AI突破次元壁/videos/tiktok.mp4',
      duration: 5,
      status: 'ready',
      prompt: 'ling shuang breaking through code barrier, neon light explosion, red long hair flowing in data storm',
    },
    {
      id: 'v3',
      sceneId: 's3',
      order: 3,
      videoUrl: '/projects/剧本-20260623_110327_AI突破次元壁/videos/tiktok.mp4',
      duration: 5,
      status: 'ready',
      prompt: 'ling shuang standing on rainy neon street, digital rift dissolving into particles, holographic data floating in night air',
    },
  ],
};

// 完整脚本JSON原始数据
export const scriptRaw = {
  title: projectMeta.title,
  theme: projectMeta.theme,
  style: projectMeta.style,
  duration: projectMeta.duration,
  format: projectMeta.format,
  character: projectMeta.character,
  character_params: {
    hair: 'deep crimson red long hair with blunt bangs, wavy ends reaching waist',
    eyes: 'amber cat-eyes, sharp piercing gaze',
    skin: 'cold porcelain white, slightly pale',
    face: 'sharp stunning features, thin lips, high cheekbones, cold beauty',
    build: '170cm, slender and proportionate, commanding presence',
    outfit: 'black cyberpunk off-shoulder jacket with glowing neon blue circuit patterns, black high-waist cargo pants with silver chain belt',
  },
  scene_description: '深夜的赛博朋克城市，全息数据流在空中闪烁。凌霜从一道数字裂缝中伸出手，霓虹光芒四射，她挣脱代码屏障从虚拟世界降临现实，红色长发在数据风暴中飘扬，最终她站在雨夜的霓虹街道上，身后的数字裂缝化为光点消散',
  visual_effects: [
    '数字裂缝/代码碎片特效',
    '霓虹光芒爆发',
    '全息数据流',
    '红色长发飘动',
    '雨夜霓虹反射',
  ],
  mood: projectMeta.mood,
  music_vibe: projectMeta.music_vibe,
};

// 剧本数据结构
export interface ScriptScene {
  id: string;
  sceneNumber: number;
  location: string;    // 场景地点
  timeOfDay: string;   // 时间段
  description: string; // 画面描述
  dialogue?: string;   // 台词
  camera?: string;     // 镜头描述
}

export interface ScriptData {
  title: string;
  theme: string;       // 主题/风格
  scenes: ScriptScene[];
}

// 角色数据结构
export interface CharacterBody {
  hair: string;
  eyes: string;
  skin: string;
  face: string;
  build: string;
}

export interface ImageVariant {
  name: string;
  path: string;
}

export interface CharacterImages {
  nude: string | null;
  clothed: string | null;
  clothedVariants: ImageVariant[] | undefined;
}

export interface CharacterData {
  id: string;
  name: string;
  gender: string;
  age: number;
  description: string;
  outfit: string;
  avatarUrl?: string;
  nudeRefUrl?: string;
  body: CharacterBody;
  outfits: string[];
  weapon: string | null;
  style: string;
  prompt?: string;
  images: CharacterImages;
  created_at?: string;
}

// 视频数据结构
export interface VideoClip {
  id: string;
  sceneId: string;     // 关联的剧本场景
  order: number;
  thumbnailUrl?: string;
  videoUrl?: string;   // 视频文件路径
  duration?: number;   // 时长(秒)
  status: 'pending' | 'generating' | 'ready' | 'failed';
  prompt?: string;     // 生成prompt
}

export interface VideoProject {
  title: string;
  clips: VideoClip[];
}

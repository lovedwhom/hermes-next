'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ScriptPreview } from '@/components';
import CharacterPreview from '@/components/CharacterPreview';
import VideoPreview from '@/components/VideoPreview';
import { ScriptData, CharacterData, VideoProject } from '@/types';
import { FileText, Users, Film, FolderOpen, ChevronRight, Image } from 'lucide-react';

type TabId = 'script' | 'characters' | 'videos';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>('script');
  const [script, setScript] = useState<ScriptData | null>(null);
  const [characterDatas, setCharacterDatas] = useState<CharacterData[]>([]);
  const [videoProject, setVideoProject] = useState<VideoProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [dbInitialized, setDbInitialized] = useState(false);

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'script', label: '剧本', icon: <FileText className="w-4 h-4" /> },
    { id: 'characters', label: '角色', icon: <Users className="w-4 h-4" /> },
    { id: 'videos', label: '视频', icon: <Film className="w-4 h-4" /> },
  ];

  useEffect(() => {
    async function initializeDb() {
      try {
        const response = await fetch('/api/init', { method: 'POST' });
        if (response.ok) {
          setDbInitialized(true);
        }
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    }
    
    if (!dbInitialized) {
      initializeDb();
    }
  }, [dbInitialized]);

  useEffect(() => {
    if (!dbInitialized) return;

    async function fetchData() {
      try {
        setLoading(true);
        
        const [charactersRes, projectsRes, scenesRes, videoClipsRes] = await Promise.all([
          fetch('/api/characters'),
          fetch('/api/projects'),
          fetch('/api/scenes'),
          fetch('/api/video-clips'),
        ]);

        const charactersData = await charactersRes.json();
        const projectsData = await projectsRes.json();
        const scenesData = await scenesRes.json();
        const videoClipsData = await videoClipsRes.json();

        setCharacterDatas(charactersData);
        
        if (projectsData.length > 0) {
          const project = projectsData[0];
          setScript({
            title: project.title,
            theme: project.style,
            scenes: scenesData,
          });
          
          setVideoProject({
            title: project.title,
            clips: videoClipsData,
          });
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [dbInitialized]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-zinc-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black flex">
      {/* 左侧导航 */}
      <aside className="w-56 shrink-0 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col backdrop-blur-sm">
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800">
          <h1 className="text-lg font-bold tracking-tight">Hermes Studio</h1>
          <p className="text-xs text-zinc-400 mt-1">视频创作工作台</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${activeTab === tab.id
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black shadow-md'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:shadow-sm'
                }`}
            >
              {tab.icon}
              {tab.label}
              {activeTab === tab.id && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-50" />}
            </button>
          ))}
          {/* 素材 - 独立页面链接 */}
          <Link
            href="/assets"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:shadow-sm"
          >
            <FolderOpen className="w-4 h-4" />
            素材
          </Link>
          {/* 图片上传 - 独立页面链接 */}
          <Link
            href="/uploaded-images"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:shadow-sm"
          >
            <Image className="w-4 h-4" />
            图片上传
          </Link>
        </nav>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-zinc-400">
            Next.js 16 · Tailwind v4
          </p>
        </div>
      </aside>

      {/* 右侧内容 */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          {activeTab === 'script' && script && (
            <div>
              <h2 className="text-2xl font-bold mb-6">剧本预览</h2>
              <ScriptPreview script={script} />
            </div>
          )}
          {activeTab === 'characters' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">角色管理</h2>
              <CharacterPreview
                characters={characterDatas}
                onDeleteCharacter={() => console.log('delete')}
              />
            </div>
          )}
          {activeTab === 'videos' && videoProject && (
            <div>
              <h2 className="text-2xl font-bold mb-6">视频进度</h2>
              <VideoPreview project={videoProject} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

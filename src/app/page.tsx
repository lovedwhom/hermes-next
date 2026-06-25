'use client';

import { useState, useEffect } from 'react';
import { ScriptPreview } from '@/components';
import CharacterPreview from '@/components/CharacterPreview';
import VideoPreview from '@/components/VideoPreview';
import { ScriptData, CharacterData, VideoProject } from '@/types';
import { useHomeTab } from '@/components/Sidebar';

export default function Home() {
  const { activeTab } = useHomeTab();
  const [script, setScript] = useState<ScriptData | null>(null);
  const [characterDatas, setCharacterDatas] = useState<CharacterData[]>([]);
  const [videoProject, setVideoProject] = useState<VideoProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [dbInitialized, setDbInitialized] = useState(false);

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

        const [charactersRes, projectsRes, scenesRes, videoClipsRes] =
          await Promise.all([
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
      <div className="flex items-center justify-center h-full">
        <div className="text-zinc-500">加载中...</div>
      </div>
    );
  }

  return (
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
  );
}

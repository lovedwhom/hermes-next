'use client';

import { useState, useEffect } from 'react';
import { FolderOpen, Camera, Film } from 'lucide-react';

interface CharImage {
  name: string;
  path: string;
  character: string;
  type: 'nude' | 'clothed';
}

interface VideoFile {
  name: string;
  path: string;
  project: string;
  size: number;
}

export default function AssetsPage() {
  const [activeSection, setActiveSection] = useState<
    'character-images' | 'videos'
  >('character-images');
  const [charImages, setCharImages] = useState<CharImage[]>([]);
  const [videoFiles, setVideoFiles] = useState<VideoFile[]>([]);
  const [charFilter, setCharFilter] = useState<string>('all');

  // Load character images list
  useEffect(() => {
    async function loadChars() {
      try {
        const res = await fetch('/api/assets/characters');
        if (res.ok) {
          const data = await res.json();
          const images: CharImage[] = [];
          for (const char of data) {
            if (char.images?.nude) {
              images.push({
                name: 'nude.png',
                path: char.images.nude,
                character: char.name,
                type: 'nude',
              });
            }
            if (char.images?.clothed) {
              images.push({
                name:
                  char.images.clothed.split('/').pop() || 'clothed.png',
                path: char.images.clothed,
                character: char.name,
                type: 'clothed',
              });
            }
            if (char.images?.clothedVariants) {
              for (const v of char.images.clothedVariants) {
                images.push({
                  name: v.path.split('/').pop() || v.name,
                  path: v.path,
                  character: char.name,
                  type: 'clothed',
                });
              }
            }
          }
          setCharImages(images);
        }
      } catch (e) {
        console.error('Failed to load characters:', e);
      }
    }
    loadChars();
  }, []);

  // Load video files list
  useEffect(() => {
    async function loadVideos() {
      try {
        const res = await fetch('/api/assets/videos');
        if (res.ok) {
          const data = await res.json();
          setVideoFiles(data);
        }
      } catch (e) {
        console.error('Failed to load videos:', e);
      }
    }
    loadVideos();
  }, []);

  const filteredImages =
    charFilter === 'all'
      ? charImages
      : charImages.filter((i) => i.character === charFilter);
  const characters = [...new Set(charImages.map((i) => i.character))];

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-6">
      {/* 顶部标签 */}
      <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <button
          onClick={() => setActiveSection('character-images')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeSection === 'character-images'
              ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black'
              : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <Camera className="w-4 h-4" />
          角色图片
          <span className="text-xs opacity-60">({charImages.length})</span>
        </button>
        <button
          onClick={() => setActiveSection('videos')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeSection === 'videos'
              ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black'
              : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <Film className="w-4 h-4" />
          视频文件
          <span className="text-xs opacity-60">
            ({videoFiles.length})
          </span>
        </button>
      </div>

      {/* 角色图片浏览 */}
      {activeSection === 'character-images' && (
        <div className="space-y-4">
          {/* 角色筛选 */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setCharFilter('all')}
              className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                charFilter === 'all'
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              全部 ({charImages.length})
            </button>
            {characters.map((char) => (
              <button
                key={char}
                onClick={() => setCharFilter(char)}
                className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                  charFilter === char
                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                {char}
              </button>
            ))}
          </div>

          {filteredImages.length === 0 ? (
            <div className="text-center py-12 text-zinc-400">
              <Camera className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>暂无图片</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredImages.map((img, i) => (
                <div
                  key={i}
                  className="group border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden"
                >
                  <div className="aspect-square bg-zinc-50 dark:bg-zinc-900 relative">
                    <img
                      src={img.path}
                      alt={`${img.character} - ${img.name}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '';
                        (e.target as HTMLImageElement).className =
                          'w-full h-full flex items-center justify-center text-zinc-300';
                        (e.target as HTMLImageElement).innerHTML =
                          '<Camera class="w-8 h-8" />';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 text-white text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      {img.type === 'nude' ? '裸体参考' : '服装'}
                    </span>
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium truncate">
                      {img.character}
                    </p>
                    <p className="text-xs text-zinc-400 truncate">
                      {img.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 视频文件浏览 */}
      {activeSection === 'videos' && (
        <div className="space-y-4">
          {videoFiles.length === 0 ? (
            <div className="text-center py-12 text-zinc-400">
              <Film className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>暂无视频文件</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {videoFiles.map((vid, i) => (
                <div
                  key={i}
                  className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden"
                >
                  <div className="aspect-video bg-zinc-100 dark:bg-zinc-800 relative">
                    <video
                      src={vid.path}
                      controls
                      className="w-full h-full object-cover"
                      preload="metadata"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-medium truncate">
                      {vid.name}
                    </p>
                    <p className="text-xs text-zinc-400 truncate">
                      {vid.project}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

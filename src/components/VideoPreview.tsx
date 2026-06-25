'use client';

import { VideoProject } from '@/types';
import { Play, Clock, Film, AlertCircle, Volume2, VolumeX } from 'lucide-react';
import { useState, useRef } from 'react';

interface VideoPreviewProps {
  project: VideoProject;
}

const statusConfig = {
  pending: { label: '待生成', color: 'text-zinc-400 bg-zinc-100 dark:bg-zinc-800' },
  generating: { label: '生成中', color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/30 animate-pulse' },
  ready: { label: '已完成', color: 'text-green-600 bg-green-50 dark:bg-green-950/30' },
  failed: { label: '失败', color: 'text-red-600 bg-red-50 dark:bg-red-950/30' },
};

export default function VideoPreview({ project }: VideoPreviewProps) {
  const totalDuration = project.clips.reduce((sum, c) => sum + (c.duration || 0), 0);
  const [playingClipId, setPlayingClipId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* 项目头部 */}
      <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3 mb-4">
          <Film className="w-5 h-5 text-purple-500" />
          <h2 className="text-xl font-bold">{project.title}</h2>
        </div>
        <div className="flex gap-4 text-sm text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1.5">
            <Play className="w-3.5 h-3.5" />
            {project.clips.filter(c => c.status === 'ready').length}/{project.clips.length} 片段
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {totalDuration.toFixed(1)} 秒总时长
          </span>
        </div>
      </div>

      {/* 视频片段列表 */}
      {project.clips.length === 0 ? (
        <div className="text-center py-16 text-zinc-400 dark:text-zinc-600">
          <Play className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>暂无视频片段</p>
        </div>
      ) : (
        <div className="space-y-4">
          {project.clips.map((clip) => {
            const cfg = statusConfig[clip.status];
            const isPlaying = playingClipId === clip.id;
            return (
              <div
                key={clip.id}
                className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* 缩略图/视频播放器 */}
                  <div className="sm:w-64 bg-zinc-100 dark:bg-zinc-800 relative shrink-0">
                    {clip.videoUrl && clip.status === 'ready' ? (
                      <div className="relative">
                        <video
                          src={clip.videoUrl}
                          controls
                          className={`w-full aspect-video sm:h-full object-cover ${isPlaying ? '' : 'pointer-events-none'}`}
                          onMouseEnter={() => setPlayingClipId(clip.id)}
                          onMouseLeave={() => setPlayingClipId(null)}
                          preload="metadata"
                        />
                        {!isPlaying && (
                          <div
                            className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
                            onClick={() => setPlayingClipId(clip.id)}
                          >
                            <Play className="w-12 h-12 text-white/80" />
                          </div>
                        )}
                        {clip.duration && (
                          <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 bg-black/70 text-white text-xs rounded">
                            {clip.duration}s
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="w-full aspect-video sm:h-full flex items-center justify-center">
                        {clip.thumbnailUrl ? (
                          <img src={clip.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full text-zinc-300 dark:text-zinc-600">
                            <Play className="w-8 h-8" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 信息 */}
                  <div className="flex-1 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">片段 #{clip.order}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.color}`}>
                        {clip.status === 'generating' && <AlertCircle className="w-3 h-3 inline mr-1" />}
                        {cfg.label}
                      </span>
                    </div>
                    {clip.prompt && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                        {clip.prompt}
                      </p>
                    )}
                    {clip.videoUrl && clip.status === 'ready' && (
                      <a
                        href={clip.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-600 dark:text-purple-400 hover:underline mt-1"
                      >
                        <Play className="w-3 h-3" />
                        下载视频
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

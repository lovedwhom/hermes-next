'use client';

import { ScriptData } from '@/types';
import { Film, MapPin, Clock, Mic } from 'lucide-react';

interface ScriptPreviewProps {
  script: ScriptData;
}

export default function ScriptPreview({ script }: ScriptPreviewProps) {
  return (
    <div className="space-y-6">
      {/* 剧本头部 */}
      <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3 mb-4">
          <Film className="w-5 h-5 text-blue-500" />
          <h2 className="text-xl font-bold">{script.title}</h2>
        </div>
        <div className="flex gap-4 text-sm text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            {script.scenes.length} 场
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {Math.ceil(script.scenes.length * 1.5)} 分钟
          </span>
        </div>
        <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium">
          {script.theme}
        </div>
      </div>

      {/* 场景列表 */}
      <div className="space-y-4">
        {script.scenes.map((scene) => (
          <div
            key={scene.id}
            className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
          >
            {/* 场景头 */}
            <div className="flex items-center gap-3 mb-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-sm font-bold text-zinc-600 dark:text-zinc-300">
                {scene.sceneNumber}
              </span>
              <div className="flex items-center gap-3 text-sm">
                <span className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                  <MapPin className="w-3.5 h-3.5" />
                  {scene.location}
                </span>
                <span className="flex items-center gap-1 text-zinc-500 dark:text-zinc-500">
                  <Clock className="w-3.5 h-3.5" />
                  {scene.timeOfDay}
                </span>
              </div>
            </div>

            {/* 画面描述 */}
            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed ml-10">
              {scene.description}
            </p>

            {/* 镜头 */}
            {scene.camera && (
              <div className="mt-2 ml-10 text-xs text-zinc-400 dark:text-zinc-500">
                镜头: {scene.camera}
              </div>
            )}

            {/* 台词 */}
            {scene.dialogue && (
              <div className="mt-3 ml-10 flex items-start gap-2 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg p-3">
                <Mic className="w-3.5 h-3.5 text-zinc-400 mt-0.5 shrink-0" />
                <p className="text-sm italic text-zinc-600 dark:text-zinc-400">
                  &ldquo;{scene.dialogue}&rdquo;
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import React, { useState, useCallback } from 'react';
import { CharacterData } from '@/types';
import { User, Camera, Trash2, Plus, Eye, ChevronLeft, ChevronRight, X, Copy, Check } from 'lucide-react';

interface CharacterPreviewProps {
  characters: CharacterData[];
  onDeleteCharacter?: (id: string) => void;
}

interface FullImage {
  url: string;
  label: string;
  category: 'nude' | 'clothed';
}

export default function CharacterPreview({
  characters,
  onDeleteCharacter,
}: CharacterPreviewProps) {
  const [selectedChar, setSelectedChar] = useState<CharacterData | null>(null);
  const [lightboxImages, setLightboxImages] = useState<FullImage[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);

  // 收集角色的所有图片
  const getAllImages = (char: CharacterData): FullImage[] => {
    const images: FullImage[] = [];
    if (char.images?.nude) {
      images.push({ url: char.images.nude, label: '裸体参考', category: 'nude' });
    }
    if (char.images?.clothed) {
      images.push({ url: char.images.clothed, label: '服装参考', category: 'clothed' });
    }
    if (char.images?.clothedVariants) {
      for (const v of char.images.clothedVariants) {
        images.push({ url: v.path, label: v.name || '服装变体', category: 'clothed' });
      }
    }
    if (images.length === 0 && char.avatarUrl) {
      images.push({ url: char.avatarUrl, label: '头像', category: 'clothed' });
    }
    return images;
  };

  // 打开灯箱
  const openLightbox = (char: CharacterData, index: number) => {
    const images = getAllImages(char);
    setLightboxImages(images);
    setLightboxIndex(index);
  };

  // 关闭灯箱
  const closeLightbox = () => {
    setLightboxImages([]);
    setLightboxIndex(0);
  };

  // 键盘导航
  const handleKeydown = useCallback((e: React.KeyboardEvent) => {
    if (lightboxImages.length === 0) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && lightboxIndex > 0) setLightboxIndex(i => i - 1);
    if (e.key === 'ArrowRight' && lightboxIndex < lightboxImages.length - 1) setLightboxIndex(i => i + 1);
  }, [lightboxImages, lightboxIndex]);

  // 复制提示词
  const copyPrompt = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* 统计 */}
      <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
        <User className="w-4 h-4" />
        <span>{characters.length} 个角色</span>
      </div>

      {/* 角色网格 */}
      {characters.length === 0 ? (
        <div className="text-center py-16 text-zinc-400 dark:text-zinc-600">
          <Camera className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>暂无角色，请先上传角色图片或添加角色</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {characters.map((char) => {
            const allImages = getAllImages(char);
            const mainImage = allImages.length > 0 ? allImages[0].url : null;
            return (
              <div
                key={char.id}
                className="group border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-lg transition-all duration-300"
              >
                {/* 图片区 - 显示第一张图 */}
                <div
                  className="aspect-[3/4] bg-zinc-50 dark:bg-zinc-900 relative overflow-hidden cursor-pointer rounded-t-2xl"
                  onClick={() => setSelectedChar(char)}
                >
                  {mainImage ? (
                    <>
                      <img
                        src={mainImage}
                        alt={char.name}
                        className="w-full h-full object-cover"
                      />
                      {/* 多图标记 */}
                      {allImages.length > 1 && (
                        <div className="absolute bottom-2 left-2 flex gap-1">
                          {allImages.slice(0, 3).map((img, i) => (
                            <div
                              key={i}
                              className="w-6 h-6 rounded border border-white/50 overflow-hidden"
                            >
                              <img src={img.url} alt="" className="w-full h-full object-cover" />
                            </div>
                          ))}
                          {allImages.length > 3 && (
                            <div className="w-6 h-6 rounded bg-black/60 flex items-center justify-center text-white text-[10px] font-bold">
                              +{allImages.length - 3}
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-zinc-300 dark:text-zinc-700">
                      <User className="w-16 h-16" />
                    </div>
                  )}
                  {/* 查看详情按钮 */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  {/* 删除按钮 */}
                  {onDeleteCharacter && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeleteCharacter(char.id); }}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* 信息区 */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">{char.name}</h3>
                    <span className="text-xs text-zinc-400">{char.age}岁</span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {char.body.hair}
                  </p>
                  {char.outfits && char.outfits.length > 0 && (
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                      👗 {char.outfits.join(', ')}
                    </p>
                  )}
                  {char.weapon && (
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                      ⚔️ {char.weapon}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 角色详情弹窗 */}
      {selectedChar && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedChar(null)}
        >
          <div
            className="bg-white dark:bg-zinc-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{selectedChar.name}</h3>
                <button
                  onClick={() => setSelectedChar(null)}
                  className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  ✕
                </button>
              </div>

              {/* 图片画廊 */}
              <div className="mb-4">
                {(() => {
                  const allImages = getAllImages(selectedChar);
                  if (allImages.length === 0) {
                    return (
                      <div className="relative aspect-[3/4] bg-zinc-100 dark:bg-zinc-800 rounded-xl overflow-hidden flex items-center justify-center">
                        <Camera className="w-12 h-12 text-zinc-400" />
                      </div>
                    );
                  }

                  return (
                    <>
                      {/* 主图 */}
                      <div className="relative aspect-[3/4] bg-zinc-100 dark:bg-zinc-800 rounded-xl overflow-hidden">
                        <img
                          src={allImages[lightboxIndex]?.url || allImages[0].url}
                          alt={allImages[lightboxIndex]?.label || allImages[0].label}
                          className="w-full h-full object-contain"
                        />
                        {/* 标签 */}
                        <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 text-white text-xs rounded-md">
                          {allImages[lightboxIndex]?.label || allImages[0].label}
                        </div>
                        {/* 计数器 */}
                        {allImages.length > 1 && (
                          <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 text-white text-xs rounded-md">
                            {lightboxIndex + 1}/{allImages.length}
                          </div>
                        )}
                        {/* 上一张 */}
                        {lightboxIndex > 0 && (
                          <button
                            onClick={() => openLightbox(selectedChar, lightboxIndex - 1)}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                        )}
                        {/* 下一张 */}
                        {lightboxIndex < allImages.length - 1 && (
                          <button
                            onClick={() => openLightbox(selectedChar, lightboxIndex + 1)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* 缩略图条 */}
                      {allImages.length > 1 && (
                        <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                          {allImages.map((img, i) => (
                            <button
                              key={i}
                              onClick={() => setLightboxIndex(i)}
                              className={`w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                                i === lightboxIndex
                                  ? 'border-blue-500'
                                  : 'border-transparent hover:border-zinc-400'
                              }`}
                            >
                              <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>

              {/* 身体特征 */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">身体特征</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-zinc-400">头发:</span>
                    <p className="text-zinc-700 dark:text-zinc-300 mt-0.5">{selectedChar.body.hair}</p>
                  </div>
                  <div>
                    <span className="text-zinc-400">眼睛:</span>
                    <p className="text-zinc-700 dark:text-zinc-300 mt-0.5">{selectedChar.body.eyes}</p>
                  </div>
                  <div>
                    <span className="text-zinc-400">肤色:</span>
                    <p className="text-zinc-700 dark:text-zinc-300 mt-0.5">{selectedChar.body.skin}</p>
                  </div>
                  <div>
                    <span className="text-zinc-400">脸型:</span>
                    <p className="text-zinc-700 dark:text-zinc-300 mt-0.5">{selectedChar.body.face}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-zinc-400">体型:</span>
                    <p className="text-zinc-700 dark:text-zinc-300 mt-0.5">{selectedChar.body.build}</p>
                  </div>
                </div>
              </div>

              {/* 其他信息 */}
              <div className="mt-4 space-y-2">
                {selectedChar.outfits && selectedChar.outfits.length > 0 && (
                  <p className="text-xs text-zinc-500">
                    <span className="text-zinc-400">服装:</span> {selectedChar.outfits.join(', ')}
                  </p>
                )}
                {selectedChar.weapon && (
                  <p className="text-xs text-zinc-500">
                    <span className="text-zinc-400">武器:</span> {selectedChar.weapon}
                  </p>
                )}
                {selectedChar.style && (
                  <p className="text-xs text-zinc-500">
                    <span className="text-zinc-400">风格:</span> {selectedChar.style}
                  </p>
                )}
                {selectedChar.prompt && (
                  <div className="mt-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">提示词</span>
                      <button
                        onClick={() => copyPrompt(selectedChar.prompt!)}
                        className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-md transition-colors"
                      >
                        {copySuccess ? (
                          <>
                            <Check className="w-3 h-3" />
                            已复制
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            一键复制
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                      {selectedChar.prompt}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 全屏灯箱 */}
      {lightboxImages.length > 0 && (
        <div
          className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md flex items-center justify-center"
          onClick={closeLightbox}
          onKeyDown={handleKeydown}
          tabIndex={0}
        >
          {/* 关闭按钮 */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-black/40 rounded-full z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {/* 图片 */}
          <img
            src={lightboxImages[lightboxIndex]?.url}
            alt={lightboxImages[lightboxIndex]?.label}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* 标签和计数器 */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 bg-black/60 text-white rounded-full text-sm">
            <span>{lightboxImages[lightboxIndex]?.label}</span>
            <span className="text-white/50">|</span>
            <span>{lightboxIndex + 1}/{lightboxImages.length}</span>
          </div>

          {/* 导航 */}
          {lightboxIndex > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => i - 1); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white bg-black/40 rounded-full"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          {lightboxIndex < lightboxImages.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => i + 1); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white bg-black/40 rounded-full"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

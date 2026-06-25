'use client';

import { useState, useEffect, useCallback } from 'react';
import ImageUpload from '@/components/ImageUpload';
import { Camera, Upload, X, Trash2, Image as ImageIcon } from 'lucide-react';

interface UploadedImage {
  id: string;
  filename: string;
  public_url: string;
  category: string;
  reference_id: string | null;
  tag: string | null;
  file_size: number;
  mime_type: string;
  created_at: string;
}

export default function UploadedImagesPage() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    url?: string;
  } | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [previewImage, setPreviewImage] = useState<UploadedImage | null>(
    null
  );

  // Load images from DB
  useEffect(() => {
    async function loadImages() {
      try {
        const res = await fetch('/api/uploaded-images');
        if (res.ok) {
          const data = await res.json();
          setImages(data);
        }
      } catch (e) {
        console.error('Failed to load images:', e);
      }
    }
    loadImages();
  }, []);

  const handleUpload = useCallback(
    async (file: File, dataUrl: string) => {
      setUploading(true);
      setUploadResult(null);

      const formData = new FormData();
      formData.append('file', file);
      formData.append(
        'category',
        filterCategory === 'all' ? 'general' : filterCategory
      );

      try {
        const res = await fetch('/api/uploaded-images', {
          method: 'POST',
          body: formData,
        });
        const result = await res.json();
        if (result.success) {
          setUploadResult({ success: true, url: result.url });
          // Reload images list
          const res2 = await fetch('/api/uploaded-images');
          if (res2.ok) {
            const data = await res2.json();
            setImages(data);
          }
        } else {
          setUploadResult({ success: false });
        }
      } catch (e) {
        setUploadResult({ success: false });
      } finally {
        setUploading(false);
      }
    },
    [filterCategory]
  );

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这张图片吗？')) return;
    try {
      const res = await fetch(`/api/uploaded-images?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setImages((prev) => prev.filter((img) => img.id !== id));
        if (previewImage?.id === id) setPreviewImage(null);
      }
    } catch (e) {
      console.error('Delete failed:', e);
    }
  };

  const categories = [
    'all',
    ...Array.from(new Set(images.map((i) => i.category))),
  ];
  const filteredImages =
    filterCategory === 'all'
      ? images
      : images.filter((i) => i.category === filterCategory);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">图片库</h1>
        <span className="text-sm text-zinc-400">
          共 {images.length} 张图片
        </span>
      </div>

      {/* 分类筛选 */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 text-xs rounded-full font-medium transition-colors ${
              filterCategory === cat
                ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            {cat === 'all' ? '全部' : cat} (
            {cat === 'all'
              ? images.length
              : images.filter((i) => i.category === cat).length}
            )
          </button>
        ))}
      </div>

      {/* 上传区域 */}
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
        <h2 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-4 flex items-center gap-2">
          <Upload className="w-4 h-4" />
          上传图片
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageUpload
            onUpload={handleUpload}
            label="拖拽或点击上传图片"
            maxSizeMB={50}
          />
          <div className="space-y-3">
            <p className="text-xs text-zinc-400">
              支持格式: JPEG, PNG, WebP, GIF
              <br />
              最大文件大小: 50MB
              <br />
              上传后自动保存到数据库
            </p>
            {uploadResult && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  uploadResult.success
                    ? 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400'
                    : 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400'
                }`}
              >
                {uploadResult.success
                  ? `上传成功! URL: ${uploadResult.url}`
                  : '上传失败，请重试'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 图片列表 */}
      {filteredImages.length === 0 ? (
        <div className="text-center py-16 text-zinc-400">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>暂无上传的图片</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredImages.map((img) => (
            <div
              key={img.id}
              className="group border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden"
            >
              <div className="aspect-square bg-zinc-50 dark:bg-zinc-900 relative">
                <img
                  src={img.public_url}
                  alt={img.filename}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setPreviewImage(img)}
                />
                {/* 删除按钮 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(img.id);
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                {/* 分类标签 */}
                <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 text-white text-xs rounded-full">
                  {img.category}
                </span>
              </div>
              <div className="p-2">
                <p
                  className="text-xs font-medium truncate"
                  title={img.filename}
                >
                  {img.filename}
                </p>
                <p className="text-xs text-zinc-400">
                  {formatSize(img.file_size)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 图片预览弹窗 */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="bg-white dark:bg-zinc-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">
                  {previewImage.filename}
                </h3>
                <button
                  onClick={() => setPreviewImage(null)}
                  className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <img
                src={previewImage.public_url}
                alt={previewImage.filename}
                className="w-full rounded-xl"
              />
              <div className="mt-4 space-y-2 text-xs text-zinc-500">
                <p>URL: {previewImage.public_url}</p>
                <p>大小: {formatSize(previewImage.file_size)}</p>
                <p>类型: {previewImage.mime_type}</p>
                <p>分类: {previewImage.category}</p>
                {previewImage.tag && <p>标签: {previewImage.tag}</p>}
                <p>时间: {previewImage.created_at}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ASSETS_DIR = '/var/www/videos/assets';
const PROJECTS_DIR = '/var/www/videos/projects';
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const category = formData.get('category') as string | null;
    const charName = formData.get('charName') as string | null;
    const projectName = formData.get('projectName') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File too large. Max 50MB.' }, { status: 400 });
    }

    // Determine destination based on category
    let destDir: string;
    let subPath: string;

    if (category === 'character' && charName) {
      destDir = path.join(ASSETS_DIR, 'characters', charName);
      ensureDir(destDir);
      subPath = charName;
    } else if (category === 'project' && projectName) {
      const projDir = path.join(PROJECTS_DIR, projectName);
      const videosDir = path.join(projDir, 'videos');
      ensureDir(videosDir);
      destDir = videosDir;
      subPath = projectName + '/videos';
    } else {
      // Default: upload to assets root
      destDir = ASSETS_DIR;
      ensureDir(destDir);
      subPath = '';
    }

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = file.name;
    const destPath = path.join(destDir, fileName);

    fs.writeFileSync(destPath, buffer);

    // Return the public URL
    const publicPath = subPath
      ? `/${subPath}/${fileName}`
      : `/assets/${fileName}`;

    return NextResponse.json({
      success: true,
      url: publicPath,
      filename: fileName,
      size: file.size,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

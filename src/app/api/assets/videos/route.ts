import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const PROJECTS_DIR = '/var/www/videos/projects';

interface VideoFileInfo {
  name: string;
  path: string;
  project: string;
  size: number;
}

export async function GET() {
  try {
    const videos: VideoFileInfo[] = [];

    if (!fs.existsSync(PROJECTS_DIR)) {
      return NextResponse.json([]);
    }

    const projects = fs.readdirSync(PROJECTS_DIR);

    for (const proj of projects) {
      const projPath = path.join(PROJECTS_DIR, proj);
      if (!fs.statSync(projPath).isDirectory()) continue;

      const videosDir = path.join(projPath, 'videos');
      if (!fs.existsSync(videosDir)) continue;

      const files = fs.readdirSync(videosDir);
      for (const file of files) {
        if (!/\.(mp4|webm|mov)$/i.test(file)) continue;

        const filePath = path.join(videosDir, file);
        const stat = fs.statSync(filePath);

        videos.push({
          name: file,
          path: `/uploads/${proj}/videos/${file}`,
          project: proj,
          size: stat.size,
        });
      }
    }

    return NextResponse.json(videos);
  } catch (error) {
    console.error('Error fetching video files:', error);
    return NextResponse.json({ error: 'Failed to fetch video files' }, { status: 500 });
  }
}

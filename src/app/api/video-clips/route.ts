import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    const videoClips = db.prepare('SELECT * FROM video_clips').all();
    
    const formatted = videoClips.map((clip: any) => ({
      id: clip.id,
      sceneId: clip.scene_id,
      order: clip.order,
      thumbnailUrl: clip.thumbnail_url,
      videoUrl: clip.video_url,
      duration: clip.duration,
      status: clip.status as 'pending' | 'generating' | 'ready' | 'failed',
      prompt: clip.prompt,
    }));
    
    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching video clips:', error);
    return NextResponse.json({ error: 'Failed to fetch video clips' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const db = getDb();
    const body = await request.json();
    
    const { id, scene_id, project_id, order, thumbnail_url, video_url, duration, status, prompt } = body;

    const result = db.prepare(`
      INSERT INTO video_clips (id, scene_id, project_id, "order", thumbnail_url, video_url, duration, status, prompt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, scene_id, project_id, order, thumbnail_url, video_url, duration, status, prompt);

    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error('Error creating video clip:', error);
    return NextResponse.json({ error: 'Failed to create video clip' }, { status: 500 });
  }
}

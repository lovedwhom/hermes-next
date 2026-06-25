import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    const scenes = db.prepare('SELECT * FROM scenes').all();
    return NextResponse.json(scenes);
  } catch (error) {
    console.error('Error fetching scenes:', error);
    return NextResponse.json({ error: 'Failed to fetch scenes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const db = getDb();
    const body = await request.json();
    
    const { id, project_id, scene_number, location, time_of_day, description, dialogue, camera } = body;

    const result = db.prepare(`
      INSERT INTO scenes (id, project_id, scene_number, location, time_of_day, description, dialogue, camera)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, project_id, scene_number, location, time_of_day, description, dialogue, camera);

    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error('Error creating scene:', error);
    return NextResponse.json({ error: 'Failed to create scene' }, { status: 500 });
  }
}

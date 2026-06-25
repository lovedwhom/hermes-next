import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getDb } from '@/lib/db';
import crypto from 'crypto';

const ASSETS_DIR = '/var/www/videos/assets/uploaded';
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

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
    const referenceId = formData.get('referenceId') as string | null;
    const tag = formData.get('tag') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Unsupported file type. Allowed: JPEG, PNG, WebP, GIF' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File too large. Max 50MB.' }, { status: 400 });
    }

    // Ensure destination directory
    ensureDir(ASSETS_DIR);

    // Generate unique filename
    const ext = path.extname(file.name) || '.png';
    const timestamp = Date.now();
    const random = crypto.randomBytes(4).toString('hex');
    const fileName = `${timestamp}_${random}${ext}`;
    const destPath = path.join(ASSETS_DIR, fileName);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    fs.writeFileSync(destPath, buffer);

    // Public URL
    const publicUrl = `/uploads/${fileName}`;

    // Write to database
    try {
      const db = getDb();
      const imageId = crypto.randomUUID();
      const insertImg = db.prepare(`
        INSERT INTO uploaded_images (id, filename, public_url, category, reference_id, tag, file_size, mime_type, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      insertImg.run(
        imageId,
        fileName,
        publicUrl,
        category || 'general',
        referenceId || null,
        tag || null,
        file.size,
        file.type,
        new Date().toISOString()
      );
    } catch (dbErr) {
      console.error('DB insert error (non-fatal):', dbErr);
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: fileName,
      size: file.size,
      id: crypto.randomUUID(),
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = getDb();
    // Check if table exists before querying
    const tableExists = db.prepare(`
      SELECT name FROM sqlite_master WHERE type='table' AND name='uploaded_images'
    `).get();
    
    if (!tableExists) {
      return NextResponse.json([]);
    }
    
    const images = db.prepare(`
      SELECT * FROM uploaded_images ORDER BY created_at DESC
    `).all();

    return NextResponse.json(images);
  } catch (error) {
    console.error('Fetch uploaded images error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('id');

    if (!imageId) {
      return NextResponse.json({ error: 'Missing image id' }, { status: 400 });
    }

    // Get file info before deleting
    const db = getDb();
    const img = db.prepare('SELECT * FROM uploaded_images WHERE id = ?').get(imageId) as any;

    if (!img) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Delete physical file
    const filePath = path.join(ASSETS_DIR, img.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete DB record
    db.prepare('DELETE FROM uploaded_images WHERE id = ?').run(imageId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}

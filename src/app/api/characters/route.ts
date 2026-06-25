import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    const characters = db.prepare('SELECT * FROM characters').all();
    
    const formattedCharacters = characters.map((char: any) => ({
      id: char.id,
      name: char.name,
      gender: char.gender,
      age: char.age,
      description: char.body_hair || '',
      outfit: JSON.parse(char.outfits || '[]')[0] || '',
      body: {
        hair: char.body_hair,
        eyes: char.body_eyes,
        skin: char.body_skin,
        face: char.body_face,
        build: char.body_build,
      },
      outfits: JSON.parse(char.outfits || '[]'),
      weapon: char.weapon,
      style: char.style,
      images: {
        nude: char.images_nude,
        clothed: char.images_clothed,
        clothedVariants: char.images_clothed_variants ? JSON.parse(char.images_clothed_variants) : undefined,
      },
      created_at: char.created_at,
    }));

    return NextResponse.json(formattedCharacters);
  } catch (error) {
    console.error('Error fetching characters:', error);
    return NextResponse.json({ error: 'Failed to fetch characters' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const db = getDb();
    const body = await request.json();
    
    const {
      id, name, gender, age,
      body_hair, body_eyes, body_skin, body_face, body_build,
      outfits, weapon, style,
      images_nude, images_clothed, images_clothed_variants,
      created_at
    } = body;

    const result = db.prepare(`
      INSERT INTO characters (id, name, gender, age, body_hair, body_eyes, body_skin, body_face, body_build, outfits, weapon, style, images_nude, images_clothed, images_clothed_variants, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, name, gender, age,
      body_hair, body_eyes, body_skin, body_face, body_build,
      JSON.stringify(outfits), weapon, style,
      images_nude, images_clothed, JSON.stringify(images_clothed_variants),
      created_at
    );

    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error('Error creating character:', error);
    return NextResponse.json({ error: 'Failed to create character' }, { status: 500 });
  }
}

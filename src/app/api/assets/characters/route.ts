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

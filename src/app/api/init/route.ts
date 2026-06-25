import { NextResponse } from 'next/server';
import { initDatabase, seedDatabase } from '@/lib/schema';

export async function POST() {
  try {
    initDatabase();
    seedDatabase();
    return NextResponse.json({ success: true, message: 'Database initialized and seeded successfully' });
  } catch (error) {
    console.error('Error initializing database:', error);
    return NextResponse.json({ error: 'Failed to initialize database' }, { status: 500 });
  }
}

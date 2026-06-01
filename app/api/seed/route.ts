import { NextResponse } from 'next/server';
import { seedArticles } from '@/lib/seed-articles';

/**
 * API route to seed Firestore with mock articles
 * Visit: http://localhost:3000/api/seed
 * 
 * WARNING: Only use this in development!
 * Remove or protect this route in production
 */
export async function GET() {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Seeding is disabled in production' },
        { status: 403 }
      );
    }

    const result = await seedArticles();
    
    return NextResponse.json({
      message: 'Articles seeded successfully',
      ...result,
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Failed to seed articles' },
      { status: 500 }
    );
  }
}

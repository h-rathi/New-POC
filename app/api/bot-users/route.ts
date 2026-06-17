import { NextResponse } from 'next/server';
import prisma from '@/utils/db'; // Using your project's Prisma client
 
// The secret key your Python script will use to prove it is you
const BOT_API_SECRET = process.env.BOT_API_SECRET;
 
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${BOT_API_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
 
  try {
    // Fetches one random bot user from the database
    // We use Prisma's $queryRaw to execute raw SQL against the manually created bot_users table
    const rows = await prisma.$queryRaw<any[]>`
      SELECT email, password FROM bot_users ORDER BY RAND() LIMIT 1
    `;
   
    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'No bot users found' }, { status: 404 });
    }
   
    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error("Error fetching bot user:", error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
 
export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${BOT_API_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
 
  try {
    const { email, password } = await request.json();
   
    // Using Prisma's $executeRaw for insertion with automatic parameter binding to prevent SQL injection
    await prisma.$executeRaw`
      INSERT INTO bot_users (email, password) VALUES (${email}, ${password})
    `;
   
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error saving bot user:", error);
    return NextResponse.json({ error: 'Failed to save bot user' }, { status: 500 });
  }
}
 
 
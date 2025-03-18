import { readFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export async function GET() {
  try {
    // Redirect to the SVG version since we don't have a proper ICO file
    return NextResponse.redirect(new URL('/favicon.svg', 'http://localhost:3000'));
  } catch (error) {
    return new NextResponse('Error loading favicon', { status: 500 });
  }
} 
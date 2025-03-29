import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get the backend URL from environment or use the production URL
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://naukri-guru.el.r.appspot.com';
    
    const response = await fetch(`${backendUrl}/health`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      // We need to set the next property to configure cache behavior
      next: { revalidate: 0 }
    });
    
    // If the backend is working properly, return a 200 OK
    if (response.ok) {
      return NextResponse.json({ status: 'ok' }, { status: 200 });
    }
    
    // Otherwise, return an error
    return NextResponse.json(
      { status: 'error', message: 'Backend health check failed' },
      { status: 503 }
    );
  } catch (error) {
    console.error('Health check proxy error:', error);
    
    // If the backend isn't reachable, return a 503 Service Unavailable
    return NextResponse.json(
      { status: 'error', message: 'Backend service unavailable' },
      { status: 503 }
    );
  }
}

// Set cache headers to prevent caching
export const dynamic = 'force-dynamic'; 
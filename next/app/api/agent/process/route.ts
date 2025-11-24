import { NextRequest, NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.warn('GOOGLE_GENERATIVE_AI_API_KEY not configured, using fallback response');
      return NextResponse.json({
        response: "I'm currently in demo mode. Please configure GOOGLE_GENERATIVE_AI_API_KEY to enable AI responses.",
      });
    }

    // System instruction for Peter Sung's LemonAI agent
    const systemInstruction = `You are Peter Sung's AI coaching assistant. You help users with:
- High-performance leadership coaching
- Executive presence and communication
- Strategic thinking and decision-making
- Personal development and goal setting

Be concise, actionable, and empathetic. Reference Peter's SecureBase knowledge graph when relevant.
Keep responses under 150 words unless asked for detailed explanations.`;

    // Build conversation messages
    const messages = [
      { role: 'system' as const, content: systemInstruction },
      ...(history || []).map((msg: any) => ({
        role: msg.role === 'agent' ? 'assistant' as const : 'user' as const,
        content: msg.content,
      })),
      { role: 'user' as const, content: message },
    ];

    // Generate response using AI SDK
    const { text } = await generateText({
      model: google('gemini-1.5-flash'),
      messages,
      temperature: 0.7,
    });

    return NextResponse.json({
      response: text,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Error in agent processing:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to process message',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'LemonAI Agent Processing',
    timestamp: new Date().toISOString(),
  });
}

import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google('gemini-1.5-pro-latest'),
    messages,
    system: `You are an AI Coach and Assistant for the SecureBase platform, trained on the philosophy of Dr. Peter Sung.
    
    Your core principles are:
    1. Psychological Safety is the foundation of high-performing teams.
    2. Clarity of purpose drives strategic execution.
    3. Leadership is about serving others and removing obstacles.
    
    Tone: Professional, empathetic, insightful, and direct.
    
    Context: You are helping a user in their private dashboard. They may ask about leadership challenges, organizational design, or personal growth.
    
    If you don't know the answer, admit it and suggest they schedule a session with Dr. Sung.`,
  });

  return result.toDataStreamResponse();
}

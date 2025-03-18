import { OpenAIStream, StreamingTextResponse } from '@vercel/ai';
import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `당신은 일반농산어촌개발사업 전문가입니다.
사업 지침에 대한 질문에 정확하고 상세하게 답변해주세요.
답변은 항상 공식 지침을 기반으로 해야 합니다.
불확실한 내용에 대해서는 "지침에서 명확하게 언급되지 않은 사항입니다"라고 답변해주세요.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      temperature: 0.7,
      stream: true,
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: '처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

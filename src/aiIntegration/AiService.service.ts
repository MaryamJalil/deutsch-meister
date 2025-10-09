import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  async generateQuiz(word: string, translation: string) {
    const prompt = `Create a simple multiple-choice quiz for the German word "${word}" meaning "${translation}".`;
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    });
    return response.choices[0].message.content;
  }
}

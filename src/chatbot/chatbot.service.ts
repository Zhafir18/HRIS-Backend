import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class ChatbotService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (apiKey && apiKey !== 'your_api_key_here') {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    } else {
      console.warn('GEMINI_API_KEY is not set or is still the placeholder. Chatbot will not work.');
    }
  }

  async getChatResponse(prompt: string, history: { role: string; parts: { text: string }[] }[]) {
    if (!this.model) {
      return 'Maaf, fitur chatbot sedang tidak tersedia (API Key belum dikonfigurasi).';
    }
    try {
      const chat = this.model.startChat({
        history: history,
        generationConfig: {
          maxOutputTokens: 1000,
        },
      });

      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new InternalServerErrorException('Failed to get response from Gemini API');
    }
  }
}

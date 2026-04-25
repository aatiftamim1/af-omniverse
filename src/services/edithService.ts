// src/services/edithService.ts

export interface EdithResponse {
  success: boolean;
  data: any;
  error?: string;
}

export interface LessonParams {
  topic: string;
  grade: number;
  subject: string;
  language?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

class EdithCore {
  // Real API call ke liye base URL (baad mein change karna)
  private apiBase = import.meta.env.VITE_AI_API_URL || '';

  async generateLesson(params: LessonParams): Promise<EdithResponse> {
    try {
      // Agar real API ho to yahan fetch karo
      if (this.apiBase) {
        const res = await fetch(`${this.apiBase}/generate-lesson`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
        });
        const data = await res.json();
        return { success: true, data };
      }

      // Mock response (demo ke liye)
      const mockContent = `
        <h3>${params.topic}</h3>
        <p>Yeh sabaq class ${params.grade} ke liye ${params.subject} mein tayyar kiya gaya hai.</p>
        <p>AI ne is content ko generate kiya hai. Aap isay customize kar sakte hain.</p>
      `;
      return {
        success: true,
        data: {
          title: params.topic,
          content: mockContent,
          subject: params.subject,
          grade: params.grade,
        },
      };
    } catch (err: any) {
      return { success: false, data: null, error: err.message };
    }
  }

  async explainCode(code: string, language: string): Promise<EdithResponse> {
    try {
      if (this.apiBase) {
        const res = await fetch(`${this.apiBase}/explain-code`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, language }),
        });
        const data = await res.json();
        return { success: true, data };
      }

      // Mock explanation
      const explanation = `Yeh ${language} code ${code.length} lines par mushtamil hai. Iska maqsad aapki project requirements ke mutabiq hai.`;
      return { success: true, data: { explanation } };
    } catch (err: any) {
      return { success: false, data: null, error: err.message };
    }
  }

  async generateQuizFromLesson(lessonContent: string): Promise<EdithResponse> {
    try {
      if (this.apiBase) {
        const res = await fetch(`${this.apiBase}/generate-quiz`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: lessonContent }),
        });
        const data = await res.json();
        return { success: true, data };
      }

      const mockQuestions: QuizQuestion[] = [
        {
          question: 'Sabaq ka markazi mozu kya hai?',
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswer: 'Option B',
          explanation: 'Yeh sawaal sabaq ke khulasa par mabni hai.',
        },
      ];
      return { success: true, data: { questions: mockQuestions } };
    } catch (err: any) {
      return { success: false, data: null, error: err.message };
    }
  }
}

export const edith = new EdithCore();
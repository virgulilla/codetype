import { CONFIG } from '../config.js';

export const INITIAL_TIME = 30;

const GEMINI_API_KEY = CONFIG.GEMINI_API_KEY
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + GEMINI_API_KEY;

export async function getRandomSnippet() {
    const prompt = {
        contents: [
        {
            parts: [
            {
                text: "Escribe un snippet de código JavaScript breve y funcional. No añadas explicaciones ni comentarios."
            }
            ],
            role: 'user'
        }
        ]
    };

    const response = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(prompt)
    });

    const result = await response.json();
    let code = result?.candidates?.[0]?.content?.parts?.[0]?.text || '// Error generando código';
    
    code = code
        .replace(/^```(?:javascript)?\s*/i, '')
        .replace(/```[\s\n]*$/, '')
        .trim()
  return code;
}


export const normalizeSnippetToWords = (snippet) => {
    const lines = snippet.split('\n');

    return lines.flatMap((line, index) => {
        const tokens = line.split(/(\s+)/).filter(Boolean);
        const result = [];

        for (const token of tokens) {
            if (token.trim() !== '') {
                result.push(token);
            } else {
                result.push({ type: 'whitespace', value: token });
            }
        }

        if (index < lines.length - 1) {
            result.push({ type: 'newline' });
        }

        return result;
    });
};

// gameModel.js
import { codeSnippets as INITIAL_SNIPPET } from '../data.js'

export const INITIAL_TIME = 30;

export function getRandomSnippet() {
  const index = Math.floor(Math.random() * INITIAL_SNIPPET.length)
  return INITIAL_SNIPPET[index]
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

// Compression algorithms implementation
export function runLengthEncode(input: string): string {
    if (!input) return '';
    
    let compressed = '';
    let count = 1;
    let current = input[0];
  
    for (let i = 1; i <= input.length; i++) {
      if (i < input.length && input[i] === current) {
        count++;
      } else {
        compressed += (count > 1 ? count : '') + current;
        if (i < input.length) {
          current = input[i];
          count = 1;
        }
      }
    }
  
    return compressed.length < input.length ? compressed : input;
  }
  
  export function dictionaryCompress(input: string): { compressed: string; dictionary: Record<string, string> } {
    const dictionary: Record<string, string> = {};
    const words = input.split(/(\s+)/);
    let compressed = '';
    let counter = 0;
  
    words.forEach((word) => {
      if (word.trim()) {
        if (!Object.values(dictionary).includes(word)) {
          const token = `#${counter}`;
          dictionary[token] = word;
          compressed += token;
          counter++;
        } else {
          const token = Object.entries(dictionary).find(([_, val]) => val === word)?.[0] || '';
          compressed += token;
        }
      } else {
        compressed += word;
      }
    });
  
    return { compressed, dictionary };
  }
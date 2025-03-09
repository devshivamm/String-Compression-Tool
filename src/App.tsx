import React, { useState } from 'react';
import { ClipboardCopy, Compass as Compress, RotateCcw } from 'lucide-react';
import { runLengthEncode, dictionaryCompress } from './utils/compression';

function App() {
  const [input, setInput] = useState('');
  const [compressionType, setCompressionType] = useState<'rle' | 'dictionary'>('rle');
  const [result, setResult] = useState<{
    compressed: string;
    dictionary?: Record<string, string>;
    originalLength: number;
    compressedLength: number;
  } | null>(null);

  const handleCompress = () => {
    if (!input) return;

    if (compressionType === 'rle') {
      const compressed = runLengthEncode(input);
      setResult({
        compressed,
        originalLength: input.length,
        compressedLength: compressed.length,
      });
    } else {
      const { compressed, dictionary } = dictionaryCompress(input);
      setResult({
        compressed,
        dictionary,
        originalLength: input.length,
        compressedLength: compressed.length,
      });
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleReset = () => {
    setInput('');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">String Compression Tool</h1>
          <p className="text-gray-600 mb-6">Compress your text using different algorithms</p>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Compression Algorithm
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() => setCompressionType('rle')}
                  className={`px-4 py-2 rounded-lg ${
                    compressionType === 'rle'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Run-Length Encoding
                </button>
                <button
                  onClick={() => setCompressionType('dictionary')}
                  className={`px-4 py-2 rounded-lg ${
                    compressionType === 'dictionary'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Dictionary Compression
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Input Text
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter text to compress..."
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleCompress}
                disabled={!input}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Compress size={20} />
                Compress
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                <RotateCcw size={20} />
                Reset
              </button>
            </div>

            {result && (
              <div className="mt-8 space-y-6">
                <div className="p-6 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Compression Results</h3>
                    <div className="text-sm text-gray-600">
                      <p>Original length: {result.originalLength}</p>
                      <p>Compressed length: {result.compressedLength}</p>
                      <p>
                        Compression ratio:{' '}
                        {((1 - result.compressedLength / result.originalLength) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-gray-700">
                          Compressed Output
                        </label>
                        <button
                          onClick={() => handleCopy(result.compressed)}
                          className="text-indigo-600 hover:text-indigo-700"
                        >
                          <ClipboardCopy size={18} />
                        </button>
                      </div>
                      <div className="p-3 bg-white border border-gray-300 rounded-lg break-all">
                        {result.compressed}
                      </div>
                    </div>

                    {result.dictionary && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dictionary
                        </label>
                        <div className="grid grid-cols-2 gap-2 p-3 bg-white border border-gray-300 rounded-lg">
                          {Object.entries(result.dictionary).map(([token, word]) => (
                            <div key={token} className="flex justify-between">
                              <span className="font-mono text-indigo-600">{token}:</span>
                              <span className="text-gray-700">{word}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
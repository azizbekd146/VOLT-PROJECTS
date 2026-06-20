import { useState } from "react";
import { geminiClient } from "../../api/geminiApi";

export default function GeminiExample() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [charCount, setCharCount] = useState(0);

  const handlePromptChange = (e) => {
    const text = e.target.value;
    setPrompt(text);
    setCharCount(text.length);
  };

  const handleGenerateText = async () => {
    if (!prompt.trim()) {
      setError("Iltimos, savol yozing");
      return;
    }

    setLoading(true);
    setError("");
    setResponse("");

    try {
      const result = await geminiClient.generateText(prompt);
      setResponse(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Noma'lum xato yuz berdi";
      setError(`❌ Xato: ${errorMessage}`);
      console.error("Gemini error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleGenerateText();
    }
  };

  const handleClearAll = () => {
    setPrompt("");
    setResponse("");
    setError("");
    setCharCount(0);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">🤖 Gemini AI Chat</h1>
        <p className="text-gray-600">Google Gemini AI-ga savol bering va javob oling</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">
            Savolingizni yozing ({charCount}/2000)
          </label>
          <textarea
            value={prompt}
            onChange={handlePromptChange}
            onKeyPress={handleKeyPress}
            placeholder="Savolingizni yozing va Ctrl+Enter bosing yoki tugmani bosing..."
            maxLength={2000}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows="5"
            disabled={loading}
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleGenerateText}
            disabled={loading || !prompt.trim()}
            className="flex-1 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "⏳ Javoib kutilmoqda..." : "📤 So'rovni yubor"}
          </button>

          <button
            onClick={handleClearAll}
            disabled={loading || (!prompt && !response)}
            className="px-6 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors"
          >
            🗑️ Tozala
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg border-l-4 border-red-500">
            <p className="font-semibold">Xato</p>
            <p>{error}</p>
          </div>
        )}

        {response && (
          <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
            <h3 className="font-semibold text-lg mb-3 text-green-700">✅ Javob:</h3>
            <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">{response}</div>
          </div>
        )}
      </div>
    </div>
  );
}

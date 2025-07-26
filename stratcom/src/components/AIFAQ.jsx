import React, { useState } from 'react'

const AIFAQ = () => {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAsk = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setAnswer('')
    try {
      const response = await fetch('http://localhost:8000/ai-faq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      })
      const data = await response.json()
      setAnswer(
        data.choices?.[0]?.message?.content ||
        'Sorry, I could not find an answer.'
      )
    } catch (err) {
      setError('Failed to get answer. Please try again.')
    }
    setLoading(false)
  }

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="container mx-auto max-w-2xl bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-blue-100 p-8">
        <h2 className="text-3xl font-extrabold text-blue-800 mb-6 text-center drop-shadow-lg">AI Powered FAQ</h2>
        <form onSubmit={handleAsk} className="flex flex-col gap-4">
          <input
            type="text"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="Ask a question about Stratcom, internships, or services..."
            className="px-4 py-3 rounded border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold shadow transition"
            disabled={loading}
          >
            {loading ? 'Thinking...' : 'Ask AI'}
          </button>
        </form>
        {answer && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded p-4 text-blue-900 shadow-inner">
            <strong>AI Answer:</strong>
            <p className="mt-2 whitespace-pre-line">{answer}</p>
          </div>
        )}
        {error && (
          <div className="mt-4 text-red-600">{error}</div>
        )}
      </div>
    </section>
  )
}

export default AIFAQ
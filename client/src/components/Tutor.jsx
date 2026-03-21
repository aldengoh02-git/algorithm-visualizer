// Import hooks - useState for local state, useEffect to auto-fetch explanations
import { useState, useEffect } from 'react'

// Import axios for making HTTP requests to our FastAPI backend
import axios from 'axios'

// Tutor is the AI sidebar - it explains each step and answers questions
// props:
//   algorithm - the name of the current algorithm e.g. "Bubble Sort"
//   step - the current step object { array, comparing, sorted }
//   currentStepIndex - which step number we're on
//   totalSteps - total number of steps
export default function Tutor({ algorithm, step, currentStepIndex, totalSteps }) {

  // explanation holds the text returned by Claude
  const [explanation, setExplanation] = useState('Click "Explain Step" to get started!')

  // question holds what the user has typed in the input box
  const [question, setQuestion] = useState('')

  // loading is true while we're waiting for Claude to respond
  const [loading, setLoading] = useState(false)

  // Function that calls our FastAPI /api/tutor endpoint
  const askTutor = async (userQuestion = null) => {

    // Don't ask if there's no step data yet
    if (!step) return

    // Show loading state
    setLoading(true)

    try {
      // POST to our Python backend with all the context Claude needs
      const { data } = await axios.post('/api/tutor', {
        algorithm,                    // e.g. "Bubble Sort"
        step: currentStepIndex + 1,   // 1-indexed for readability
        total_steps: totalSteps,      // total number of steps
        state: step.array,            // the current array state
        user_question: userQuestion   // null if just explaining the step
      })

      // Update the explanation with Claude's response
      setExplanation(data.explanation)

    } catch (error) {
      // Show a friendly error if the API call fails
      setExplanation('Could not connect to the AI tutor. Make sure your backend server is running.')
    }

    // Hide loading state
    setLoading(false)
  }

  // Handle the user submitting a question
  const handleAsk = () => {
    if (!question.trim()) return  // ignore empty questions
    askTutor(question)            // send the question to Claude
    setQuestion('')               // clear the input box
  }

  return (
    <div className="flex flex-col gap-4 h-full">

      {/* Header */}
      <h2 className="text-lg font-semibold text-white">AI Tutor</h2>

      {/* Explanation box - shows Claude's response */}
      <div className="flex-1 bg-gray-800 rounded-lg p-4 text-sm text-gray-300 
                      leading-relaxed min-h-32">
        {/* Show a spinner while loading, otherwise show the explanation */}
        {loading
          ? <span className="text-gray-500 animate-pulse">Claude is thinking...</span>
          : explanation
        }
      </div>

      {/* Button to explain the current step */}
      <button
        onClick={() => askTutor()}
        disabled={loading}
        className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white 
                   rounded-lg text-sm transition-colors 
                   disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Explain This Step
      </button>

      {/* Divider */}
      <div className="border-t border-gray-700" />

      {/* Free-form question input */}
      <div className="flex flex-col gap-2">
        <input
          type="text"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          // Allow pressing Enter to submit the question
          onKeyDown={e => e.key === 'Enter' && handleAsk()}
          placeholder="Ask anything about this algorithm..."
          className="w-full bg-gray-800 text-white text-sm rounded-lg 
                     px-3 py-2 border border-gray-700 focus:border-blue-500 
                     focus:outline-none placeholder-gray-600"
        />
        <button
          onClick={handleAsk}
          disabled={loading || !question.trim()}
          className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white 
                     rounded-lg text-sm transition-colors
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Ask →
        </button>
      </div>

    </div>
  )
}
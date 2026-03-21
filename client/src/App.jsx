// Import React hooks
// useState - stores values that cause re-renders when they change
// useEffect - runs side effects (like timers) when dependencies change
// useCallback - memoizes functions so they don't get recreated every render
import { useState, useEffect, useCallback } from 'react'

// Import our algorithm step generators
import { bubbleSortSteps, generateRandomArray } from './algorithms/bubbleSort'
import { mergeSortSteps } from './algorithms/mergeSort'

// Import our components
import Visualizer from './components/Visualizer'
import Controls from './components/Controls'
import Tutor from './components/Tutor'

// Map algorithm names to their step generator functions
// This makes it easy to add new algorithms later
const ALGORITHMS = {
  'Bubble Sort': bubbleSortSteps,
  'Merge Sort': mergeSortSteps,
}

// Speed values in milliseconds between steps
// Lower = faster. Index 0 = slowest (speed=1), index 4 = fastest (speed=5)
const SPEED_MAP = [800, 400, 200, 100, 50]

export default function App() {

  // Which algorithm is currently selected
  const [algorithm, setAlgorithm] = useState('Bubble Sort')

  // All the steps for the current algorithm run
  const [steps, setSteps] = useState([])

  // Which step index we're currently viewing
  const [currentStep, setCurrentStep] = useState(0)

  // Whether the animation is auto-playing
  const [isPlaying, setIsPlaying] = useState(false)

  // Speed setting 1-5 (maps to SPEED_MAP)
  const [speed, setSpeed] = useState(3)

  // Generate initial steps when the app first loads
  useEffect(() => {
    const arr = generateRandomArray(20)
    const stepFn = ALGORITHMS[algorithm]
    setSteps(stepFn(arr))
    setCurrentStep(0)
    setIsPlaying(false)
  }, []) // empty array = run once on mount

  // Regenerate steps whenever the algorithm selection changes
  useEffect(() => {
    const arr = generateRandomArray(20)
    const stepFn = ALGORITHMS[algorithm]
    setSteps(stepFn(arr))
    setCurrentStep(0)
    setIsPlaying(false)
  }, [algorithm])

  // Auto-play timer - advances one step at the current speed interval
  useEffect(() => {

    // Don't set up timer if not playing
    if (!isPlaying) return

    // Stop auto-play if we've reached the last step
    if (currentStep >= steps.length - 1) {
      setIsPlaying(false)
      return
    }

    // Set up an interval to advance one step at a time
    const timer = setTimeout(() => {
      setCurrentStep(prev => prev + 1)
    }, SPEED_MAP[speed - 1])

    // Cleanup function - cancels the timer if component re-renders
    // This prevents multiple timers stacking up
    return () => clearTimeout(timer)

  }, [isPlaying, currentStep, steps.length, speed])

  // Generate a fresh random array and reset everything
  const handleReset = useCallback(() => {
    const arr = generateRandomArray(20)
    const stepFn = ALGORITHMS[algorithm]
    setSteps(stepFn(arr))
    setCurrentStep(0)
    setIsPlaying(false)
  }, [algorithm])

  // Go back one step (only when not auto-playing)
  const handleStepBack = useCallback(() => {
    setCurrentStep(prev => Math.max(0, prev - 1))
  }, [])

  // Go forward one step (only when not auto-playing)
  const handleStepForward = useCallback(() => {
    setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))
  }, [steps.length])

  return (
    // Full screen dark background
    <div className="min-h-screen bg-gray-950 text-white p-6">

      {/* Page header */}
      <h1 className="text-2xl font-bold text-center mb-6">
        Algorithm Visualizer
      </h1>

      {/* Algorithm selector buttons */}
      <div className="flex justify-center gap-3 mb-8">
        {Object.keys(ALGORITHMS).map(name => (
          <button
            key={name}
            onClick={() => setAlgorithm(name)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${algorithm === name
                ? 'bg-blue-600 text-white'           // active algorithm
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'  // inactive
              }`}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Main content - visualizer on left, tutor on right */}
      <div className="max-w-6xl mx-auto flex gap-6">

        {/* Left panel - visualizer and controls */}
        <div className="flex-1 flex flex-col gap-6">

          {/* Bar chart visualization */}
          <div className="bg-gray-900 rounded-xl p-6">
            <Visualizer
              step={steps[currentStep]}
              totalSteps={steps.length}
              currentStepIndex={currentStep}
            />
          </div>

          {/* Playback controls */}
          <div className="bg-gray-900 rounded-xl p-6">
            <Controls
              isPlaying={isPlaying}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onStepForward={handleStepForward}
              onStepBack={handleStepBack}
              onReset={handleReset}
              onSpeedChange={setSpeed}
              speed={speed}
              isFinished={currentStep >= steps.length - 1}
            />
          </div>

        </div>

        {/* Right panel - AI tutor sidebar */}
        <div className="w-72 bg-gray-900 rounded-xl p-6">
          <Tutor
            algorithm={algorithm}
            step={steps[currentStep]}
            currentStepIndex={currentStep}
            totalSteps={steps.length}
          />
        </div>

      </div>
    </div>
  )
}
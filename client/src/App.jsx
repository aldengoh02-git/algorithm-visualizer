import { useState, useEffect, useCallback } from 'react'

// Import all algorithm step generators
import { bubbleSortSteps, generateRandomArray } from './algorithms/bubbleSort'
import { mergeSortSteps } from './algorithms/mergeSort'
import { quickSortSteps } from './algorithms/quickSort'
import { insertionSortSteps } from './algorithms/insertionSort'
import { binarySearchSteps, generateRandomArray as generateSearchArray } from './algorithms/binarySearch'

import Visualizer from './components/Visualizer'
import Controls from './components/Controls'
import Tutor from './components/Tutor'

// Map algorithm names to their step generator functions
// Adding a new algorithm only requires adding one line here
const ALGORITHMS = {
  'Bubble Sort': bubbleSortSteps,
  'Merge Sort': mergeSortSteps,
  'Quick Sort': quickSortSteps,
  'Insertion Sort': insertionSortSteps,
}

// Binary search is handled separately since it returns
// { steps, target } instead of just steps
const IS_SEARCH = {
  'Binary Search': true
}

// Speed values in milliseconds between steps
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

  // Speed setting 1-5
  const [speed, setSpeed] = useState(3)

  // For binary search, store the target value to display it
  const [searchTarget, setSearchTarget] = useState(null)

  // Function to generate fresh steps for the current algorithm
  const generateSteps = useCallback((algo) => {

    // Binary search needs special handling
    if (IS_SEARCH[algo]) {
      const arr = generateSearchArray(15)
      const { steps: newSteps, target } = binarySearchSteps(arr)
      setSteps(newSteps)
      setSearchTarget(target)
    } else {
      const arr = generateRandomArray(20)
      const stepFn = ALGORITHMS[algo]
      setSteps(stepFn(arr))
      setSearchTarget(null)
    }

    setCurrentStep(0)
    setIsPlaying(false)
  }, [])

  // Generate initial steps on first load
  useEffect(() => {
    generateSteps('Bubble Sort')
  }, [])

  // Regenerate steps when algorithm changes
  useEffect(() => {
    generateSteps(algorithm)
  }, [algorithm])

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return
    if (currentStep >= steps.length - 1) {
      setIsPlaying(false)
      return
    }
    const timer = setTimeout(() => {
      setCurrentStep(prev => prev + 1)
    }, SPEED_MAP[speed - 1])
    return () => clearTimeout(timer)
  }, [isPlaying, currentStep, steps.length, speed])

  const handleReset = useCallback(() => {
    generateSteps(algorithm)
  }, [algorithm, generateSteps])

  const handleStepBack = useCallback(() => {
    setCurrentStep(prev => Math.max(0, prev - 1))
  }, [])

  const handleStepForward = useCallback(() => {
    setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))
  }, [steps.length])

  // All algorithm names including search
  const allAlgorithms = [...Object.keys(ALGORITHMS), ...Object.keys(IS_SEARCH)]

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">

      {/* Header */}
      <h1 className="text-2xl font-bold text-center mb-2">
        Algorithm Visualizer
      </h1>
      <p className="text-center text-gray-500 text-sm mb-6">
        AI-powered algorithm learning
      </p>

      {/* Algorithm selector */}
      <div className="flex justify-center gap-2 mb-8 flex-wrap">
        {allAlgorithms.map(name => (
          <button
            key={name}
            onClick={() => setAlgorithm(name)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${algorithm === name
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Binary search target display */}
      {searchTarget && (
        <p className="text-center text-amber-400 text-sm mb-4">
          Searching for: <span className="font-bold">{searchTarget}</span>
        </p>
      )}

      {/* Main layout */}
      <div className="max-w-6xl mx-auto flex gap-6">

        {/* Left panel */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-gray-900 rounded-xl p-6">
            <Visualizer
              step={steps[currentStep]}
              totalSteps={steps.length}
              currentStepIndex={currentStep}
            />
          </div>
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

        {/* Right panel - AI tutor */}
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
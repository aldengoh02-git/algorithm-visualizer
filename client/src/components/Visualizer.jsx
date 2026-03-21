// Import motion from framer-motion for smooth animated bars
import { motion } from 'framer-motion'

// Visualizer receives the current step data and renders the bar chart
// props:
//   step - the current step object { array, comparing, sorted }
//   totalSteps - total number of steps (used to show progress)
//   currentStepIndex - which step we're on (used to show progress)
export default function Visualizer({ step, totalSteps, currentStepIndex }) {

  // If no step data yet, render nothing
  if (!step) return null

  const { array, comparing, sorted } = step

  // Find the maximum value in the array so we can scale bar heights
  const maxVal = Math.max(...array)

  return (
    <div className="flex flex-col gap-4">

      {/* Progress bar showing how far through the algorithm we are */}
      <div className="w-full bg-gray-700 rounded-full h-1">
        <div
          className="bg-blue-500 h-1 rounded-full transition-all duration-300"
          // Calculate percentage progress through all steps
          style={{ width: `${(currentStepIndex / (totalSteps - 1)) * 100}%` }}
        />
      </div>

      {/* The bar chart - each element in the array is one bar */}
      <div className="flex items-end justify-center gap-1 h-64 px-4">
        {array.map((value, index) => {

          // Determine the color of this bar based on its state:
          // green = fully sorted, amber = currently being compared, blue = default
          const barColor = sorted.includes(index)
            ? 'bg-green-500'
            : comparing.includes(index)
            ? 'bg-amber-400'
            : 'bg-blue-500'

          return (
            // motion.div gives us smooth spring animations when bar heights change
            // layout prop tells Framer Motion to animate any layout changes
            // key must be stable (index here since array length doesn't change)
            <motion.div
              key={index}
              layout
              className={`${barColor} rounded-t-sm transition-colors duration-150`}
              style={{
                // Scale height as a percentage of the max value
                // Min height of 4px so tiny values are still visible
                height: `${Math.max((value / maxVal) * 100, 4)}%`,
                // Bar width shrinks automatically as array size grows
                width: `${Math.min(100 / array.length, 4)}%`,
                minWidth: '8px'
              }}
              // Spring animation config - stiffness and damping control the feel
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )
        })}
      </div>

      {/* Step counter showing current position */}
      <p className="text-center text-gray-400 text-sm">
        Step {currentStepIndex + 1} of {totalSteps}
      </p>
    </div>
  )
}
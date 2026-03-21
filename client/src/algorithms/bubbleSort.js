// This function takes an array and returns every single step of bubble sort
// as a snapshot, so the visualizer can play them back one by one
export function bubbleSortSteps(arr) {

  // Create a copy of the array so we don't modify the original
  const a = [...arr]

  // steps will hold every frame of the animation
  // each step is an object describing the full state at that moment
  const steps = []

  // Outer loop - each pass moves the largest unsorted element to the end
  // After i passes, the last i elements are in their final sorted position
  for (let i = 0; i < a.length; i++) {

    // Inner loop - compare adjacent pairs, stop earlier each pass
    // because the end is already sorted
    for (let j = 0; j < a.length - i - 1; j++) {

      // Record a snapshot BEFORE any swap happens
      // comparing: [j, j+1] tells the visualizer which two bars to highlight
      steps.push({
        array: [...a],         // copy of array at this exact moment
        comparing: [j, j + 1], // which indices are being compared (highlighted amber)
        sorted: []             // which indices are fully sorted (highlighted green)
      })

      // If the left element is bigger than the right, swap them
      if (a[j] > a[j + 1]) {
        // ES6 destructuring swap - no temp variable needed
        ;[a[j], a[j + 1]] = [a[j + 1], a[j]]
      }
    }
  }

  // Push one final step showing the fully sorted array with no comparisons
  steps.push({
    array: [...a],
    comparing: [],
    sorted: Array.from({ length: a.length }, (_, i) => i) // all indices sorted
  })

  return steps
}

// Generate a random array of a given size with values between 5 and 100
// This is used to populate the visualizer with random data on load
export function generateRandomArray(size = 20) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 95) + 5)
}
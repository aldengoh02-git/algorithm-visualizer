// Binary search finds a target value in a SORTED array
// by repeatedly halving the search space
// O(log n) - extremely fast compared to linear search O(n)
// This is a searching algorithm, not sorting, which adds
// diversity to the project
export function binarySearchSteps(arr, target = null) {

  // Sort the array first since binary search requires sorted input
  const a = [...arr].sort((x, y) => x - y)

  // If no target provided, pick a random element from the array
  // so we always find something (makes for a better demo)
  const searchTarget = target ?? a[Math.floor(Math.random() * a.length)]

  // steps array to collect every frame
  const steps = []

  // left and right are the boundaries of our current search space
  let left = 0
  let right = a.length - 1

  // Keep searching while the search space has at least one element
  while (left <= right) {

    // Find the middle index of the current search space
    const mid = Math.floor((left + right) / 2)

    // Record a step showing:
    // - comparing: the middle element we're checking
    // - sorted: the current search window (left to right)
    // - pivot: the mid index (shown in a special color)
    steps.push({
      array: [...a],
      comparing: [mid],
      // highlight the active search range
      sorted: Array.from({ length: right - left + 1 }, (_, i) => left + i),
      pivot: mid,
      target: searchTarget,
      left,
      right,
      found: false
    })

    if (a[mid] === searchTarget) {
      // Found it! Record a final step highlighting the found element
      steps.push({
        array: [...a],
        comparing: [],
        sorted: Array.from({ length: a.length }, (_, i) => i),
        pivot: mid,
        target: searchTarget,
        left: mid,
        right: mid,
        found: true
      })
      break

    } else if (a[mid] < searchTarget) {
      // Target is in the right half - discard the left half
      left = mid + 1

    } else {
      // Target is in the left half - discard the right half
      right = mid - 1
    }
  }

  return { steps, target: searchTarget }
}

// Generate a random array for binary search
// Size is smaller (15) since we sort it and search is fast
export function generateRandomArray(size = 15) {
  // Generate unique values to make the visualization cleaner
  const arr = new Set()
  while (arr.size < size) {
    arr.add(Math.floor(Math.random() * 95) + 5)
  }
  return [...arr]
}

// Quick sort works by picking a "pivot" element and partitioning
// the array so everything smaller than the pivot is on the left
// and everything larger is on the right, then recursively sorting
// each side. Average case O(n log n) but worst case O(n²)
export function quickSortSteps(arr) {

  // Work on a copy so we never mutate the original array
  const a = [...arr]

  // steps array that all recursive calls will push into
  const steps = []

  // Kick off the recursive sort on the full array
  quickSort(a, 0, a.length - 1, steps)

  // Final step showing the completed sorted array highlighted green
  steps.push({
    array: [...a],
    comparing: [],
    sorted: Array.from({ length: a.length }, (_, i) => i),
    pivot: null
  })

  return steps
}

// Recursive function that sorts arr[low..high] in place
function quickSort(arr, low, high, steps) {

  // Base case - if low >= high the subarray has 0 or 1 elements
  // and is already sorted, nothing to do
  if (low >= high) return

  // Partition the array and get the final position of the pivot
  const pivotIndex = partition(arr, low, high, steps)

  // Recursively sort the left side (everything smaller than pivot)
  quickSort(arr, low, pivotIndex - 1, steps)

  // Recursively sort the right side (everything larger than pivot)
  quickSort(arr, pivotIndex + 1, high, steps)
}

// Partition rearranges arr[low..high] so that:
// - The pivot (last element) ends up in its correct sorted position
// - All elements to the left are smaller than the pivot
// - All elements to the right are larger than the pivot
// Returns the final index of the pivot
function partition(arr, low, high, steps) {

  // We always use the last element as the pivot
  const pivotValue = arr[high]

  // i tracks the boundary between elements smaller and larger than pivot
  // starts just before the subarray
  let i = low - 1

  // Walk through every element except the pivot itself
  for (let j = low; j < high; j++) {

    // Record a step showing which element we're comparing to the pivot
    steps.push({
      array: [...arr],
      comparing: [j, high], // j is current element, high is pivot
      sorted: [],
      pivot: high            // highlight the pivot in a special color
    })

    // If current element is smaller than or equal to pivot,
    // it belongs on the left side
    if (arr[j] <= pivotValue) {
      i++
      // Swap arr[i] and arr[j] to move smaller element to left side
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
  }

  // Place pivot in its correct final position
  // Everything to its left is smaller, everything to its right is larger
  ;[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]

  // Return the pivot's final index
  return i + 1
}

export function generateRandomArray(size = 20) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 95) + 5)
}

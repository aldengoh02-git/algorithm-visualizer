// Insertion sort builds the sorted array one element at a time
// It picks each element and inserts it into the correct position
// among the already-sorted elements to its left
// Great for small arrays and nearly-sorted data - O(n²) worst case
export function insertionSortSteps(arr) {

  // Work on a copy so we never mutate the original
  const a = [...arr]

  // steps array to collect every frame of the animation
  const steps = []

  // Start from index 1 - the first element is trivially sorted
  for (let i = 1; i < a.length; i++) {

    // j walks backwards from i, shifting elements right
    // until we find the correct position for a[i]
    let j = i

    // Keep shifting left while the element to the left is bigger
    while (j > 0 && a[j - 1] > a[j]) {

      // Record a step showing which two elements we're comparing
      steps.push({
        array: [...a],
        comparing: [j, j - 1], // current element vs the one to its left
        sorted: Array.from({ length: i }, (_, k) => k), // left side is sorted
        pivot: null
      })

      // Swap the two elements - move the smaller one left
      ;[a[j], a[j - 1]] = [a[j - 1], a[j]]

      // Move j left to continue checking
      j--
    }

    // Record a step after the element has settled in its position
    steps.push({
      array: [...a],
      comparing: [],
      sorted: Array.from({ length: i + 1 }, (_, k) => k),
      pivot: null
    })
  }

  // Final step showing the fully sorted array
  steps.push({
    array: [...a],
    comparing: [],
    sorted: Array.from({ length: a.length }, (_, i) => i),
    pivot: null
  })

  return steps
}

export function generateRandomArray(size = 20) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 95) + 5)
}

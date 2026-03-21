// Merge sort works by splitting the array in half recursively,
// sorting each half, then merging them back together
// We collect steps differently here - we track the merge operations
export function mergeSortSteps(arr) {

  // steps array that all recursive calls will push into
  const steps = []

  // Work on a copy so we never mutate the original
  const a = [...arr]

  // Kick off the recursive sort
  mergeSort(a, 0, a.length - 1, steps)

  // Final step showing the completed sorted array
  steps.push({
    array: [...a],
    comparing: [],
    sorted: Array.from({ length: a.length }, (_, i) => i)
  })

  return steps
}

// Recursive function that sorts arr[left..right] in place
function mergeSort(arr, left, right, steps) {

  // Base case - a single element is already sorted, nothing to do
  if (left >= right) return

  // Find the middle index, splitting the array into two halves
  const mid = Math.floor((left + right) / 2)

  // Recursively sort the left half
  mergeSort(arr, left, mid, steps)

  // Recursively sort the right half
  mergeSort(arr, mid + 1, right, steps)

  // Merge the two sorted halves back together
  merge(arr, left, mid, right, steps)
}

// Merges two sorted subarrays: arr[left..mid] and arr[mid+1..right]
function merge(arr, left, mid, right, steps) {

  // Copy both halves into temporary arrays
  const leftArr = arr.slice(left, mid + 1)
  const rightArr = arr.slice(mid + 1, right + 1)

  let i = 0        // pointer for leftArr
  let j = 0        // pointer for rightArr
  let k = left     // pointer for position in main array

  // Compare elements from each half and place the smaller one back
  while (i < leftArr.length && j < rightArr.length) {

    // Record a step showing which two elements we're comparing
    steps.push({
      array: [...arr],
      comparing: [left + i, mid + 1 + j],
      sorted: []
    })

    // Place the smaller element into the correct position
    if (leftArr[i] <= rightArr[j]) {
      arr[k] = leftArr[i]
      i++
    } else {
      arr[k] = rightArr[j]
      j++
    }
    k++
  }

  // Copy any remaining elements from the left half
  while (i < leftArr.length) {
    arr[k] = leftArr[i]
    i++
    k++
  }

  // Copy any remaining elements from the right half
  while (j < rightArr.length) {
    arr[k] = rightArr[j]
    j++
    k++
  }
}

export function generateRandomArray(size = 20) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 95) + 5)
}
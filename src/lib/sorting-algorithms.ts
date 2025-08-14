
export type SortingAlgorithmType = 'Bubble Sort' | 'Selection Sort' | 'Insertion Sort' | 'Merge Sort' | 'Quick Sort';

export type SortingHistoryStep = {
  array: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
  description: string;
  auxiliary?: {index: number, value: number}[];
  shifting?: {elementIndex: number, destinationIndex: number};
};

const newHistoryStep = (
  arr: number[],
  description: string,
  comparing: number[] = [],
  swapping: number[] = [],
  sorted: number[] = [],
  auxiliary: {index: number, value: number}[] = [],
  shifting?: {elementIndex: number, destinationIndex: number}
): SortingHistoryStep => ({
  array: [...arr],
  description,
  comparing,
  swapping,
  sorted,
  auxiliary,
  shifting
});

function generateBubbleSortHistory(arr: number[]): SortingHistoryStep[] {
  const history: SortingHistoryStep[] = [];
  const localArr = [...arr];
  const n = localArr.length;
  const sortedIndices: number[] = [];

  history.push(newHistoryStep(localArr, 'Initial array.'));

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      history.push(newHistoryStep(localArr, `Comparing elements at index ${j} (${localArr[j]}) and ${j + 1} (${localArr[j+1]}).`, [j, j + 1], [], [...sortedIndices]));

      if (localArr[j] > localArr[j + 1]) {
        swapped = true;
        const desc = `Swapping ${localArr[j]} and ${localArr[j+1]}.`;
        history.push(newHistoryStep(localArr, desc, [], [], [...sortedIndices], [], {elementIndex: j, destinationIndex: j+1}));
        history.push(newHistoryStep(localArr, desc, [], [], [...sortedIndices], [], {elementIndex: j+1, destinationIndex: j}));
        
        [localArr[j], localArr[j + 1]] = [localArr[j + 1], localArr[j]];
        history.push(newHistoryStep(localArr, `Elements ${localArr[j+1]} and ${localArr[j]} have been swapped.`, [j, j+1], [j, j + 1], [...sortedIndices]));
      }
    }
    const sortedIndex = n - 1 - i;
    sortedIndices.push(sortedIndex);
    history.push(newHistoryStep(localArr, `Pass ${i+1} complete. ${localArr[sortedIndex]} is in its final sorted position.`, [], [], [...sortedIndices]));

    if (!swapped) {
       for (let k = n - i - 2; k >= 0; k--) {
        if (!sortedIndices.includes(k)) {
          sortedIndices.push(k);
        }
      }
      history.push(newHistoryStep(localArr, `No swaps in the last pass. Array is sorted.`, [], [], [...sortedIndices]));
      break;
    }
  }
   if (sortedIndices.length < n) {
      for(let i=0; i<n; i++){
          if(!sortedIndices.includes(i)) sortedIndices.push(i);
      }
   }

  history.push(newHistoryStep(localArr, 'Array is fully sorted.', [], [], Array.from({length: n}, (_, k) => k)));
  return history;
}

function generateSelectionSortHistory(arr: number[]): SortingHistoryStep[] {
  const history: SortingHistoryStep[] = [];
  const localArr = [...arr];
  const n = localArr.length;
  const sortedIndices: number[] = [];

  history.push(newHistoryStep(localArr, 'Initial array.'));

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    history.push(newHistoryStep(localArr, `Finding minimum in unsorted part (from index ${i}). Current minimum is ${localArr[minIdx]}.`, [], [], [...sortedIndices], [{index: minIdx, value: localArr[minIdx]}]));
    
    for (let j = i + 1; j < n; j++) {
      history.push(newHistoryStep(localArr, `Comparing current minimum (${localArr[minIdx]}) with element at index ${j} (${localArr[j]}).`, [minIdx, j], [], [...sortedIndices], [{index: minIdx, value: localArr[minIdx]}]));
      if (localArr[j] < localArr[minIdx]) {
        minIdx = j;
        history.push(newHistoryStep(localArr, `Found new minimum: ${localArr[minIdx]} at index ${minIdx}.`, [minIdx], [], [...sortedIndices], [{index: minIdx, value: localArr[minIdx]}]));
      }
    }

    if (minIdx !== i) {
        const desc = `Swapping minimum element ${localArr[minIdx]} with element ${localArr[i]} at the start of the unsorted part.`;
        history.push(newHistoryStep(localArr, desc, [], [], [...sortedIndices], [], {elementIndex: i, destinationIndex: minIdx}));
        history.push(newHistoryStep(localArr, desc, [], [], [...sortedIndices], [], {elementIndex: minIdx, destinationIndex: i}));
        [localArr[i], localArr[minIdx]] = [localArr[minIdx], localArr[i]];
        history.push(newHistoryStep(localArr, `Swap complete.`, [i, minIdx], [i, minIdx], [...sortedIndices]));
    }

    sortedIndices.push(i);
    history.push(newHistoryStep(localArr, `Element ${localArr[i]} is now sorted.`, [], [], [...sortedIndices]));
  }
  if (!sortedIndices.includes(n-1)) {
    sortedIndices.push(n - 1);
  }
  history.push(newHistoryStep(localArr, 'Array is fully sorted.', [], [], Array.from({length: n}, (_, k) => k)));
  return history;
}

function generateInsertionSortHistory(arr: number[]): SortingHistoryStep[] {
    const history: SortingHistoryStep[] = [];
    const localArr = [...arr];
    const n = localArr.length;
    
    history.push(newHistoryStep(localArr, 'Initial array.'));
    const sortedIndices = n > 0 ? [0] : [];
    if(n > 0) history.push(newHistoryStep(localArr, 'First element is considered sorted.',[],[],[0]));


    for (let i = 1; i < n; i++) {
        let key = localArr[i];
        let j = i - 1;
        
        history.push(newHistoryStep(localArr, `Selecting ${key} to insert into the sorted part.`, [i], [], [...sortedIndices], [{index: i, value: key}]));

        while (j >= 0 && localArr[j] > key) {
            const desc = `Shifting ${localArr[j]} to the right to make space for ${key}.`;
            history.push(newHistoryStep(localArr, desc, [], [], [...sortedIndices], [], {elementIndex: j, destinationIndex: j+1}));
            localArr[j + 1] = localArr[j];
            history.push(newHistoryStep(localArr, desc, [j, j+1], [j, j+1], [...sortedIndices], [{index: i, value: key}]));
            j = j - 1;
        }
        const insertDesc = `Inserting ${key} at index ${j + 1}.`;
        const preInsertArr = [...localArr];
        preInsertArr[j+1] = 0; // Placeholder for animation
        history.push(newHistoryStep(preInsertArr, insertDesc, [], [], [...sortedIndices], [], {elementIndex: i, destinationIndex: j+1}));

        localArr[j + 1] = key;
        history.push(newHistoryStep(localArr, insertDesc, [j+1], [j+1], [...sortedIndices]));
        
        if(!sortedIndices.includes(i)){
            sortedIndices.push(i)
        };
        history.push(newHistoryStep(localArr, `Elements up to index ${i} are now sorted.`, [], [], [...sortedIndices]));
    }
    
    history.push(newHistoryStep(localArr, 'Array is fully sorted.', [], [], Array.from({length: n}, (_, k) => k)));
    return history;
}

function generateMergeSortHistory(arr: number[]): SortingHistoryStep[] {
    const history: SortingHistoryStep[] = [];
    const localArr = [...arr];
    const n = localArr.length;
    let auxIdCounter = 0;


    function mergeSort(list: number[], left: number, right: number) {
      if (right - left <= 1) return;
    
      const mid = Math.floor((left + right) / 2);
      history.push(newHistoryStep(list, `Splitting subarray from index ${left} to ${right-1}. Midpoint is ${mid}.`));
      
      mergeSort(list, left, mid);
      mergeSort(list, mid, right);
      
      merge(list, left, mid, right);
    }
    
    function merge(list: number[], left: number, mid: number, right: number) {
      const leftHalf = list.slice(left, mid).map((val, i) => ({val, originalIndex: left + i}));
      const rightHalf = list.slice(mid, right).map((val, i) => ({val, originalIndex: mid + i}));
      
      const auxLeft = leftHalf.map(item => ({index: auxIdCounter++, value: item.val}));
      const auxRight = rightHalf.map(item => ({index: auxIdCounter++, value: item.val}));
      
      history.push(newHistoryStep(list, `Merging subarrays. Left: [${leftHalf.map(e=>e.val).join(', ')}]. Right: [${rightHalf.map(e=>e.val).join(', ')}].`, [], [], [], [...auxLeft, ...auxRight]));

      let i = 0, j = 0, k = left;
      
      while (i < leftHalf.length && j < rightHalf.length) {
        history.push(newHistoryStep(list, `Comparing ${leftHalf[i].val} and ${rightHalf[j].val}.`, [leftHalf[i].originalIndex, rightHalf[j].originalIndex], [], [], [...auxLeft, ...auxRight]));
        if (leftHalf[i].val <= rightHalf[j].val) {
          const desc = `Placing ${leftHalf[i].val} from left subarray into main array at index ${k}.`;
          history.push(newHistoryStep(list, desc, [], [], [], [...auxLeft, ...auxRight], {elementIndex: leftHalf[i].originalIndex, destinationIndex: k}));
          list[k] = leftHalf[i].val;
          history.push(newHistoryStep(list, desc, [k], [k], [], [...auxLeft, ...auxRight]));
          i++;
        } else {
          const desc = `Placing ${rightHalf[j].val} from right subarray into main array at index ${k}.`;
          history.push(newHistoryStep(list, desc, [], [], [], [...auxLeft, ...auxRight], {elementIndex: rightHalf[j].originalIndex, destinationIndex: k}));
          list[k] = rightHalf[j].val;
          history.push(newHistoryStep(list, desc, [k], [k], [], [...auxLeft, ...auxRight]));
          j++;
        }
        k++;
      }

      while (i < leftHalf.length) {
        const desc = `Placing remaining ${leftHalf[i].val} from left subarray at index ${k}.`
        history.push(newHistoryStep(list, desc, [], [], [], [...auxLeft, ...auxRight], {elementIndex: leftHalf[i].originalIndex, destinationIndex: k}));
        list[k] = leftHalf[i].val;
        history.push(newHistoryStep(list, desc, [k], [k], [], [...auxLeft, ...auxRight]));
        i++;
        k++;
      }
      while (j < rightHalf.length) {
        const desc = `Placing remaining ${rightHalf[j].val} from right subarray at index ${k}.`
        history.push(newHistoryStep(list, desc, [], [], [], [...auxLeft, ...auxRight], {elementIndex: rightHalf[j].originalIndex, destinationIndex: k}));
        list[k] = rightHalf[j].val;
        history.push(newHistoryStep(list, desc, [k], [k], [], [...auxLeft, ...auxRight]));
        j++;
        k++;
      }
      history.push(newHistoryStep(list, `Subarray from index ${left} to ${right-1} is now sorted.`));
    }

    history.push(newHistoryStep(localArr, 'Initial array.'));
    mergeSort(localArr, 0, n);
    history.push(newHistoryStep(localArr, 'Array is fully sorted.', [], [], Array.from({length: n}, (_, k) => k)));
    
    return history;
}


function generateQuickSortHistory(arr: number[]): SortingHistoryStep[] {
    const history: SortingHistoryStep[] = [];
    const localArr = [...arr];
    const n = localArr.length;
    const sortedIndices: number[] = [];

    function partition(list: number[], low: number, high: number) {
        const pivotIndex = Math.floor(Math.random() * (high - low + 1)) + low;
        const pivot = list[pivotIndex];
        history.push(newHistoryStep(list, `Partitioning from index ${low} to ${high}. Pivot is ${pivot} at index ${pivotIndex}.`, [], [], [...sortedIndices], [{index: pivotIndex, value: pivot}]));
        
        if (pivotIndex !== high) {
          history.push(newHistoryStep(list, `Moved pivot ${pivot} to the end for partitioning.`, [], [], [...sortedIndices], [], {elementIndex: pivotIndex, destinationIndex: high}));
          history.push(newHistoryStep(list, `Moved pivot ${pivot} to the end for partitioning.`, [], [], [...sortedIndices], [], {elementIndex: high, destinationIndex: pivotIndex}));
          [list[pivotIndex], list[high]] = [list[high], list[pivotIndex]];
          history.push(newHistoryStep(list, `Moved pivot ${pivot} to the end for partitioning.`, [pivotIndex, high], [pivotIndex, high], [...sortedIndices]));
        }


        let i = low;
        for(let j = low; j < high; j++) {
            history.push(newHistoryStep(list, `Comparing element ${list[j]} with pivot ${pivot}.`, [j, high], [], [...sortedIndices]));
            if (list[j] < pivot) {
                if(i !== j){
                    const desc = `Swapping ${list[i]} and ${list[j]} as ${list[j]} is smaller than pivot.`;
                    history.push(newHistoryStep(list, desc, [], [], [...sortedIndices], [], {elementIndex: i, destinationIndex: j}));
                    history.push(newHistoryStep(list, desc, [], [], [...sortedIndices], [], {elementIndex: j, destinationIndex: i}));
                    [list[i], list[j]] = [list[j], list[i]];
                    history.push(newHistoryStep(list, desc, [i, j], [i, j], [...sortedIndices]));
                }
                i++;
            }
        }
        
        const desc = `Moving pivot ${pivot} to its final sorted position at index ${i}.`;
        history.push(newHistoryStep(list, desc, [], [], [...sortedIndices], [], {elementIndex: high, destinationIndex: i}));
        history.push(newHistoryStep(list, desc, [], [], [...sortedIndices], [], {elementIndex: i, destinationIndex: high}));
        [list[i], list[high]] = [list[high], list[i]];
        history.push(newHistoryStep(list, `Pivot ${pivot} is now sorted.`, [i, high], [i, high], [...sortedIndices]));

        sortedIndices.push(i);
        history.push(newHistoryStep(list, `Elements smaller than ${pivot} are to its left, larger are to its right.`, [], [], [...sortedIndices]));

        return i;
    }

    function quickSort(list: number[], low: number, high: number) {
        if (low < high) {
            let pi = partition(list, low, high);
            
            quickSort(list, low, pi - 1);
            quickSort(list, pi + 1, high);
        } else if (low === high) {
            if(!sortedIndices.includes(low)) {
                sortedIndices.push(low)
                history.push(newHistoryStep(list, `Element ${list[low]} is a single-element partition, considered sorted.`, [], [], [...sortedIndices]));
            }
        }
    }

    history.push(newHistoryStep(localArr, 'Initial array.'));
    quickSort(localArr, 0, n - 1);

    history.push(newHistoryStep(localArr, 'Array is fully sorted.', [], [], Array.from({length: n}, (_, k) => k)));

    return history;
}


export const ALGORITHMS = {
  'Bubble Sort': {
    generateHistory: generateBubbleSortHistory,
    description: 'Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.',
    complexity: {
      time: {
        best: 'O(n)',
        average: 'O(n²)',
        worst: 'O(n²)',
      },
      space: 'O(1)',
    },
  },
  'Selection Sort': {
    generateHistory: generateSelectionSortHistory,
    description: 'Selection Sort divides the input list into two parts: a sorted sublist of items which is built up from left to right and a sublist of the remaining unsorted items. It repeatedly finds the minimum element from the unsorted part and puts it at the beginning.',
    complexity: {
      time: {
        best: 'O(n²)',
        average: 'O(n²)',
        worst: 'O(n²)',
      },
      space: 'O(1)',
    },
  },
  'Insertion Sort': {
    generateHistory: generateInsertionSortHistory,
    description: 'Insertion Sort builds the final sorted array one item at a time. It iterates through an input array and removes one element per iteration, finds the place the element belongs in the sorted list, and inserts it there.',
    complexity: {
      time: {
        best: 'O(n)',
        average: 'O(n²)',
        worst: 'O(n²)',
      },
      space: 'O(1)',
    },
  },
  'Merge Sort': {
    generateHistory: generateMergeSortHistory,
    description: 'Merge Sort is a divide-and-conquer algorithm. It divides the unsorted list into n sublists, each containing one element, and then repeatedly merges sublists to produce new sorted sublists until there is only one sublist remaining.',
    complexity: {
      time: {
        best: 'O(n log n)',
        average: 'O(n log n)',
        worst: 'O(n log n)',
      },
      space: 'O(n)',
    },
  },
  'Quick Sort': {
    generateHistory: generateQuickSortHistory,
    description: 'Quick Sort is a divide-and-conquer algorithm. It works by selecting a \'pivot\' element from the array and partitioning the other elements into two sub-arrays, according to whether they are less than or greater than the pivot.',
    complexity: {
      time: {
        best: 'O(n log n)',
        average: 'O(n log n)',
        worst: 'O(n²)',
      },
      space: 'O(log n)',
    },
  },
};

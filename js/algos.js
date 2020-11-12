// Converts from degrees to radians.
Number.prototype.toRadians = function () {
    return this * Math.PI / 180;
};


// Calculates the distance between Grenoble and the given city
function distanceFromGrenoble(city) {
    const R = 6371e3; // metres
    const GrenobleLat = 45.166667;
    const GrenobleLong = 5.716667;
    const cityLat = parseInt(city.latitude);

    const phi1 = GrenobleLat.toRadians(); // φ, λ in radians
    const phi2 = cityLat.toRadians();
    const deltaPhi = (cityLat - GrenobleLat).toRadians();
    const deltaLambda = (city.longitude - GrenobleLong).toRadians();

    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
        Math.cos(phi1) * Math.cos(phi2) *
        Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

// Returns the index in csvData corresponding to arg.
// If arg is an integer, the function returns the csvData index for the value contained in array[arg]
// If arg is an object, the function returns the csvData for that object
function resolveArgument(arg, array){
    return (arg === parseInt(arg, 10)) ? csvData.indexOf(array[arg]) : csvData.indexOf(arg);
}


// Swap 2 values in array csvData
// i is the index of the first city
// j is the index of the second city
function swap(i, j, array = csvData) {
    i = resolveArgument(i, array);
    j = resolveArgument(j, array);

    displayBuffer.push(['swap', i, j]); // Do not delete this line (for display)

    const temp = csvData[i];
    csvData[i] = csvData[j];
    csvData[j] = temp;
}

// Returns true if city with index i in csvData is closer to Grenoble than city with index j
// i is the index of the first city
// j is the index of the second city
function isLess(i, j, array = csvData) {
    i = resolveArgument(i, array);
    j = resolveArgument(j, array);

    displayBuffer.push(['compare', i, j]); // Do not delete this line (for display)

    return distanceFromGrenoble(csvData[i]) < distanceFromGrenoble(csvData[j]);
}

function merge(leftArray, rightArray, start) {
    let result = [];

    while (leftArray.length && rightArray.length) {
        if (isLess(leftArray[0], rightArray[0])) {
            result.push(leftArray.shift());
        } else {
            result.push(rightArray.shift());
        }
        swap(start + result.length-1, result[result.length-1]);
    }

    while (leftArray.length) {
        result.push(leftArray.shift());
        swap(start + result.length-1, result[result.length-1]);
    }
    while (rightArray.length) {
        result.push(rightArray.shift());
        swap(start + result.length-1, result[result.length-1]);
    }

    return result;
}

const quicksortPartition = (array, low, high) => {
    let i = low;
    for (let j = low; j <= high; j++) {
        if (isLess(j, high, array)) {
            swap(i, j, array);
            i++;
        }
    }
    swap(i, high, array);
    return i;
};

function insertsort(array) {
    for (let i = 1; i < array.length; i++) {
        for (let j = i; j > 0 && isLess(j, j - 1); j--, array) {
            swap(j, j - 1, array);
        }
    }

}

function selectionsort(array) {
    for (let i = 0; i < array.length - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < array.length; j++) {
            if (isLess(j, minIndex, array)) minIndex = j;
        }
        if (minIndex !== i) swap(i, minIndex, array);
    }
}

function bubblesort(array) {
    let pass = 0;
    let change = true;
    while (change) {
        change = false;
        for (let i = 0; i < array.length - (1 + pass); i++) {
            if (isLess(i + 1, i, array)) {
                swap(i, i + 1, array);
                change = true;
            }
        }
        pass += 1;
    }
}

function shellsort(array) {
    const insertionSort = (gap, start) => {
        for (let i = start; i < array.length; i += gap) {
            for (let j = i; j > 0 && isLess(j, j - 1, array); j--) {
                swap(j, j - 1, array);
            }
        }
    };

    const gaps = [701, 301, 132, 57, 23, 10, 4, 1].filter(value => value < array.length);
    // const gaps = [6, 4, 3, 2, 1].filter(value => value < csvData.length);
    for (let gap of gaps) {
        for (let start = 0; start < gap; start++) {
            insertionSort(gap, start);
        }
    }
}

function mergesort(array, start = 0) {
    if (array.length <= 1) return array;

    const arrayHalf = Math.ceil(array.length / 2);

    let leftArray = mergesort(array.slice(0, arrayHalf), start);
    let rightArray = mergesort(array.slice(arrayHalf), start + arrayHalf);

    return merge(leftArray, rightArray, start);
}

function heapsort(array) {
    console.log("heapsort - implement me !");
}

function quicksort(array, low = 0, high = array.length - 1) {
    if (low < high) {
        const part = quicksortPartition(array, low, high);
        quicksort(array, low, part - 1);
        quicksort(array, part + 1, high);
    }
}


function quick3sort(array) {
    console.log("quick3sort - implement me !");
}


function sort(algo) {
    switch (algo) {
        case 'insert':
            insertsort(csvData);
            break;
        case 'select':
            selectionsort(csvData);
            break;
        case 'bubble':
            bubblesort(csvData);
            break;
        case 'shell':
            shellsort(csvData);
            break;
        case 'merge':
            mergesort(csvData);
            break;
        case 'heap':
            heapsort(csvData);
            break;
        case 'quick':
            quicksort(csvData);
            break;
        case 'quick3':
            quick3sort(csvData);
            break;
        default:
            throw 'Invalid algorithm ' + algo;
    }
}

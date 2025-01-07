const arrayContainer = document.getElementById('arrayContainer');
const speedRange = document.getElementById('speedRange');
const sizeRange = document.getElementById('sizeRange');
const algorithmSelect = document.getElementById('algorithmSelect');
let bars = [];

function generateBars() {
    const arraySize = sizeRange.value;
    const barWidth = (100 / arraySize) + '%';
    arrayContainer.innerHTML = '';
    bars = [];
    for (let i = 0; i < arraySize; i++) {
        const value = Math.floor(Math.random() * 100) + 1;
        const bar = createBar(value, barWidth);
        arrayContainer.appendChild(bar);
        bars.push({ value, element: bar });
    }
}

function inputArray() {
    const input = document.getElementById('arrayInput').value;
    const customArray = input.split(' ').map(Number);
    if (customArray.every(val => !isNaN(val)) && customArray.length <= 100) {
        // Clear existing bars
        arrayContainer.innerHTML = '';

        // Generate new bars from the customArray
        bars = customArray.map(value => {
            const bar = createBar(value, (100 / customArray.length) + '%');
            arrayContainer.appendChild(bar);
            return { value, element: bar };
        });
    } else {
        alert('Invalid input. Please enter a space-separated list of numbers (up to 100).');
    }
}

async function sortArray() {
    const algorithm = algorithmSelect.value;
    const speed = speedRange.value;
    const delay = calculateDelay(speed);
    let sortedArray;

    switch (algorithm) {
        case 'bubble':
            sortedArray = await bubbleSort(bars.slice(), delay);
            break;
        case 'selection':
            sortedArray = await selectionSort(bars.slice(), delay);
            break;

        default:
            break;
    }

    for (let i = 0; i < sortedArray.length; i++) {
        const { value, element } = sortedArray[i];
        element.style.height = value + '%';
        element.classList.remove('sorting', 'picked');
        element.classList.add('sorted');
        await sleep(100); // Reduced delay for sorted bars
    }
}

function createBar(value, width) {
    const bar = document.createElement('div');
    bar.style.height = value + '%';
    bar.style.width = width;
    bar.classList.add('bar');
    bar.innerText = value;
    return bar;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function calculateDelay(speed) {
    // Adjust this calculation as needed for your desired speed range
    return 1000 / (2 ** speed);
}

async function bubbleSort(bars, delay) {
    const n = bars.length;
    let swapped;

    do {
        swapped = false;

        for (let i = 0; i < n - 1; i++) {
            if (bars[i].value > bars[i + 1].value) {
                [bars[i].value, bars[i + 1].value] = [bars[i + 1].value, bars[i].value];
                await updateVisualization(bars, i, i + 1, delay);
                swapped = true;
            }
        }
    } while (swapped);

    return bars;
}

async function selectionSort(bars, delay) {
    const n = bars.length;

    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;

        for (let j = i + 1; j < n; j++) {
            if (bars[j].value < bars[minIndex].value) {
                minIndex = j;
            }
        }

        if (minIndex !== i) {
            [bars[i].value, bars[minIndex].value] = [bars[minIndex].value, bars[i].value];
            await updateVisualization(bars, i, minIndex, delay);
        }
    }

    return bars;
}

async function updateVisualization(bars, index1, index2, delay) {
    const bar1 = bars[index1].element;
    const bar2 = bars[index2].element;

    bar1.classList.add('sorting');
    bar2.classList.add('sorting', 'picked');

    await sleep(delay);

    const tempHeight = bar1.style.height;
    bar1.style.height = bar2.style.height;
    bar2.style.height = tempHeight;

    const tempText = bar1.innerText;
    bar1.innerText = bar2.innerText;
    bar2.innerText = tempText;

    await sleep(delay);

    bar1.classList.remove('sorting');
    bar2.classList.remove('sorting', 'picked');
}

generateBars(); // Generate initial random bars
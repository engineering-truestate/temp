// function generateLighterColor() {
//     const letters = '89ABCDEF';
//     let color = '#';
//     for (let i = 0; i < 6; i++) {
//         color += letters[Math.floor(Math.random() * letters.length)];
//     }
//     return color.slice(1);
// }

// const randomBackgroundColor = generateLighterColor();

const colorPalette = [
    'FFB6C1',  // Light Pink
    'ADD8E6',  // Light Blue
    '90EE90',  // Light Green
    'FFA07A',  // Light Salmon
    'FFD700',  // Gold
    'FF6347',  // Tomato
    '87CEEB',  // Sky Blue
    'EE82EE',  // Violet
    'F4A460',  // Sandy Brown
    '7B68EE',  // Medium Slate Blue
    'FF69B4',  // Hot Pink
    '6B8E23',  // Olive Drab
    'FF4500',  // Orange Red
    '32CD32',  // Lime Green
    '00BFFF',  // Deep Sky Blue
    'BA55D3',  // Medium Orchid
];

function pickRandomColor() {
    const randomIndex = Math.floor(Math.random() * colorPalette.length);
    return colorPalette[randomIndex];
}

const randomBackgroundColor = pickRandomColor();

export const profilePic = (name) => {
    return `https://ui-avatars.com/api/?name=${name}&background=${randomBackgroundColor}`;
};
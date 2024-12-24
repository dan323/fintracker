interface Color {
    r: number,
    g: number,
    b: number,
}

const contrastColors: Color[] = [  
    { r: 0, g: 0, b: 0 },        // Black
    { r: 34, g: 34, b: 34 },     // Dark Gray
    { r: 0, g: 51, b: 102 },     // Navy Blue
    { r: 102, g: 51, b: 153 },   // Purple
    { r: 153, g: 51, b: 0 },     // Brown
    { r: 0, g: 102, b: 51 },     // Dark Green
    { r: 0, g: 128, b: 128 },    // Teal
    { r: 255, g: 69, b: 0 },     // Red-Orange
    { r: 255, g: 140, b: 0 },    // Dark Orange
    { r: 0, g: 128, b: 0 },      // Green
    { r: 75, g: 0, b: 130 },     // Indigo
    { r: 139, g: 0, b: 139 },    // Dark Magenta
    { r: 255, g: 20, b: 147 },   // Deep Pink
    { r: 70, g: 130, b: 180 },   // Steel Blue
    { r: 0, g: 0, b: 139 }       // Dark Blue
  ];


// Utility to generate a random base color
const generateBaseColor = (usedColors: Color[]) => {
    const unusedColors = contrastColors.filter((c) => !usedColors.some(c2 => c === c2));
    if (unusedColors.length > 0) {
        const randomIndex = Math.floor(Math.random() * (unusedColors.length - 1));
        return unusedColors[randomIndex];
    } else {
        const randomIndex = Math.floor(Math.random() * (contrastColors.length - 1));
        return contrastColors[randomIndex];
    }
};

const toString = (color: Color) => {
    return `rgb(${Math.min(color.r, 255)}, ${Math.min(color.g, 255)}, ${Math.min(color.b, 255)})`
}

// Utility to adjust a color for income or spending
const adjustColorForTransaction = (baseColor: Color, isIncome: boolean) => {
    const adjustment: Omit<Color,"b"> = isIncome ? { r: 0, g: 25 } : { r: 25, g: 0 }; // Add green for income, red for spending
    const adjustedColor = { r: baseColor.r + adjustment.r, g: baseColor.g + adjustment.g, b: baseColor.b };
    return toString(adjustedColor);
};

// Get or create a base color for a category
const getBaseColorForCategory = (category: string, categoryColorMap: Record<number, Color>, setColors: React.Dispatch<React.SetStateAction<Record<string, Color>>>) => {
    if (!categoryColorMap[category]) {
        const color = generateBaseColor(Object.values(categoryColorMap));
        setColors((prev: Record<string, Color>) => {
            const next: Record<string, Color> = { ...prev };
            next[category] = color;
            return next;
        })
        return color;
    } else {
        return categoryColorMap[category];
    }
};

// Get the adjusted color based on transaction type
export const getColorForTransaction = (category: string, isIncome: boolean, colors: Record<string, Color>, setColors: React.Dispatch<React.SetStateAction<Record<string, Color>>>) => {
    const baseColor = getBaseColorForCategory(category, colors, setColors);
    return adjustColorForTransaction(baseColor, isIncome);
};
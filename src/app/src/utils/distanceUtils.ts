export function formatDistance(distance: number | string, digit: number = 1) {
    return `${parseFloat(distance as string).toFixed(digit)} Km`;
}

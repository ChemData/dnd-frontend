export function replaceAll(str, search, replacement) {
    const searchRegex = new RegExp(search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
    return str.replace(searchRegex, replacement);
}
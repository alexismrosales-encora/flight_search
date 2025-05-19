export function capitalizeWords(str: string): string {
  if (!str) {
    return '';
  }

  return str
    .toLowerCase()
    .split(' ')
    .map(word => {
      if (word.length === 0) {
        return ''
      }
      return word.charAt(0).toUpperCase() + word.slice(1); // Capitalize the first letter and append the rest of the word (already lowercase)
    })
    .join(' ');   // Join the words back with spaces
}

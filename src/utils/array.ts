export function removeFromArray(array: string[], element: string): string[] {
  let index = array.indexOf(element);
  if (index != -1) {
    array.splice(index, 1);
  }
  return array;
}

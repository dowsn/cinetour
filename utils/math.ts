export default function sum(a: number, b: number): number {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new Error('Pass only numbers!');
  }
  return a + b;
}

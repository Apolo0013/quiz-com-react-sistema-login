export function ScrollTarget(target: Element) {
    target.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
}

export function randint(min: number, max: number): number {
  // min e max inclusivos
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const alfabeto: string[] = [
  "A","B","C","D","E","F","G","H","I","J",
  "K","L","M","N","O","P","Q","R","S","T",
  "U","V","W","X","Y","Z"
];


export function embaralhar<T>(array: T[]): T[] {
  const copia = [...array];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

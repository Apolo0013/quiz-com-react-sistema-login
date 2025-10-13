export function ScrollTarget(target: Element) {
    target.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
}

export function randint(min: number, max: number): number {
  // min e max inclusivos
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
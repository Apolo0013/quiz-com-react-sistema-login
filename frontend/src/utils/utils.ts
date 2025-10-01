export function ScrollTarget(target: Element) {
    target.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
}
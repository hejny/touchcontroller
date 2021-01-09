export function createNewOverlayElement(baseElement: HTMLElement): HTMLElement {
    const capturingElement = document.createElement('div');
    const { top, left, bottom, right } = baseElement.getBoundingClientRect();
    capturingElement.style.position = 'absolute' /* TODO: absolute/fixed from element */;
    capturingElement.style.top = top + 'px';
    capturingElement.style.left = left + 'px';
    capturingElement.style.bottom = bottom + 'px';
    capturingElement.style.right = right + 'px';
    baseElement.parentElement?.appendChild(capturingElement);
    return capturingElement;
}

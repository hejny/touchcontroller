import { SourceCache } from './Cache';

export function createImageFromSrc(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
        const image = window.document.createElement('IMG') as HTMLImageElement;
        image.addEventListener('load', () => resolve(image));
        image.src = src;
    });
}

const canvasFromSrcCache = new SourceCache<string, HTMLCanvasElement>();

export async function createCanvasFromSrc(
    src: string,
): Promise<HTMLCanvasElement> {
    if (canvasFromSrcCache.hasItem(src)) {
        return canvasFromSrcCache.getItem(src)!;
    }
    const image = await createImageFromSrc(src);
    const canvas = window.document.createElement('CANVAS') as HTMLCanvasElement;
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d')!; // TODO: is this canvas usable?
    ctx.drawImage(image, 0, 0);
    canvasFromSrcCache.setItem(src, canvas);
    return canvas;
}

const canvasColoredFromSrcCache = new SourceCache<string, HTMLCanvasElement>();

// TODO: Color library

export async function createColoredCanvasFromSrc(
    src: string,
    color: string,
): Promise<HTMLCanvasElement> {
    const id = `${src}#${color}`;
    if (canvasColoredFromSrcCache.hasItem(id)) {
        return canvasColoredFromSrcCache.getItem(id)!;
    }
    const canvas = await createCanvasFromSrc(src);
    const ctx = canvas.getContext('2d')!; // TODO: is this canvas usable?
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const data = imageData.data;

    // convert image to grayscale
    const rgbColor = hexToRgb(color);

    for (let p = 0, len = data.length; p < len; p += 4) {
        if (data[p + 3] === 0) {
            continue;
        }
        data[p + 0] = rgbColor.r;
        data[p + 1] = rgbColor.g;
        data[p + 2] = rgbColor.b;
        data[p + 3] = 255;
    }

    const canvasColored = window.document.createElement(
        'CANVAS',
    ) as HTMLCanvasElement;
    canvasColored.width = canvas.width;
    canvasColored.height = canvas.height;
    const ctxColored = canvasColored.getContext('2d')!;
    ctxColored.putImageData(imageData, 0, 0);
    canvasColoredFromSrcCache.setItem(id, canvasColored);
    return canvasColored;
}

// TODO: to separate file
function hexToRgb(color: string) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    color = color.replace(shorthandRegex, (m, r, g, b) => {
        return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : {
            r: 0,
            g: 0,
            b: 0,
        };
}

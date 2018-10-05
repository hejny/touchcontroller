export function createImageFromSrc(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = window.document.createElement('IMG') as HTMLImageElement;
        image.addEventListener('load', () => resolve(image));
        image.src = src;
    });
}

export async function createCanvasFromSrc(
    src: string,
): Promise<HTMLCanvasElement> {
    const image = await createImageFromSrc(src);
    const canvas = window.document.createElement('CANVAS') as HTMLCanvasElement;
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d')!; //todo is this canvas usable?
    ctx.drawImage(image, 0, 0);
    return canvas;
}

export async function createColoredCanvasFromSrc(
    src: string,
    color: string,
): Promise<HTMLCanvasElement> {
    const canvas = await createCanvasFromSrc(src);
    const ctx = canvas.getContext('2d')!; //todo is this canvas usable?
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const data = imageData.data;

    // convert image to grayscale
    var rgbColor = hexToRgb(color);

    for (var p = 0, len = data.length; p < len; p += 4) {
        if (data[p + 3] == 0) continue;
        data[p + 0] = rgbColor.r;
        data[p + 1] = rgbColor.g;
        data[p + 2] = rgbColor.b;
        data[p + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
    return canvas;
}

//todo to separate file
function hexToRgb(color: string) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    color = color.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
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

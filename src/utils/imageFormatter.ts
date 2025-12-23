export const imageFormatter = async (title: string, content: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const imgTags = Array.from(doc.querySelectorAll('img'));

    if (imgTags.length == 0) {
        return {
            status: false,
        };
    }

    return {
        status: true,
        thumbnail: imgTags[0].src,
    };
};


export const compressImage = async (sourceBase64: string, quality: number = 0.7): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = sourceBase64;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Canvas context not available'));
                return;
            }
            ctx.drawImage(img, 0, 0);
            const webpBase64 = canvas.toDataURL('image/webp', quality);
            resolve(webpBase64);
        };
        img.onerror = (error) => reject(error);
    });
};

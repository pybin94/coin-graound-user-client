export const imageFormatter = async (title: string, content: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const imgTags = Array.from(doc.querySelectorAll('img'));

    for (let i = 0; i < imgTags.length; i++) {
        const img = imgTags[i];
        const src = img.getAttribute('src');
        const alt = img.getAttribute('alt');
        const MAX_IMAGE_MB = 5;


        if (!src) continue;

        if (isBase64Image(src)) {
            const sizeMB = getBase64SizeInMB(src);

            if (sizeMB > MAX_IMAGE_MB) {
                return {
                    status: false,
                    reason: 'IMAGE_TOO_LARGE',
                    message: `${i + 1}번째 이미지가 용량을 초과했습니다.<br>이미지 업로드 용량은 최대 ${MAX_IMAGE_MB}MB 입니다.`,
                };
            }
        }
        
        if (!alt || alt.trim() === '') {
            img.setAttribute('alt', title || 'image');
        }
    }

    return {
        status: true,
        html: doc.body.innerHTML,
        thumbnail: extractFirstImage(doc),
    };
};


const isBase64Image = (src: string) => {
    return src.startsWith('data:image/');
};

const extractFirstImage = (doc: Document): string | null => {
    const firstImg = doc.querySelector('img');
    if (!firstImg) return null;

    const src = firstImg.getAttribute('src');
    if (!src) return null;

    return `<img src="${src}" />`;
};

const getBase64SizeInBytes = (base64: string) => {
    const pureBase64 = base64.split(',')[1] ?? base64;
    return Math.ceil((pureBase64.length * 3) / 4);
};

const getBase64SizeInMB = (base64: string) =>
    getBase64SizeInBytes(base64) / 1024 / 1024;

// export const imageFormatter = async (title: string, content: string) => {
//     const parser = new DOMParser();
//     const doc = parser.parseFromString(content, 'text/html');
//     const imgTags = doc.querySelectorAll('img');

//     let thumbnail = null
    
//     if(imgTags.length !== 0) {
//         try {

//             for (let i = 0; i < imgTags.length; i++) {
//                 const sourceBase64 = imgTags[i].getAttribute('src');
//                 const altAttr = imgTags[i].getAttribute('alt');

//                 const sizeInBytes = (4 * sourceBase64.length) / 3;
//                 const sizeInKilobytes = sizeInBytes / 1024;

//                 if (sizeInKilobytes > 20000) {
//                     return { 
//                         status: false,
//                         index: i+1
//                     };
//                 }

//                 if (isBase64(sourceBase64) && !altAttr) {
//                   const compressResult = await compressImages(sourceBase64, 0.7);
//                   imgTags[i].setAttribute('src', compressResult);
//                   imgTags[i].setAttribute('alt', title);
//                 }

//                 if (i == 0) {
//                     const compressThumbnail = await compressImages(sourceBase64, 0.5, 150);

//                     let divElement = document.createElement('div');
//                     let imageElement = document.createElement('img');
//                     imageElement.setAttribute('src', compressThumbnail);
//                     divElement.append(imageElement)
//                     thumbnail = divElement.innerHTML
//                 }
//             }

//             return {
//                 status: true,
//                 html: doc.querySelector('body').innerHTML,
//                 thumbnail,
//             }
//         } catch (error) {
//             console.log(["[Error] imageFormatter: "], error)
//         }
//     }
// }

// const isBase64 = (base64: string) => {
//     const base64Regex = /^(data:image\/[a-zA-Z+]+;base64,)?([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/;
//     return base64Regex.test(base64);
// }

// const compressImages = async (sourceBase64: string, quality: number, setWidth?: number): Promise<any> => {
//     try {
//         return new Promise((resolve, reject) => {
//             let img = new Image();
//             img.src = sourceBase64;
//             img.onload = function() {
//                 const ratio = img.width / img.height
//                 let canvas = document.createElement('canvas');
//                 let width = setWidth ? setWidth : img.width;
//                 let height = setWidth ? setWidth / ratio : img.height;

//                 canvas.width = width;
//                 canvas.height = height;

//                 let ctx = canvas.getContext('2d');
//                 ctx.fillStyle = '#FFFFFF';
//                 ctx.fillRect(0, 0, canvas.width, canvas.height);
//                 ctx.drawImage(img, 0, 0, width, height);

//                 canvas.toBlob(
//                     blob => {
//                         const reader = new FileReader();
//                         reader.readAsDataURL(blob);
//                         reader.onloadend = () => {
//                             const base64data = reader.result;
//                             resolve(base64data);
//                         };
//                     },
//                     'image/webp',
//                     quality
//                 );
//             };

//             img.onerror = function(error) {
//                 reject(error);
//             };
//         });
//     } catch (error) {
//         return false
//     }
// }

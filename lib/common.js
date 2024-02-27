export const camelToKebab = (input) => input.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
export const kebabToCamel = (input) => input.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
export const kebabize = (data) => {
    const result = {};
    Object.keys(data).forEach((key) => {
        if (typeof data[key] !== 'undefined') {
            result[camelToKebab(key)] = data[key];
        }
    });
    return result;
};
export const getImageFromBase64 = (encoded) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = encoded;
        img.onload = () => resolve(img);
        img.onerror = (e) => resolve(img);
    });
};
export const getBase64FromImage = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

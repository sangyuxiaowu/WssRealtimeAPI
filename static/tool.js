// tool
var tool = {};
tool.msdate = function (ms) {
    if(ms>60000){
        return Math.floor(ms/1000/60) + "′" + (Math.ceil(ms/1000) % 60) + "″";
    }else{
        return Math.floor(ms/1000) + "″";
    }
};
// 将ArrayBuffer转换为Base64字符串的函数
tool.arrayBufferToBase64 = function (buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
};
// 将Base64字符串分割成块的函数
tool.splitBase64String = function (base64String, chunkSize) {
    const chunks = [];
    for (let i = 0; i < base64String.length; i += chunkSize) {
        chunks.push(base64String.substring(i, i + chunkSize));
    }
    return chunks;
};

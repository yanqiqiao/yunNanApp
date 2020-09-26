var CryptoJS = require("crypto-js")

export function AES_ECB_encrypt(message, key) {
  // aes 加密
  // utf8字符串—>WordArray对象，WordArray是一个保存32位整数的数组，相当于转成了二进制
  let keyHex = CryptoJS.enc.Utf8.parse(key); //
  let messageHex = CryptoJS.enc.Utf8.parse(message);
  let encrypted = CryptoJS.AES.encrypt(messageHex, keyHex, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();// base64结果
  //return encrypted.ciphertext.toString();   // 二进制结果
}
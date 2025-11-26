import crypto from "crypto";

const ALGO = "aes-256-gcm";
const KEY = process.env.ENCRYPTION_KEY ? Buffer.from(process.env.ENCRYPTION_KEY, "hex") : null;

export function encrypt(value: string) {
  if (!KEY || KEY.length !== 32) throw new Error("Invalid encryption key");
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, KEY, iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return {
    iv: iv.toString("hex"),
    tag: authTag.toString("hex"),
    data: encrypted.toString("hex"),
  };
}

export function decrypt(payload: { iv: string; tag: string; data: string }) {
  if (!KEY || KEY.length !== 32) throw new Error("Invalid encryption key");
  const iv = Buffer.from(payload.iv, "hex");
  const authTag = Buffer.from(payload.tag, "hex");
  const encryptedData = Buffer.from(payload.data, "hex");
  const decipher = crypto.createDecipheriv(ALGO, KEY, iv);
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
  return decrypted.toString("utf8");
}

import { randomBytes, scrypt, timingSafeEqual, } from "node:crypto";
export function hashPassword(password) {
    return new Promise((resolve, reject) => {
        const salt = randomBytes(16).toString("hex");
        scrypt(password, salt, 64, (error, derivedKey) => {
            if (error) {
                reject(error);
                return;
            }
            const hash = derivedKey.toString("hex");
            resolve(`${salt}:${hash}`);
        });
    });
}
export function verifyPassword(password, storedPassword) {
    return new Promise((resolve, reject) => {
        const [salt, storedHash] = storedPassword.split(":");
        if (!salt || !storedHash) {
            resolve(false);
            return;
        }
        const storedHashBuffer = Buffer.from(storedHash, "hex");
        scrypt(password, salt, storedHashBuffer.length, (error, derivedKey) => {
            if (error) {
                reject(error);
                return;
            }
            if (storedHashBuffer.length !==
                derivedKey.length) {
                resolve(false);
                return;
            }
            resolve(timingSafeEqual(storedHashBuffer, derivedKey));
        });
    });
}
//# sourceMappingURL=password.js.map
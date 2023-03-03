import { decode } from "iconv-lite";
export const checkPassword = (password, email) => {
    let mPassword = password.trim();
    let mEmail = email.trim();
    if (mPassword.length >= 8) {
        if ((/([a-zA-Z])/).test(mPassword) && (/([0-9])/).test(mPassword) && (/([@._$#~%])/).test(mPassword) && !(/([{}()\\/'"`,;:<>])/).test(mPassword)) {
            if (mPassword === mEmail) {
                return {
                    "valid": false,
                    "reason": "Your email can't be your password"
                };
            } else {
                return {
                    "valid": true,
                    "reason": ""
                };
            }
        } else {
            return {
                "valid": false,
                "reason": "Password must be alphanumeric, must contain @._$#~% at least one of these"
            };
        }
    } else {
        if (mPassword.length == 0) {
            return {
                "valid": false,
                "reason": "Password required"
            };
        } else {
            return {
                "valid": false,
                "reason": "Password length must be 8 digits in length"
            };
        }
    }
};
export const performDecryption = (event) => {
    try {
        return JSON.parse(JSON.parse(decode(Buffer.from(event.data), "win1251")));
    } catch (error) {
        console.log(error);
    }
};
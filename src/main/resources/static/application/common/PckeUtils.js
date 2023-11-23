const pkceUtils = {

    generateRandomString: () => {
        const array = new Uint32Array(56 / 2);
        window.crypto.getRandomValues(array);
        return Array.from(array, pkceUtils.dec2hex).join('');
    },

    dec2hex: dec => {
        return ('0' + dec.toString(16)).substr(-2);
    },

    sha256: plain => { // returns promise ArrayBuffer
        const encoder = new TextEncoder();
        const data = encoder.encode(plain);
        return window.crypto.subtle.digest('SHA-256', data);
    },

    base64UrlEncode: a => {
        // Convert the ArrayBuffer to string using Uint8 array.
        // btoa takes chars from 0-255 and base64 encodes.
        // Then convert the base64 encoded to base64url encoded.
        // (replace + with -, replace / with _, trim trailing =)
        return btoa(String.fromCharCode.apply(null, new Uint8Array(a)))
            .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    },

    getChallenge: async codeVerifier => {
        const verifier = await pkceUtils.sha256(codeVerifier);
        return pkceUtils.base64UrlEncode(verifier);
    }

}
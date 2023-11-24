const key = process.env.FRONT_KEY
function decryptStringWithKey(encryptedString, key) {
	let decryptedString = "";
	for (let i = 0; i < encryptedString.length; i++) {
		const charCode = encryptedString.charCodeAt(i);
		const keyChar = key.charCodeAt(i % key.length);
		const decryptedCharCode = charCode - keyChar;
		decryptedString += String.fromCharCode(decryptedCharCode);
	}
	return decryptedString;
}

function decryptArrayWithKey(encryptedString) {
	const decryptedString = decryptStringWithKey(encryptedString, key);
	const decryptedArray = JSON.parse(decryptedString);
	return decryptedArray;
}

module.exports = {
	decryptArrayWithKey
}

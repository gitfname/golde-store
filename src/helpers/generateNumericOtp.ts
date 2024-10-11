export function generateNumericOTP(length: number = 5): string {
    // Ensure the length is a positive integer
    if (length <= 0) {
        throw new Error('Length must be a positive integer.');
    }

    // Generate a random numeric OTP code of the specified length
    const otp = Math.floor(Math.random() * Math.pow(10, length)).toString();

    // Pad the OTP with leading zeros if necessary
    return otp.padStart(length, '0');
}
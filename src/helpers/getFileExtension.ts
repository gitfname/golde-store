export default function getFileExtension(url: string): string {
    const lastDotIndex = url.lastIndexOf('.');
    if (lastDotIndex === -1) {
        return ''; // No extension found
    }
    return url.substring(lastDotIndex + 1).toLowerCase();
}
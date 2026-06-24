export function isVideoUrl(url: string): boolean {
  return /\.(mp4|webm|ogg|mov|m4v)$/i.test(url);
}
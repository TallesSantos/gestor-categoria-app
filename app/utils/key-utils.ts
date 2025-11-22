export function genRandonKey(): string {
  return ((Date.now() * Math.random()) / 100).toString();
}

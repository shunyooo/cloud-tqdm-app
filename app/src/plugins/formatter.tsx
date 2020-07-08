export function numToDisplay(d: number): string {
  return d.toString().padStart(2, "0");
}

export function secondsToHms(d: number): string {
  d = Number(d);
  const h = Math.floor(d / 3600);
  const m = Math.floor((d % 3600) / 60);
  const s = Math.floor((d % 3600) % 60);

  const hDisplay = h > 0 ? numToDisplay(h) + ":" : "";
  const mDisplay = numToDisplay(m) + ":";
  const sDisplay = numToDisplay(s);
  return hDisplay + mDisplay + sDisplay;
}

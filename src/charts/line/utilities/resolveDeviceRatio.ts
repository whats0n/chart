export const resolveDeviceRatio = {
  increment: (n: number) => n * window.devicePixelRatio,
  decrement: (n: number) => n / window.devicePixelRatio,
}

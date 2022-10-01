type TimingFunction = Record<
  | 'linear'
  | 'easeInQuad'
  | 'easeOutQuad'
  | 'easeInOutQuad'
  | 'easeInCubic'
  | 'easeOutCubic'
  | 'easeInOutCubic'
  | 'easeInQuart'
  | 'easeOutQuart'
  | 'easeInOutQuart'
  | 'easeInQuint'
  | 'easeOutQuint'
  | 'easeInOutQuint',
  (time: number) => number
>

export class Motion {
  public static timingFunction: TimingFunction = {
    linear: (t) => t,
    easeInQuad: (t) => t * t,
    easeOutQuad: (t) => t * (2 - t),
    easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
    easeInCubic: (t) => t * t * t,
    easeOutCubic: (t) => --t * t * t + 1,
    easeInOutCubic: (t) =>
      t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    easeInQuart: (t) => t * t * t * t,
    easeOutQuart: (t) => 1 - --t * t * t * t,
    easeInOutQuart: (t) =>
      t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
    easeInQuint: (t) => t * t * t * t * t,
    easeOutQuint: (t) => 1 + --t * t * t * t * t,
    easeInOutQuint: (t) =>
      t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t,
  }

  public static animate = ({
    timingFunction,
    onUpdate,
    duration,
    onComplete,
  }: {
    timingFunction: keyof TimingFunction | ((time: number) => number)
    onUpdate: (progress: number) => unknown
    onComplete: () => void
    duration: number
  }) => {
    let start = performance.now()

    const animate = (time: number) => {
      // timeFraction goes from 0 to 1
      let timeFraction = (time - start) / duration

      if (timeFraction > 1) timeFraction = 1

      // calculate the current animation state
      let progress =
        typeof timingFunction === 'function'
          ? timingFunction(timeFraction)
          : Motion.timingFunction[timingFunction](timeFraction)

      let isDone = typeof onUpdate === 'function' && onUpdate(progress) // update it

      if (timeFraction < 1 && !isDone) {
        requestAnimationFrame(animate)
      } else if (typeof onComplete === 'function') {
        onComplete()
      }
    }

    requestAnimationFrame(animate)
  }

  public static growY = (
    position: number,
    height: number,
    progress: number
  ): number => (position - height) * progress + height

  public static translateY = (
    position: number,
    height: number,
    progress: number
  ): number => height - height * progress + position
}

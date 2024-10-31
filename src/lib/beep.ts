type Opts = {
  ramp?: number
  dur?: number
}

export const beep = (
  freq: number,
  { ramp = 0.01, dur = 0.1 }: Opts = {},
) => {
  const ctx = new AudioContext()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  const now = ctx.currentTime

  osc.frequency.value = freq

  osc.connect(gain)
  gain.connect(ctx.destination)

  gain.gain.setValueAtTime(0, now)
  gain.gain.exponentialRampToValueAtTime(1, now + ramp)
  gain.gain.setValueAtTime(1, now + dur - ramp)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + dur)

  osc.start(now)
}

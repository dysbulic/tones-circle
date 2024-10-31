<script>
  import { A432 } from '../lib/notes'

  const beep = () => {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const now = ctx.currentTime

    const ramp = 0.01
    const dur = 0.1

    osc.frequency.value = A432[5].C

    osc.connect(gain)
    gain.connect(ctx.destination)

    gain.gain.setValueAtTime(0, now)
    gain.gain.exponentialRampToValueAtTime(1, now + ramp)
    gain.gain.setValueAtTime(1, now + dur - ramp)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur)

    osc.start(now)
  }
</script>

<button on:click={beep}>Beep</button>
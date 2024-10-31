<script>
  import clsx from 'clsx'
  import { beep } from '$lib/beep'
  import { A432 } from '$lib/notes'

  let segCount = $state(12)
  let space = $state(1 / 5)
  let width = $derived(1 / space)
  let centerR = $state(5)
  let maxW = $derived(50 - centerR / 2)
  const notes = (
    A432.map((octave) => Object.values(octave)).flat()
  )
  let step = $state(0)
  let delay = $state(500)
  setInterval(() => {
    step = (step + 1) % segCount
  }, delay)
</script>

<svg viewBox="0 0 500 500">
  <g
    transform={`rotate(
    ${
      (360 / segCount) / 2
      + (360 / segCount) * space / 2
      + (360 / segCount) * -(segCount / 3)
    }
    250
    250
  )`}>
    {#each Array.from({ length: notes.length }) as _, i}
      {#each Array.from({ length: segCount }) as _, j}
        <circle
          cx="50%" cy="50%"
          r={`${(maxW * ((i + 1) / notes.length) + (maxW * (centerR / 100)))}%`}
          stroke-dasharray={`${width - 1} ${(segCount * width) - (width - 1)}`}
          stroke-dashoffset={j * width}
          pathLength={segCount * width}
          class={clsx(step === segCount - j && 'active')}
          on:click={() => beep(notes[i])}
        />
      {/each}
    {/each}
  </g>
  <line
    x1="50%" y1="50%" x2="50%" y2="0"
    transform={`rotate(${(360 / segCount) * step} 250 250)`}
  />
</svg>

<style>
  svg {
    width: 100vw;
    height: 100vh;
    stroke: green;
    stroke-width: 0.25vmin;
    fill: none;
  }
  circle:hover {
    stroke: blue;
    stroke-width: 3vmin
  }
  .active {
    stroke: orangered;
  }
  circle.active:hover {
    stroke: cyan;
  }
  line {
    stroke: red;
    stroke-width: 0.5vmin;
  }
</style>
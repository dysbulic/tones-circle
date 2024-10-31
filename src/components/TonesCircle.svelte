<script lang="ts">
  import clsx from 'clsx'
  import { beep } from '$lib/beep'
  import * as NoteLib from '$lib/notes'

  type Indices = { i: number, j: number }

  const {
    segCount = 12,
    space = 1 / 5,
    centerR = 5,
    delay = 500,
    noteSet = 'A432',
  }: {
    segCount?: number,
    space?: number,
    centerR?: number,
    delay?: number,
    noteSet?: 'A432' | 'A440',
  } = $props()

  let width = $derived(1 / space)
  let maxW = $derived(50 - centerR / 2)
  const notes = (
    NoteLib[noteSet].map((octave) => (
      Object.entries(octave)
      .map(([note, freq]) => ({ note, freq }))
    )).flat()
  )
  let step = $state(0)
  let selected = $state<Array<Indices>>([])

  setInterval(() => {
    step = (step + 1) % segCount
    const noteIdxs = (
      selected
      .filter(({ j }) => j === step)
      .map(({ i }) => i)
    )
    noteIdxs.forEach((idx: number) => {
      beep(notes[idx].freq)
    })
  }, delay)

  const id = (i: number, j: number) => (
    i * segCount + j
  )

  const toggle = (idxs: Indices) => {
    const match = ({ i: ii, j: jj }: Indices) => (
      ii === idxs.i && jj === idxs.j
    )
    const found = !!selected.find(match)
    selected = (
      found
      ? selected.filter((idxs) => !match(idxs))
      : [...selected, idxs]
    )
    return !found
  }

  const select = (elem: SVGElement) => {
    elem.addEventListener('click', () => {
      const present = toggle(
        {
          i: Number(elem.dataset.i),
          j: Number(elem.dataset.j),
        }
      )
      if(present) {
        elem.classList.add('selected')
      } else {
        elem.classList.remove('selected')
      }
    })
  }
</script>

<svg viewBox="0 0 500 500">
  <g
    transform={`rotate(
    ${
      (360 / segCount) / 2 + (360 / segCount) * space / 2
      - (360 / segCount) * (segCount / 3)
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
          stroke-dashoffset={(segCount - j) * width}
          pathLength={segCount * width}
          data-i={i} data-j={j}
          class={clsx(
            `arcs-${j}`, `arc-${id(i, j)}`,
            step === j && 'active',
            !!selected.find(
              ({ i: ii, j: jj }) => (
                ii === i && jj === j
              )
            ) && 'selected',
          )}
          use:select
        >
          <title>{
            Math.floor(i / segCount)
          }:{
            notes[i % segCount - 1]?.note
          }</title>
        </circle>
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
    stroke-width: 0.5vmin;
    fill: none;
  }
  circle:hover {
    stroke: blue;
    stroke-width: 3vmin
  }
  .active {
    stroke: orangered;
  }
  .arcs-0 {
    stroke-opacity: 0.5;
  }
  .arcs-5.active, .arcs-7.active {
    stroke: purple;
  }
  circle.active:hover {
    stroke: cyan;
  }
  line {
    stroke: red;
    stroke-width: 1.5vmin;
    stroke-linecap: round;
  }
  .selected {
    stroke: yellow;
    stroke-width: 3vmin;
  }
  .selected:hover {
    stroke: cornflowerblue;
  }
</style>
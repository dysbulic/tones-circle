<script>
  import { beep } from '$lib/beep'
  import { A432 } from '$lib/notes'

</script>

<button on:click={() => beep(A432[5].C)}>Beep</button>
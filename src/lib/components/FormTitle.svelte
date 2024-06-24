<script lang="ts">
    import type { FormField } from "../../data/type/formConfigTypes";


      export let fieldDef: FormField;
      export let value: string;
</script>

<div style="font-weight: bold">{fieldDef.label}</div>

<style>

    * {box-sizing: border-box}
</style>

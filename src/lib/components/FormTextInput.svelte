<script lang="ts">
    import type { FormField } from "../../data/type/formConfigTypes";
    import { createEventDispatcher } from "svelte";

      export let fieldDef: FormField;
      export let value: string = "";

      const dispatch = createEventDispatcher();

      function input(e: any) {
          dispatch("input", e.target.value)
      }
</script>

<input
    style="border: 1px solid gray"
    type="{ fieldDef.type }"
    placeholder="{fieldDef.placeholder}"
    value="{value}"
    on:input="{input}"
    required="{fieldDef.required ? true : undefined}" />

<style>

    * {box-sizing: border-box}
</style>

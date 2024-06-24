<script lang="ts">
    import type { FormField } from "../../data/type/formConfigTypes";
    import { createEventDispatcher } from "svelte";

      export let fieldDef: FormField;
      export let value: string;

      const dispatch = createEventDispatcher();

      function input(e: any) {
          dispatch("input", e.target.value)
      }
</script>

<select
    style="border: 1px solid gray"
    placeholder="{fieldDef.placeholder}"
    value="{value}"
    on:input="{input}">
    {#if fieldDef.options} {#each fieldDef.options as option}
    <option value="{option.value}">{option.label}</option>
    {/each} {/if}
</select>

<style>

    * {box-sizing: border-box}
</style>

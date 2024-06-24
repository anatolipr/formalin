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

<div style="flex-direction: column; gap: 4px; display: flex">
    {#if fieldDef.options} {#each fieldDef.options as option}
    <label
        style="justify-content: flex-start; align-items: center; gap: 7px; display: flex">
        <input
            value="{option.value}"
            type="radio"
            on:input="{input}"
            name="{fieldDef.fieldName}" />
        <div>{option.label}</div></label
    >
    {/each} {/if}
</div>

<style>

    * {box-sizing: border-box}
</style>

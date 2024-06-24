<script lang="ts">
    import type { FormField } from "../../data/type/formConfigTypes";

    import { createEventDispatcher } from "svelte";

    export let fieldDef: FormField;
    export let value: string;

    let selectedOptions: string[] = getSelectedOptions(value);

    function getSelectedOptions(value: string): string[] {
        return value?.split(",");
    }

    $: selectedOptions = getSelectedOptions(value);

    const dispatch = createEventDispatcher();

    function input(e: any) {
        const selectedOption = e.target.value;
        if (selectedOptions?.includes(selectedOption)) {
            selectedOptions = selectedOptions.filter(option => option !== selectedOption);
        } else {
            selectedOptions = [...(selectedOptions||[]), selectedOption];
        }
        dispatch("input", selectedOptions.join(","));
    }
</script>

<div style="flex-direction: column; gap: 4px; display: flex">
    {#if fieldDef.options} {#each fieldDef.options as option}
    <label
        style="justify-content: flex-start; align-items: center; gap: 7px; display: flex">
        <input
            type="checkbox"
            value="{option.value}"
            checked="{selectedOptions?.includes(option.value)}"
            on:change="{input}" />
        <div>{option.label}</div></label
    >
    {/each} {/if}
</div>

<style>

    * {box-sizing: border-box}
</style>

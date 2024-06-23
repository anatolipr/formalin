<script lang="ts">
    import { type Option } from "../data/type/formConfigTypes";
    export let value: Option<string> = { label: "", value: "" };
    export let labelPlaceholder = "";
    export let valuePlaceholder = "";

    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export function input() {
        dispatch("input", {...value});
    }
</script>

<div style="display: flex; flex-direction: column">
    <input
        style="width: 190px; height: 22px; font-size: 14px; border-top-left-radius: 5px; border-top-right-radius: 5px; border-bottom-right-radius: unset; border-bottom-left-radius: unset; border: 1px solid"
        type="text"
        placeholder="{valuePlaceholder ? valuePlaceholder : 'value'}"
        bind:value="{value.value}"
        on:input="{input}" />
    <input
        style="width: 190px; height: 22px; margin-top: -1px; font-size: 14px; border-top-left-radius: unset; border-top-right-radius: unset; border-bottom-right-radius: 5px; border-bottom-left-radius: 5px; border: 1px solid"
        type="text"
        placeholder="{labelPlaceholder ? labelPlaceholder : 'label'}"
        bind:value="{value.label}"
        on:input="{input}" />
</div>

<style>

    * {box-sizing: border-box}
</style>

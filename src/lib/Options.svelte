<script lang="ts">
    import OptionInput from "./OptionInput.svelte";
    import { type Option } from "../data/type/formConfigTypes";
    import { createEventDispatcher } from "svelte";

    import { fly } from 'svelte/transition';

    export let value: Option<string>[] = [{
        label: '', value: ''
    }]

    import { tick } from "svelte";

    let inputs: OptionInput[] = [];

    const dispatch = createEventDispatcher();


    async function addAfter(index: number) {
        value = [...value.slice(0, index + 1), {label: '', value: ''}, ...value.slice(index + 1)];
        dispatch('input', value)
        await tick();
        inputs[index + 1].focus();
    }

    async function add() {
        value = [...value, {label: '', value: ''}];
        dispatch('input', value);
        await tick();
        inputs[inputs.length - 1].focus();
    }

    function remove(index: number) {
        value = value.filter((_, i) => i !== index);
        dispatch('input', value)
    }

    async function moveUp(index: number) {
        if (index === 0) return;
        const temp = value[index];
        value[index] = value[index - 1];
        value[index - 1] = temp;
        dispatch('input', value)
        await tick();
        inputs[index - 1].focus();
    }

    async function moveDown(index: number) {
        if (index === value.length - 1) return;
        const temp = value[index];
        value[index] = value[index + 1];
        value[index + 1] = temp;
        dispatch('input', value)
        await tick();
        inputs[index + 1].focus();
    }

    function updateOption(index: number, option: Option<string>) {
        value = value.map((o, i) => i === index ? option : o);
        dispatch('input', value)
    }

    function keydown(e: KeyboardEvent, index: number) {

        if (!e.altKey) return;

        if (e.key === 'ArrowUp') {
            moveUp(index)
        } else if (e.key === 'ArrowDown') {
            moveDown(index)
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
            remove(index)
        } else if (e.key === 'Enter') {
            addAfter(index)
        }

        e.preventDefault()
    }

    if (inputs.length > 0) {
        inputs[0].focus();
    }
</script>

<div style="position: relative" class="options-wrap">
    {#each value as option, index} <OptionInput value="{option}"
    bind:this={inputs[index]} on:input={(e) => updateOption(index, e.detail)}
    on:keydown={(e) => keydown(e.detail, index)} /> {/each}
    <button class="attr-btn" type="button" on:click="{add}">Add</button>
</div>

<style>
    .attr-btn {
      font-size: 13px;
      border: 1px solid gray;
    }

    .options-wrap {
      padding: 2px;
      flex-direction: column;
      gap: 9px;
      display: flex
    }

    * {box-sizing: border-box}
</style>

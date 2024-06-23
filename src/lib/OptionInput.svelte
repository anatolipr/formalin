<script lang="ts">
    import { type Option } from "../data/type/formConfigTypes";
    export let value: Option<string>;
    export let labelPlaceholder = '';
    export let valuePlaceholder = '';

    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    let input: HTMLInputElement;

    function updateValue(newValue: string) {
        value.value = newValue;
        dispatch('input', value)
    }

    function updateLabel(newLabel: string) {
        value.label = newLabel;
        dispatch('input', value)
    }

    export function focus() {
        input?.focus();
    }
</script>

<div style="display: flex; flex-direction: column">
    <input
        class="option-inputs opton-top-input"
        type="text"
        placeholder="{valuePlaceholder ? valuePlaceholder : 'value'}"
        value="{value.value}"
        on:input="{(e) => updateValue(e.target.value)}"
        on:keydown="{(e) => dispatch('keydown', e)}"
        bind:this="{input}" />
    <input
        class="option-inputs option-bottom-input"
        type="text"
        placeholder="{labelPlaceholder ? labelPlaceholder : 'label'}"
        value="{value.label}"
        on:input="{(e) => updateLabel(e.target.value)}"
        on:keydown="{(e) => dispatch('keydown', e)}" />
</div>

<style>
    .option-inputs {
      font-size: 14px;
      border: 1px solid
    }

    .opton-top-input {
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      border-bottom-right-radius: unset;
      border-bottom-left-radius: unset
    }

    .option-bottom-input {
      margin-top: -1px;
      border-top-left-radius: unset;
      border-top-right-radius: unset;
      border-bottom-right-radius: 5px;
      border-bottom-left-radius: 5px
    }

    * {box-sizing: border-box}
</style>

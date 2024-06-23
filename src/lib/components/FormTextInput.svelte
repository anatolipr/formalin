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

<input
    style="height: 40px; border: 1px solid gray"
    type="text"
    placeholder="{fieldDef?.placeholder}"
    value="{value}"
    on:input="{input}" />
<style>

    * {box-sizing: border-box}
</style>

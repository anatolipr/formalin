<script lang="ts">
    export let options = [{
        label: '', value: ''
    }]
</script>
<div
    style="position: relative; padding: 2px; flex-direction: column; gap: 9px; display: flex">
    {#each options as option}
    <div style="display: flex; flex-direction: column">
        <input
            style="width: 190px; height: 22px; font-size: 14px; border-top-left-radius: 5px; border-top-right-radius: 5px; border-bottom-right-radius: unset; border-bottom-left-radius: unset; border: 1px solid"
            type="text"
            placeholder="value" />
        <input
            style="width: 190px; height: 22px; margin-top: -1px; font-size: 14px; border-top-left-radius: unset; border-top-right-radius: unset; border-bottom-right-radius: 5px; border-bottom-left-radius: 5px; border: 1px solid"
            type="text"
            placeholder="label" />
    </div>
    {/each}
    <button class="attr-btn" type="button">Add</button>
</div>

<style>
    .attr-btn {
      font-size: 13px;
      border: 1px solid gray;
    }

    * {box-sizing: border-box}
</style>

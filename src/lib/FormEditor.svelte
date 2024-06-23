<script lang="ts">

    import {
        addSection,
        removeField,
        removeSection,
        updateSectionTitle,
        updateSectionDescription,
        updateFieldLabel,
        updateFieldDescription,
        updateFieldName,
        updateFieldCondition,
        updateFieldOptions,
        updateFieldRequired,
        updateFieldType,
        updateFeildPlaceholder,
        form,
        addEmptyField,
        conditionAsOption,

        updateFieldValue


    } from "../data/stores";


    import Options from "./Options.svelte";
    import { TypeOptions, supportsOptions, supportsPlaceholder } from "../data/type/formConfigTypes";
    import OptionInput from "./OptionInput.svelte";

    import DynamicForm from "./components/DynamicForm.svelte";
    addSection();
</script>

<div
    style="position: relative; flex-direction: column; gap: 15px; display: flex">
    <div style="padding: 0px; font-size: 13px">form-a-lin</div>
    <div style="gap: 5px; margin: auto; display: flex">
        <div class="formalin-section">
            <div>Form Definition</div>
            <div
                style="width: 545px; height: 422px; border: 1px solid gray; display: flex; overflow: scroll">
                <div
                    style="gap: 10px; padding: 10px; display: flex; flex-direction: column">
                    {#if $form.sections?.length === 0}
                    <div
                        style="width: 31px; height: 31px; border-radius: 36px; border: 1px solid; display: flex; align-items: center; justify-content: center; flex-shrink: 0"
                        on:click="{() => addSection()}">
                        +
                    </div>
                    {/if} {#each $form.sections as section, sectionIndex}
                    <div class="field-definitions">
                        <div style="gap: 10px; display: flex">
                            <div
                                style="width: 31px; height: 31px; border-radius: 36px; border: 1px solid; display: flex; align-items: center; justify-content: center"
                                on:click="{() => removeSection(sectionIndex)}">
                                X
                            </div>
                            <div
                                style="width: 31px; height: 31px; border-radius: 36px; border: 1px solid; display: flex; align-items: center; justify-content: center"
                                on:click="{() => addSection(sectionIndex)}">
                                +
                            </div>
                        </div>
                        <div class="fieldline">
                            <div class="form-title">Section Title</div>
                            <input
                                class="input-item"
                                type="text"
                                value="{$form.sections[sectionIndex].title}"
                                on:input="{(e) => updateSectionTitle(sectionIndex, e.target.value)}" />
                        </div>
                        <div class="fieldline">
                            <div class="form-title">Description</div>
                            <textarea
                                class="input-item"
                                value="{$form.sections[sectionIndex].description}"
                                on:input="{(e) => updateSectionDescription(sectionIndex, e.target.value)}"></textarea>
                        </div>
                        <div
                            style="padding: 16px; flex-direction: column; gap: 20px; display: flex">
                            <div style="font-size: 25px; font-weight: 200">
                                {$form.sections[sectionIndex].title} &gt; Fields
                            </div>
                            {#if section.fields?.length === 0}
                            <div
                                style="width: 31px; height: 31px; border-radius: 36px; border: 1px solid; display: flex; align-items: center; justify-content: center"
                                on:click="{() => addEmptyField(sectionIndex)}">
                                +
                            </div>
                            {/if} {#each section.fields as field, fieldIndex}
                            <div class="field-definitions">
                                <div style="gap: 10px; display: flex">
                                    <div
                                        style="width: 31px; height: 31px; border-radius: 36px; border: 1px solid; display: flex; align-items: center; justify-content: center"
                                        on:click="{() => removeField(sectionIndex, fieldIndex)}">
                                        X
                                    </div>
                                    <div
                                        style="width: 31px; height: 31px; border-radius: 36px; border: 1px solid; display: flex; align-items: center; justify-content: center"
                                        on:click="{() => addEmptyField(sectionIndex, fieldIndex)}">
                                        +
                                    </div>
                                </div>
                                <div
                                    style="gap: 20px; padding: 19px; padding-left: 24px; padding-right: 24px; padding-bottom: 24px; display: flex; flex-direction: column">
                                    <div class="fieldline">
                                        <div class="form-title">Label</div>
                                        <input
                                            class="input-item"
                                            type="text"
                                            value="{$form.sections[sectionIndex].fields[fieldIndex].label}"
                                            on:input="{e => updateFieldLabel(sectionIndex, fieldIndex, e.target.value)}" />
                                    </div>
                                    <div class="fieldline">
                                        <div class="form-title">type</div>
                                        <select
                                            style="width: 146px; margin: 0"
                                            value="{$form.sections[sectionIndex].fields[fieldIndex].type}"
                                            on:input="{e => updateFieldType(sectionIndex, fieldIndex, e.target.value)}">
                                            {#each TypeOptions as option}
                                            <option value="{option.value}">
                                                {option.label}
                                            </option>
                                            {/each}
                                        </select>
                                    </div>
                                    <div class="fieldline">
                                        <div class="form-title">
                                            Description
                                        </div>
                                        <textarea
                                            class="input-item"
                                            value="{$form.sections[sectionIndex].fields[fieldIndex].description}"
                                            on:input="{e => updateFieldDescription(sectionIndex, fieldIndex, e.target.value)}"></textarea>
                                    </div>
                                    <div class="fieldline">
                                        <div class="form-title">Field Name</div>
                                        <input
                                            class="input-item"
                                            type="text"
                                            value="{$form.sections[sectionIndex].fields[fieldIndex].fieldName}"
                                            on:input="{e => updateFieldName(sectionIndex, fieldIndex, e.target.value)}" />
                                    </div>
                                    {#if
                                    supportsPlaceholder($form.sections[sectionIndex].fields[fieldIndex].type)}
                                    <div class="fieldline">
                                        <div class="form-title">
                                            Placeholder
                                        </div>
                                        <input
                                            class="input-item"
                                            type="text"
                                            value="{$form.sections[sectionIndex].fields[fieldIndex].placeholder}"
                                            on:input="{e => updateFeildPlaceholder(sectionIndex, fieldIndex, e.target.value)}" />
                                    </div>
                                    {/if}
                                    <div class="fieldline">
                                        <div class="form-title">
                                            Default value
                                        </div>
                                        <input
                                            class="input-item"
                                            type="text"
                                            value="{$form.sections[sectionIndex].fields[fieldIndex].value}"
                                            on:input="{e => updateFieldValue(sectionIndex, fieldIndex, e.target.value)}" />
                                    </div>
                                    <div class="fieldline">
                                        <div class="form-title">Condition</div>
                                        <OptionInput
                                        value={conditionAsOption(sectionIndex,
                                        fieldIndex)} on:input={e =>
                                        updateFieldCondition(sectionIndex,
                                        fieldIndex, e.detail)}
                                        valuePlaceholder="field name"
                                        labelPlaceholder="expected value" />
                                    </div>
                                    {#if
                                    supportsOptions($form.sections[sectionIndex].fields[fieldIndex].type)}
                                    <div class="fieldline">
                                        <div class="form-title">Options</div>
                                        <Options
                                        value={$form.sections[sectionIndex].fields[fieldIndex].options}
                                        on:input={e =>
                                        updateFieldOptions(sectionIndex,
                                        fieldIndex, e.detail)} />
                                    </div>
                                    {/if}
                                    <div class="fieldline">
                                        <div class="form-title">required</div>
                                        <input
                                            style="width: 24px; height: 24px; margin: 0"
                                            type="checkbox"
                                            value="true"
                                            checked="{$form.sections[sectionIndex].fields[fieldIndex].required}"
                                            on:input="{e => updateFieldRequired(sectionIndex, fieldIndex, e.target.checked)}" />
                                    </div>
                                </div>
                            </div>
                            {/each}
                        </div>
                    </div>
                    {/each}
                </div>
            </div>
        </div>
        <div class="formalin-section">
            <div>Preview</div>
            <DynamicForm />
        </div>
    </div>
</div>

<style>
    .fieldline {
      resize: horizontal;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      gap: 8px;
      display: flex;
    }

    .input-item {
      width: 200px;
      margin: 0;
    }

    .form-title {
      font-size: 18px;
      font-weight: 200
    }

    .field-definitions {
      gap: 10px;
      ;
      display: flex;
      flex-direction: column;
      flex-wrap: wrap
    }

    .formalin-section {
      gap: 10px;
      display: flex;
      flex-direction: column
    }

    * {box-sizing: border-box}
</style>

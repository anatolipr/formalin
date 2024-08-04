<!-- FormEditor.svelte -->
<script lang="ts">

    import {
        updateFormId,
        updateFormTitle,
        updateFormDescription,
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
        updateFieldValidation,
        updateFieldType,
        updateFeildPlaceholder,
        updateSectionMulti,
        moveSectionDown,
        moveSectionUp,
        moveFieldDown,
        moveFieldUp,
        form,
        addEmptyField,
        conditionAsOption,
        updateButtons,
        updateFieldValue,
        copyDefinition,
        updateSectionCondition

    } from "../data/stores";

    import Options from "./Options.svelte";
    import { TypeOptions, supportsOptions, supportsPlaceholder, supportsPattern, supportsValue } from "../data/type/formConfigTypes";
    import OptionInput from "./OptionInput.svelte";

    import DynamicForm from "./components/DynamicForm.svelte";
    import { hasParentIntegration } from "../data/util/parentIntegration";

    const hasParent = hasParentIntegration();

    function itemClick(e: CustomEvent) {
        // update navigation hash to go to the correct section
        location.hash = `anchor${e.detail}`;
    }

    function close() {
        window.parent.postMessage({ type: 'closeFormalinEdit' }, '*');
    }

    addSection();
</script>

<div
    style="position: relative; flex-direction: column; gap: 15px; display: flex">
    <div style="gap: 18px; display: flex">
        <div style="padding: 0px; font-size: 13px; flex: 1">
            form schema editor
        </div>
        {#if hasParent}
        <div class="formalin-close">close</div>
        {/if}
    </div>
    <div style="gap: 5px; margin: auto; display: flex">
        <div class="formalin-section">
            <div style="cursor: copy" on:click="{copyDefinition}">
                Form Definition&nbsp;📋
            </div>
            <div
                style="width: 545px; height: 422px; border: 1px solid gray; display: flex; overflow: scroll">
                <div
                    style="gap: 10px; padding: 10px; display: flex; flex-direction: column">
                    <div class="fieldline">
                        <div class="form-title">Form ID</div>
                        <input
                            class="input-item"
                            type="text"
                            value="{$form.id || ''}"
                            on:input="{(e) => updateFormId(e.target.value)}" />
                        <div class="form-title dynamic-form-description">
                            Defines the prefix of the emitted form data eg.
                            `formData.first_name`. Useful when you need to
                            handle input from multiple forms at once.
                        </div>
                    </div>
                    <div class="fieldline">
                        <div class="form-title">Form Title</div>
                        <input
                            class="input-item"
                            type="text"
                            value="{$form.title || ''}"
                            on:input="{(e) => updateFormTitle(e.target.value)}" />
                    </div>
                    <div class="fieldline">
                        <div class="form-title">Form / Page Description</div>
                        <textarea
                            class="input-item"
                            value="{$form.description || ''}"
                            on:input="{(e) => updateFormDescription(e.target.value)}"></textarea>
                    </div>
                    {#if $form.sections?.length === 0}
                    <div
                        style="width: 31px; height: 31px; flex-shrink: 0"
                        class="round-btn"
                        on:click="{() => addSection()}">
                        +
                    </div>
                    {/if} {#each $form.sections as section, sectionIndex}
                    <a name="anchor{sectionIndex}"></a>
                    <div class="field-definitions">
                        <div style="gap: 10px; display: flex">
                            <div
                                style="width: 31px; height: 31px"
                                class="round-btn"
                                on:click="{() => removeSection(sectionIndex)}">
                                X
                            </div>
                            <div
                                style="width: 31px; height: 31px"
                                class="round-btn"
                                on:click="{() => addSection(sectionIndex)}">
                                +
                            </div>
                            <div
                                style="width: 31px; height: 31px"
                                class="round-btn"
                                on:click="{() => moveSectionUp(sectionIndex)}">
                                ↑
                            </div>
                            <div
                                style="width: 31px; height: 31px"
                                class="round-btn"
                                on:click="{() => moveSectionDown(sectionIndex)}">
                                ↓
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
                        <div class="fieldline">
                            <div class="form-title">Condition</div>
                            <OptionInput value={conditionAsOption(sectionIndex)}
                            on:input={e => updateSectionCondition(sectionIndex,
                            e.detail)} valuePlaceholder="field name"
                            labelPlaceholder="expected value" />

                            <div class="form-title dynamic-form-description">
                                '!' before value negates the condition. Eg.
                                '!seven' will be true for any value but 'seven'.
                                Tip only '!' results in &lt;not empty&gt;
                            </div>
                        </div>
                        <div class="fieldline">
                            <div class="form-title">
                                multi-section (coming soon)
                            </div>
                            <input
                                style="width: 24px; height: 24px; margin: 0"
                                type="checkbox"
                                value="true"
                                checked="{$form.sections[sectionIndex].multi}"
                                on:input="{e => updateSectionMulti(sectionIndex, e.target.checked)}" />
                        </div>
                        <div
                            style="padding: 16px; flex-direction: column; gap: 20px; display: flex">
                            <div style="font-size: 25px; font-weight: 200">
                                {$form.sections[sectionIndex].title} &gt; Fields
                            </div>
                            {#if section.fields?.length === 0}
                            <div
                                style="width: 31px; height: 31px"
                                class="round-btn"
                                on:click="{() => addEmptyField(sectionIndex)}">
                                +
                            </div>
                            {/if} {#each section.fields as field, fieldIndex}
                            <a name="anchor{sectionIndex}_{fieldIndex}"></a>
                            <div class="field-definitions">
                                <div style="gap: 10px; display: flex">
                                    <div
                                        style="width: 31px; height: 31px"
                                        class="round-btn"
                                        on:click="{() => removeField(sectionIndex, fieldIndex)}">
                                        X
                                    </div>
                                    <div
                                        style="width: 31px; height: 31px"
                                        class="round-btn"
                                        on:click="{() => addEmptyField(sectionIndex, fieldIndex)}">
                                        +
                                    </div>
                                    <div
                                        style="width: 31px; height: 31px"
                                        class="round-btn"
                                        on:click="{() => moveFieldUp(sectionIndex, fieldIndex)}">
                                        ↑
                                    </div>
                                    <div
                                        style="width: 31px; height: 31px"
                                        class="round-btn"
                                        on:click="{() => moveFieldDown(sectionIndex, fieldIndex)}">
                                        ↓
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
                                    {#if
                                    supportsValue($form.sections[sectionIndex].fields[fieldIndex].type)}
                                    <div class="fieldline">
                                        <div class="form-title">Field Name</div>
                                        <input
                                            class="input-item"
                                            type="text"
                                            value="{$form.sections[sectionIndex].fields[fieldIndex].fieldName}"
                                            on:input="{e => updateFieldName(sectionIndex, fieldIndex, e.target.value)}" />
                                    </div>
                                    {/if} {#if
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
                                    {/if} {#if
                                    supportsValue($form.sections[sectionIndex].fields[fieldIndex].type)}
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
                                    {/if} {#if
                                    supportsOptions($form.sections[sectionIndex].fields[fieldIndex].type)}
                                    <div class="fieldline">
                                        <div class="form-title">Options</div>
                                        <Options
                                        value={$form.sections[sectionIndex].fields[fieldIndex].options
                                        || []} on:input={e =>
                                        updateFieldOptions(sectionIndex,
                                        fieldIndex, e.detail)} />
                                    </div>
                                    {/if} {#if
                                    supportsPattern($form.sections[sectionIndex].fields[fieldIndex].type)}
                                    <div class="fieldline">
                                        <div class="form-title">Validation</div>
                                        <input
                                            class="input-item"
                                            type="text"
                                            value="{$form.sections[sectionIndex].fields[fieldIndex].validation}"
                                            on:input="{e => updateFieldValidation(sectionIndex, fieldIndex, e.target.value)}" />
                                        <div
                                            class="form-title dynamic-form-description">
                                            input validation pattern
                                        </div>
                                    </div>
                                    {/if}
                                    <div class="fieldline">
                                        <div class="form-title">Condition</div>
                                        <OptionInput
                                        value={conditionAsOption(sectionIndex,
                                        fieldIndex)} on:input={e =>
                                        updateFieldCondition(sectionIndex,
                                        fieldIndex, e.detail)}
                                        valuePlaceholder="field name"
                                        labelPlaceholder="expected value" />

                                        <div
                                            class="form-title dynamic-form-description">
                                            '!' before value negates the
                                            condition. Eg. '!seven' will be true
                                            for any value but 'seven'. Tip only
                                            '!' results in &lt;not empty&gt;
                                        </div>
                                    </div>
                                    {#if
                                    supportsValue($form.sections[sectionIndex].fields[fieldIndex].type)}
                                    <div class="fieldline">
                                        <div class="form-title">required</div>
                                        <input
                                            style="width: 24px; height: 24px; margin: 0"
                                            type="checkbox"
                                            value="true"
                                            checked="{$form.sections[sectionIndex].fields[fieldIndex].required}"
                                            on:input="{e => updateFieldRequired(sectionIndex, fieldIndex, e.target.checked)}" />
                                    </div>
                                    {/if}
                                </div>
                            </div>
                            {/each}
                        </div>
                    </div>
                    {/each}
                    <div style="padding-bottom: 20px" class="fieldline">
                        <div class="form-title">Buttons</div>
                        <Options value={$form.buttons || []} on:input={e =>
                        updateButtons(e.detail)} />
                    </div>
                </div>
            </div>
        </div>
        <div style="width: 379px; height: 451px" class="formalin-section">
            <div>Preview</div>
            <DynamicForm on:itemClick="{itemClick}" />
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

    .dynamic-form-description {
      font-size: 14px;
    }

    .round-btn {
      border-radius: 36px;
      border: 1px solid;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .round-btn:hover {
      background-color: #787878;
      color: white;
    }
    .round-btn:active {
      background-color: #000000;
    }
    .formalin-close {
      padding: 0px;
      font-size: 13px;
      margin: auto;
      cursor: pointer
    }

    * {box-sizing: border-box}
</style>

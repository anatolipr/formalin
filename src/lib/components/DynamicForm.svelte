<!-- DynamicForm.svelte -->
<script lang="ts">

  import { form } from "../../data/stores.js";
  import { generateNumberList } from "../../data/util/arrayUtil.js";
  import { formData, updateFormData, meetsCondition, sectionRepeats, addRepeat, removeRepeat } from "../../data/dataStore.js";
  import FormTextInput from "./FormTextInput.svelte";
  import FormRadiosInput from "./FormRadiosInput.svelte";
  import FormDropdownInput from "./FormDropdownInput.svelte";
  import FormCheckboxesInput from "./FormCheckboxesInput.svelte";
  import FormTitle from "./FormTitle.svelte";
  import FormTextareaInput from "./FormTextareaInput.svelte";
  import type { Type } from "../../data/type/formConfigTypes.js";
  import type { ComponentType } from "svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  const typeMap: Record<Type, ComponentType> = {
    'text': FormTextInput,
    'textarea': FormTextareaInput,
    'number': FormTextInput,
    'date': FormTextInput,
    'radios': FormRadiosInput,
    'dropdown': FormDropdownInput,
    'checkboxes': FormCheckboxesInput,
    'title': FormTitle
  };

  function dispatchSectionClick(sectionIndex: number) {
    dispatch('itemClick', sectionIndex);
  }

  function dispatchFieldClick(sectionIndex: number, fieldIndex: number) {
    dispatch('itemClick', `${sectionIndex}_${fieldIndex}`);
  }

  function submit(e: SubmitEvent): void {
    const formEl: HTMLFormElement = e.target as HTMLFormElement;

    const formData = new FormData(formEl);

    if (e.submitter) {
      const submitter = e.submitter as HTMLInputElement;
      formData.append(submitter.name, submitter.value);
    }

    const action = formData.get('action');

    if (action === 'submit') {
      formEl.reportValidity();
    }

    document.dispatchEvent(new CustomEvent('formalinSubmit', {
      detail: {
        formId: formEl.name,
        action, formData
      }
    }));

    e.preventDefault();
  }
</script>

<form
  style="overflow: scroll"
  class="dynamic-form-container"
  on:submit="{submit}"
  name="{$form.id}">
  {#if $form.title}
  <div>
      <div class="dynamic-form-head">{$form.title || ''}</div>
      <div class="dynamic-form-main-description">
          {$form.description || ''}
      </div>
  </div>
  {/if} {#each $form.sections as section, sectionIndex} {#if
  meetsCondition($form.sections[sectionIndex].condition, $formData)}
  <div class="dynamic-form-section">
      <div>
          <div
              class="dynamic-form-title"
              on:click="{() => dispatchSectionClick(sectionIndex)}">
              {$form.sections[sectionIndex].title}
          </div>
          <div class="dynamic-form-description">
              {$form.sections[sectionIndex].description}
          </div>
      </div>
      {#each generateNumberList(sectionRepeats(sectionIndex)) as inputIndex}
      <div class="form-section-fields">
          {#if $form.sections[sectionIndex].multi}
          <div style="display: flex">
              <div style="flex: 1">
                  {inputIndex + '/' + sectionRepeats(sectionIndex, $form.sections)}
              </div>
              <div
                  style="cursor: pointer"
                  on:click="{() => removeRepeat(sectionIndex, inputIndex)}">
                  remove
              </div>
          </div>
          {/if}
          <div
              class="dynamic-form-fields-wrap dynamic-form-multi-field"
              class:dynamic-form-multi-field="{$form.sections[sectionIndex].multi}">
              {#each $form.sections[sectionIndex].fields as field, fieldIndex}
              {#if
              meetsCondition($form.sections[sectionIndex].fields[fieldIndex].condition,
              $formData, $form.sections[sectionIndex].multi ? inputIndex :
              undefined)}
              <div class="dynamic-form-fields">
                  <div
                      style="overflow: scroll"
                      class="dynamic-form-field-label">
                      <div
                          class="dynamic-form-field-title"
                          style:display="{$form.sections[sectionIndex].fields[fieldIndex].type === 'title' ? 'none' : null}"
                          on:click="{() => dispatchFieldClick(sectionIndex, fieldIndex)}">
                          {$form.sections[sectionIndex].fields[fieldIndex].label}
                      </div>
                      <svelte:component on:input={e =>
                      updateFormData($form.sections[sectionIndex].fields[fieldIndex].fieldName
                      +
                      ($form.sections[sectionIndex].fields[fieldIndex].fieldName
                      && $form.sections[sectionIndex].multi ? inputIndex :
                      ''), e.detail)}
                      fieldDef={$form.sections[sectionIndex].fields[fieldIndex]}
                      value={ ( $form.sections[sectionIndex].multi ?
                      $formData[$form.sections[sectionIndex].fields[fieldIndex].fieldName
                      + inputIndex] :
                      $formData[$form.sections[sectionIndex].fields[fieldIndex].fieldName]
                      ) || ''}
                      this="{typeMap[$form.sections[sectionIndex].fields[fieldIndex].type]}"
                      />
                      <div
                          class="dynamic-form-description"
                          style:display="{!$form.sections[sectionIndex].fields[fieldIndex].description ? 'none' : null}">
                          {$form.sections[sectionIndex].fields[fieldIndex].description}
                      </div>
                  </div>
              </div>
              {/if} {/each}
          </div>
      </div>
      {/each} {#if $form.sections[sectionIndex].multi}
      <div
          class="section-multi-button-add"
          on:click="{() => addRepeat(sectionIndex)}">
          add
      </div>
      {/if}
  </div>
  {/if} {/each} {#if $form.buttons && $form.buttons.length > 0}
  <div style="gap: 4px; display: flex">
      {#each $form.buttons as button}
      <button
          class="form-button"
          class:form-secondary-button="{button.value !== 'submit'}"
          name="action"
          value="{button.value}"
          type="submit">
          {button.label}
      </button>
      {/each}
  </div>
  {/if}
</form>

<svelte:element this={'style'}>
  {$form.css}
</svelte:element>

<!-- class="form-secondary-button dynamic-form-multi-field" -->
<!--
<style>


* {box-sizing: border-box}
</style>
-->

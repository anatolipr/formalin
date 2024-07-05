<script lang="ts">

  import { form } from "../../data/stores.js";
  import { formData, updateFormData, meetsCondition } from "../../data/dataStore.js";
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

  function buttonClicked(button) {

  }
</script>

<!-- class="form-secondary-button" -->
<div style="overflow: scroll" class="dynamic-form-container">
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
      {#each $form.sections[sectionIndex].fields as field, fieldIndex} {#if
      meetsCondition($form.sections[sectionIndex].fields[fieldIndex].condition,
      $formData)}
      <div class="dynamic-form-fields">
          <div style="overflow: scroll" class="dynamic-form-field-label">
              <div
                  class="dynamic-form-field-title"
                  style:display="{$form.sections[sectionIndex].fields[fieldIndex].type === 'title' ? 'none' : null}"
                  on:click="{() => dispatchFieldClick(sectionIndex, fieldIndex)}">
                  {$form.sections[sectionIndex].fields[fieldIndex].label}
              </div>
              <svelte:component on:input={e =>
              updateFormData($form.sections[sectionIndex].fields[fieldIndex].fieldName,
              e.detail)}
              fieldDef={$form.sections[sectionIndex].fields[fieldIndex]}
              value={$formData[$form.sections[sectionIndex].fields[fieldIndex].fieldName]
              || ''}
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
  {/if} {/each} {#if $form.buttons && $form.buttons.length > 0}
  <div style="gap: 4px; display: flex">
      {#each $form.buttons as button}
      <div
          class="form-button"
          class:form-secondary-button="{button.value !== 'submit'}"
          on:click="{ () => buttonClicked(button) }">
          {button.label}
      </div>
      {/each}
  </div>
  {/if}
</div>

<style>
  .dynamic-form-container {
    padding: 8px;
    flex-direction: column;
    gap: 16px;
    display: flex
  }

  .dynamic-form-section {
    flex-direction: column;
    gap: 4px;
    display: flex;
  }

  .dynamic-form-title {
    font-size: 25px;
    font-weight: 700;
  }

  .dynamic-form-fields {
    gap: 16px;
    padding: 10px;
    display: flex;
    flex-direction: column
  }

  .dynamic-form-field-label {
    flex-direction: column;
    gap: 5px;
    display: flex;
  }

  .dynamic-form-description {
    font-size: 14px;
  }

  .dynamic-form-head {
    font-size: 30px;
    font-weight: 800;
  }

  .dynamic-form-main-description {
    font-size: 17px;
    font-weight: 300;
  }

  .dynamic-form-field-title {
    font-size: 18px;
  }

  .form-button {
    padding-left: 12px;
    padding-right: 12px;
    padding-top: 8px;
    padding-bottom: 9px;
    border-radius: 6px;
    background-color: #005baa;
    cursor: pointer;
    display: flex;
    color: #ffffff;
    align-items: center;
    justify-content: center;
  }

  .form-secondary-button {
    background: none;
  }

  * {box-sizing: border-box}
</style>

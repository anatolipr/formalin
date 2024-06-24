<script lang="ts">

  import { form } from "../../data/stores.js";
  import { formData, updateFormData } from "../../data/dataStore.js";
  import FormTextInput from "./FormTextInput.svelte";
  import FormRadiosInput from "./FormRadiosInput.svelte";
  import FormDropdownInput from "./FormDropdownInput.svelte";
  import FormCheckboxesInput from "./FormCheckboxesInput.svelte";
  import FormTitle from "./FormTitle.svelte";
  import FormTextareaInput from "./FormTextareaInput.svelte";
  import type { Type } from "../../data/type/formConfigTypes.js";
  import type { ComponentType } from "svelte";

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
</script>

<div
  style="width: 545px; height: 422px; overflow: scroll"
  class="dynamic-form-container">
  {#each $form.sections as section, sectionIndex}
  <div class="dynamic-form-section">
      <div>
          <div class="dynamic-form-title">
              {$form.sections[sectionIndex].title}
          </div>
          <div
              style="font-size: 14px"
              class="dynamic-form-title dynamic-form-description">
              {$form.sections[sectionIndex].description}
          </div>
      </div>
      {#each $form.sections[sectionIndex].fields as field, fieldIndex}
      <div class="dynamic-form-fields">
          <div style="overflow: scroll" class="dynamic-form-field-label">
              <div
                  style="font-size: 18px"
                  style:display="{$form.sections[sectionIndex].fields[fieldIndex].type === 'title' ? 'none' : null}">
                  {$form.sections[sectionIndex].fields[fieldIndex].label}
              </div>
              <svelte:component on:input={e =>
              updateFormData($form.sections[sectionIndex].fields[fieldIndex].fieldName,
              e.detail)}
              fieldDef={$form.sections[sectionIndex].fields[fieldIndex]}
              value={$formData[$form.sections[sectionIndex].fields[fieldIndex].fieldName]}
              this="{typeMap[$form.sections[sectionIndex].fields[fieldIndex].type]}"
              />
              <div style="font-size: 12px">
                  {$form.sections[sectionIndex].fields[fieldIndex].description}
              </div>
          </div>
      </div>
      {/each}
  </div>
  {/each}
</div>

<style>
  .dynamic-form-container {
    padding: 8px;
    border: 1px solid;
    flex-direction: column;
    gap: 6px;
    display: flex
  }

  .dynamic-form-section {
    flex-direction: column;
    gap: 4px;
    display: flex;
  }

  .dynamic-form-title {
    font-size: 25px
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
    font-size: 16px
  }

  * {box-sizing: border-box}
</style>

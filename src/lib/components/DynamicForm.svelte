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
  style=" overflow: scroll"
  class="dynamic-form-container">
  {#each $form.sections as section, sectionIndex} {#if
  meetsCondition($form.sections[sectionIndex].condition, $formData)}
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
      {#each $form.sections[sectionIndex].fields as field, fieldIndex} {#if
      meetsCondition($form.sections[sectionIndex].fields[fieldIndex].condition, $formData)}
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
              value={$formData[$form.sections[sectionIndex].fields[fieldIndex].fieldName] || ''}
              this="{typeMap[$form.sections[sectionIndex].fields[fieldIndex].type]}"
              />
              <div style="font-size: 12px">
                  {$form.sections[sectionIndex].fields[fieldIndex].description}
              </div>
          </div>
      </div>
      {/if} {/each}
  </div>
  {/if} {/each}
</div>

<style>
  
</style>

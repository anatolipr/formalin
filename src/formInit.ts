import { form } from './data/stores';
import { formData, getFormDataAsNestedJson,  } from './data/dataStore';
import { copyToClipboard } from './data/util/clipboard';

/**
 * This function is used to expose the form and formData objects to the window object
 */
export default function(): void {

    (window as any).___form = form;
    (window as any).___formData = formData;

      (window as any).formFromJson = function(json: string | object) {
        form.set(typeof json === 'object' ? json : JSON.parse(json))
      };

      (window as any).formDataFromJson = function(json: string | object) {
        formData.set(typeof json === 'object' ? json : JSON.parse(json))
      };

      (window as any).formAsJson = function() {
        return JSON.stringify(form.get())
      };

      (window as any).formDataAsJson = function() {
        return JSON.stringify(formData.get())
      };

      (window as any).formDataAsNestedJson = function() {
        return JSON.stringify(getFormDataAsNestedJson())
      };

      (window as any).copyToClipboard = copyToClipboard

      // (window as any).emitFormEvent = function(event: string, data: any) {
      //   dispatchEvent(new CustomEvent(event, { detail: data }))
      // }

}
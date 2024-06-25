import { form } from './data/stores';
import { formData } from './data/dataStore';

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

      (window as any).copyToClipboard = function(text: string) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      };

      (window as any).emitFormEvent = function(event: string, data: any) {
        dispatchEvent(new CustomEvent(event, { detail: data }))
      }

      window.addEventListener('formalinEvent', (e: CustomEvent) => {
        console.log('formalinEvent', e.detail)
      })

}
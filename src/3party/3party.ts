import '../app2.css'
import '../dynamic.css'
import '../data/darkModeSupport';
import App from '../AppView.svelte'


export { form } from '../data/stores';
export { formData, getFormDataAsNestedJson,  } from '../data/dataStore';

export function mount(target: string) {
  new App({
    target: document.querySelector(target)!,
  }) as any;
}
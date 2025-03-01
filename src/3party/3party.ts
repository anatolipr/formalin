import '../app2.css'
import '../dynamic.css'
import '../data/darkModeSupport';
import App from '../AppView.svelte'


export { form } from '../data/stores';
export { formData, getFormDataAsNestedJson,  } from '../data/dataStore';

export function mount(target: string | HTMLElement) {
  new App({
    target: typeof target === 'string' ? document.querySelector(target)! : target,
  }) as any;
}
import './app.css'
import './dynamic.css'
import './data/darkModeSupport';
import App from './App.svelte'

import formInit from './formInit';
import './mcpbridge';

const app = new App({
  target: document.getElementById('app')!,
}) as any;

formInit();

document.addEventListener(
  'formalinSubmit', (e: Event) => {
    alert('Submitted!');
  }
)



export default app

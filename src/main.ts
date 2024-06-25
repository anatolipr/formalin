import './app.css'
import './dynamic.css'
import App from './App.svelte'

import formInit from './formInit';

const app = new App({
  target: document.getElementById('app')!,
}) as any;

formInit();

export default app

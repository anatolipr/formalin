import './app2.css'
import './dynamic.css'
import './data/darkModeSupport';
import App from './AppView.svelte'
import formInit from './formInit';
import './mcpbridge';

const app = new App({
  target: document.getElementById('app')!,
}) as any;

formInit();

export default app

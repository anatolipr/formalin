import App from './AppEdit.svelte'


document.body.insertAdjacentHTML('beforeend', `<div id="formeditor"></div>`);

const app = new App({
  target: document.getElementById('formeditor')!,
}) as any;


export default app

import AppEdit from './AppEdit.svelte'


document.body.insertAdjacentHTML('beforeend', `<div id="formeditor"></div>`);

const app = new AppEdit({
  target: document.getElementById('formeditor')!,
}) as any;


export default app

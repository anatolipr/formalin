import AppEdit from './AppEdit.svelte'

import { postToFrames } from './data/util/iframeUtil';

document.body.insertAdjacentHTML('beforeend', `<div id="formeditor"></div>`);

const app = new AppEdit({
  target: document.getElementById('formeditor')!,
}) as any;


export default app;

let currentChannel: string = 'unknown';



function params(dataParams: string): object | string | undefined {
    if (!dataParams) {
        return dataParams;
    }
    const stringValue: string = dataParams;
    if (stringValue.startsWith('{') && stringValue.endsWith('}')) {
        return JSON.parse(stringValue);
    } else if (stringValue !== 'undefined') {
        return stringValue;
    } else {
        return undefined;
    }
}

function sendResponse(funcName: string, params?: any): void {
    postToFrames({
            type: 'func',
            func: funcName + 'Response',
            channel: currentChannel,
            params
        });
}



const handlers: {[k: string]: (p?: any) => void} = {
    /*
    * Called when the form editor is initialized
    */
    'initializeForm': function() {

      const x: typeof globalThis = globalThis;
   

        //const params = document.getElementById('formData').value;
        if ((globalThis as any)['formalinGetFormSchemaJsonAsString']) {
            const params = (globalThis as any)['formalinGetFormSchemaJsonAsString']();
            sendResponse('initializeForm', params);
        } else {
            console.warn('formalinGetFormSchemaJsonAsString not defined');
            sendResponse('initializeForm', undefined);
        }
    },

    /* 
    * Called when the form schema is updated by the editor
    */
    'updateForm': function(data: any) {
        if ((globalThis as any)['formalinSetFormSchemaJsonAsString']) {
            (globalThis as any)['formalinSetFormSchemaJsonAsString'](data);
        } else {
            console.warn('formalinSetFormSchemaJsonAsString not defined');
        }
        sendResponse('updateForm');
    },
}

window.addEventListener('message', function(event) {
    if (event.data.type === 'func' && event.data.func) {
        if (handlers[event.data.func]) {
            handlers[event.data.func](params(event.data.params));
        } else {
            console.error('No handler for function: ' + event.data.func);
        }
    }
});


/**
 * Instructs AppEdit to open the form editor for the specified channel
 * @param channel the channel
 */

(globalThis as any)['formalinOpen'] = function (channel: string): void {
    currentChannel = channel;
    window.postMessage({
        type: 'openFormalinEdit',
        channel: channel
    });
};

(globalThis as any)['formalinGetCurrentChannel'] = function (): string {
    return currentChannel;
}

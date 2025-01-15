import { get } from "svelte/store";

type ParentIntegrationDetails = {
    channel: string;
    iFrame: boolean;
    opener: boolean;
}

function getParentIntegrationDetails(): ParentIntegrationDetails {
    return {
        channel: getParentIntegrationParam(),
        iFrame: isInsideFrame(),
        opener: isInNewWindow()
    };
}

function getParentIntegrationParam(): string {
    // if URL has 'pi' parameter return its value else return undefined
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('channel') || '';
}

function isInsideFrame(): boolean {
    return window !== window.top;
}

function isInNewWindow(): boolean {
    return window.opener !== null;
}

/**
 * Check if the current page is integrated with a parent page using iFrame or window.open
 * and the parent page has passed the channel parameter
 * @returns boolean
 */
export function hasParentIntegration(): boolean {
    //console.log('hasParentIntegration', getParentIntegrationDetails());
    return getParentIntegrationDetails().channel !== '' 
    && (getParentIntegrationDetails().iFrame || getParentIntegrationDetails().opener);
}

export function callParent(functionName: string, params?: object | undefined): Promise<any> {
    
    
    const parentIntegrationDetails = getParentIntegrationDetails();
    
    let resolveFn: (value: any) => void = () => {};
    let rejectFn: (value: any) => void = () => {};
    const promise = new Promise((resolve, reject) => {
        resolveFn = resolve;
        rejectFn = reject;
    })

    const messageHandler = (event: MessageEvent<any>): void => {
        try {
            if (event.data.type === 'func'
                && event.data.func === functionName + "Response"
                && event.data.channel == parentIntegrationDetails.channel) {
                    
                    
                    resolveFn(event.data.params);
            }
        } catch (error) {
            rejectFn(error);
        } finally {
            window.removeEventListener('message', messageHandler);
        }
    };

    window.addEventListener('message', messageHandler);

    const message = {
        type: 'func',
        func: functionName,
        params: JSON.stringify(params),
        channel: parentIntegrationDetails.channel
    }

    if (parentIntegrationDetails.iFrame) {
        window.parent.postMessage(message, '*');
    } else if (parentIntegrationDetails.opener) {
        window.opener.postMessage(params, '*');
    }

    return promise;
}



/**
 * Post data to all iframes in the document
 * @param data value to post to the iframe
 */
export function postToFrames(data: any): void {
    var iframes: HTMLCollectionOf<HTMLIFrameElement> = document.getElementsByTagName('iframe');
    [...iframes].forEach( (element: HTMLIFrameElement) => {
      element.contentWindow?.postMessage(data, '*');
    });
}
import { IncomingMessage } from 'http';
import { parse } from 'url';
import { ParsedRequest, Theme } from './types';

export function parseRequest(req: IncomingMessage) {
    console.log('HTTP ' + req.url);
    const { pathname, query } = parse(req.url || '/', true);
    const { description, thumbnail, fontSize, images, widths, heights, theme, md } = (query || {});

    if (Array.isArray(fontSize)) {
        throw new Error('Expected a single fontSize');
    }
    if (Array.isArray(theme)) {
        throw new Error('Expected a single theme');
    }
    if (Array.isArray(description)) {
        throw new Error('Expected a single description');
    }
    if (Array.isArray(thumbnail)) {
        throw new Error('Expected a single description');
    }
    
    const arr = (pathname || '/').slice(1).split('.');
    let extension = '';
    let text = '';
    if (arr.length === 0) {
        text = '';
    } else if (arr.length === 1) {
        text = arr[0];
    } else {
        extension = arr.pop() as string;
        text = arr.join('.');
    }

    const parsedRequest: ParsedRequest = {
        fileType: extension === 'jpeg' ? extension : 'png',
        title: decodeURIComponent(text),
        description: decodeURIComponent(getString(description)),
        thumbnail: getString(thumbnail),
        theme: (theme === 'light' || theme === 'black' || theme === 'dark' || theme === 'expat' || theme === 'night') ? theme : 'light',
        md: md === '1' || md === 'true',
        fontSize: fontSize || '96px',
        images: getArray(images),
        widths: getArray(widths),
        heights: getArray(heights),
    };
    parsedRequest.images = getDefaultImages(parsedRequest.images, parsedRequest.theme);
    return parsedRequest;
}

function getString(value: string | string[] | undefined): string {
    if(!value) return '';
    if(value.length === 0) return '';
    if(Array.isArray(value)) return value[0];
    return value;
}

function getArray(stringOrArray: string[] | string | undefined): string[] {
    if (typeof stringOrArray === 'undefined') {
        return [];
    } else if (Array.isArray(stringOrArray)) {
        return stringOrArray;
    } else {
        return [stringOrArray];
    }
}

function getDefaultImages(images: string[], theme: Theme): string[] {
    const defaultImage = theme === 'light'
        ? 'https://assets.vercel.com/image/upload/front/assets/design/vercel-triangle-black.svg'
        : 'https://onruntime.com/static/images/logo/onruntime.svg';

    if (!images || !images[0]) {
        return [defaultImage];
    }
    if (!images[0].startsWith('https://onruntime.com/static/images/')
        && !images[0].startsWith('https://tonightpass.com/static/images/')
        && !images[0].startsWith('https://expatfacilities.co/static/images/')) {
        images[0] = defaultImage;
    }
    return images;
}

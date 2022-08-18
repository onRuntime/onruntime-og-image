import { readFileSync } from 'fs';
import { marked } from 'marked';
import { sanitizeHtml } from './sanitizer';
import { ParsedRequest, Theme } from './types';
const twemoji = require('twemoji');
const twOptions = { folder: 'svg', ext: '.svg' };
const emojify = (text: string) => twemoji.parse(text, twOptions);

const mono = readFileSync(`${__dirname}/../_fonts/Vera-Mono.woff2`).toString('base64');

function getCss(theme: Theme, fontSize: string) {
    let background = 'white';
    let foreground = 'black';

    switch (theme) {
        case 'black':
            background = 'black';
            foreground = 'white';
            break;
        case 'dark':
            background = '#1e1f20';
            foreground = 'white';
            break;
        case 'expat':
            background = '#111315';
            foreground = 'white';
            break;
    }

    return `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');
    
    @font-face {
        font-family: 'Vera';
        font-style: normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${mono})  format("woff2");
    }

    html, body, p, h1 {
        margin: 0;
    }

    body {
        background: ${background};
        height: 100vh;
        display: flex;
        flex-direction: column;
        font-family: 'Poppins', sans-serif;
        padding: 0 10%;
    }

    .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
    }

    code {
        color: #D400FF;
        font-family: 'Vera';
        white-space: pre-wrap;
        letter-spacing: -5px;
    }

    code:before, code:after {
        content: '\`';
    }

    .footer {
        height: 150px;
        display: flex;
        align-items: flex-start;
    }

    .logo-wrapper {
        display: flex;
        align-items: center;
    }

    .logo {
        margin: 0 25px;
        width: auto;
        height: 50px;
        object-fit: contain;
    }

    .logo:first-child {
        margin-left: 0;
    }

    .logo:last-child {
        margin-right: 0;
    }

    .plus {
        color: #BBB;
        font-size: 20px;
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }
    
    .title {
        font-size: ${sanitizeHtml(fontSize)};
        font-weight: bold;
        color: ${foreground};
    }
    
    .description {
        margin-top: 10px;
        font-size: calc(${sanitizeHtml(fontSize)} / 3);
        color: #999999;
    }`;
}

export function getHtml(parsedReq: ParsedRequest) {
    const { title, description, theme, md, fontSize, images, widths, heights } = parsedReq;
    return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(theme, fontSize)}
    </style>
    <body>
        <div class="container">
            <h1 class="title">${emojify(sanitizeHtml(title))}</h1>
            <div class="description">${emojify(
                md ? marked(description) : sanitizeHtml(description)
            )}</div>
        </div>

        <footer class="footer">
            <div class="logo-wrapper">
                ${images.map((img, i) =>
                    getPlusSign(i) + getImage(img, widths[i], heights[i])
                ).join('')}
            </div>
        </footer>
    </body>
</html>`;
}

function getImage(src: string, width ='auto', height = '50') {
    return `<img
        class="logo"
        alt="Generated Image"
        src="${sanitizeHtml(src)}"
        width="${sanitizeHtml(width)}"
        height="${sanitizeHtml(height)}"
    />`
}

function getPlusSign(i: number) {
    return i === 0 ? '' : '<div class="plus">+</div>';
}

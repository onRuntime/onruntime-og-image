export type FileType = 'png' | 'jpeg';
export type Theme = 'light' | 'black' | 'dark' | 'expat' | 'night';

export interface ParsedRequest {
    fileType: FileType;
    title: string;
    description: string;
    theme: Theme;
    md: boolean;
    fontSize: string;
    images: string[];
    widths: string[];
    heights: string[];
}

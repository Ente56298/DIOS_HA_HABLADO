
export interface Chapter {
    id: string;
    title: string;
    synopsis: string;
    audioUrl?: string;
    videoUrl?: string;
}

export interface Part {
    id: string;
    title: string;
    description: string;
    chapters: Chapter[];
}

export type BookStructure = Part[];

export interface BookContent {
    [chapterId: string]: string;
}

export interface SignaturePart {
    aramaic: string;
    spanish: string;
}

export interface Signature {
    part1: SignaturePart;
    part2: SignaturePart;
    part3: SignaturePart;
}

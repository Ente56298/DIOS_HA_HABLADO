
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
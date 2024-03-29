import { IObject } from "@daybrush/utils";
import Memory from "./utils/Memory";
import EventBus from "./utils/EventBus";
import MoveableData from "./utils/MoveableData";
import MoveableManager from "./Viewport/MoveableMananger";
import Editor from "./Editor";
import HistoryManager from "./utils/HistoryManager";
import Debugger from "./utils/Debugger";
import * as React from "react";
import Shortcuts from "shortcuts";

export interface ScenaEditorState {
    selectedTargets: Array<SVGElement | HTMLElement>;
    horizontalGuides: number[];
    verticalGuides: number[];
    selectedMenu: string;
    zoom: number;
    minZoom: number;
    showGuides: boolean;
    width: number;
    height: number;
    loadedViewer: boolean;
    isShift: boolean;
    isScreenshot: boolean;
    isMobile: boolean;
}

export interface TagAppendInfo {
    tag: any;
    props: IObject<any>;
    name: string;
    frame: IObject<any>;
}


export interface EditorInterface {
    editor: Editor;
    memory: Memory;
    eventBus: EventBus;
    moveableData: MoveableData;
    keyManager: Shortcuts;
    historyManager: HistoryManager;
    console: Debugger;
    moveableManager: React.RefObject<MoveableManager>;
}

export interface Clipboard {
    write(items: ClipboardItem[]): Promise<void>;
}
export interface ClipboardItem {
    types: string[];
    getType(type: string): Promise<Blob>;
}


export interface SavedScenaData {
    name: string;
    jsxId: string;
    componentId: string;
    tagName: string;
    innerHTML?: string;
    innerText?: string;
    attrs: IObject<any>;
    frame: IObject<any>;
    children: SavedScenaData[];
}
export interface ScenaProps {
    scenaElementId?: string;
    scenaAttrs?: IObject<any>;
    scenaText?: string;
    scneaHTML?: string;
}

export type ScenaFunctionComponent<T> = ((props: T & ScenaProps) => React.ReactElement<any, any>) & { scenaComponentId: string };
export type ScenaComponent = React.JSXElementConstructor<ScenaProps> & { scenaComponentId: string };
export type ScenaJSXElement
    = React.ReactElement<any, string>
    | ScenaFunctionJSXElement;
export type ScenaFunctionJSXElement = React.ReactElement<any, ScenaComponent>;
export type ScenaJSXType = ScenaJSXElement | string | ScenaComponent;


export interface GoogleFontsREST {
    kind: string;
    items: FontsList[];
}

export interface FontsList {
    family: string;
    variants: string[];
    subsets: string[];
    version: string;
    lastModified: Date;
    files: Files;
    category: Category;
    kind: Kind;
    menu: string;
}

export enum Category {
    Display = "display",
    Handwriting = "handwriting",
    SansSerif = "sans-serif",
    Serif = "serif",
}

export interface Files {
    regular: string;
    italic?: string;
    "100"?: string;
    "200"?: string;
    "300"?: string;
    "400"?: string;
    "500"?: string;
    "600"?: string;
    "700"?: string;
    "800"?: string;
    "900"?: string;
    "100italic"?: string;
    "200italic"?: string;
    "300italic"?: string;
    "400italic"?: string;
    "500italic"?: string;
    "600italic"?: string;
    "700italic"?: string;
    "800italic"?: string;
    "900italic"?: string;
}

export enum Kind {
    WebfontsWebfont = "webfonts#webfont",
}
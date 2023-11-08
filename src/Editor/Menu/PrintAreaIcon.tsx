import * as React from "react";
import Icon from "./Icon";
import Memory from "../utils/Memory";

export default class PrintAreaIcon extends Icon {
    public static id = "PrintArea";
    public static maker = (memory: Memory) => ({
        tag: "div",
        attrs: {},
        style: {
            "background-color": "transparent",
            "border-width": "1px",
            "border-style": "dashed",
            "border-color": memory.get("border-color") || "#000"
        },
    });
    public renderIcon() {
        return (
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="#fff" d="M339.3 367.1c27.3-3.9 51.9-19.4 67.2-42.9L568.2 74.1c12.6-19.5 9.4-45.3-7.6-61.2S517.7-4.4 499.1 9.6L262.4 187.2c-24 18-38.2 46.1-38.4 76.1L339.3 367.1zm-19.6 25.4l-116-104.4C143.9 290.3 96 339.6 96 400c0 3.9 .2 7.8 .6 11.6C98.4 429.1 86.4 448 68.8 448H64c-17.7 0-32 14.3-32 32s14.3 32 32 32H208c61.9 0 112-50.1 112-112c0-2.5-.1-5-.2-7.5z"/></svg>
        );
    }
}

import * as React from "react";
import { prefix } from "../utils/utils";
import Icon from "./Icon";
import Editor from "../Editor";
import { CompleteMenu, HomeMenu, PrintAreaMenu, TextMenu } from "./MenusList";
import DropdownIcon from "./DropdownIcon";
import { cloneDeep, isObject } from "lodash"
import "./Menu.css";


export default class Menu extends React.PureComponent<{
    editor: Editor,
    onSelect: (id: string) => any,
    children: React.ReactNode,
    isPreviewMode: boolean
}> {
    public state = {
        selected: "MoveTool",
        width: 0
    };
    public menuRefs: Array<React.RefObject<Icon>> = [];
    public menuContainerRef = React.createRef<HTMLDivElement>();
    public render() {
        let selected = this.state.selected;
        const editor = this.props.editor;
        const isMobile = editor.state.isMobile;
        const isPreview = this.props.isPreviewMode;
        const viewport = editor.getViewport()
        let menu = HomeMenu
        let floatingMenu: (typeof Icon)[] = []
        const targets = editor.getSelectedTargets().map(target => viewport.getInfoByElement(target))
        if (targets.length <= 0) {
            const resetProperties = [
                ["font-weight", "normal"],
                ["font-size", "16px"],
                ["font-style", "normal"],
                ["text-decoration", "none"],
                ["font-family", "Roboto"],
                ["text-align", "left"]
            ]
            resetProperties.forEach(p => {
                editor.memory.set(p[0], p[1])
            })
        }
        const isTargetsSame = targets.every(t => t && t.name && t.name === targets[0].name)
        if ((isTargetsSame && targets.length > 0) || selected !== "MoveTool") {
            const target = selected !== "MoveTool" ? selected : targets[0].name.replaceAll(/\(|\)/g, '')
            selected = target
            const menuList = {
                "Text": TextMenu,
                "PrintArea": PrintAreaMenu
            }
            let currentMenu = (menuList as any)[target] || HomeMenu
            if (!isMobile) {
                menu = currentMenu
            } else if(currentMenu){
                floatingMenu = cloneDeep(currentMenu as (typeof Icon)[]).filter(m => m.id !== "Divider")
                floatingMenu.splice(0, 2)
            }
        }

        menu = menu.filter(m => !editor.props.isAdmin ? m.id !== "PrintArea" : true)
        const maxWidth = this.state.width
        let currentWidth = 0;

        const filteredMenu: (typeof Icon)[] = []
        const dropedMenu: (typeof Icon)[] = []
        menu.forEach((menuItem, i) => {
            if (maxWidth > (currentWidth + (i + 1 < menu.length ? menuItem.width + 40 : 40))) {
                filteredMenu.push(menuItem)
                currentWidth += menuItem.width
            } else {
                currentWidth += menuItem.width
                dropedMenu.push(menuItem)
            }
        })
        if (dropedMenu && dropedMenu.length > 0 && dropedMenu[0].id === "Divider") {
            dropedMenu.splice(0, 1)
        }

        return (
            <>
                { !isPreview &&
                    <div className={prefix("menu")} ref={this.menuContainerRef}>
                        {filteredMenu.map((MenuClass, i) => {
                            return this.renderIcon(MenuClass, i, selected)
                        })}
                        {
                            dropedMenu.length > 0 &&
                            <DropdownIcon>
                                {dropedMenu.map((MenuClass, i) => {
                                    return this.renderIcon(MenuClass, i, selected)
                                })}
                            </DropdownIcon>
                        }
                    </div>
                }
                {this.props.children}
                {
                    !isPreview && floatingMenu.length > 0 &&
                    <div className={prefix("floating-menu")}>
                        {floatingMenu.map((MenuClass, i) => {
                            return this.renderIcon(MenuClass, i, selected)
                        })}
                    </div>
                }
            </>
        );
    }

    public renderIcon(MenuClass: typeof Icon, i: number, selected: string) {
        const menuRefs = this.menuRefs;
        const editor = this.props.editor;
        const id = MenuClass.id;
        if (!menuRefs[i]) {
            menuRefs[i] = React.createRef();
        }
        if (id === "Divider") {
            return (
                <MenuClass key={i} editor={editor} />
            )
        }
        return (
            <MenuClass
                ref={menuRefs[i]}
                key={i}
                editor={editor}
                selected={Array.isArray(id) ? id.includes(selected) : selected === id}
                selectedId={selected}
                onSelect={this.select}
            />
        );
    }

    public select = (id: string) => {
        this.setState({
            selected: id,
        });
        this.props.onSelect(id);
    }
    public getSelected(): typeof Icon | undefined {
        const selected = this.state.selected;
        return CompleteMenu.filter(m => m.id === selected)[0];
    }
    public blur() {
        this.menuRefs.forEach(ref => {
            if (!ref.current) {
                return;
            }
            ref.current.blur();
        });
    }
    updateDimensions = () => {
        const container = this.menuContainerRef.current!
        let width = container.clientWidth || 0
        width = width - (parseFloat(window.getComputedStyle(container).paddingLeft) + parseFloat(window.getComputedStyle(container).paddingRight));
        this.setState({ width });
    };
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }
    componentDidMount(): void {
        window.addEventListener('resize', this.updateDimensions);
        this.updateDimensions()
        this.forceUpdate()
    }
}

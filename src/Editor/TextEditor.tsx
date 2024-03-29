import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Memory from './utils/Memory';
import { ElementInfo } from './Viewport/Viewport';
import Editor from './Editor';
import { convertToSnakeCase } from './utils/utils';
type TextEditorProps = {
	element: ElementInfo;
	memory: Memory,
	editor: Editor
}
export default function TextEditor({ element, memory, editor }: TextEditorProps) {
	const textareaRef = useRef<HTMLTextAreaElement | null>(null)
	const [text, setText] = useState(element.innerText || "")

	useEffect(() => {
		adjustTextareaSize()
	})
	useLayoutEffect(() => {
		const timer = window.setTimeout(() => {
			if (textareaRef.current) {
				textareaRef.current.focus()
			}
		}, 200)
		return () => {
			window.clearTimeout(timer)
		}
	},[])

	 const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement> ) => {
    setText(event.target.value);
    adjustTextareaSize();
  };

	const adjustTextareaSize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.width = '10px';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      textareaRef.current.style.width = `${textareaRef.current.scrollWidth}px`;
    }
	};

	const styles = {
			color: memory.get("color"),
			fontFamily: memory.get("font-family"),
			fontSize: memory.get("font-size"),
			textAlign: memory.get("text-align"),
			fontWeight: memory.get("font-weight"),
			fontStyle: memory.get("font-style"),
			textDecoration: memory.get("text-decoration"),
	}
	const handleSave = () => {
		const el = element
		const isNew = el.innerText === "" || !el.innerText
		if (text.trim().length > 0) {
			const oldText = el.innerText
			el.innerText = text.trim()
			const newFrame = Object.fromEntries(Object.entries(styles).map(style => {
					const [key, value] = style
					return [convertToSnakeCase(key), value]
			}))
			el.frame = {
				...el.frame,
				...newFrame
			}
			if (el.el) {
				el.el.textContent = text
				Object.entries(styles).forEach(style => {
					const [key, value] = style
					el.el!.style[key as any] = value
				})
			}
			editor.appendJSXs([el], true, isNew)
			if (!isNew) {
				editor.historyManager.addAction("changeText", {
					id: el.id,
					prev: oldText,
					next: el.innerText
				});
			}
		} else {
			editor.removeByIds([el.id!],isNew)
		}
		editor.menu.current?.select("MoveTool")
		editor.setSelectedTargets([])
	}

	return (
		<div className='text-editor' onClick={handleSave}>
			<textarea
				ref={textareaRef}
				autoFocus
				value={text}
				onChange={handleTextareaChange}
				wrap="off"
				style={styles}
				placeholder='Agregar texto'
				onClick={e => e.stopPropagation()}
				onFocus={(e)=> {
					var val = e.target.value;
					e.target.value = '';
					e.target.value = val;
				}}
			/>
		</div>
	)
}

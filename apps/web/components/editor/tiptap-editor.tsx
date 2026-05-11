"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { 
    Bold, 
    Italic, 
    List, 
    ListOrdered, 
    Quote, 
    Undo, 
    Redo,
    Heading1,
    Heading2,
    Code
} from 'lucide-react'

interface TiptapEditorProps {
    content: string
    onChange: (content: string) => void
    placeholder?: string
    minHeight?: string
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) return null

    return (
        <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/5">
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-1.5 rounded-md hover:bg-muted transition-colors ${editor.isActive('bold') ? 'bg-foreground text-background' : 'text-muted-foreground'}`}
            >
                <Bold className="w-3.5 h-3.5" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-1.5 rounded-md hover:bg-muted transition-colors ${editor.isActive('italic') ? 'bg-foreground text-background' : 'text-muted-foreground'}`}
            >
                <Italic className="w-3.5 h-3.5" />
            </button>
            <div className="w-[1px] h-4 bg-border mx-1 self-center" />
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`p-1.5 rounded-md hover:bg-muted transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-foreground text-background' : 'text-muted-foreground'}`}
            >
                <Heading1 className="w-3.5 h-3.5" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-1.5 rounded-md hover:bg-muted transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-foreground text-background' : 'text-muted-foreground'}`}
            >
                <Heading2 className="w-3.5 h-3.5" />
            </button>
            <div className="w-[1px] h-4 bg-border mx-1 self-center" />
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-1.5 rounded-md hover:bg-muted transition-colors ${editor.isActive('bulletList') ? 'bg-foreground text-background' : 'text-muted-foreground'}`}
            >
                <List className="w-3.5 h-3.5" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-1.5 rounded-md hover:bg-muted transition-colors ${editor.isActive('orderedList') ? 'bg-foreground text-background' : 'text-muted-foreground'}`}
            >
                <ListOrdered className="w-3.5 h-3.5" />
            </button>
            <div className="w-[1px] h-4 bg-border mx-1 self-center" />
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`p-1.5 rounded-md hover:bg-muted transition-colors ${editor.isActive('blockquote') ? 'bg-foreground text-background' : 'text-muted-foreground'}`}
            >
                <Quote className="w-3.5 h-3.5" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={`p-1.5 rounded-md hover:bg-muted transition-colors ${editor.isActive('codeBlock') ? 'bg-foreground text-background' : 'text-muted-foreground'}`}
            >
                <Code className="w-3.5 h-3.5" />
            </button>
            <div className="flex-1" />
            <button
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                className="p-1.5 rounded-md hover:bg-muted text-muted-foreground"
            >
                <Undo className="w-3.5 h-3.5" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                className="p-1.5 rounded-md hover:bg-muted text-muted-foreground"
            >
                <Redo className="w-3.5 h-3.5" />
            </button>
        </div>
    )
}

export function TiptapEditor({ content, onChange, placeholder, minHeight = "80px" }: TiptapEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
        ],
        immediatelyRender: false,
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: `tiptap-content focus:outline-none px-4 py-3 text-[13px] font-medium leading-relaxed`,
                style: `min-height: ${minHeight};`,
            },
        },
    })

    return (
        <div className="w-full border rounded-xl overflow-hidden bg-background focus-within:ring-1 focus-within:ring-foreground/10 transition-all">
            <style jsx global>{`
                .tiptap-content h1 {
                    font-size: 1.25rem;
                    font-weight: 800;
                    line-height: 1.2;
                    margin-bottom: 0.25rem;
                }
                .tiptap-content h2 {
                    font-size: 1.1rem;
                    font-weight: 700;
                    line-height: 1.2;
                    margin-bottom: 0.2rem;
                }
                .tiptap-content ul {
                    list-style-type: disc;
                    padding-left: 1.2rem;
                }
                .tiptap-content ol {
                    list-style-type: decimal;
                    padding-left: 1.2rem;
                }
                .tiptap-content blockquote {
                    border-left: 2px solid hsl(var(--border));
                    padding-left: 1rem;
                    color: hsl(var(--muted-foreground));
                }
                .tiptap-content code {
                    font-family: monospace;
                    olor: #fff;
                    padding: 0 0.2rem;
                    border-radius: 0.2rem;
                }
                .tiptap-content pre {
                    font-family: monospace;
                    background-color: #ffffff16;
                    padding-left: 0.5rem;
                    
                    
                }
            `}</style>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    )
}

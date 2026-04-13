import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Node, mergeAttributes } from '@tiptap/core';
import { Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, Quote, Link as LinkIcon, Palette, ChevronDown, Image as ImageIcon } from 'lucide-react';

// Custom Node for Figure (Image + Caption)
const Figure = Node.create({
  name: 'figure',
  group: 'block',
  content: 'inline*',
  draggable: true,
  isolating: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'figure',
        contentElement: 'figcaption',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'figure',
      ['img', mergeAttributes(HTMLAttributes, { draggable: false, contenteditable: false })],
      ['figcaption', 0],
    ]
  },

  addCommands() {
    return {
      setFigure: ({ src, alt }) => ({ commands }: any) => {
        return commands.insertContent({
          type: this.name,
          attrs: { src, alt },
          content: [{ type: 'text', text: 'Saisir une légende pour l\'image...' }],
        })
      },
    }
  },
})

interface TiptapProps {
  content: string;
  onChange: (html: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL du lien', previousUrl)
    if (url === null) { return }
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  const addImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const url = e.target?.result as string;
          editor.chain().focus().setFigure({ src: url, alt: file.name }).run();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }

  const handleHeadingChange = (level: any) => {
    if (level === 'p') {
      editor.chain().focus().setParagraph().run();
    } else {
      editor.chain().focus().toggleHeading({ level: parseInt(level) }).run();
    }
  };

  const Button = ({ onClick, isActive, disabled, children }: any) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded-lg transition-colors ${
        isActive ? 'bg-[#007cba] text-white' : 'text-[#6b7280] hover:bg-[#f1f5f9] hover:text-[#0f172a]'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="bg-[#f8fafc] px-4 py-2 border-b border-[#e2e8f0] flex flex-wrap gap-1 items-center sticky top-0 z-10 overflow-x-auto no-scrollbar">
      {/* Headings Dropdown */}
      <div className="relative flex items-center bg-white border border-[#e2e8f0] rounded-lg px-2 mr-1">
        <select 
          className="appearance-none bg-transparent py-1.5 pl-2 pr-8 text-sm font-bold text-[#0f172a] outline-none cursor-pointer"
          onChange={(e) => handleHeadingChange(e.target.value)}
          value={editor.isActive('heading', { level: 2 }) ? '2' : editor.isActive('heading', { level: 3 }) ? '3' : 'p'}
        >
          <option value="p">Texte normal</option>
          <option value="2">Gros titre (H2)</option>
          <option value="3">Sous-titre (H3)</option>
        </select>
        <ChevronDown size={14} className="absolute right-2 pointer-events-none text-[#94a3b8]" />
      </div>

      <div className="w-px h-6 bg-[#cbd5e1] mx-1"></div>

      <Button onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')}>
        <Bold size={16} />
      </Button>
      <Button onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')}>
        <Italic size={16} />
      </Button>
      <Button onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')}>
        <UnderlineIcon size={16} />
      </Button>

      {/* Color Picker */}
      <div className="flex items-center gap-1 ml-1 p-1 bg-white border border-[#e2e8f0] rounded-lg group">
        <Palette size={14} className="ml-1 text-[#94a3b8]" />
        <input
          type="color"
          onInput={event => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
          value={editor.getAttributes('textStyle').color || '#0f172a'}
          className="w-6 h-6 border-none bg-transparent cursor-pointer rounded overflow-hidden"
          title="Couleur du texte"
        />
      </div>
      
      <div className="w-px h-6 bg-[#cbd5e1] mx-1"></div>

      <Button onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')}>
        <List size={16} />
      </Button>
      <Button onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')}>
        <ListOrdered size={16} />
      </Button>
      <Button onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')}>
        <Quote size={16} />
      </Button>

      <div className="w-px h-6 bg-[#cbd5e1] mx-1"></div>

      <Button onClick={setLink} isActive={editor.isActive('link')}>
        <LinkIcon size={16} />
      </Button>
      <Button onClick={addImage} isActive={editor.isActive('figure')}>
        <ImageIcon size={16} />
      </Button>
    </div>
  );
};

export const Tiptap = ({ content, onChange }: TiptapProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Figure,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'article-content focus:outline-none min-h-[400px] p-6',
      },
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith('image/')) {
            event.preventDefault();
            const reader = new FileReader();
            reader.onload = (e) => {
              const url = e.target?.result as string;
              // Extraire la position de la souris
              const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
              if (coordinates) {
                editor.chain().focus().insertContentAt(coordinates.pos, {
                  type: 'figure',
                  attrs: { src: url, alt: file.name },
                  content: [{ type: 'text', text: 'Saisir une légende pour l\'image...' }],
                }).run();
              }
            };
            reader.readAsDataURL(file);
            return true;
          }
        }
        return false;
      },
    },
  });

  React.useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  return (
    <div className="border border-[#e2e8f0] rounded-xl overflow-hidden focus-within:border-[#007cba] transition-colors bg-white">
      <MenuBar editor={editor} />
      <div className="relative">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

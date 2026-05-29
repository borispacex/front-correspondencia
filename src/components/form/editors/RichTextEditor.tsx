import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect } from 'react';

import clsx from 'clsx';

interface RichTextEditorProps {
  label?: string;
  value?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  onChange?: (value: string) => void;
}

export default function RichTextEditor({
  label,
  value = '',
  placeholder = 'Escriba aquí...',
  error,
  disabled = false,
  required = false,
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],

    content: value,

    editable: !disabled,

    editorProps: {
      attributes: {
        class: clsx(
          'min-h-[250px] w-full px-4 py-3 outline-none',
          'prose max-w-none dark:prose-invert',
          'text-sm text-gray-800 dark:text-gray-100',
        ),
      },
    },

    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}

          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}

      <div
        className={clsx(
          'overflow-hidden rounded-xl border bg-white transition dark:bg-gray-900',
          'border-gray-300 dark:border-gray-700',
          'focus-within:ring-brand-500/20 focus-within:ring-2',
          error && 'border-error-500 focus-within:ring-error-500/20',
        )}
      >
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 p-2 dark:border-gray-700">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={clsx(
              'rounded-lg px-3 py-1.5 text-sm transition',
              editor.isActive('bold') ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-800',
            )}
          >
            <strong>B</strong>
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={clsx(
              'rounded-lg px-3 py-1.5 text-sm transition',
              editor.isActive('italic') ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-800',
            )}
          >
            <em>I</em>
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={clsx(
              'rounded-lg px-3 py-1.5 text-sm transition',
              editor.isActive('bulletList')
                ? 'bg-gray-200 dark:bg-gray-700'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800',
            )}
          >
            • Lista
          </button>
        </div>

        {/* Editor */}
        <EditorContent editor={editor} />
      </div>

      {error && <p className="text-error-500 mt-1 text-sm">{error}</p>}
    </div>
  );
}

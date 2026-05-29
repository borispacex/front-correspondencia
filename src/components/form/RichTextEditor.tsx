import { useRef, useState, useCallback, useEffect } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface RichTextEditorProps {
  label?: string;
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
  name?: string;
}

type HeadingTag = 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote' | 'pre';

// ─── Separator ────────────────────────────────────────────────────────────────
const Sep = () => <span className="mx-0.5 inline-block h-4 w-px shrink-0 self-center bg-gray-300 dark:bg-gray-600" />;

// ─── Toolbar Button ───────────────────────────────────────────────────────────
const Btn = ({
  title,
  onClick,
  active,
  children,
  wide,
}: {
  title: string;
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  wide?: boolean;
}) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className={[
      // mobile: 32px touch target / desktop: 22px compact
      'inline-flex shrink-0 items-center justify-center rounded transition-colors',
      'h-8 md:h-[22px]',
      wide ? 'gap-1 px-2' : 'w-8 md:w-[22px]',
      active
        ? 'bg-blue-200 text-blue-800 dark:bg-blue-700/60 dark:text-blue-100'
        : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white',
    ].join(' ')}
  >
    {children}
  </button>
);

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const I = {
  Cut: () => (
    <svg viewBox="0 0 16 16" className="h-4 w-4 md:h-3.5 md:w-3.5" fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d="M5 1 L8 7 L11 1" />
      <circle cx="4" cy="13" r="2.2" />
      <circle cx="12" cy="13" r="2.2" />
      <line x1="4" y1="10.8" x2="8" y2="7" />
      <line x1="12" y1="10.8" x2="8" y2="7" />
    </svg>
  ),
  Copy: () => (
    <svg viewBox="0 0 16 16" className="h-4 w-4 md:h-3.5 md:w-3.5" fill="none" stroke="currentColor" strokeWidth="1.3">
      <rect x="5" y="4" width="8" height="10" rx="1" />
      <path d="M3 12V2h8" />
    </svg>
  ),
  Paste: () => (
    <svg viewBox="0 0 16 16" className="h-4 w-4 md:h-3.5 md:w-3.5" fill="none" stroke="currentColor" strokeWidth="1.3">
      <rect x="2" y="5" width="10" height="9" rx="1" />
      <path d="M5 5V3h6v2" />
      <rect x="6" y="1" width="4" height="3" rx="0.5" />
    </svg>
  ),
  PasteTxt: () => (
    <svg viewBox="0 0 16 16" className="h-4 w-4 md:h-3.5 md:w-3.5" fill="none" stroke="currentColor" strokeWidth="1.3">
      <rect x="2" y="5" width="10" height="9" rx="1" />
      <path d="M5 5V3h6v2" />
      <rect x="6" y="1" width="4" height="3" rx="0.5" />
      <line x1="5" y1="9" x2="11" y2="9" strokeDasharray="2 1.5" />
    </svg>
  ),
  PasteWord: () => (
    <svg viewBox="0 0 16 16" className="h-4 w-4 md:h-3.5 md:w-3.5" fill="none" stroke="currentColor" strokeWidth="1.3">
      <rect x="2" y="4" width="10" height="10" rx="1" />
      <path d="M5 4V2h6v2" />
      <rect x="6" y="0.5" width="4" height="2.5" rx="0.5" />
      <text x="4" y="12" fontSize="6" fill="currentColor" stroke="none" fontWeight="bold">
        W
      </text>
    </svg>
  ),
  Undo: () => (
    <svg viewBox="0 0 16 16" className="h-4 w-4 md:h-3.5 md:w-3.5" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M3 8C3 5 5.5 3 8.5 3c3 0 5.5 2.5 5.5 5.5S11.5 14 8.5 14" />
      <polyline points="1,6 3,8 5,6" />
    </svg>
  ),
  Redo: () => (
    <svg viewBox="0 0 16 16" className="h-4 w-4 md:h-3.5 md:w-3.5" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M13 8c0-3-2.5-5-5.5-5S2 5.5 2 8.5 4.5 14 7.5 14" />
      <polyline points="15,6 13,8 11,6" />
    </svg>
  ),
  Spell: () => (
    <svg viewBox="0 0 16 16" className="h-4 w-4 md:h-3.5 md:w-3.5" fill="currentColor">
      <text x="1" y="10" fontSize="8" fontFamily="serif" fontStyle="italic">
        ABC
      </text>
      <path d="M10 10L12 14.5L14 10" stroke="currentColor" strokeWidth="1.1" fill="none" />
      <line x1="10.5" y1="12.5" x2="13.5" y2="12.5" stroke="currentColor" strokeWidth="1" />
    </svg>
  ),
  Link: () => (
    <svg viewBox="0 0 16 16" className="h-4 w-4 md:h-3.5 md:w-3.5" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M6.5 9.5L9.5 6.5" />
      <path d="M5 11L4 12a3 3 0 1 0 4.24 4.24L11.5 13a3 3 0 0 0 0-4.24" />
      <path d="M11 5L12 4a3 3 0 1 0-4.24-4.24L4.5 3A3 3 0 0 0 4.5 7.24" />
    </svg>
  ),
  Unlink: () => (
    <svg viewBox="0 0 16 16" className="h-4 w-4 md:h-3.5 md:w-3.5" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M6.5 9.5L9.5 6.5" />
      <path d="M5 11L4 12a3 3 0 1 0 4.24 4.24L11.5 13" />
      <path d="M11 5L12 4a3 3 0 1 0-4.24-4.24L4.5 3" />
      <line x1="2" y1="2" x2="14" y2="14" strokeWidth="1.5" />
    </svg>
  ),
  Anchor: () => (
    <svg viewBox="0 0 16 16" className="h-4 w-4 md:h-3.5 md:w-3.5" fill="none" stroke="currentColor" strokeWidth="1.3">
      <circle cx="8" cy="4" r="2" />
      <line x1="8" y1="6" x2="8" y2="14" />
      <line x1="4" y1="8" x2="12" y2="8" />
      <path d="M3 14a5 5 0 0 0 10 0" />
    </svg>
  ),
  Image: () => (
    <svg viewBox="0 0 16 16" className="h-4 w-4 md:h-3.5 md:w-3.5" fill="none" stroke="currentColor" strokeWidth="1.3">
      <rect x="1" y="3" width="14" height="10" rx="1" />
      <circle cx="5" cy="7" r="1.2" fill="currentColor" stroke="none" />
      <polyline points="1,13 5,9 9,11.5 11,9.5 15,13" />
    </svg>
  ),
  Table: () => (
    <svg viewBox="0 0 16 16" className="h-4 w-4 md:h-3.5 md:w-3.5" fill="none" stroke="currentColor" strokeWidth="1.2">
      <rect x="1" y="1" width="14" height="14" rx="1" />
      <line x1="1" y1="5" x2="15" y2="5" />
      <line x1="1" y1="9" x2="15" y2="9" />
      <line x1="1" y1="13" x2="15" y2="13" />
      <line x1="5" y1="5" x2="5" y2="15" />
      <line x1="10" y1="5" x2="10" y2="15" />
    </svg>
  ),
  AlignL: () => (
    <svg viewBox="0 0 16 16" className="h-4 w-4 md:h-3.5 md:w-3.5" fill="currentColor">
      <rect x="1" y="2" width="14" height="1.5" rx=".5" />
      <rect x="1" y="5.5" width="9" height="1.5" rx=".5" />
      <rect x="1" y="9" width="14" height="1.5" rx=".5" />
      <rect x="1" y="12.5" width="9" height="1.5" rx=".5" />
    </svg>
  ),
  AlignC: () => (
    <svg viewBox="0 0 16 16" className="h-4 w-4 md:h-3.5 md:w-3.5" fill="currentColor">
      <rect x="1" y="2" width="14" height="1.5" rx=".5" />
      <rect x="3.5" y="5.5" width="9" height="1.5" rx=".5" />
      <rect x="1" y="9" width="14" height="1.5" rx=".5" />
      <rect x="3.5" y="12.5" width="9" height="1.5" rx=".5" />
    </svg>
  ),
  AlignR: () => (
    <svg viewBox="0 0 16 16" className="h-4 w-4 md:h-3.5 md:w-3.5" fill="currentColor">
      <rect x="1" y="2" width="14" height="1.5" rx=".5" />
      <rect x="6" y="5.5" width="9" height="1.5" rx=".5" />
      <rect x="1" y="9" width="14" height="1.5" rx=".5" />
      <rect x="6" y="12.5" width="9" height="1.5" rx=".5" />
    </svg>
  ),
  AlignJ: () => (
    <svg viewBox="0 0 16 16" className="h-4 w-4 md:h-3.5 md:w-3.5" fill="currentColor">
      <rect x="1" y="2" width="14" height="1.5" rx=".5" />
      <rect x="1" y="5.5" width="14" height="1.5" rx=".5" />
      <rect x="1" y="9" width="14" height="1.5" rx=".5" />
      <rect x="1" y="12.5" width="14" height="1.5" rx=".5" />
    </svg>
  ),
  Omega: () => (
    <svg viewBox="0 0 16 16" className="h-4 w-4 md:h-3.5 md:w-3.5" fill="currentColor">
      <text x="2" y="13" fontSize="13" fontFamily="serif">
        Ω
      </text>
    </svg>
  ),
  Maximize: () => (
    <svg viewBox="0 0 16 16" className="h-4 w-4 md:h-3.5 md:w-3.5" fill="none" stroke="currentColor" strokeWidth="1.3">
      <polyline points="9,1 15,1 15,7" />
      <polyline points="7,15 1,15 1,9" />
      <line x1="15" y1="1" x2="9" y2="7" />
      <line x1="1" y1="15" x2="7" y2="9" />
    </svg>
  ),
  Source: () => (
    <svg viewBox="0 0 16 16" className="h-4 w-4 md:h-3.5 md:w-3.5" fill="none" stroke="currentColor" strokeWidth="1.4">
      <polyline points="5,4 1,8 5,12" />
      <polyline points="11,4 15,8 11,12" />
      <line x1="9" y1="2" x2="7" y2="14" />
    </svg>
  ),
  Bold: () => (
    <svg viewBox="0 0 16 16" className="h-4 w-4 md:h-3.5 md:w-3.5" fill="currentColor">
      <path d="M4 2h5.5a3.5 3.5 0 0 1 0 7H4zm0 7h6a3.5 3.5 0 0 1 0 7H4z" />
    </svg>
  ),
  Italic: () => (
    <svg viewBox="0 0 16 16" className="h-4 w-4 md:h-3.5 md:w-3.5" fill="currentColor">
      <path d="M6 2h5l-1 1.5H8.5L6.2 12.5H8L7 14H2l1-1.5h1.8L7.1 3.5H5z" />
    </svg>
  ),
  Strike: () => (
    <svg viewBox="0 0 16 16" className="h-4 w-4 md:h-3.5 md:w-3.5" fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d="M3 5.5C3 3 5 2 8 2c3 0 5 1 5 3 0 1.5-1.5 2.5-4 3" />
      <line x1="1" y1="9" x2="15" y2="9" />
      <path d="M7 9c-3 .5-4 1.5-4 3 0 2 2 3 5 3s5-1 5-3" />
    </svg>
  ),
  ClearFmt: () => (
    <svg viewBox="0 0 16 16" className="h-4 w-4 md:h-3.5 md:w-3.5" fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d="M3 2H13" />
      <path d="M6 2L5 14h6L10 2" />
      <line x1="1" y1="14" x2="15" y2="14" />
      <line x1="10" y1="4" x2="14" y2="8" />
      <line x1="14" y1="4" x2="10" y2="8" />
    </svg>
  ),
  OL: () => (
    <svg viewBox="0 0 16 16" className="h-4 w-4 md:h-3.5 md:w-3.5" fill="currentColor">
      <text x="1" y="6" fontSize="5" fontFamily="monospace">
        1.
      </text>
      <text x="1" y="11" fontSize="5" fontFamily="monospace">
        2.
      </text>
      <text x="1" y="16" fontSize="5" fontFamily="monospace">
        3.
      </text>
      <rect x="7" y="3.5" width="8" height="1.2" />
      <rect x="7" y="8.5" width="8" height="1.2" />
      <rect x="7" y="13.5" width="8" height="1.2" />
    </svg>
  ),
  UL: () => (
    <svg viewBox="0 0 16 16" className="h-4 w-4 md:h-3.5 md:w-3.5" fill="currentColor">
      <circle cx="2.5" cy="4.5" r="1.3" />
      <circle cx="2.5" cy="9" r="1.3" />
      <circle cx="2.5" cy="13.5" r="1.3" />
      <rect x="6" y="3.8" width="9" height="1.4" />
      <rect x="6" y="8.3" width="9" height="1.4" />
      <rect x="6" y="12.8" width="9" height="1.4" />
    </svg>
  ),
  Indent: () => (
    <svg viewBox="0 0 16 16" className="h-4 w-4 md:h-3.5 md:w-3.5" fill="currentColor">
      <rect x="1" y="2" width="14" height="1.3" />
      <rect x="5" y="5.5" width="10" height="1.3" />
      <rect x="5" y="9" width="10" height="1.3" />
      <rect x="1" y="12.5" width="14" height="1.3" />
      <polygon points="1,5.8 1,9.8 3.5,7.8" />
    </svg>
  ),
  Outdent: () => (
    <svg viewBox="0 0 16 16" className="h-4 w-4 md:h-3.5 md:w-3.5" fill="currentColor">
      <rect x="1" y="2" width="14" height="1.3" />
      <rect x="5" y="5.5" width="10" height="1.3" />
      <rect x="5" y="9" width="10" height="1.3" />
      <rect x="1" y="12.5" width="14" height="1.3" />
      <polygon points="4,5.8 4,9.8 1.5,7.8" />
    </svg>
  ),
  Quote: () => (
    <svg viewBox="0 0 16 16" className="h-4 w-4 md:h-3.5 md:w-3.5" fill="currentColor" opacity=".85">
      <path d="M1 3v5c0 2 1 3 3 3v4h4V8H5c0-2 1-3 2-5H1z" />
      <path d="M9 3v5c0 2 1 3 3 3v4h4V8h-3c0-2 1-3 2-5H9z" />
    </svg>
  ),
  Help: () => (
    <svg viewBox="0 0 16 16" className="h-4 w-4 md:h-3.5 md:w-3.5" fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="8" cy="8" r="6.5" />
      <text x="5.8" y="12" fontSize="9" fontFamily="serif" fontWeight="bold" fill="currentColor" stroke="none">
        ?
      </text>
    </svg>
  ),
};

// ─── Options ──────────────────────────────────────────────────────────────────
const BLOCK_STYLES: { label: string; value: HeadingTag }[] = [
  { label: 'Normal', value: 'p' },
  { label: 'Título 1', value: 'h1' },
  { label: 'Título 2', value: 'h2' },
  { label: 'Título 3', value: 'h3' },
  { label: 'Título 4', value: 'h4' },
  { label: 'Título 5', value: 'h5' },
  { label: 'Título 6', value: 'h6' },
  { label: 'Cita', value: 'blockquote' },
  { label: 'Código', value: 'pre' },
];

const FONT_SIZES = [
  { label: '8px', value: '1' },
  { label: '10px', value: '2' },
  { label: '12px', value: '3' },
  { label: '14px', value: '4' },
  { label: '18px', value: '5' },
  { label: '24px', value: '6' },
  { label: '36px', value: '7' },
];

// ─── Toolbar Row wrapper ──────────────────────────────────────────────────────
const ToolbarRow = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-wrap items-center gap-[2px] border-b border-gray-300 bg-[#eaeaea] px-1.5 py-[3px] dark:border-gray-600 dark:bg-[#2a2a2a]">
    {children}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function RichTextEditor({
  label = 'Aclaración del Proveído',
  value = '',
  onChange,
  placeholder = 'Escriba el contenido aquí...',
  minHeight = 160,
  name = 'richTextEditor',
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState(value);
  const [showSource, setShowSource] = useState(false);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
  const [blockStyle, setBlockStyle] = useState<HeadingTag>('p');
  const [fontSize, setFontSize] = useState('3');
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('https://');
  const savedRange = useRef<Range | null>(null);

  // ── Init editor content
  useEffect(() => {
    if (editorRef.current && value) editorRef.current.innerHTML = value;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── execCommand helper
  const exec = useCallback((cmd: string, val?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val ?? '');
    refreshFormats();
    syncHtml();
  }, []);

  const syncHtml = useCallback(() => {
    const next = editorRef.current?.innerHTML ?? '';
    setHtml(next);
    onChange?.(next);
  }, [onChange]);

  const refreshFormats = useCallback(() => {
    const s = new Set<string>();
    (['bold', 'italic', 'strikeThrough', 'insertOrderedList', 'insertUnorderedList'] as const).forEach((cmd) => {
      if (document.queryCommandState(cmd)) s.add(cmd);
    });
    setActiveFormats(s);
    // detect current block tag
    const sel = window.getSelection();
    if (sel?.rangeCount) {
      let node: Node | null = sel.getRangeAt(0).commonAncestorContainer;
      if (node?.nodeType === Node.TEXT_NODE) node = node.parentElement;
      const tag = (node as HTMLElement)?.tagName?.toLowerCase() as HeadingTag;
      if (['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre'].includes(tag)) setBlockStyle(tag);
    }
  }, []);

  // ── Link
  const openLink = () => {
    const sel = window.getSelection();
    if (sel?.rangeCount) savedRange.current = sel.getRangeAt(0).cloneRange();
    setLinkOpen(true);
  };
  const confirmLink = () => {
    if (savedRange.current && linkUrl && linkUrl !== 'https://') {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedRange.current);
      }
      exec('createLink', linkUrl);
    }
    setLinkUrl('https://');
    setLinkOpen(false);
  };

  // ── Special chars
  const insertChar = () => {
    const char = window.prompt('Símbolo especial:\n© ® ™ € £ ¥ ° ± × ÷ → ← • … – — « »', '©');
    if (char) exec('insertText', char);
  };

  // ── Source toggle
  const toggleSource = () => {
    if (!showSource && editorRef.current) setHtml(editorRef.current.innerHTML);
    setShowSource((v) => !v);
  };

  // ── Shared select class (responsive)
  const selCls = [
    'shrink-0 cursor-pointer rounded border border-gray-300 bg-white outline-none',
    'transition hover:border-gray-400 focus:border-blue-400',
    'dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200',
    // mobile bigger, desktop compact
    'h-8 text-sm px-1.5 md:h-[22px] md:text-[11px] md:px-1',
  ].join(' ');

  return (
    <div className="w-full">
      {/* Label */}
      {label && <p className="mb-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300">{label}:</p>}

      {/* Editor shell */}
      <div className="overflow-hidden rounded border border-gray-400 bg-white shadow-sm dark:border-gray-600 dark:bg-gray-800">
        {/* ── Row 1 toolbar ───────────────────────────────────────────── */}
        <ToolbarRow>
          <Btn title="Cortar (Ctrl+X)" onClick={() => exec('cut')}>
            <I.Cut />
          </Btn>
          <Btn title="Copiar (Ctrl+C)" onClick={() => exec('copy')}>
            <I.Copy />
          </Btn>
          <Btn title="Pegar (Ctrl+V)" onClick={() => exec('paste')}>
            <I.Paste />
          </Btn>
          <Btn title="Pegar como texto plano" onClick={() => {}}>
            <I.PasteTxt />
          </Btn>
          <Btn title="Pegar desde Word" onClick={() => {}}>
            <I.PasteWord />
          </Btn>
          <Sep />
          <Btn title="Deshacer (Ctrl+Z)" onClick={() => exec('undo')}>
            <I.Undo />
          </Btn>
          <Btn title="Rehacer (Ctrl+Y)" onClick={() => exec('redo')}>
            <I.Redo />
          </Btn>
          <Sep />
          <Btn title="Verificar ortografía" onClick={() => {}}>
            <I.Spell />
          </Btn>
          <Sep />
          <Btn title="Insertar enlace" onClick={openLink}>
            <I.Link />
          </Btn>
          <Btn title="Quitar enlace" onClick={() => exec('unlink')}>
            <I.Unlink />
          </Btn>
          <Sep />
          <Btn title="Ancla" onClick={() => {}}>
            <I.Anchor />
          </Btn>
          <Sep />
          <Btn title="Insertar imagen" onClick={() => {}}>
            <I.Image />
          </Btn>
          <Btn title="Insertar tabla" onClick={() => {}}>
            <I.Table />
          </Btn>
          <Sep />
          <Btn title="Alinear izquierda" onClick={() => exec('justifyLeft')}>
            <I.AlignL />
          </Btn>
          <Btn title="Centrar" onClick={() => exec('justifyCenter')}>
            <I.AlignC />
          </Btn>
          <Btn title="Alinear derecha" onClick={() => exec('justifyRight')}>
            <I.AlignR />
          </Btn>
          <Btn title="Justificar" onClick={() => exec('justifyFull')}>
            <I.AlignJ />
          </Btn>
          <Sep />
          <Btn title="Símbolo especial" onClick={insertChar}>
            <I.Omega />
          </Btn>
          <Btn title="Maximizar" onClick={() => {}}>
            <I.Maximize />
          </Btn>
          <Sep />
          <Btn title="Ver fuente HTML" onClick={toggleSource} active={showSource} wide>
            <I.Source />
            <span className="text-[10px] leading-none font-medium tracking-tight">Fuente HTML</span>
          </Btn>
        </ToolbarRow>

        {/* ── Row 2 toolbar ───────────────────────────────────────────── */}
        <ToolbarRow>
          <Btn title="Negrita (Ctrl+B)" onClick={() => exec('bold')} active={activeFormats.has('bold')}>
            <I.Bold />
          </Btn>
          <Btn title="Cursiva (Ctrl+I)" onClick={() => exec('italic')} active={activeFormats.has('italic')}>
            <I.Italic />
          </Btn>
          <Btn title="Tachado" onClick={() => exec('strikeThrough')} active={activeFormats.has('strikeThrough')}>
            <I.Strike />
          </Btn>
          <Btn title="Limpiar formato" onClick={() => exec('removeFormat')}>
            <I.ClearFmt />
          </Btn>
          <Sep />
          <Btn
            title="Lista numerada"
            onClick={() => exec('insertOrderedList')}
            active={activeFormats.has('insertOrderedList')}
          >
            <I.OL />
          </Btn>
          <Btn
            title="Lista con viñetas"
            onClick={() => exec('insertUnorderedList')}
            active={activeFormats.has('insertUnorderedList')}
          >
            <I.UL />
          </Btn>
          <Btn title="Aumentar sangría" onClick={() => exec('indent')}>
            <I.Indent />
          </Btn>
          <Btn title="Disminuir sangría" onClick={() => exec('outdent')}>
            <I.Outdent />
          </Btn>
          <Sep />
          <Btn title="Cita en bloque" onClick={() => exec('formatBlock', 'blockquote')}>
            <I.Quote />
          </Btn>
          <Sep />

          {/* Estilo (block format) */}
          <select
            value={blockStyle}
            onChange={(e) => {
              const v = e.target.value as HeadingTag;
              setBlockStyle(v);
              exec('formatBlock', v);
            }}
            className={selCls}
            style={{ width: 'clamp(90px, 28vw, 110px)' }}
          >
            {BLOCK_STYLES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          {/* Tamaño fuente */}
          <select
            value={fontSize}
            onChange={(e) => {
              setFontSize(e.target.value);
              exec('fontSize', e.target.value);
            }}
            className={selCls}
            style={{ width: 'clamp(70px, 22vw, 80px)' }}
          >
            {FONT_SIZES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          <Sep />
          <Btn title="Ayuda" onClick={() => {}}>
            <I.Help />
          </Btn>
        </ToolbarRow>

        {/* ── Content area ────────────────────────────────────────────── */}
        {showSource ? (
          <textarea
            value={html}
            onChange={(e) => {
              const v = e.target.value;
              setHtml(v);
              onChange?.(v);
              if (editorRef.current) editorRef.current.innerHTML = v;
            }}
            spellCheck={false}
            className="w-full resize-none bg-white p-3 font-mono text-xs leading-relaxed text-gray-800 outline-none dark:bg-gray-900 dark:text-green-400"
            style={{ minHeight }}
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={syncHtml}
            onKeyUp={refreshFormats}
            onMouseUp={refreshFormats}
            data-placeholder={placeholder}
            className={[
              'w-full bg-white px-3 py-2.5 text-sm leading-relaxed text-gray-800 outline-none',
              'dark:bg-gray-800 dark:text-gray-100',
              // prose styles for rendered content
              '[&_h1]:text-xl [&_h1]:font-bold [&_h2]:text-lg [&_h2]:font-bold',
              '[&_blockquote]:border-l-4 [&_h3]:text-base [&_h3]:font-bold',
              '[&_blockquote]:border-gray-300 [&_blockquote]:pl-3 [&_blockquote]:italic',
              '[&_blockquote]:text-gray-600 dark:[&_blockquote]:border-gray-600',
              'dark:[&_blockquote]:text-gray-400',
              '[&_pre]:rounded [&_pre]:bg-gray-100 [&_pre]:p-2 [&_pre]:font-mono [&_pre]:text-xs',
              'dark:[&_pre]:bg-gray-700',
              '[&_ol]:list-inside [&_ol]:list-decimal [&_ul]:list-inside [&_ul]:list-disc',
              '[&_a]:text-blue-600 [&_a]:underline dark:[&_a]:text-blue-400',
              // placeholder
              '[&:empty]:before:pointer-events-none [&:empty]:before:text-gray-400',
              '[&:empty]:before:content-[attr(data-placeholder)]',
              'dark:[&:empty]:before:text-gray-500',
            ].join(' ')}
            style={{ minHeight }}
          />
        )}

        {/* ── Status bar ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-between border-t border-gray-300 bg-[#eaeaea] px-2 py-[3px] dark:border-gray-600 dark:bg-[#2a2a2a]">
          <span className="font-mono text-[11px] text-gray-500 dark:text-gray-400">body&nbsp;p</span>
          {/* resize grip icon */}
          <svg
            viewBox="0 0 10 10"
            className="h-3 w-3 cursor-se-resize text-gray-400 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          >
            <line x1="3" y1="10" x2="10" y2="3" />
            <line x1="6" y1="10" x2="10" y2="6" />
            <line x1="9" y1="10" x2="10" y2="9" />
          </svg>
        </div>
      </div>

      {/* Hidden input for form submit */}
      <input type="hidden" name={name} value={html} />

      {/* ── Link Dialog ─────────────────────────────────────────────────── */}
      {linkOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-lg border border-gray-300 bg-white p-5 shadow-2xl dark:border-gray-600 dark:bg-gray-800">
            <h4 className="mb-3 text-sm font-semibold text-gray-800 dark:text-gray-100">Insertar enlace</h4>
            <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">URL</label>
            <input
              type="url"
              value={linkUrl}
              autoFocus
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && confirmLink()}
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setLinkOpen(false)}
                className="rounded px-4 py-1.5 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmLink}
                className="rounded bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

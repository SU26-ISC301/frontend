import { useEffect, useRef, useState } from 'react';
import {
  Undo,
  Redo,
  Image,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Maximize2,
  Minimize2,
  Eraser,
  Type,
  ChevronDown
} from 'lucide-react';
import { cn } from '../../lib/utils';

export function ProductDescriptionEditor({ value = '', onChange, error }) {
  const editorRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHeadingMenu, setShowHeadingMenu] = useState(false);
  const [showListMenu, setShowListMenu] = useState(false);
  const [showAlignMenu, setShowAlignMenu] = useState(false);

  // Sync prop value to editor HTML without losing cursor focus
  useEffect(() => {
    if (editorRef.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value;
      }
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const executeCommand = (command, val = null) => {
    document.execCommand(command, false, val);
    handleInput();
  };

  const handleImageInsert = () => {
    const url = prompt('Nhập URL hình ảnh muốn chèn vào mô tả:');
    if (url) {
      executeCommand('insertImage', url);
    }
  };

  return (
    <>
      {isFullscreen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity animate-in fade-in duration-200"
          onClick={() => setIsFullscreen(false)}
        />
      )}
      <div
        className={cn(
          'border border-slate-200 rounded-xl overflow-hidden bg-white transition-all flex flex-col',
          isFullscreen
            ? 'fixed inset-0 z-[100] w-screen h-screen rounded-none border-none shadow-none animate-in fade-in duration-200'
            : 'relative min-h-[300px] shadow-sm w-full',
          error && 'border-red-300'
        )}
      >
        {/* TOOLBAR */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between flex-wrap gap-2 select-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Undo / Redo */}
            <button
              type="button"
              onClick={() => executeCommand('undo')}
              className="p-1.5 rounded-lg hover:bg-slate-200/60 text-slate-600 active:scale-95 transition-all"
              title="Hoàn tác (Ctrl+Z)"
            >
              <Undo className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('redo')}
              className="p-1.5 rounded-lg hover:bg-slate-200/60 text-slate-600 active:scale-95 transition-all"
              title="Làm lại (Ctrl+Y)"
            >
              <Redo className="h-4 w-4" />
            </button>

            <span className="h-4 w-px bg-slate-200 mx-1.5" />

            {/* Clean / Format Brush */}
            <button
              type="button"
              onClick={() => executeCommand('removeFormat')}
              className="p-1.5 rounded-lg hover:bg-slate-200/60 text-slate-600 active:scale-95 transition-all"
              title="Xóa định dạng"
            >
              <Eraser className="h-4 w-4" />
            </button>

            {/* Image Upload */}
            <button
              type="button"
              onClick={handleImageInsert}
              className="p-1.5 rounded-lg hover:bg-slate-200/60 text-slate-600 active:scale-95 transition-all"
              title="Chèn ảnh"
            >
              <Image className="h-4 w-4" />
            </button>

            <span className="h-4 w-px bg-slate-200 mx-1.5" />

            {/* Heading Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowHeadingMenu((p) => !p);
                  setShowListMenu(false);
                  setShowAlignMenu(false);
                }}
                className="px-2 py-1 rounded hover:bg-stone-100 text-stone-600 text-xs font-bold flex items-center gap-1 transition"
                title="Định dạng Tiêu đề"
              >
                <Type className="h-3.5 w-3.5" />
                <span>Tiêu đề</span>
                <ChevronDown className="h-3 w-3" />
              </button>
              {showHeadingMenu && (
                <div className="absolute left-0 mt-1 z-30 bg-white border border-[#e7ded3] rounded-lg shadow-lg py-1 min-w-[120px]">
                  <button
                    type="button"
                    onClick={() => {
                      executeCommand('formatBlock', '<h3>');
                      setShowHeadingMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs font-extrabold hover:bg-stone-50 text-stone-800"
                  >
                    Tiêu đề 1 (H3)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      executeCommand('formatBlock', '<h4>');
                      setShowHeadingMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs font-bold hover:bg-stone-50 text-stone-800"
                  >
                    Tiêu đề 2 (H4)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      executeCommand('formatBlock', '<p>');
                      setShowHeadingMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-stone-50 text-stone-600"
                  >
                    Văn bản thường
                  </button>
                </div>
              )}
            </div>

            {/* Bold / Italic / Underline */}
            <button
              type="button"
              onClick={() => executeCommand('bold')}
              className="p-1.5 rounded hover:bg-stone-100 text-stone-800 font-bold transition"
              title="In đậm (Ctrl+B)"
            >
              <Bold className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('italic')}
              className="p-1.5 rounded hover:bg-stone-100 text-stone-700 italic transition"
              title="In nghiêng (Ctrl+I)"
            >
              <Italic className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('underline')}
              className="p-1.5 rounded hover:bg-stone-100 text-stone-700 underline transition"
              title="Gạch chân (Ctrl+U)"
            >
              <Underline className="h-4 w-4" />
            </button>

            <span className="h-4 w-px bg-stone-200 mx-1" />

            {/* List Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowListMenu((p) => !p);
                  setShowHeadingMenu(false);
                  setShowAlignMenu(false);
                }}
                className="p-1.5 rounded hover:bg-stone-100 text-stone-600 flex items-center gap-0.5 transition"
                title="Danh sách"
              >
                <List className="h-4 w-4" />
                <ChevronDown className="h-3 w-3" />
              </button>
              {showListMenu && (
                <div className="absolute left-0 mt-1 z-30 bg-white border border-slate-200 rounded-lg shadow-lg py-1 min-w-[140px] animate-in fade-in duration-100">
                  <button
                    type="button"
                    onClick={() => {
                      executeCommand('insertUnorderedList');
                      setShowListMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                  >
                    <List className="h-3.5 w-3.5" />
                    Danh sách dấu chấm
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      executeCommand('insertOrderedList');
                      setShowListMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                  >
                    <ListOrdered className="h-3.5 w-3.5" />
                    Danh sách số lẻ
                  </button>
                </div>
              )}
            </div>

            {/* Alignment Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowAlignMenu((p) => !p);
                  setShowHeadingMenu(false);
                  setShowListMenu(false);
                }}
                className="p-1.5 rounded-lg hover:bg-slate-200/60 text-slate-600 flex items-center gap-0.5 transition-all"
                title="Căn lề"
              >
                <AlignLeft className="h-4 w-4" />
                <ChevronDown className="h-3 w-3" />
              </button>
              {showAlignMenu && (
                <div className="absolute left-0 mt-1 z-30 bg-white border border-slate-200 rounded-lg shadow-lg py-1 min-w-[120px] animate-in fade-in duration-100">
                  <button
                    type="button"
                    onClick={() => {
                      executeCommand('justifyLeft');
                      setShowAlignMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                  >
                    <AlignLeft className="h-3.5 w-3.5" />
                    Căn lề trái
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      executeCommand('justifyCenter');
                      setShowAlignMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                  >
                    <AlignCenter className="h-3.5 w-3.5" />
                    Căn giữa
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      executeCommand('justifyRight');
                      setShowAlignMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                  >
                    <AlignRight className="h-3.5 w-3.5" />
                    Căn lề phải
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      executeCommand('justifyFull');
                      setShowAlignMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                  >
                    <AlignJustify className="h-3.5 w-3.5" />
                    Căn đều 2 bên
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Fullscreen Button */}
          <div>
            <button
              type="button"
              onClick={() => setIsFullscreen((prev) => !prev)}
              className="p-1.5 rounded-lg hover:bg-slate-200/60 text-slate-600 active:scale-95 transition-all"
              title={isFullscreen ? 'Thu nhỏ cửa sổ' : 'Phóng to cửa sổ'}
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* EDITING AREA */}
        <div
          className={cn(
            'w-full flex-1 overflow-y-auto',
            isFullscreen ? 'bg-slate-50/60 py-8 px-4' : 'bg-white'
          )}
        >
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onBlur={handleInput}
            className={cn(
              'outline-none prose prose-sm text-sm text-slate-700 leading-relaxed',
              isFullscreen
                ? 'max-w-4xl mx-auto bg-white border border-slate-200/60 shadow-lg rounded-2xl p-8 md:p-12 min-h-full'
                : 'w-full p-4 min-h-[220px]'
            )}
            style={{
              minHeight: isFullscreen ? '100%' : '220px',
            }}
            placeholder="Nhập mô tả chi tiết sản phẩm của bạn..."
          />
        </div>

        {error && (
          <div className="px-4 py-2 bg-red-50 border-t border-red-100 flex items-center gap-1.5 text-xs font-bold text-red-600">
            ⚠️ {error}
          </div>
        )}
      </div>
    </>
  );
}

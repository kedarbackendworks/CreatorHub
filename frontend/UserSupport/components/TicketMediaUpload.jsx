"use client";

import { useRef, useState } from 'react';
import { FileVideo, Image as ImageIcon, Upload, X } from 'lucide-react';
import { formatFileSize, getFileType, validateAttachments } from '../utils/supportHelpers';

export default function TicketMediaUpload({
  files,
  onChange,
  onRemove,
  error,
  fileErrors = {},
  uploadProgress = {},
}) {
  const inputRef = useRef(null);
  const [localError, setLocalError] = useState('');

  const pushFiles = (incoming) => {
    const merged = [...files, ...incoming];
    const validation = validateAttachments(merged);

    if (!validation.valid) {
      setLocalError(validation.errors[0]?.message || 'Invalid attachments.');
      return;
    }

    setLocalError('');
    onChange(merged);
  };

  const onFileInput = (event) => {
    const selected = Array.from(event.target.files || []);
    if (!selected.length) return;
    pushFiles(selected);
    event.target.value = '';
  };

  const onDrop = (event) => {
    event.preventDefault();
    const selected = Array.from(event.dataTransfer.files || []);
    if (!selected.length) return;
    pushFiles(selected);
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={onDrop}
        className="w-full rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-5 text-left hover:border-slate-400"
      >
        <div className="flex items-start gap-3">
          <Upload className="mt-0.5 h-4 w-4 text-slate-500" />
          <div>
            <p className="text-sm font-semibold text-slate-800">Drag & drop or click to upload</p>
            <p className="mt-1 text-xs text-slate-500">Images (JPG, PNG, WEBP) up to 10MB, Videos (MP4, MOV) up to 50MB, max 5 files.</p>
          </div>
        </div>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime"
        multiple
        onChange={onFileInput}
        className="hidden"
      />

      {error || localError ? <p className="mt-2 text-xs text-red-600">{error || localError}</p> : null}

      {files.length > 0 ? (
        <div className="mt-3 space-y-2">
          {files.map((file) => {
            const key = `${file.name}-${file.size}`;
            const type = getFileType(file.type);
            const progress = uploadProgress[file.name] || 0;
            return (
              <div key={key} className="rounded-lg border border-slate-200 bg-white p-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {type === 'video' ? <FileVideo className="h-4 w-4 text-slate-500" /> : <ImageIcon className="h-4 w-4 text-slate-500" />}
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-slate-700">{file.name}</p>
                      <p className="text-[11px] text-slate-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => onRemove(file)} className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {progress > 0 && progress < 100 ? (
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full bg-slate-900 transition-all" style={{ width: `${progress}%` }} />
                  </div>
                ) : null}

                {fileErrors[file.name] ? <p className="mt-1 text-xs text-red-600">{fileErrors[file.name]}</p> : null}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

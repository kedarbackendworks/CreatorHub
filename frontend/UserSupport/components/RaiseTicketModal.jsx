"use client";

import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSubmitTicket } from '../hooks/useSubmitTicket';
import TicketTagSelector from './TicketTagSelector';
import TicketMediaUpload from './TicketMediaUpload';

const INITIAL_FORM = {
  tag: 'support',
  heading: '',
  description: '',
};

export default function RaiseTicketModal({ open, onClose, onSubmitted }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [files, setFiles] = useState([]);
  const {
    loading,
    error,
    fieldErrors,
    fileErrors,
    uploadProgress,
    success,
    ticketId,
    submitTicket,
    reset,
  } = useSubmitTicket();

  useEffect(() => {
    if (!open) {
      setForm(INITIAL_FORM);
      setFiles([]);
      reset();
    }
  }, [open, reset]);

  useEffect(() => {
    if (!success) return;
    toast.success(`Ticket ${ticketId} submitted. We'll be in touch.`);
    onSubmitted?.();
    onClose();
  }, [success, ticketId, onClose, onSubmitted]);

  const charCount = useMemo(() => form.description.length, [form.description.length]);

  if (!open) return null;

  const removeFile = (target) => {
    setFiles((prev) => prev.filter((file) => !(file.name === target.name && file.size === target.size)));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await submitTicket({ ...form, files });
  };

  return (
    <div className="fixed inset-0 z-[280] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Raise a Support Ticket</h2>
          <button type="button" onClick={onClose} className="rounded p-1 text-slate-500 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
          <section>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Category *</p>
            <TicketTagSelector value={form.tag} onChange={(tag) => setForm((prev) => ({ ...prev, tag }))} error={fieldErrors.tag} />
          </section>

          <section>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Heading *</p>
            <input
              value={form.heading}
              maxLength={120}
              onChange={(event) => setForm((prev) => ({ ...prev, heading: event.target.value }))}
              placeholder='e.g. "Payment not reflected in wallet"'
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-900"
            />
            {fieldErrors.heading ? <p className="mt-1 text-xs text-red-600">{fieldErrors.heading}</p> : null}
          </section>

          <section>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Description *</p>
            <textarea
              value={form.description}
              maxLength={2000}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="Describe your issue in detail..."
              rows={6}
              className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-900"
            />
            <div className="mt-1 flex items-center justify-between">
              {fieldErrors.description ? <p className="text-xs text-red-600">{fieldErrors.description}</p> : <span />}
              <p className="text-xs text-slate-500">{charCount}/2000</p>
            </div>
          </section>

          <section>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Attachments (optional)</p>
            <TicketMediaUpload
              files={files}
              onChange={setFiles}
              onRemove={removeFile}
              error={fieldErrors.attachments}
              fileErrors={fileErrors}
              uploadProgress={uploadProgress}
            />
          </section>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
            <button type="button" onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
              {loading ? 'Submitting...' : 'Submit Ticket →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useCallback, useState } from 'react';
import { z } from 'zod';
import api from '@/src/lib/api';
import { ATTACHMENT_LIMITS, TICKET_TAGS } from '../utils/supportConstants';

const TicketSchema = z.object({
  tag: z.enum(TICKET_TAGS),
  heading: z.string().trim().min(5, 'Heading must be at least 5 characters.').max(120, 'Heading must be at most 120 characters.'),
  description: z.string().trim().min(20, 'Description must be at least 20 characters.').max(2000, 'Description must be at most 2000 characters.'),
  attachments: z
    .array(
      z.object({
        name: z.string(),
        size: z.number(),
        type: z.string(),
      })
    )
    .max(ATTACHMENT_LIMITS.maxFiles, `Maximum ${ATTACHMENT_LIMITS.maxFiles} files allowed.`)
    .optional(),
});

export function useSubmitTicket() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [fileErrors, setFileErrors] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  const [success, setSuccess] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const reset = useCallback(() => {
    setLoading(false);
    setError('');
    setFieldErrors({});
    setFileErrors({});
    setUploadProgress({});
    setSuccess(false);
    setTicketId('');
  }, []);

  const submitTicket = async ({ tag, heading, description, files = [] }) => {
    setLoading(true);
    setError('');
    setFieldErrors({});
    setFileErrors({});
    setUploadProgress({});
    setSuccess(false);
    setTicketId('');

    const parsed = TicketSchema.safeParse({
      tag,
      heading,
      description,
      attachments: files.map((f) => ({ name: f.name, size: f.size, type: f.type })),
    });

    if (!parsed.success) {
      const nextFieldErrors = {};
      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0];
        if (typeof key === 'string' && !nextFieldErrors[key]) {
          nextFieldErrors[key] = issue.message;
        }
      });
      setFieldErrors(nextFieldErrors);
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('tag', tag);
      formData.append('heading', heading);
      formData.append('description', description);

      files.forEach((file) => {
        formData.append('attachments', file);
      });

      const { data } = await api.post('/support/user/tickets', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total || 1;
          const percent = Math.min(100, Math.round((progressEvent.loaded * 100) / total));
          const progressMap = {};
          files.forEach((file) => {
            progressMap[file.name] = percent;
          });
          setUploadProgress(progressMap);
        },
      });

      setSuccess(true);
      setTicketId(data?.ticket?.ticketId || '');
    } catch (err) {
      const response = err?.response?.data;
      setError(response?.message || 'Failed to submit ticket.');

      if (Array.isArray(response?.fileErrors)) {
        const nextFileErrors = {};
        response.fileErrors.forEach((item) => {
          if (item?.filename && item?.message) {
            nextFileErrors[item.filename] = item.message;
          }
        });
        setFileErrors(nextFileErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fieldErrors,
    fileErrors,
    uploadProgress,
    success,
    ticketId,
    submitTicket,
    reset,
  };
}

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, NotebookPen, Pencil, Trash2, X } from "lucide-react";
import type { Investigation, InvestigationNote } from "@/lib/investigations/types";
import { addNote, deleteNote, updateNote } from "@/lib/investigations/store";
import { currentOfficer } from "@/lib/investigations/officer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatDateTime, formatRelative } from "@/lib/format";

function NoteRow({ investigationId, note }: { investigationId: string; note: InvestigationNote }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(note.body);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  function saveEdit() {
    updateNote(investigationId, note.id, draft);
    setEditing(false);
  }

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl border border-ink-100 bg-canvas/50 p-3.5"
    >
      {editing ? (
        <div>
          <label className="sr-only" htmlFor={`edit-${note.id}`}>
            Edit note
          </label>
          <textarea
            id={`edit-${note.id}`}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
            className="w-full resize-y rounded-lg border border-ink-200 bg-surface p-2.5 text-sm text-ink-900 focus-visible:border-primary-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
          />
          <div className="mt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                setDraft(note.body);
                setEditing(false);
              }}
            >
              <X size={13} strokeWidth={2.5} aria-hidden="true" /> Cancel
            </Button>
            <Button type="button" size="sm" onClick={saveEdit} disabled={!draft.trim()}>
              <Check size={13} strokeWidth={2.5} aria-hidden="true" /> Save
            </Button>
          </div>
        </div>
      ) : (
        <>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-700">{note.body}</p>

          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-ink-100 pt-2.5">
            <p className="text-[11px] text-ink-400">
              {note.author} · {formatDateTime(note.createdAt)}
              {note.updatedAt && <span className="ml-1 italic">(edited {formatRelative(note.updatedAt)})</span>}
            </p>

            <div className="flex items-center gap-1">
              {confirmingDelete ? (
                <>
                  <span className="text-[11px] font-medium text-danger-700">Delete note?</span>
                  <button
                    type="button"
                    onClick={() => deleteNote(investigationId, note.id)}
                    className="rounded-md px-1.5 py-0.5 text-[11px] font-semibold text-danger-700 transition-colors hover:bg-danger-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger-500"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingDelete(false)}
                    className="rounded-md px-1.5 py-0.5 text-[11px] font-medium text-ink-500 transition-colors hover:bg-ink-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    aria-label="Edit note"
                    className="flex h-7 w-7 items-center justify-center rounded-md text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
                  >
                    <Pencil size={13} strokeWidth={2.25} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingDelete(true)}
                    aria-label="Delete note"
                    className="flex h-7 w-7 items-center justify-center rounded-md text-ink-400 transition-colors hover:bg-danger-50 hover:text-danger-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger-500"
                  >
                    <Trash2 size={13} strokeWidth={2.25} />
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </motion.li>
  );
}

export function NotesPanel({ investigation }: { investigation: Investigation }) {
  const [draft, setDraft] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!draft.trim()) return;
    addNote(investigation.id, draft);
    setDraft("");
  }

  return (
    <Card className="p-5">
      <div className="flex items-center gap-3.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white">
          <NotebookPen size={18} aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-semibold text-ink-900">Investigation Notes</h2>
          <p className="text-sm text-ink-500">
            {investigation.notes.length === 0
              ? "No notes recorded yet"
              : `${investigation.notes.length} note${investigation.notes.length === 1 ? "" : "s"} · stored in this browser`}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4">
        <label htmlFor="new-note" className="sr-only">
          Add an investigation note
        </label>
        <textarea
          id="new-note"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          placeholder={`Record an observation, action taken, or next step as ${currentOfficer.name}…`}
          className="w-full resize-y rounded-xl border border-ink-200 bg-surface p-3 text-sm text-ink-900 placeholder:text-ink-400 focus-visible:border-primary-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
        />
        <div className="mt-2 flex justify-end">
          <Button type="submit" size="sm" disabled={!draft.trim()}>
            Add note
          </Button>
        </div>
      </form>

      {investigation.notes.length > 0 && (
        <ul className="mt-4 flex flex-col gap-2.5">
          <AnimatePresence initial={false}>
            {investigation.notes.map((note) => (
              <NoteRow key={note.id} investigationId={investigation.id} note={note} />
            ))}
          </AnimatePresence>
        </ul>
      )}
    </Card>
  );
}

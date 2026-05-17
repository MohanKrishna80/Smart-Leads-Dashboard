import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./Button";
import { SelectField, TextField } from "./Field";
import { leadSources, leadStatuses, type Lead, type LeadInput } from "../types/domain";

interface LeadModalProps {
  lead?: Lead | null;
  isOpen: boolean;
  onClose(): void;
  onSubmit(input: LeadInput): Promise<void>;
}

const emptyForm: LeadInput = {
  name: "",
  email: "",
  status: "New",
  source: "Website"
};

export const LeadModal = ({ lead, isOpen, onClose, onSubmit }: LeadModalProps) => {
  const [form, setForm] = useState<LeadInput>(emptyForm);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setForm(lead ? { name: lead.name, email: lead.email, status: lead.status, source: lead.source } : emptyForm);
    setError("");
  }, [lead, isOpen]);

  if (!isOpen) {
    return null;
  }

  const save = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and email are required.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      await onSubmit(form);
      onClose();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to save lead.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/45 p-4">
      <div className="w-full max-w-xl rounded-lg bg-white p-5 shadow-panel dark:bg-slate-950">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-ink dark:text-white">{lead ? "Edit lead" : "New lead"}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Keep lead details complete and current.</p>
          </div>
          <button
            type="button"
            aria-label="Close"
            className="rounded-md p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          <TextField label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <SelectField label="Status" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as LeadInput["status"] })}>
            {leadStatuses.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </SelectField>
          <SelectField label="Source" value={form.source} onChange={(event) => setForm({ ...form, source: event.target.value as LeadInput["source"] })}>
            {leadSources.map((source) => (
              <option key={source}>{source}</option>
            ))}
          </SelectField>
        </div>

        {error ? <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-coral dark:bg-red-950/30">{error}</p> : null}

        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={save} disabled={isSaving}>
            {isSaving ? "Saving" : "Save lead"}
          </Button>
        </div>
      </div>
    </div>
  );
};

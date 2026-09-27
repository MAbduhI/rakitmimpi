"use client";

import React, { useState, useMemo, type HTMLAttributes } from "react";
import CustomSelect from "../../Molecule/custom-select/custom-select";
import { cn } from "../../../utils/cn";
import {
  IconSearch,
  IconPlus,
  IconPin,
  IconPinFilled,
  IconTrash,
  IconX,
  IconFiles,
  IconStar,
  IconBriefcase,
  IconUsers,
  IconUser,
  IconArchive,
  IconNotes,
} from "@tabler/icons-react";

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  category: "WORK" | "ONE_ON_ONE" | "IMPORTANT" | "PERSONAL" | "ARCHIVE";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  isPinned?: boolean;
  date: string;
  authorName?: string;
  authorAvatar?: string;
  tags?: string[];
}

export interface NotesWorkspaceProps extends HTMLAttributes<HTMLDivElement> {
  notes?: NoteItem[];
  onAddNote?: (note: Omit<NoteItem, "id" | "date">) => void;
  onDeleteNote?: (id: string) => void;
  onTogglePin?: (id: string) => void;
}

const CATEGORIES: { key: string; label: string; icon: any }[] = [
  { key: "ALL", label: "Semua Catatan", icon: IconFiles },
  { key: "IMPORTANT", label: "Penting", icon: IconStar },
  { key: "WORK", label: "Pekerjaan & Proyek", icon: IconBriefcase },
  { key: "ONE_ON_ONE", label: "Sesi 1-on-1", icon: IconUsers },
  { key: "PERSONAL", label: "Pribadi", icon: IconUser },
  { key: "ARCHIVE", label: "Arsip", icon: IconArchive },
];

const PRIORITY_BADGES: Record<string, { bg: string; text: string; border: string }> = {
  LOW: { bg: "bg-slate-100 dark:bg-white/5", text: "text-slate-600 dark:text-slate-400", border: "border-slate-200 dark:border-white/10" },
  MEDIUM: { bg: "bg-blue-50 dark:bg-blue-500/10", text: "text-blue-700 dark:text-blue-400", border: "border-blue-200 dark:border-blue-500/20" },
  HIGH: { bg: "bg-amber-50 dark:bg-amber-500/10", text: "text-amber-700 dark:text-amber-400", border: "border-amber-200 dark:border-amber-500/20" },
  URGENT: { bg: "bg-rose-50 dark:bg-rose-500/10", text: "text-rose-700 dark:text-rose-400", border: "border-rose-200 dark:border-rose-500/20" },
};

export function NotesWorkspace({
  notes: initialNotes = [],
  onAddNote,
  onDeleteNote,
  onTogglePin,
  className,
  ...props
}: NotesWorkspaceProps) {
  const [notes, setNotes] = useState<NoteItem[]>(initialNotes);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState<NoteItem["category"]>("WORK");
  const [newPriority, setNewPriority] = useState<NoteItem["priority"]>("MEDIUM");
  const [newTags, setNewTags] = useState("");

  const filteredNotes = useMemo(() => {
    return notes
      .filter((n) => {
        if (selectedCategory !== "ALL" && n.category !== selectedCategory) return false;
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.tags?.some((t) => t.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  }, [notes, selectedCategory, search]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: NoteItem = {
      id: "note_" + Date.now(),
      title: newTitle,
      content: newContent,
      category: newCategory,
      priority: newPriority,
      isPinned: false,
      date: new Date().toISOString().substring(0, 10),
      tags: newTags ? newTags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    };

    setNotes((prev) => [created, ...prev]);
    onAddNote?.(created);
    setIsModalOpen(false);
    setNewTitle("");
    setNewContent("");
    setNewTags("");
  };

  const handleToggle = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n))
    );
    onTogglePin?.(id);
  };

  const handleDelete = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    onDeleteNote?.(id);
  };

  return (
    <div className={cn("space-y-5", className)} {...props}>
      {/* Top Header & Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#111315] p-5 rounded-md border border-slate-200/80 dark:border-white/10 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <IconNotes size={20} stroke={1.75} className="text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Workspace Catatan & Agenda Kerja
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Kelola memo rapat, poin pembinaan 1-on-1, dan daftar agenda kerja terintegrasi.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative w-full sm:w-56">
            <input
              type="text"
              placeholder="Cari catatan atau tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs rounded-sm pl-8 pr-3 py-2 focus:outline-none focus:border-indigo-500"
            />
            <IconSearch size={15} stroke={1.75} className="absolute left-2.5 top-2.5 text-slate-400" />
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="py-2 px-3.5 rounded-sm bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <IconPlus size={15} stroke={2} />
            <span>Catatan Baru</span>
          </button>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.key;
          const IconComp = cat.icon;
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => setSelectedCategory(cat.key)}
              className={cn(
                "px-3 py-1.5 rounded-sm text-xs font-semibold whitespace-nowrap transition border flex items-center gap-1.5 cursor-pointer",
                isActive
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                  : "bg-white dark:bg-[#111315] text-slate-600 dark:text-slate-400 border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20"
              )}
            >
              <IconComp size={14} stroke={1.75} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 text-xs italic bg-white dark:bg-[#111315] rounded-md border border-slate-200/80 dark:border-white/10">
            Tidak ada catatan yang sesuai dengan filter atau kata kunci.
          </div>
        ) : (
          filteredNotes.map((note) => {
            const pStyle = PRIORITY_BADGES[note.priority] || PRIORITY_BADGES.MEDIUM || { bg: "", text: "", border: "" };
            return (
              <div
                key={note.id}
                className={cn(
                  "p-5 rounded-md border transition-all duration-150 flex flex-col justify-between space-y-3 shadow-xs relative group",
                  note.isPinned
                    ? "bg-indigo-50/30 dark:bg-indigo-500/[0.04] border-indigo-300/80 dark:border-indigo-500/30"
                    : "bg-white dark:bg-[#111315] border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20"
                )}
              >
                {/* Header Note */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        "text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm border",
                        pStyle.bg,
                        pStyle.text,
                        pStyle.border
                      )}
                    >
                      {note.priority}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleToggle(note.id)}
                        title={note.isPinned ? "Lepas Pin" : "Sematkan Catatan"}
                        className={cn(
                          "p-1 rounded-sm transition cursor-pointer",
                          note.isPinned
                            ? "text-amber-500 hover:text-amber-600"
                            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        )}
                      >
                        {note.isPinned ? <IconPinFilled size={15} /> : <IconPin size={15} stroke={1.75} />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(note.id)}
                        title="Hapus Catatan"
                        className="p-1 rounded-sm text-slate-400 hover:text-rose-500 transition cursor-pointer"
                      >
                        <IconTrash size={15} stroke={1.75} />
                      </button>
                    </div>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug line-clamp-1">
                    {note.title}
                  </h4>
                </div>

                {/* Content */}
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {note.content}
                </p>

                {/* Footer with Tags & Date */}
                <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{note.date}</span>
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {note.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-sm bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-white/5 font-medium text-[10px]"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Tambah Catatan Baru */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#111315] border border-slate-200 dark:border-white/10 rounded-md max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <IconNotes size={18} stroke={1.75} className="text-indigo-600" />
                <span>Buat Catatan Baru</span>
              </h4>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-sm text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <IconX size={16} stroke={1.75} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Judul Catatan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pembahasan Review Target Q3"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-sm bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Kategori</label>
                  <CustomSelect
                    value={newCategory}
                    onChange={(val: string) => setNewCategory(val as NoteItem["category"])}
                    options={[
                      { value: "WORK", label: "Pekerjaan & Proyek" },
                      { value: "ONE_ON_ONE", label: "Sesi 1-on-1" },
                      { value: "IMPORTANT", label: "Penting" },
                      { value: "PERSONAL", label: "Pribadi" },
                    ]}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Prioritas</label>
                  <CustomSelect
                    value={newPriority}
                    onChange={(val: string) => setNewPriority(val as NoteItem["priority"])}
                    options={[
                      { value: "LOW", label: "Low", badge: "Low" },
                      { value: "MEDIUM", label: "Medium", badge: "Medium" },
                      { value: "HIGH", label: "High", badge: "High" },
                      { value: "URGENT", label: "Urgent", badge: "Urgent" },
                    ]}
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Isi Catatan / Notula</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tuliskan catatan rinci, hasil rapat, atau tindak lanjut..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-sm bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">
                  Tag / Label (Pisahkan Koma)
                </label>
                <input
                  type="text"
                  placeholder="roadmap, qurban, finance"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full px-3 py-2 rounded-sm bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-sm bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition shadow-xs cursor-pointer"
                >
                  Simpan Catatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotesWorkspace;

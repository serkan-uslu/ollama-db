import Link from 'next/link';
import {
  MessageSquare,
  Code2,
  GitPullRequest,
  PenLine,
  Zap,
  ImageIcon,
  Calculator,
  HelpCircle,
  Database,
  Brain,
  Drama,
  Layers,
  FileText,
  Languages,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface UseCase {
  label: string;
  icon: LucideIcon;
  description: string;
  color: string;
}

const USE_CASES: UseCase[] = [
  {
    label: 'Chat Assistant',
    icon: MessageSquare,
    description: 'Conversational AI for support, productivity and Q&A',
    color: 'text-blue-500',
  },
  {
    label: 'Code Generation',
    icon: Code2,
    description: 'Generate, complete and explain code across languages',
    color: 'text-violet-500',
  },
  {
    label: 'Reasoning',
    icon: Brain,
    description: 'Step-by-step logical thinking and problem solving',
    color: 'text-orange-500',
  },
  {
    label: 'RAG / Retrieval',
    icon: Database,
    description: 'Ground responses in your own documents and data',
    color: 'text-teal-500',
  },
  {
    label: 'Code Review',
    icon: GitPullRequest,
    description: 'Identify bugs, suggest improvements, review diffs',
    color: 'text-green-500',
  },
  {
    label: 'Text Summarization',
    icon: FileText,
    description: 'Distil long documents into clear, concise summaries',
    color: 'text-amber-500',
  },
  {
    label: 'Image Understanding',
    icon: ImageIcon,
    description: 'Describe, analyse and reason about visual content',
    color: 'text-pink-500',
  },
  {
    label: 'Function Calling',
    icon: Zap,
    description: 'Structured tool use and API integration',
    color: 'text-yellow-500',
  },
  {
    label: 'Translation',
    icon: Languages,
    description: 'Translate text across 9+ supported languages',
    color: 'text-cyan-500',
  },
  {
    label: 'Creative Writing',
    icon: PenLine,
    description: 'Stories, scripts, marketing copy and creative content',
    color: 'text-rose-500',
  },
  {
    label: 'Math',
    icon: Calculator,
    description: 'Algebra, calculus, proofs and numerical reasoning',
    color: 'text-indigo-500',
  },
  {
    label: 'Question Answering',
    icon: HelpCircle,
    description: 'Factual answers from context or general knowledge',
    color: 'text-sky-500',
  },
  {
    label: 'Text Embedding',
    icon: Layers,
    description: 'Dense vector representations for search and clustering',
    color: 'text-slate-500',
  },
  {
    label: 'Role Play',
    icon: Drama,
    description: 'Character-driven conversations and interactive fiction',
    color: 'text-fuchsia-500',
  },
];

export function UseCaseShowcase() {
  return (
    <section className="border-t border-(--color-border)">
      <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-20 py-12">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-(--color-text-subtle)">
            Explore by Use Case
          </span>
          <span className="flex-1 h-px bg-(--color-border)" />
        </div>
        <p className="text-sm text-(--color-text-muted) mb-6">
          Find models pre-filtered for your specific task.
        </p>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {USE_CASES.map(({ label, icon: Icon, description, color }) => (
            <Link
              key={label}
              href={`/models?useCase=${encodeURIComponent(label)}`}
              className="group flex flex-col gap-2 p-4 rounded-xl border border-(--color-border) bg-(--color-bg) hover:border-(--color-border-strong) hover:shadow-sm transition-all"
            >
              <Icon size={20} className={`${color} shrink-0`} />
              <span className="text-sm font-medium text-(--color-text) leading-snug">{label}</span>
              <span className="text-xs text-(--color-text-subtle) leading-relaxed line-clamp-2">
                {description}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

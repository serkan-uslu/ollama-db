'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/atoms/Input';
import { cn } from '@/lib/utils/cn';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search models…',
  className,
}: SearchInputProps) {
  return (
    <div className={cn('relative flex items-center w-full', className)}>
      <Search
        size={16}
        className="absolute left-3 pointer-events-none text-[var(--color-text-subtle)]"
        aria-hidden
      />
      <Input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-9 [&::-webkit-search-cancel-button]:hidden"
        aria-label="Search models"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3 flex items-center justify-center text-[var(--color-text-subtle)] hover:text-[var(--color-text)] transition-colors min-h-[44px] min-w-[44px]"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

"use client";

import { X } from "lucide-react";
import { useState, useRef } from "react";

import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { CommandList, Command as CommandPrimitive } from "cmdk";

export type Option = {
  value: string;
  label: string;
};

interface MultiSelectProps {
  options: Option[];
  selected: Option[];
  onChange: (options: Option[]) => void;
  placeholder?: string;
  className?: string;
}

const MultiSelect = ({
  options,
  selected,
  onChange,
  placeholder = "Select options",
  className,
}: MultiSelectProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleUnselect = (option: Option) => {
    onChange(selected.filter((s) => s.value !== option.value));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current;
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "" && selected.length > 0) {
          onChange(selected.slice(0, -1));
        }
      }
      // This is needed to prevent the form from submitting when pressing Enter
      if (e.key === "Enter" && input.value !== "") {
        e.preventDefault();
      }
    }
  };

  const selectables = options.filter(
    (option) => !selected.some((s) => s.value === option.value),
  );

  return (
    <Command
      onKeyDown={handleKeyDown}
      className={`overflow-visible bg-transparent ${className}`}
    >
      <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1">
          {selected.map((option) => (
            <Badge key={option.value} variant="secondary">
              {option.label}
              <button
                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleUnselect(option);
                  }
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={() => handleUnselect(option)}
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          ))}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={selected.length === 0 ? placeholder : undefined}
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && selectables?.length > 0 && (
          <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="h-full overflow-auto">
              <CommandList>
                {selectables.map((option) => (
                  <CommandItem
                    key={option.value}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={() => {
                      setInputValue("");
                      onChange([...selected, option]);
                    }}
                    className={"cursor-pointer"}
                  >
                    {option.label}
                  </CommandItem>
                ))}
              </CommandList>
            </CommandGroup>
          </div>
        )}
      </div>
    </Command>
  );
};

export default MultiSelect;

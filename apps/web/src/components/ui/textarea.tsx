import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <div className="relative w-full group">
      <div className="absolute -inset-[1px] rounded-md bg-gradient-to-r from-green-500 to-emerald-600 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none" />
      <textarea
        data-slot="textarea"
        className={cn(
          "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-input w-full min-w-0 rounded-md border bg-background px-3 py-2 text-base shadow-xs transition-all outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm min-h-[80px]",
          "focus-visible:border-transparent",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive aria-invalid:focus-visible:border-destructive",
          "relative resize-y",
          className
        )}
        {...props}
      />
    </div>
  )
}

export { Textarea }


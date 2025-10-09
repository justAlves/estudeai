import * as React from "react"
import { EyeOffIcon, EyeIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

import { cn } from "@/lib/utils"

interface InputProps extends React.ComponentProps<"input"> {
  password?: boolean;
}

function Input({ className, type, password, ...props }: InputProps) {

  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="relative w-full group">
      <div className="absolute -inset-[1px] rounded-md bg-gradient-to-r from-green-500 to-emerald-600 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none" />
      <input
        type={password && showPassword ? "text" : type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-input h-9 w-full min-w-0 rounded-md border bg-background px-3 py-1 text-base shadow-xs transition-all outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-transparent",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive aria-invalid:focus-visible:border-destructive",
          "relative",
          className
        )}
        {...props}
      />
      {password && (
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-2 top-1/2 -translate-y-1/2"
        >
          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
        </Button>
      )}
    </div>
  )
}

export { Input }

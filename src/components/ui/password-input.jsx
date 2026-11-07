// Password field with a show/hide toggle and a Caps Lock hint. Takes the same
// props as <Input>; `type` is managed here.
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "cn";
import { Input } from "@/components/ui/input";

export function PasswordInput({ className, onKeyUp, onBlur, ...props }) {
  const [visible, setVisible] = useState(false);
  const [capsLock, setCapsLock] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative">
        <Input
          {...props}
          type={visible ? "text" : "password"}
          onKeyUp={(e) => {
            setCapsLock(e.getModifierState?.("CapsLock") ?? false);
            onKeyUp?.(e);
          }}
          onBlur={(e) => {
            setCapsLock(false);
            onBlur?.(e);
          }}
          className={cn("pr-10", className)}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          aria-controls={props.id}
          className="absolute inset-y-0 right-0 grid w-10 place-items-center rounded-r-lg text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          {visible ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
        </button>
      </div>
      {capsLock && <p role="status" className="text-xs text-amber-600 dark:text-amber-400">Caps Lock is on</p>}
    </div>
  );
}

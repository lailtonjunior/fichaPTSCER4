"use client"

import type { ReactNode } from "react"
import { useLayoutContext } from "@/components/layout-context"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface FormSectionWrapperProps {
  children: ReactNode
  title: string
  description?: string
  className?: string
  icon?: LucideIcon
}

export default function FormSectionWrapper({
  children,
  title,
  description,
  className,
  icon: Icon,
}: FormSectionWrapperProps) {
  const { layout } = useLayoutContext()

  return (
    <div
      className={cn(
        "space-y-6 pb-8 mb-8 border-b border-muted/30 last:border-0 last:mb-0 last:pb-0",
        layout === "compacto" && "space-y-4 pb-6 mb-6",
        layout === "simplificado" && "space-y-3 pb-4 mb-4",
        className,
      )}
    >
      <div
        className={cn(
          "space-y-2 bg-muted/10 p-4 rounded-md",
          layout === "compacto" && "space-y-1 p-3",
          layout === "simplificado" && "space-y-0.5 p-2",
        )}
      >
        <h2
          className={cn(
            "font-semibold uppercase flex items-center gap-2",
            layout === "detalhado" && "text-xl",
            layout === "compacto" && "text-lg",
            layout === "simplificado" && "text-base",
          )}
        >
          {Icon && <Icon className="h-5 w-5 text-primary flex-shrink-0" />}
          <span>{title}</span>
        </h2>
        {description && (
          <p
            className={cn(
              "text-muted-foreground",
              layout === "detalhado" && "text-base",
              layout === "compacto" && "text-sm",
              layout === "simplificado" && "text-xs",
            )}
          >
            {description}
          </p>
        )}
      </div>

      <div className={cn("grid gap-6", layout === "compacto" && "gap-4", layout === "simplificado" && "gap-3")}>
        {children}
      </div>
    </div>
  )
}

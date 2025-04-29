
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { CheckCircle, AlertTriangle, Info, X } from "lucide-react"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        let icon
        switch (variant) {
          case "destructive":
            icon = <AlertTriangle className="h-5 w-5 text-destructive" />
            break
          case "success":
            icon = <CheckCircle className="h-5 w-5 text-green-500" />
            break
          case "warning":
            icon = <AlertTriangle className="h-5 w-5 text-amber-500" />
            break
          case "info":
            icon = <Info className="h-5 w-5 text-blue-500" />
            break
          default:
            icon = <Info className="h-5 w-5 text-primary" />
        }

        return (
          <Toast key={id} {...props} className={`${props.className} font-poppins`}>
            <div className="flex gap-3">
              {icon}
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose>
              <X className="h-4 w-4" />
            </ToastClose>
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}

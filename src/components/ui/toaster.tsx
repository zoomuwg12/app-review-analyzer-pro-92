
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faXmark, faInfoCircle, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        let icon
        switch (variant) {
          case "destructive":
            icon = <FontAwesomeIcon icon={faExclamationTriangle} className="h-5 w-5 text-destructive" />
            break
          case "success":
            icon = <FontAwesomeIcon icon={faCheck} className="h-5 w-5 text-green-500" />
            break
          default:
            icon = <FontAwesomeIcon icon={faInfoCircle} className="h-5 w-5 text-primary" />
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
              <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
            </ToastClose>
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}

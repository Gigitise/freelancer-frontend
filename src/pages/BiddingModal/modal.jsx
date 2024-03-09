import { useContext } from "react";
import { ThemeContext } from "../../App";
import { cn } from "../../../utils/utilis";
import * as Dialog from "@radix-ui/react-dialog";

export default function Modal({
  children,
  className,
  showModal,
  setShowModal,
}) {

  const { theme } = useContext(ThemeContext);
  return (
    <Dialog.Root open={showModal} onOpenChange={setShowModal}>
      <Dialog.Portal>
        <Dialog.Overlay
          // for detecting when there's an active opened modal
          id="modal-backdrop"
          className={`animate-fade-in fixed inset-0 z-40  bg-gray-100 dark:bg-gray-700 bg-opacity-50 backdrop-blur-md ${theme === "light" ? "light-mode" : "dark"}`}
        />
        <Dialog.Content
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          className={cn(
            "animate-scale-in fixed inset-0 z-40 m-auto max-h-fit w-full max-w-md overflow-hidden border border-gray-200 bg-white dark:bg-gray-700  dark:border-gray-700 p-0 shadow-xl md:rounded-2xl",
            className,
          )}
        >
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useChatMessageContext } from "@/contexts/chat-message-context";
import moment from "moment";
import { BsXLg } from "react-icons/bs";
import { FaCircleNotch } from "react-icons/fa";
import { isVideoLinkValid } from "@/utils";

/** Одно открытое фото/видео — без карусели и свайпов по всей переписке */
export default function PopupGallery() {
  const { selectedMedia, clearSelectedMedia } = useChatMessageContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (selectedMedia) {
      setIsLoading(true);
    }
  }, [selectedMedia?.file_name, selectedMedia?.file_path]);

  if (!selectedMedia) {
    return null;
  }

  const src = `${selectedMedia.file_path}/${selectedMedia.file_name}`;
  const isVideo = isVideoLinkValid(selectedMedia.original_name);

  return (
    <Transition show={!!selectedMedia} as={Fragment} leave="duration-200">
      <Dialog
        as="div"
        id="modal"
        className="fixed inset-0 z-50 flex items-center overflow-hidden"
        onClose={clearSelectedMedia}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="absolute inset-0 bg-black/90" aria-hidden />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Panel className="relative z-30 flex h-[100dvh] min-h-0 w-screen max-w-[100vw] flex-col overflow-hidden">
            <div
              className="relative z-[200] flex w-full shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-black/40 px-4 pb-3 backdrop-blur-sm"
              style={{
                paddingTop: "max(0.75rem, env(safe-area-inset-top, 0px))",
                paddingLeft: "max(1rem, env(safe-area-inset-left, 0px))",
                paddingRight: "max(1rem, env(safe-area-inset-right, 0px))",
              }}
            >
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <div className="shrink-0">
                  <img
                    src={selectedMedia.sent_by.avatar}
                    alt={selectedMedia.sent_by.name}
                    className="h-10 w-10 rounded-full"
                  />
                </div>
                <div className="min-w-0 leading-4">
                  <h5 className="truncate font-medium text-gray-50">
                    {selectedMedia.sent_by.name}
                  </h5>
                  <span className="text-xs text-gray-400">
                    {moment(selectedMedia.created_at).format("DD/MM/YYYY H:mm")}
                  </span>
                </div>
              </div>
              <button
                type="button"
                aria-label="Закрыть"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-white/20 bg-black/50 text-xl text-gray-50 transition-colors hover:border-primary hover:text-primary focus-visible:outline focus-visible:ring-2 focus-visible:ring-primary"
                onClick={clearSelectedMedia}
              >
                <BsXLg className="h-6 w-6" />
              </button>
            </div>

            <div
              className="relative z-[50] flex min-h-0 flex-1 items-center justify-center overflow-auto px-2"
              style={{
                paddingBottom: "max(0.5rem, env(safe-area-inset-bottom, 0px))",
              }}
            >
              {isLoading && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <FaCircleNotch className="h-10 w-10 animate-spin text-white/80" />
                </div>
              )}
              {isVideo ? (
                <video
                  key={src}
                  src={src}
                  controls
                  playsInline
                  className="max-h-full w-full max-w-full object-contain"
                  onLoadedData={() => setIsLoading(false)}
                  onError={() => setIsLoading(false)}
                />
              ) : (
                <img
                  key={src}
                  src={src}
                  alt={selectedMedia.original_name}
                  className="max-h-full w-auto max-w-full object-contain"
                  onLoad={() => setIsLoading(false)}
                  onError={() => setIsLoading(false)}
                  draggable={false}
                />
              )}
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}

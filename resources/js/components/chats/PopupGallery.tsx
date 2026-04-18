import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useChatMessageContext } from "@/contexts/chat-message-context";
import moment from "moment";
import { BsXLg } from "react-icons/bs";
import { FaCircleNotch } from "react-icons/fa";
import ImageGallery from "react-image-gallery";
import ReactImageGallery from "react-image-gallery";
import { isVideoLinkValid } from "@/utils";

export default function PopupGallery() {
  const { media, selectedMedia, setSelectedMedia, clearSelectedMedia } =
    useChatMessageContext();

  const [isLoading, setIsLoading] = useState(true);
  const refGallery = useRef<ReactImageGallery>(null);

  useEffect(() => {
    if (refGallery.current) {
      const currentIndex = media.findIndex(
        (image) => image.file_name === selectedMedia?.file_name,
      );
      refGallery.current?.slideToIndex(currentIndex);
    }
  }, [selectedMedia]);

  if (!selectedMedia) return;

  const handleOnSlide = (currentIndex: number) => {
    setSelectedMedia(media[currentIndex]);
  };

  return (
    <Transition
      show={typeof selectedMedia !== undefined}
      as={Fragment}
      leave="duration-200"
    >
      <Dialog
        as="div"
        id="modal"
        className="fixed inset-0 z-50 flex transform items-center overflow-hidden transition-all"
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
          <div className="absolute inset-0 h-full w-full bg-black/90" />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enterTo="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 translate-y-0 sm:scale-100"
          leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <Dialog.Panel className="relative z-30 flex h-[100dvh] min-h-0 w-screen max-w-[100vw] transform flex-col overflow-hidden transition-all">
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

            <div className="relative z-[50] flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden">
            {isLoading && (
              <div className="image-gallery-loader-wrapper">
                <div className="image-gallery-loader-original m-auto">
                  <FaCircleNotch className="animate-spin" />
                </div>
                <div className="mx-auto mb-1 flex">
                  {media.map((_, index) => (
                    <div
                      key={index}
                      className="image-gallery-thumbnail image-gallery-loader-thumbnail"
                    >
                      <FaCircleNotch className="animate-spin" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <ImageGallery
              ref={refGallery}
              showFullscreenButton={false}
              showPlayButton={false}
              infinite={false}
              additionalClass={
                isLoading
                  ? "hidden"
                  : "m-auto w-full lg:w-[80%] xl:w-[70%]"
              }
              items={media
                .sort((a, b) => a.created_at.localeCompare(b.created_at))
                .map((image) => {
                  const src = `${image.file_path}/${image.file_name}`;
                  const video = isVideoLinkValid(image.original_name);
                  return {
                    thumbnail: src,
                    original: src,
                    renderItem: () =>
                      video ? (
                        <video
                          src={src}
                          controls
                          playsInline
                          className="max-h-[85vh] max-w-full object-contain"
                          onLoadedData={() => setIsLoading(false)}
                        />
                      ) : (
                        <img
                          src={src}
                          alt={image.original_name}
                          className="max-h-[85vh] max-w-full object-contain"
                          onLoad={() => setIsLoading(false)}
                        />
                      ),
                  };
                })}
              onImageLoad={() => setIsLoading(false)}
              onErrorImageURL="The image could not be loaded"
              onSlide={handleOnSlide}
            />
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}

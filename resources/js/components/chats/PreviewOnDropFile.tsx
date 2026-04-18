import { BsFileEarmarkText, BsX, BsPlus, BsImage } from "react-icons/bs";
import { BiVideo } from "react-icons/bi";
import { Preview } from "./Content";
import { formatFileSize, isImageLinkValid } from "@/utils";
import clsx from "clsx";
import { useRef } from "react";

type PreviewOnDropFileProps = {
  onDrop: boolean;
  closeOnPreview: () => void;
  selectedPreview: Preview;
  setSelectedPreview: (value: Preview) => void;
  attachments: Preview[];
  setAttachments: (value: Preview[]) => void;
};

export default function PreviewOnDropFile({
  onDrop,
  closeOnPreview,
  selectedPreview,
  setSelectedPreview,
  attachments,
  setAttachments,
}: PreviewOnDropFileProps) {
  const addFileRef = useRef<HTMLInputElement>(null);

  const changeSelectedImage = (file: Preview) => {
    setSelectedPreview(file);
  };

  const removeAttachment = (file: Preview) => {
    setAttachments(attachments.filter((f) => f.preview !== file.preview));

    const removedIndex = attachments.findIndex(
      (f) => f.preview === file.preview,
    );

    if (removedIndex === 0) {
      setSelectedPreview(attachments[removedIndex + 1]);
    } else if (removedIndex > 0 && file.preview === selectedPreview.preview) {
      setSelectedPreview(attachments[removedIndex - 1]);
    }

    if (attachments.length - 1 === 0) closeOnPreview();
  };

  const handleAddMore = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const newFiles = Array.from(e.target.files).map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      }),
    ) as Preview[];

    setAttachments([...attachments, ...newFiles]);
  };

  const isVideo = (filename: string) => {
    return /\.(mp4|webm|mov|avi|mkv)$/i.test(filename);
  };

  const isImage = (filename: string) => {
    return isImageLinkValid(filename);
  };

  if (!onDrop) return null;

  return (
    <div className="relative flex h-full flex-1 flex-col overflow-hidden bg-background">
      <div className="flex flex-1 items-center justify-center overflow-hidden p-4">
        {isImage(selectedPreview.name) ? (
          <div className="relative flex h-full w-full items-center justify-center">
            <img
              src={selectedPreview.preview}
              alt={selectedPreview.name}
              className="max-h-full max-w-full rounded-lg object-contain shadow-lg"
            />
          </div>
        ) : isVideo(selectedPreview.name) ? (
          <div className="relative flex h-full w-full items-center justify-center">
            <video
              src={selectedPreview.preview}
              className="max-h-full max-w-full rounded-lg shadow-lg"
              controls
            />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-secondary/50 p-8">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-primary/10">
              <BsFileEarmarkText className="h-12 w-12 text-primary" />
            </div>
            <div className="text-center">
              <h5 className="max-w-[200px] truncate font-semibold">
                {selectedPreview.name}
              </h5>
              <span className="text-sm text-secondary-foreground">
                {formatFileSize(selectedPreview.size)}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-secondary/50 bg-background/80 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {attachments.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="group relative shrink-0"
            >
              <button
                className={clsx(
                  "relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl transition-all duration-200",
                  selectedPreview.preview === file.preview
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                    : "ring-1 ring-secondary hover:ring-primary/50",
                )}
                onClick={() => changeSelectedImage(file)}
              >
                {isImage(file.name) ? (
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="h-full w-full object-cover"
                  />
                ) : isVideo(file.name) ? (
                  <div className="flex h-full w-full items-center justify-center bg-secondary">
                    <BiVideo className="h-6 w-6 text-secondary-foreground" />
                  </div>
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-secondary">
                    <BsFileEarmarkText className="h-6 w-6 text-secondary-foreground" />
                  </div>
                )}
              </button>

              <button
                className="absolute -right-1 -top-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-danger text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100"
                onClick={() => removeAttachment(file)}
              >
                <BsX className="h-4 w-4" />
              </button>
            </div>
          ))}

          <button
            onClick={() => addFileRef.current?.click()}
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-secondary text-secondary-foreground transition-all hover:border-primary hover:text-primary"
          >
            <BsPlus className="h-7 w-7" />
          </button>

          <input
            ref={addFileRef}
            type="file"
            className="hidden"
            multiple
            onChange={handleAddMore}
          />
        </div>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-secondary-foreground">
            {attachments.length} файл(ов) •{" "}
            {formatFileSize(attachments.reduce((acc, f) => acc + f.size, 0))}
          </span>
        </div>
      </div>
    </div>
  );
}

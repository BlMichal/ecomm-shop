import WixImage from "@/components/WixImage";
import { cn } from "@/lib/utils";
import { products } from "@wix/stores";
import { PlayIcon } from "lucide-react";
import { useState } from "react";
import Zoom from 'react-medium-image-zoom'

interface IProductMedia {
  media: products.MediaItem[] | undefined;
}

export default function ProductMedia({ media }: IProductMedia) {
  const [selectedMedia, setSelectedMedia] = useState(media?.[0]);

  if (!media?.length) return null;

  // Rozlišit zda bude object mediaType video nebo image
  const selectedImage = selectedMedia?.image;
  const selectedVideo = selectedMedia?.video?.files?.[0];

  return (
    <div className="basis-2/5 md:sticky md:top-0 h-fit">
      <div className="aspect-square bg-secondary">
        {selectedImage?.url ? (
          <Zoom key={selectedImage.url}>
            <WixImage
              width={1000}
              height={1000}
              mediaIdentifier={selectedImage.url}
              alt={selectedImage.altText}
              className="sticky top-0"
            />            
          </Zoom>
        ) : selectedVideo?.url ? (
          <div className="flex size-full items-center bg-black">
            <video controls className="size-full">
              <source
                src={selectedVideo.url}
                type={`video/${selectedVideo.format}`}
              />
            </video>
          </div>
        ) : null}
      </div>
      {media.length > 1 && (
        <div className="flex flex-wrap gap-5">
          {media.map((mediaItem) => (
            <MediaPreview
              key={mediaItem._id}
              mediaItem={mediaItem}
              isSeleted={mediaItem._id === selectedMedia?._id}
              onSelect={() => setSelectedMedia(mediaItem)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface IMediaPreview {
  mediaItem: products.MediaItem;
  isSeleted: boolean;
  onSelect: () => void;
}

function MediaPreview({ mediaItem, isSeleted, onSelect }: IMediaPreview) {
  const imageUrl = mediaItem.image?.url;

  // Vyuzijeme id stillFrameMediaId a první části url, na sestavení linku, který není redukován na kvalitě.
  const stillFrameMediaId = mediaItem.video?.stillFrameMediaId;
  const thumbnailUrl = mediaItem.thumbnail?.url;
  const resolvedThumbnailUrl =
    stillFrameMediaId && thumbnailUrl
      ? thumbnailUrl.split(stillFrameMediaId)[0] + stillFrameMediaId
      : undefined;

  if (!imageUrl && !resolvedThumbnailUrl) return null;

  return (
    <div
      className={cn(
        "relative cursor-pointer bg-secondary mt-1",
        isSeleted && "outline outline-1 outline-secondary",
      )}
    >
      <WixImage
        mediaIdentifier={imageUrl || resolvedThumbnailUrl}
        alt={mediaItem.image?.altText || mediaItem.video?.files?.[0].altText}
        width={100}
        height={100}
        onMouseEnter={onSelect}
      />
      {resolvedThumbnailUrl && <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/40 rounded-full flex items-center justify-center size-10">
        <PlayIcon className="size-6 text-white/70"/></span>}
    </div>
  );
}

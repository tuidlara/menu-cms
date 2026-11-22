import { useState } from "react"
import { ImageOff } from "lucide-react"

interface ProductImageProps {
  src: string | null
  alt?: string
}

export function ProductImage({ src, alt = "" }: ProductImageProps) {
  const [failed, setFailed] = useState(false)

  return (
    <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
      {src && !failed ? (
        <img src={src} alt={alt} className="size-full object-cover" loading="lazy" onError={() => setFailed(true)} />
      ) : (
        <ImageOff className="size-5 text-muted-foreground" aria-hidden="true" />
      )}
    </div>
  )
}

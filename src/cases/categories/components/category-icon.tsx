import { useState } from "react"
import { Tags } from "lucide-react"

export function CategoryIcon({ src }: { src: string | null }) {
  const [failed, setFailed] = useState(false)

  return (
    <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
      {src && !failed ? (
        <img src={src} alt="" className="size-8 object-contain" loading="lazy" onError={() => setFailed(true)} />
      ) : (
        <Tags className="size-5 text-muted-foreground" aria-hidden="true" />
      )}
    </div>
  )
}

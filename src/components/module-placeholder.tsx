import { Construction } from "lucide-react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ModulePlaceholderProps {
  title: string
  description: string
}

export function ModulePlaceholder({ title, description }: ModulePlaceholderProps) {
  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="max-w-2xl leading-relaxed text-muted-foreground">{description}</p>
      </div>
      <Card>
        <CardHeader>
          <Construction className="mb-2 size-6 text-primary" aria-hidden="true" />
          <CardTitle>Módulo em desenvolvimento</CardTitle>
          <CardDescription>
            A estrutura de navegação está pronta. As consultas e os formulários desta área serão implementados nas próximas etapas.
          </CardDescription>
        </CardHeader>
      </Card>
    </section>
  )
}

import { useState } from "react"
import { AlertCircle, Loader2, MapPin, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react"
import { useSpots } from "@/cases/spots/hooks/use-spots"
import type { SpotDTO } from "@/cases/spots/dtos/spot.dto"
import { SpotFormDialog } from "@/cases/spots/components/spot-form-dialog"
import { SpotDeleteDialog } from "@/cases/spots/components/spot-delete-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getApiErrorMessage } from "@/lib/api-error"

export function SpotPage() {
  const { data: spots, isPending, isError, isFetching, error, refetch } = useSpots()
  const [formOpen, setFormOpen] = useState(false)
  const [editingSpot, setEditingSpot] = useState<SpotDTO | null>(null)
  const [spotToDelete, setSpotToDelete] = useState<SpotDTO | null>(null)

  function openCreate() {
    setEditingSpot(null)
    setFormOpen(true)
  }

  function openEdit(spot: SpotDTO) {
    setEditingSpot(spot)
    setFormOpen(true)
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Mesas</h1>
          <p className="text-muted-foreground">Gerencie as mesas disponíveis no restaurante.</p>
        </div>
        <Button onClick={openCreate}><Plus aria-hidden="true" />Nova mesa</Button>
      </div>

      {isError && (
        <Alert variant="destructive">
          <AlertCircle aria-hidden="true" />
          <AlertTitle>{spots ? "Não foi possível atualizar a lista" : "Não foi possível carregar as mesas"}</AlertTitle>
          <AlertDescription className="space-y-3">
            <p>{getApiErrorMessage(error, "Ocorreu um erro ao buscar as mesas. Tente novamente.")}</p>
            {spots && <p>Os dados exibidos abaixo podem estar desatualizados.</p>}
            <Button variant="outline" size="sm" disabled={isFetching} onClick={() => void refetch()}>
              <RefreshCw className={isFetching ? "animate-spin" : ""} aria-hidden="true" />Tentar novamente
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {isPending && (
        <Card aria-busy="true" aria-label="Carregando mesas">
          <CardContent className="space-y-4">
            <p role="status" className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />Carregando mesas...
            </p>
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      )}

      {spots && spots.length === 0 && !isError && (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
            <MapPin className="size-9 text-muted-foreground" aria-hidden="true" />
            <h2 className="text-lg font-semibold">Nenhuma mesa cadastrada</h2>
            <p className="max-w-md text-muted-foreground">Cadastre a primeira mesa para organizar o atendimento do restaurante.</p>
            <Button onClick={openCreate}><Plus aria-hidden="true" />Cadastrar mesa</Button>
          </CardContent>
        </Card>
      )}

      {spots && spots.length > 0 && (
        <Card className="gap-0 overflow-hidden py-0">
          <div className="flex items-center justify-between gap-3 border-b px-6 py-4">
            <p className="text-sm text-muted-foreground">
              {spots.length} {spots.length === 1 ? "mesa cadastrada" : "mesas cadastradas"}
            </p>
            {isFetching && <p role="status" className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" aria-hidden="true" />Atualizando...</p>}
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Nome</TableHead>
                <TableHead>Situação</TableHead>
                <TableHead className="pr-6 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {spots.map((spot) => (
                <TableRow key={spot.id}>
                  <TableCell className="max-w-72 whitespace-normal break-words pl-6 font-medium">{spot.name}</TableCell>
                  <TableCell>
                    <Badge variant={spot.active ? "default" : "secondary"}
                      className={spot.active ? "bg-emerald-100 text-emerald-800" : ""}>
                      {spot.active ? "Ativa" : "Inativa"}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(spot)}
                        aria-label={`Editar mesa ${spot.name}`} title="Editar mesa">
                        <Pencil aria-hidden="true" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setSpotToDelete(spot)}
                        aria-label={`Excluir mesa ${spot.name}`} title="Excluir mesa">
                        <Trash2 aria-hidden="true" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {formOpen && <SpotFormDialog spot={editingSpot} onClose={() => setFormOpen(false)} />}
      {spotToDelete && <SpotDeleteDialog spot={spotToDelete} onClose={() => setSpotToDelete(null)} />}
    </section>
  )
}

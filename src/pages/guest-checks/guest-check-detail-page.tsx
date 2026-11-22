import { Link, useParams } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import { GuestCheckOrders } from "@/cases/orders/components/guest-check-orders"
import { AlertCircle, Loader2, RefreshCw } from "lucide-react"
import { useGuestCheck } from "@/cases/guest-checks/hooks/use-guest-checks"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getApiErrorMessage } from "@/lib/api-error"
import { formatCurrency, formatDateTime } from "@/lib/format"

export function GuestCheckDetailPage() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const { data: guestCheck, isPending, isError, isFetching, error, refetch } = useGuestCheck(id ?? "")

  function handleRefresh() {
    void refetch()
    void queryClient.invalidateQueries({ queryKey: ["orders", id] })
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Detalhes da comanda</h1>
          <p className="text-muted-foreground">Confira a mesa, o total acumulado e os pedidos recebidos.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" nativeButton={false} render={<Link to="/guest-checks" />}>
            Voltar às comandas
          </Button>
          <Button variant="outline" disabled={isFetching} onClick={handleRefresh}>
            <RefreshCw className={isFetching ? "animate-spin" : ""} aria-hidden="true" />
            {isFetching ? "Atualizando..." : "Atualizar"}
          </Button>
        </div>
      </div>

      {isError && (
        <Alert variant="destructive">
          <AlertCircle aria-hidden="true" />
          <AlertTitle>{guestCheck ? "Não foi possível atualizar a comanda" : "Não foi possível carregar a comanda"}</AlertTitle>
          <AlertDescription className="space-y-3">
            <p>{getApiErrorMessage(error, "Ocorreu um erro ao buscar os detalhes da comanda. Tente novamente.")}</p>
            {guestCheck && <p>Os dados exibidos abaixo podem estar desatualizados.</p>}
            <Button variant="outline" size="sm" disabled={isFetching} onClick={handleRefresh}>
              Tentar novamente
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {isPending && (
        <Card aria-busy="true" aria-label="Carregando detalhes da comanda">
          <CardContent className="space-y-4">
            <p role="status" className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />Carregando detalhes da comanda...
            </p>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-14 w-full" />
          </CardContent>
        </Card>
      )}

      {guestCheck && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Card>
              <CardContent>
                <dl className="space-y-2">
                  <dt className="text-sm text-muted-foreground">Mesa</dt>
                  <dd className="break-words text-lg font-semibold">{guestCheck.spot.name}</dd>
                </dl>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <dl className="space-y-2">
                  <dt className="text-sm text-muted-foreground">Aberta em</dt>
                  <dd className="font-medium">{formatDateTime(guestCheck.createdAt)}</dd>
                </dl>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <dl className="space-y-2">
                  <dt className="text-sm text-muted-foreground">Situação</dt>
                  <dd>
                    <Badge variant={guestCheck.status === "OPENED" ? "default" : "secondary"}
                      className={guestCheck.status === "OPENED" ? "bg-emerald-100 text-emerald-800" : ""}>
                      {guestCheck.status === "OPENED" ? "Aberta" : "Fechada"}
                    </Badge>
                  </dd>
                </dl>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <dl className="space-y-2">
                  <dt className="text-sm text-muted-foreground">Total acumulado</dt>
                  <dd className="text-xl font-semibold tabular-nums">{formatCurrency(guestCheck.total)}</dd>
                </dl>
              </CardContent>
            </Card>
          </div>

          <GuestCheckOrders guestCheckId={guestCheck.id} />
        </>
      )}
    </section>
  )
}

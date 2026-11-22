import { Link } from "react-router-dom"
import { AlertCircle, ClipboardList, Loader2, RefreshCw } from "lucide-react"
import { useOpenedGuestChecks } from "@/cases/guest-checks/hooks/use-guest-checks"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getApiErrorMessage } from "@/lib/api-error"
import { formatCurrency, formatDateTime } from "@/lib/format"

export function GuestCheckPage() {
  const { data: guestChecks, isPending, isError, isFetching, error, refetch } = useOpenedGuestChecks()

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Comandas em aberto</h1>
          <p className="text-muted-foreground">Acompanhe as mesas, os pedidos e o total acumulado de cada comanda.</p>
        </div>
        <Button variant="outline" disabled={isFetching} onClick={() => void refetch()}>
          <RefreshCw className={isFetching ? "animate-spin" : ""} aria-hidden="true" />
          {isFetching ? "Atualizando..." : "Atualizar"}
        </Button>
      </div>

      {isError && (
        <Alert variant="destructive">
          <AlertCircle aria-hidden="true" />
          <AlertTitle>{guestChecks ? "Não foi possível atualizar a lista" : "Não foi possível carregar as comandas"}</AlertTitle>
          <AlertDescription className="space-y-3">
            <p>{getApiErrorMessage(error, "Ocorreu um erro ao buscar as comandas. Tente novamente.")}</p>
            {guestChecks && <p>Os dados exibidos abaixo podem estar desatualizados.</p>}
            <Button variant="outline" size="sm" disabled={isFetching} onClick={() => void refetch()}>
              Tentar novamente
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {isPending && (
        <Card aria-busy="true" aria-label="Carregando comandas">
          <CardContent className="space-y-4">
            <p role="status" className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />Carregando comandas...
            </p>
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </CardContent>
        </Card>
      )}

      {guestChecks && guestChecks.length === 0 && !isError && (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
            <ClipboardList className="size-9 text-muted-foreground" aria-hidden="true" />
            <h2 className="text-lg font-semibold">Nenhuma comanda em aberto</h2>
            <p className="max-w-md text-muted-foreground">Uma comanda aparece aqui quando a mesa faz o primeiro pedido.</p>
          </CardContent>
        </Card>
      )}

      {guestChecks && guestChecks.length > 0 && (
        <Card className="gap-0 overflow-hidden py-0">
          <div className="border-b px-6 py-4">
            <p className="text-sm text-muted-foreground">
              {guestChecks.length} {guestChecks.length === 1 ? "comanda em aberto" : "comandas em aberto"}
            </p>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Mesa</TableHead>
                <TableHead>Aberta em</TableHead>
                <TableHead>Pedidos</TableHead>
                <TableHead>Total acumulado</TableHead>
                <TableHead className="pr-6 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guestChecks.map((guestCheck) => (
                <TableRow key={guestCheck.id}>
                  <TableCell className="max-w-64 whitespace-normal break-words pl-6 font-medium">{guestCheck.spot.name}</TableCell>
                  <TableCell>{formatDateTime(guestCheck.createdAt)}</TableCell>
                  <TableCell>{guestCheck.orders.length}</TableCell>
                  <TableCell className="tabular-nums">{formatCurrency(guestCheck.total)}</TableCell>
                  <TableCell className="pr-6 text-right">
                    <Button variant="outline" size="sm" nativeButton={false}
                      render={<Link to={`/guest-checks/${guestCheck.id}`} />}
                      aria-label={`Ver comanda da ${guestCheck.spot.name}`}>
                      Ver detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </section>
  )
}

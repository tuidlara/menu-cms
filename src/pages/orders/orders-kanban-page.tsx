import { RefreshCw } from "lucide-react"
import { OrderKanban } from "@/cases/orders/components/order-kanban"
import { useOrders } from "@/cases/orders/hooks/use-orders"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { getApiErrorMessage } from "@/lib/api-error"

export function OrdersKanbanPage() {
  const { data: orders, isPending, isError, isFetching, error, refetch } = useOrders()

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Kanban de pedidos</h1>
          <p className="text-muted-foreground">Arraste os cartões entre as colunas para alterar o status dos pedidos.</p>
        </div>
        <Button variant="outline" disabled={isFetching} onClick={() => void refetch()}>
          <RefreshCw className={isFetching ? "animate-spin" : ""} aria-hidden="true" />
          {isFetching ? "Atualizando..." : "Atualizar"}
        </Button>
      </div>

      {isPending && <p role="status" className="text-muted-foreground">Carregando pedidos...</p>}

      {isError && (
        <Alert variant="destructive">
          <AlertTitle>Não foi possível carregar os pedidos</AlertTitle>
          <AlertDescription className="space-y-3">
            <p>{getApiErrorMessage(error, "Ocorreu um erro ao buscar os pedidos. Tente novamente.")}</p>
            <Button variant="outline" size="sm" disabled={isFetching} onClick={() => void refetch()}>
              Tentar novamente
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {!isError && orders && <OrderKanban orders={orders} />}
    </section>
  )
}

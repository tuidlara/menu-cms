import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useOrders } from "../hooks/use-orders"
import { OrderCard } from "./order-card"
import { getApiErrorMessage } from "@/lib/api-error"

export function GuestCheckOrders({ guestCheckId }: { guestCheckId: string }) {
  const { data: orders, isPending, isError, isFetching, error, refetch } = useOrders(guestCheckId)

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Pedidos da comanda</h2>

      {isPending && <p role="status" className="text-muted-foreground">Carregando pedidos...</p>}
      {isFetching && !isPending && <p role="status" className="text-sm text-muted-foreground">Atualizando pedidos...</p>}

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

      {!isError && orders?.length === 0 && <p className="text-muted-foreground">Nenhum pedido nesta comanda.</p>}
      {!isError && orders?.map((order) => <OrderCard key={order.id} order={order} />)}
    </section>
  )
}

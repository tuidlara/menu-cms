import { useState, type DragEvent } from "react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDateTime } from "@/lib/format"
import { getApiErrorMessage } from "@/lib/api-error"
import { cn } from "@/lib/utils"
import type { OrderDTO, OrderStatus } from "../dtos/order.dto"
import { useUpdateOrderStatus } from "../hooks/use-orders"
import { ORDER_STATUSES, ORDER_STATUS_COLOR, ORDER_STATUS_LABEL } from "../order-status"

export function OrderKanban({ orders }: { orders: OrderDTO[] }) {
  const [overStatus, setOverStatus] = useState<OrderStatus | null>(null)
  const updateStatus = useUpdateOrderStatus()

  async function handleDrop(event: DragEvent<HTMLElement>, status: OrderStatus) {
    event.preventDefault()
    setOverStatus(null)
    if (updateStatus.isPending) return

    const id = event.dataTransfer.getData("text/plain")
    const order = orders.find((item) => item.id === id)
    if (!order || order.status === status) return

    try {
      await updateStatus.mutateAsync({ id, status })
      toast.success(`Pedido movido para "${ORDER_STATUS_LABEL[status]}".`)
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Não foi possível mover o pedido."))
    }
  }

  return (
    <div className="space-y-3" aria-busy={updateStatus.isPending}>
      {updateStatus.isPending && (
        <p role="status" className="text-sm text-muted-foreground">Salvando status do pedido...</p>
      )}
      <div className="overflow-x-auto pb-3">
        <div className="grid min-w-5xl grid-cols-4 gap-4">
          {ORDER_STATUSES.map((status) => {
            const column = orders.filter((order) => order.status === status)

            return (
              <section key={status} aria-label={ORDER_STATUS_LABEL[status]}
                className={cn(
                  "min-h-96 space-y-4 rounded-xl border bg-muted/40 p-3 transition-colors",
                  overStatus === status && "border-primary bg-accent",
                )}
                onDragOver={(event) => {
                  if (updateStatus.isPending) return
                  event.preventDefault()
                  event.dataTransfer.dropEffect = "move"
                  setOverStatus(status)
                }}
                onDragLeave={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOverStatus(null)
                }}
                onDrop={(event) => void handleDrop(event, status)}>
                <header className="flex items-center justify-between gap-2">
                  <h2 className="font-semibold">{ORDER_STATUS_LABEL[status]}</h2>
                  <Badge variant="outline" className={ORDER_STATUS_COLOR[status]}>{column.length}</Badge>
                </header>

                {column.map((order) => (
                  <Card key={order.id} draggable={!updateStatus.isPending}
                    aria-label={`Pedido ${order.id.slice(0, 8)} da ${order.guestCheck.spot.name}`}
                    className={cn(
                      updateStatus.isPending ? "cursor-wait" : "cursor-grab active:cursor-grabbing",
                      updateStatus.isPending && updateStatus.variables?.id === order.id && "opacity-60",
                    )}
                    onDragStart={(event) => {
                      event.dataTransfer.setData("text/plain", order.id)
                      event.dataTransfer.effectAllowed = "move"
                    }}
                    onDragEnd={() => setOverStatus(null)}>
                    <CardHeader>
                      <CardTitle className="break-words">{order.guestCheck.spot.name}</CardTitle>
                      <p className="text-sm text-muted-foreground" title={order.id}>Pedido #{order.id.slice(0, 8)}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-1 text-sm">
                        {order.items.map((item) => (
                          <li key={item.id} className="break-words">{item.quantity} × {item.product.name}</li>
                        ))}
                      </ul>
                      <p className="border-t pt-3 text-sm text-muted-foreground">{formatDateTime(order.createdAt)}</p>
                    </CardContent>
                  </Card>
                ))}

                {column.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">Nenhum pedido</p>}
              </section>
            )
          })}
        </div>
      </div>
    </div>
  )
}

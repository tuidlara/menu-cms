import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency, formatDateTime } from "@/lib/format"
import { getApiErrorMessage } from "@/lib/api-error"
import type { OrderDTO, OrderStatus } from "../dtos/order.dto"
import { useUpdateOrderStatus } from "../hooks/use-orders"
import { ORDER_STATUSES, ORDER_STATUS_LABEL } from "../order-status"
import { OrderStatusBadge } from "./order-status-badge"

const statusItems = ORDER_STATUSES.map((status) => ({
  value: status,
  label: ORDER_STATUS_LABEL[status],
}))

export function OrderCard({ order }: { order: OrderDTO }) {
  const updateStatus = useUpdateOrderStatus()

  async function handleStatusChange(status: OrderStatus | null) {
    if (!status || status === order.status || updateStatus.isPending) return

    try {
      await updateStatus.mutateAsync({ id: order.id, status })
      toast.success("Status do pedido atualizado.")
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Não foi possível alterar o status do pedido."))
    }
  }

  return (
    <Card className="gap-4">
      <CardHeader className="gap-4 sm:grid-cols-[1fr_auto]">
        <div className="space-y-2">
          <CardTitle><span title={order.id}>Pedido #{order.id.slice(0, 8)}</span></CardTitle>
          <p className="text-sm text-muted-foreground">{formatDateTime(order.createdAt)}</p>
          <OrderStatusBadge status={order.status} />
        </div>
        <div className="w-full space-y-2 sm:w-44">
          <Label htmlFor={`order-status-${order.id}`}>Alterar status</Label>
          <Select value={order.status} items={statusItems} disabled={updateStatus.isPending}
            onValueChange={(status) => void handleStatusChange(status)}>
            <SelectTrigger id={`order-status-${order.id}`} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {updateStatus.isPending && <p role="status" className="text-sm text-muted-foreground">Salvando...</p>}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {order.items.length === 0 ? (
          <p className="text-muted-foreground">Nenhum item neste pedido.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Preço unitário</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="max-w-64 whitespace-normal break-words">{item.product.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell className="tabular-nums">{formatCurrency(item.price)}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatCurrency(item.subtotal)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <p className="border-t pt-4 text-right font-semibold tabular-nums">Total do pedido: {formatCurrency(order.total)}</p>
      </CardContent>
    </Card>
  )
}

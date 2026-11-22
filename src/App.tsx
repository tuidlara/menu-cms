import { Navigate, Route, Routes } from "react-router-dom"
import { AppLayout } from "@/components/layout/app-layout"
import { CategoryPage } from "@/pages/categories/category-page"
import { ProductPage } from "@/pages/products/product-page"
import { SpotPage } from "@/pages/spots/spot-page"
import { GuestCheckPage } from "@/pages/guest-checks/guest-check-page"
import { GuestCheckDetailPage } from "@/pages/guest-checks/guest-check-detail-page"
import { OrdersKanbanPage } from "@/pages/orders/orders-kanban-page"
import { NotFoundPage } from "@/pages/not-found-page"

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/categories" replace />} />
        <Route path="categories" element={<CategoryPage />} />
        <Route path="products" element={<ProductPage />} />
        <Route path="spots" element={<SpotPage />} />
        <Route path="guest-checks" element={<GuestCheckPage />} />
        <Route path="guest-checks/:id" element={<GuestCheckDetailPage />} />
        <Route path="orders/kanban" element={<OrdersKanbanPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

import { ClipboardList, LayoutGrid, MapPin, Tags, UtensilsCrossed } from "lucide-react"
import { NavLink, Outlet } from "react-router-dom"
import { cn } from "@/lib/utils"

const navigation = [
  { to: "/categories", label: "Categorias", icon: Tags },
  { to: "/products", label: "Produtos", icon: LayoutGrid },
  { to: "/spots", label: "Mesas", icon: MapPin },
  { to: "/guest-checks", label: "Comandas", icon: ClipboardList },
]

export function AppLayout() {
  return (
    <div className="min-h-screen md:flex">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-background focus:p-3">
        Ir para o conteúdo
      </a>
      <aside className="border-b bg-card md:sticky md:top-0 md:flex md:h-screen md:w-64 md:shrink-0 md:flex-col md:border-r md:border-b-0">
        <div className="flex items-center gap-3 px-6 py-7">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <UtensilsCrossed className="size-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight">Menu CMS</p>
            <p className="text-sm text-muted-foreground">Painel administrativo</p>
          </div>
        </div>
        <nav aria-label="Navegação principal" className="grid grid-cols-2 gap-2 px-4 pb-4 sm:grid-cols-4 md:grid-cols-1">
          {navigation.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => cn(
                "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-5 shrink-0" aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
        <p className="mt-auto hidden border-t p-6 text-sm leading-relaxed text-muted-foreground md:block">
          Gestão do cardápio e da operação do restaurante.
        </p>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="border-b bg-card px-6 py-5 md:px-10">
          <p className="text-sm font-medium text-muted-foreground">Administração do restaurante</p>
        </header>
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-6xl px-6 py-8 outline-none md:px-10 md:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

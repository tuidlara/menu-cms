import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function NotFoundPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Página não encontrada</CardTitle>
        <CardDescription>O endereço informado não corresponde a uma página do painel.</CardDescription>
      </CardHeader>
      <CardContent>
        <Link to="/categories" className="font-medium text-primary underline underline-offset-4">
          Voltar para categorias
        </Link>
      </CardContent>
    </Card>
  )
}

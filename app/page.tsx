"use client"

import type React from "react"
import type { User, Ad } from "@/lib/storage" // Import User and Ad types
import { saveUser, setCurrentUser, getCurrentUser, getAds } from "@/lib/storage" // Import necessary functions

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AdBanner } from "@/components/ad-banner"
import { Wifi, Lock, Mail, UserIcon } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [loginAds, setLoginAds] = useState<Ad[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentAdIndex, setCurrentAdIndex] = useState(0)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      // Create user with proper ID and all required fields
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const newUser: User = {
        id: userId,
        name,
        email,
        authenticated: true,
        authenticatedAt: new Date().toISOString(),
        totalClicks: 0,
      }

      // Save user to localStorage
      saveUser(newUser)

      // Set as current user (pass only the ID)
      setCurrentUser(userId)

      setIsLoading(false)
      router.push("/dashboard")
    }, 1500)
  }

  useEffect(() => {
    const user = getCurrentUser()
    if (user?.authenticated) {
      router.push("/dashboard")
      return
    }

    const ads = getAds().filter((ad) => ad.active && (ad.position === "login" || ad.position === "both"))
    const shuffled = [...ads].sort(() => Math.random() - 0.5)
    setLoginAds(shuffled)

    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 2) % shuffled.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [router])

  const visibleAds = loginAds.slice(currentAdIndex, currentAdIndex + 2)
  if (visibleAds.length < 2 && loginAds.length > 0) {
    visibleAds.push(...loginAds.slice(0, 2 - visibleAds.length))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <Wifi className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl">WiFi Portal</h1>
              <p className="text-xs text-muted-foreground">Acceso Gratuito</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => router.push("/admin")}>
            Panel Admin
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Lock className="h-4 w-4" />
              Conexión Segura
            </div>
            <h2 className="text-4xl font-bold mb-4 text-balance">Conéctate a Internet Gratis</h2>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              Inicia sesión para acceder a WiFi de alta velocidad. Solo toma unos segundos.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card className="shadow-xl border-2">
                <CardHeader>
                  <CardTitle>Iniciar Sesión</CardTitle>
                  <CardDescription>Ingresa tus datos para conectarte</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre</Label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Tu nombre"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="tu@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                      {isLoading ? "Conectando..." : "Conectar a WiFi"}
                    </Button>
                    <p className="text-xs text-center text-muted-foreground text-pretty">
                      Al conectarte, aceptas nuestros términos de servicio
                    </p>
                  </form>
                </CardContent>
              </Card>

              <div className="mt-6 space-y-3">
                {[
                  { icon: "⚡", text: "Conexión de alta velocidad" },
                  { icon: "🔒", text: "Navegación segura" },
                  { icon: "🆓", text: "Completamente gratis" },
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <span className="text-2xl">{feature.icon}</span>
                    <span className="text-muted-foreground">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Ofertas Destacadas</h3>
                  <div className="flex gap-1">
                    {loginAds.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all ${
                          i === currentAdIndex || i === currentAdIndex + 1 ? "w-6 bg-primary" : "w-1.5 bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {visibleAds.map((ad) => (
                    <AdBanner key={ad.id} ad={ad} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

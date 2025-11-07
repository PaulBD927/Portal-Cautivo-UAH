"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AdBanner } from "@/components/ad-banner"
import { getAds, getCurrentUser, setCurrentUser, type Ad, type User } from "@/lib/storage"
import { Wifi, LogOut, TrendingUp, MousePointerClick, Clock } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [dashboardAds, setDashboardAds] = useState<Ad[]>([])
  const [popupAd, setPopupAd] = useState<Ad | null>(null)
  const [showPopup, setShowPopup] = useState(false)
  const [sessionTime, setSessionTime] = useState(0)
  const [currentAdIndex, setCurrentAdIndex] = useState(0)
  const [rotatedAds, setRotatedAds] = useState<Ad[]>([])

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser?.authenticated) {
      router.push("/")
      return
    }

    setUser(currentUser)

    const ads = getAds().filter((ad) => ad.active && (ad.position === "dashboard" || ad.position === "both"))
    const nonPopupAds = ads.filter((ad) => ad.type !== "popup")
    const shuffled = [...nonPopupAds].sort(() => Math.random() - 0.5)
    setDashboardAds(shuffled)
    setRotatedAds(shuffled)

    const rotationInterval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 3) % shuffled.length)
    }, 10000)

    const popupAds = ads.filter((ad) => ad.type === "popup")
    if (popupAds.length > 0) {
      setTimeout(() => {
        const randomPopup = popupAds[Math.floor(Math.random() * popupAds.length)]
        setPopupAd(randomPopup)
        setShowPopup(true)
      }, 3000)
    }

    return () => clearInterval(rotationInterval)
  }, [router])

  useEffect(() => {
    if (!user?.authenticatedAt) return

    const updateSessionTime = () => {
      const elapsed = Math.floor((Date.now() - new Date(user.authenticatedAt!).getTime()) / 1000)
      setSessionTime(elapsed)
    }

    updateSessionTime()

    const interval = setInterval(updateSessionTime, 1000)

    return () => clearInterval(interval)
  }, [user?.authenticatedAt])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleLogout = () => {
    setCurrentUser(null)
    router.push("/")
  }

  if (!user) return null

  const visibleAds = rotatedAds.slice(currentAdIndex, currentAdIndex + 3)
  if (visibleAds.length < 3 && rotatedAds.length > 0) {
    visibleAds.push(...rotatedAds.slice(0, 3 - visibleAds.length))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center">
              <Wifi className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl">Conectado</h1>
              <p className="text-xs text-muted-foreground">Bienvenido, {user.name}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Desconectar
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Estado</CardTitle>
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Wifi className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Conectado</div>
                <p className="text-xs text-muted-foreground mt-1">Velocidad: 100 Mbps</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Tiempo de Sesión</CardTitle>
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tabular-nums">{formatTime(sessionTime)}</div>
                <p className="text-xs text-muted-foreground mt-1">Sesión activa</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Clics en Anuncios</CardTitle>
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <MousePointerClick className="h-4 w-4 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user.totalClicks}</div>
                <p className="text-xs text-muted-foreground mt-1">Total de interacciones</p>
              </CardContent>
            </Card>
          </div>

          {/* Welcome Message */}
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <CardHeader>
              <CardTitle className="text-2xl">¡Estás Conectado!</CardTitle>
              <CardDescription className="text-white/90 text-pretty">
                Disfruta de navegación ilimitada. Explora las ofertas especiales a continuación.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Ads Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold">Ofertas Especiales para Ti</h2>
              </div>
              <div className="flex gap-1">
                {rotatedAds.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${
                      i >= currentAdIndex && i < currentAdIndex + 3 ? "w-6 bg-primary" : "w-1.5 bg-muted"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleAds.map((ad) => (
                <AdBanner key={ad.id} ad={ad} />
              ))}
            </div>
          </div>

          {/* Info Section */}
          <Card>
            <CardHeader>
              <CardTitle>Información de Conexión</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Conectado desde:</span>
                <span className="font-medium">
                  {user.authenticatedAt ? new Date(user.authenticatedAt).toLocaleString("es-ES") : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Red:</span>
                <span className="font-medium">WiFi Portal - Público</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Popup Ad */}
      {showPopup && popupAd && <AdBanner ad={popupAd} onClose={() => setShowPopup(false)} />}
    </div>
  )
}

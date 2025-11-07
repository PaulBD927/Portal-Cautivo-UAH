"use client"

import { useEffect, useState } from "react"
import { type Ad, recordAdClick, recordAdImpression, getCurrentUser } from "@/lib/storage"
import { getDolarRate, formatCurrency, convertToBolivares } from "@/lib/currency"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

interface AdBannerProps {
  ad: Ad
  onClose?: () => void
}

export function AdBanner({ ad, onClose }: AdBannerProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [dolarRate, setDolarRate] = useState<number>(227.5567)

  useEffect(() => {
    recordAdImpression(ad.id)
    getDolarRate().then(setDolarRate)
  }, [ad.id])

  const handleClick = () => {
    const user = getCurrentUser()
    if (user) {
      recordAdClick(ad.id, user.id, ad.costPerClick)
    }
    window.open(ad.targetUrl, "_blank")
  }

  if (!isVisible) return null

  const priceUSD = ad.costPerClick * 10 // Precio de ejemplo
  const priceVES = convertToBolivares(priceUSD, dolarRate)

  if (ad.type === "popup") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <Card className="relative max-w-lg w-full mx-4 p-6 animate-in fade-in zoom-in duration-300">
          <button
            onClick={() => {
              setIsVisible(false)
              onClose?.()
            }}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
          <div className="space-y-4">
            <img
              src={ad.imageUrl || "/placeholder.svg"}
              alt={ad.title}
              className="w-full h-48 object-cover rounded-lg"
            />
            <div>
              <h3 className="text-xl font-bold text-balance">{ad.title}</h3>
              <p className="text-muted-foreground mt-2 text-pretty">{ad.description}</p>
              <div className="mt-3 flex gap-2">
                <span className="text-lg font-bold text-primary">{formatCurrency(priceUSD, "USD")}</span>
                <span className="text-sm text-muted-foreground self-end">/ {formatCurrency(priceVES, "VES")}</span>
              </div>
            </div>
            <Button onClick={handleClick} className="w-full" size="lg">
              Ver Oferta <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (ad.type === "video") {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
        <div className="aspect-video bg-muted relative flex-shrink-0">
          <img src={ad.imageUrl || "/placeholder.svg"} alt={ad.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="font-bold text-lg text-balance">{ad.title}</h3>
            <p className="text-sm text-white/90 text-pretty">{ad.description}</p>
          </div>
        </div>
        <div className="p-4 flex flex-col gap-3 flex-grow">
          <div className="flex gap-2 items-baseline">
            <span className="text-xl font-bold text-primary">{formatCurrency(priceUSD, "USD")}</span>
            <span className="text-xs text-muted-foreground">{formatCurrency(priceVES, "VES")}</span>
          </div>
          <Button onClick={handleClick} className="w-full mt-auto">
            Ver Más <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] h-full flex flex-col"
      onClick={handleClick}
    >
      <div className="relative flex-grow">
        <img
          src={ad.imageUrl || "/placeholder.svg"}
          alt={ad.title}
          className="w-full h-full object-cover min-h-[240px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white space-y-2">
          <h3 className="font-bold text-lg text-balance">{ad.title}</h3>
          <p className="text-sm text-white/90 text-pretty">{ad.description}</p>
          <div className="flex gap-2 items-baseline pt-1">
            <span className="text-xl font-bold">{formatCurrency(priceUSD, "USD")}</span>
            <span className="text-xs text-white/80">{formatCurrency(priceVES, "VES")}</span>
          </div>
        </div>
        <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
          Anuncio
        </div>
      </div>
    </Card>
  )
}

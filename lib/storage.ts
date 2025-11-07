// Sistema de almacenamiento local para el portal cautivo

export interface User {
  id: string
  email: string
  name: string
  authenticated: boolean
  authenticatedAt?: string
  totalClicks: number
}

export interface Ad {
  id: string
  title: string
  description: string
  imageUrl: string
  videoUrl?: string
  targetUrl: string
  type: "banner" | "video" | "popup" | "image"
  position: "login" | "dashboard" | "both"
  clicks: number
  impressions: number
  costPerClick: number
  active: boolean
  createdAt: string
}

export interface AdClick {
  id: string
  adId: string
  userId: string
  timestamp: string
  cost: number
}

// Usuarios
export const getUsers = (): User[] => {
  if (typeof window === "undefined") return []
  const users = localStorage.getItem("captive_users")
  return users ? JSON.parse(users) : []
}

export const saveUser = (user: User) => {
  const users = getUsers()
  const index = users.findIndex((u) => u.id === user.id)
  if (index >= 0) {
    users[index] = user
  } else {
    users.push(user)
  }
  localStorage.setItem("captive_users", JSON.stringify(users))
}

export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null
  const userId = localStorage.getItem("current_user_id")
  if (!userId) return null
  const users = getUsers()
  return users.find((u) => u.id === userId) || null
}

export const setCurrentUser = (userId: string | null) => {
  if (userId) {
    localStorage.setItem("current_user_id", userId)
  } else {
    localStorage.removeItem("current_user_id")
  }
}

// Anuncios
export const getAds = (): Ad[] => {
  if (typeof window === "undefined") return []
  const ads = localStorage.getItem("captive_ads")
  return ads ? JSON.parse(ads) : getDefaultAds()
}

export const saveAd = (ad: Ad) => {
  const ads = getAds()
  const index = ads.findIndex((a) => a.id === ad.id)
  if (index >= 0) {
    ads[index] = ad
  } else {
    ads.push(ad)
  }
  localStorage.setItem("captive_ads", JSON.stringify(ads))
}

export const deleteAd = (adId: string) => {
  const ads = getAds().filter((a) => a.id !== adId)
  localStorage.setItem("captive_ads", JSON.stringify(ads))
}

// Clics en anuncios
export const getAdClicks = (): AdClick[] => {
  if (typeof window === "undefined") return []
  const clicks = localStorage.getItem("captive_ad_clicks")
  return clicks ? JSON.parse(clicks) : []
}

export const recordAdClick = (adId: string, userId: string, cost: number) => {
  const clicks = getAdClicks()
  const click: AdClick = {
    id: `click_${Date.now()}_${Math.random()}`,
    adId,
    userId,
    timestamp: new Date().toISOString(),
    cost,
  }
  clicks.push(click)
  localStorage.setItem("captive_ad_clicks", JSON.stringify(clicks))

  // Actualizar contador de clics del anuncio
  const ads = getAds()
  const ad = ads.find((a) => a.id === adId)
  if (ad) {
    ad.clicks++
    saveAd(ad)
  }

  // Actualizar contador de clics del usuario
  const user = getCurrentUser()
  if (user) {
    user.totalClicks++
    saveUser(user)
  }
}

export const recordAdImpression = (adId: string) => {
  const ads = getAds()
  const ad = ads.find((a) => a.id === adId)
  if (ad) {
    ad.impressions++
    saveAd(ad)
  }
}

// Datos por defecto
const getDefaultAds = (): Ad[] => {
  const defaultAds: Ad[] = [
    {
      id: "ad_1",
      title: "Descubre el Nuevo iPhone 15",
      description: "La mejor tecnología en tus manos. Cómpralo ahora con descuento.",
      imageUrl: "/modern-smartphone-advertisement.jpg",
      targetUrl: "https://example.com/iphone",
      type: "banner",
      position: "both",
      clicks: 0,
      impressions: 0,
      costPerClick: 0.5,
      active: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "ad_2",
      title: "Viaja por el Mundo",
      description: "Ofertas exclusivas en vuelos y hoteles. Reserva ahora.",
      imageUrl: "/travel-vacation-beach-paradise.jpg",
      targetUrl: "https://example.com/travel",
      type: "banner",
      position: "login",
      clicks: 0,
      impressions: 0,
      costPerClick: 0.75,
      active: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "ad_3",
      title: "Aprende Programación",
      description: "Cursos online con certificación. Empieza gratis hoy.",
      imageUrl: "/coding-programming-education.jpg",
      videoUrl: "https://example.com/video.mp4",
      targetUrl: "https://example.com/courses",
      type: "video",
      position: "dashboard",
      clicks: 0,
      impressions: 0,
      costPerClick: 1.0,
      active: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "ad_4",
      title: "Oferta Especial",
      description: "50% de descuento en tu primera compra. No te lo pierdas!",
      imageUrl: "/special-offer-discount-sale.png",
      targetUrl: "https://example.com/sale",
      type: "popup",
      position: "dashboard",
      clicks: 0,
      impressions: 0,
      costPerClick: 0.35,
      active: true,
      createdAt: new Date().toISOString(),
    },
  ]

  localStorage.setItem("captive_ads", JSON.stringify(defaultAds))
  return defaultAds
}

// Estadísticas
export const getStats = () => {
  const ads = getAds()
  const clicks = getAdClicks()
  const users = getUsers()

  const totalClicks = clicks.length
  const totalImpressions = ads.reduce((sum, ad) => sum + ad.impressions, 0)
  const totalRevenue = clicks.reduce((sum, click) => sum + click.cost, 0)
  const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0

  return {
    totalClicks,
    totalImpressions,
    totalRevenue,
    ctr,
    totalUsers: users.length,
    activeAds: ads.filter((a) => a.active).length,
  }
}

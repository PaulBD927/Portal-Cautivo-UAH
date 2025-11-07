// Utilidades para manejo de moneda y conversión de dólares

export interface DolarRate {
  fuente: string
  nombre: string
  compra: number | null
  venta: number | null
  promedio: number
  fechaActualizacion: string
}

let cachedRate: { rate: number; timestamp: number } | null = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

export const getDolarRate = async (): Promise<number> => {
  // Verificar si hay un valor en caché válido
  if (cachedRate && Date.now() - cachedRate.timestamp < CACHE_DURATION) {
    return cachedRate.rate
  }

  try {
    const response = await fetch("https://ve.dolarapi.com/v1/dolares/oficial")
    const data: DolarRate = await response.json()
    const rate = data.promedio

    // Guardar en caché
    cachedRate = { rate, timestamp: Date.now() }

    // También guardar en localStorage como respaldo
    if (typeof window !== "undefined") {
      localStorage.setItem("dolar_rate", JSON.stringify(cachedRate))
    }

    return rate
  } catch (error) {
    console.error("Error fetching dolar rate:", error)

    // Intentar usar el valor de localStorage como respaldo
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("dolar_rate")
      if (stored) {
        const parsed = JSON.parse(stored)
        return parsed.rate
      }
    }

    // Valor por defecto si todo falla
    return 227.5567
  }
}

export const formatCurrency = (amount: number, currency: "USD" | "VES" = "USD"): string => {
  if (currency === "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount)
  } else {
    return new Intl.NumberFormat("es-VE", {
      style: "currency",
      currency: "VES",
      minimumFractionDigits: 2,
    }).format(amount)
  }
}

export const convertToBolivares = (usdAmount: number, rate: number): number => {
  return usdAmount * rate
}

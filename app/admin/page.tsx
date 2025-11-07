"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAds, saveAd, deleteAd, getStats, type Ad } from "@/lib/storage"
import {
  Plus,
  Trash2,
  Edit,
  TrendingUp,
  MousePointerClick,
  Eye,
  DollarSign,
  Users,
  BarChart3,
  ArrowLeft,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"

export default function AdminPage() {
  const router = useRouter()
  const [ads, setAds] = useState<Ad[]>([])
  const [stats, setStats] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingAd, setEditingAd] = useState<Ad | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    videoUrl: "",
    targetUrl: "",
    type: "banner" as Ad["type"],
    position: "both" as Ad["position"],
    costPerClick: 0.5,
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setAds(getAds())
    setStats(getStats())
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const ad: Ad = {
      id: editingAd?.id || `ad_${Date.now()}`,
      ...formData,
      clicks: editingAd?.clicks || 0,
      impressions: editingAd?.impressions || 0,
      active: editingAd?.active ?? true,
      createdAt: editingAd?.createdAt || new Date().toISOString(),
    }

    saveAd(ad)
    resetForm()
    loadData()
  }

  const handleEdit = (ad: Ad) => {
    setEditingAd(ad)
    setFormData({
      title: ad.title,
      description: ad.description,
      imageUrl: ad.imageUrl,
      videoUrl: ad.videoUrl || "",
      targetUrl: ad.targetUrl,
      type: ad.type,
      position: ad.position,
      costPerClick: ad.costPerClick,
    })
    setShowForm(true)
  }

  const handleDelete = (adId: string) => {
    if (confirm("¿Estás seguro de eliminar este anuncio?")) {
      deleteAd(adId)
      loadData()
    }
  }

  const toggleAdStatus = (ad: Ad) => {
    saveAd({ ...ad, active: !ad.active })
    loadData()
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      videoUrl: "",
      targetUrl: "",
      type: "banner",
      position: "both",
      costPerClick: 0.5,
    })
    setEditingAd(null)
    setShowForm(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-600 to-blue-600 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl">Panel de Administración</h1>
              <p className="text-xs text-muted-foreground">Gestión de Anuncios PPC</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => router.push("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Portal
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Stats Overview */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats?.totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mt-1">Por clics en anuncios</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total de Clics</CardTitle>
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <MousePointerClick className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalClicks}</div>
                <p className="text-xs text-muted-foreground mt-1">Clics registrados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Impresiones</CardTitle>
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <Eye className="h-4 w-4 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalImpressions}</div>
                <p className="text-xs text-muted-foreground mt-1">Vistas totales</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">CTR Promedio</CardTitle>
                <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.ctr.toFixed(2)}%</div>
                <p className="text-xs text-muted-foreground mt-1">Click-through rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Additional Stats */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Usuarios Registrados</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalUsers}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Anuncios Activos</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.activeAds}</div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Gestión de Anuncios</h2>
            <Button onClick={() => setShowForm(!showForm)}>
              <Plus className="mr-2 h-4 w-4" />
              {showForm ? "Cancelar" : "Nuevo Anuncio"}
            </Button>
          </div>

          {/* Form */}
          {showForm && (
            <Card>
              <CardHeader>
                <CardTitle>{editingAd ? "Editar Anuncio" : "Crear Nuevo Anuncio"}</CardTitle>
                <CardDescription>Completa los datos del anuncio PPC</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Título</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="costPerClick">Coste por Clic ($)</Label>
                      <Input
                        id="costPerClick"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.costPerClick}
                        onChange={(e) => setFormData({ ...formData, costPerClick: Number.parseFloat(e.target.value) })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="imageUrl">URL de Imagen</Label>
                      <Input
                        id="imageUrl"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        placeholder="/regal-tabby.png"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="targetUrl">URL de Destino</Label>
                      <Input
                        id="targetUrl"
                        value={formData.targetUrl}
                        onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                        placeholder="https://example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Tipo de Anuncio</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value: Ad["type"]) => setFormData({ ...formData, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="banner">Banner</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="image">Imagen</SelectItem>
                          <SelectItem value="popup">Popup</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="position">Posición</Label>
                      <Select
                        value={formData.position}
                        onValueChange={(value: Ad["position"]) => setFormData({ ...formData, position: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="login">Solo Login</SelectItem>
                          <SelectItem value="dashboard">Solo Dashboard</SelectItem>
                          <SelectItem value="both">Ambos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="videoUrl">URL de Video (opcional)</Label>
                      <Input
                        id="videoUrl"
                        value={formData.videoUrl}
                        onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                        placeholder="https://example.com/video.mp4"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit">{editingAd ? "Actualizar" : "Crear"} Anuncio</Button>
                    {editingAd && (
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancelar
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Ads List */}
          <div className="space-y-4">
            {ads.map((ad) => (
              <Card key={ad.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={ad.imageUrl || "/placeholder.svg"}
                      alt={ad.title}
                      className="w-32 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-lg text-balance">{ad.title}</h3>
                          <p className="text-sm text-muted-foreground text-pretty">{ad.description}</p>
                          <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                            <span>Tipo: {ad.type}</span>
                            <span>Posición: {ad.position}</span>
                            <span>CPC: ${ad.costPerClick}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch checked={ad.active} onCheckedChange={() => toggleAdStatus(ad)} />
                          <Button variant="outline" size="sm" onClick={() => handleEdit(ad)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(ad.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex gap-6 mt-3 pt-3 border-t">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Clics:</span>
                          <span className="font-bold ml-2">{ad.clicks}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Impresiones:</span>
                          <span className="font-bold ml-2">{ad.impressions}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">CTR:</span>
                          <span className="font-bold ml-2">
                            {ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(2) : 0}%
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Ingresos:</span>
                          <span className="font-bold ml-2 text-green-600">
                            ${(ad.clicks * ad.costPerClick).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

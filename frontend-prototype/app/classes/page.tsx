import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  Search,
  Plus,
  Users,
  Calendar,
  Clock,
  BookOpen,
  ChevronDown,
  Filter,
  Edit,
  Trash2,
  Info,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function ClassesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto py-10 px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 border-purple-200 text-[#9c27b0] hover:bg-purple-50 hover:text-[#7b1fa2]"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">Visualisation des Classes</h1>
          </div>
          <div className="flex gap-3">
            <Button className="bg-[#9c27b0] hover:bg-[#7b1fa2]">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Classe
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-purple-100">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-gray-700">Rechercher</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Rechercher par niveau, jour ou enseignant..."
                  className="pl-9 border-purple-200 focus:ring-[#9c27b0] focus:border-[#9c27b0]"
                />
              </div>
            </div>

            <div className="w-full md:w-48 space-y-2">
              <label className="text-sm font-medium text-gray-700">Niveau</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between border-purple-200">
                    Tous les niveaux
                    <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Tous les niveaux</DropdownMenuItem>
                  <DropdownMenuItem>Maternelle 1</DropdownMenuItem>
                  <DropdownMenuItem>Maternelle 2</DropdownMenuItem>
                  <DropdownMenuItem>Primaire 1</DropdownMenuItem>
                  <DropdownMenuItem>Primaire 2</DropdownMenuItem>
                  <DropdownMenuItem>Primaire 3</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="w-full md:w-48 space-y-2">
              <label className="text-sm font-medium text-gray-700">Créneau</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between border-purple-200">
                    Tous les créneaux
                    <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Tous les créneaux</DropdownMenuItem>
                  <DropdownMenuItem>Matin (10h-13h)</DropdownMenuItem>
                  <DropdownMenuItem>Après-midi (14h-17h)</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Button className="bg-[#9c27b0] hover:bg-[#7b1fa2]">
              <Filter className="mr-2 h-4 w-4" />
              Filtrer
            </Button>
          </div>
        </div>

        <Tabs defaultValue="grid" className="mb-8">
          <TabsList className="mb-6 bg-purple-100 text-gray-700 rounded-full overflow-hidden">
            <TabsTrigger
              value="grid"
              className="rounded-full data-[state=active]:bg-[#9c27b0] data-[state=active]:text-white"
            >
              Vue Grille
            </TabsTrigger>
            <TabsTrigger
              value="capacity"
              className="rounded-full data-[state=active]:bg-[#9c27b0] data-[state=active]:text-white"
            >
              Capacité
            </TabsTrigger>
            <TabsTrigger
              value="schedule"
              className="rounded-full data-[state=active]:bg-[#9c27b0] data-[state=active]:text-white"
            >
              Planning
            </TabsTrigger>
          </TabsList>

          <TabsContent value="grid">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Maternelle 1 - Matin */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-purple-100 hover:shadow-lg transition-all duration-300 group">
                <div className="p-4 bg-[#4285f4] text-white flex justify-between items-center">
                  <h3 className="font-semibold">Maternelle 1</h3>
                  <Badge className="bg-white text-[#4285f4]">Matin (10h-13h)</Badge>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-[#4285f4]" />
                      <span className="text-gray-700 font-medium">Capacité: 15 élèves</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Places disponibles</Badge>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Occupation</span>
                      <span className="text-sm font-medium text-gray-800">12/15</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-[#4285f4] h-2.5 rounded-full" style={{ width: "80%" }}></div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Mercredi, Samedi, Dimanche</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">10h00-11h20, pause, 12h00-13h00</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Coran, Lecture, Écriture, Dua, Sira</span>
                    </div>
                  </div>

                  <div className="flex -space-x-2 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-[#e8f0fe] border-2 border-white flex items-center justify-center text-xs font-medium text-[#4285f4]"
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                    <div className="w-8 h-8 rounded-full bg-[#4285f4] border-2 border-white flex items-center justify-center text-xs font-medium text-white">
                      +7
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" size="sm" className="border-[#4285f4] text-[#4285f4] hover:bg-[#e8f0fe]">
                      <Info className="mr-2 h-4 w-4" />
                      Détails
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-gray-200">
                        <Edit className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-gray-200">
                        <Trash2 className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Maternelle 2 - Après-midi */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-purple-100 hover:shadow-lg transition-all duration-300 group">
                <div className="p-4 bg-[#fbbc05] text-white flex justify-between items-center">
                  <h3 className="font-semibold">Maternelle 2</h3>
                  <Badge className="bg-white text-[#fbbc05]">Après-midi (14h-17h)</Badge>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-[#fbbc05]" />
                      <span className="text-gray-700 font-medium">Capacité: 15 élèves</span>
                    </div>
                    <Badge className="bg-amber-100 text-amber-800">Presque complet</Badge>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Occupation</span>
                      <span className="text-sm font-medium text-gray-800">14/15</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-[#fbbc05] h-2.5 rounded-full" style={{ width: "93%" }}></div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Mercredi, Samedi, Dimanche</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">14h00-15h20, pause, 16h00-17h00</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Coran, Lecture, Écriture, Dua, Sira</span>
                    </div>
                  </div>

                  <div className="flex -space-x-2 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-[#fef7e0] border-2 border-white flex items-center justify-center text-xs font-medium text-[#fbbc05]"
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                    <div className="w-8 h-8 rounded-full bg-[#fbbc05] border-2 border-white flex items-center justify-center text-xs font-medium text-white">
                      +9
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" size="sm" className="border-[#fbbc05] text-[#fbbc05] hover:bg-[#fef7e0]">
                      <Info className="mr-2 h-4 w-4" />
                      Détails
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-gray-200">
                        <Edit className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-gray-200">
                        <Trash2 className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Primaire 1 - Matin */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-purple-100 hover:shadow-lg transition-all duration-300 group">
                <div className="p-4 bg-[#34a853] text-white flex justify-between items-center">
                  <h3 className="font-semibold">Primaire 1</h3>
                  <Badge className="bg-white text-[#34a853]">Matin (10h-13h)</Badge>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-[#34a853]" />
                      <span className="text-gray-700 font-medium">Capacité: 20 élèves</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Places disponibles</Badge>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Occupation</span>
                      <span className="text-sm font-medium text-gray-800">18/20</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-[#34a853] h-2.5 rounded-full" style={{ width: "90%" }}></div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Mercredi, Samedi, Dimanche</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">10h00-11h20, pause, 12h00-13h00</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Coran, Sira, Écriture, Lecture</span>
                    </div>
                  </div>

                  <div className="flex -space-x-2 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-[#e6f4ea] border-2 border-white flex items-center justify-center text-xs font-medium text-[#34a853]"
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                    <div className="w-8 h-8 rounded-full bg-[#34a853] border-2 border-white flex items-center justify-center text-xs font-medium text-white">
                      +13
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" size="sm" className="border-[#34a853] text-[#34a853] hover:bg-[#e6f4ea]">
                      <Info className="mr-2 h-4 w-4" />
                      Détails
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-gray-200">
                        <Edit className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-gray-200">
                        <Trash2 className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Primaire 2 - Après-midi */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-purple-100 hover:shadow-lg transition-all duration-300 group">
                <div className="p-4 bg-[#6c63ff] text-white flex justify-between items-center">
                  <h3 className="font-semibold">Primaire 2</h3>
                  <Badge className="bg-white text-[#6c63ff]">Après-midi (14h-17h)</Badge>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-[#6c63ff]" />
                      <span className="text-gray-700 font-medium">Capacité: 20 élèves</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Places disponibles</Badge>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Occupation</span>
                      <span className="text-sm font-medium text-gray-800">8/20</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-[#6c63ff] h-2.5 rounded-full" style={{ width: "40%" }}></div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Mercredi, Samedi, Dimanche</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">14h00-15h20, pause, 16h00-17h00</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Coran, Dua, Sira</span>
                    </div>
                  </div>

                  <div className="flex -space-x-2 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-[#f0eeff] border-2 border-white flex items-center justify-center text-xs font-medium text-[#6c63ff]"
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                    <div className="w-8 h-8 rounded-full bg-[#6c63ff] border-2 border-white flex items-center justify-center text-xs font-medium text-white">
                      +3
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" size="sm" className="border-[#6c63ff] text-[#6c63ff] hover:bg-[#f0eeff]">
                      <Info className="mr-2 h-4 w-4" />
                      Détails
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-gray-200">
                        <Edit className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-gray-200">
                        <Trash2 className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Primaire 3 - Après-midi */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-purple-100 hover:shadow-lg transition-all duration-300 group">
                <div className="p-4 bg-[#ea4335] text-white flex justify-between items-center">
                  <h3 className="font-semibold">Primaire 3</h3>
                  <Badge className="bg-white text-[#ea4335]">Après-midi (14h-17h)</Badge>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-[#ea4335]" />
                      <span className="text-gray-700 font-medium">Capacité: 15 élèves</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Places disponibles</Badge>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Occupation</span>
                      <span className="text-sm font-medium text-gray-800">5/15</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-[#ea4335] h-2.5 rounded-full" style={{ width: "33%" }}></div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Dimanche uniquement</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">14h00-15h20, pause, 16h00-17h00</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Coran avancé</span>
                    </div>
                  </div>

                  <div className="flex -space-x-2 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-[#fce8e6] border-2 border-white flex items-center justify-center text-xs font-medium text-[#ea4335]"
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" size="sm" className="border-[#ea4335] text-[#ea4335] hover:bg-[#fce8e6]">
                      <Info className="mr-2 h-4 w-4" />
                      Détails
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-gray-200">
                        <Edit className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-gray-200">
                        <Trash2 className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ajouter une classe */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-dashed border-purple-300 hover:shadow-lg transition-all duration-300 flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                    <Plus className="h-8 w-8 text-[#9c27b0]" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Ajouter une classe</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Créer une nouvelle classe pour un niveau et un créneau horaire
                  </p>
                  <Button className="bg-[#9c27b0] hover:bg-[#7b1fa2]">Nouvelle classe</Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="capacity">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-purple-100 mb-8">
              <div className="p-6 border-b border-purple-100">
                <h2 className="text-xl font-semibold text-gray-800">Capacité des classes</h2>
                <p className="text-gray-600">Vue d'ensemble de la capacité et du taux d'occupation des classes</p>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Classes du matin (10h-13h)</h3>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#4285f4]"></div>
                            <span className="text-gray-700">Maternelle 1</span>
                          </div>
                          <span className="text-gray-700 font-medium">12/15 élèves</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div className="bg-[#4285f4] h-3 rounded-full" style={{ width: "80%" }}></div>
                        </div>
                        <div className="flex justify-end mt-1">
                          <span className="text-xs text-green-600">3 places disponibles</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#34a853]"></div>
                            <span className="text-gray-700">Primaire 1</span>
                          </div>
                          <span className="text-gray-700 font-medium">18/20 élèves</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div className="bg-[#34a853] h-3 rounded-full" style={{ width: "90%" }}></div>
                        </div>
                        <div className="flex justify-end mt-1">
                          <span className="text-xs text-green-600">2 places disponibles</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Classes de l'après-midi (14h-17h)</h3>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#fbbc05]"></div>
                            <span className="text-gray-700">Maternelle 2</span>
                          </div>
                          <span className="text-gray-700 font-medium">14/15 élèves</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div className="bg-[#fbbc05] h-3 rounded-full" style={{ width: "93%" }}></div>
                        </div>
                        <div className="flex justify-end mt-1">
                          <span className="text-xs text-amber-600">1 place disponible</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#6c63ff]"></div>
                            <span className="text-gray-700">Primaire 2</span>
                          </div>
                          <span className="text-gray-700 font-medium">8/20 élèves</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div className="bg-[#6c63ff] h-3 rounded-full" style={{ width: "40%" }}></div>
                        </div>
                        <div className="flex justify-end mt-1">
                          <span className="text-xs text-green-600">12 places disponibles</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#ea4335]"></div>
                            <span className="text-gray-700">Primaire 3</span>
                          </div>
                          <span className="text-gray-700 font-medium">5/15 élèves</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div className="bg-[#ea4335] h-3 rounded-full" style={{ width: "33%" }}></div>
                        </div>
                        <div className="flex justify-end mt-1">
                          <span className="text-xs text-green-600">10 places disponibles</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Capacité totale</h3>
                  <div className="bg-purple-50 rounded-lg p-6 border border-purple-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-[#9c27b0] mb-2">85</div>
                        <div className="text-sm text-gray-600">Capacité totale</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-[#9c27b0] mb-2">57</div>
                        <div className="text-sm text-gray-600">Élèves inscrits</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-[#9c27b0] mb-2">28</div>
                        <div className="text-sm text-gray-600">Places disponibles</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="schedule">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-purple-100 mb-8">
              <div className="p-6 border-b border-purple-100">
                <h2 className="text-xl font-semibold text-gray-800">Planning des classes</h2>
                <p className="text-gray-600">Vue d'ensemble des classes par jour et créneau horaire</p>
              </div>

              <div className="p-6 overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr>
                      <th className="p-3 text-left text-sm font-medium text-gray-500 bg-gray-50">Horaire</th>
                      <th className="p-3 text-left text-sm font-medium text-gray-500 bg-gray-50">Mercredi</th>
                      <th className="p-3 text-left text-sm font-medium text-gray-500 bg-gray-50">Samedi</th>
                      <th className="p-3 text-left text-sm font-medium text-gray-500 bg-gray-50">Dimanche</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Matin */}
                    <tr>
                      <td className="p-3 border-t border-gray-200 text-sm font-medium text-gray-700">10h00 - 13h00</td>
                      {/* Mercredi */}
                      <td className="p-3 border-t border-gray-200">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#4285f4]"></div>
                            <span className="text-sm text-gray-700">Maternelle 1 (12/15)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#34a853]"></div>
                            <span className="text-sm text-gray-700">Primaire 1 (18/20)</span>
                          </div>
                        </div>
                      </td>
                      {/* Samedi */}
                      <td className="p-3 border-t border-gray-200">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#4285f4]"></div>
                            <span className="text-sm text-gray-700">Maternelle 1 (12/15)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#34a853]"></div>
                            <span className="text-sm text-gray-700">Primaire 1 (18/20)</span>
                          </div>
                        </div>
                      </td>
                      {/* Dimanche */}
                      <td className="p-3 border-t border-gray-200">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#4285f4]"></div>
                            <span className="text-sm text-gray-700">Maternelle 1 (12/15)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#34a853]"></div>
                            <span className="text-sm text-gray-700">Primaire 1 (18/20)</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                    {/* Après-midi */}
                    <tr>
                      <td className="p-3 border-t border-gray-200 text-sm font-medium text-gray-700">14h00 - 17h00</td>
                      {/* Mercredi */}
                      <td className="p-3 border-t border-gray-200">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#fbbc05]"></div>
                            <span className="text-sm text-gray-700">Maternelle 2 (14/15)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#6c63ff]"></div>
                            <span className="text-sm text-gray-700">Primaire 2 (8/20)</span>
                          </div>
                        </div>
                      </td>
                      {/* Samedi */}
                      <td className="p-3 border-t border-gray-200">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#fbbc05]"></div>
                            <span className="text-sm text-gray-700">Maternelle 2 (14/15)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#6c63ff]"></div>
                            <span className="text-sm text-gray-700">Primaire 2 (8/20)</span>
                          </div>
                        </div>
                      </td>
                      {/* Dimanche */}
                      <td className="p-3 border-t border-gray-200">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#fbbc05]"></div>
                            <span className="text-sm text-gray-700">Maternelle 2 (14/15)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#6c63ff]"></div>
                            <span className="text-sm text-gray-700">Primaire 2 (8/20)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#ea4335]"></div>
                            <span className="text-sm text-gray-700">Primaire 3 (5/15)</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}


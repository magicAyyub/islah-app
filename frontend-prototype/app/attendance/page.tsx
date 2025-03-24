import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  Check,
  X,
  ChevronDown,
  Calendar,
  Search,
  Clock,
  AlertCircle,
  CheckCircle,
  Users,
  Info,
  MessageSquare,
  FileText,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function AttendancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto py-10 px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 border-gray-200 text-[#6c63ff] hover:bg-[#f0eeff] hover:text-[#5a52e0]"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">Gestion des Présences</h1>
          </div>
          <div className="flex gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                  Primaire 1 - Matin
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Maternelle 1 - Matin</DropdownMenuItem>
                <DropdownMenuItem>Maternelle 1 - Après-midi</DropdownMenuItem>
                <DropdownMenuItem>Maternelle 2 - Matin</DropdownMenuItem>
                <DropdownMenuItem>Maternelle 2 - Après-midi</DropdownMenuItem>
                <DropdownMenuItem>Primaire 1 - Matin</DropdownMenuItem>
                <DropdownMenuItem>Primaire 1 - Après-midi</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button className="bg-[#6c63ff] hover:bg-[#5a52e0]">
              <Calendar className="mr-2 h-4 w-4" />
              Aujourd'hui
            </Button>
          </div>
        </div>

        <Tabs defaultValue="today" className="mb-8">
          <TabsList className="mb-6 bg-gray-100 text-gray-700 rounded-full overflow-hidden">
            <TabsTrigger
              value="today"
              className="rounded-full data-[state=active]:bg-[#6c63ff] data-[state=active]:text-white"
            >
              Aujourd'hui
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="rounded-full data-[state=active]:bg-[#6c63ff] data-[state=active]:text-white"
            >
              Historique
            </TabsTrigger>
            <TabsTrigger
              value="stats"
              className="rounded-full data-[state=active]:bg-[#6c63ff] data-[state=active]:text-white"
            >
              Statistiques
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 mb-8">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Présence du jour</h2>
                  <p className="text-gray-600">Lundi 16 Octobre 2023 - Primaire 1 (Matin)</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-600">16 présents</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-sm text-gray-600">2 absents</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      type="search"
                      placeholder="Rechercher un élève..."
                      className="pl-9 border-gray-200 focus:ring-[#6c63ff] focus:border-[#6c63ff]"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button className="bg-green-500 hover:bg-green-600">
                      <Check className="mr-2 h-4 w-4" />
                      Tous présents
                    </Button>
                    <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                      <Calendar className="mr-2 h-4 w-4" />
                      Changer de date
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Élève 1 - Présent */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden border-2 border-green-300 hover:shadow-md transition-all duration-300 group">
                    <div className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-sm font-bold text-green-600">
                          SD
                        </div>
                        <h3 className="font-semibold">Sarah Dupont</h3>
                      </div>
                      <Badge className="bg-white text-green-600">ID: 2023-001</Badge>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <div className="text-sm text-gray-600">Primaire 1 • Matin</div>
                        <Badge className="bg-green-100 text-green-800 border-0">Présente</Badge>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>Arrivée à 10:05</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-gray-200 text-gray-700 hover:bg-gray-50"
                          >
                            <Info className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-gray-200 text-gray-700 hover:bg-gray-50"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-10 w-10 p-0 bg-green-100 border-green-300 text-green-700 hover:bg-green-200"
                          >
                            <Check className="h-5 w-5" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-10 w-10 p-0 border-red-200 text-red-700 hover:bg-red-50"
                          >
                            <X className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Élève 2 - Absent */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden border-2 border-red-300 hover:shadow-md transition-all duration-300 group">
                    <div className="p-4 bg-gradient-to-r from-red-500 to-red-600 text-white flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-sm font-bold text-red-600">
                          KD
                        </div>
                        <h3 className="font-semibold">Karim Dubois</h3>
                      </div>
                      <Badge className="bg-white text-red-600">ID: 2023-004</Badge>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <div className="text-sm text-gray-600">Primaire 1 • Après-midi</div>
                        <Badge className="bg-red-100 text-red-800 border-0">Absent</Badge>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-red-600 mb-3">
                        <AlertCircle className="h-4 w-4" />
                        <span>Absence non justifiée</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-gray-200 text-gray-700 hover:bg-gray-50"
                          >
                            <Info className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-gray-200 text-gray-700 hover:bg-gray-50"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-10 w-10 p-0 border-green-200 text-green-700 hover:bg-green-50"
                          >
                            <Check className="h-5 w-5" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-10 w-10 p-0 bg-red-100 border-red-300 text-red-700 hover:bg-red-200"
                          >
                            <X className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Élève 3 - Présent */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden border-2 border-green-300 hover:shadow-md transition-all duration-300 group">
                    <div className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-sm font-bold text-green-600">
                          YB
                        </div>
                        <h3 className="font-semibold">Yasmine Benali</h3>
                      </div>
                      <Badge className="bg-white text-green-600">ID: 2023-003</Badge>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <div className="text-sm text-gray-600">Primaire 2 • Matin</div>
                        <Badge className="bg-green-100 text-green-800 border-0">Présente</Badge>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>Arrivée à 9:55</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-gray-200 text-gray-700 hover:bg-gray-50"
                          >
                            <Info className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-gray-200 text-gray-700 hover:bg-gray-50"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-10 w-10 p-0 bg-green-100 border-green-300 text-green-700 hover:bg-green-200"
                          >
                            <Check className="h-5 w-5" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-10 w-10 p-0 border-red-200 text-red-700 hover:bg-red-50"
                          >
                            <X className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Élève 4 - Non marqué */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden border-2 border-gray-200 hover:shadow-md transition-all duration-300 group">
                    <div className="p-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-sm font-bold text-gray-600">
                          LT
                        </div>
                        <h3 className="font-semibold">Leila Toumi</h3>
                      </div>
                      <Badge className="bg-white text-gray-600">ID: 2023-005</Badge>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <div className="text-sm text-gray-600">Maternelle 1 • Matin</div>
                        <Badge className="bg-gray-100 text-gray-800 border-0">Non marquée</Badge>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>En attente...</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-gray-200 text-gray-700 hover:bg-gray-50"
                          >
                            <Info className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-gray-200 text-gray-700 hover:bg-gray-50"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-10 w-10 p-0 border-green-200 text-green-700 hover:bg-green-50"
                          >
                            <Check className="h-5 w-5" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-10 w-10 p-0 border-red-200 text-red-700 hover:bg-red-50"
                          >
                            <X className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Élève 5 - Absent justifié */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden border-2 border-amber-300 hover:shadow-md transition-all duration-300 group">
                    <div className="p-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-sm font-bold text-amber-600">
                          AM
                        </div>
                        <h3 className="font-semibold">Adam Martin</h3>
                      </div>
                      <Badge className="bg-white text-amber-600">ID: 2023-002</Badge>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <div className="text-sm text-gray-600">Maternelle 2 • Après-midi</div>
                        <Badge className="bg-amber-100 text-amber-800 border-0">Absence justifiée</Badge>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-amber-600 mb-3">
                        <FileText className="h-4 w-4" />
                        <span>Certificat médical</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-gray-200 text-gray-700 hover:bg-gray-50"
                          >
                            <Info className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-gray-200 text-gray-700 hover:bg-gray-50"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-10 w-10 p-0 border-green-200 text-green-700 hover:bg-green-50"
                          >
                            <Check className="h-5 w-5" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-10 w-10 p-0 bg-amber-100 border-amber-300 text-amber-700 hover:bg-amber-200"
                          >
                            <X className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Élève 6 - Homonyme */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden border-2 border-gray-200 hover:shadow-md transition-all duration-300 group">
                    <div className="p-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-sm font-bold text-gray-600">
                          SD
                        </div>
                        <h3 className="font-semibold">Sofiane Dupont</h3>
                      </div>
                      <Badge className="bg-white text-gray-600">ID: 2023-012</Badge>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <div className="text-sm text-gray-600">Primaire 1 • Matin</div>
                        <Badge className="bg-gray-100 text-gray-800 border-0">Non marqué</Badge>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>En attente...</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-gray-200 text-gray-700 hover:bg-gray-50"
                          >
                            <Info className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-gray-200 text-gray-700 hover:bg-gray-50"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-10 w-10 p-0 border-green-200 text-green-700 hover:bg-green-50"
                          >
                            <Check className="h-5 w-5" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-10 w-10 p-0 border-red-200 text-red-700 hover:bg-red-50"
                          >
                            <X className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                    Justifier une absence
                  </Button>
                  <Button className="bg-[#6c63ff] hover:bg-[#5a52e0]">Enregistrer les présences</Button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Actions rapides</h2>
                <p className="text-gray-600">Gérez efficacement les présences et absences</p>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-[#f0eeff] flex items-center justify-center mb-4">
                    <AlertCircle className="h-6 w-6 text-[#6c63ff]" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Absences non justifiées</h3>
                  <p className="text-sm text-gray-600 mb-4">3 élèves ont des absences non justifiées cette semaine</p>
                  <Button className="w-full bg-[#6c63ff] hover:bg-[#5a52e0]">Envoyer des notifications</Button>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-[#e6f4ea] flex items-center justify-center mb-4">
                    <CheckCircle className="h-6 w-6 text-[#34a853]" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Rapport de présence</h3>
                  <p className="text-sm text-gray-600 mb-4">Générez un rapport de présence pour la semaine en cours</p>
                  <Button className="w-full bg-[#34a853] hover:bg-[#2d9649]">Générer un rapport</Button>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-[#fef7e0] flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-[#fbbc05]" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Élèves à surveiller</h3>
                  <p className="text-sm text-gray-600 mb-4">2 élèves ont plus de 3 absences ce mois-ci</p>
                  <Button className="w-full bg-[#fbbc05] hover:bg-[#f9ab00]">Voir les détails</Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 mb-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Historique des présences</h2>
                <p className="text-gray-600">Consultez l'historique des présences par jour ou par élève</p>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <div className="relative w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        type="search"
                        placeholder="Rechercher un élève..."
                        className="pl-9 border-gray-200 focus:ring-[#6c63ff] focus:border-[#6c63ff]"
                      />
                    </div>
                    <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                      Rechercher
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                      <Calendar className="mr-2 h-4 w-4" />
                      Filtrer par date
                    </Button>
                    <Button className="bg-[#6c63ff] hover:bg-[#5a52e0]">Exporter les données</Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Jour 1 */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-[#6c63ff]" />
                        <h3 className="font-medium text-gray-800">Lundi 16 Octobre 2023</h3>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className="bg-green-100 text-green-800 border-0">16 présents</Badge>
                        <Badge className="bg-red-100 text-red-800 border-0">2 absents</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-sm font-bold text-green-700 mr-2">
                          SD
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-800">Sarah Dupont</h4>
                          <div className="text-xs text-green-700">Présente à 10:05</div>
                        </div>
                      </div>

                      <div className="flex items-center p-3 bg-red-50 rounded-lg border border-red-200">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-sm font-bold text-red-700 mr-2">
                          KD
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-800">Karim Dubois</h4>
                          <div className="text-xs text-red-700">Absent</div>
                        </div>
                      </div>

                      <div className="flex items-center p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-sm font-bold text-amber-700 mr-2">
                          AM
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-800">Adam Martin</h4>
                          <div className="text-xs text-amber-700">Absence justifiée</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex justify-end">
                      <Button variant="outline" size="sm" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                        Voir tous les élèves
                      </Button>
                    </div>
                  </div>

                  {/* Jour 2 */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-[#6c63ff]" />
                        <h3 className="font-medium text-gray-800">Mardi 17 Octobre 2023</h3>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className="bg-green-100 text-green-800 border-0">17 présents</Badge>
                        <Badge className="bg-red-100 text-red-800 border-0">1 absent</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-sm font-bold text-green-700 mr-2">
                          SD
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-800">Sarah Dupont</h4>
                          <div className="text-xs text-green-700">Présente à 9:55</div>
                        </div>
                      </div>

                      <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-sm font-bold text-green-700 mr-2">
                          KD
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-800">Karim Dubois</h4>
                          <div className="text-xs text-green-700">Présent à 10:10</div>
                        </div>
                      </div>

                      <div className="flex items-center p-3 bg-red-50 rounded-lg border border-red-200">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-sm font-bold text-red-700 mr-2">
                          AM
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-800">Adam Martin</h4>
                          <div className="text-xs text-red-700">Absent</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex justify-end">
                      <Button variant="outline" size="sm" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                        Voir tous les élèves
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                    Charger plus d'historique
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="stats">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 mb-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Statistiques de présence</h2>
                <p className="text-gray-600">Analyse des tendances de présence par classe et par élève</p>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-[#34a853]" /> Taux de présence
                    </h3>
                    <div className="text-3xl font-bold text-gray-800 mb-2">89%</div>
                    <div className="text-sm text-gray-600">Moyenne sur le mois en cours</div>
                    <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-[#34a853] h-2.5 rounded-full" style={{ width: "89%" }}></div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-[#fbbc05]" /> Absences
                    </h3>
                    <div className="text-3xl font-bold text-gray-800 mb-2">42</div>
                    <div className="text-sm text-gray-600">Total des absences ce mois-ci</div>
                    <div className="mt-4 flex justify-between text-sm">
                      <span className="text-gray-600">Justifiées: 28</span>
                      <span className="text-gray-600">Non justifiées: 14</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center gap-2">
                      <Clock className="h-5 w-5 text-[#4285f4]" /> Ponctualité
                    </h3>
                    <div className="text-3xl font-bold text-gray-800 mb-2">95%</div>
                    <div className="text-sm text-gray-600">Des élèves arrivent à l'heure</div>
                    <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-[#4285f4] h-2.5 rounded-full" style={{ width: "95%" }}></div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Taux de présence par classe</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">Maternelle 1</span>
                          <span className="text-sm font-medium text-gray-800">92%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-[#4285f4] h-2.5 rounded-full" style={{ width: "92%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">Maternelle 2</span>
                          <span className="text-sm font-medium text-gray-800">88%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-[#fbbc05] h-2.5 rounded-full" style={{ width: "88%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">Primaire 1</span>
                          <span className="text-sm font-medium text-gray-800">90%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-[#34a853] h-2.5 rounded-full" style={{ width: "90%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">Primaire 2</span>
                          <span className="text-sm font-medium text-gray-800">85%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-[#6c63ff] h-2.5 rounded-full" style={{ width: "85%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Élèves avec le plus d'absences</h3>
                    <div className="space-y-3">
                      <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-sm font-bold text-red-700 mr-3">
                          KD
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">Karim Dubois</h4>
                          <div className="text-sm text-gray-600">Primaire 1 • 4 absences</div>
                        </div>
                        <Button size="sm" className="bg-[#6c63ff] hover:bg-[#5a52e0]">
                          Détails
                        </Button>
                      </div>

                      <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-sm font-bold text-red-700 mr-3">
                          AM
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">Adam Martin</h4>
                          <div className="text-sm text-gray-600">Maternelle 2 • 3 absences</div>
                        </div>
                        <Button size="sm" className="bg-[#6c63ff] hover:bg-[#5a52e0]">
                          Détails
                        </Button>
                      </div>

                      <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-sm font-bold text-red-700 mr-3">
                          LT
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">Leila Toumi</h4>
                          <div className="text-sm text-gray-600">Maternelle 1 • 2 absences</div>
                        </div>
                        <Button size="sm" className="bg-[#6c63ff] hover:bg-[#5a52e0]">
                          Détails
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button className="bg-[#6c63ff] hover:bg-[#5a52e0]">Générer un rapport complet</Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}


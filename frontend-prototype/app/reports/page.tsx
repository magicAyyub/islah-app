import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  FileText,
  Download,
  PlusCircle,
  Search,
  ChevronDown,
  Star,
  BarChart3,
  BookOpen,
  Calendar,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function ReportsPage() {
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
            <h1 className="text-3xl font-bold text-gray-800">Génération de Bulletins</h1>
          </div>
          <div className="flex gap-3">
            <Link href="/reports/new">
              <Button className="bg-[#6c63ff] hover:bg-[#5a52e0]">
                <PlusCircle className="mr-2 h-4 w-4" />
                Nouveau Bulletin
              </Button>
            </Link>
          </div>
        </div>

        {/* Section d'explication du processus */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Processus de génération des bulletins</h2>
            <p className="text-gray-600">
              Les bulletins sont générés automatiquement à partir des notes saisies par les enseignants pour chaque
              matière.
            </p>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                <span className="text-gray-800 font-bold">1</span>
              </div>
              <h3 className="font-medium text-gray-800 mb-1">Saisie des notes</h3>
              <p className="text-sm text-gray-600">Les enseignants saisissent les notes et appréciations</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                <span className="text-gray-800 font-bold">2</span>
              </div>
              <h3 className="font-medium text-gray-800 mb-1">Calcul des moyennes</h3>
              <p className="text-sm text-gray-600">Le système calcule les moyennes par matière et générale</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                <span className="text-gray-800 font-bold">3</span>
              </div>
              <h3 className="font-medium text-gray-800 mb-1">Validation</h3>
              <p className="text-sm text-gray-600">Le directeur valide les bulletins avant publication</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                <span className="text-gray-800 font-bold">4</span>
              </div>
              <h3 className="font-medium text-gray-800 mb-1">Publication</h3>
              <p className="text-sm text-gray-600">Les bulletins sont publiés et accessibles aux parents</p>
            </div>
          </div>
        </div>

        {/* Vue d'ensemble des bulletins */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">Bulletins publiés</h3>
              <div className="w-10 h-10 rounded-full bg-[#f0eeff] flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-[#6c63ff]" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800">42</div>
            <div className="text-sm text-gray-600 mt-1">Sur 45 élèves</div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">Bulletins en attente</h3>
              <div className="w-10 h-10 rounded-full bg-[#fff8e0] flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-[#fbbc05]" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800">3</div>
            <div className="text-sm text-gray-600 mt-1">À finaliser avant le 20/12</div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">Moyenne générale</h3>
              <div className="w-10 h-10 rounded-full bg-[#e6f4ea] flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-[#34a853]" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800">14,8/20</div>
            <div className="text-sm text-gray-600 mt-1">+0,5 par rapport au trimestre précédent</div>
          </div>
        </div>

        <Tabs defaultValue="trimester1" className="mb-8">
          <TabsList className="mb-6 bg-gray-100 text-gray-700">
            <TabsTrigger value="trimester1" className="data-[state=active]:bg-[#6c63ff] data-[state=active]:text-white">
              Trimestre 1
            </TabsTrigger>
            <TabsTrigger value="trimester2" className="data-[state=active]:bg-[#6c63ff] data-[state=active]:text-white">
              Trimestre 2
            </TabsTrigger>
            <TabsTrigger value="trimester3" className="data-[state=active]:bg-[#6c63ff] data-[state=active]:text-white">
              Trimestre 3
            </TabsTrigger>
            <TabsTrigger value="annual" className="data-[state=active]:bg-[#6c63ff] data-[state=active]:text-white">
              Annuel
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trimester1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 mb-8">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">Bulletins du Trimestre 1</h2>
                    <p className="text-gray-600">Année scolaire 2023-2024</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-[#e6f4ea] text-[#34a853] border-0">
                      <Calendar className="h-3 w-3 mr-1" /> 15/09 - 15/12
                    </Badge>
                    <Badge className="bg-[#f0eeff] text-[#6c63ff] border-0">
                      <CheckCircle className="h-3 w-3 mr-1" /> 42/45 publiés
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Rechercher un élève..."
                        className="pl-9 border-gray-200 focus:ring-[#6c63ff] focus:border-[#6c63ff] w-64"
                      />
                    </div>
                    <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                      Rechercher
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Filtrer par:</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                          Niveau
                          <ChevronDown className="ml-2 h-4 w-4" />
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

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                          Statut
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Tous les statuts</DropdownMenuItem>
                        <DropdownMenuItem>Publié</DropdownMenuItem>
                        <DropdownMenuItem>Brouillon</DropdownMenuItem>
                        <DropdownMenuItem>En attente</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Bulletin 1 */}
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all">
                    <div className="p-4 bg-[#6c63ff] text-white flex justify-between items-center rounded-t-lg">
                      <h3 className="font-medium">Sarah Dupont</h3>
                      <Badge className="bg-white text-[#6c63ff]">Primaire 1</Badge>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-[#f0eeff] flex items-center justify-center text-sm font-bold text-[#6c63ff]">
                            SD
                          </div>
                          <div>
                            <div className="text-sm text-gray-800 font-medium">Trimestre 1</div>
                            <div className="text-xs text-gray-600">2023-2024</div>
                          </div>
                        </div>
                        <Badge className="bg-[#e6f4ea] text-[#34a853] border-0">Publié</Badge>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">Français</span>
                            <span className="text-sm font-medium text-gray-800">16/20</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-[#6c63ff] h-2 rounded-full" style={{ width: "80%" }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">Mathématiques</span>
                            <span className="text-sm font-medium text-gray-800">15/20</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-[#6c63ff] h-2 rounded-full" style={{ width: "75%" }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">Sciences</span>
                            <span className="text-sm font-medium text-gray-800">17/20</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-[#6c63ff] h-2 rounded-full" style={{ width: "85%" }}></div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-[#fbbc05] fill-[#fbbc05]" />
                          <Star className="h-4 w-4 text-[#fbbc05] fill-[#fbbc05]" />
                          <Star className="h-4 w-4 text-[#fbbc05] fill-[#fbbc05]" />
                          <Star className="h-4 w-4 text-[#fbbc05] fill-[#fbbc05]" />
                          <Star className="h-4 w-4 text-gray-300" />
                        </div>
                        <div className="text-lg font-bold text-gray-800">16/20</div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                          <FileText className="h-4 w-4 mr-1" /> Voir
                        </Button>
                        <Button variant="outline" size="sm" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                          <Download className="h-4 w-4 mr-1" /> PDF
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Bulletin 2 */}
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all">
                    <div className="p-4 bg-[#fbbc05] text-white flex justify-between items-center rounded-t-lg">
                      <h3 className="font-medium">Adam Martin</h3>
                      <Badge className="bg-white text-[#fbbc05]">Maternelle 2</Badge>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-[#fef7e0] flex items-center justify-center text-sm font-bold text-[#fbbc05]">
                            AM
                          </div>
                          <div>
                            <div className="text-sm text-gray-800 font-medium">Trimestre 1</div>
                            <div className="text-xs text-gray-600">2023-2024</div>
                          </div>
                        </div>
                        <Badge className="bg-[#e6f4ea] text-[#34a853] border-0">Publié</Badge>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">Éveil</span>
                            <span className="text-sm font-medium text-gray-800">Très bien</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-[#fbbc05] h-2 rounded-full" style={{ width: "90%" }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">Motricité</span>
                            <span className="text-sm font-medium text-gray-800">Bien</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-[#fbbc05] h-2 rounded-full" style={{ width: "70%" }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">Socialisation</span>
                            <span className="text-sm font-medium text-gray-800">Excellent</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-[#fbbc05] h-2 rounded-full" style={{ width: "95%" }}></div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-[#fbbc05] fill-[#fbbc05]" />
                          <Star className="h-4 w-4 text-[#fbbc05] fill-[#fbbc05]" />
                          <Star className="h-4 w-4 text-[#fbbc05] fill-[#fbbc05]" />
                          <Star className="h-4 w-4 text-[#fbbc05] fill-[#fbbc05]" />
                          <Star className="h-4 w-4 text-[#fbbc05] fill-[#fbbc05]" />
                        </div>
                        <div className="text-lg font-bold text-gray-800">Excellent</div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                          <FileText className="h-4 w-4 mr-1" /> Voir
                        </Button>
                        <Button variant="outline" size="sm" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                          <Download className="h-4 w-4 mr-1" /> PDF
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Bulletin 3 */}
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all">
                    <div className="p-4 bg-[#ff63c4] text-white flex justify-between items-center rounded-t-lg">
                      <h3 className="font-medium">Yasmine Benali</h3>
                      <Badge className="bg-white text-[#ff63c4]">Primaire 2</Badge>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-[#fff0f9] flex items-center justify-center text-sm font-bold text-[#ff63c4]">
                            YB
                          </div>
                          <div>
                            <div className="text-sm text-gray-800 font-medium">Trimestre 1</div>
                            <div className="text-xs text-gray-600">2023-2024</div>
                          </div>
                        </div>
                        <Badge className="bg-[#fff8e0] text-[#fbbc05] border-0">Brouillon</Badge>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">Français</span>
                            <span className="text-sm font-medium text-gray-800">14/20</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-[#ff63c4] h-2 rounded-full" style={{ width: "70%" }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">Mathématiques</span>
                            <span className="text-sm font-medium text-gray-800">18/20</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-[#ff63c4] h-2 rounded-full" style={{ width: "90%" }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">Sciences</span>
                            <span className="text-sm font-medium text-gray-800">16/20</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-[#ff63c4] h-2 rounded-full" style={{ width: "80%" }}></div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-[#fbbc05] fill-[#fbbc05]" />
                          <Star className="h-4 w-4 text-[#fbbc05] fill-[#fbbc05]" />
                          <Star className="h-4 w-4 text-[#fbbc05] fill-[#fbbc05]" />
                          <Star className="h-4 w-4 text-[#fbbc05] fill-[#fbbc05]" />
                          <Star className="h-4 w-4 text-[#fbbc05] fill-[#fbbc05]" />
                        </div>
                        <div className="text-lg font-bold text-gray-800">16/20</div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                          <FileText className="h-4 w-4 mr-1" /> Voir
                        </Button>
                        <Button size="sm" className="bg-[#6c63ff] hover:bg-[#5a52e0]">
                          Modifier
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <div className="text-sm text-gray-600">Affichage de 1 à 3 sur 45 bulletins</div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled className="border-gray-200">
                      Précédent
                    </Button>
                    <Button variant="outline" size="sm" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                      Suivant
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="trimester2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 p-6 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-gray-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Trimestre 2 à venir</h3>
                <p className="text-sm text-gray-600 mb-4">Le trimestre 2 commencera le 15 décembre 2023</p>
                <Button className="bg-[#6c63ff] hover:bg-[#5a52e0]">Préparer les bulletins</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="trimester3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 p-6 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-gray-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Trimestre 3 à venir</h3>
                <p className="text-sm text-gray-600 mb-4">Le trimestre 3 commencera le 15 mars 2024</p>
                <Button disabled className="bg-gray-300 hover:bg-gray-300 cursor-not-allowed">
                  Préparer les bulletins
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="annual">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 p-6 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-gray-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Bulletins annuels</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Les bulletins annuels seront disponibles à la fin de l'année scolaire
                </p>
                <Button disabled className="bg-gray-300 hover:bg-gray-300 cursor-not-allowed">
                  Préparer les bulletins annuels
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}


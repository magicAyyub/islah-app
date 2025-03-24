import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Calendar, Clock, Plus, Search, ChevronDown, Edit, Trash2, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function SchedulesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto py-10 px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 border-gray-200 text-[#4285f4] hover:bg-[#e8f0fe] hover:text-[#4285f4]"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">Emplois du Temps</h1>
          </div>
          <div className="flex gap-3">
            <Button className="bg-[#4285f4] hover:bg-[#3b78e7]">
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Créneau
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-gray-700">Rechercher</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Rechercher par classe, niveau ou enseignant..."
                  className="pl-9 border-gray-200 focus:ring-[#4285f4] focus:border-[#4285f4]"
                />
              </div>
            </div>

            <div className="w-full md:w-48 space-y-2">
              <label className="text-sm font-medium text-gray-700">Niveau</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between border-gray-200">
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
              <label className="text-sm font-medium text-gray-700">Jour</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between border-gray-200">
                    Tous les jours
                    <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Tous les jours</DropdownMenuItem>
                  <DropdownMenuItem>Lundi</DropdownMenuItem>
                  <DropdownMenuItem>Mardi</DropdownMenuItem>
                  <DropdownMenuItem>Mercredi</DropdownMenuItem>
                  <DropdownMenuItem>Jeudi</DropdownMenuItem>
                  <DropdownMenuItem>Vendredi</DropdownMenuItem>
                  <DropdownMenuItem>Samedi</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Button className="bg-[#4285f4] hover:bg-[#3b78e7]">
              <Search className="mr-2 h-4 w-4" />
              Rechercher
            </Button>
          </div>
        </div>

        <Tabs defaultValue="weekly" className="mb-8">
          <TabsList className="mb-6 bg-gray-100 text-gray-700 rounded-full overflow-hidden">
            <TabsTrigger
              value="weekly"
              className="rounded-full data-[state=active]:bg-[#4285f4] data-[state=active]:text-white"
            >
              Vue Hebdomadaire
            </TabsTrigger>
            <TabsTrigger
              value="daily"
              className="rounded-full data-[state=active]:bg-[#4285f4] data-[state=active]:text-white"
            >
              Vue Journalière
            </TabsTrigger>
            <TabsTrigger
              value="classes"
              className="rounded-full data-[state=active]:bg-[#4285f4] data-[state=active]:text-white"
            >
              Par Classe
            </TabsTrigger>
          </TabsList>

          <TabsContent value="weekly">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 mb-8">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Emploi du temps hebdomadaire</h2>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="border-gray-200 text-gray-700">
                    <Calendar className="mr-2 h-4 w-4" />
                    Semaine du 16 au 22 Octobre
                  </Button>
                </div>
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
                      <td className="p-3 border-t border-gray-200 text-sm font-medium text-gray-700">
                        10h00 - 11h20
                        <br />
                        <span className="text-xs text-gray-500">Pause: 11h20 - 12h00</span>
                        <br />
                        12h00 - 13h00
                      </td>
                      {/* Mercredi */}
                      <td className="p-3 border-t border-gray-200">
                        <div className="bg-[#e8f0fe] p-2 rounded-lg border border-[#d2e3fc]">
                          <div className="font-medium text-[#4285f4]">Maternelle 1</div>
                          <div className="text-xs text-gray-600">Mme. Dupont</div>
                          <div className="text-xs text-gray-600">Coran, Lecture</div>
                          <div className="mt-1 flex items-center gap-1 text-xs text-gray-600">
                            <Users className="h-3 w-3" /> 12/15
                          </div>
                        </div>
                        <div className="bg-[#e6f4ea] p-2 rounded-lg border border-[#ceead6] mt-2">
                          <div className="font-medium text-[#34a853]">Primaire 1</div>
                          <div className="text-xs text-gray-600">M. Martin</div>
                          <div className="text-xs text-gray-600">Coran, Sira</div>
                          <div className="mt-1 flex items-center gap-1 text-xs text-gray-600">
                            <Users className="h-3 w-3" /> 18/20
                          </div>
                        </div>
                      </td>
                      {/* Samedi */}
                      <td className="p-3 border-t border-gray-200">
                        <div className="bg-[#e8f0fe] p-2 rounded-lg border border-[#d2e3fc]">
                          <div className="font-medium text-[#4285f4]">Maternelle 1</div>
                          <div className="text-xs text-gray-600">Mme. Dupont</div>
                          <div className="text-xs text-gray-600">Écriture, Dua</div>
                          <div className="mt-1 flex items-center gap-1 text-xs text-gray-600">
                            <Users className="h-3 w-3" /> 12/15
                          </div>
                        </div>
                        <div className="bg-[#e6f4ea] p-2 rounded-lg border border-[#ceead6] mt-2">
                          <div className="font-medium text-[#34a853]">Primaire 1</div>
                          <div className="text-xs text-gray-600">M. Martin</div>
                          <div className="text-xs text-gray-600">Coran, Écriture</div>
                          <div className="mt-1 flex items-center gap-1 text-xs text-gray-600">
                            <Users className="h-3 w-3" /> 18/20
                          </div>
                        </div>
                      </td>
                      {/* Dimanche */}
                      <td className="p-3 border-t border-gray-200">
                        <div className="bg-[#e8f0fe] p-2 rounded-lg border border-[#d2e3fc]">
                          <div className="font-medium text-[#4285f4]">Maternelle 1</div>
                          <div className="text-xs text-gray-600">Mme. Dupont</div>
                          <div className="text-xs text-gray-600">Coran, Sira</div>
                          <div className="mt-1 flex items-center gap-1 text-xs text-gray-600">
                            <Users className="h-3 w-3" /> 12/15
                          </div>
                        </div>
                        <div className="bg-[#e6f4ea] p-2 rounded-lg border border-[#ceead6] mt-2">
                          <div className="font-medium text-[#34a853]">Primaire 1</div>
                          <div className="text-xs text-gray-600">M. Martin</div>
                          <div className="text-xs text-gray-600">Lecture, Dua</div>
                          <div className="mt-1 flex items-center gap-1 text-xs text-gray-600">
                            <Users className="h-3 w-3" /> 18/20
                          </div>
                        </div>
                      </td>
                    </tr>
                    {/* Après-midi */}
                    <tr>
                      <td className="p-3 border-t border-gray-200 text-sm font-medium text-gray-700">
                        14h00 - 15h20
                        <br />
                        <span className="text-xs text-gray-500">Pause: 15h20 - 16h00</span>
                        <br />
                        16h00 - 17h00
                      </td>
                      {/* Mercredi */}
                      <td className="p-3 border-t border-gray-200">
                        <div className="bg-[#fef7e0] p-2 rounded-lg border border-[#feefc3]">
                          <div className="font-medium text-[#fbbc05]">Maternelle 2</div>
                          <div className="text-xs text-gray-600">Mme. Benali</div>
                          <div className="text-xs text-gray-600">Coran, Dua</div>
                          <div className="mt-1 flex items-center gap-1 text-xs text-gray-600">
                            <Users className="h-3 w-3" /> 14/15
                          </div>
                        </div>
                        <div className="bg-[#f0eeff] p-2 rounded-lg border border-[#e0ddff] mt-2">
                          <div className="font-medium text-[#6c63ff]">Primaire 2</div>
                          <div className="text-xs text-gray-600">M. Dubois</div>
                          <div className="text-xs text-gray-600">Coran, Sira</div>
                          <div className="mt-1 flex items-center gap-1 text-xs text-gray-600">
                            <Users className="h-3 w-3" /> 8/20
                          </div>
                        </div>
                      </td>
                      {/* Samedi */}
                      <td className="p-3 border-t border-gray-200">
                        <div className="bg-[#fef7e0] p-2 rounded-lg border border-[#feefc3]">
                          <div className="font-medium text-[#fbbc05]">Maternelle 2</div>
                          <div className="text-xs text-gray-600">Mme. Benali</div>
                          <div className="text-xs text-gray-600">Lecture, Écriture</div>
                          <div className="mt-1 flex items-center gap-1 text-xs text-gray-600">
                            <Users className="h-3 w-3" /> 14/15
                          </div>
                        </div>
                        <div className="bg-[#f0eeff] p-2 rounded-lg border border-[#e0ddff] mt-2">
                          <div className="font-medium text-[#6c63ff]">Primaire 2</div>
                          <div className="text-xs text-gray-600">M. Dubois</div>
                          <div className="text-xs text-gray-600">Coran, Dua</div>
                          <div className="mt-1 flex items-center gap-1 text-xs text-gray-600">
                            <Users className="h-3 w-3" /> 8/20
                          </div>
                        </div>
                      </td>
                      {/* Dimanche */}
                      <td className="p-3 border-t border-gray-200">
                        <div className="bg-[#fef7e0] p-2 rounded-lg border border-[#feefc3]">
                          <div className="font-medium text-[#fbbc05]">Maternelle 2</div>
                          <div className="text-xs text-gray-600">Mme. Benali</div>
                          <div className="text-xs text-gray-600">Coran, Sira</div>
                          <div className="mt-1 flex items-center gap-1 text-xs text-gray-600">
                            <Users className="h-3 w-3" /> 14/15
                          </div>
                        </div>
                        <div className="bg-[#f0eeff] p-2 rounded-lg border border-[#e0ddff] mt-2">
                          <div className="font-medium text-[#6c63ff]">Primaire 3</div>
                          <div className="text-xs text-gray-600">M. Toumi</div>
                          <div className="text-xs text-gray-600">Coran avancé</div>
                          <div className="mt-1 flex items-center gap-1 text-xs text-gray-600">
                            <Users className="h-3 w-3" /> 5/15
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="daily">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 mb-8">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Emploi du temps - Samedi 21 Octobre</h2>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="border-gray-200 text-gray-700">
                    <Calendar className="mr-2 h-4 w-4" />
                    Changer de jour
                  </Button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Matin */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-[#4285f4]" />
                        <h3 className="font-medium text-gray-800">Matin (10h00 - 13h00)</h3>
                      </div>
                      <Badge className="bg-[#e8f0fe] text-[#4285f4] border-0">2 classes</Badge>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-[#4285f4]">Maternelle 1</h4>
                            <div className="text-sm text-gray-600 mt-1">Enseignante: Mme. Dupont</div>
                            <div className="text-sm text-gray-600">Salle: A102</div>
                            <div className="text-sm text-gray-600 mt-1">Matières: Écriture, Dua</div>
                            <div className="text-sm text-gray-600 mt-1">Horaire: 10h00-11h20, pause, 12h00-13h00</div>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className="bg-[#e8f0fe] text-[#4285f4] border-0">
                                <Users className="h-3 w-3 mr-1" /> 12/15
                              </Badge>
                            </div>
                          </div>
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

                      <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-[#34a853]">Primaire 1</h4>
                            <div className="text-sm text-gray-600 mt-1">Enseignant: M. Martin</div>
                            <div className="text-sm text-gray-600">Salle: B201</div>
                            <div className="text-sm text-gray-600 mt-1">Matières: Coran, Écriture</div>
                            <div className="text-sm text-gray-600 mt-1">Horaire: 10h00-11h20, pause, 12h00-13h00</div>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className="bg-[#e6f4ea] text-[#34a853] border-0">
                                <Users className="h-3 w-3 mr-1" /> 18/20
                              </Badge>
                            </div>
                          </div>
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

                      <Button className="w-full bg-[#4285f4] hover:bg-[#3b78e7]">
                        <Plus className="mr-2 h-4 w-4" />
                        Ajouter une classe
                      </Button>
                    </div>
                  </div>

                  {/* Après-midi */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-[#fbbc05]" />
                        <h3 className="font-medium text-gray-800">Après-midi (14h00 - 17h00)</h3>
                      </div>
                      <Badge className="bg-[#fef7e0] text-[#fbbc05] border-0">2 classes</Badge>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-[#fbbc05]">Maternelle 2</h4>
                            <div className="text-sm text-gray-600 mt-1">Enseignante: Mme. Benali</div>
                            <div className="text-sm text-gray-600">Salle: A102</div>
                            <div className="text-sm text-gray-600 mt-1">Matières: Lecture, Écriture</div>
                            <div className="text-sm text-gray-600 mt-1">Horaire: 14h00-15h20, pause, 16h00-17h00</div>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className="bg-[#fef7e0] text-[#fbbc05] border-0">
                                <Users className="h-3 w-3 mr-1" /> 14/15
                              </Badge>
                            </div>
                          </div>
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

                      <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-[#6c63ff]">Primaire 2</h4>
                            <div className="text-sm text-gray-600 mt-1">Enseignant: M. Dubois</div>
                            <div className="text-sm text-gray-600">Salle: B201</div>
                            <div className="text-sm text-gray-600 mt-1">Matières: Coran, Dua</div>
                            <div className="text-sm text-gray-600 mt-1">Horaire: 14h00-15h20, pause, 16h00-17h00</div>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className="bg-[#f0eeff] text-[#6c63ff] border-0">
                                <Users className="h-3 w-3 mr-1" /> 8/20
                              </Badge>
                            </div>
                          </div>
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

                      <Button className="w-full bg-[#fbbc05] hover:bg-[#f9ab00]">
                        <Plus className="mr-2 h-4 w-4" />
                        Ajouter une classe
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="classes">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 mb-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Emploi du temps par classe</h2>
                <p className="text-gray-600">Sélectionnez une classe pour voir son emploi du temps</p>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Maternelle 1 */}
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all">
                    <div className="p-4 bg-[#4285f4] text-white flex justify-between items-center rounded-t-lg">
                      <h3 className="font-semibold">Maternelle 1</h3>
                      <Badge className="bg-white text-[#4285f4]">Matin</Badge>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">12 élèves inscrits</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">10h00 - 13h00</span>
                      </div>
                      <div className="flex items-center gap-2 mb-4">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Mercredi, Samedi, Dimanche</span>
                      </div>
                      <Button className="w-full bg-[#4285f4] hover:bg-[#3b78e7]">Voir l'emploi du temps</Button>
                    </div>
                  </div>

                  {/* Maternelle 2 */}
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all">
                    <div className="p-4 bg-[#fbbc05] text-white flex justify-between items-center rounded-t-lg">
                      <h3 className="font-semibold">Maternelle 2</h3>
                      <Badge className="bg-white text-[#fbbc05]">Après-midi</Badge>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">14 élèves inscrits</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">14h00 - 17h00</span>
                      </div>
                      <div className="flex items-center gap-2 mb-4">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Mercredi, Samedi, Dimanche</span>
                      </div>
                      <Button className="w-full bg-[#fbbc05] hover:bg-[#f9ab00]">Voir l'emploi du temps</Button>
                    </div>
                  </div>

                  {/* Primaire 1 */}
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all">
                    <div className="p-4 bg-[#34a853] text-white flex justify-between items-center rounded-t-lg">
                      <h3 className="font-semibold">Primaire 1</h3>
                      <Badge className="bg-white text-[#34a853]">Matin</Badge>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">18 élèves inscrits</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">10h00 - 13h00</span>
                      </div>
                      <div className="flex items-center gap-2 mb-4">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Mercredi, Samedi, Dimanche</span>
                      </div>
                      <Button className="w-full bg-[#34a853] hover:bg-[#2d9649]">Voir l'emploi du temps</Button>
                    </div>
                  </div>

                  {/* Primaire 2 */}
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all">
                    <div className="p-4 bg-[#6c63ff] text-white flex justify-between items-center rounded-t-lg">
                      <h3 className="font-semibold">Primaire 2</h3>
                      <Badge className="bg-white text-[#6c63ff]">Après-midi</Badge>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">8 élèves inscrits</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">14h00 - 17h00</span>
                      </div>
                      <div className="flex items-center gap-2 mb-4">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Mercredi, Samedi, Dimanche</span>
                      </div>
                      <Button className="w-full bg-[#6c63ff] hover:bg-[#5a52e0]">Voir l'emploi du temps</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}


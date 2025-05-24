"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  UserPlus,
  Search,
  ArrowLeft,
  Filter,
  Download,
  ChevronDown,
  FileText,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Tag,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  GraduationCap,
  Users,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function StudentsPage() {
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
            <h1 className="text-3xl font-bold text-gray-800">Gestion des Élèves</h1>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
            <Link href="/students/new">
              <Button className="bg-[#6c63ff] hover:bg-[#5a52e0]">
                <UserPlus className="mr-2 h-4 w-4" />
                Nouvelle Inscription
              </Button>
            </Link>
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
                  placeholder="Rechercher par nom, prénom ou ID..."
                  className="pl-9 border-gray-200 focus:ring-[#6c63ff] focus:border-[#6c63ff]"
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
              <label className="text-sm font-medium text-gray-700">Statut</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between border-gray-200">
                    Tous les statuts
                    <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Tous les statuts</DropdownMenuItem>
                  <DropdownMenuItem>Actif</DropdownMenuItem>
                  <DropdownMenuItem>Paiement en retard</DropdownMenuItem>
                  <DropdownMenuItem>Inactif</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Button className="bg-[#6c63ff] hover:bg-[#5a52e0]">
              <Filter className="mr-2 h-4 w-4" />
              Filtrer
            </Button>
          </div>
        </div>

        <Tabs defaultValue="list" className="mb-8">
          <TabsList className="mb-6 bg-gray-100 text-gray-700 rounded-full overflow-hidden">
            <TabsTrigger
              value="list"
              className="rounded-full data-[state=active]:bg-[#6c63ff] data-[state=active]:text-white"
            >
              Liste des élèves
            </TabsTrigger>
            <TabsTrigger
              value="cards"
              className="rounded-full data-[state=active]:bg-[#6c63ff] data-[state=active]:text-white"
            >
              Fiches élèves
            </TabsTrigger>
            <TabsTrigger
              value="stats"
              className="rounded-full data-[state=active]:bg-[#6c63ff] data-[state=active]:text-white"
            >
              Statistiques
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Élève</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Classe</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Contact</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Statut</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Dernière activité</th>
                      <th className="py-3 px-4 text-right text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {/* Élève 1 */}
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#e6f4ea] flex items-center justify-center text-sm font-bold text-[#34a853]">
                            SD
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">Sarah Dupont</div>
                            <div className="text-xs text-gray-500">ID: STD-2023-001</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-[#34a853]"></div>
                          <span className="text-sm text-gray-700">Primaire 1 • Matin</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-700">Parent: Marie Dupont</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Phone className="h-3 w-3" /> 06 XX XX XX XX
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-0">À jour</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-700">Présente le 15/10</div>
                        <div className="text-xs text-gray-500">Bulletin envoyé</div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-gray-200 text-gray-700 hover:bg-gray-50"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button size="sm" className="h-8 bg-[#6c63ff] hover:bg-[#5a52e0]">
                            Voir
                          </Button>
                        </div>
                      </td>
                    </tr>

                    {/* Élève 2 */}
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#fef7e0] flex items-center justify-center text-sm font-bold text-[#fbbc05]">
                            AM
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">Adam Martin</div>
                            <div className="text-xs text-gray-500">ID: STD-2023-002</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-[#fbbc05]"></div>
                          <span className="text-sm text-gray-700">Maternelle 2 • Après-midi</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-700">Parent: Thomas Martin</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Phone className="h-3 w-3" /> 06 XX XX XX XX
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-0">En retard</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-700">Absent le 15/10</div>
                        <div className="text-xs text-gray-500">Rappel envoyé</div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-gray-200 text-gray-700 hover:bg-gray-50"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button size="sm" className="h-8 bg-[#6c63ff] hover:bg-[#5a52e0]">
                            Voir
                          </Button>
                        </div>
                      </td>
                    </tr>

                    {/* Élève 3 */}
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#e6f4ea] flex items-center justify-center text-sm font-bold text-[#34a853]">
                            YB
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">Yasmine Benali</div>
                            <div className="text-xs text-gray-500">ID: STD-2023-003</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-[#34a853]"></div>
                          <span className="text-sm text-gray-700">Primaire 2 • Matin</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-700">Parent: Karim Benali</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Phone className="h-3 w-3" /> 06 XX XX XX XX
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-0">À jour</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-700">Présente le 15/10</div>
                        <div className="text-xs text-gray-500">Bulletin en cours</div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-gray-200 text-gray-700 hover:bg-gray-50"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button size="sm" className="h-8 bg-[#6c63ff] hover:bg-[#5a52e0]">
                            Voir
                          </Button>
                        </div>
                      </td>
                    </tr>

                    {/* Élève 4 */}
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#e6f4ea] flex items-center justify-center text-sm font-bold text-[#34a853]">
                            KD
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">Karim Dubois</div>
                            <div className="text-xs text-gray-500">ID: STD-2023-004</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-[#4285f4]"></div>
                          <span className="text-sm text-gray-700">Primaire 1 • Après-midi</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-700">Parent: Sophie Dubois</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Phone className="h-3 w-3" /> 06 XX XX XX XX
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-0">
                          Échéance proche
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-700">Présent le 15/10</div>
                        <div className="text-xs text-gray-500">Rappel paiement</div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-gray-200 text-gray-700 hover:bg-gray-50"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button size="sm" className="h-8 bg-[#6c63ff] hover:bg-[#5a52e0]">
                            Voir
                          </Button>
                        </div>
                      </td>
                    </tr>

                    {/* Élève 5 */}
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#fef7e0] flex items-center justify-center text-sm font-bold text-[#fbbc05]">
                            LT
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">Leila Toumi</div>
                            <div className="text-xs text-gray-500">ID: STD-2023-005</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-[#fbbc05]"></div>
                          <span className="text-sm text-gray-700">Maternelle 1 • Matin</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-700">Parent: Ahmed Toumi</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Phone className="h-3 w-3" /> 06 XX XX XX XX
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-0">À jour</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-700">Présente le 15/10</div>
                        <div className="text-xs text-gray-500">Bulletin envoyé</div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-gray-200 text-gray-700 hover:bg-gray-50"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button size="sm" className="h-8 bg-[#6c63ff] hover:bg-[#5a52e0]">
                            Voir
                          </Button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">Affichage de 1 à 5 sur 45 élèves</div>
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
          </TabsContent>

          <TabsContent value="cards">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Élève 1 */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300">
                <div className="p-4 bg-gradient-to-r from-[#34a853] to-[#2d9649] text-white flex justify-between items-center">
                  <h3 className="font-semibold">Sarah Dupont</h3>
                  <Badge className="bg-white text-[#34a853]">Primaire 1</Badge>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-[#e6f4ea] flex items-center justify-center text-xl font-bold text-[#34a853]">
                      SD
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">ID: STD-2023-001</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className="bg-green-100 text-green-800 border-0">À jour</Badge>
                        <Badge className="bg-[#e6f4ea] text-[#34a853] border-0">Matin</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Calendar className="h-4 w-4 text-[#34a853]" />
                      <span>8 ans (15/05/2015)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Users className="h-4 w-4 text-[#34a853]" />
                      <span>Parents: Marie et Jean Dupont</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Phone className="h-4 w-4 text-[#34a853]" />
                      <span>06 XX XX XX XX</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Mail className="h-4 w-4 text-[#34a853]" />
                      <span>marie.dupont@email.com</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <MapPin className="h-4 w-4 text-[#34a853]" />
                      <span>12 Rue des Lilas, 93100 Montreuil</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium text-gray-700">Progression</div>
                      <div className="text-sm font-medium text-[#34a853]">Excellent</div>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="h-4 w-4 text-[#fbbc05] fill-[#fbbc05]" />
                      <Star className="h-4 w-4 text-[#fbbc05] fill-[#fbbc05]" />
                      <Star className="h-4 w-4 text-[#fbbc05] fill-[#fbbc05]" />
                      <Star className="h-4 w-4 text-[#fbbc05] fill-[#fbbc05]" />
                      <Star className="h-4 w-4 text-[#fbbc05] fill-[#fbbc05]" />
                    </div>
                    <div className="text-xs text-gray-600">Dernière évaluation: 15/10/2023</div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" className="border-[#34a853] text-[#34a853] hover:bg-[#e6f4ea]">
                      <FileText className="mr-2 h-4 w-4" />
                      Dossier
                    </Button>
                    <Button className="bg-[#34a853] hover:bg-[#2d9649]">Voir le profil</Button>
                  </div>
                </div>
              </div>

              {/* Élève 2 */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300">
                <div className="p-4 bg-gradient-to-r from-[#fbbc05] to-[#f9ab00] text-white flex justify-between items-center">
                  <h3 className="font-semibold">Adam Martin</h3>
                  <Badge className="bg-white text-[#fbbc05]">Maternelle 2</Badge>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-[#fef7e0] flex items-center justify-center text-xl font-bold text-[#fbbc05]">
                      AM
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">ID: STD-2023-002</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className="bg-red-100 text-red-800 border-0">En retard</Badge>
                        <Badge className="bg-[#fef7e0] text-[#fbbc05] border-0">Après-midi</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Calendar className="h-4 w-4 text-[#fbbc05]" />
                      <span>5 ans (20/08/2018)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Users className="h-4 w-4 text-[#fbbc05]" />
                      <span>Parents: Thomas et Julie Martin</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Phone className="h-4 w-4 text-[#fbbc05]" />
                      <span>06 XX XX XX XX</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Mail className="h-4 w-4 text-[#fbbc05]" />
                      <span>thomas.martin@email.com</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <MapPin className="h-4 w-4 text-[#fbbc05]" />
                      <span>8 Avenue des Roses, 93100 Montreuil</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium text-gray-700">Progression</div>
                      <div className="text-sm font-medium text-[#fbbc05]">Bien</div>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="h-4 w-4 text-[#fbbc05] fill-[#fbbc05]" />
                      <Star className="h-4 w-4 text-[#fbbc05] fill-[#fbbc05]" />
                      <Star className="h-4 w-4 text-[#fbbc05] fill-[#fbbc05]" />
                      <Star className="h-4 w-4 text-[#fbbc05]" />
                    </div>
                    <div className="text-xs text-gray-600">Dernière évaluation: 10/10/2023</div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" className="border-[#fbbc05] text-[#fbbc05] hover:bg-[#fef7e0]">
                      <FileText className="mr-2 h-4 w-4" />
                      Dossier
                    </Button>
                    <Button className="bg-[#fbbc05] hover:bg-[#f9ab00]">Voir le profil</Button>
                  </div>
                </div>
              </div>

              {/* Élève 3 */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300">
                <div className="p-4 bg-gradient-to-r from-[#4285f4] to-[#3b78e7] text-white flex justify-between items-center">
                  <h3 className="font-semibold">Yasmine Benali</h3>
                  <Badge className="bg-white text-[#4285f4]">Primaire 2</Badge>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-[#e8f0fe] flex items-center justify-center text-xl font-bold text-[#4285f4]">
                      YB
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">ID: STD-2023-003</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className="bg-green-100 text-green-800 border-0">À jour</Badge>
                        <Badge className="bg-[#e8f0fe] text-[#4285f4] border-0">Matin</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Calendar className="h-4 w-4 text-[#4285f4]" />
                      <span>9 ans (10/03/2014)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Users className="h-4 w-4 text-[#4285f4]" />
                      <span>Parents: Karim et Nadia Benali</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Phone className="h-4 w-4 text-[#4285f4]" />
                      <span>06 XX XX XX XX</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Mail className="h-4 w-4 text-[#4285f4]" />
                      <span>karim.benali@email.com</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <MapPin className="h-4 w-4 text-[#4285f4]" />
                      <span>25 Rue du Parc, 93100 Montreuil</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium text-gray-700">Progression</div>
                      <div className="text-sm font-medium text-[#4285f4]">Très bien</div>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="h-4 w-4 text-[#fbbc05] fill-[#fbbc05]" />
                      <Star className="h-4 w-4 text-[#fbbc05] fill-[#fbbc05]" />
                      <Star className="h-4 w-4 text-[#fbbc05] fill-[#fbbc05]" />
                      <Star className="h-4 w-4 text-[#fbbc05] fill-[#fbbc05]" />
                      <Star className="h-4 w-4 text-gray-300" />
                    </div>
                    <div className="text-xs text-gray-600">Dernière évaluation: 12/10/2023</div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" className="border-[#4285f4] text-[#4285f4] hover:bg-[#e8f0fe]">
                      <FileText className="mr-2 h-4 w-4" />
                      Dossier
                    </Button>
                    <Button className="bg-[#4285f4] hover:bg-[#3b78e7]">Voir le profil</Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                Charger plus d'élèves
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="stats">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-800">Répartition par niveau</h3>
                  <GraduationCap className="h-5 w-5 text-[#6c63ff]" />
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Maternelle 1</span>
                      <span className="text-sm font-medium text-gray-800">12 élèves</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-[#fbbc05] h-2.5 rounded-full" style={{ width: "27%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Maternelle 2</span>
                      <span className="text-sm font-medium text-gray-800">14 élèves</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-[#4285f4] h-2.5 rounded-full" style={{ width: "31%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Primaire 1</span>
                      <span className="text-sm font-medium text-gray-800">18 élèves</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-[#34a853] h-2.5 rounded-full" style={{ width: "40%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Primaire 2</span>
                      <span className="text-sm font-medium text-gray-800">8 élèves</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-[#6c63ff] h-2.5 rounded-full" style={{ width: "18%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Primaire 3</span>
                      <span className="text-sm font-medium text-gray-800">5 élèves</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-[#ea4335] h-2.5 rounded-full" style={{ width: "11%" }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-800">Répartition par créneau</h3>
                  <Clock className="h-5 w-5 text-[#6c63ff]" />
                </div>
                <div className="flex items-center justify-center h-48">
                  <div className="relative w-40 h-40">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-800">57</div>
                        <div className="text-sm text-gray-600">élèves</div>
                      </div>
                    </div>
                    {/* Cercle pour le matin */}
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        className="text-gray-200 stroke-current"
                        strokeWidth="10"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                      />
                      <circle
                        className="text-[#34a853] stroke-current"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray="167.5 251.2"
                        strokeDashoffset="0"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                      />
                    </svg>
                    {/* Cercle pour l'après-midi */}
                    <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100">
                      <circle
                        className="text-[#4285f4] stroke-current"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray="83.7 251.2"
                        strokeDashoffset="-167.5"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#34a853]"></div>
                    <span className="text-sm text-gray-600">Matin (67%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#4285f4]"></div>
                    <span className="text-sm text-gray-600">Après-midi (33%)</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-800">Statut des paiements</h3>
                  <Tag className="h-5 w-5 text-[#6c63ff]" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-green-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm text-green-800">Paiements à jour</div>
                      <div className="text-lg font-semibold text-green-900">42 élèves</div>
                    </div>
                  </div>

                  <div className="flex items-center p-3 bg-amber-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                      <Clock className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <div className="text-sm text-amber-800">Échéance proche</div>
                      <div className="text-lg font-semibold text-amber-900">10 élèves</div>
                    </div>
                  </div>

                  <div className="flex items-center p-3 bg-red-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <div className="text-sm text-red-800">Paiements en retard</div>
                      <div className="text-lg font-semibold text-red-900">5 élèves</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-800">Activité récente</h3>
                <Button variant="outline" size="sm" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                  Voir tout
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-[#e6f4ea] flex items-center justify-center text-sm font-bold text-[#34a853]">
                    SD
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">Sarah Dupont</div>
                    <div className="text-sm text-gray-600">Bulletin trimestriel envoyé</div>
                  </div>
                  <div className="text-sm text-gray-500">Il y a 2 jours</div>
                </div>

                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-[#fef7e0] flex items-center justify-center text-sm font-bold text-[#fbbc05]">
                    AM
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">Adam Martin</div>
                    <div className="text-sm text-gray-600">Rappel de paiement envoyé</div>
                  </div>
                  <div className="text-sm text-gray-500">Il y a 3 jours</div>
                </div>

                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-[#e8f0fe] flex items-center justify-center text-sm font-bold text-[#4285f4]">
                    YB
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">Yasmine Benali</div>
                    <div className="text-sm text-gray-600">Mise à jour des coordonnées</div>
                  </div>
                  <div className="text-sm text-gray-500">Il y a 5 jours</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}


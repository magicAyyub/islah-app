import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  PlusCircle,
  ArrowLeft,
  Calendar,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  FileText,
  BarChart3,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PaymentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      <div className="container mx-auto py-10 px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 border-teal-200 text-teal-700 hover:bg-teal-100 hover:text-teal-800"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-teal-900">Gestion des Paiements</h1>
          </div>
          <div className="flex gap-3">
            <Link href="/payments/new">
              <Button className="bg-teal-600 hover:bg-teal-700">
                <PlusCircle className="mr-2 h-4 w-4" />
                Nouveau Paiement
              </Button>
            </Link>
          </div>
        </div>

        {/* Vue d'ensemble des paiements */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-teal-100 p-6 relative group hover:shadow-lg transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500 opacity-10 rounded-bl-full group-hover:opacity-20 transition-opacity"></div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-teal-600">Total des paiements</h3>
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-teal-700" />
              </div>
            </div>
            <div className="text-3xl font-bold text-teal-900">3 250,00 €</div>
            <div className="flex items-center gap-1 mt-1 text-sm text-teal-600">
              <ArrowUpRight className="h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">+12%</span>
              <span>ce mois-ci</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-teal-100 p-6 relative group hover:shadow-lg transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500 opacity-10 rounded-bl-full group-hover:opacity-20 transition-opacity"></div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-teal-600">Paiements en retard</h3>
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-700" />
              </div>
            </div>
            <div className="text-3xl font-bold text-red-600">750,00 €</div>
            <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
              <span>5 paiements</span>
              <span className="font-medium">à traiter</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-teal-100 p-6 relative group hover:shadow-lg transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500 opacity-10 rounded-bl-full group-hover:opacity-20 transition-opacity"></div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-teal-600">Paiements à venir</h3>
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-amber-700" />
              </div>
            </div>
            <div className="text-3xl font-bold text-teal-900">4 500,00 €</div>
            <div className="flex items-center gap-1 mt-1 text-sm text-teal-600">
              <span>30 paiements</span>
              <span className="font-medium">dans 30 jours</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-teal-100 p-6 relative group hover:shadow-lg transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500 opacity-10 rounded-bl-full group-hover:opacity-20 transition-opacity"></div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-teal-600">Taux de recouvrement</h3>
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-teal-700" />
              </div>
            </div>
            <div className="text-3xl font-bold text-teal-900">92%</div>
            <div className="flex items-center gap-1 mt-1 text-sm text-teal-600">
              <ArrowUpRight className="h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">+3%</span>
              <span>vs trimestre précédent</span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="upcoming" className="mb-8">
          <TabsList className="mb-6 bg-teal-100 text-teal-700 rounded-full overflow-hidden">
            <TabsTrigger
              value="upcoming"
              className="rounded-full data-[state=active]:bg-teal-600 data-[state=active]:text-white"
            >
              Paiements à venir
            </TabsTrigger>
            <TabsTrigger
              value="calendar"
              className="rounded-full data-[state=active]:bg-teal-600 data-[state=active]:text-white"
            >
              Calendrier
            </TabsTrigger>
            <TabsTrigger
              value="overdue"
              className="rounded-full data-[state=active]:bg-teal-600 data-[state=active]:text-white"
            >
              Paiements en retard
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="rounded-full data-[state=active]:bg-teal-600 data-[state=active]:text-white"
            >
              Historique
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-teal-100 mb-8">
              <div className="p-6 border-b border-teal-100 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-teal-900">Paiements à venir</h2>
                  <p className="text-teal-600">Prochaines échéances de paiement</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="border-teal-200 text-teal-700 hover:bg-teal-50">
                    <Calendar className="mr-2 h-4 w-4" />
                    Calendrier
                  </Button>
                  <Button variant="outline" className="border-teal-200 text-teal-700 hover:bg-teal-50">
                    <Download className="mr-2 h-4 w-4" />
                    Exporter
                  </Button>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-teal-700" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-teal-900">Aujourd'hui - 15 Octobre</h3>
                      <div className="text-sm text-teal-600">2 paiements attendus</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 border border-teal-200 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-sm font-bold text-teal-700">
                          AM
                        </div>
                        <div>
                          <div className="font-medium text-teal-900">Adam Martin</div>
                          <div className="text-sm text-teal-600">Maternelle 2 • Après-midi</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-xs text-teal-600">Trimestre 1</div>
                          <div className="text-lg font-bold text-teal-900">150,00 €</div>
                        </div>
                        <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Marquer payé
                        </Button>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-teal-200 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-sm font-bold text-teal-700">
                          LT
                        </div>
                        <div>
                          <div className="font-medium text-teal-900">Leila Toumi</div>
                          <div className="text-sm text-teal-600">Maternelle 1 • Matin</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-xs text-teal-600">Trimestre 1</div>
                          <div className="text-lg font-bold text-teal-900">150,00 €</div>
                        </div>
                        <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Marquer payé
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-teal-700" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-teal-900">Demain - 16 Octobre</h3>
                      <div className="text-sm text-teal-600">1 paiement attendu</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 border border-teal-200 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-sm font-bold text-teal-700">
                          KD
                        </div>
                        <div>
                          <div className="font-medium text-teal-900">Karim Dubois</div>
                          <div className="text-sm text-teal-600">Primaire 1 • Après-midi</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-xs text-teal-600">Trimestre 1</div>
                          <div className="text-lg font-bold text-teal-900">150,00 €</div>
                        </div>
                        <Button variant="outline" size="sm" className="border-teal-200 text-teal-700 hover:bg-teal-50">
                          <Clock className="mr-2 h-4 w-4" />
                          Rappel
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-teal-700" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-teal-900">Cette semaine - 17-21 Octobre</h3>
                      <div className="text-sm text-teal-600">5 paiements attendus</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 border border-teal-200 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-sm font-bold text-teal-700">
                          SD
                        </div>
                        <div>
                          <div className="font-medium text-teal-900">Sarah Dupont</div>
                          <div className="text-sm text-teal-600">Primaire 1 • Matin</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-xs text-teal-600">Trimestre 1</div>
                          <div className="text-lg font-bold text-teal-900">150,00 €</div>
                        </div>
                        <Button variant="outline" size="sm" className="border-teal-200 text-teal-700 hover:bg-teal-50">
                          <Clock className="mr-2 h-4 w-4" />
                          Rappel
                        </Button>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-teal-200 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-sm font-bold text-teal-700">
                          YB
                        </div>
                        <div>
                          <div className="font-medium text-teal-900">Yasmine Benali</div>
                          <div className="text-sm text-teal-600">Primaire 2 • Matin</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-xs text-teal-600">Trimestre 1</div>
                          <div className="text-lg font-bold text-teal-900">150,00 €</div>
                        </div>
                        <Button variant="outline" size="sm" className="border-teal-200 text-teal-700 hover:bg-teal-50">
                          <Clock className="mr-2 h-4 w-4" />
                          Rappel
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mt-6">
                  <Button variant="outline" className="border-teal-200 text-teal-700 hover:bg-teal-50">
                    Voir toutes les échéances
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="calendar">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-teal-100 mb-8">
              <div className="p-6 border-b border-teal-100 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-teal-900">Calendrier des paiements</h2>
                  <p className="text-teal-600">Vue mensuelle des échéances</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="border-teal-200 text-teal-700 hover:bg-teal-50">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Mois précédent
                  </Button>
                  <Button variant="outline" className="border-teal-200 text-teal-700 hover:bg-teal-50">
                    Mois suivant
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-teal-900">Octobre 2023</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                      <span className="text-sm text-teal-700">Payé</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <span className="text-sm text-teal-700">À venir</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-sm text-teal-700">En retard</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-2 text-center">
                  {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
                    <div key={day} className="text-sm font-medium text-teal-700 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {/* Semaine 1 */}
                  <div className="bg-gray-100 rounded-lg h-24 p-1 text-gray-400 text-sm">25</div>
                  <div className="bg-gray-100 rounded-lg h-24 p-1 text-gray-400 text-sm">26</div>
                  <div className="bg-gray-100 rounded-lg h-24 p-1 text-gray-400 text-sm">27</div>
                  <div className="bg-gray-100 rounded-lg h-24 p-1 text-gray-400 text-sm">28</div>
                  <div className="bg-gray-100 rounded-lg h-24 p-1 text-gray-400 text-sm">29</div>
                  <div className="bg-gray-100 rounded-lg h-24 p-1 text-gray-400 text-sm">30</div>
                  <div className="bg-white rounded-lg h-24 p-1 border border-teal-100 hover:border-teal-300 transition-colors">
                    <div className="text-sm font-medium mb-1">1</div>
                  </div>

                  {/* Semaine 2 */}
                  <div className="bg-white rounded-lg h-24 p-1 border border-teal-100 hover:border-teal-300 transition-colors">
                    <div className="text-sm font-medium mb-1">2</div>
                  </div>
                  <div className="bg-white rounded-lg h-24 p-1 border border-teal-100 hover:border-teal-300 transition-colors">
                    <div className="text-sm font-medium mb-1">3</div>
                  </div>
                  <div className="bg-white rounded-lg h-24 p-1 border border-teal-100 hover:border-teal-300 transition-colors">
                    <div className="text-sm font-medium mb-1">4</div>
                  </div>
                  <div className="bg-white rounded-lg h-24 p-1 border border-teal-100 hover:border-teal-300 transition-colors">
                    <div className="text-sm font-medium mb-1">5</div>
                    <div className="bg-teal-100 rounded text-xs p-1 mb-1 text-teal-800 truncate">3 paiements reçus</div>
                  </div>
                  <div className="bg-white rounded-lg h-24 p-1 border border-teal-100 hover:border-teal-300 transition-colors">
                    <div className="text-sm font-medium mb-1">6</div>
                  </div>
                  <div className="bg-white rounded-lg h-24 p-1 border border-teal-100 hover:border-teal-300 transition-colors">
                    <div className="text-sm font-medium mb-1">7</div>
                  </div>
                  <div className="bg-white rounded-lg h-24 p-1 border border-teal-100 hover:border-teal-300 transition-colors">
                    <div className="text-sm font-medium mb-1">8</div>
                  </div>

                  {/* Semaine 3 */}
                  <div className="bg-white rounded-lg h-24 p-1 border border-teal-100 hover:border-teal-300 transition-colors">
                    <div className="text-sm font-medium mb-1">9</div>
                  </div>
                  <div className="bg-white rounded-lg h-24 p-1 border border-teal-100 hover:border-teal-300 transition-colors">
                    <div className="text-sm font-medium mb-1">10</div>
                  </div>
                  <div className="bg-white rounded-lg h-24 p-1 border border-teal-100 hover:border-teal-300 transition-colors">
                    <div className="text-sm font-medium mb-1">11</div>
                  </div>
                  <div className="bg-white rounded-lg h-24 p-1 border border-teal-100 hover:border-teal-300 transition-colors">
                    <div className="text-sm font-medium mb-1">12</div>
                  </div>
                  <div className="bg-white rounded-lg h-24 p-1 border border-teal-100 hover:border-teal-300 transition-colors">
                    <div className="text-sm font-medium mb-1">13</div>
                  </div>
                  <div className="bg-white rounded-lg h-24 p-1 border border-teal-100 hover:border-teal-300 transition-colors">
                    <div className="text-sm font-medium mb-1">14</div>
                  </div>
                  <div className="bg-white rounded-lg h-24 p-1 border border-teal-100 hover:border-teal-300 transition-colors">
                    <div className="text-sm font-medium mb-1">15</div>
                    <div className="bg-amber-100 rounded text-xs p-1 mb-1 text-amber-800 truncate">2 paiements dus</div>
                  </div>

                  {/* Semaine 4 */}
                  <div className="bg-white rounded-lg h-24 p-1 border border-teal-300 ring-2 ring-teal-300 shadow-md">
                    <div className="text-sm font-medium mb-1 text-teal-900">16</div>
                    <div className="bg-amber-100 rounded text-xs p-1 mb-1 text-amber-800 truncate">Karim D. - 150€</div>
                  </div>
                  <div className="bg-white rounded-lg h-24 p-1 border border-teal-100 hover:border-teal-300 transition-colors">
                    <div className="text-sm font-medium mb-1">17</div>
                  </div>
                  <div className="bg-white rounded-lg h-24 p-1 border border-teal-100 hover:border-teal-300 transition-colors">
                    <div className="text-sm font-medium mb-1">18</div>
                  </div>
                  <div className="bg-white rounded-lg h-24 p-1 border border-teal-100 hover:border-teal-300 transition-colors">
                    <div className="text-sm font-medium mb-1">19</div>
                  </div>
                  <div className="bg-white rounded-lg h-24 p-1 border border-teal-100 hover:border-teal-300 transition-colors">
                    <div className="text-sm font-medium mb-1">20</div>
                    <div className="bg-amber-100 rounded text-xs p-1 mb-1 text-amber-800 truncate">Sarah D. - 150€</div>
                    <div className="bg-amber-100 rounded text-xs p-1 mb-1 text-amber-800 truncate">
                      Yasmine B. - 150€
                    </div>
                  </div>
                  <div className="bg-white rounded-lg h-24 p-1 border border-teal-100 hover:border-teal-300 transition-colors">
                    <div className="text-sm font-medium mb-1">21</div>
                  </div>
                  <div className="bg-white rounded-lg h-24 p-1 border border-teal-100 hover:border-teal-300 transition-colors">
                    <div className="text-sm font-medium mb-1">22</div>
                  </div>

                  {/* Semaine 5 */}
                  <div className="bg-white rounded-lg h-24 p-1 border border-teal-100 hover:border-teal-300 transition-colors">
                    <div className="text-sm font-medium mb-1">23</div>
                  </div>
                  <div className="bg-white rounded-lg h-24 p-1 border border-teal-100 hover:border-teal-300 transition-colors">
                    <div className="text-sm font-medium mb-1">24</div>
                  </div>
                  <div className="bg-white rounded-lg h-24 p-1 border border-teal-100 hover:border-teal-300 transition-colors">
                    <div className="text-sm font-medium mb-1">25</div>
                    <div className="bg-red-100 rounded text-xs p-1 mb-1 text-red-800 truncate">
                      5 paiements en retard
                    </div>
                  </div>
                  <div className="bg-white rounded-lg h-24 p-1 border border-teal-100 hover:border-teal-300 transition-colors">
                    <div className="text-sm font-medium mb-1">26</div>
                  </div>
                  <div className="bg-white rounded-lg h-24 p-1 border border-teal-100 hover:border-teal-300 transition-colors">
                    <div className="text-sm font-medium mb-1">27</div>
                  </div>
                  <div className="bg-white rounded-lg h-24 p-1 border border-teal-100 hover:border-teal-300 transition-colors">
                    <div className="text-sm font-medium mb-1">28</div>
                  </div>
                  <div className="bg-white rounded-lg h-24 p-1 border border-teal-100 hover:border-teal-300 transition-colors">
                    <div className="text-sm font-medium mb-1">29</div>
                  </div>

                  {/* Semaine 6 */}
                  <div className="bg-white rounded-lg h-24 p-1 border border-teal-100 hover:border-teal-300 transition-colors">
                    <div className="text-sm font-medium mb-1">30</div>
                  </div>
                  <div className="bg-white rounded-lg h-24 p-1 border border-teal-100 hover:border-teal-300 transition-colors">
                    <div className="text-sm font-medium mb-1">31</div>
                    <div className="bg-amber-100 rounded text-xs p-1 mb-1 text-amber-800 truncate">
                      10 paiements dus
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded-lg h-24 p-1 text-gray-400 text-sm">1</div>
                  <div className="bg-gray-100 rounded-lg h-24 p-1 text-gray-400 text-sm">2</div>
                  <div className="bg-gray-100 rounded-lg h-24 p-1 text-gray-400 text-sm">3</div>
                  <div className="bg-gray-100 rounded-lg h-24 p-1 text-gray-400 text-sm">4</div>
                  <div className="bg-gray-100 rounded-lg h-24 p-1 text-gray-400 text-sm">5</div>
                </div>

                <div className="mt-6 p-4 bg-teal-50 rounded-lg border border-teal-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-teal-700" />
                    </div>
                    <div>
                      <h3 className="font-medium text-teal-900">Détails du jour sélectionné: 16 Octobre</h3>
                      <div className="text-sm text-teal-600">1 paiement attendu</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-teal-200 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-sm font-bold text-teal-700">
                        KD
                      </div>
                      <div>
                        <div className="font-medium text-teal-900">Karim Dubois</div>
                        <div className="text-sm text-teal-600">Primaire 1 • Après-midi</div>
                        <div className="text-xs text-teal-600 mt-1">Parent: Sophie Dubois • 06 XX XX XX XX</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-xs text-teal-600">Trimestre 1</div>
                        <div className="text-lg font-bold text-teal-900">150,00 €</div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-teal-200 text-teal-700 hover:bg-teal-50">
                          <Clock className="mr-2 h-4 w-4" />
                          Rappel
                        </Button>
                        <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Marquer payé
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="overdue">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-teal-100 mb-8">
              <div className="p-6 border-b border-teal-100 bg-red-50">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-red-900">Paiements en retard</h2>
                    <p className="text-red-600">Nécessitent une action immédiate</p>
                  </div>
                  <Button className="bg-red-600 hover:bg-red-700">Envoyer un rappel à tous</Button>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {/* Paiement en retard 1 */}
                  <div className="bg-white rounded-lg p-4 border border-red-200 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-sm font-bold text-red-700">
                          AM
                        </div>
                        <div>
                          <div className="font-medium text-red-900">Adam Martin</div>
                          <div className="text-sm text-red-700">Maternelle 2 • Après-midi</div>
                          <div className="text-xs text-red-600 mt-1">Parent: Thomas Martin • 06 XX XX XX XX</div>
                        </div>
                      </div>
                      <Badge className="bg-red-100 text-red-800 border-0">15 jours de retard</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-red-700">Trimestre 1</div>
                        <div className="text-xl font-bold text-red-900">150,00 €</div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-red-200 text-red-700 hover:bg-red-100">
                          <AlertCircle className="mr-2 h-4 w-4" />
                          Envoyer rappel
                        </Button>
                        <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Marquer payé
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Paiement en retard 2 */}
                  <div className="bg-white rounded-lg p-4 border border-red-200 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-sm font-bold text-red-700">
                          KD
                        </div>
                        <div>
                          <div className="font-medium text-red-900">Karim Dubois</div>
                          <div className="text-sm text-red-700">Primaire 1 • Après-midi</div>
                          <div className="text-xs text-red-600 mt-1">Parent: Sophie Dubois • 06 XX XX XX XX</div>
                        </div>
                      </div>
                      <Badge className="bg-red-100 text-red-800 border-0">8 jours de retard</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-red-700">Trimestre 1</div>
                        <div className="text-xl font-bold text-red-900">150,00 €</div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-red-200 text-red-700 hover:bg-red-100">
                          <AlertCircle className="mr-2 h-4 w-4" />
                          Envoyer rappel
                        </Button>
                        <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Marquer payé
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-teal-100">
              <div className="p-6 border-b border-teal-100">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-teal-900">Historique des paiements</h2>
                    <p className="text-teal-600">Derniers paiements enregistrés</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="border-teal-200 text-teal-700 hover:bg-teal-50">
                      <Calendar className="mr-2 h-4 w-4" />
                      Filtrer par date
                    </Button>
                    <Button variant="outline" className="border-teal-200 text-teal-700 hover:bg-teal-50">
                      <Download className="mr-2 h-4 w-4" />
                      Exporter
                    </Button>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="bg-teal-50">
                      <th className="py-3 px-4 text-left text-sm font-medium text-teal-700">Élève</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-teal-700">Type</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-teal-700">Montant</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-teal-700">Date</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-teal-700">Méthode</th>
                      <th className="py-3 px-4 text-right text-sm font-medium text-teal-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-teal-100">
                    {/* Paiement 1 */}
                    <tr className="hover:bg-teal-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-sm font-bold text-teal-700">
                            SD
                          </div>
                          <div>
                            <div className="font-medium text-teal-900">Sarah Dupont</div>
                            <div className="text-xs text-teal-600">Primaire 1 • Matin</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className="bg-teal-100 text-teal-800 border-0">Trimestre 1</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-teal-900">150,00 €</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-teal-700">15/09/2023</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-teal-700">Carte Bancaire</div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="outline" size="sm" className="border-teal-200 text-teal-700 hover:bg-teal-50">
                          <FileText className="mr-2 h-4 w-4" />
                          Reçu
                        </Button>
                      </td>
                    </tr>

                    {/* Paiement 2 */}
                    <tr className="hover:bg-teal-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-sm font-bold text-teal-700">
                            YB
                          </div>
                          <div>
                            <div className="font-medium text-teal-900">Yasmine Benali</div>
                            <div className="text-xs text-teal-600">Primaire 2 • Matin</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className="bg-teal-100 text-teal-800 border-0">Trimestre 1</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-teal-900">150,00 €</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-teal-700">20/09/2023</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-teal-700">Chèque</div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="outline" size="sm" className="border-teal-200 text-teal-700 hover:bg-teal-50">
                          <FileText className="mr-2 h-4 w-4" />
                          Reçu
                        </Button>
                      </td>
                    </tr>

                    {/* Paiement 3 */}
                    <tr className="hover:bg-teal-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-sm font-bold text-amber-700">
                            AM
                          </div>
                          <div>
                            <div className="font-medium text-teal-900">Adam Martin</div>
                            <div className="text-xs text-teal-600">Maternelle 2 • Après-midi</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className="bg-amber-100 text-amber-800 border-0">Inscription</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-teal-900">50,00 €</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-teal-700">10/09/2023</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-teal-700">Espèces</div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="outline" size="sm" className="border-teal-200 text-teal-700 hover:bg-teal-50">
                          <FileText className="mr-2 h-4 w-4" />
                          Reçu
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-4 border-t border-teal-100 flex items-center justify-between">
                <div className="text-sm text-teal-600">Affichage de 1 à 3 sur 45 paiements</div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled className="border-teal-200">
                    Précédent
                  </Button>
                  <Button variant="outline" size="sm" className="border-teal-200 text-teal-700 hover:bg-teal-50">
                    Suivant
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}


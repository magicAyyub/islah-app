"use client"

import { useState } from "react"
import {
  BookOpen,
  CreditCard,
  ClipboardList,
  Bell,
  BookOpenCheck,
  LogOut,
  Settings,
  User,
  ChevronDown,
  MessageSquare,
  FileText,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  Star,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function ParentPortalPage() {
  // État pour simuler un parent connecté
  const [user] = useState({
    name: "Thomas Martin",
    role: "Parent",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "TM",
  })

  // État pour simuler des notifications
  const [notifications] = useState([
    { id: 1, title: "Bulletin disponible", read: false },
    { id: 2, title: "Absence signalée", read: false },
    { id: 3, title: "Paiement reçu", read: true },
  ])

  // État pour simuler un message de l'administrateur
  const [adminAlert] = useState({
    show: true,
    message: "Réunion parents-professeurs le 25 octobre à 18h. Votre présence est importante.",
  })

  // Fonction pour simuler la déconnexion
  const handleLogout = () => {
    // TODO: Implémenter la logique de déconnexion
    console.log("Déconnexion...")
    window.location.href = "/login"
  }

  // Simuler les informations des enfants
  const [children] = useState([
    {
      id: 1,
      name: "Adam Martin",
      class: "Maternelle 2",
      schedule: "Après-midi",
      avatar: "/placeholder.svg?height=80&width=80",
      initials: "AM",
      attendance: 85,
      payments: { status: "En retard", amount: 150, dueDate: "15/10/2023" },
      lastGrade: "Très bien",
      stars: 4,
    },
  ])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header avec informations utilisateur */}
      <header className="bg-white border-b border-gray-200 py-4 px-6 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#6c63ff] flex items-center justify-center">
              <BookOpenCheck className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-[#2d2a54]">École Islah</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5 text-gray-600" />
                  {notifications.filter((n) => !n.read).length > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-[#6c63ff]">
                      {notifications.filter((n) => !n.read).length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-2 font-medium text-sm">Notifications</div>
                <DropdownMenuSeparator />
                {notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="p-3 cursor-pointer">
                    <div className="flex items-start gap-2">
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 ${notification.read ? "bg-gray-300" : "bg-[#6c63ff]"}`}
                      ></div>
                      <div>
                        <div className="font-medium text-sm">{notification.title}</div>
                        <div className="text-xs text-gray-500">Il y a 2 heures</div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="p-2 cursor-pointer justify-center">
                  <span className="text-[#6c63ff] text-sm">Voir toutes les notifications</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profil utilisateur */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-[#fef7e0] text-[#fbbc05]">{user.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-sm">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-xs text-gray-500">{user.role}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Mon profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Paramètres</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-600" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-10 px-4">
        {/* Message de l'administrateur */}
        {adminAlert.show && (
          <Alert className="mb-8 border-[#6c63ff] bg-[#f0eeff]">
            <MessageSquare className="h-4 w-4 text-[#6c63ff]" />
            <AlertTitle className="text-[#6c63ff]">Message de l'administration</AlertTitle>
            <AlertDescription>{adminAlert.message}</AlertDescription>
          </Alert>
        )}

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Bonjour, {user.name}</h2>
          <p className="text-gray-600">
            Bienvenue sur votre espace parent. Suivez la scolarité de votre enfant en temps réel.
          </p>
        </div>

        {/* Sélection de l'enfant (si plusieurs enfants) */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Mes enfants</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {children.map((child) => (
              <Card key={child.id} className="hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={child.avatar} alt={child.name} />
                        <AvatarFallback className="bg-[#fef7e0] text-[#fbbc05]">{child.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{child.name}</CardTitle>
                        <CardDescription>
                          {child.class} • {child.schedule}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className="bg-[#fef7e0] text-[#fbbc05]">ID: 2023-002</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Présence</p>
                      <div className="flex items-center gap-2">
                        <Progress value={child.attendance} className="h-2" />
                        <span className="text-sm font-medium">{child.attendance}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Dernière évaluation</p>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < child.stars ? "text-[#fbbc05] fill-[#fbbc05]" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button variant="outline" className="w-full">
                    Voir le profil complet
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="mb-8">
          <TabsList className="mb-6 bg-gray-100 text-gray-700 rounded-full overflow-hidden">
            <TabsTrigger
              value="dashboard"
              className="rounded-full data-[state=active]:bg-[#6c63ff] data-[state=active]:text-white"
            >
              Tableau de bord
            </TabsTrigger>
            <TabsTrigger
              value="attendance"
              className="rounded-full data-[state=active]:bg-[#6c63ff] data-[state=active]:text-white"
            >
              Présence
            </TabsTrigger>
            <TabsTrigger
              value="grades"
              className="rounded-full data-[state=active]:bg-[#6c63ff] data-[state=active]:text-white"
            >
              Bulletins
            </TabsTrigger>
            <TabsTrigger
              value="payments"
              className="rounded-full data-[state=active]:bg-[#6c63ff] data-[state=active]:text-white"
            >
              Paiements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base">Prochain paiement</CardTitle>
                    <CreditCard className="h-5 w-5 text-[#fbbc05]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mt-2">
                    <div className="text-2xl font-bold text-gray-800">150,00 €</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="bg-red-100 text-red-800">En retard</Badge>
                      <span className="text-sm text-gray-500">Échéance: 15/10/2023</span>
                    </div>
                    <Button className="w-full mt-4 bg-[#fbbc05] hover:bg-[#f9ab00]">Effectuer le paiement</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base">Présence récente</CardTitle>
                    <ClipboardList className="h-5 w-5 text-[#34a853]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mt-2 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <span className="text-sm">Lundi 16/10</span>
                      </div>
                      <Badge className="bg-red-100 text-red-800">Absent</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-sm">Mardi 17/10</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Présent</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-sm">Mercredi 18/10</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Présent</Badge>
                    </div>
                    <Button variant="outline" className="w-full mt-2">
                      Voir l'historique complet
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base">Dernier bulletin</CardTitle>
                    <BookOpen className="h-5 w-5 text-[#4285f4]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mt-2">
                    <div className="text-lg font-medium text-gray-800">Trimestre 1</div>
                    <div className="flex items-center gap-1 mt-1 mb-2">
                      <Star className="h-4 w-4 text-[#fbbc05] fill-[#fbbc05]" />
                      <Star className="h-4 w-4 text-[#fbbc05] fill-[#fbbc05]" />
                      <Star className="h-4 w-4 text-[#fbbc05] fill-[#fbbc05]" />
                      <Star className="h-4 w-4 text-[#fbbc05] fill-[#fbbc05]" />
                      <Star className="h-4 w-4 text-gray-300" />
                      <span className="text-sm text-gray-600 ml-1">Très bien</span>
                    </div>
                    <div className="text-sm text-gray-500">Publié le 15/10/2023</div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" className="flex-1">
                        <FileText className="mr-2 h-4 w-4" />
                        Consulter
                      </Button>
                      <Button className="flex-1 bg-[#4285f4] hover:bg-[#3b78e7]">
                        <Download className="mr-2 h-4 w-4" />
                        Télécharger
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 mb-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Activités récentes</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-[#e6f4ea] flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-[#34a853]" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">Présence enregistrée</div>
                      <div className="text-sm text-gray-600">Adam était présent le mercredi 18/10</div>
                    </div>
                    <div className="text-sm text-gray-500">Aujourd'hui, 10:15</div>
                  </div>

                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-[#fef7e0] flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-[#fbbc05]" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">Bulletin publié</div>
                      <div className="text-sm text-gray-600">Le bulletin du trimestre 1 est disponible</div>
                    </div>
                    <div className="text-sm text-gray-500">15/10/2023</div>
                  </div>

                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-[#e8f0fe] flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-[#4285f4]" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">Événement à venir</div>
                      <div className="text-sm text-gray-600">Réunion parents-professeurs le 25/10 à 18h</div>
                    </div>
                    <div className="text-sm text-gray-500">12/10/2023</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="attendance">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 mb-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Suivi des présences</h2>
                <p className="text-gray-600">Historique de présence de votre enfant</p>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={children[0].avatar} alt={children[0].name} />
                      <AvatarFallback className="bg-[#fef7e0] text-[#fbbc05]">{children[0].initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">{children[0].name}</h3>
                      <p className="text-gray-600">
                        {children[0].class} • {children[0].schedule}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm text-gray-600">Présent</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-sm text-gray-600">Absent</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <span className="text-sm text-gray-600">Justifié</span>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Date</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Jour</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Statut</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Heure d'arrivée</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Commentaire</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 text-sm text-gray-700">18/10/2023</td>
                        <td className="py-3 px-4 text-sm text-gray-700">Mercredi</td>
                        <td className="py-3 px-4">
                          <Badge className="bg-green-100 text-green-800">Présent</Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">14:05</td>
                        <td className="py-3 px-4 text-sm text-gray-700">-</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 text-sm text-gray-700">17/10/2023</td>
                        <td className="py-3 px-4 text-sm text-gray-700">Mardi</td>
                        <td className="py-3 px-4">
                          <Badge className="bg-green-100 text-green-800">Présent</Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">14:00</td>
                        <td className="py-3 px-4 text-sm text-gray-700">-</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 text-sm text-gray-700">16/10/2023</td>
                        <td className="py-3 px-4 text-sm text-gray-700">Lundi</td>
                        <td className="py-3 px-4">
                          <Badge className="bg-red-100 text-red-800">Absent</Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">-</td>
                        <td className="py-3 px-4 text-sm text-gray-700">Non justifié</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 text-sm text-gray-700">15/10/2023</td>
                        <td className="py-3 px-4 text-sm text-gray-700">Dimanche</td>
                        <td className="py-3 px-4">
                          <Badge className="bg-green-100 text-green-800">Présent</Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">14:10</td>
                        <td className="py-3 px-4 text-sm text-gray-700">-</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 text-sm text-gray-700">14/10/2023</td>
                        <td className="py-3 px-4 text-sm text-gray-700">Samedi</td>
                        <td className="py-3 px-4">
                          <Badge className="bg-green-100 text-green-800">Présent</Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">14:05</td>
                        <td className="py-3 px-4 text-sm text-gray-700">-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 flex justify-center">
                  <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                    Voir plus d'historique
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 mb-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Justifier une absence</h2>
                <p className="text-gray-600">Signalez une absence prévue ou justifiez une absence passée</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Date de l'absence</label>
                      <input
                        type="date"
                        className="w-full rounded-md border border-gray-200 p-2 text-sm focus:ring-[#6c63ff] focus:border-[#6c63ff]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Motif de l'absence</label>
                      <select className="w-full rounded-md border border-gray-200 p-2 text-sm focus:ring-[#6c63ff] focus:border-[#6c63ff]">
                        <option value="">Sélectionner un motif</option>
                        <option value="medical">Raison médicale</option>
                        <option value="family">Raison familiale</option>
                        <option value="other">Autre</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Commentaire</label>
                      <textarea
                        className="w-full rounded-md border border-gray-200 p-2 text-sm focus:ring-[#6c63ff] focus:border-[#6c63ff]"
                        rows={3}
                        placeholder="Précisez la raison de l'absence..."
                      ></textarea>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Pièce justificative (optionnel)</label>
                      <div className="border border-dashed border-gray-300 rounded-md p-4 text-center">
                        <p className="text-sm text-gray-500 mb-2">Glissez un fichier ici ou</p>
                        <Button variant="outline" size="sm" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                          Parcourir
                        </Button>
                      </div>
                    </div>
                    <Button className="w-full bg-[#6c63ff] hover:bg-[#5a52e0]">Soumettre la justification</Button>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Informations importantes</h3>
                    <ul className="space-y-3 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-[#fbbc05] flex-shrink-0 mt-0.5" />
                        <span>
                          Les absences doivent être justifiées dans les 48 heures suivant le retour de l'élève.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-[#fbbc05] flex-shrink-0 mt-0.5" />
                        <span>
                          Pour les absences médicales de plus de 3 jours, un certificat médical est obligatoire.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-[#fbbc05] flex-shrink-0 mt-0.5" />
                        <span>
                          Les absences prévues (rendez-vous, événements familiaux) doivent être signalées à l'avance.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-[#fbbc05] flex-shrink-0 mt-0.5" />
                        <span>
                          Les formats de fichiers acceptés pour les justificatifs sont: PDF, JPG, PNG (max 5 Mo).
                        </span>
                      </li>
                    </ul>
                    <div className="mt-6 p-4 bg-[#f0eeff] rounded-lg border border-[#e0ddff]">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="h-5 w-5 text-[#6c63ff]" />
                        <h4 className="font-medium text-[#6c63ff]">Besoin d'aide ?</h4>
                      </div>
                      <p className="text-sm text-[#6c63ff]">
                        Pour toute question concernant les absences, contactez le secrétariat au 01 XX XX XX XX ou par
                        email à secretariat@ecole-islah.fr
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="grades">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 mb-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Bulletins scolaires</h2>
                <p className="text-gray-600">Consultez les bulletins de votre enfant</p>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={children[0].avatar} alt={children[0].name} />
                      <AvatarFallback className="bg-[#fef7e0] text-[#fbbc05]">{children[0].initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">{children[0].name}</h3>
                      <p className="text-gray-600">
                        {children[0].class} • {children[0].schedule}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select className="rounded-md border border-gray-200 p-2 text-sm focus:ring-[#6c63ff] focus:border-[#6c63ff]">
                      <option value="2023-2024">Année 2023-2024</option>
                      <option value="2022-2023">Année 2022-2023</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle>Trimestre 1</CardTitle>
                        <Badge className="bg-green-100 text-green-800">Publié</Badge>
                      </div>
                      <CardDescription>Septembre - Décembre 2023</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">Éveil</span>
                            <span className="text-sm font-medium text-gray-800">Très bien</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-[#34a853] h-2 rounded-full" style={{ width: "90%" }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">Motricité</span>
                            <span className="text-sm font-medium text-gray-800">Bien</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-[#4285f4] h-2 rounded-full" style={{ width: "75%" }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">Socialisation</span>
                            <span className="text-sm font-medium text-gray-800">Excellent</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-[#34a853] h-2 rounded-full" style={{ width: "95%" }}></div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 mt-4 mb-2">
                        <Star className="h-4 w-4 text-[#fbbc05] fill-[#fbbc05]" />
                        <Star className="h-4 w-4 text-[#fbbc05] fill-[#fbbc05]" />
                        <Star className="h-4 w-4 text-[#fbbc05] fill-[#fbbc05]" />
                        <Star className="h-4 w-4 text-[#fbbc05] fill-[#fbbc05]" />
                        <Star className="h-4 w-4 text-gray-300" />
                        <span className="text-sm text-gray-600 ml-1">Très bien</span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        <FileText className="mr-2 h-4 w-4" />
                        Voir
                      </Button>
                      <Button className="flex-1 bg-[#4285f4] hover:bg-[#3b78e7]">
                        <Download className="mr-2 h-4 w-4" />
                        PDF
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle>Trimestre 2</CardTitle>
                        <Badge className="bg-gray-100 text-gray-800">À venir</Badge>
                      </div>
                      <CardDescription>Janvier - Mars 2024</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="flex items-center justify-center h-[180px]">
                        <div className="text-center">
                          <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                          <p className="text-gray-500">Le bulletin sera disponible à la fin du trimestre</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle>Trimestre 3</CardTitle>
                        <Badge className="bg-gray-100 text-gray-800">À venir</Badge>
                      </div>
                      <CardDescription>Avril - Juin 2024</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="flex items-center justify-center h-[180px]">
                        <div className="text-center">
                          <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                          <p className="text-gray-500">Le bulletin sera disponible à la fin du trimestre</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="payments">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 mb-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Gestion des paiements</h2>
                <p className="text-gray-600">Suivez et effectuez vos paiements</p>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={children[0].avatar} alt={children[0].name} />
                      <AvatarFallback className="bg-[#fef7e0] text-[#fbbc05]">{children[0].initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">{children[0].name}</h3>
                      <p className="text-gray-600">
                        {children[0].class} • {children[0].schedule}
                      </p>
                    </div>
                  </div>
                  <Button className="bg-[#fbbc05] hover:bg-[#f9ab00]">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Effectuer un paiement
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-700">Prochain paiement</h3>
                      <Clock className="h-5 w-5 text-[#fbbc05]" />
                    </div>
                    <div className="text-2xl font-bold text-gray-800">150,00 €</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="bg-red-100 text-red-800">En retard</Badge>
                      <span className="text-sm text-gray-500">Échéance: 15/10/2023</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-700">Total payé</h3>
                      <CheckCircle className="h-5 w-5 text-[#34a853]" />
                    </div>
                    <div className="text-2xl font-bold text-gray-800">200,00 €</div>
                    <div className="text-sm text-gray-500 mt-1">Année scolaire 2023-2024</div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-700">Restant à payer</h3>
                      <AlertCircle className="h-5 w-5 text-[#4285f4]" />
                    </div>
                    <div className="text-2xl font-bold text-gray-800">300,00 €</div>
                    <div className="text-sm text-gray-500 mt-1">2 échéances à venir</div>
                  </div>
                </div>

                <h3 className="text-lg font-medium text-gray-800 mb-4">Historique des paiements</h3>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Date</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Description</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Montant</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Statut</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 text-sm text-gray-700">15/10/2023</td>
                        <td className="py-3 px-4 text-sm text-gray-700">Trimestre 1</td>
                        <td className="py-3 px-4 text-sm font-medium text-gray-800">150,00 €</td>
                        <td className="py-3 px-4">
                          <Badge className="bg-red-100 text-red-800">En retard</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Button size="sm" className="bg-[#fbbc05] hover:bg-[#f9ab00]">
                            Payer
                          </Button>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 text-sm text-gray-700">10/09/2023</td>
                        <td className="py-3 px-4 text-sm text-gray-700">Frais d'inscription</td>
                        <td className="py-3 px-4 text-sm font-medium text-gray-800">50,00 €</td>
                        <td className="py-3 px-4">
                          <Badge className="bg-green-100 text-green-800">Payé</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-200 text-gray-700 hover:bg-gray-50"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Reçu
                          </Button>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 text-sm text-gray-700">05/09/2023</td>
                        <td className="py-3 px-4 text-sm text-gray-700">Fournitures scolaires</td>
                        <td className="py-3 px-4 text-sm font-medium text-gray-800">150,00 €</td>
                        <td className="py-3 px-4">
                          <Badge className="bg-green-100 text-green-800">Payé</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-200 text-gray-700 hover:bg-gray-50"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Reçu
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <footer className="mt-20 text-center text-gray-600">
          <p>© {new Date().getFullYear()} École Islah - Espace Parents</p>
          <p className="text-sm mt-2">70 Rue des Sorins, 93100 Montreuil</p>
        </footer>
      </div>
    </div>
  )
}


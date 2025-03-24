"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Search,
  Settings,
  Bell,
  CheckCircle,
  XCircle,
  UserPlus,
  UserCog,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash,
  Lock,
  MessageSquare,
  Send,
  AlertTriangle,
  Info,
  Calendar,
  Shield,
  School,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function AdminPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [messageText, setMessageText] = useState("")
  const [messageType, setMessageType] = useState("info")

  // Simuler l'envoi d'un message à un utilisateur
  const handleSendMessage = () => {
    console.log(`Message envoyé à ${selectedUser}: ${messageText} (Type: ${messageType})`)
    // Réinitialiser le formulaire
    setMessageText("")
    setSelectedUser(null)
  }

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
            <h1 className="text-3xl font-bold text-gray-800">Administration</h1>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">
              <Settings className="mr-2 h-4 w-4" />
              Paramètres
            </Button>
            <Button className="bg-[#6c63ff] hover:bg-[#5a52e0]">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
              <Badge className="ml-2 bg-white text-[#6c63ff]">3</Badge>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="access-requests" className="mb-8">
          <TabsList className="mb-6 bg-gray-100 text-gray-700 rounded-full overflow-hidden">
            <TabsTrigger
              value="access-requests"
              className="rounded-full data-[state=active]:bg-[#6c63ff] data-[state=active]:text-white"
            >
              Demandes d'accès
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="rounded-full data-[state=active]:bg-[#6c63ff] data-[state=active]:text-white"
            >
              Utilisateurs
            </TabsTrigger>
            <TabsTrigger
              value="messages"
              className="rounded-full data-[state=active]:bg-[#6c63ff] data-[state=active]:text-white"
            >
              Messages
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="rounded-full data-[state=active]:bg-[#6c63ff] data-[state=active]:text-white"
            >
              Configuration
            </TabsTrigger>
          </TabsList>

          <TabsContent value="access-requests">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 mb-8">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Demandes d'accès en attente</h2>
                  <p className="text-gray-600">Gérez les demandes d'accès à la plateforme</p>
                </div>
                <div className="flex gap-2">
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      type="search"
                      placeholder="Rechercher..."
                      className="pl-9 border-gray-200 focus:ring-[#6c63ff] focus:border-[#6c63ff]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtrer
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Nom</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Email</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Fonction</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Date de demande</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Statut</th>
                      <th className="py-3 px-4 text-right text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {/* Demande 1 */}
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#e6f4ea] flex items-center justify-center text-sm font-bold text-[#34a853]">
                            JD
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">Jean Dupont</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-700">jean.dupont@ecole-islah.fr</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-700">Enseignant</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-700">15/10/2023</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-0">En attente</Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-gray-200 text-gray-700 hover:bg-gray-50"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" className="h-8 bg-green-600 hover:bg-green-700">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button size="sm" className="h-8 bg-red-600 hover:bg-red-700">
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>

                    {/* Demande 2 */}
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#fef7e0] flex items-center justify-center text-sm font-bold text-[#fbbc05]">
                            SM
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">Sophie Martin</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-700">sophie.martin@ecole-islah.fr</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-700">Secrétaire</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-700">14/10/2023</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-0">En attente</Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-gray-200 text-gray-700 hover:bg-gray-50"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" className="h-8 bg-green-600 hover:bg-green-700">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button size="sm" className="h-8 bg-red-600 hover:bg-red-700">
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>

                    {/* Demande 3 */}
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#e8f0fe] flex items-center justify-center text-sm font-bold text-[#4285f4]">
                            KB
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">Karim Benali</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-700">karim.benali@ecole-islah.fr</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-700">Enseignant</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-700">13/10/2023</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-0">En attente</Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-gray-200 text-gray-700 hover:bg-gray-50"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" className="h-8 bg-green-600 hover:bg-green-700">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button size="sm" className="h-8 bg-red-600 hover:bg-red-700">
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">Affichage de 1 à 3 sur 3 demandes</div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled className="border-gray-200">
                    Précédent
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                    className="border-gray-200 text-gray-700 hover:bg-gray-50"
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 mb-8">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Gestion des utilisateurs</h2>
                  <p className="text-gray-600">Gérez les comptes utilisateurs de la plateforme</p>
                </div>
                <div className="flex gap-2">
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      type="search"
                      placeholder="Rechercher un utilisateur..."
                      className="pl-9 border-gray-200 focus:ring-[#6c63ff] focus:border-[#6c63ff]"
                    />
                  </div>
                  <Button className="bg-[#6c63ff] hover:bg-[#5a52e0]">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Nouvel utilisateur
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Utilisateur</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Email</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Rôle</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Dernière connexion</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Statut</th>
                      <th className="py-3 px-4 text-right text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {/* Utilisateur 1 */}
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#e6f4ea] flex items-center justify-center text-sm font-bold text-[#34a853]">
                            AD
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">Ahmed Dubois</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-700">ahmed.dubois@ecole-islah.fr</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className="bg-[#e6f4ea] text-[#34a853] border-0">Administrateur</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-700">Aujourd'hui, 10:45</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-0">Actif</Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-gray-200">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="flex items-center">
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Modifier</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center">
                              <Lock className="mr-2 h-4 w-4" />
                              <span>Réinitialiser mot de passe</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center">
                              <MessageSquare className="mr-2 h-4 w-4" />
                              <span>Envoyer un message</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="flex items-center text-red-600">
                              <Trash className="mr-2 h-4 w-4" />
                              <span>Désactiver</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>

                    {/* Utilisateur 2 */}
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#fef7e0] flex items-center justify-center text-sm font-bold text-[#fbbc05]">
                            ML
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">Marie Leroy</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-700">marie.leroy@ecole-islah.fr</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className="bg-[#fef7e0] text-[#fbbc05] border-0">Enseignant</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-700">Hier, 15:30</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-0">Actif</Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-gray-200">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="flex items-center">
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Modifier</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center">
                              <Lock className="mr-2 h-4 w-4" />
                              <span>Réinitialiser mot de passe</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center">
                              <MessageSquare className="mr-2 h-4 w-4" />
                              <span>Envoyer un message</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="flex items-center text-red-600">
                              <Trash className="mr-2 h-4 w-4" />
                              <span>Désactiver</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>

                    {/* Utilisateur 3 */}
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#e8f0fe] flex items-center justify-center text-sm font-bold text-[#4285f4]">
                            ST
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">Sarah Toumi</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-700">sarah.toumi@ecole-islah.fr</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className="bg-[#e8f0fe] text-[#4285f4] border-0">Secrétaire</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-700">12/10/2023</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-0">Actif</Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-gray-200">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="flex items-center">
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Modifier</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center">
                              <Lock className="mr-2 h-4 w-4" />
                              <span>Réinitialiser mot de passe</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center">
                              <MessageSquare className="mr-2 h-4 w-4" />
                              <span>Envoyer un message</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="flex items-center text-red-600">
                              <Trash className="mr-2 h-4 w-4" />
                              <span>Désactiver</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">Affichage de 1 à 3 sur 10 utilisateurs</div>
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

          <TabsContent value="messages">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 mb-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Gestion des messages</h2>
                <p className="text-gray-600">Envoyez des messages et alertes aux utilisateurs</p>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Formulaire d'envoi de message */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-800">Envoyer un message</h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="recipient">Destinataire</Label>
                      <Select value={selectedUser || ""} onValueChange={setSelectedUser}>
                        <SelectTrigger
                          id="recipient"
                          className="border-gray-200 focus:ring-[#6c63ff] focus:border-[#6c63ff]"
                        >
                          <SelectValue placeholder="Sélectionner un destinataire" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les utilisateurs</SelectItem>
                          <SelectItem value="teachers">Tous les enseignants</SelectItem>
                          <SelectItem value="parents">Tous les parents</SelectItem>
                          <SelectItem value="ahmed.dubois@ecole-islah.fr">Ahmed Dubois (Administrateur)</SelectItem>
                          <SelectItem value="marie.leroy@ecole-islah.fr">Marie Leroy (Enseignant)</SelectItem>
                          <SelectItem value="sarah.toumi@ecole-islah.fr">Sarah Toumi (Secrétaire)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message-type">Type de message</Label>
                      <Select value={messageType} onValueChange={setMessageType}>
                        <SelectTrigger
                          id="message-type"
                          className="border-gray-200 focus:ring-[#6c63ff] focus:border-[#6c63ff]"
                        >
                          <SelectValue placeholder="Sélectionner un type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="info">Information</SelectItem>
                          <SelectItem value="warning">Avertissement</SelectItem>
                          <SelectItem value="alert">Alerte</SelectItem>
                          <SelectItem value="success">Succès</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message-text">Message</Label>
                      <Textarea
                        id="message-text"
                        placeholder="Saisissez votre message ici..."
                        className="min-h-[120px] border-gray-200 focus:ring-[#6c63ff] focus:border-[#6c63ff]"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="email-copy" />
                      <Label htmlFor="email-copy">Envoyer également par email</Label>
                    </div>

                    <Button
                      className="w-full bg-[#6c63ff] hover:bg-[#5a52e0]"
                      onClick={handleSendMessage}
                      disabled={!selectedUser || !messageText}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Envoyer le message
                    </Button>
                  </div>
                </div>

                {/* Aperçu des messages récents */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-800">Messages récents</h3>

                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <Info className="h-5 w-5 text-blue-500" />
                          <span className="font-medium text-blue-700">Information</span>
                        </div>
                        <span className="text-xs text-gray-500">Aujourd'hui, 09:30</span>
                      </div>
                      <p className="text-blue-700 text-sm mb-2">
                        Rappel : La réunion des enseignants aura lieu demain à 14h dans la salle de conférence.
                      </p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>Envoyé à : Tous les enseignants</span>
                        <span>Par : Ahmed Dubois</span>
                      </div>
                    </div>

                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-amber-500" />
                          <span className="font-medium text-amber-700">Avertissement</span>
                        </div>
                        <span className="text-xs text-gray-500">Hier, 15:45</span>
                      </div>
                      <p className="text-amber-700 text-sm mb-2">
                        Veuillez mettre à jour vos coordonnées avant le 30 octobre pour assurer la bonne communication
                        avec l'école.
                      </p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>Envoyé à : Tous les utilisateurs</span>
                        <span>Par : Ahmed Dubois</span>
                      </div>
                    </div>

                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                          <span className="font-medium text-red-700">Alerte</span>
                        </div>
                        <span className="text-xs text-gray-500">12/10/2023</span>
                      </div>
                      <p className="text-red-700 text-sm mb-2">
                        Fermeture exceptionnelle de l'école le 20 octobre en raison de travaux. Les cours seront assurés
                        à distance.
                      </p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>Envoyé à : Tous les utilisateurs</span>
                        <span>Par : Ahmed Dubois</span>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full border-gray-200 text-gray-700 hover:bg-gray-50">
                    Voir tous les messages
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 mb-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Configuration du système</h2>
                <p className="text-gray-600">Paramètres généraux de la plateforme</p>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="p-4 bg-[#f0eeff] border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <UserCog className="h-5 w-5 text-[#6c63ff]" />
                        <h3 className="font-medium text-[#6c63ff]">Utilisateurs</h3>
                      </div>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-700">Validation automatique</h4>
                          <p className="text-sm text-gray-600">
                            Activer la validation automatique des demandes d'accès
                          </p>
                        </div>
                        <Switch />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-700">Expiration des mots de passe</h4>
                          <p className="text-sm text-gray-600">
                            Forcer le changement de mot de passe tous les 90 jours
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-700">Authentification à deux facteurs</h4>
                          <p className="text-sm text-gray-600">Exiger l'authentification à deux facteurs</p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="p-4 bg-[#e6f4ea] border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-[#34a853]" />
                        <h3 className="font-medium text-[#34a853]">Notifications</h3>
                      </div>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-700">Notifications par email</h4>
                          <p className="text-sm text-gray-600">Envoyer des notifications par email</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-700">Notifications de paiement</h4>
                          <p className="text-sm text-gray-600">Rappels automatiques pour les paiements en retard</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-700">Notifications d'absence</h4>
                          <p className="text-sm text-gray-600">Notifications aux parents en cas d'absence</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="p-4 bg-[#fef7e0] border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-[#fbbc05]" />
                        <h3 className="font-medium text-[#fbbc05]">Sécurité</h3>
                      </div>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-700">Journalisation des activités</h4>
                          <p className="text-sm text-gray-600">Enregistrer toutes les actions des utilisateurs</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-700">Verrouillage de compte</h4>
                          <p className="text-sm text-gray-600">Après 5 tentatives de connexion échouées</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-700">Déconnexion automatique</h4>
                          <p className="text-sm text-gray-600">Après 30 minutes d'inactivité</p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="p-4 bg-[#e8f0fe] border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <School className="h-5 w-5 text-[#4285f4]" />
                        <h3 className="font-medium text-[#4285f4]">Paramètres de l'école</h3>
                      </div>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="school-name">Nom de l'école</Label>
                        <Input
                          id="school-name"
                          defaultValue="École Islah"
                          className="border-gray-200 focus:ring-[#6c63ff] focus:border-[#6c63ff]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="school-address">Adresse</Label>
                        <Input
                          id="school-address"
                          defaultValue="70 Rue des Sorins, 93100 Montreuil"
                          className="border-gray-200 focus:ring-[#6c63ff] focus:border-[#6c63ff]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="school-email">Email de contact</Label>
                        <Input
                          id="school-email"
                          defaultValue="contact@ecole-islah.fr"
                          className="border-gray-200 focus:ring-[#6c63ff] focus:border-[#6c63ff]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="school-phone">Téléphone</Label>
                        <Input
                          id="school-phone"
                          defaultValue="01 XX XX XX XX"
                          className="border-gray-200 focus:ring-[#6c63ff] focus:border-[#6c63ff]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="p-4 bg-[#fff0f9] border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-[#ff63c4]" />
                        <h3 className="font-medium text-[#ff63c4]">Année scolaire</h3>
                      </div>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="school-year">Année scolaire en cours</Label>
                        <Input
                          id="school-year"
                          defaultValue="2023-2024"
                          className="border-gray-200 focus:ring-[#6c63ff] focus:border-[#6c63ff]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="start-date">Date de début</Label>
                        <Input
                          id="start-date"
                          type="date"
                          defaultValue="2023-09-01"
                          className="border-gray-200 focus:ring-[#6c63ff] focus:border-[#6c63ff]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="end-date">Date de fin</Label>
                        <Input
                          id="end-date"
                          type="date"
                          defaultValue="2024-06-30"
                          className="border-gray-200 focus:ring-[#6c63ff] focus:border-[#6c63ff]"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-700">Afficher l'année scolaire</h4>
                          <p className="text-sm text-gray-600">Sur les documents et rapports</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-[#6c63ff] hover:bg-[#5a52e0]">Enregistrer les modifications</Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}


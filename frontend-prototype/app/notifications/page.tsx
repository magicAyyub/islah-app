import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Bell,
  Mail,
  MessageSquare,
  Send,
  Calendar,
  Users,
  CheckCircle,
  Info,
  PlusCircle,
  Copy,
  AlertCircle,
  FileText,
  Image,
  Paperclip,
  Smile,
  BookOpen,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0eeff] to-white">
      <div className="container mx-auto py-10 px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 border-[#e0ddff] text-[#6c63ff] hover:bg-[#f0eeff] hover:text-[#5a52e0]"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-[#2d2a54]">Notifications</h1>
          </div>
        </div>

        <Tabs defaultValue="new" className="mb-8">
          <TabsList className="mb-6 bg-[#f0eeff] text-[#6c63ff] rounded-full overflow-hidden">
            <TabsTrigger
              value="new"
              className="rounded-full data-[state=active]:bg-[#6c63ff] data-[state=active]:text-white"
            >
              Nouvelle notification
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="rounded-full data-[state=active]:bg-[#6c63ff] data-[state=active]:text-white"
            >
              Historique
            </TabsTrigger>
            <TabsTrigger
              value="templates"
              className="rounded-full data-[state=active]:bg-[#6c63ff] data-[state=active]:text-white"
            >
              Modèles
            </TabsTrigger>
          </TabsList>

          <TabsContent value="new">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#e0ddff]">
              <div className="p-6 border-b border-[#e0ddff]">
                <h2 className="text-xl font-semibold text-[#2d2a54]">Créer une notification</h2>
                <p className="text-[#6c63ff]">Envoyez facilement un message aux parents</p>
              </div>

              <div className="p-6">
                <div className="max-w-3xl mx-auto">
                  {/* Étape 1: Choisir le type de notification */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-[#2d2a54] mb-4">1. Choisir le type de notification</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="relative">
                        <input
                          type="radio"
                          id="email"
                          name="notification-type"
                          className="peer sr-only"
                          defaultChecked
                        />
                        <label
                          htmlFor="email"
                          className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-[#e0ddff] bg-white cursor-pointer hover:bg-[#f0eeff] transition-colors peer-checked:border-[#6c63ff] peer-checked:bg-[#f0eeff]"
                        >
                          <Mail className="h-8 w-8 text-[#6c63ff] mb-2" />
                          <span className="font-medium text-[#2d2a54]">Email</span>
                          <span className="text-xs text-[#6c63ff] mt-1">Envoi par email</span>
                          <div className="absolute top-2 right-2 w-4 h-4 rounded-full border-2 border-[#e0ddff] peer-checked:border-[#6c63ff] peer-checked:bg-[#6c63ff] hidden peer-checked:flex items-center justify-center">
                            <CheckCircle className="h-3 w-3 text-white" />
                          </div>
                        </label>
                      </div>

                      <div className="relative">
                        <input type="radio" id="sms" name="notification-type" className="peer sr-only" />
                        <label
                          htmlFor="sms"
                          className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-[#e0ddff] bg-white cursor-pointer hover:bg-[#f0eeff] transition-colors peer-checked:border-[#6c63ff] peer-checked:bg-[#f0eeff]"
                        >
                          <MessageSquare className="h-8 w-8 text-[#6c63ff] mb-2" />
                          <span className="font-medium text-[#2d2a54]">SMS</span>
                          <span className="text-xs text-[#6c63ff] mt-1">Envoi par SMS</span>
                          <div className="absolute top-2 right-2 w-4 h-4 rounded-full border-2 border-[#e0ddff] peer-checked:border-[#6c63ff] peer-checked:bg-[#6c63ff] hidden peer-checked:flex items-center justify-center">
                            <CheckCircle className="h-3 w-3 text-white" />
                          </div>
                        </label>
                      </div>

                      <div className="relative">
                        <input type="radio" id="both" name="notification-type" className="peer sr-only" />
                        <label
                          htmlFor="both"
                          className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-[#e0ddff] bg-white cursor-pointer hover:bg-[#f0eeff] transition-colors peer-checked:border-[#6c63ff] peer-checked:bg-[#6c63ff]"
                        >
                          <Bell className="h-8 w-8 text-[#6c63ff] mb-2" />
                          <span className="font-medium text-[#2d2a54]">Les deux</span>
                          <span className="text-xs text-[#6c63ff] mt-1">Email + SMS</span>
                          <div className="absolute top-2 right-2 w-4 h-4 rounded-full border-2 border-[#e0ddff] peer-checked:border-[#6c63ff] peer-checked:bg-[#6c63ff] hidden peer-checked:flex items-center justify-center">
                            <CheckCircle className="h-3 w-3 text-white" />
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Étape 2: Sélectionner les destinataires */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-[#2d2a54] mb-4">2. Sélectionner les destinataires</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <input
                          type="radio"
                          id="all-parents"
                          name="recipients"
                          className="peer sr-only"
                          defaultChecked
                        />
                        <label
                          htmlFor="all-parents"
                          className="flex items-center p-4 rounded-xl border-2 border-[#e0ddff] bg-white cursor-pointer hover:bg-[#f0eeff] transition-colors peer-checked:border-[#6c63ff] peer-checked:bg-[#f0eeff]"
                        >
                          <Users className="h-6 w-6 text-[#6c63ff] mr-3" />
                          <div>
                            <span className="font-medium text-[#2d2a54] block">Tous les parents</span>
                            <span className="text-xs text-[#6c63ff]">45 destinataires</span>
                          </div>
                          <div className="absolute top-2 right-2 w-4 h-4 rounded-full border-2 border-[#e0ddff] peer-checked:border-[#6c63ff] peer-checked:bg-[#6c63ff] hidden peer-checked:flex items-center justify-center">
                            <CheckCircle className="h-3 w-3 text-white" />
                          </div>
                        </label>
                      </div>

                      <div className="relative">
                        <input type="radio" id="class-parents" name="recipients" className="peer sr-only" />
                        <label
                          htmlFor="class-parents"
                          className="flex items-center p-4 rounded-xl border-2 border-[#e0ddff] bg-white cursor-pointer hover:bg-[#f0eeff] transition-colors peer-checked:border-[#6c63ff] peer-checked:bg-[#f0eeff]"
                        >
                          <BookOpen className="h-6 w-6 text-[#6c63ff] mr-3" />
                          <div>
                            <span className="font-medium text-[#2d2a54] block">Par classe</span>
                            <span className="text-xs text-[#6c63ff]">Sélectionner une classe</span>
                          </div>
                          <div className="absolute top-2 right-2 w-4 h-4 rounded-full border-2 border-[#e0ddff] peer-checked:border-[#6c63ff] peer-checked:bg-[#6c63ff] hidden peer-checked:flex items-center justify-center">
                            <CheckCircle className="h-3 w-3 text-white" />
                          </div>
                        </label>
                      </div>

                      <div className="relative">
                        <input type="radio" id="payment-parents" name="recipients" className="peer sr-only" />
                        <label
                          htmlFor="payment-parents"
                          className="flex items-center p-4 rounded-xl border-2 border-[#e0ddff] bg-white cursor-pointer hover:bg-[#f0eeff] transition-colors peer-checked:border-[#6c63ff] peer-checked:bg-[#f0eeff]"
                        >
                          <AlertCircle className="h-6 w-6 text-[#6c63ff] mr-3" />
                          <div>
                            <span className="font-medium text-[#2d2a54] block">Paiements en retard</span>
                            <span className="text-xs text-[#6c63ff]">5 destinataires</span>
                          </div>
                          <div className="absolute top-2 right-2 w-4 h-4 rounded-full border-2 border-[#e0ddff] peer-checked:border-[#6c63ff] peer-checked:bg-[#6c63ff] hidden peer-checked:flex items-center justify-center">
                            <CheckCircle className="h-3 w-3 text-white" />
                          </div>
                        </label>
                      </div>

                      <div className="relative">
                        <input type="radio" id="custom-parents" name="recipients" className="peer sr-only" />
                        <label
                          htmlFor="custom-parents"
                          className="flex items-center p-4 rounded-xl border-2 border-[#e0ddff] bg-white cursor-pointer hover:bg-[#f0eeff] transition-colors peer-checked:border-[#6c63ff] peer-checked:bg-[#f0eeff]"
                        >
                          <Users className="h-6 w-6 text-[#6c63ff] mr-3" />
                          <div>
                            <span className="font-medium text-[#2d2a54] block">Sélection personnalisée</span>
                            <span className="text-xs text-[#6c63ff]">Choisir des parents spécifiques</span>
                          </div>
                          <div className="absolute top-2 right-2 w-4 h-4 rounded-full border-2 border-[#e0ddff] peer-checked:border-[#6c63ff] peer-checked:bg-[#6c63ff] hidden peer-checked:flex items-center justify-center">
                            <CheckCircle className="h-3 w-3 text-white" />
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Étape 3: Composer le message */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-[#2d2a54] mb-4">3. Composer le message</h3>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-[#2d2a54] mb-2">Sujet</label>
                      <Input
                        placeholder="Entrez le sujet de votre message"
                        className="border-[#e0ddff] focus:ring-[#6c63ff] focus:border-[#6c63ff]"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-[#2d2a54] mb-2">Message</label>
                      <div className="border border-[#e0ddff] rounded-lg overflow-hidden">
                        <div className="bg-[#f0eeff] p-2 flex items-center gap-2 border-b border-[#e0ddff]">
                          <button className="p-1.5 rounded hover:bg-white/50 transition-colors">
                            <FileText className="h-4 w-4 text-[#6c63ff]" />
                          </button>
                          <button className="p-1.5 rounded hover:bg-white/50 transition-colors">
                            <Image className="h-4 w-4 text-[#6c63ff]" />
                          </button>
                          <button className="p-1.5 rounded hover:bg-white/50 transition-colors">
                            <Paperclip className="h-4 w-4 text-[#6c63ff]" />
                          </button>
                          <button className="p-1.5 rounded hover:bg-white/50 transition-colors">
                            <Smile className="h-4 w-4 text-[#6c63ff]" />
                          </button>
                        </div>
                        <Textarea
                          placeholder="Écrivez votre message ici..."
                          className="border-0 focus:ring-0 min-h-[200px] resize-none"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-[#2d2a54] mb-2">Utiliser un modèle</label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="relative">
                          <input
                            type="radio"
                            id="template-none"
                            name="template"
                            className="peer sr-only"
                            defaultChecked
                          />
                          <label
                            htmlFor="template-none"
                            className="flex flex-col p-3 rounded-lg border border-[#e0ddff] bg-white cursor-pointer hover:bg-[#f0eeff] transition-colors peer-checked:border-[#6c63ff] peer-checked:bg-[#f0eeff] h-full"
                          >
                            <span className="font-medium text-[#2d2a54] text-sm">Aucun modèle</span>
                            <span className="text-xs text-[#6c63ff]">Message personnalisé</span>
                          </label>
                        </div>

                        <div className="relative">
                          <input type="radio" id="template-payment" name="template" className="peer sr-only" />
                          <label
                            htmlFor="template-payment"
                            className="flex flex-col p-3 rounded-lg border border-[#e0ddff] bg-white cursor-pointer hover:bg-[#f0eeff] transition-colors peer-checked:border-[#6c63ff] peer-checked:bg-[#f0eeff] h-full"
                          >
                            <span className="font-medium text-[#2d2a54] text-sm">Rappel de paiement</span>
                            <span className="text-xs text-[#6c63ff]">Pour les paiements en retard</span>
                          </label>
                        </div>

                        <div className="relative">
                          <input type="radio" id="template-event" name="template" className="peer sr-only" />
                          <label
                            htmlFor="template-event"
                            className="flex flex-col p-3 rounded-lg border border-[#e0ddff] bg-white cursor-pointer hover:bg-[#f0eeff] transition-colors peer-checked:border-[#6c63ff] peer-checked:bg-[#f0eeff] h-full"
                          >
                            <span className="font-medium text-[#2d2a54] text-sm">Événement à venir</span>
                            <span className="text-xs text-[#6c63ff]">Pour annoncer un événement</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Étape 4: Planifier l'envoi */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-[#2d2a54] mb-4">4. Planifier l'envoi</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <input type="radio" id="send-now" name="schedule" className="peer sr-only" defaultChecked />
                        <label
                          htmlFor="send-now"
                          className="flex items-center p-4 rounded-xl border-2 border-[#e0ddff] bg-white cursor-pointer hover:bg-[#f0eeff] transition-colors peer-checked:border-[#6c63ff] peer-checked:bg-[#f0eeff]"
                        >
                          <Send className="h-6 w-6 text-[#6c63ff] mr-3" />
                          <div>
                            <span className="font-medium text-[#2d2a54] block">Envoyer maintenant</span>
                            <span className="text-xs text-[#6c63ff]">Envoi immédiat</span>
                          </div>
                          <div className="absolute top-2 right-2 w-4 h-4 rounded-full border-2 border-[#e0ddff] peer-checked:border-[#6c63ff] peer-checked:bg-[#6c63ff] hidden peer-checked:flex items-center justify-center">
                            <CheckCircle className="h-3 w-3 text-white" />
                          </div>
                        </label>
                      </div>

                      <div className="relative">
                        <input type="radio" id="send-later" name="schedule" className="peer sr-only" />
                        <label
                          htmlFor="send-later"
                          className="flex items-center p-4 rounded-xl border-2 border-[#e0ddff] bg-white cursor-pointer hover:bg-[#f0eeff] transition-colors peer-checked:border-[#6c63ff] peer-checked:bg-[#f0eeff]"
                        >
                          <Calendar className="h-6 w-6 text-[#6c63ff] mr-3" />
                          <div>
                            <span className="font-medium text-[#2d2a54] block">Planifier</span>
                            <span className="text-xs text-[#6c63ff]">Choisir une date et heure</span>
                          </div>
                          <div className="absolute top-2 right-2 w-4 h-4 rounded-full border-2 border-[#e0ddff] peer-checked:border-[#6c63ff] peer-checked:bg-[#6c63ff] hidden peer-checked:flex items-center justify-center">
                            <CheckCircle className="h-3 w-3 text-white" />
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Aperçu et envoi */}
                  <div className="bg-[#f0eeff] p-6 rounded-xl border border-[#e0ddff] mb-6">
                    <h3 className="text-lg font-medium text-[#2d2a54] mb-4">Aperçu de la notification</h3>
                    <div className="bg-white rounded-lg p-4 border border-[#e0ddff] mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Mail className="h-4 w-4 text-[#6c63ff]" />
                        <span className="text-sm font-medium text-[#2d2a54]">Email</span>
                      </div>
                      <div className="text-sm text-[#2d2a54] mb-1 font-medium">À: Tous les parents (45)</div>
                      <div className="text-sm text-[#2d2a54] mb-3 font-medium">Sujet: [Votre sujet apparaîtra ici]</div>
                      <div className="text-sm text-[#6c63ff] p-3 bg-[#f0eeff] rounded border border-[#e0ddff]">
                        Votre message apparaîtra ici...
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <Button variant="outline" className="border-[#e0ddff] text-[#6c63ff] hover:bg-[#f0eeff]">
                        Modifier
                      </Button>
                      <Button className="bg-[#6c63ff] hover:bg-[#5a52e0]">
                        <Send className="mr-2 h-4 w-4" />
                        Envoyer la notification
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#e0ddff]">
              <div className="p-6 border-b border-[#e0ddff]">
                <h2 className="text-xl font-semibold text-[#2d2a54]">Historique des notifications</h2>
                <p className="text-[#6c63ff]">Consultez les notifications envoyées précédemment</p>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {/* Notification 1 */}
                  <div className="bg-white rounded-lg p-4 border border-[#e0ddff] hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#e6fff0] flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-[#2ecc71]" />
                        </div>
                        <div>
                          <h3 className="font-medium text-[#2d2a54]">Rappel de paiement</h3>
                          <div className="text-sm text-[#6c63ff]">Envoyée le 15/10/2023 à 10:00</div>
                        </div>
                      </div>
                      <Badge className="bg-[#e6fff0] text-[#2ecc71] border-0">Envoyée</Badge>
                    </div>

                    <div className="flex items-center gap-3 mb-3 text-sm text-[#6c63ff]">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>12 destinataires</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        <span>Email</span>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#e0ddff] text-[#6c63ff] hover:bg-[#f0eeff]"
                      >
                        <Info className="h-4 w-4 mr-1" /> Détails
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#e0ddff] text-[#6c63ff] hover:bg-[#f0eeff]"
                      >
                        <Copy className="h-4 w-4 mr-1" /> Dupliquer
                      </Button>
                    </div>
                  </div>

                  {/* Notification 2 */}
                  <div className="bg-white rounded-lg p-4 border border-[#e0ddff] hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#e6fff0] flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-[#2ecc71]" />
                        </div>
                        <div>
                          <h3 className="font-medium text-[#2d2a54]">Fermeture exceptionnelle</h3>
                          <div className="text-sm text-[#6c63ff]">Envoyée le 01/10/2023 à 14:00</div>
                        </div>
                      </div>
                      <Badge className="bg-[#e6fff0] text-[#2ecc71] border-0">Envoyée</Badge>
                    </div>

                    <div className="flex items-center gap-3 mb-3 text-sm text-[#6c63ff]">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>45 destinataires</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        <span>Email</span>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#e0ddff] text-[#6c63ff] hover:bg-[#f0eeff]"
                      >
                        <Info className="h-4 w-4 mr-1" /> Détails
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#e0ddff] text-[#6c63ff] hover:bg-[#f0eeff]"
                      >
                        <Copy className="h-4 w-4 mr-1" /> Dupliquer
                      </Button>
                    </div>
                  </div>

                  {/* Notification 3 */}
                  <div className="bg-white rounded-lg p-4 border border-[#e0ddff] hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#e6fff0] flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-[#2ecc71]" />
                        </div>
                        <div>
                          <h3 className="font-medium text-[#2d2a54]">Bienvenue à l'école Islah</h3>
                          <div className="text-sm text-[#6c63ff]">Envoyée le 15/09/2023 à 09:00</div>
                        </div>
                      </div>
                      <Badge className="bg-[#e6fff0] text-[#2ecc71] border-0">Envoyée</Badge>
                    </div>

                    <div className="flex items-center gap-3 mb-3 text-sm text-[#6c63ff]">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>15 destinataires</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        <span>Email</span>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#e0ddff] text-[#6c63ff] hover:bg-[#f0eeff]"
                      >
                        <Info className="h-4 w-4 mr-1" /> Détails
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#e0ddff] text-[#6c63ff] hover:bg-[#f0eeff]"
                      >
                        <Copy className="h-4 w-4 mr-1" /> Dupliquer
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="templates">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#e0ddff]">
              <div className="p-6 border-b border-[#e0ddff]">
                <h2 className="text-xl font-semibold text-[#2d2a54]">Modèles de notification</h2>
                <p className="text-[#6c63ff]">Utilisez des modèles prédéfinis pour gagner du temps</p>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Modèle 1 */}
                  <div className="bg-white rounded-lg border border-[#e0ddff] overflow-hidden hover:shadow-md transition-all">
                    <div className="p-4 bg-[#6c63ff] text-white">
                      <h3 className="font-medium">Rappel de paiement</h3>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-[#6c63ff] mb-4 line-clamp-3">
                        Chers parents, nous vous rappelons que le paiement du trimestre doit être effectué avant la date
                        limite. Merci de votre attention.
                      </p>
                      <div className="flex justify-between items-center">
                        <Badge className="bg-[#f0eeff] text-[#6c63ff] border-0">Administratif</Badge>
                        <Button size="sm" className="h-8 bg-[#6c63ff] hover:bg-[#5a52e0]">
                          Utiliser
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Modèle 2 */}
                  <div className="bg-white rounded-lg border border-[#e0ddff] overflow-hidden hover:shadow-md transition-all">
                    <div className="p-4 bg-[#e74c3c] text-white">
                      <h3 className="font-medium">Absence non justifiée</h3>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-[#6c63ff] mb-4 line-clamp-3">
                        Chers parents, nous vous informons que votre enfant était absent aujourd'hui et que nous n'avons
                        pas reçu de justification. Merci de nous contacter.
                      </p>
                      <div className="flex justify-between items-center">
                        <Badge className="bg-[#ffeeee] text-[#e74c3c] border-0">Assiduité</Badge>
                        <Button size="sm" className="h-8 bg-[#6c63ff] hover:bg-[#5a52e0]">
                          Utiliser
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Modèle 3 */}
                  <div className="bg-white rounded-lg border border-[#e0ddff] overflow-hidden hover:shadow-md transition-all">
                    <div className="p-4 bg-[#3498db] text-white">
                      <h3 className="font-medium">Bulletin disponible</h3>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-[#6c63ff] mb-4 line-clamp-3">
                        Chers parents, les bulletins du trimestre sont désormais disponibles. Vous pouvez les consulter
                        dans votre espace parent ou les récupérer auprès du secrétariat.
                      </p>
                      <div className="flex justify-between items-center">
                        <Badge className="bg-[#e0f0ff] text-[#3498db] border-0">Académique</Badge>
                        <Button size="sm" className="h-8 bg-[#6c63ff] hover:bg-[#5a52e0]">
                          Utiliser
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Ajouter un modèle */}
                  <div className="bg-white rounded-lg border border-dashed border-[#e0ddff] overflow-hidden hover:shadow-md transition-all flex items-center justify-center p-8">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-[#f0eeff] flex items-center justify-center mx-auto mb-4">
                        <PlusCircle className="h-8 w-8 text-[#6c63ff]" />
                      </div>
                      <h3 className="text-lg font-medium text-[#2d2a54] mb-2">Créer un modèle</h3>
                      <p className="text-sm text-[#6c63ff] mb-4">
                        Ajoutez un nouveau modèle pour vos notifications récurrentes
                      </p>
                      <Button className="bg-[#6c63ff] hover:bg-[#5a52e0]">Nouveau modèle</Button>
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


import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, User, Users, Calendar, CreditCard } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function NewStudentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <div className="container mx-auto py-10 px-4">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/students">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-10 w-10 border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-emerald-900">Nouvelle Inscription</h1>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-emerald-100 max-w-4xl mx-auto">
          <div className="p-6 bg-emerald-600 text-white">
            <h2 className="text-xl font-semibold">Formulaire d'inscription</h2>
            <p className="text-emerald-100">Remplissez les informations de l'élève pour l'inscrire à l'école</p>
          </div>

          <Tabs defaultValue="student" className="p-6">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger
                value="student"
                className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-900"
              >
                <User className="mr-2 h-4 w-4" />
                Élève
              </TabsTrigger>
              <TabsTrigger
                value="parents"
                className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-900"
              >
                <Users className="mr-2 h-4 w-4" />
                Parents
              </TabsTrigger>
              <TabsTrigger
                value="payment"
                className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-900"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Paiement
              </TabsTrigger>
            </TabsList>

            <TabsContent value="student" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="firstName" className="text-emerald-900">
                    Prénom
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="Prénom de l'élève"
                    className="border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="lastName" className="text-emerald-900">
                    Nom
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Nom de l'élève"
                    className="border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="birthdate" className="text-emerald-900">
                    Date de naissance
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                    <Input
                      id="birthdate"
                      type="date"
                      className="pl-9 border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="gender" className="text-emerald-900">
                    Genre
                  </Label>
                  <Select>
                    <SelectTrigger
                      id="gender"
                      className="border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Garçon</SelectItem>
                      <SelectItem value="female">Fille</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="level" className="text-emerald-900">
                    Niveau
                  </Label>
                  <Select>
                    <SelectTrigger
                      id="level"
                      className="border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <SelectValue placeholder="Sélectionner un niveau" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maternelle1">Maternelle 1</SelectItem>
                      <SelectItem value="maternelle2">Maternelle 2</SelectItem>
                      <SelectItem value="primaire1">Primaire 1</SelectItem>
                      <SelectItem value="primaire2">Primaire 2</SelectItem>
                      <SelectItem value="primaire3">Primaire 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="schedule" className="text-emerald-900">
                    Créneau horaire
                  </Label>
                  <Select>
                    <SelectTrigger
                      id="schedule"
                      className="border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <SelectValue placeholder="Sélectionner un créneau" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Matin (10h-13h)</SelectItem>
                      <SelectItem value="afternoon">Après-midi (14h-17h)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="notes" className="text-emerald-900">
                  Notes supplémentaires
                </Label>
                <textarea
                  id="notes"
                  rows={3}
                  placeholder="Informations complémentaires sur l'élève..."
                  className="w-full rounded-md border border-emerald-200 p-3 text-sm focus:ring-emerald-500 focus:border-emerald-500"
                ></textarea>
              </div>

              <div className="flex justify-end">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Continuer
                  <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="parents" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="parentFirstName" className="text-emerald-900">
                    Prénom du parent
                  </Label>
                  <Input
                    id="parentFirstName"
                    placeholder="Prénom du parent"
                    className="border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="parentLastName" className="text-emerald-900">
                    Nom du parent
                  </Label>
                  <Input
                    id="parentLastName"
                    placeholder="Nom du parent"
                    className="border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-emerald-900">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@exemple.com"
                    className="border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="phone" className="text-emerald-900">
                    Téléphone
                  </Label>
                  <Input
                    id="phone"
                    placeholder="06 XX XX XX XX"
                    className="border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="address" className="text-emerald-900">
                  Adresse
                </Label>
                <Input
                  id="address"
                  placeholder="Adresse complète"
                  className="border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="relationship" className="text-emerald-900">
                  Lien de parenté
                </Label>
                <Select>
                  <SelectTrigger
                    id="relationship"
                    className="border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="father">Père</SelectItem>
                    <SelectItem value="mother">Mère</SelectItem>
                    <SelectItem value="guardian">Tuteur légal</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  className="border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Retour
                </Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Continuer
                  <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="payment" className="space-y-6">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-6">
                <h3 className="font-medium text-amber-800 mb-2">Frais d'inscription</h3>
                <p className="text-amber-700 text-sm">
                  Les frais d'inscription s'élèvent à 50€ et doivent être réglés pour valider l'inscription.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="paymentMethod" className="text-emerald-900">
                    Méthode de paiement
                  </Label>
                  <Select>
                    <SelectTrigger
                      id="paymentMethod"
                      className="border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Espèces</SelectItem>
                      <SelectItem value="check">Chèque</SelectItem>
                      <SelectItem value="card">Carte Bancaire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="amount" className="text-emerald-900">
                    Montant
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    defaultValue="50.00"
                    className="border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="paymentNotes" className="text-emerald-900">
                  Notes de paiement
                </Label>
                <textarea
                  id="paymentNotes"
                  rows={3}
                  placeholder="Informations complémentaires sur le paiement..."
                  className="w-full rounded-md border border-emerald-200 p-3 text-sm focus:ring-emerald-500 focus:border-emerald-500"
                ></textarea>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <h3 className="font-medium text-emerald-800 mb-2">Paiements trimestriels</h3>
                <p className="text-emerald-700 text-sm">
                  Les paiements trimestriels de 150€ seront à effectuer aux dates suivantes :
                </p>
                <ul className="text-emerald-700 text-sm mt-2 space-y-1">
                  <li>• 1er trimestre : 15 septembre 2023</li>
                  <li>• 2ème trimestre : 15 décembre 2023</li>
                  <li>• 3ème trimestre : 15 mars 2024</li>
                </ul>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  className="border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Retour
                </Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Save className="mr-2 h-4 w-4" />
                  Finaliser l'inscription
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}


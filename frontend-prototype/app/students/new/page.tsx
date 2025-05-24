"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, User, Users, Calendar, CreditCard, CheckCircle2, ChevronRight } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { searchParents, createParent } from "@/app/lib/api"

export default function NewStudentPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [student, setStudent] = useState({
    firstName: "",
    lastName: "",
    birthdate: "",
    gender: "",
    level: "",
    schedule: "",
    notes: ""
  })
  const [parentSearch, setParentSearch] = useState("")
  const [parentOptions, setParentOptions] = useState<any[]>([])
  const [selectedParent, setSelectedParent] = useState<any | null>(null)
  const [creatingParent, setCreatingParent] = useState(false)
  const [parentForm, setParentForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    username: "",
  })
  const [parentLoading, setParentLoading] = useState(false)
  const [payment, setPayment] = useState({
    paymentMethod: "",
    amount: "50.00",
    paymentNotes: ""
  })

  // Validation par étape
  const isStudentStepValid = student.firstName && student.lastName && student.birthdate && student.gender && student.level && student.schedule
  const isParentStepValid = selectedParent
  const isPaymentStepValid = payment.paymentMethod && payment.amount

  const handleNext = () => {
    if (currentStep === 1 && isParentStepValid) setCurrentStep(2)
    if (currentStep === 2 && isStudentStepValid) setCurrentStep(3)
  }
  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }
  // Navigation par clic sur les étapes
  const handleStepClick = (step: number) => {
    if (step < currentStep) setCurrentStep(step)
  }

  // Génère un mot de passe aléatoire
  function generatePassword(length = 10) {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
    let pwd = "";
    for (let i = 0; i < length; i++) pwd += chars[Math.floor(Math.random() * chars.length)];
    return pwd;
  }

  // Recherche de parents existants
  useEffect(() => {
    if (parentSearch.length < 2) return setParentOptions([]);
    setParentLoading(true);
    searchParents(parentSearch)
      .then(setParentOptions)
      .catch(() => setParentOptions([]))
      .finally(() => setParentLoading(false));
  }, [parentSearch]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto py-10 px-4">
        {/* Header Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center gap-3 mb-8">
            <Link href="/students">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 border-gray-200 text-[#6c63ff] hover:bg-[#f0eeff] hover:text-[#5a52e0]"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Nouvelle Inscription</h1>
              <p className="text-gray-600 mt-1">Complétez les informations pour inscrire un nouvel élève</p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              {/* Step 1 */}
              <button type="button" onClick={() => handleStepClick(1)} className="flex items-center gap-2 group focus:outline-none">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${currentStep === 1 ? 'bg-[#6c63ff] text-white' : 'bg-[#f0eeff] text-[#6c63ff] group-hover:bg-[#e0dfff]'}`}>1</div>
                <span className={`font-medium transition-colors ${currentStep === 1 ? 'text-[#6c63ff]' : 'text-gray-500 group-hover:text-[#6c63ff]'}`}>Informations de l'élève</span>
              </button>
              <div className="flex-1 h-[2px] mx-4 bg-gray-200">
                <div className="h-full bg-[#6c63ff] transition-all duration-300" style={{ width: currentStep >= 2 ? '100%' : '0%' }} />
              </div>
              {/* Step 2 */}
              <button type="button" onClick={() => handleStepClick(2)} disabled={currentStep < 2} className={`flex items-center gap-2 group focus:outline-none ${currentStep < 2 ? 'cursor-not-allowed opacity-50' : ''}`}> 
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${currentStep === 2 ? 'bg-[#6c63ff] text-white' : 'bg-[#f0eeff] text-[#6c63ff] group-hover:bg-[#e0dfff]'}`}>2</div>
                <span className={`font-medium transition-colors ${currentStep === 2 ? 'text-[#6c63ff]' : 'text-gray-500 group-hover:text-[#6c63ff]'}`}>Informations des parents</span>
              </button>
              <div className="flex-1 h-[2px] mx-4 bg-gray-200">
                <div className="h-full bg-[#6c63ff] transition-all duration-300" style={{ width: currentStep >= 3 ? '100%' : '0%' }} />
              </div>
              {/* Step 3 */}
              <button type="button" onClick={() => handleStepClick(3)} disabled={currentStep < 3} className={`flex items-center gap-2 group focus:outline-none ${currentStep < 3 ? 'cursor-not-allowed opacity-50' : ''}`}> 
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${currentStep === 3 ? 'bg-[#6c63ff] text-white' : 'bg-[#f0eeff] text-[#6c63ff] group-hover:bg-[#e0dfff]'}`}>3</div>
                <span className={`font-medium transition-colors ${currentStep === 3 ? 'text-[#6c63ff]' : 'text-gray-500 group-hover:text-[#6c63ff]'}`}>Paiement</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <Card className="border-none shadow-lg">
            {/* Header violet sans arrondi haut */}
            <div className="bg-gradient-to-r from-[#6c63ff] to-[#5a52e0] text-white px-6 pt-6 pb-4">
              <div className="text-xl font-semibold">Formulaire d'inscription</div>
              <div className="text-white/80">Remplissez les informations de l'élève pour l'inscrire à l'école</div>
            </div>
            <CardContent className="p-6">
              <Tabs value={currentStep === 1 ? "parent" : currentStep === 2 ? "student" : "payment"} className="space-y-6">
                <TabsList className="grid grid-cols-3 mb-8 bg-gray-50 p-1 rounded-xl">
                  <TabsTrigger value="parent" className="data-[state=active]:bg-white data-[state=active]:text-[#6c63ff] data-[state=active]:shadow-sm rounded-lg"> <User className="mr-2 h-4 w-4" /> Parent </TabsTrigger>
                  <TabsTrigger value="student" className="data-[state=active]:bg-white data-[state=active]:text-[#6c63ff] data-[state=active]:shadow-sm rounded-lg"> <User className="mr-2 h-4 w-4" /> Élève </TabsTrigger>
                  <TabsTrigger value="payment" className="data-[state=active]:bg-white data-[state=active]:text-[#6c63ff] data-[state=active]:shadow-sm rounded-lg"> <CreditCard className="mr-2 h-4 w-4" /> Paiement </TabsTrigger>
                </TabsList>

                {/* Étape Parent */}
                <TabsContent value="parent" className="space-y-6">
                  <div>
                    <Label className="text-gray-700 font-medium">Parent</Label>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full border border-gray-200 rounded-lg h-11 px-3 focus:ring-[#6c63ff] focus:border-[#6c63ff]"
                        placeholder="Rechercher un parent par nom ou email..."
                        value={parentSearch}
                        onChange={e => {
                          setParentSearch(e.target.value);
                          setCreatingParent(false);
                        }}
                        disabled={!!selectedParent}
                      />
                      {parentLoading && <div className="absolute right-3 top-3 text-gray-400 text-xs">Recherche...</div>}
                      {parentOptions.length > 0 && !selectedParent && (
                        <div className="absolute z-10 bg-white border border-gray-200 rounded-lg mt-1 w-full max-h-60 overflow-auto shadow-lg">
                          {parentOptions.map((p) => (
                            <div
                              key={p.id}
                              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                              onClick={() => { setSelectedParent(p); setParentSearch(""); }}
                            >
                              <div className="w-8 h-8 rounded-full bg-[#f0eeff] flex items-center justify-center text-[#6c63ff] font-bold">
                                {p.first_name[0]}{p.last_name[0]}
                              </div>
                              <div>
                                <div className="font-medium text-gray-800">{p.first_name} {p.last_name}</div>
                                <div className="text-xs text-gray-500">{p.email}</div>
                              </div>
                            </div>
                          ))}
                          <div className="px-4 py-2 text-sm text-gray-500 cursor-pointer hover:bg-gray-50" onClick={() => setCreatingParent(true)}>+ Créer un nouveau parent</div>
                        </div>
                      )}
                      {selectedParent && (
                        <div className="flex items-center gap-3 mt-2 p-3 bg-[#f0eeff] rounded-lg">
                          <div className="w-8 h-8 rounded-full bg-[#6c63ff] text-white flex items-center justify-center font-bold">
                            {selectedParent.first_name[0]}{selectedParent.last_name[0]}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-800">{selectedParent.first_name} {selectedParent.last_name}</div>
                            <div className="text-xs text-gray-500">{selectedParent.email}</div>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => setSelectedParent(null)}>Changer</Button>
                        </div>
                      )}
                    </div>
                    {creatingParent && !selectedParent && (
                      <div className="mt-4 space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input placeholder="Prénom" value={parentForm.first_name} onChange={e => setParentForm(f => ({ ...f, first_name: e.target.value }))} />
                          <Input placeholder="Nom" value={parentForm.last_name} onChange={e => setParentForm(f => ({ ...f, last_name: e.target.value }))} />
                        </div>
                        <Input placeholder="Email" value={parentForm.email} onChange={e => setParentForm(f => ({ ...f, email: e.target.value }))} />
                        <Input placeholder="Téléphone" value={parentForm.phone} onChange={e => setParentForm(f => ({ ...f, phone: e.target.value }))} />
                        <Input placeholder="Adresse" value={parentForm.address} onChange={e => setParentForm(f => ({ ...f, address: e.target.value }))} />
                        <Button
                          className="bg-[#6c63ff] hover:bg-[#5a52e0] mt-2"
                          onClick={async () => {
                            setParentLoading(true);
                            const password = generatePassword();
                            const username = parentForm.email || `${parentForm.first_name}.${parentForm.last_name}`.toLowerCase();
                            try {
                              const newParent = await createParent({ ...parentForm, username, password });
                              setSelectedParent(newParent);
                              setCreatingParent(false);
                            } catch (e) {
                              alert((e as Error).message);
                            } finally {
                              setParentLoading(false);
                            }
                          }}
                          disabled={!parentForm.first_name || !parentForm.last_name || !parentForm.email}
                        >Créer le parent</Button>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end mt-6">
                    <Button onClick={handleNext} className="bg-[#6c63ff] hover:bg-[#5a52e0] px-6 rounded-lg h-11" disabled={!selectedParent}>Continuer <ChevronRight className="ml-2 h-4 w-4" /></Button>
                  </div>
                </TabsContent>

                {/* Étape Élève */}
                <TabsContent value="student" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="firstName" className="text-gray-700 font-medium">Prénom</Label>
                      <Input id="firstName" placeholder="Prénom de l'élève" className="border-gray-200 focus:ring-[#6c63ff] focus:border-[#6c63ff] rounded-lg h-11" value={student.firstName} onChange={e => setStudent({ ...student, firstName: e.target.value })} />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="lastName" className="text-gray-700 font-medium">Nom</Label>
                      <Input id="lastName" placeholder="Nom de l'élève" className="border-gray-200 focus:ring-[#6c63ff] focus:border-[#6c63ff] rounded-lg h-11" value={student.lastName} onChange={e => setStudent({ ...student, lastName: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="birthdate" className="text-gray-700 font-medium">Date de naissance</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6c63ff]" />
                        <Input id="birthdate" type="date" className="pl-9 border-gray-200 focus:ring-[#6c63ff] focus:border-[#6c63ff] rounded-lg h-11" value={student.birthdate} onChange={e => setStudent({ ...student, birthdate: e.target.value })} />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="gender" className="text-gray-700 font-medium">Genre</Label>
                      <Select value={student.gender} onValueChange={v => setStudent({ ...student, gender: v })}>
                        <SelectTrigger id="gender" className="border-gray-200 focus:ring-[#6c63ff] focus:border-[#6c63ff] rounded-lg h-11 px-3 text-gray-700"> <SelectValue placeholder="Sélectionner" /> </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Garçon</SelectItem>
                          <SelectItem value="female">Fille</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="level" className="text-gray-700 font-medium">Niveau</Label>
                      <Select value={student.level} onValueChange={v => setStudent({ ...student, level: v })}>
                        <SelectTrigger id="level" className="border-gray-200 focus:ring-[#6c63ff] focus:border-[#6c63ff] rounded-lg h-11 px-3 text-gray-700"> <SelectValue placeholder="Sélectionner un niveau" /> </SelectTrigger>
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
                      <Label htmlFor="schedule" className="text-gray-700 font-medium">Créneau horaire</Label>
                      <Select value={student.schedule} onValueChange={v => setStudent({ ...student, schedule: v })}>
                        <SelectTrigger id="schedule" className="border-gray-200 focus:ring-[#6c63ff] focus:border-[#6c63ff] rounded-lg h-11 px-3 text-gray-700"> <SelectValue placeholder="Sélectionner un créneau" /> </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">Matin (10h-13h)</SelectItem>
                          <SelectItem value="afternoon">Après-midi (14h-17h)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="notes" className="text-gray-700 font-medium">Notes supplémentaires</Label>
                    <textarea id="notes" rows={3} placeholder="Informations complémentaires sur l'élève..." className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:ring-[#6c63ff] focus:border-[#6c63ff]" value={student.notes} onChange={e => setStudent({ ...student, notes: e.target.value })}></textarea>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleNext} className="bg-[#6c63ff] hover:bg-[#5a52e0] px-6 rounded-lg h-11" disabled={!isStudentStepValid}>Continuer <ChevronRight className="ml-2 h-4 w-4" /></Button>
                  </div>
                </TabsContent>

                {/* Étape Paiement */}
                <TabsContent value="payment" className="space-y-6">
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-6">
                    <h3 className="font-medium text-amber-800 mb-2">Frais d'inscription</h3>
                    <p className="text-amber-700 text-sm">Les frais d'inscription s'élèvent à 50€ et doivent être réglés pour valider l'inscription.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="paymentMethod" className="text-gray-700 font-medium">Méthode de paiement</Label>
                      <Select value={payment.paymentMethod} onValueChange={v => setPayment({ ...payment, paymentMethod: v })}>
                        <SelectTrigger id="paymentMethod" className="border-gray-200 focus:ring-[#6c63ff] focus:border-[#6c63ff] rounded-lg h-11 px-3 text-gray-700"> <SelectValue placeholder="Sélectionner" /> </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Espèces</SelectItem>
                          <SelectItem value="check">Chèque</SelectItem>
                          <SelectItem value="card">Carte Bancaire</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="amount" className="text-gray-700 font-medium">Montant</Label>
                      <Input id="amount" type="number" className="border-gray-200 focus:ring-[#6c63ff] focus:border-[#6c63ff] rounded-lg h-11" value={payment.amount} onChange={e => setPayment({ ...payment, amount: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="paymentNotes" className="text-gray-700 font-medium">Notes de paiement</Label>
                    <textarea id="paymentNotes" rows={3} placeholder="Informations complémentaires sur le paiement..." className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:ring-[#6c63ff] focus:border-[#6c63ff]" value={payment.paymentNotes} onChange={e => setPayment({ ...payment, paymentNotes: e.target.value })}></textarea>
                  </div>
                  <div className="p-4 bg-[#f0eeff] border border-[#e0dfff] rounded-lg">
                    <h3 className="font-medium text-[#6c63ff] mb-2">Paiements trimestriels</h3>
                    <p className="text-[#5a52e0] text-sm mb-3">Les paiements trimestriels de 150€ seront à effectuer aux dates suivantes :</p>
                    <ul className="text-[#5a52e0] text-sm space-y-2">
                      <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#6c63ff]"></div>1er trimestre : 15 septembre 2023</li>
                      <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#6c63ff]"></div>2ème trimestre : 15 décembre 2023</li>
                      <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#6c63ff]"></div>3ème trimestre : 15 mars 2024</li>
                    </ul>
                  </div>
                  <div className="flex justify-between">
                    <Button onClick={handleBack} variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg h-11"> <ArrowLeft className="mr-2 h-4 w-4" /> Retour </Button>
                    <Button className="bg-[#6c63ff] hover:bg-[#5a52e0] px-6 rounded-lg h-11" disabled={!isPaymentStepValid}> <Save className="mr-2 h-4 w-4" /> Finaliser l'inscription </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


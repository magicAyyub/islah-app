"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, CheckCircle2 } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

export default function InscriptionPage() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    dateNaissance: "",
    classe: "",
    nomParent: "",
    emailParent: "",
    telephoneParent: ""
  })
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showParentAssociation, setShowParentAssociation] = useState(false)
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSelectChange = (value: string) => {
    setFormData(prevState => ({
      ...prevState,
      classe: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simuler une requête au backend
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log("Données du formulaire:", formData)
    setIsSubmitting(false)
    setIsSubmitted(true)
    setShowParentAssociation(true)
    toast({
      title: "Inscription réussie",
      description: "L'élève a été inscrit avec succès.",
      duration: 5000,
    })
  }

  const handleParentAssociation = () => {
    // Logique d'association parent-élève
    console.log("Association parent-élève effectuée")
    setShowParentAssociation(false)
    // Réinitialiser le formulaire
    setFormData({
      nom: "",
      prenom: "",
      dateNaissance: "",
      classe: "",
      nomParent: "",
      emailParent: "",
      telephoneParent: ""
    })
    setCurrentStep(0)
    setIsSubmitted(false)
  }

  const steps = [
    {
      title: "Informations de l'élève",
      fields: ["nom", "prenom", "dateNaissance", "classe"]
    },
    {
      title: "Informations du parent/tuteur",
      fields: ["nomParent", "emailParent", "telephoneParent"]
    }
  ]

  const isStepComplete = (step: number) => {
    return steps[step].fields.every(field => formData[field as keyof typeof formData])
  }

  const CustomInput = ({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
    <div className="space-y-2">
      <Label htmlFor={props.id} className="text-sm font-medium text-muted-foreground">
        {label}
      </Label>
      <Input
        {...props}
        className="transition-all duration-200 ease-in-out focus:ring-2 focus:ring-primary focus:border-transparent hover:border-primary"
      />
    </div>
  )

  return (
    <motion.div 
      className="max-w-2xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
    >
      <Card className="w-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="bg-primary text-white">
          <CardTitle className="text-2xl font-bold">Inscription d&apos;un Nouvel Élève</CardTitle>
          <CardDescription className="text-primary-foreground/80">Remplissez le formulaire pour inscrire un nouvel élève à l&apos;École Islah</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={staggerChildren}
              >
                <Tabs value={currentStep.toString()} onValueChange={(value) => setCurrentStep(parseInt(value))}>
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    {steps.map((step, index) => (
                      <TabsTrigger
                        key={index}
                        value={index.toString()}
                        disabled={index > 0 && !isStepComplete(index - 1)}
                        className={cn(
                          "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                          "transition-all duration-200 ease-in-out",
                          "hover:bg-muted/50"
                        )}
                      >
                        {step.title}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {steps.map((step, index) => (
                    <TabsContent key={index} value={index.toString()} className="mt-4">
                      <motion.div
                        variants={staggerChildren}
                        initial="hidden"
                        animate="visible"
                        className="space-y-4"
                      >
                        {step.fields.map(field => (
                          <motion.div key={field} variants={fadeInUp}>
                            {field === "classe" ? (
                              <div className="space-y-2">
                                <Label htmlFor={field} className="text-sm font-medium text-muted-foreground">
                                  Classe
                                </Label>
                                <Select onValueChange={handleSelectChange} value={formData.classe}>
                                  <SelectTrigger className="w-full transition-all duration-200 ease-in-out focus:ring-2 focus:ring-primary focus:border-transparent hover:border-primary">
                                    <SelectValue placeholder="Sélectionnez une classe" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="cp">CP</SelectItem>
                                    <SelectItem value="ce1">CE1</SelectItem>
                                    <SelectItem value="ce2">CE2</SelectItem>
                                    <SelectItem value="cm1">CM1</SelectItem>
                                    <SelectItem value="cm2">CM2</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            ) : (
                              <CustomInput
                                id={field}
                                name={field}
                                label={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                                value={formData[field as keyof typeof formData]}
                                onChange={handleChange}
                                required
                                type={field === "dateNaissance" ? "date" : field === "emailParent" ? "email" : field === "telephoneParent" ? "tel" : "text"}
                              />
                            )}
                          </motion.div>
                        ))}
                      </motion.div>
                    </TabsContent>
                  ))}
                </Tabs>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center h-64"
              >
                <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                <h2 className="text-2xl font-bold text-center mb-2">Inscription Réussie!</h2>
                <p className="text-center text-muted-foreground">L&apos;élève a été inscrit avec succès à l&apos;École Islah.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
        <CardFooter className="bg-muted/50 p-6">
          <div className="flex justify-between w-full">
            {!isSubmitted && (
              <>
                {currentStep > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="transition-all duration-200 ease-in-out hover:bg-primary hover:text-primary-foreground"
                  >
                    Précédent
                  </Button>
                )}
                {currentStep < steps.length - 1 ? (
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    disabled={!isStepComplete(currentStep)}
                    className={cn(
                      "ml-auto transition-all duration-200 ease-in-out",
                      "hover:bg-primary-foreground hover:text-primary"
                    )}
                  >
                    Suivant
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !isStepComplete(currentStep)}
                    className={cn(
                      "ml-auto transition-all duration-200 ease-in-out",
                      "bg-gradient-to-r from-primary to-primary-foreground text-white",
                      "hover:from-primary-foreground hover:to-primary hover:text-primary"
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Inscription en cours...
                      </>
                    ) : (
                      "Terminer l'Inscription"
                    )}
                  </Button>
                )}
              </>
            )}
          </div>
        </CardFooter>
      </Card>
      <Dialog open={showParentAssociation} onOpenChange={setShowParentAssociation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Association Parent-Élève</DialogTitle>
            <DialogDescription>
              Voulez-vous associer cet élève à un parent existant ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowParentAssociation(false)}>Non, créer un nouveau parent</Button>
            <Button onClick={handleParentAssociation}>Oui, associer à un parent existant</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}


"use client"

import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, CheckCircle2, Search, Calendar, Book, User } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { Student, Parent, Class } from "@/types/models"
import { ParentSearch } from "@/components/ParentSearch"

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const CustomInput = ({ label, icon: Icon, ...props }: { label: string; icon: React.ElementType } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <motion.div className="space-y-2" variants={fadeInUp}>
    <Label htmlFor={props.id} className="text-sm font-medium text-muted-foreground flex items-center">
      <Icon className="w-4 h-4 mr-2" />
      {label}
    </Label>
    <div className="relative">
      <Input
        {...props}
        className="pl-10 transition-all duration-200 ease-in-out focus:ring-2 focus:ring-primary focus:border-transparent hover:border-primary"
      />
      <Icon className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
    </div>
  </motion.div>
)

const SuccessMessage = () => (
  <motion.div
    key="success"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="flex flex-col items-center justify-center h-64"
  >
    <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
    <h2 className="text-2xl font-bold text-center mb-2">Welcome to Islah School!</h2>
    <p className="text-center text-muted-foreground">Your journey of knowledge and growth begins now.</p>
  </motion.div>
)

export default function InscriptionPage() {
  const [studentData, setStudentData] = useState<Partial<Student>>({})
  const [parentData, setParentData] = useState<Partial<Parent>>({})
  const [classes, setClasses] = useState<Class[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [parentAssociation, setParentAssociation] = useState<'existing' | 'new' | null>(null)
  const { toast } = useToast()

  const steps = useMemo(() => [
    { title: "Student Details", fields: ["last_name", "first_name", "birth_date", "class_id"] },
    { title: "Guardian Link", fields: [] },
    { title: "Guardian Info", fields: ["last_name", "first_name", "email", "phone"] }
  ], [])

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch('/api/classes')
        if (!response.ok) throw new Error('Failed to fetch classes')
        const data = await response.json()
        setClasses(data)
      } catch (error) {
        console.error('Error fetching classes:', error)
        toast({
          title: "Error",
          description: "Failed to load classes. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchClasses()
  }, [toast])
  
  const handleStudentChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setStudentData(prev => ({
      ...prev,
      [name]: value
    }))
  }, [])

  const handleParentChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setParentData(prev => ({
      ...prev,
      [name]: value
    }))
  }, [])

  const handleClassChange = useCallback((value: string) => {
    setStudentData(prev => ({
      ...prev,
      class_id: parseInt(value)
    }))
  }, [])

  const handleParentSelect = useCallback((parent: Parent) => {
    setParentData(parent)
    setParentAssociation('existing')
    setTimeout(() => {
      setCurrentStep(2)
    }, 300) // Delay to allow for smooth transition
  }, [])

  const handleNewParent = useCallback(() => {
    setParentAssociation('new')
    setCurrentStep(2)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const studentResponse = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData)
      })
      if (!studentResponse.ok) throw new Error('Failed to register student')
      const student = await studentResponse.json()

      if (parentAssociation === 'new') {
        const parentResponse = await fetch('/api/parents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parentData)
        })
        if (!parentResponse.ok) throw new Error('Failed to register parent')
        const parent = await parentResponse.json()
        setParentData(parent)
      }

      const associationResponse = await fetch(`/api/students/${student.id}/associate-parent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parent_id: parentData.id })
      })
      if (!associationResponse.ok) throw new Error('Failed to associate student with parent')

      setIsSubmitted(true)
      toast({
        title: "Welcome to Islah School!",
        description: "Your journey of knowledge and growth begins now.",
        duration: 5000,
      })
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Registration Error",
        description: "An error occurred during registration. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isStepComplete = useCallback((step: number) => {
    if (step === 0) {
      return steps[0].fields.every(field => studentData[field as keyof typeof studentData])
    } else if (step === 1) {
      return parentAssociation !== null
    } else if (step === 2) {
      return parentAssociation === 'existing' || (parentAssociation === 'new' && steps[2].fields.every(field => parentData[field as keyof typeof parentData]))
    }
    return false
  }, [studentData, parentData, steps, parentAssociation])

  useEffect(() => {
    if (isStepComplete(0)) {
      setTimeout(() => setCurrentStep(1), 500)
    }
  }, [studentData, isStepComplete])

  const handleManualTabChange = useCallback((value: string) => {
    const newStep = parseInt(value)
    if (newStep <= currentStep) {
      setCurrentStep(newStep)
    }
  }, [currentStep])

  return (
    <motion.div 
      className="max-w-2xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
    >
      <Card className="w-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="bg-gradient-to-r from-primary to-primary-dark text-white">
          <CardTitle className="text-2xl font-bold">Join the Islah School Family</CardTitle>
          <CardDescription className="text-primary-foreground/80">Embark on a journey of knowledge and growth</CardDescription>
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
                <Tabs 
                  value={currentStep.toString()} 
                  onValueChange={handleManualTabChange}
                  className="transition-all duration-300 ease-in-out"
                >
                  <TabsList className="grid w-full grid-cols-3 mb-6">
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
                  <TabsContent value="0" className="mt-4">
                    <motion.div
                      variants={staggerChildren}
                      initial="hidden"
                      animate="visible"
                      className="space-y-4"
                    >
                      <CustomInput
                        id="student_last_name"
                        name="last_name"
                        label="Family Name"
                        icon={User}
                        value={studentData.last_name || ''}
                        onChange={handleStudentChange}
                        required
                      />
                      <CustomInput
                        id="student_first_name"
                        name="first_name"
                        label="Given Name"
                        icon={User}
                        value={studentData.first_name || ''}
                        onChange={handleStudentChange}
                        required
                      />
                      <CustomInput
                        id="birth_date"
                        name="birth_date"
                        label="Birthday"
                        icon={Calendar}
                        type="date"
                        value={studentData.birth_date || ''}
                        onChange={handleStudentChange}
                        required
                      />
                      <div className="space-y-2">
                        <Label htmlFor="class_id" className="text-sm font-medium text-muted-foreground flex items-center">
                          <Book className="w-4 h-4 mr-2" />
                          Learning Group
                        </Label>
                        <Select onValueChange={handleClassChange} value={studentData.class_id?.toString()}>
                          <SelectTrigger className="w-full transition-all duration-200 ease-in-out focus:ring-2 focus:ring-primary focus:border-transparent hover:border-primary">
                            <SelectValue placeholder="Choose your learning adventure" />
                          </SelectTrigger>
                          <SelectContent>
                            {classes.map((cls) => (
                              <SelectItem key={cls.id} value={cls.id.toString()}>{cls.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </motion.div>
                  </TabsContent>
                  <TabsContent value="1" className="mt-4">
                    <motion.div
                      variants={staggerChildren}
                      initial="hidden"
                      animate="visible"
                      className="space-y-4"
                    >
                      <h2 className="text-2xl font-bold mb-4">Connect with Family</h2>
                      <ParentSearch onSelect={handleParentSelect} />
                      <div className="text-center mt-4">
                        <span className="text-muted-foreground">or</span>
                      </div>
                      <Button onClick={handleNewParent} variant="outline" className="w-full group hover:bg-primary hover:text-primary-foreground transition-all duration-200">
                        <User className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                        Add New Guardian
                      </Button>
                    </motion.div>
                  </TabsContent>
                  <TabsContent value="2" className="mt-4">
                    <motion.div
                      variants={fadeInUp}
                      initial="hidden"
                      animate="visible"
                      className="space-y-4"
                    >
                      {parentAssociation === 'new' && (
                        <motion.div
                          variants={staggerChildren}
                          initial="hidden"
                          animate="visible"
                          className="space-y-4"
                        >
                          <CustomInput
                            id="parent_last_name"
                            name="last_name"
                            label="Guardian's Family Name"
                            icon={User}
                            value={parentData.last_name || ''}
                            onChange={handleParentChange}
                            required
                          />
                          <CustomInput
                            id="parent_first_name"
                            name="first_name"
                            label="Guardian's Given Name"
                            icon={User}
                            value={parentData.first_name || ''}
                            onChange={handleParentChange}
                            required
                          />
                          <CustomInput
                            id="parent_email"
                            name="email"
                            label="Guardian's Email"
                            icon={Search}
                            type="email"
                            value={parentData.email || ''}
                            onChange={handleParentChange}
                            required
                          />
                          <CustomInput
                            id="parent_phone"
                            name="phone"
                            label="Guardian's Phone"
                            icon={Search}
                            type="tel"
                            value={parentData.phone || ''}
                            onChange={handleParentChange}
                            required
                          />
                        </motion.div>
                      )}
                      {parentAssociation === 'existing' && (
                        <div className="bg-primary/10 p-4 rounded-lg">
                          <h3 className="text-xl font-semibold mb-2">Connected Guardian</h3>
                          <p><strong>Name:</strong> {parentData.first_name} {parentData.last_name}</p>
                          <p><strong>Email:</strong> {parentData.email}</p>
                          <p><strong>Phone:</strong> {parentData.phone}</p>
                        </div>
                      )}
                      {!parentAssociation && (
                        <div className="text-center text-muted-foreground">
                          <p>Please select a guardian or create a new one.</p>
                        </div>
                      )}
                    </motion.div>
                  </TabsContent>
                </Tabs>
              </motion.form>
            ) : (
              <SuccessMessage />
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
                    Previous
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
                    Next
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
                        Joining Islah Family...
                      </>
                    ) : (
                      "Complete Registration"
                    )}
                  </Button>
                )}
              </>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}


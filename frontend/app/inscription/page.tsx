"use client"

import type React from "react"
import { useState, useCallback, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle2, Search, Calendar, Book, User, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import type { Student, Parent, Class } from "@/types/models"
import { ParentSearch } from "@/components/ParentSearch"
import { createGuardian, createStudent, createEnrollment } from "@/lib/api"
import confetti from "canvas-confetti"

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const CustomInput = ({
  label,
  icon: Icon,
  error,
  ...props
}: {
  label: string
  icon: React.ElementType
  error?: string
} & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="space-y-2">
    <Label htmlFor={props.id} className="text-sm font-medium text-gray-600 flex items-center">
      <Icon className="w-4 h-4 mr-2" />
      {label}
    </Label>
    <div className="relative">
      <Input
        {...props}
        className={cn(
          "pl-10 h-10 border bg-white rounded-md transition-all duration-200 ease-in-out",
          "focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent",
          error ? "border-red-500" : "border-gray-200",
        )}
      />
      <Icon className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
    </div>
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
)

const SuccessMessage = () => {
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })
  }, [])

  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-64"
    >
      <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
      <h2 className="text-2xl font-bold text-center mb-2">Welcome to Islah School!</h2>
      <p className="text-center text-gray-600">Your journey of knowledge and growth begins now.</p>
    </motion.div>
  )
}

export default function InscriptionPage() {
  const [studentData, setStudentData] = useState<Partial<Student>>({})
  const [parentData, setParentData] = useState<Partial<Parent>>({})
  const [classes, setClasses] = useState<Class[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [parentAssociation, setParentAssociation] = useState<"existing" | "new" | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { toast } = useToast()

  const steps = useMemo(
    () => [
      {
        title: "Student Details",
        icon: User,
        fields: ["first_name", "last_name", "date_of_birth", "gender", "class_id"],
      },
      {
        title: "Guardian Link",
        icon: Search,
        fields: [],
      },
      {
        title: "Guardian Info",
        icon: User,
        fields: ["first_name", "last_name", "email", "phone_number", "role"],
      },
      {
        title: "Final Review",
        icon: Sparkles,
        fields: [],
      },
    ],
    [],
  )

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch("/api/classes", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })
        if (!response.ok) throw new Error("Failed to fetch classes")
        const data = await response.json()
        setClasses(data)
      } catch (error) {
        console.error("Error fetching classes:", error)
        toast({
          title: "Error",
          description: "Failed to load classes. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchClasses()
  }, [toast])

  const validateField = useCallback((name: string, value: any) => {
    if (!value) return `${name} is required`
    if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Invalid email format"
    }
    if (name === "phone_number" && !/^\+?[\d\s-]{10,}$/.test(value)) {
      return "Invalid phone number"
    }
    return ""
  }, [])

  const handleStudentChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setStudentData((prev) => ({ ...prev, [name]: value }))
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
    },
    [validateField],
  )

  const handleParentChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setParentData((prev) => {
        const newData = { ...prev, [name]: value }
        return newData
      })
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
    },
    [validateField],
  )

  const handleClassChange = useCallback((value: string) => {
    setStudentData((prev) => ({ ...prev, class_id: Number.parseInt(value) }))
    setErrors((prev) => ({ ...prev, class_id: "" }))
  }, [])

  const handleSexChange = useCallback((value: string) => {
    setStudentData((prev) => ({
      ...prev,
      gender: value as "male" | "female" | "other",
    }))
    setErrors((prev) => ({ ...prev, gender: "" }))
  }, [])

  const handleParentSelect = useCallback((parent: Parent) => {
    setParentData(parent)
    setParentAssociation("existing")
    setCurrentStep(2)
  }, [])

  const handleNewParent = useCallback((e: React.MouseEvent) => {
    e.preventDefault() // Prevent form submission
    setParentAssociation("new")
    setParentData({})
    setCurrentStep(2)
  }, [])

  const handleRoleChange = useCallback((value: string) => {
    setParentData((prev) => {
      const newData = {
        ...prev,
        role: value as "father" | "mother" | "guardian",
      }
      return newData
    })
    setErrors((prev) => ({ ...prev, role: "" }))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    try {
      // Validate student data
      const requiredStudentFields = ["first_name", "last_name", "date_of_birth", "gender", "class_id"]
      const missingStudentFields = requiredStudentFields.filter(
        (field) => !studentData[field as keyof typeof studentData],
      )

      if (missingStudentFields.length > 0) {
        throw new Error(`Missing required student fields: ${missingStudentFields.join(", ")}`)
      }

      let guardianId: number

      if (parentAssociation === "new") {
        // Validate guardian data before sending
        const guardianDataToSend = {
          first_name: parentData.first_name,
          last_name: parentData.last_name,
          email: parentData.email,
          phone_number: parentData.phone_number,
          role: parentData.role,
        }

        // Validate all required fields
        const requiredFields = ["first_name", "last_name", "email", "phone_number", "role"]
        const missingFields = requiredFields.filter(
          (field) => !guardianDataToSend[field as keyof typeof guardianDataToSend],
        )

        if (missingFields.length > 0) {
          throw new Error(`Missing required guardian fields: ${missingFields.join(", ")}`)
        }

        const guardian = await createGuardian(guardianDataToSend as Omit<Parent, "id">)
        guardianId = guardian.id
      } else if (parentAssociation === "existing") {
        if (!parentData.id) {
          throw new Error("Existing guardian ID is missing")
        }
        guardianId = parentData.id
      } else {
        throw new Error("Parent association not selected")
      }

      const studentRegistrationData = {
        first_name: studentData.first_name,
        last_name: studentData.last_name,
        date_of_birth: studentData.date_of_birth,
        gender: studentData.gender,
        guardian_ids: [guardianId],
      }

      const student = await createStudent(studentRegistrationData)

      await createEnrollment({
        student_id: student.id,
        class_id: studentData.class_id!,
        status: "active",
      })

      setIsSubmitted(true)
      toast({
        title: "Welcome to Islah School!",
        description: "Registration completed successfully.",
        duration: 5000,
      })
    } catch (error) {
      console.error("Registration error:", error)
      let errorMessage = "An error occurred during registration"
      if (error instanceof Error) {
        errorMessage = error.message
      }
      toast({
        title: "Registration Error",
        description: errorMessage,
        variant: "destructive",
      })

      // Set form errors
      const newErrors: Record<string, string> = {}
      errorMessage.split(", ").forEach((err) => {
        const [field, message] = err.split(": ")
        newErrors[field] = message
      })
      setErrors(newErrors)
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    setErrors({})
  }, [currentStep])

  const isStepComplete = useCallback(
    (step: number) => {
      const requiredFields = steps[step].fields
      if (step === 0) {
        return requiredFields.every((field) => studentData[field as keyof typeof studentData] && !errors[field])
      } else if (step === 1) {
        return parentAssociation !== null
      } else if (step === 2) {
        return (
          parentAssociation === "existing" ||
          (parentAssociation === "new" &&
            requiredFields.every((field) => parentData[field as keyof typeof parentData] && !errors[field]))
        )
      }
      return true
    },
    [studentData, parentData, steps, parentAssociation, errors],
  )

  const handleStepChange = useCallback(
    (step: number) => {
      if (step <= currentStep || isStepComplete(currentStep)) {
        setCurrentStep(step)
      }
    },
    [currentStep, isStepComplete],
  )

  return (
    <motion.div className="max-w-4xl mx-auto p-6" initial="hidden" animate="visible" variants={fadeInUp}>
      <Card className="w-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
        <CardHeader className="bg-primary text-white p-8">
          <CardTitle className="text-3xl font-bold">Join the Islah School Family</CardTitle>
          <CardDescription className="text-blue-100 text-lg">
            Embark on a journey of knowledge and growth
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={staggerChildren}
                className="space-y-8"
              >
                <div className="flex justify-between items-center mb-8">
                  {steps.map((step, index) => (
                    <motion.div
                      key={index}
                      className={cn(
                        "flex flex-col items-center cursor-pointer",
                        currentStep === index ? "text-[#4F46E5]" : "text-gray-400",
                      )}
                      onClick={() => handleStepChange(index)}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div
                        className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center mb-2",
                          currentStep === index ? "bg-primary text-white" : "bg-gray-100",
                        )}
                      >
                        <step.icon className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-medium">{step.title}</span>
                    </motion.div>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {currentStep === 0 && (
                    <motion.div
                      key="student-details"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <h2 className="text-2xl font-bold mb-4">Student Information</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <CustomInput
                          id="student_first_name"
                          name="first_name"
                          label="Given Name"
                          icon={User}
                          value={studentData.first_name || ""}
                          onChange={handleStudentChange}
                          error={errors.first_name}
                          required
                        />
                        <CustomInput
                          id="student_last_name"
                          name="last_name"
                          label="Family Name"
                          icon={User}
                          value={studentData.last_name || ""}
                          onChange={handleStudentChange}
                          error={errors.last_name}
                          required
                        />
                        <CustomInput
                          id="date_of_birth"
                          name="date_of_birth"
                          label="Birthday"
                          icon={Calendar}
                          type="date"
                          value={studentData.date_of_birth || ""}
                          onChange={handleStudentChange}
                          error={errors.date_of_birth}
                          required
                        />
                        <div className="space-y-2">
                          <Label htmlFor="gender" className="text-sm font-medium text-gray-600 flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            Gender
                          </Label>
                          <Select onValueChange={handleSexChange} value={studentData.gender}>
                            <SelectTrigger className="h-10 border border-gray-200 bg-white rounded-md transition-all duration-200 ease-in-out focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="class_id" className="text-sm font-medium text-gray-600 flex items-center">
                            <Book className="w-4 h-4 mr-2" />
                            Learning Group
                          </Label>
                          <Select onValueChange={handleClassChange} value={studentData.class_id?.toString()}>
                            <SelectTrigger className="h-10 border border-gray-200 bg-white rounded-md transition-all duration-200 ease-in-out focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent">
                              <SelectValue placeholder="Choose your learning adventure" />
                            </SelectTrigger>
                            <SelectContent>
                              {classes.map((cls) => (
                                <SelectItem key={cls.id} value={cls.id.toString()}>
                                  {cls.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.class_id && <p className="text-sm text-red-500">{errors.class_id}</p>}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 1 && (
                    <motion.div
                      key="guardian-link"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <h2 className="text-2xl font-bold mb-4">Connect with Family</h2>
                      <ParentSearch onSelect={handleParentSelect} />
                      <div className="text-center mt-8">
                        <span className="text-gray-600">or</span>
                      </div>
                      <Button
                        onClick={handleNewParent}
                        type="button" // Explicitly set type to "button"
                        variant="outline"
                        className="w-full group hover:bg-primary hover:text-white transition-all duration-200"
                      >
                        <User className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                        Add New Guardian
                      </Button>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      key="guardian-info"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <h2 className="text-2xl font-bold mb-4">Guardian Information</h2>
                      {parentAssociation === "new" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <CustomInput
                            id="parent_first_name"
                            name="first_name"
                            label="Guardian's Given Name"
                            icon={User}
                            value={parentData.first_name || ""}
                            onChange={handleParentChange}
                            error={errors.first_name}
                            required
                          />
                          <CustomInput
                            id="parent_last_name"
                            name="last_name"
                            label="Guardian's Family Name"
                            icon={User}
                            value={parentData.last_name || ""}
                            onChange={handleParentChange}
                            error={errors.last_name}
                            required
                          />
                          <CustomInput
                            id="parent_email"
                            name="email"
                            label="Guardian's Email"
                            icon={Search}
                            type="email"
                            value={parentData.email || ""}
                            onChange={handleParentChange}
                            error={errors.email}
                            required
                          />
                          <CustomInput
                            id="parent_phone"
                            name="phone_number"
                            label="Guardian's Phone"
                            icon={Search}
                            type="tel"
                            value={parentData.phone_number || ""}
                            onChange={handleParentChange}
                            error={errors.phone_number}
                            required
                          />
                          <div className="space-y-2">
                            <Label htmlFor="role" className="text-sm font-medium text-gray-600 flex items-center">
                              <User className="w-4 h-4 mr-2" />
                              Role
                            </Label>
                            <Select onValueChange={handleRoleChange} value={parentData.role}>
                              <SelectTrigger className="h-10 border border-gray-200 bg-white rounded-md transition-all duration-200 ease-in-out focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent">
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="father">Father</SelectItem>
                                <SelectItem value="mother">Mother</SelectItem>
                                <SelectItem value="guardian">Guardian</SelectItem>
                              </SelectContent>
                            </Select>
                            {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
                          </div>
                        </div>
                      )}
                      {parentAssociation === "existing" && (
                        <div className="bg-gray-50 p-6 rounded-lg">
                          <h3 className="text-xl font-semibold mb-4">Connected Guardian</h3>
                          <p>
                            <strong>Name:</strong> {parentData.first_name} {parentData.last_name}
                          </p>
                          <p>
                            <strong>Email:</strong> {parentData.email}
                          </p>
                          <p>
                            <strong>Phone:</strong> {parentData.phone_number}
                          </p>
                          <p>
                            <strong>Role:</strong> {parentData.role}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div
                      key="final-review"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <h2 className="text-2xl font-bold mb-4">Final Review</h2>
                      <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                        <h3 className="text-xl font-semibold">Student Information</h3>
                        <p>
                          <strong>Name:</strong> {studentData.first_name} {studentData.last_name}
                        </p>
                        <p>
                          <strong>Birthday:</strong> {studentData.date_of_birth}
                        </p>
                        <p>
                          <strong>Gender:</strong> {studentData.gender}
                        </p>
                        <p>
                          <strong>Learning Group:</strong> {classes.find((c) => c.id === studentData.class_id)?.name}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                        <h3 className="text-xl font-semibold">Guardian Information</h3>
                        <p>
                          <strong>Name:</strong> {parentData.first_name} {parentData.last_name}
                        </p>
                        <p>
                          <strong>Email:</strong> {parentData.email}
                        </p>
                        <p>
                          <strong>Phone:</strong> {parentData.phone_number}
                        </p>
                        <p>
                          <strong>Role:</strong> {parentData.role}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.form>
            ) : (
              <SuccessMessage />
            )}
          </AnimatePresence>
        </CardContent>
        <CardFooter className="bg-gray-50 p-6">
          <div className="flex justify-between w-full">
            {!isSubmitted && (
              <>
                {currentStep > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="transition-all duration-200 ease-in-out hover:bg-primary hover:text-white"
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
                      "bg-primary text-white hover:bg-[#4338CA]",
                    )}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !isStepComplete(currentStep)}
                    className={cn(
                      "ml-auto transition-all duration-200 ease-in-out",
                      "bg-primary text-white hover:bg-[#4338CA]",
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


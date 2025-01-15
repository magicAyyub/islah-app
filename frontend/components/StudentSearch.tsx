import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { Search, User, Calendar, GraduationCap } from 'lucide-react'
import { Student, Class } from "@/types/payments"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type StudentSearchProps = {
  onSelect: (student: Student, classId: number) => void
}

export function StudentSearch({ onSelect }: StudentSearchProps) {
  const [query, setQuery] = useState('')
  const [students, setStudents] = useState<Student[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch('/api/classes')
        if (!response.ok) throw new Error('Failed to fetch classes')
        const data: Class[] = await response.json()
        setClasses(data)
      } catch (error) {
        console.error('Error:', error)
        toast({
          title: "Error",
          description: "Failed to load classes. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchClasses()
  }, [])

  useEffect(() => {
    if (query.length < 2 || !selectedClassId) {
      setStudents([])
      return
    }

    const fetchStudents = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/students/search?q=${encodeURIComponent(query)}&class_id=${selectedClassId}`)
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        const data: Student[] = await response.json()
        setStudents(data)
      } catch (error) {
        console.error('Error:', error)
        toast({
          title: "Search Error",
          description: "An error occurred while searching for students. Please try again.",
          variant: "destructive",
        })
        setStudents([])
      } finally {
        setIsLoading(false)
      }
    }

    const debounce = setTimeout(() => {
      fetchStudents()
    }, 300)

    return () => clearTimeout(debounce)
  }, [query, selectedClassId])

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="class-select">Select Class</Label>
        <Select onValueChange={(value) => setSelectedClassId(Number(value))}>
          <SelectTrigger id="class-select">
            <SelectValue placeholder="Select a class" />
          </SelectTrigger>
          <SelectContent>
            {classes.map((cls) => (
              <SelectItem key={cls.id} value={cls.id.toString()}>{cls.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="relative">
        <Label htmlFor="student-search" className="sr-only">Search for a student</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            id="student-search"
            type="text"
            placeholder="Search for a student..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-full border-2 border-primary focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 ease-in-out"
            disabled={!selectedClassId}
          />
        </div>
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute inset-x-0 top-full mt-2 p-4 bg-white rounded-lg shadow-lg"
            >
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-4 h-4 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-4 h-4 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </motion.div>
          )}
          {!isLoading && students.length > 0 && (
            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute inset-x-0 top-full mt-2 max-h-80 overflow-auto bg-white rounded-lg shadow-lg divide-y divide-gray-200"
            >
              {students.map((student) => (
                <motion.li
                  key={student.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ease-in-out"
                  onClick={() => {
                    onSelect(student, selectedClassId!)
                    setQuery('')
                    setStudents([])
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center">
                        <User size={24} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {student.first_name} {student.last_name}
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <GraduationCap size={16} />
                        <p>{student.class_name}</p>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Calendar size={16} />
                        <p>{new Date(student.birth_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          )}
          {!isLoading && query.length >= 2 && students.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute inset-x-0 top-full mt-2 p-4 bg-white rounded-lg shadow-lg text-center text-gray-500"
            >
              No students found
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}


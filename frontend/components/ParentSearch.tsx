import { useState, useEffect } from 'react'
import { Parent } from '@/types/models'
import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { Search, User } from 'lucide-react'

interface ParentSearchProps {
  onSelect: (parent: Parent) => void
}

export function ParentSearch({ onSelect }: ParentSearchProps) {
  const [query, setQuery] = useState('')
  const [parents, setParents] = useState<Parent[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (query.length < 2) {
      setParents([])
      return
    }

    const fetchParents = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/guardians/search?q=${encodeURIComponent(query)}`)
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        const data: Parent[] = await response.json()
        setParents(data)
      } catch (error) {
        console.error('Error:', error)
        toast({
          title: "Search Error",
          description: "An error occurred while searching for parents. Please try again.",
          variant: "destructive",
        })
        setParents([])
      } finally {
        setIsLoading(false)
      }
    }

    const debounce = setTimeout(() => {
      fetchParents()
    }, 300)

    return () => clearTimeout(debounce)
  }, [query])

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search for a parent..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-4 py-2 w-full rounded-full border-2 border-primary focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 ease-in-out"
        />
      </div>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex justify-center"
          >
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
          </motion.div>
        )}
        {!isLoading && parents.length > 0 && (
          <ScrollArea className="h-72 rounded-md border">
            <div className="p-4">
              <h4 className="mb-4 text-sm font-medium leading-none">Search Results</h4>
              {parents.map((parent) => (
                <motion.div
                  key={parent.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-between space-x-4 rounded-md p-2 hover:bg-accent"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                      <User className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none">{parent.first_name} {parent.last_name}</p>
                      <p className="text-sm text-muted-foreground">{parent.email}</p>
                    </div>
                  </div>
                  <Button onClick={() => onSelect(parent)} variant="outline" size="sm">
                    Select
                  </Button>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        )}
        {!isLoading && query.length >= 2 && parents.length === 0 && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center text-muted-foreground"
          >
            No parents found
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}


import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Parent } from "@/types/models"

interface ParentAssociationProps {
  onExistingParent: (parent: Parent) => void
  onNewParent: () => void
}

export function ParentAssociation({ onExistingParent, onNewParent }: ParentAssociationProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<Parent[]>([])

  const handleSearch = async () => {
    // Implement the API call to search for parents
    const response = await fetch(`/api/parents/search?term=${searchTerm}`)
    const data = await response.json()
    setSearchResults(data)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      <h2 className="text-2xl font-bold mb-4">Parent Association</h2>
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="Search for existing parent..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Button onClick={handleSearch}>
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </div>
      {searchResults.length > 0 && (
        <ul className="space-y-2 mt-4">
          {searchResults.map((parent) => (
            <li key={parent.id} className="bg-gray-100 p-3 rounded-lg hover:bg-gray-200 cursor-pointer" onClick={() => onExistingParent(parent)}>
              {parent.first_name} {parent.last_name} - {parent.email}
            </li>
          ))}
        </ul>
      )}
      <div className="text-center">
        <span className="text-gray-500">or</span>
      </div>
      <Button onClick={onNewParent} variant="outline" className="w-full">
        Create New Parent
      </Button>
    </motion.div>
  )
}


import React from 'react'
import { motion } from 'framer-motion'

interface AnimatedTableRowProps {
  children: React.ReactNode
  delay?: number
}

const AnimatedTableRow: React.FC<AnimatedTableRowProps> = ({ children, delay = 0 }) => {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.3, delay }}
    >
      {children}
    </motion.tr>
  )
}

export default AnimatedTableRow


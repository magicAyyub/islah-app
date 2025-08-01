"use client"

import { motion } from "framer-motion"
import { CroissantIcon as Crescent, Star } from "lucide-react"

export function IslamicHeader() {
  return (
    <div className="flex items-center justify-center py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-sm">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
        <Crescent className="w-4 h-4" />
        <span className="font-arabic text-lg">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</span>
        <Star className="w-4 h-4" />
      </motion.div>
    </div>
  )
}

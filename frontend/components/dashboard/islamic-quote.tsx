"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Quote, BookOpen } from "lucide-react"

const islamicQuotes = [
  {
    arabic: "وَقُل رَّبِّ زِدْنِي عِلْمًا",
    french: "Et dis: «Ô mon Seigneur, accroît mes connaissances!»",
    reference: "Coran 20:114",
    transliteration: "Wa qul rabbi zidni 'ilman",
  },
  {
    arabic: "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ",
    french: "La recherche du savoir est une obligation pour tout musulman",
    reference: "Hadith",
    transliteration: "Talab al-'ilm faridatun 'ala kulli muslim",
  },
  {
    arabic: "إِنَّمَا يَخْشَى اللَّهَ مِنْ عِبَادِهِ الْعُلَمَاءُ",
    french: "Parmi Ses serviteurs, seuls les savants craignent Allah",
    reference: "Coran 35:28",
    transliteration: "Innama yakhsha Allaha min 'ibadihi al-'ulama'",
  },
]

export function IslamicQuote() {
  const randomQuote = islamicQuotes[Math.floor(Math.random() * islamicQuotes.length)]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
      <Card className="shadow-lg border-0 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-200 rounded-full flex-shrink-0">
              <BookOpen className="w-6 h-6 text-amber-700" />
            </div>
            <div className="space-y-4">
              <div className="relative">
                <Quote className="absolute -top-2 -left-2 w-6 h-6 text-amber-300" />
                <div className="text-right mb-3">
                  <p className="text-xl font-arabic text-amber-900 leading-relaxed">{randomQuote.arabic}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-amber-800 font-medium italic">"{randomQuote.french}"</p>
                  <p className="text-sm text-amber-600">{randomQuote.transliteration}</p>
                  <p className="text-xs text-amber-500 font-semibold">— {randomQuote.reference}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

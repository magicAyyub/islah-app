"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { ChurchIcon as Mosque, BookOpen } from "lucide-react"

interface IslamicWelcomeProps {
  userName?: string
}

export function IslamicWelcome({ userName }: IslamicWelcomeProps) {
  const currentTime = new Date()
  const currentHour = currentTime.getHours()

  const getIslamicGreeting = () => {
    if (currentHour < 12) {
      return {
        arabic: "صَبَاحُ الْخَيْر",
        french: "Bon matin",
        transliteration: "Sabah al-khayr",
      }
    } else if (currentHour < 18) {
      return {
        arabic: "مَسَاءُ الْخَيْر",
        french: "Bon après-midi",
        transliteration: "Masa' al-khayr",
      }
    } else {
      return {
        arabic: "مَسَاءُ الْخَيْر",
        french: "Bonsoir",
        transliteration: "Masa' al-khayr",
      }
    }
  }

  const greeting = getIslamicGreeting()

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden">
      <Card className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-blue-600 text-white border-0 shadow-xl">
        <CardContent className="p-8 relative">
          {/* Islamic Pattern Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4">
              <Mosque className="w-24 h-24" />
            </div>
            <div className="absolute bottom-4 left-4">
              <BookOpen className="w-16 h-16" />
            </div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-full">
                <Mosque className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">مدرسة الإصلاح</h1>
                <p className="text-emerald-100 text-sm">École Islah - Montreuil</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-right">
                <p className="text-3xl font-arabic mb-1">{greeting.arabic}</p>
                <p className="text-emerald-100 text-sm italic">{greeting.transliteration}</p>
              </div>

              <div className="border-t border-white/20 pt-3">
                <h2 className="text-2xl font-bold mb-1">
                  {greeting.french}, {userName} !
                </h2>
                <p className="text-emerald-100 text-lg">Voici un aperçu de l'activité de l'école aujourd'hui</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

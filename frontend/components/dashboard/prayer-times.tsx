"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Sunrise, Sun, Sunset, Moon, Star } from "lucide-react"

const prayerTimes = [
  { name: "Fajr", arabic: "الفجر", time: "06:15", icon: Sunrise, passed: true },
  { name: "Dhuhr", arabic: "الظهر", time: "13:30", icon: Sun, passed: true },
  { name: "Asr", arabic: "العصر", time: "16:45", icon: Sun, passed: false, current: true },
  { name: "Maghrib", arabic: "المغرب", time: "19:20", icon: Sunset, passed: false },
  { name: "Isha", arabic: "العشاء", time: "21:00", icon: Moon, passed: false },
]

export function PrayerTimes() {
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Clock className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <span>Horaires de prière</span>
            <p className="text-sm font-normal text-gray-500 mt-1">أوقات الصلاة</p>
          </div>
        </CardTitle>
        <CardDescription>Mosquée Islah - Montreuil</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {prayerTimes.map((prayer, index) => (
            <motion.div
              key={prayer.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                prayer.current
                  ? "bg-emerald-50 border border-emerald-200"
                  : prayer.passed
                    ? "bg-gray-50 opacity-60"
                    : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${prayer.current ? "bg-emerald-200" : "bg-gray-200"}`}>
                  <prayer.icon className={`w-4 h-4 ${prayer.current ? "text-emerald-600" : "text-gray-600"}`} />
                </div>
                <div>
                  <p className={`font-medium ${prayer.current ? "text-emerald-900" : "text-gray-900"}`}>
                    {prayer.name}
                  </p>
                  <p className="text-sm text-gray-500 font-arabic">{prayer.arabic}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-mono font-semibold ${prayer.current ? "text-emerald-600" : "text-gray-600"}`}>
                  {prayer.time}
                </p>
                {prayer.current && <p className="text-xs text-emerald-600">Prochaine</p>}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 text-blue-800">
            <Star className="w-4 h-4" />
            <p className="text-sm font-medium">Rappel: Les cours reprennent après Maghrib</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

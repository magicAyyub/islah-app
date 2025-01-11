"use client"

import { useState } from 'react'
//import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, LineChart, PieChart } from 'lucide-react'

export default function RapportsPage() {
  const [selectedReport, setSelectedReport] = useState('inscriptions')

  const renderChart = () => {
    switch (selectedReport) {
      case 'inscriptions':
        return (
          <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
            <BarChart className="w-16 h-16 text-primary" />
            <span className="ml-4 text-lg font-semibold">Graphique des inscriptions</span>
          </div>
        )
      case 'paiements':
        return (
          <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
            <LineChart className="w-16 h-16 text-primary" />
            <span className="ml-4 text-lg font-semibold">Graphique des paiements</span>
          </div>
        )
      case 'classes':
        return (
          <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
            <PieChart className="w-16 h-16 text-primary" />
            <span className="ml-4 text-lg font-semibold">Répartition des classes</span>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Rapports et Statistiques</h1>
      <Card>
        <CardHeader>
          <CardTitle>Générer un rapport</CardTitle>
          <CardDescription>Sélectionnez le type de rapport que vous souhaitez visualiser</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedReport} onValueChange={setSelectedReport}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Type de rapport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inscriptions">Inscriptions</SelectItem>
              <SelectItem value="paiements">Paiements</SelectItem>
              <SelectItem value="classes">Classes</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
        <CardFooter>
          <div className="w-full">
            {renderChart()}
          </div>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Statistiques générales</CardTitle>
          <CardDescription>Aperçu des principales statistiques de l&apos;école</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-primary/10 rounded-lg">
              <h3 className="font-semibold text-lg">Total des élèves</h3>
              <p className="text-3xl font-bold">152</p>
            </div>
            <div className="p-4 bg-primary/10 rounded-lg">
              <h3 className="font-semibold text-lg">Moyenne des paiements</h3>
              <p className="text-3xl font-bold">250 €</p>
            </div>
            <div className="p-4 bg-primary/10 rounded-lg">
              <h3 className="font-semibold text-lg">Taux de réussite</h3>
              <p className="text-3xl font-bold">92%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


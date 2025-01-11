"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, CreditCard, BarChart, ArrowRight, Zap, Shield, Bell } from 'lucide-react'
import PendingApplications from "@/components/pending-application"

// Simuler des demandes d'inscription en attente
const pendingApplications = [
  { id: 1, name: "Sophie Martin", class: "CP", date: "2023-09-15" },
  { id: 2, name: "Lucas Dubois", class: "CE1", date: "2023-09-16" },
  { id: 3, name: "Emma Bernard", class: "CE2", date: "2023-09-17" },
]


export default function Home() {
  const [applications, setApplications] = useState(pendingApplications)

  const handleApprove = (id: number) => {
    setApplications(applications.filter(app => app.id !== id))
    // Ici, vous ajouteriez la logique pour approuver réellement l'inscription
  }

  const handleReject = (id: number) => {
    setApplications(applications.filter(app => app.id !== id))
    // Ici, vous ajouteriez la logique pour rejeter l'inscription
  }

  return (
    <div className="space-y-12 py-8">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
          Bienvenue à l&apos;École Islah
        </h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Gérez efficacement votre école avec notre système de gestion moderne et intuitif.
        </p>
      </section>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <span>Inscriptions</span>
            </CardTitle>
            <CardDescription>Gérez les inscriptions facilement</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">152</p>
            <p className="text-sm text-muted-foreground">Élèves inscrits</p>
          </CardContent>
          <CardFooter>
            <Link href="/eleves" passHref>
              <Button variant="ghost" className="w-full justify-start">
                <span>Voir les détails</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-primary" />
              <span>Classes</span>
            </CardTitle>
            <CardDescription>Visualisez et gérez les classes</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">8</p>
            <p className="text-sm text-muted-foreground">Classes actives</p>
          </CardContent>
          <CardFooter>
            <Link href="/classes" passHref>
              <Button variant="ghost" className="w-full justify-start">
                <span>Voir les détails</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-primary" />
              <span>Paiements</span>
            </CardTitle>
            <CardDescription>Suivez et enregistrez les paiements</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">15 250 €</p>
            <p className="text-sm text-muted-foreground">Total des paiements ce mois</p>
          </CardContent>
          <CardFooter>
            <Link href="/paiements" passHref>
              <Button variant="ghost" className="w-full justify-start">
                <span>Voir les détails</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart className="w-5 h-5 text-primary" />
              <span>Rapports</span>
            </CardTitle>
            <CardDescription>Accédez aux statistiques et rapports</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">4</p>
            <p className="text-sm text-muted-foreground">Rapports générés cette semaine</p>
          </CardContent>
          <CardFooter>
            <Link href="/rapports" passHref>
              <Button variant="ghost" className="w-full justify-start">
                <span>Voir les détails</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
      { /* Gestion des demandes d'inscription en attente (affiché que lorsqu'il y en a )*/ }
      {applications.length > 0 && (
        <PendingApplications applications={applications} handleApprove={handleApprove} handleReject={handleReject} />
      )}

      <section className="space-y-8">
        <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl">
          Fonctionnalités principales
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="transition-all duration-300 hover:shadow-lg hover:bg-accent">
            <CardHeader>
              <Zap className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Gestion simplifiée</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Gérez efficacement les élèves, les classes et les enseignants en quelques clics.</p>
            </CardContent>
          </Card>
          <Card className="transition-all duration-300 hover:shadow-lg hover:bg-accent">
            <CardHeader>
              <Shield className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Sécurité des données</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Protégez les informations sensibles avec notre système de sécurité avancé.</p>
            </CardContent>
          </Card>
          <Card className="transition-all duration-300 hover:shadow-lg hover:bg-accent">
            <CardHeader>
              <Bell className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Notifications en temps réel</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Restez informé des événements importants grâce aux notifications instantanées.</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}


"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { BookOpen, Users, CreditCard, BarChart, Zap, Shield, Bell, ChevronRight, Globe, Star, TrendingUp } from 'lucide-react';
import FeatureCard from '@/components/FeatureCard';
import StatCard from '@/components/StatCard';

export default function Home() {
  return (
    <div className="min-h-screen space-y-16 py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <div className="relative inline-block">

          <h1 className="relative text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl">
            Bienvenue à l&apos;École
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground ml-2">
              Islah
            </span>
          </h1>
        </div>
        <p className="mx-auto max-w-[700px] text-xl text-muted-foreground md:text-2xl">
          Une approche moderne de l&apos;éducation, centrée sur l&apos;excellence et l&apos;innovation
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" className="group">
            Commencer
            <ChevronRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button size="lg" variant="outline">
            En savoir plus
          </Button>
        </div>
      </motion.section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={BookOpen}
          title="Inscriptions"
          value="152"
          description="Élèves inscrits"
          href="/eleves"
        />
        <StatCard
          icon={Users}
          title="Classes"
          value="8"
          description="Classes actives"
          href="/classes"
        />
        <StatCard
          icon={CreditCard}
          title="Paiements"
          value="15 250 €"
          description="Total des paiements ce mois"
          href="/paiements"
        />
        <StatCard
          icon={BarChart}
          title="Rapports"
          value="4"
          description="Rapports générés cette semaine"
          href="/rapports"
        />
      </div>

      {/* Features Section */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
          >
            Une Plateforme Complète
          </motion.h2>
          <p className="text-xl text-muted-foreground max-w-[800px] mx-auto">
            Découvrez nos outils innovants conçus pour optimiser la gestion de votre établissement
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={Zap}
            title="Gestion Intelligente"
            description="Interface intuitive pour gérer efficacement les élèves, les classes et les enseignants avec des automatisations avancées."
          />
          <FeatureCard
            icon={Globe}
            title="Accessibilité Totale"
            description="Accédez à vos données depuis n'importe où, avec une synchronisation en temps réel sur tous vos appareils."
          />
          <FeatureCard
            icon={Shield}
            title="Sécurité Renforcée"
            description="Protection avancée des données avec chiffrement de bout en bout et conformité RGPD."
          />
          <FeatureCard
            icon={Bell}
            title="Notifications Intelligentes"
            description="Système de notifications personnalisables pour rester informé des événements importants."
          />
          <FeatureCard
            icon={Star}
            title="Suivi Personnalisé"
            description="Tableaux de bord personnalisables pour suivre la progression de chaque élève."
          />
          <FeatureCard
            icon={TrendingUp}
            title="Analyses Détaillées"
            description="Rapports analytiques avancés pour prendre des décisions éclairées."
          />
        </div>
      </section>
    </div>
  );
}
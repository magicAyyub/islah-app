import { Users, BookOpen, CreditCard, ClipboardList, Calendar } from "lucide-react";
import { Stat, QuickAction, UserRole } from "../types/dashboard";

export const getStatsByRole = (role: UserRole): Stat[] => {
  const stats: Stat[] = [];

  if (["ADMIN", "STAFF"].includes(role)) {
    stats.push({
      title: "Élèves inscrits",
      value: 45,
      subtitle: "+3 ce mois-ci",
      icon: <Users className="h-5 w-5" />,
      iconBgColor: "bg-[#f0eeff]",
      iconColor: "text-[#6c63ff]",
    });
  }

  if (["ADMIN", "TEACHER", "STAFF"].includes(role)) {
    stats.push({
      title: "Taux de présence",
      value: "92%",
      subtitle: "Cette semaine",
      icon: <ClipboardList className="h-5 w-5" />,
      iconBgColor: "bg-[#e6f4ea]",
      iconColor: "text-[#34a853]",
      trend: {
        value: "+2%",
        isPositive: true,
      },
    });
  }

  if (["ADMIN", "STAFF"].includes(role)) {
    stats.push({
      title: "Paiements reçus",
      value: "3 250€",
      subtitle: "5 paiements en attente",
      icon: <CreditCard className="h-5 w-5" />,
      iconBgColor: "bg-[#fef7e0]",
      iconColor: "text-[#fbbc05]",
    });
  }

  if (["ADMIN", "TEACHER"].includes(role)) {
    stats.push({
      title: "Bulletins générés",
      value: 42,
      subtitle: "Sur 45 élèves",
      icon: <BookOpen className="h-5 w-5" />,
      iconBgColor: "bg-[#e8f0fe]",
      iconColor: "text-[#4285f4]",
    });
  }

  if (role === "PARENT") {
    stats.push(
      {
        title: "Prochain paiement",
        value: "150€",
        subtitle: "Échéance: 30/10/2023",
        icon: <CreditCard className="h-5 w-5" />,
        iconBgColor: "bg-[#fef7e0]",
        iconColor: "text-[#fbbc05]",
      },
      {
        title: "Présence",
        value: "85%",
        subtitle: "Ce mois-ci",
        icon: <ClipboardList className="h-5 w-5" />,
        iconBgColor: "bg-[#e6f4ea]",
        iconColor: "text-[#34a853]",
      }
    );
  }

  if (role === "TEACHER") {
    stats.push(
      {
        title: "Élèves dans ma classe",
        value: 18,
        subtitle: "Primaire 1",
        icon: <Users className="h-5 w-5" />,
        iconBgColor: "bg-[#f0eeff]",
        iconColor: "text-[#6c63ff]",
      },
      {
        title: "Prochaine classe",
        value: "Aujourd'hui",
        subtitle: "14h00 - 17h00",
        icon: <Calendar className="h-5 w-5" />,
        iconBgColor: "bg-[#fef7e0]",
        iconColor: "text-[#fbbc05]",
      }
    );
  }

  return stats;
};

export const getQuickActionsByRole = (role: UserRole): QuickAction[] => {
  const actions: QuickAction[] = [];

  if (["ADMIN", "STAFF"].includes(role)) {
    actions.push({
      title: "Gestion des Élèves",
      description: "Inscriptions et suivi des dossiers",
      icon: <Users className="h-7 w-7 text-white" />,
      href: "/students",
      gradient: "bg-gradient-to-br from-[#6c63ff] to-[#5a52e0]",
      iconBgClass: "bg-white/20 backdrop-blur-sm",
    });
  }

  if (["ADMIN", "TEACHER", "STAFF"].includes(role)) {
    actions.push({
      title: "Emplois du Temps",
      description: "Organisation des cours",
      icon: <Calendar className="h-7 w-7 text-white" />,
      href: "/schedules",
      gradient: "bg-gradient-to-br from-[#4285f4] to-[#3b78e7]",
      iconBgClass: "bg-white/20 backdrop-blur-sm",
    });
  }

  if (["ADMIN", "STAFF", "PARENT"].includes(role)) {
    actions.push({
      title: "Paiements",
      description: "Gestion des frais et reçus",
      icon: <CreditCard className="h-7 w-7 text-white" />,
      href: "/payments",
      gradient: "bg-gradient-to-br from-[#34a853] to-[#2d9649]",
      iconBgClass: "bg-white/20 backdrop-blur-sm",
    });
  }

  if (["ADMIN", "TEACHER", "STAFF"].includes(role)) {
    actions.push({
      title: "Présence",
      description: "Suivi des présences quotidiennes",
      icon: <ClipboardList className="h-7 w-7 text-white" />,
      href: "/attendance",
      gradient: "bg-gradient-to-br from-[#fbbc05] to-[#f9ab00]",
      iconBgClass: "bg-white/20 backdrop-blur-sm",
    });
  }

  if (role === "PARENT") {
    actions.push({
      title: "Espace Parent",
      description: "Suivi de la scolarité",
      icon: <Users className="h-7 w-7 text-white" />,
      href: "/parent-portal",
      gradient: "bg-gradient-to-br from-[#6c63ff] to-[#5a52e0]",
      iconBgClass: "bg-white/20 backdrop-blur-sm",
    });
  }

  if (role === "TEACHER") {
    actions.push(
      {
        title: "Mes Classes",
        description: "Gestion de mes élèves",
        icon: <Users className="h-7 w-7 text-white" />,
        href: "/classes",
        gradient: "bg-gradient-to-br from-[#9c27b0] to-[#7b1fa2]",
        iconBgClass: "bg-white/20 backdrop-blur-sm",
      },
      {
        title: "Bulletins",
        description: "Évaluation des élèves",
        icon: <BookOpen className="h-7 w-7 text-white" />,
        href: "/reports",
        gradient: "bg-gradient-to-br from-[#ff63c4] to-[#e5399f]",
        iconBgClass: "bg-white/20 backdrop-blur-sm",
      }
    );
  }

  return actions;
}; 
"use client"
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Clock,
  Users,
  Search,
  Sparkles,
  School,
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

type DayOfWeek = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
type Level = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
type ClassStatus = "available" | "limited" | "full";

interface Classe {
  id?: number;
  name: string;
  level: Level;
  capacity: number;
  registered?: number;
  day_of_week: DayOfWeek;
  start_time: string;
  end_time: string;
  description?: string;
  status?: ClassStatus;
}

const levels: Level[] = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"];
const daysOfWeek: DayOfWeek[] = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

const getLevelColor = (level: Level) => {
  const colors = {
    BEGINNER: "bg-emerald-100 text-emerald-800",
    INTERMEDIATE: "bg-blue-100 text-blue-800",
    ADVANCED: "bg-purple-100 text-purple-800",
    EXPERT: "bg-rose-100 text-rose-800"
  };
  return colors[level];
};

const getStatusColor = (status: ClassStatus) => {
  const colors = {
    available: "bg-green-100 text-green-800",
    limited: "bg-amber-100 text-amber-800",
    full: "bg-red-100 text-red-800"
  };
  return colors[status];
};

const ClassCard = ({ classe }: { classe: Classe }) => {
  const status: ClassStatus = 
    classe.registered === classe.capacity ? "full" :
    classe.registered! >= classe.capacity * 0.8 ? "limited" : 
    "available";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full"
    >
      <Card className="h-full hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-bold">{classe.name}</CardTitle>
              <p className="text-sm text-gray-500">
                {format(new Date(2021, 0, daysOfWeek.indexOf(classe.day_of_week) + 1), "EEEE", { locale: fr })}
              </p>
            </div>
            <Badge className={getLevelColor(classe.level)}>
              {classe.level}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>{classe.start_time} - {classe.end_time}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span>{classe.registered}/{classe.capacity}</span>
              </div>
            </div>
            <div className="pt-2">
              <Badge className={getStatusColor(status)}>
                {status === "available" ? "Places disponibles" :
                 status === "limited" ? "Places limitées" :
                 "Complet"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function ClassesPage() {
  const [classes, setClasses] = useState<Classe[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<Classe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<Level | "ALL">("ALL");
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | "ALL">("ALL");
  const [view, setView] = useState<"grid" | "calendar">("grid");

  const loadClasses = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/classes");
      if (!response.ok) throw new Error("Erreur lors de la récupération des classes.");
      const data = await response.json();
      setClasses(data);
      setFilteredClasses(data);
    } catch (error) {
      console.error(error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la récupération des classes."
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  useEffect(() => {
    const filtered = classes.filter(classe => {
      const matchesSearch = classe.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLevel = selectedLevel === "ALL" || classe.level === selectedLevel;
      const matchesDay = selectedDay === "ALL" || classe.day_of_week === selectedDay;
      return matchesSearch && matchesLevel && matchesDay;
    });
    setFilteredClasses(filtered);
  }, [classes, searchTerm, selectedLevel, selectedDay]);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <div className="flex items-center space-x-3">
          <GraduationCap className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Gestion des Classes</h1>
        </div>
        <p className="text-xl text-gray-600">
          Trouvez la classe parfaite pour chaque élève
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-[300px,1fr]">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filtres</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Rechercher</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Rechercher une classe..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Niveau</Label>
                <Select value={selectedLevel} onValueChange={(value: Level | "ALL") => setSelectedLevel(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les niveaux" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Tous les niveaux</SelectItem>
                    {levels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Jour</Label>
                <Select value={selectedDay} onValueChange={(value: DayOfWeek | "ALL") => setSelectedDay(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les jours" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Tous les jours</SelectItem>
                    {daysOfWeek.map((day) => (
                      <SelectItem key={day} value={day}>
                        {format(new Date(2021, 0, daysOfWeek.indexOf(day) + 1), "EEEE", { locale: fr })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="font-semibold">Conseil pour les agents</span>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Utilisez les filtres pour trouver rapidement les classes disponibles selon les préférences des parents.
                Les badges colorés vous aident à identifier instantanément les niveaux et la disponibilité.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filteredClasses.map((classe) => (
                <ClassCard key={classe.id} classe={classe} />
              ))}
            </AnimatePresence>
          </div>

          {filteredClasses.length === 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <School className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Aucune classe trouvée</h3>
              <p className="text-gray-500 mt-2">Essayez de modifier vos filtres de recherche</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedLevel("ALL");
                  setSelectedDay("ALL");
                }}
                className="mt-4"
              >
                Réinitialiser les filtres
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
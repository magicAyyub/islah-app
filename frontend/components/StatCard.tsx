import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight} from 'lucide-react';

interface StatCardProps {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    value: string | number;
    description: string;
    href: string;
}

export default function StatCard({ icon: Icon, title, value, description, href }: StatCardProps) {
    return(
        <motion.div
        whileHover={{ y: -5 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        >
            <Card className="overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/0 pointer-events-none" />
                <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Icon className="w-5 h-5 text-primary" />
                    <span>{title}</span>
                </CardTitle>
                <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>
                <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
                    {value}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{description}</p>
                </CardContent>
                <CardFooter>
                <Link href={href} passHref className="w-full">
                    <Button variant="ghost" className="w-full group">
                    <span>Voir les détails</span>
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                </Link>
                </CardFooter>
            </Card>
        </motion.div>
        )
}
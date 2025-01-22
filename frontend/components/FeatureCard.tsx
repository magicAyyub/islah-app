import { motion } from 'framer-motion';
import { Card, CardContent,CardHeader, CardTitle } from "@/components/ui/card";


import { FC } from 'react';

interface FeatureCardProps {
    icon: FC<{ className?: string }>;
    title: string;
    description: string;
}

export default function FeatureCard({ icon: Icon, title, description }: FeatureCardProps){
    return(
        <motion.div
        whileHover={{ scale: 1.02 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        >
        <Card className="h-full relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader>
            <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary-foreground opacity-20 rounded-full blur group-hover:opacity-30 transition-opacity" />
                <Icon className="w-12 h-12 text-primary relative" />
            </div>
            <CardTitle className="mt-4">{title}</CardTitle>
            </CardHeader>
            <CardContent>
            <p className="text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
        </motion.div>
        )
}
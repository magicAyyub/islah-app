import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Bell } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Application {
  id: number;
  name: string;
  class: string;
  date: string;
}

interface PendingApplicationsProps {
  applications: Application[];
  handleApprove: (id: number) => void;
  handleReject: (id: number) => void;
}

export default function PendingApplications({ applications, handleApprove, handleReject }: PendingApplicationsProps) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-primary" />
            <span>Demandes d&apos;inscription en attente</span>
          </CardTitle>
          <CardDescription>Gérez les nouvelles demandes d&apos;inscription</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Classe</TableHead>
                <TableHead>Date de demande</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell>{app.name}</TableCell>
                  <TableCell>{app.class}</TableCell>
                  <TableCell>{app.date}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={() => handleApprove(app.id)}>Approuver</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleReject(app.id)}>Rejeter</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    )
  }
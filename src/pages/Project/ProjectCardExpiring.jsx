
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CalendarDays, Clock } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom';


const ProjectCardExpiring = ({project}) => {
    const [progress, setProgress] = useState(0);
    const navigate = useNavigate();

    const daysLeft = useMemo(() => {
        const today = new Date()
        const dueDate = new Date(project.endDate)
        const timeDiff = dueDate.getTime() - today.getTime()
        return Math.ceil(timeDiff / (1000 * 3600 * 24))
      }, [project.endDate])

      const totalDays = useMemo(() => {
        const today = new Date()
        const dueDate = new Date(project.endDate)
        const creationDate = new Date(project.createdDate) // Giả sử dự án được tạo 30 ngày trước
        const timeDiff = dueDate.getTime() - creationDate.getTime()
        return Math.ceil(timeDiff / (1000 * 3600 * 24))
      }, [project.endDate])
      
      useEffect(() => {
        const timer = setTimeout(() => setProgress(100 - (daysLeft / totalDays * 100)), 100)
        return () => clearTimeout(timer)
      }, [daysLeft, totalDays])

    const getUrgencyColor = (daysLeft) => {
        if (daysLeft <= 3) return "bg-red-100 dark:bg-red-900"
        if (daysLeft <= 7) return "bg-yellow-100 dark:bg-yellow-900"
        return "bg-green-100 dark:bg-green-900"
      }

    
  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${getUrgencyColor(daysLeft)}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle onClick={() => navigate("/project/" + project.id)} className="text-lg font-bold">{project.name}</CardTitle>
          {daysLeft <= 7 && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
        </div>
        <CardDescription className="text-sm text-muted-foreground">Hết hạn: {project.endDate}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{daysLeft} ngày còn lại</span>
          </div>
          <div className="relative">
            
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={project.owner.avatar} alt={project.owner.fullname} />
              <AvatarFallback>{project.owner.fullname}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{project.owner.fullname}</span>
          </div>
          <Badge 
            variant="outline" 
            className={`${daysLeft <= 3 ? 'border-red-500 text-red-500' : daysLeft <= 7 ? 'border-yellow-500 text-yellow-500' : 'border-green-500 text-green-500'}`}
          >
            {daysLeft <= 3 ? "Rất gấp" : daysLeft <= 7 ? "Gấp" : "Sắp hết hạn"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProjectCardExpiring

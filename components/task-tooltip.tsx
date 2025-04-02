import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarDays, User, Info, Tag } from "lucide-react"
import { cn } from "@/lib/utils"

interface Task {
  id: string
  name: string
  startDate: Date
  endDate: Date
  status: string
  completed?: boolean
  details?: string
  responsible?: string
}

interface TaskTooltipProps {
  task: Task
  statusColors?: Record<string, string>
  statusNames?: Record<string, string>
}

export default function TaskTooltip({ task, statusColors = {}, statusNames = {} }: TaskTooltipProps) {
  // Extraer solo las clases de color de fondo (bg-*) del string de clases
  const getBgColorClass = (colorClasses: string) => {
    const bgClass = colorClasses.split(" ").find((cls) => cls.startsWith("bg-"))
    return bgClass || "bg-gray-100"
  }

  // Extraer solo las clases de color de texto (text-*) del string de clases
  const getTextColorClass = (colorClasses: string) => {
    const textClass = colorClasses.split(" ").find((cls) => cls.startsWith("text-"))
    return textClass || ""
  }

  const statusColor = statusColors[task.status] || "bg-gray-100"
  const statusName = statusNames[task.status] || task.status

  return (
    <div className="absolute z-50 top-0 left-full ml-2 transform -translate-y-1/2 w-64">
      <Card className="shadow-lg border-2 border-primary/20">
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-sm font-medium">{task.name}</CardTitle>
        </CardHeader>
        <CardContent className="py-2 px-4 text-xs space-y-2">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-3.5 w-3.5 text-gray-500" />
            <span>
              {format(task.startDate, "d MMM yyyy", { locale: es })} -{" "}
              {format(task.endDate, "d MMM yyyy", { locale: es })}
            </span>
          </div>

          {task.responsible && (
            <div className="flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-gray-500" />
              <span>{task.responsible}</span>
            </div>
          )}

          {task.details && (
            <div className="flex gap-2">
              <Info className="h-3.5 w-3.5 text-gray-500 mt-0.5 flex-shrink-0" />
              <p className="line-clamp-3">{task.details}</p>
            </div>
          )}

          <div className="pt-1 flex flex-wrap gap-1">
            <Badge
              variant="outline"
              className={cn("text-[10px] font-normal", getBgColorClass(statusColor), getTextColorClass(statusColor))}
            >
              <Tag className="h-3 w-3 mr-1" />
              {statusName}
            </Badge>

            <Badge variant="outline" className="text-[10px] font-normal">
              {task.completed ? "Completada" : "En progreso"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


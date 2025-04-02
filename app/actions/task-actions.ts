"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export type TaskStatus =
  | "prioritized"
  | "critical"
  | "priority-change"
  | "impacted"
  | "external-dev"
  | "in-development"
  | "planned"
  | "blocked"
  | "completed"

export interface TaskInput {
  name: string
  startDate: Date
  endDate: Date
  status: TaskStatus
  completed?: boolean
  details?: string
  responsible?: string
}

// Obtener todas las tareas
export async function getTasks() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: {
        startDate: "asc",
      },
    })

    return { success: true, data: tasks }
  } catch (error) {
    console.error("Error al obtener tareas:", error)
    return { success: false, error: "Error al obtener tareas" }
  }
}

// Crear una nueva tarea
export async function createTask(data: TaskInput) {
  try {
    const task = await prisma.task.create({
      data: {
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
        completed: data.completed || false,
        details: data.details || null,
        responsible: data.responsible || null,
      },
    })

    revalidatePath("/")
    return { success: true, data: task }
  } catch (error) {
    console.error("Error al crear tarea:", error)
    return { success: false, error: "Error al crear tarea" }
  }
}

// Actualizar una tarea existente
export async function updateTask(id: string, data: Partial<TaskInput>) {
  try {
    const task = await prisma.task.update({
      where: { id },
      data,
    })

    revalidatePath("/")
    return { success: true, data: task }
  } catch (error) {
    console.error("Error al actualizar tarea:", error)
    return { success: false, error: "Error al actualizar tarea" }
  }
}

// Eliminar una tarea
export async function deleteTask(id: string) {
  try {
    await prisma.task.delete({
      where: { id },
    })

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error al eliminar tarea:", error)
    return { success: false, error: "Error al eliminar tarea" }
  }
}

// Marcar una tarea como completada o no completada
export async function toggleTaskCompletion(id: string, completed: boolean) {
  try {
    const task = await prisma.task.update({
      where: { id },
      data: { completed },
    })

    revalidatePath("/")
    return { success: true, data: task }
  } catch (error) {
    console.error("Error al actualizar estado de tarea:", error)
    return { success: false, error: "Error al actualizar estado de tarea" }
  }
}

// Inicializar la base de datos con datos de ejemplo
export async function seedDatabase() {
  try {
    // Verificar si ya hay datos
    const count = await prisma.task.count()
    if (count > 0) {
      return { success: true, message: "La base de datos ya contiene datos" }
    }

    // Datos de ejemplo
    const sampleTasks = [
      {
        name: "ACH Xpress",
        startDate: new Date(2025, 0, 1),
        endDate: new Date(2025, 3, 15),
        status: "external-dev",
        details: "Implementación del sistema de pagos ACH Xpress para transferencias bancarias rápidas",
        responsible: "Equipo de Pagos",
      },
      {
        name: "3DS Recargas",
        startDate: new Date(2025, 0, 15),
        endDate: new Date(2025, 2, 15),
        status: "external-dev",
        completed: true,
        details: "Integración del protocolo 3D Secure para recargas con mayor seguridad",
        responsible: "Equipo de Seguridad",
      },
      // Añadir más tareas según sea necesario
    ]

    // Crear las tareas
    await prisma.task.createMany({
      data: sampleTasks,
    })

    revalidatePath("/")
    return { success: true, message: "Base de datos inicializada con éxito" }
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error)
    return { success: false, error: "Error al inicializar la base de datos" }
  }
}


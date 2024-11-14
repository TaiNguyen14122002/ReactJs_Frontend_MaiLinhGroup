
import React, { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, ChevronDown, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { parseISO } from 'date-fns'


const Calender = () => { 
const [currentDate, setCurrentDate] = React.useState(new Date(2024, 10)) // November 2024
const [view, setView] = React.useState("month")
const [hideRecurring, setHideRecurring] = React.useState(false)

const taskColors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
  ]

  const priorityColors = {
    High: 'bg-red-500',
    Medium: 'bg-yellow-500',
    Low: 'bg-green-500',
    default: 'bg-gray-500'
  }
  
const [tasks, setTasks] = useState([])

const {id} = useParams()
const token = localStorage.getItem('jwt')

const fetchIssueCalender = async() => {
    try {
        const response = await axios.get(`http://localhost:1000/api/issues/GetIssueByProjectIdAndUserId`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                projectId: id
            }
        })
        const tasksData = response.data.map((task, index) => ({
            ...task,
            startDate: parseISO(task.startDate),
            dueDate: parseISO(task.dueDate),
            color: priorityColors[task.priority] || priorityColors.default// Assign a color to each task
        }))

        console.log("Dữ liệu cho lịch", tasksData)
        setTasks(tasksData)
    } catch(error) {
        console.log("Có lỗi xẩy ra trong quá trình thực hiện dữ liệu", error)
    }
}

useEffect(() => {
    fetchIssueCalender()
}, [id])

const [isAddingTask, setIsAddingTask] = React.useState(false)
const [newTask, setNewTask] = React.useState({})

const weekDays = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"]
const months = [
    "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
    "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
]

const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    const days = []
    const startPadding = (firstDay.getDay() + 6) % 7 // Monday is 0

    for (let i = startPadding - 1; i >= 0; i--) {
        const day = new Date(year, month, -i)
        days.push(day)
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
        days.push(new Date(year, month, i))
    }

    const endPadding = 42 - days.length // Always show 6 weeks
    for (let i = 1; i <= endPadding; i++) {
        days.push(new Date(year, month + 1, i))
    }

    return days
}

const navigateMonth = (direction) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + (direction === 'next' ? 1 : -1)))
}

const formatMonthYear = (date) => {
    return `tháng ${date.getMonth() + 1} năm ${date.getFullYear()}`
}

const addTask = () => {
    if (newTask.title && newTask.startDate && newTask.dueDate) {
        const newTaskWithColor = {
            ...newTask,
            id: Date.now().toString(),
            color: taskColors[tasks.length % taskColors.length]
        }
        setTasks([...tasks, newTaskWithColor])
        setIsAddingTask(false)
        setNewTask({})
    }
}

const isCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth()
}

const getTasksForDate = (date) => {
    return tasks.filter(task => {
        const taskStartDate = new Date(task.startDate)
        const taskdueDate = new Date(task.dueDate)

        if (hideRecurring && task.isRecurring) {
            return false
        }

        return date >= taskStartDate && date <= taskdueDate
    })
}

const handleMonthChange = (month) => {
    const monthIndex = months.indexOf(month)
    if (monthIndex !== -1) {
        setCurrentDate(new Date(currentDate.getFullYear(), monthIndex))
    }
}

const handleYearChange = (year) => {
    setCurrentDate(new Date(parseInt(year), currentDate.getMonth()))
}

return (
    <div className="p-4 max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => navigateMonth('prev')}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-1">
                            {formatMonthYear(currentDate)}
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56">
                        <div className="grid gap-4">
                            <Select onValueChange={handleMonthChange} defaultValue={months[currentDate.getMonth()]}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn tháng" />
                                </SelectTrigger>
                                <SelectContent>
                                    {months.map((month) => (
                                        <SelectItem key={month} value={month}>
                                            {month}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select onValueChange={handleYearChange} defaultValue={currentDate.getFullYear().toString()}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn năm" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from({ length: 10 }, (_, i) => currentDate.getFullYear() - 5 + i).map((year) => (
                                        <SelectItem key={year} value={year.toString()}>
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </PopoverContent>
                </Popover>
                <Button variant="ghost" size="icon" onClick={() => navigateMonth('next')}>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm">Ẩn các nhiệm vụ lặp lại trong tương lai</span>
                    <Switch checked={hideRecurring} onCheckedChange={setHideRecurring} />
                </div>
                <div className="flex items-center border rounded-md">
                    <Button
                        variant={view === "week" ? "secondary" : "ghost"}
                        className="rounded-r-none"
                        onClick={() => setView("week")}
                    >
                        Tuần
                    </Button>
                    <Button
                        variant={view === "month" ? "secondary" : "ghost"}
                        className="rounded-l-none"
                        onClick={() => setView("month")}
                    >
                        Tháng
                    </Button>
                </div>
            </div>
        </div>

        <div className="border rounded-lg">
            <div className="grid grid-cols-7 border-b">
                {weekDays.map((day) => (
                    <div key={day} className="p-2 text-center text-sm font-medium border-r last:border-r-0">
                        {day}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7">
                {getDaysInMonth(currentDate).map((date, index) => {
                    const dayTasks = getTasksForDate(date)
                    return (
                        <div
                            key={index}
                            className={`min-h-[100px] p-2 border-r border-b last:border-r-0 relative ${isCurrentMonth(date) ? 'bg-background' : 'bg-muted/20'
                                }`}
                        >
                            <div className="flex items-start justify-between">
                                <span className={`text-sm ${isCurrentMonth(date) ? '' : 'text-muted-foreground'}`}>
                                    {date.getDate()}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 opacity-0 hover:opacity-100"
                                    onClick={() => {
                                        setNewTask({ startDate: date, dueDate: date })
                                        setIsAddingTask(true)
                                    }}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            {dayTasks.map((task) => {
                                const isStart = task.startDate.getDate() === date.getDate()
                                const isEnd = task.dueDate.getDate() === date.getDate()
                                return (
                                    <div
                                        key={task.id}
                                        className={`mt-1 p-1 text-xs ${task.color} text-white rounded-sm cursor-pointer ${isStart ? 'rounded-l-sm' : ''
                                            } ${isEnd ? 'rounded-r-sm' : ''}`}
                                        style={{
                                            marginLeft: isStart ? '0' : '-8px',
                                            marginRight: isEnd ? '0' : '-8px',
                                        }}
                                    >
                                        {isStart ? task.title : '\u00A0'}
                                    </div>
                                )
                            })}
                        </div>
                    )
                })}
            </div>
        </div>

        {/* <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Thêm nhiệm vụ mới</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="task-title">Tiêu đề nhiệm vụ</Label>
                        <Input
                            id="task-title"
                            placeholder="Nhập tiêu đề nhiệm vụ"
                            value={newTask.title || ''}
                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="task-start">Ngày bắt đầu</Label>
                        <Input
                            id="task-start"
                            type="date"
                            value={newTask.startDate ? newTask.startDate.toISOString().split('T')[0] : ''}
                            onChange={(e) => setNewTask({ ...newTask, startDate: new Date(e.target.value) })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="task-end">Ngày kết thúc</Label>
                        <Input
                            id="task-end"
                            type="date"
                            value={newTask.dueDate ? newTask.dueDate.toISOString().split('T')[0] : ''}
                            onChange={(e) => setNewTask({ ...newTask, dueDate: new Date(e.target.value) })}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Switch
                            id="task-recurring"
                            checked={newTask.isRecurring || false}
                            onCheckedChange={(checked) => setNewTask({ ...newTask, isRecurring: checked })}
                        />
                        <Label htmlFor="task-recurring">Nhiệm vụ lặp lại</Label>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={addTask}>Thêm nhiệm vụ</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog> */}
    </div>
)
}

export default Calender

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MagnifyingGlassIcon, MixerHorizontalIcon } from '@radix-ui/react-icons'
import React, { useEffect, useState } from 'react'
import ProjectCard from '../Project/ProjectCard'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProjects, searchProjects } from '@/Redux/Project/Action'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import axios from 'axios'


import { ShoppingBag, Users, ArrowUpRight, Activity, Warehouse, Bell } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { FaBuilding } from 'react-icons/fa'



const ProjectList = () => {

    const salesData = [
        { month: 'January', sales: 30 },
        { month: 'February', sales: 40 },
        { month: 'March', sales: 45 },
        { month: 'April', sales: 60 },
        { month: 'May', sales: 80 },
        { month: 'June', sales: 65 },
        { month: 'July', sales: 75 },
    ]

    const messages = [
        {
            id: 1,
            sender: 'Alexander Pierce',
            message: 'Is this template really for free? That\'s unbelievable!',
            time: '23 Jan 2:50 pm',
            avatar: '/placeholder.svg'
        },
        {
            id: 2,
            sender: 'Sarah Bullock',
            message: 'You better believe it!',
            time: '23 Jan 5:17 pm',
            avatar: '/placeholder.svg'
        },
    ]

    const todos = [
        { id: 1, text: 'Design a nice theme', duration: '2 days' },
        { id: 2, text: 'Make the theme responsive', duration: '4 hours' },
        { id: 3, text: 'Let theme shine like a star', duration: '1 day' },
        { id: 4, text: 'Check your messages and notifications', duration: '1 week' },
    ]

    const token = localStorage.getItem(`jwt`);



    const [branch, setBranch] = useState([]);
    const [department, setDepartment] = useState([]);
    const [partner, setPartner] = useState([]);
    const [message, setMessage] = useState([]);



    console.log(token)

    const fetchBranch = async () => {
        try {
            const response = await axios.get(`http://localhost:2000/api/branch/show`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setBranch(response.data);
        } catch (error) {
            console.error("Có lỗi xảy ra trong quá trình thực hiện dữ liệu", error);
        }
    };

    const fetchDepartment = async() => {
        try{
            const response = await axios.get(`http://localhost:2000/api/department/show`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setDepartment(response.data)
        }catch(error){
            console.error("Có lỗi xảy ra trong quá trình thực hiện dữ liệu", error);
        }
    }

    const fetchPartner = async() => {
        try{
            const response = await axios.get(`http://localhost:2000/api/partner`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setPartner(response.data)
        }catch(error){
            console.error("Có lỗi xảy ra trong quá trình thực hiện dữ liệu", error);
        }
    }

    const fetchMessage = async() => {
        try{
            const response = await axios.get(`http://localhost:2000/api/partner`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setPartner(response.data)
        }catch(error){
            console.error("Có lỗi xảy ra trong quá trình thực hiện dữ liệu", error);
        }
    }
    
    useEffect(() => {
        fetchBranch();
        fetchDepartment();
        fetchPartner();
    }, [token])

    console.log(branch)

    return (
        <>
            <div className="min-h-screen bg-gray-100 p-4">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Bảng điều khiển</h1>
                    
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <Card className="p-4 bg-teal-500 text-white">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-3xl font-bold">{branch.length}</h2>
                                <p>Chi nhánh</p>
                            </div>
                            <Warehouse className="h-8 w-8 opacity-50" />
                        </div>
                        <div className="mt-4 text-sm">
                            Danh sách chi tiết <ArrowUpRight className="inline h-4 w-4" />
                        </div>
                    </Card>

                    <Card className="p-4 bg-green-500 text-white">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-3xl font-bold">{department.length}</h2>
                                <p>Phòng ban</p>
                            </div>
                            <FaBuilding className="h-8 w-8 opacity-50" />
                        </div>
                        <div className="mt-4 text-sm">
                            Danh sách chi tiết <ArrowUpRight className="inline h-4 w-4" />
                        </div>
                    </Card>

                    <Card className="p-4 bg-yellow-500 text-white">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-3xl font-bold">{partner.length}</h2>
                                <p>Đối tác</p>
                            </div>
                            <Users className="h-8 w-8 opacity-50" />
                        </div>
                        <div className="mt-4 text-sm">
                            Danh sách chi tiết <ArrowUpRight className="inline h-4 w-4" />
                        </div>
                    </Card>

                    <Card className="p-4 bg-red-500 text-white">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-3xl font-bold">65</h2>
                                <p>Thông báo</p>
                            </div>
                            <Bell className="h-8 w-8 opacity-50" />
                        </div>
                        <div className="mt-4 text-sm">
                            Danh sách chi tiết <ArrowUpRight className="inline h-4 w-4" />
                        </div>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2">
                        <Card className="p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold">Sales</h3>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1 bg-blue-500 text-white rounded">Area</button>
                                    <button className="px-3 py-1 bg-gray-200 rounded">Donut</button>
                                </div>
                            </div>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={salesData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="sales" stroke="#8884d8" fill="#8884d8" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        <Card className="mt-4 p-4">
                            <h3 className="font-bold mb-4">Direct Chat</h3>
                            <div className="space-y-4">
                                {messages.map((message) => (
                                    <div key={message.id} className="flex gap-3">
                                        <img
                                            src={message.avatar}
                                            alt={message.sender}
                                            className="h-10 w-10 rounded-full"
                                        />
                                        <div className="flex-1">
                                            <div className="flex justify-between">
                                                <p className="font-bold">{message.sender}</p>
                                                <span className="text-sm text-gray-500">{message.time}</span>
                                            </div>
                                            <p className="text-gray-600">{message.message}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Type Message ..."
                                    className="flex-1 p-2 border rounded"
                                />
                                <button className="px-4 py-2 bg-blue-500 text-white rounded">
                                    Send
                                </button>
                            </div>
                        </Card>

                        <Card className="mt-4 p-4">
                            <h3 className="font-bold mb-4">To Do List</h3>
                            <div className="space-y-2">
                                {todos.map((todo) => (
                                    <div key={todo.id} className="flex items-center gap-2 p-2 hover:bg-gray-50">
                                        <input type="checkbox" className="h-4 w-4" />
                                        <span>{todo.text}</span>
                                        <span className="ml-auto text-sm bg-gray-200 px-2 py-1 rounded">
                                            {todo.duration}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 flex justify-center gap-2">
                                <button className="w-8 h-8 border rounded hover:bg-gray-50">1</button>
                                <button className="w-8 h-8 border rounded bg-blue-500 text-white">2</button>
                                <button className="w-8 h-8 border rounded hover:bg-gray-50">3</button>
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-4">
                        <Card className="p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold">Visitors</h3>
                                <button className="p-1 hover:bg-gray-100 rounded">
                                    <ArrowUpRight className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="bg-blue-500 h-[300px] rounded-lg relative">
                                <img
                                    src="/placeholder.svg?height=300&width=400"
                                    alt="US Map"
                                    className="w-full h-full object-cover rounded-lg"
                                />
                                <div className="absolute bottom-0 left-0 right-0 flex justify-around p-4 text-white">
                                    <div className="text-center">
                                        <div className="text-sm">Visitors</div>
                                        <div className="h-16 w-8 bg-white/20 rounded mt-1"></div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-sm">Online</div>
                                        <div className="h-16 w-8 bg-white/20 rounded mt-1"></div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-sm">Sales</div>
                                        <div className="h-16 w-8 bg-white/20 rounded mt-1"></div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold">Sales Graph</h3>
                                <button className="p-1 hover:bg-gray-100 rounded">
                                    <ArrowUpRight className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="h-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={salesData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="sales" stroke="#8884d8" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <div className="inline-block p-4 rounded-full border-4 border-blue-500">
                                        <span className="text-lg font-bold">30%</span>
                                    </div>
                                    <div className="mt-2">Mail-Orders</div>
                                </div>
                                <div>
                                    <div className="inline-block p-4 rounded-full border-4 border-green-500">
                                        <span className="text-lg font-bold">55%</span>
                                    </div>
                                    <div className="mt-2">Online</div>
                                </div>
                                <div>
                                    <div className="inline-block p-4 rounded-full border-4 border-red-500">
                                        <span className="text-lg font-bold">15%</span>
                                    </div>
                                    <div className="mt-2">In-Store</div>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold">Calendar</h3>
                                <div className="flex items-center gap-2">
                                    <button className="p-1 hover:bg-gray-100 rounded">
                                        <ArrowUpRight className="h-4 w-4" />
                                    </button>
                                    <button className="p-1 hover:bg-gray-100 rounded">
                                        <ArrowUpRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="text-center mb-4">
                                <h4 className="font-bold">January 2024</h4>
                            </div>
                            <div className="grid grid-cols-7 gap-1 text-sm">
                                <div className="text-center font-medium">Su</div>
                                <div className="text-center font-medium">Mo</div>
                                <div className="text-center font-medium">Tu</div>
                                <div className="text-center font-medium">We</div>
                                <div className="text-center font-medium">Th</div>
                                <div className="text-center font-medium">Fr</div>
                                <div className="text-center font-medium">Sa</div>
                                {Array.from({ length: 31 }, (_, i) => (
                                    <div
                                        key={i}
                                        className="aspect-square flex items-center justify-center border rounded hover:bg-gray-50 cursor-pointer"
                                    >
                                        {i + 1}
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProjectList
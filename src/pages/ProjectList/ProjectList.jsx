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
import { Eye, EyeOff } from 'lucide-react'
import axios from 'axios'

export const tags = [
    "Tất cả", "React", "Nextjs", "Spring Boot", "mysql", "MongoDB", "Angular", "python", "flask", "django"
];

const ProjectList = () => {
    const [keyword, setKeyword] = useState("");
    const { project } = useSelector(store => store)
    const [projectPinned, setProjectPinned] = useState([]);
    const dispatch = useDispatch();

    const [showPinned, setShowPinned] = useState(true)
    const [showAll, setShowAll] = useState(true)
    const token = localStorage.getItem('jwt');


    const handleFilterCategory = (value) => {
        if (value == "all") {
            dispatch(fetchProjects({}))
        }
        else
            dispatch(fetchProjects({ category: value }))
        // console.log("value", value, section)
    }

    const handleFilterTags = (value) => {
        if (value == "all") {
            dispatch(fetchProjects({}))
        }
        else
            dispatch(fetchProjects({ tag: value }))

    }

    const handSearchChange = (e) => {
        setKeyword(e.target.value);
        dispatch(searchProjects(e.target.value));

    };

    const fetchProjectPinned = async () => {
        try {
            if (!token) {
                console.log("Người dùng không tồn tại");
                return;
            }
            
            const response = await axios.get(`http://localhost:1000/api/projects/projectPinned`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                
            });
    
            console.log(response.data); // Hoặc xử lý dữ liệu nhận được ở đây
            setProjectPinned(response.data);
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
        }
    };
    

    useEffect(() => {
        fetchProjectPinned();
      },[])

    console.log("project store", project)
    return (
        <>
            <div className="min-h-screen py-6 px-4 space-y-6 bg-background">
                <h1 className="text-2xl font-bold">kế hoạch</h1>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Select onValueChange={(value) => handleFilterCategory(value)}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Thể loại" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả</SelectItem>
                            <SelectItem value="Full Stack">Full Stack</SelectItem>
                            <SelectItem value="Front End">Front End</SelectItem>
                            <SelectItem value="backend">Back End</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select onValueChange={(value) => handleFilterTags(value)}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Ngôn ngữ lập trình" />
                        </SelectTrigger>
                        <SelectContent>
                            {tags.map((item) => (
                                <div key={item} className="flex items-center gap-2">
                                    <SelectItem value={item}>{item}</SelectItem>
                                </div>
                            ))}
                        </SelectContent>
                    </Select>

                    <div className="flex flex-1 gap-2">
                        <Input
                            placeholder="Tìm kiếm kế hoạch ..."
                            value={keyword}
                            onChange={handSearchChange}
                            className="flex-1"
                        />
                        <Button className="bg-black text-white hover:bg-black/90">Search</Button>
                    </div>
                </div>

                <div className="space-y-8 p-4">
                    <section>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Dự án đã ghim</h2>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowPinned(!showPinned)}
                                aria-label={showPinned ? "Ẩn dự án đã ghim" : "Hiện dự án đã ghim"}
                            >
                                {showPinned ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </Button>
                        </div>
                        {showPinned && <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                           {projectPinned.map((item) => (
                            <ProjectCard key={item.id} item={item}/>
                           ))}
                        </div>}
                    </section>

                    <section>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Tất cả dự án</h2>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowAll(!showAll)}
                                aria-label={showAll ? "Ẩn tất cả dự án" : "Hiện tất cả dự án"}
                            >
                                {showAll ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </Button>
                        </div>
                        {showAll && <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {keyword
                                ? project.searchProjects?.map((item, index) => (
                                    <ProjectCard item={item} key={item.id * index} />
                                ))
                                : project.projects?.map((item) => (
                                    <ProjectCard key={item.id} item={item} />
                                ))}
                        </div>}
                    </section>

                </div>


            </div>
        </>
    )
}

export default ProjectList
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

export const tags = [
    "Tất cả", "react", "nextjs", "spring boot", "mysql", "MongoDB", "angular", "python", "flask", "django"
];

const ProjectList = () => {
    const [keyword, setKeyword] = useState("");
    const {project} = useSelector(store => store )
    const dispatch = useDispatch();
    const handleFilterCategory = (value) => {
        if(value == "all"){
            dispatch(fetchProjects({}))
        }
        else
        dispatch(fetchProjects({category: value}))
        // console.log("value", value, section)
    }

    const handleFilterTags = (value) => {
        if(value == "all"){
            dispatch(fetchProjects({}))
        }
        else
        dispatch(fetchProjects({tag: value}))
  
    }

    const handSearchChange = (e) => {
        setKeyword(e.target.value);
        dispatch(searchProjects(e.target.value));

    };

    // useEffect(() => {
    //     dispatch(fetchProjects({}))
    //   },[])

    console.log("project store", project)
    return (
        <>
            <div className='relative px-5 lg:px-0 lg:flex gap-5 justify-center py-5'>

                <section className='filter sextion'>

                    <Card className='p-5 sticky top-10'>

                        <div className='flex justify-between lg:w-[20rem]'>
                            <p className='text-xl -tracking-wider'>
                                Lọc dự án
                            </p>
                            <Button variant="ghost" size="icon">

                                <MixerHorizontalIcon />

                            </Button>

                        </div>

                        <CardContent className="mt-5">

                            <ScrollArea className="spay-y-7 h-[70vh]">

                                <div>
                                    <h1 className='pb-3 text-gray-400 border-b'>
                                        Thể loại
                                    </h1>
                                    <div className='pt-5'>

                                        <RadioGroup className="space-y-3 pt-5" defaultValue="all" onValueChange={(value) => handleFilterCategory(value)}>
                                            <div className="flex items-center gap-2">
                                                <RadioGroupItem value='all' id="r1" />
                                                <Label htmlFor="r1">Tất cả</Label>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <RadioGroupItem value='Full Stack' id="r2" />
                                                <Label htmlFor="r2">Full Stack</Label>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <RadioGroupItem value='Frontend' id="r3" />
                                                <Label htmlFor="r3">Frontend</Label>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <RadioGroupItem value='Backend' id="r4" />
                                                <Label htmlFor="r4">Backend</Label>
                                            </div>
                                        </RadioGroup>

                                    </div>
                                </div>

                                <div className='pt-9'>
                                    <h1 className='pb-3 text-gray-400 border-b'>
                                        Ngôn ngữ lập trình
                                    </h1>
                                    <div className='pt-5'>

                                        <RadioGroup className="space-y-3 pt-5" defaultValue="all" onValueChange={(value) => handleFilterTags(value)}>

                                            {tags.map((item) => <div key={item} className="flex items-center gap-2">
                                                <RadioGroupItem value={item} id={`r1-${item}`} />
                                                <Label htmlFor={`r1-${item}`}>{item}</Label>
                                            </div>)}


                                        </RadioGroup>

                                    </div>
                                </div>

                            </ScrollArea>

                        </CardContent>

                    </Card>
                </section>
                <section className='projectListSection wf-full lg:w-[48rem]'>

                    <div className='flex gap-2 items-center pb-5 justify-beetween'>

                        <div className='relative p-0 w-full'>
                            <Input onChange={handSearchChange} placeholder="Tìm kiếm dự án" className="40% px-9"/>
                            <MagnifyingGlassIcon className="absolute top-3 left-4"/>

                        </div>

                    </div>

                    <div>
                        <div className='space-y-5 min-h-[74vh]'>

                            {
                                keyword?
                                project.searchProjects?.map((item, index) => <ProjectCard item={item} key={item.id * index}/>)
                                :
                                project.projects?.map((item) => <ProjectCard key={item.id} item={item}/>)
                            }

                        </div>
                    </div>

                </section>

            </div>
        </>
    )
}

export default ProjectList
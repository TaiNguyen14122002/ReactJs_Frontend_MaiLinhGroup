import { Button } from '@/components/ui/button'
import { DialogClose } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import React from 'react'
import { useForm } from 'react-hook-form'
import { tags } from '../ProjectList/ProjectList'
import { Cross1Icon } from '@radix-ui/react-icons'
import { useDispatch } from 'react-redux'
import { createProject } from '@/Redux/Project/Action'

const CreateProjectForm = () => {
    

    const dispatch = useDispatch();

    const handleTagsChange = (newValue) => {
        const currentTags = form.getValues("tags");
        const updatedTags = currentTags.includes(newValue) ?
            currentTags.filter(tag => tag !== newValue) : [...currentTags, newValue];
    
        form.setValue("tags", updatedTags);
    }
    
    const form = useForm({
        // resolver: zod
        defaultValues: {
            name: "",
            description: "",
            tags : [],
            category: ""
        }
    })

    // const onSubmit = (data) => {
    //     dispatch(createProject(data));
    //     console.log("create project data:", data);
    // }
    const onSubmit = (data) => {
        dispatch(createProject(data));
        dispatch(fetchProjects({}));
    console.log("Create project data:", data);
        // console.log("create project data:", data)
}

    return (
        <div>
            <Form {...form}>
                <form className='space-y-5' onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField control={form.control}
                        name="name"
                        render={({ field }) => <FormItem>
                            <FormControl>
                                <Input {...field}
                                    type="text"
                                    className="border w-full bordergray-700 py-5 px-5"
                                    placeholder="Tên dự án ..." />
                            </FormControl>
                            <FormMessage />
                        </FormItem>}
                    />
                    <FormField control={form.control}
                        name="description"
                        render={({ field }) => <FormItem>
                            <FormControl>
                                <Input {...field}
                                    type="text"
                                    className="border w-full bordergray-700 py-5 px-5"
                                    placeholder="Mô tả ..." />
                            </FormControl>
                            <FormMessage />
                        </FormItem>}
                    />
                    <FormField control={form.control}
                        name="category"
                        render={({ field }) => <FormItem>
                            <FormControl>
                                <Select
                                    defaultValue='fullstack'
                                    value={field.value}
                                    onValueChange={(value) => {
                                        field.onChange(value)
                                    }}

                                // className="border w-full bordergray-700 py-5 px-5"
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Thể loại" />

                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="fullstack">Full Stack</SelectItem>
                                        <SelectItem value="frontend">Frontend</SelectItem>
                                        <SelectItem value="backend">Backend</SelectItem>
                                    </SelectContent>
                                </Select>

                            </FormControl>
                            <FormMessage />
                        </FormItem>}
                    />
                    <FormField control={form.control}
                        name="tags"
                        render={({ field }) => <FormItem>
                            <FormControl>
                                <Select
                                    // defaultValue='spring boot'
                                    // value={field.value}
                                    onValueChange={(value) => {
                                        handleTagsChange(value)
                                    }}

                                // className="border w-full bordergray-700 py-5 px-5"
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Ngôn ngữ lập trình" />

                                    </SelectTrigger>
                                    <SelectContent>
                                        {tags.map((item) => (
                                            <SelectItem key={item} value={item} >
                                                {item}
                                            </SelectItem>
                                        ))}


                                    </SelectContent>
                                </Select>

                            </FormControl>
                            <div className='flex gap-1 flex-wrap'>

                                {field.value.map((item) => <div key={item} onClick={() => handleTagsChange(item)} className='cursor-point flex rounded-full items-center border px-4 gap-2 py-1'>
                                    <span className='text-sm'>{item}</span>
                                    <Cross1Icon className='h-3 w-3' />
                                </div>)}

                            </div>
                            <FormMessage />
                        </FormItem>}
                    />
                    <DialogClose>
                        <Button type="submit" className="w-100 mt-5 flex items-center ">
                            Tạo kế hoạch</Button>
                    </DialogClose>
                </form>
            </Form>
        </div>
    )
}

export default CreateProjectForm
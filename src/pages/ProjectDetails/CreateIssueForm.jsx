import { Button } from '@/components/ui/button'
import { DialogClose } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import React from 'react'
import { useForm } from 'react-hook-form'
import { tags } from '../ProjectList/ProjectList'
import { Cross1Icon } from '@radix-ui/react-icons'
import { useDispatch } from 'react-redux'
import { createIssue } from '@/Redux/Issue/Action'
import { useParams } from 'react-router-dom'
import { Textarea } from '@/components/ui/textarea'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'

const CreateIssueForm = ({ status }) => {
    //     const {id} = useParams();
    //     const dispatch = useDispatch();
    //   const form = useForm({
    //     // resolver: zod
    //     defaultValues: {
    //         issueName: "",
    //         description: "",
    //         priority: "",
    //         startDate: "",
    //         dueDate: ""
    //     },
    // })

    // const onSubmit = (data) => {
    //     data.projectId = id;

    //     dispatch(createIssue({
    //         title: data.issueName, 
    //         description: data.description, 
    //         projectId: id,
    //         priority: data.priority,
    //         startDate: data.startDate,
    //         dueDate: data.dueDate,
    //         status,
    //     }))
    //     console.log("create issue data:", data);
    // };
    const { id } = useParams();
    const dispatch = useDispatch();

    // Khởi tạo useForm với defaultValues cho các trường
    const form = useForm({
        defaultValues: {
            issueName: "",
            description: "",
            priority: "",
            startDate: null,
            dueDate: null,
        },
    });

    const onSubmit = (data) => {
        data.projectId = id;

        dispatch(createIssue({
            title: data.issueName,
            description: data.description,
            projectId: id,
            priority: data.priority,
            startDate: data.startDate,
            dueDate: data.dueDate,
            price: data.price,
            status,
        }));
        console.log("create issue data:", data);
    };


    return (
       
        <div className="w-full max-w-md mx-auto p-6 space-y-6 bg-card rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center text-foreground">Tạo Tác Vụ Mới</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="issueName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tên tác vụ</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Nhập tên tác vụ..." className="w-full" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mô tả</FormLabel>
                                <FormControl>
                                    <Textarea {...field} placeholder="Nhập mô tả..." className="w-full" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Độ ưu tiên</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn độ ưu tiên" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Low">Thấp</SelectItem>
                                        <SelectItem value="Medium">Bình thường</SelectItem>
                                        <SelectItem value="High">Cao</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Thu nhập</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} placeholder="Nhập số tiền khi hoàn thành..." className="w-full" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField control={form.control}
                        name="startDate"
                        render={({ field }) => <FormItem className="flex flex-col">
                            <FormLabel>Ngày bắt đầu</FormLabel>
                            <FormControl>
                                <Input {...field}
                                    type="date"
                                    className="border w-full bordergray-700 py-5 px-5"
                                    placeholder="Ngày hết hạn ..." />

                            </FormControl>

                            <FormMessage />
                        </FormItem>}
                    />
                    <FormField control={form.control}
                        name="dueDate"
                        render={({ field }) => <FormItem className="flex flex-col">
                            <FormLabel>Ngày kết thúc</FormLabel>
                            <FormControl>
                                <Input {...field}
                                    type="date"
                                    className="border w-full bordergray-700 py-5 px-5"
                                    placeholder="Ngày hết hạn ..." />

                            </FormControl>

                            <FormMessage />
                        </FormItem>}
                    />

                    <DialogClose asChild>
                        <Button type="submit" className="w-full">
                            Tạo Tác Vụ
                        </Button>
                    </DialogClose>
                </form>
            </Form>
        </div>
    )
}

export default CreateIssueForm
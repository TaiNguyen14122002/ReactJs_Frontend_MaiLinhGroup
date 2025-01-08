import { Button } from '@/components/ui/button';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
// import { tags } from '../ProjectList/ProjectList';
import { Cross1Icon } from '@radix-ui/react-icons';
import { useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import { createProject, fetchProjects } from '@/Redux/Project/Action';
import { Label } from '@/components/ui/label';

const CreateProjectForm = () => {
    // const dispatch = useDispatch();
    // const [name, setName] = useState('');
    // const [description, setDescription] = useState('');
    // const [category, setCategory] = useState('');
    // const [tagss, setTagss] = useState([]);



    // const form = useForm({
    //     mode: "onChange",
    //     defaultValues: {
    //         name: "",
    //         description: "",
    //         tags: [],
    //         category: "",
    //         endDate: "",
    //         fundingAmount: ""

    //     }
    // });

    // const handleTagsChange = (newValue) => {
    //     const currentTags = form.getValues("tags");
    //     const updatedTags = currentTags.includes(newValue) ?
    //         currentTags.filter(tag => tag !== newValue) : [...currentTags, newValue];

    //     form.setValue("tags", updatedTags);
    // };

    // const onSubmit = (data) => {
    //     if (!data.name || !data.description || !data.category || data.tags.length === 0) {
    //         toast.error("Vui lòng nhập đầy đủ thông tin!");
    //         return; // Dừng lại nếu dữ liệu không hợp lệ
    //     }

    //     dispatch(createProject(data));
    //     dispatch(fetchProjects({}));
    //     toast.success("Dự án đã được tạo thành công!");
    //     console.log("Create project data:", data);
    // };

    return (
        // <div>

        //     <Form {...form}>
        //         <form className='space-y-5' onSubmit={form.handleSubmit(onSubmit)}>
        //             <FormField control={form.control}
        //                 name="name"
        //                 render={({ field }) => (
        //                     <FormItem>
        //                         <Label htmlFor="name" className="text-right">
        //                             Tên kế hoạch
        //                         </Label>
        //                         <FormControl>

        //                             <Input {...field}
        //                                 type="text"
        //                                 className="border w-full bordergray-700 py-5 px-5"
        //                                 placeholder="Tên dự án ..." />
        //                         </FormControl>
        //                         <FormMessage />
        //                     </FormItem>
        //                 )}
        //             />
        //             <FormField control={form.control}
        //                 name="description"
        //                 render={({ field }) => (
        //                     <FormItem>
        //                         <Label htmlFor="description" className="text-right">
        //                             Mô tả
        //                         </Label>
        //                         <FormControl>
        //                             <Input {...field}
        //                                 type="text"
        //                                 className="border w-full bordergray-700 py-5 px-5"
        //                                 placeholder="Mô tả ..." />
        //                         </FormControl>
        //                         <FormMessage />
        //                     </FormItem>
        //                 )}
        //             />
        //             <FormField control={form.control}
        //                 name="category"
        //                 render={({ field }) => (
        //                     <FormItem>
        //                         <Label htmlFor="category" className="text-right">
        //                             Thể loại
        //                         </Label>
        //                         <FormControl>
        //                             <Select
        //                                 defaultValue='fullstack'
        //                                 value={field.value}
        //                                 onValueChange={field.onChange}
        //                             >
        //                                 <SelectTrigger className="w-full">
        //                                     <SelectValue placeholder="Thể loại" />
        //                                 </SelectTrigger>
        //                                 <SelectContent>
        //                                     <SelectItem value="Full Stack">Full Stack</SelectItem>
        //                                     <SelectItem value="Front End">Frontend</SelectItem>
        //                                     <SelectItem value="backend">Backend</SelectItem>
        //                                 </SelectContent>
        //                             </Select>
        //                         </FormControl>
        //                         <FormMessage />
        //                     </FormItem>
        //                 )}
        //             />
        //             <FormField control={form.control}
        //                 name="tags"
        //                 render={({ field }) => (
        //                     <FormItem>
        //                         <Label htmlFor="language" className="text-right">
        //                             Ngôn ngữ lập trình
        //                         </Label>
        //                         <FormControl>
        //                             <Select
        //                                 onValueChange={handleTagsChange}
        //                             >
        //                                 <SelectTrigger className="w-full">
        //                                     <SelectValue placeholder="Ngôn ngữ lập trình" />
        //                                 </SelectTrigger>
        //                                 <SelectContent>
        //                                     {tags.map((item) => (
        //                                         <SelectItem key={item} value={item}>
        //                                             {item}
        //                                         </SelectItem>
        //                                     ))}
        //                                 </SelectContent>
        //                             </Select>
        //                         </FormControl>
        //                         <div className='flex gap-1 flex-wrap'>
        //                             {field.value.map((item) => (
        //                                 <div key={item} onClick={() => handleTagsChange(item)} className='cursor-pointer flex rounded-full items-center border px-4 gap-2 py-1'>
        //                                     <span className='text-sm'>{item}</span>
        //                                     <Cross1Icon className='h-3 w-3' />
        //                                 </div>
        //                             ))}
        //                         </div>
        //                         <FormMessage />
        //                     </FormItem>
        //                 )}
        //             />

        //             <FormField control={form.control}
        //                 name="endDate"
        //                 render={({ field }) => <FormItem className="flex flex-col">
        //                     <FormLabel>Ngày kết thúc</FormLabel>
        //                     <FormControl>
        //                         <Input {...field}
        //                             type="date"
        //                             className="border w-full bordergray-700 py-5 px-5"
        //                             placeholder="Ngày hết hạn ..." />

        //                     </FormControl>

        //                     <FormMessage />
        //                 </FormItem>}
        //             />

        //             <FormField
        //                 control={form.control}
        //                 name="fundingAmount"
        //                 render={({ field }) => (
        //                     <FormItem>
        //                         <FormLabel>Tiền cấp cho dự án</FormLabel>
        //                         <FormControl>
        //                             <Input type="number" {...field} placeholder="Nhập số tiền cấp cho dự án..." className="w-full" />
        //                         </FormControl>
        //                         <FormMessage />
        //                     </FormItem>
        //                 )}
        //             />
        //             {/* <div className="grid grid-cols-4 items-center gap-4">
        //                 <Label htmlFor="endDate" className="text-right">
        //                     Ngày kết thúc
        //                 </Label>
        //                 <Input id="endDate" type="date" className="col-span-3" required />
        //             </div> */}
        //             <DialogClose>
        //                 <Button type="submit" className="w-full mt-5 flex items-center" disabled={!form.formState.isValid}>
        //                     Lưu kế hoạch
        //                 </Button>
        //             </DialogClose>
        //         </form>
        //     </Form>

        // </div>
        <>
        </>
    );
};

export default CreateProjectForm;

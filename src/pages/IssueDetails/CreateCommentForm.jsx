import { Button } from '@/components/ui/button'
import { DialogClose } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import React from 'react'
import { useForm } from 'react-hook-form'

import { Cross1Icon } from '@radix-ui/react-icons'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useDispatch } from 'react-redux'
import { createComment } from '@/Redux/Comment/Action'

const CreateCommentForm = ({ issueId }) => {
    const dispatch = useDispatch();
    const form = useForm({
        // resolver: zod
        defaultValues: {
            content: "",
        }
    })

    const onSubmit = (data) => {
        dispatch(createComment({content:data.content, issueId}))
        console.log("create project data:", data)
    }

    return (
        <div>
            <Form {...form}>
                <form className='flex gap-2' onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField control={form.control}
                        name="content"
                        render={({ field }) =>
                            <FormItem >

                                <div className="flex gap-2">
                                    <div>
                                    <Avatar>
                                        <AvatarFallback>
                                            R
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                                <FormControl>

                                    <Input {...field}
                                        type="text"
                                        className="w-[20rem]"
                                        placeholder="add comment here ..." />
                                </FormControl>
                                </div>
                                
                                <FormMessage />
                            </FormItem>}
                    />


                    <Button type="submit">
                        save
                    </Button>

                </form>
            </Form>
        </div>
    )
}

export default CreateCommentForm
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PlusIcon } from '@radix-ui/react-icons'
import React, { useEffect, useState } from 'react'
import InviteUserForm from './InviteUserForm'
import IssueList from './IssueList'
import ChatBox from './ChatBox'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProjectById } from '@/Redux/Project/Action'
import { useParams } from 'react-router-dom'

const ProjectDetails = () => {

  const [activeTab, setActiveTab] = useState('pending');

  const dispatch = useDispatch();
  const { project } = useSelector(store => store);
  const { id } = useParams();
  const handleProjectInvitation = () => {

  };
  useEffect(() => {
    dispatch(fetchProjectById(id))
  }, [id])
  return (
    <>
      <div className='mt-5 lg:px-10'>
        <div className='lg:flex gap-5 justify-between pb-4'>
          <ScrollArea className="h-screen lg:w-[69%] pr-2">
            <div className='text-gray-400 pb-10 w-full'>
              <h1 className='text-lg font-semibold pb-5'>{project.projectDetails?.name}</h1>

              <div className='space-y-5 pb-10 text-sm'>
                <p className='w-full md:max-w-lg lg:max-w-xl text-sm'>
                  {project.projectDetails?.description}
                </p>

                <div className='flex'>
                  <p className='w-36'>Người tạo dự án:</p>
                  <p>{project.projectDetails?.owner.fullname}</p>

                </div>
                <div className='flex'>
                  <p className='w-36'>Thành viên:</p>
                  <div className='flex items-center gap-2'>

                    {/* {project.projectDetails?.team.map((item) => 
                    <Avatar className="cursor-pointer" key={item}>
                      <AvatarFallback>{item.fullname.slice(-3)[0]}</AvatarFallback>
                      
                    </Avatar>)} */}

                    {project.projectDetails?.team.map((item) =><div className='flex items-center'>
                      <Avatar className="cursor-pointer" key={item}>
                        <AvatarFallback>{item.fullname.slice(-3)[0]}</AvatarFallback>
                      </Avatar>
                      <h1>{item.fullname}</h1>
                    </div>
                      )}

                  </div>
                  <Dialog>
                    <DialogTrigger>
                      <DialogClose>
                        <Button size="sm" variant="outline" onClick={handleProjectInvitation} className="ml-2">
                          <span>Thêm thành viên </span>
                          <PlusIcon className='w-3 h-3' />
                        </Button>
                      </DialogClose>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader> Thêm thành viên</DialogHeader>
                      <InviteUserForm />
                    </DialogContent>
                  </Dialog>

                </div>

                <div className='flex'>
                  <p className='w-36'>Thể loại:</p>
                  <p>{project.projectDetails?.category}</p>

                </div>
                <div className='flex'>
                  <p className='w-36'>Trưởng dự án :</p>
                  <Badge>{project.projectDetails?.owner.fullname}</Badge>

                </div>


              </div>

              <section>
                <p className="py-5 border-b text-lg -tracking-wider">Tiến trình nhiệm vụ</p>
                <div className="tabs w-full flex items-center justify-around">
                  <button
                    className={`tab-button flex items-center gap-2 pb-2 ${activeTab === 'pending' ? 'text-red-500 border-b-2 border-red-500 active' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('pending')}
                  >

                    Chưa làm
                  </button>

                  <button
                    className={`tab-button flex items-center gap-2 pb-2 ${activeTab === 'in_progress' ? 'text-yellow-500 border-b-2 border-yellow-500 active' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('in_progress')}
                  >

                    Đang hoàn thành
                  </button>

                  <button
                    className={`tab-button flex items-center gap-2 pb-2 ${activeTab === 'done' ? 'text-green-500 border-b-2 border-green-500 active' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('done')}
                  >

                    Đã hoàn thành
                  </button>
                </div>

                <div className="tab-content py-5">
                  {activeTab === 'pending' && <IssueList status="pending" title="Chưa làm" />}
                  {activeTab === 'in_progress' && <IssueList status="in_progress" title="Đang hoàn thành" />}
                  {activeTab === 'done' && <IssueList status="done" title="Đã hoàn thành" />}
                </div>
              </section>

            </div>


          </ScrollArea>
          <div className='lg:w-[30%] founded-md sticky right-5 top-10'>
            <ChatBox />
          </div>

        </div>

      </div>
    </>
  )
}

export default ProjectDetails
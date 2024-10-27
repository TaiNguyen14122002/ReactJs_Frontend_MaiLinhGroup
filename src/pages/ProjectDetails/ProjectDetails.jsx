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
import { Tab, Tabs } from '@mui/material'

import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; // Import các hàm cần thiết
import { storage } from '../../../Firebase/FirebaseConfig'; // Import cấu hình Firebase của bạn




const ProjectDetails = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedFile, setSelectedFile] = useState(null); // Trạng thái lưu file đã chọn
  const [uploadProgress, setUploadProgress] = useState(0); // Trạng thái cho tiến trình upload
  const dispatch = useDispatch();
  const { project } = useSelector(store => store);
  const { id } = useParams();

  useEffect(() => {
    dispatch(fetchProjectById(id))
  }, [id])

  const handleProjectInvitation = () => {
    // logic for handling project invitation
  };

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files); // Chuyển đổi FileList thành mảng
    setSelectedFile(files); // Lưu danh sách các file được chọn
  };
  
  // Hàm xử lý upload nhiều tệp
  const handleUpload = () => {
    if (!selectedFile || selectedFile.length === 0) {
      alert('Vui lòng chọn tệp trước khi upload!');
      return;
    }
  
    selectedFile.forEach((file) => {
      const storageRef = ref(storage, `files/${file.name}`); // Tạo tham chiếu tới từng file trong Firebase Storage
  
      // Bắt đầu upload tệp với `uploadBytesResumable`
      const uploadTask = uploadBytesResumable(storageRef, file);
  
      // Lắng nghe các sự kiện trạng thái upload
      uploadTask.on('state_changed',
        (snapshot) => {
          // Tính toán tiến trình upload theo phần trăm
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress((prevProgress) => ({
            ...prevProgress,
            [file.name]: progress
          })); // Cập nhật tiến trình upload cho từng tệp
          console.log(`Upload of ${file.name} is ${progress}% done`);
        },
        (error) => {
          // Xử lý các lỗi có thể xảy ra
          console.error(`Error uploading file ${file.name}:`, error);
        },
        () => {
          // Upload thành công, lấy URL tải về của tệp
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log(`File ${file.name} available at`, downloadURL);
            alert(`Upload thành công! URL tệp ${file.name}: ` + downloadURL);
            // Bạn có thể lưu `downloadURL` vào cơ sở dữ liệu hoặc hiển thị trong UI
            console.log("Projectid" + id);

            const token = localStorage.getItem('jwt');


            fetch(`http://localhost:1000/api/projects/uploadFileToProject/${id}/upload`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({ fileNames: [downloadURL] }), // Gửi đối tượng JSON với thuộc tính fileNames
            })
            .then((response) => response.text())
            .then((data) => console.log("TaiNguyen" + data))
            .catch((error) => console.error('Error saving file URL:', error))

          });
        }
      );
    });
  };
  

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
                    {project.projectDetails?.team.map((item) => (
                      <div className='flex items-center' key={item.id}>
                        <Avatar className="cursor-pointer">
                          <AvatarFallback>{item.fullname.slice(-3)[0]}</AvatarFallback>
                        </Avatar>
                        <h1>{item.fullname}</h1>
                      </div>
                    ))}
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
                <div className='flex'>
                  <p className='w-36'>Tệp đính kèm :</p>
                  {project.projectDetails?.fileNames && project.projectDetails.fileNames.length > 0 ? (
                    <div className='flex flex-col'>
                      {project.projectDetails.fileNames.map((filePath, index) => {
                        const cleanFilePath = filePath.split('?')[0]; // Loại bỏ các tham số sau dấu '?'
                        const fileName = cleanFilePath.split('/').pop();
                        const fileExtension = cleanFilePath.split('.').pop().toLowerCase(); // Lấy phần mở rộng của tệp

                        console.log(`File Path: ${filePath}, Clean File Extension: ${fileExtension}`);

                        if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(fileExtension)) {
                          return (
                            <div key={index} className="mb-2">
                              <img
                                src={filePath} // Vẫn sử dụng đường dẫn đầy đủ với tham số
                                className="w-32 h-32 object-cover"
                                alt={fileName}
                              />
                              <p className="text-sm">{fileName}</p>
                            </div>
                          );
                        } else if (fileExtension === 'pdf', 'docx') {
                          return (
                            <div key={index} className="mb-2">
                              <a
                                href={filePath}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                              >
                                Mở tệp PDF
                              </a>
                              <p className="text-sm">{fileName}</p>
                            </div>
                          );
                        } else {
                          return (
                            <p key={index}>Không thể hiển thị tệp {fileName}</p>
                          );
                        }
                      })}
                    </div>
                  ) : (
                    <Badge>Chưa có tệp nào</Badge>
                  )}

                  {/* Thêm nút upload file */}
                  <div className='mt-4'>
                    <input type="file" onChange={handleFileChange} multiple className="mb-2" />
                    <Button onClick={handleUpload}>Tải tệp lên</Button>
                    {uploadProgress > 0 && (
                      <div className="mt-2">
                        <p>Đang tải lên: {Math.round(uploadProgress)}%</p>
                      </div>
                    )}
                  </div>


                </div>
              </div>

              <section>
                <p className="py-5 border-b text-lg -tracking-wider">Tiến trình nhiệm vụ</p>
                <div className="tabs w-full flex items-center justify-around">
                  <Tabs
                    value={activeTab}
                    onChange={handleChange}
                    aria-label="task progress tabs"
                    centered
                    textColor="secondary"
                    indicatorColor="secondary"
                  >
                    <Tab
                      label="Chưa làm"
                      value="pending"
                      textColor="error.main"
                      className={activeTab === 'pending' ? 'text-red-500' : 'text-gray-500'}
                    // style={{ color: activeTab === "pending" ? "red" : "gray" }}
                    />
                    <Tab
                      label="Đang hoàn thành"
                      value="in_progress"
                      className={activeTab === 'in_progress' ? 'text-yellow-500' : 'text-gray-500'}
                    />
                    <Tab
                      label="Đã hoàn thành"
                      value="done"
                      className={activeTab === 'done' ? 'text-green-500' : 'text-gray-500'}
                    />
                  </Tabs>
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
  );
}

export default ProjectDetails;

import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "react-router-dom"
import CreateCommentForm from "./CreateCommentForm";
import CommentCard from "./CommentCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { fetchIssueById, updateIssueStatus } from "@/Redux/Issue/Action";
import { fetchComments } from "@/Redux/Comment/Action";
import { CalendarIcon, FileText, LinkIcon, MenuIcon, SendIcon, Star, TagIcon, Upload, UploadIcon, User } from "lucide-react";
// import { Card, Progress } from "antd";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createComment } from "@/Redux/Comment/Action";
import { useForm } from "react-hook-form";
import TextArea from "antd/es/input/TextArea";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import axios from "axios";

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from "react-toastify";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../../../Firebase/FirebaseConfig';


const IssueDetails = () => {
  const { projectId, issueId } = useParams();
  const dispatch = useDispatch();
  const { issue, comment } = useSelector(store => store);
  const [selectedFile, setSelectedFile] = useState(null)
  const fileInputRef = useRef(null)
  const [newComment, setNewComment] = useState("")




  const [status, setStatus] = useState(issue.issueDetails?.status)

  const handleUpdateIssueStatus = (status) => {
    dispatch(updateIssueStatus({ status, id: issueId }))
    toast({
      title: "Trạng thái đã được cập nhật",
      description: `Trạng thái của tác vụ đã được thay đổi thành: ${status}`,
    });
    console.log(status);
  };

  const handleStatusChange = (value) => {
    setStatus(value)
    // Here you would typically update the task status in your backend
  }

  useEffect(() => {
    dispatch(fetchIssueById(issueId));
    dispatch(fetchComments(issueId))
  }, [issueId])

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    setSelectedFile(file)
  }

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files); // Chuyển đổi FileList thành mảng
    setSelectedFile(files); // Lưu danh sách các file được chọn
  };

  console.log("Tên tệp", selectedFile)

  const handleLinkSubmit = (event) => {
    event.preventDefault()
    const link = event.target.link.value
    if (link) {
      // Here you would typically handle the link submission to your backend
      console.log("Link submitted:", link)
      event.target.reset()
    }
  }

  const onSubmit = (data) => {
    dispatch(createComment({ content: newComment, issueId }))
    console.log("create project data:", data)
    setNewComment("");
  }

  const [rating, setRating] = useState(0)
  const [progress, setProgress] = useState(0)


  const [activities, setActivities] = useState([])
  const [attachments, setAttachments] = useState([
    { name: "report.pdf", size: "2.5 MB" },
    { name: "presentation.pptx", size: "5.1 MB" },
  ])

  const addActivity = (text) => {
    const newActivity = {
      id: Date.now(),
      text,
      timestamp: new Date(),
    }
    setActivities(prevActivities => [newActivity, ...prevActivities].slice(0, 5))
  }



  const [inforUser, setInfoUser] = useState([]);
  const [inforProject, setInfoProject] = useState([]);
  const token = localStorage.getItem('jwt');

  const fetchUser = async () => {
    try {
      const response = await axios.get(`http://localhost:1000/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Thông tin ngừoi dùng", response.data);
      setInfoUser(response.data);

    } catch (error) {
      console.log('Có lỗi xẩy ra trong quá trình thực hiện dữ liệu', error)
    }
  }

  const fetchProject = async () => {
    try {
      const response = await axios.get(`http://localhost:1000/api/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Thông tin dự án", response.data);
      setInfoProject(response.data);
    } catch (error) {
      console.log('Có lỗi xẩy ra trong quá trình thực hiện dữ liệu', error)
    }
  }

  useEffect(() => {
    fetchUser();
    fetchProject();
    return;
  }, [])

  const handleRating = (value) => {
    if (inforUser.id === inforProject.owner?.id) {
      setRating(value)
      setProgress(value * 20) // Convert 5-star rating to percentage
      addActivity(`Đánh giá đã được cập nhật thành ${value} sao`)
      toast.success(
        <div>
          <strong>Đánh giá thành công</strong>
          <p>Bạn đã đánh giá tác vụ ${issue.issueDetails?.title} ${value} sao.</p>
        </div>
      )
    } else {
      toast.error(
        <div>
          <strong>Lỗi</strong>
          <p>Bạn không phải chủ kế hoạch</p>
        </div>
      )
    }

  }

  console.log("Nguowfi dufng", inforUser.id)
  console.log("Duwj asn", inforProject.owner?.id)
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false)

  // Hàm xử lý upload nhiều tệp
  const handleUpload = () => {
    if (!selectedFile || selectedFile.length === 0) {
      toast.error("Không có tệp nào được chọn. Vui lòng chọn ít nhất một tệp để tải lên.");
      return;
    }
    setIsUploading(true);
    const uploadPromises = []; // Mảng để lưu các Promise upload

    selectedFile.forEach((file) => {
      const storageRef = ref(storage, `files/${file.name}`); // Tạo tham chiếu tới từng file trong Firebase Storage

      // Bắt đầu upload tệp với `uploadBytesResumable`
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Hiển thị Toast thông báo bắt đầu tải lên
      toast.info(`Đang tải lên tệp: ${file.name}`);

      // Thêm Promise vào mảng uploadPromises
      const uploadPromise = new Promise((resolve, reject) => {
        // Lắng nghe các sự kiện trạng thái upload
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Tính toán tiến trình upload theo phần trăm
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress((prevProgress) => ({
              ...prevProgress,
              [file.name]: progress,
            })); // Cập nhật tiến trình upload cho từng tệp
            console.log(`Upload of ${file.name} is ${progress}% done`);

            // Cập nhật Toast với tiến trình
            toast.update(toastId, {
              render: `Đang tải lên tệp: ${file.name} (${Math.round(progress)}%)`,
              type: toast.TYPE.INFO,
              autoClose: false,
              closeOnClick: true,
            });
          },
          (error) => {
            console.error(`Error uploading file ${file.name}:`, error);
            toast.error(`Có lỗi xảy ra khi tải lên tệp: ${file.name}`);
            reject(error); // Thực hiện reject nếu có lỗi
          },
          () => {
            // Upload thành công, lấy URL tải về của tệp
            getDownloadURL(uploadTask.snapshot.ref)
              .then((downloadURL) => {
                console.log(`File ${file.name} available at`, downloadURL);
                toast.success(`Upload thành công tệp: ${file.name}! URL: ${downloadURL}`);

                const token = localStorage.getItem('jwt');
                fetch(`http://localhost:1000/api/issues/uploadFileToIssue/${issueId}/upload`, {

                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                  },
                  body: JSON.stringify({ fileNames: [downloadURL] }),
                })
                  .then((response) => response.json())
                  .then((data) => console.log("TaiNguyen", data))
                  .catch((error) => console.error('Error saving file URL:', error));

                resolve(); // Hoàn thành Promise
              });
          }
        );
      });

      uploadPromises.push(uploadPromise); // Thêm Promise vào mảng
    });

    // Chờ tất cả các Promise upload hoàn thành
    Promise.all(uploadPromises)
      .then(() => {
        console.log("Tất cả tệp đã được tải lên thành công.");
        setIsUploading(false); // Kết thúc quá trình tải lên
        setUploadProgress(0); // Đặt lại tiến trình
      })
      .catch((error) => {
        console.error('Có lỗi xảy ra khi tải lên:', error);
        setIsUploading(false); // Kết thúc quá trình tải lên ngay cả khi có lỗi
      });
  };





  // const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0]
  //   if (file) {
  //     const newAttachment = { name: file.name, size: `${(file.size / 1024 / 1024).toFixed(1)} MB` }
  //     setAttachments(prev => [...prev, newAttachment])
  //     addActivity(`Tệp "${file.name}" đã được tải lên`)
  //   }
  // }

  // const handleDateChange = (newDate: Date | undefined) => {
  //   if (newDate) {
  //     setDate(newDate)
  //     setCurrentTask(prev => ({ ...prev, dueDate: format(newDate, 'yyyy-MM-dd') }))
  //     addActivity(`Ngày hết hạn đã được đặt thành ${format(newDate, 'dd/MM/yyyy')}`)
  //   }
  // }

  // const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   const newDescription = event.target.value
  //   setDescription(newDescription)
  //   setCurrentTask(prev => ({ ...prev, description: newDescription }))
  // }

  // const handleStatusChange = (newStatus: string) => {
  //   setCurrentTask(prev => ({ ...prev, status: newStatus }))
  //   addActivity(`Trạng thái đã được cập nhật thành ${newStatus}`)
  // }

  // const handlePriorityChange = (newPriority: string) => {
  //   setCurrentTask(prev => ({ ...prev, priority: newPriority }))
  //   addActivity(`Độ ưu tiên đã được cập nhật thành ${newPriority}`)
  // }

  // useEffect(() => {
  //   if (description !== currentTask.description) {
  //     const timer = setTimeout(() => {
  //       addActivity("Mô tả tác vụ đã được cập nhật")
  //     }, 2000)
  //     return () => clearTimeout(timer)
  //   }
  // }, [description, currentTask.description])



  return (
    <div className="min-h-screen bg-background p-8">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{issue.issueDetails?.title}</h1>
          <Badge variant="secondary" className="text-lg py-1 px-3">{issue.issueDetails?.priority}</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-xl">Task ID: TV - {issue.issueDetails?.id}</Label>
                <div className="flex items-center space-x-2">
                  {/* <User className="h-5 w-5 text-muted-foreground" /> */}
                  <span className="text-muted-foreground">{issue.issueDetails?.assignee?.fullname ? (
                    <div className="flex items-center gap-3">
                      <Avatar className="border-2 border-white">
                        <AvatarFallback>{issue.issueDetails.assignee.fullname.slice(-3)[0]}</AvatarFallback>
                      </Avatar>
                      <p>{issue.issueDetails.assignee.fullname}</p>
                    </div>
                  ) : (
                    <p>Chưa phân công</p>
                  )}</span>
                </div>
              </div>
              <Textarea
                placeholder="Thêm mô tả cho tác vụ này..."
                className="min-h-[100px]"
                value={issue.issueDetails?.description}
              // onChange={handleDescriptionChange}
              />
            </div>

            <div className="space-y-4">
              <Label className="text-xl">Tiến độ</Label>
              <div className="space-y-2">
                <Progress value={progress} className="h-3" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{progress}% hoàn thành</span>
                  <span>Hết hạn: {new Date(issue.issueDetails?.dueDate).toLocaleDateString('vi-VN') || "N/A"}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-xl">Đánh giá hoàn thiện</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                        }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-xl">Tệp đính kèm</Label>
              <div className="flex items-center space-x-4">
                <Input
                  type="file"
                  className="flex-grow"
                  multiple
                  onChange={handleFileChange}

                />
                <Button onClick={handleUpload} variant="outline">
                  <Upload className="mr-2 h-4 w-4" /> Tải lên
                </Button>
              </div>
              <div className="space-y-2">
                {issue.issueDetails?.fileNames?.map((file, index) => {
                  const fileName = decodeURIComponent(file.split('/').pop().split('?')[0]);
                  const fileNames = fileName.split('/').pop();
                  return (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-secondary rounded-md">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <a href={file} target="_blank" rel="noopener noreferrer">
                      <span>{fileNames}</span>
                      </a>
                      
                      {/* <span className="text-sm text-muted-foreground">({file.size})</span> */}
                    </div>

                  )
                })}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <Label className="text-xl">Ngày hết hạn</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !issue.issueDetails?.dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {new Date(issue.issueDetails?.dueDate).toLocaleDateString('vi-VN') || "N/A"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={issue.issueDetails?.dueDate}
                    // onSelect={handleDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-4">
              <Label className="text-xl">Trạng thái</Label>
              <Select value={issue.issueDetails?.status} onValueChange={handleUpdateIssueStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Chưa làm</SelectItem>
                  <SelectItem value="in_progress">Đang hoàn thàh</SelectItem>
                  <SelectItem value="done">Đã hoàn thành</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label className="text-xl">Độ ưu tiên</Label>
              <Select value={issue.issueDetails?.priority} onValueChange={handleUpdateIssueStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn độ ưu tiên" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">Cao</SelectItem>
                  <SelectItem value="Medium">Trung bình</SelectItem>
                  <SelectItem value="Low">Thấp</SelectItem>
                </SelectContent>
              </Select>
            </div>


            <div className="space-y-4">
              <Label className="text-xl">Hoạt động gần đây</Label>
              <div className="space-y-2">
                {activities.map((activity) => (
                  <div key={activity.id} className="text-sm">
                    <p className="text-muted-foreground">
                      {activity.text}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(activity.timestamp, 'dd/MM/yyyy HH:mm')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 md:col-span-3">
            <Label className="text-xl">Bình luận</Label>
            <CardContent>
              <ScrollArea className="h-[100px] pr-4">
                <div className="space-y-4">
                  {comment.comments.map((item) => (
                    <CommentCard item={item} key={item} />
                  ))}
                </div>
              </ScrollArea>
              <form onSubmit={onSubmit} className="mt-4">
                <TextArea
                  placeholder="Nhập đánh giá ..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full mb-2"
                />
                <Button type="submit">
                  <SendIcon className="h-4 w-4 mr-2" />
                  Đăng bình luận
                </Button>
              </form>
            </CardContent>
          </div>

        </div>
      </div>
    </div>

    // <div className="flex h-screen bg-gray-100">
    //   <div className="flex-1 flex flex-col overflow-hidden">
    //     <header className="flex justify-between items-center p-4 bg-white border-b">
    //       <div className="flex items-center">
    //         <h1 className="text-2xl font-bold">{issue.issueDetails?.title || "Default Title"}</h1>
    //       </div>
    //       <Select onValueChange={handleUpdateIssueStatus} defaultValue={issue.issueDetails?.status || "pending"}>
    //         <SelectTrigger className="w-[180px]">
    //           <SelectValue placeholder={issue.issueDetails?.status || "Select Status"} />
    //         </SelectTrigger>
    //         <SelectContent>
    //           <SelectItem value="pending">Chưa làm</SelectItem>
    //           <SelectItem value="in_progress">Đang hoàn thàh</SelectItem>
    //           <SelectItem value="done">Đã hoàn thành</SelectItem>
    //         </SelectContent>
    //       </Select>
    //     </header>

    //     <main className="flex-1 overflow-x-hidden overflow-y-auto">
    //       <div className="container mx-auto px-4 py-8">
    //         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
    //           <Card className="md:col-span-2 h-full">
    //             <CardHeader>
    //               <CardTitle>Chi tiết tác vụ</CardTitle>
    //               <CardDescription>Task ID: TV - {issue.issueDetails?.id || "N/A"}</CardDescription>
    //             </CardHeader>
    //             <CardContent className="space-y-4">
    //               <div>
    //                 <h3 className="text-sm font-medium text-gray-500 mb-2">Mô tả</h3>
    //                 <p className="text-sm text-gray-700">{issue.issueDetails?.description || "No description available."}</p>
    //               </div>
    //               <div>
    //                 <h3 className="text-sm font-medium text-gray-500 mb-2">Tiến độ</h3>
    //                 <Progress value={issue.issueDetails?.progress || 0} className="w-full" />
    //                 <p className="text-sm text-gray-600 mt-1">{issue.issueDetails?.progress || 0}% hoàn thành</p>
    //               </div>
    //               <div className="flex items-center space-x-4">
    //                 <CalendarIcon className="h-5 w-5 text-gray-400" />
    //                 <span className="text-sm text-gray-600">Hết hạn {new Date(issue.issueDetails?.dueDate).toLocaleDateString('vi-VN') || "N/A"}</span>
    //               </div>
    //               <div>
    //                 <h3 className="text-sm font-medium text-gray-500 mb-2">Phân công</h3>
    //                 <div className="flex -space-x-2 overflow-hidden">
    // {issue.issueDetails?.assignee?.fullname ? (
    //   <div className="flex items-center gap-3">
    //     <Avatar className="border-2 border-white">
    //       <AvatarFallback>{issue.issueDetails.assignee.fullname.slice(-3)[0]}</AvatarFallback>
    //     </Avatar>
    //     <p>{issue.issueDetails.assignee.fullname}</p>
    //   </div>
    // ) : (
    //   <p>Chưa phân công</p>
    // )}
    //                 </div>
    //               </div>
    //               <div>
    //                 <h3 className="text-sm font-medium text-gray-500 mb-2">Độ ưu tiên</h3>
    //                 <div className="flex flex-wrap gap-2">
    //                   <Badge variant="secondary">
    //                     <TagIcon className="h-3 w-3 mr-1" />
    //                     <p>{issue.issueDetails?.priority || "Normal"}</p>
    //                   </Badge>
    //                 </div>
    //               </div>
    //             </CardContent>
    //           </Card>

    //           <Card className="h-full">
    //             <CardHeader>
    //               <CardTitle>Tải tệp lên</CardTitle>
    //             </CardHeader>
    //             <CardContent className="space-y-4">
    //               <div>
    //                 <h3 className="text-sm font-medium text-gray-500 mb-2">Tệp</h3>
    //                 <div className="flex items-center gap-2">
    //                   <Input
    //                     type="file"
    //                     onChange={handleFileSelect}
    //                     ref={fileInputRef}
    //                     className="flex-grow"
    //                   />
    //                   <Button onClick={handleFileUpload} disabled={!selectedFile}>
    //                     <UploadIcon className="h-4 w-4 mr-2" />
    //                     Tải lên
    //                   </Button>
    //                 </div>
    //               </div>
    //               <div>
    //                 <h3 className="text-sm font-medium text-gray-500 mb-2">Đường dẫn</h3>
    //                 <form onSubmit={handleLinkSubmit} className="flex gap-2">
    //                   <Input type="url" name="link" placeholder="https://example.com" required className="flex-grow" />
    //                   <Button type="submit">
    //                     <LinkIcon className="h-4 w-4 mr-2" />
    //                     Thêm
    //                   </Button>
    //                 </form>
    //               </div>
    //             </CardContent>
    //           </Card>

    //           <Card className="md:col-span-3">
    // <CardHeader>
    //   <CardTitle>Đánh giá</CardTitle>
    // </CardHeader>
    // <CardContent>
    //   <ScrollArea className="h-[300px] pr-4">
    //     <div className="space-y-4">
    //       {comment.comments.map((item) => (
    //         <CommentCard item={item} key={item} />
    //       ))}
    //     </div>
    //   </ScrollArea>
    //   <form onSubmit={onSubmit} className="mt-4">
    //     <TextArea
    //       placeholder="Nhập đánh giá ..."
    //       value={newComment}
    //       onChange={(e) => setNewComment(e.target.value)}
    //       className="w-full mb-2"
    //     />
    //     <Button type="submit">
    //       <SendIcon className="h-4 w-4 mr-2" />
    //       Đăng bình luận
    //     </Button>
    //   </form>
    // </CardContent>
    //           </Card>


    //         </div>
    //       </div>
    //     </main>
    //   </div>
    // </div>


  )
}

export default IssueDetails
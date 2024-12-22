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
import { CalendarIcon, Edit2, FileText, Files, Flag, LinkIcon, MenuIcon, SendIcon, Star, TagIcon, Trash2, Upload, UploadIcon, User } from "lucide-react";
// import { Card, Progress } from "antd";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


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
    // dispatch(fetchIssueById({id: issueId}));
    toast.success(
      <div>
        <strong>Trạng thái đã được cập nhật</strong>
        <p>Trạng thái của tác vụ đã được thay đổi thành: {status}</p>
      </div>
    )
    console.log(status);
  };

  const handleStatusChange = (value) => {
    setStatus(value)
    // Here you would typically update the task status in your backend
  }

  useEffect(() => {
    dispatch(fetchIssueById(issueId));
    dispatch(fetchComments(issueId))
  }, [dispatch, issueId])

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
      const response = await axios.get(`https://springbootbackendpms2012202-production.up.railway.app/api/users/profile`, {
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
      const response = await axios.get(`https://springbootbackendpms2012202-production.up.railway.app/api/projects/${projectId}`, {
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

  const [rating, setRating] = useState(issue.issueDetails?.finish / 20);
  const [progress, setProgress] = useState(issue.issueDetails?.finish);

  const addUserIssueSalaries = async (value) => {
    try {
      const requestData = {
        userId: issue.issueDetails.assignee.id,
        issueId: issueId,
        salary: issue.issueDetails?.price * (value / 100),
      }

      console.log("Lương tiến độ", requestData)
      const response = await axios.post(`https://springbootbackendpms2012202-production.up.railway.app/api/salaries/addSalaries`, {}, {
        params: requestData,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Done")

    } catch (error) {
      console.log("Có lỗi xảy ra trong quá trình thực hiện", error)
    }
  }

  const updateUserIssueSalaries = async (value) => {
    try {
      const requestData = {
        userId: issue.issueDetails.assignee.id,
        issueId: issueId,
        salary: issue.issueDetails?.price * (value / 100),
      }

      const response = await axios.put(`https://springbootbackendpms2012202-production.up.railway.app/api/salaries/update`, {}, {
        params: requestData,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Cập nhập lương xong")
    } catch (error) {
      console.log("Có lỗi xảy ra trong quá trình thực hiện", error)
    }
  }

  const handleRating = (value) => {
    if (inforUser.id === inforProject.owner?.id) {

      updateFinishIssue(value)

      addActivity(`Đánh giá đã được cập nhật thành ${value} sao`)

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
  const [fileInfo, setFileInfo] = useState([]);

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
                const url = new URL(`https://springbootbackendpms2012202-production.up.railway.app/api/file-info/addFile`);
                url.searchParams.append('issueId', issueId); // Thêm 'id' vào tham số query
                url.searchParams.append('fileUrl', downloadURL); // Thêm 'fileUrl' vào tham số query

                fetch(url, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                })
                  .then((response) => {
                    if (!response.ok) {
                      throw new Error('Failed to save file URL');
                    }
                    return response.json();
                  })
                  .then((data) => {
                    console.log('TaiNguyen', data);

                    // Cập nhật danh sách fileInfo
                    setFileInfo((prevFileInfo) => [...prevFileInfo, data]);

                    resolve(); // Hoàn thành Promise
                  })
                  .catch((error) => {
                    console.error('Error saving file URL:', error);
                    reject(error); // Gọi reject nếu có lỗi
                  });
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

  const updateprofitAmount = async () => {
    try {
      const response = await axios.put(
        `https://springbootbackendpms2012202-production.up.railway.app/api/projects/${projectId}/update-profit`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Cập nhật lợi nhuận thành công:", response.data);
      const responsee = await axios.put(
        `https://springbootbackendpms2012202-production.up.railway.app/api/projects/${projectId}/update-profit`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    } catch (error) {
      console.log("Có lỗi xảy ra trong quá trình thực hiện", error);
    }
  };

  const updateFinishIssue = async (value) => {
    if (inforUser.id === inforProject.owner?.id) {
      try {
        const response = await axios.put(
          `https://springbootbackendpms2012202-production.up.railway.app/api/issues/${issueId}/finish/${value * 20}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Đánh giá thành công")

        if (issue.issueDetails?.finish === null || issue.issueDetails?.finish === undefined) {
          addUserIssueSalaries(value * 20);

        } else {
          updateUserIssueSalaries(value * 20);

          // console.log("Cập nhập lương")
        }
        updateprofitAmount();

        dispatch(fetchIssueById(issueId));

        toast.success(
          <div>
            <strong>Đánh giá thành công</strong>
            <p>Bạn đã đánh giá tác vụ {issue.issueDetails?.title} {value} sao.</p>
          </div>
        )
      } catch (error) {
        console.log("Có lỗi xảy ra trong quá trình thực hiện", error)
      }


    } else {
      toast.error(
        <div>
          <strong>Lỗi</strong>
          <p>Bạn không phải chủ kế hoạch</p>
        </div>
      )
    }

  }

  const formatPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });

  const price = issue.issueDetails?.price;  // Giá trị mặc định là 0 nếu không có giá trị
  const formattedPrice = formatPrice.format(price);

  const [projectTabs, setProjectTabs] = useState([]);

  const fetchProjectTabs = async () => {
    try {
      const response = await axios.get(`https://springbootbackendpms2012202-production.up.railway.app/api/taskCategories/project/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Tabs Project", response.data)
      setProjectTabs(response.data);

    } catch (error) {
      console.log("Có lỗi xảy ra trong quá trình tải dữ liệu", error);
    }
  }
  useEffect(() => {
    fetchProjectTabs();
  }, [token, issueId, projectId])

  const fetchFileInfo = async () => {
    try {
      if (!token) {
        console.log("Phiên đăng nhập đã hết hạn")
      }
      const response = await axios.get(`https://springbootbackendpms2012202-production.up.railway.app/api/file-info/issue/${issueId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Tệp đã tải lên", response.data)
      setFileInfo(response.data)

    } catch (error) {
      console.log("Có lỗi xảy ra trong quá tình thực hiện dữ liệu", error)
    }
  }

  useEffect(() => {
    fetchFileInfo()
  }, [token, issueId, projectId])

  const deletedFileInfo = async(FileId) => {
    try{
      if(!token){
        console.log("Phiên đăng nhập đã hết hạn")
      }
      const response = await axios.delete(`https://springbootbackendpms2012202-production.up.railway.app/api/file-info/delete/${FileId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setFileInfo(prevTabs => prevTabs.filter(file => file.id !== FileId));
      console.log("File", FileId)

    }catch(error){
      console.log("Có lỗi xảy ra trong quá tình thực hiện dữ liệu", error)
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 p-8">
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
          <div className="flex items-center space-x-2">
            <CardTitle className="text-2xl font-bold text-blue-900">{issue.issueDetails?.title}</CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-100">
              <Edit2 className="h-4 w-4" />
              <span className="sr-only">Edit task ID</span>
            </Button>
          </div>

          <Button variant="outline" size="sm" className="text-indigo-700 border-indigo-300 hover:bg-indigo-100">
            {issue.issueDetails?.priority}
            <Flag className="ml-2 h-4 w-4 text-indigo-600" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-xl text-blue-800">Task ID: TV - {issue.issueDetails?.id}</Label>

                <div className="flex items-center space-x-2">
                  {/* <User className="h-5 w-5 text-muted-foreground" /> */}
                  <span className="text-indigo-600">{issue.issueDetails?.assignee?.fullname ? (
                    <div className="flex items-center gap-3">
                      <Avatar className="border-2 border-indigo-200">
                        <AvatarFallback className="bg-indigo-100 text-indigo-800">{issue.issueDetails.assignee.fullname.slice(-3)[0]}</AvatarFallback>
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
                className="min-h-[100px] border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400 textarea-black-text"
                value={issue.issueDetails?.description}
                disabled
                style={{ color: 'black' }}

              // onChange={handleDescriptionChange}
              />
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium">Tiến độ</Label>
              <div className="space-y-2">
                <Progress value={issue.issueDetails?.finish} className="h-3 bg-blue-100" indicatorColor="bg-blue-500" />
                <div className="flex justify-between text-sm text-indigo-600">
                  <span>{issue.issueDetails?.finish}% hoàn thành</span>
                  <span>Hết hạn: {new Date(issue.issueDetails?.dueDate).toLocaleDateString('vi-VN') || "N/A"}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium">Đánh giá hoàn thiện</Label>
              <div className="flex gap-2">
                {([1, 2, 3, 4, 5]).map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${star <= (issue.issueDetails?.finish / 20)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-indigo-200"
                        }`}
                    />
                  </button>
                ))}
              </div>
            </div>


            <div>
              <Label className="text-sm font-medium">Lương nhiệm vụ</Label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Nhập lương"
                  Value={formatPrice.format(issue.issueDetails?.price)}
                  disabled
                />
                <span className="text-sm text-muted-foreground">VNĐ</span>
              </div>
            </div>

            <div className="space-y-4">

              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Tệp đính kèm</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center space-x-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        <Files className="h-4 w-4" />
                        <span className="font-medium">{fileInfo.length}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Total files uploaded</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center space-x-4">
                <Input
                  type="file"
                  className="flex-grow border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400"
                  multiple
                  onChange={handleFileChange}

                />
                <Button onClick={handleUpload} variant="outline" className="border-indigo-300 text-indigo-700 hover:bg-indigo-100">
                  <Upload className="mr-2 h-4 w-4" /> Tải lên
                </Button>
              </div>
              <div className="space-y-3">


                {fileInfo.map((file, index) => {
                  const filePath = file.fileName
                  const encodedFileName = filePath.split('%2F').pop()?.split('?')[0]
                  const fileName = decodeURIComponent(encodedFileName || '')
                  const fileNames = fileName.split('/').pop()

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
                    >
                      <div className="flex items-center space-x-3 overflow-hidden">
                        <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
                        <a
                          href={filePath}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-700 hover:text-blue-800 font-medium truncate"
                        >
                          {fileNames}
                        </a>
                        {file.size && (
                          <span className="text-sm text-gray-500 hidden sm:inline">({file.size})</span>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deletedFileInfo(file.id)}
                        className="text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete file</span>
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <Label className="text-sm font-medium">Ngày hết hạn</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal border-indigo-200 text-indigo-700",
                      !issue.issueDetails?.dueDate && "text-indigo-400"
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
              <Label className="text-sm font-medium">Trạng thái</Label>
              <Select value={issue.issueDetails?.status} onValueChange={handleUpdateIssueStatus}>
                <SelectTrigger className="border-indigo-200">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {projectTabs.map((tab) => (
                    <SelectItem key={tab.label} value={tab.label}>
                      {tab.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium">Độ ưu tiên</Label>
              <Select value={issue.issueDetails?.priority} onValueChange={handleUpdateIssueStatus}>
                <SelectTrigger className="border-indigo-200">
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
              <Label className="text-sm font-medium">Hoạt động gần đây</Label>
              <div className="space-y-2">
                {activities.map((activity) => (
                  <div key={activity.id} className="text-sm">
                    <p className="text-indigo-600">
                      {activity.text}
                    </p>
                    <p className="text-xs text-indigo-400">
                      {format(activity.timestamp, 'dd/MM/yyyy HH:mm')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 md:col-span-3">
            <Label className="text-sm font-medium">Bình luận</Label>
            <Card className="border-indigo-200">
              <CardContent >
                <ScrollArea className="h-[200px] pr-4">
                  <div className="space-y-4 mt-4">
                    {comment.comments.map((item) => (
                      <CommentCard item={item} key={item} className="bg-white p-3 rounded-lg shadow-sm" />

                    ))}
                  </div>
                </ScrollArea>
                <form onSubmit={onSubmit} className="mt-4">
                  <TextArea
                    placeholder="Nhập đánh giá ..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full mb-2 border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400"
                  />
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                    <SendIcon className="h-4 w-4 mr-2" />
                    Đăng bình luận
                  </Button>
                </form>
              </CardContent>

            </Card>

          </div>

        </div>
      </div>
    </div>


  )
}

export default IssueDetails
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { DownloadIcon, PlusIcon, TrashIcon } from '@radix-ui/react-icons'
import React, { useEffect, useState } from 'react'
import InviteUserForm from './InviteUserForm'
import IssueList from './IssueList'
import ChatBox from './ChatBox'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProjectById } from '@/Redux/Project/Action'
import { useParams } from 'react-router-dom'
import { Input, Tab, Table, Tabs } from '@mui/material'


import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; // Import các hàm cần thiết
import { storage } from '../../../Firebase/FirebaseConfig'; // Import cấu hình Firebase của bạn
import GetIssuesCountByStatus from '../Chart/Issue/GetIssuesCountByStatus'

import { GiPin } from "react-icons/gi";
import { ArrowUpDown, Calendar, CheckCircle2, Download, Edit, FileIcon, FileText, FileTextIcon, ImageIcon, Mail, MoreVertical, Pencil, Phone, Pin, Plus, RefreshCw, Star, Trash2, Upload, X, XCircle } from 'lucide-react'


import { addDays, format, parseISO } from 'date-fns'
import { Card, CardContent } from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import axios from 'axios'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import Calender from '../Calender/Calender'
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { TabsContent, TabsList } from '@/components/ui/tabs'





const ProjectDetails = () => {
  const [activeTab, setActiveTab] = useState('Chưa làm');
  const [selectedFile, setSelectedFile] = useState([]); // Trạng thái lưu file đã chọn
  const [uploadProgress, setUploadProgress] = useState(0); // Trạng thái cho tiến trình upload
  const dispatch = useDispatch();
  const { project } = useSelector(store => store);
  const { id } = useParams();
  const [isUploading, setIsUploading] = useState(false)
  const [processData, setProcessData] = useState(0);
  const token = localStorage.getItem('jwt');
  const [isOpen, setIsOpen] = useState(false)
  const maxRating = 5
  const [rating, setRating] = useState(0)
  const { projectstatus, setProjectStatus } = useState(project.projectDetails?.status)
  const [activeMainTab, setActiveMainTab] = useState('details');
  const [avaterUser, setAvaterUser] = useState([])

  const[avatarOwner, setAvatarOwner] = useState([]);

  const handleMainTabChange = (event, newValue) => {
    setActiveMainTab(newValue);
  }

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
      toast.error("Không có tệp nào được chọn. Vui lòng chọn ít nhất một tệp để tải lên.");
      return;
    }

    setIsUploading(true); // Bắt đầu quá trình tải lên
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
                // fetch(`https://springboot-backend-pms-20-12-2024.onrender.com/api/projects/uploadFileToProject/${id}/upload`, {
                //   method: 'PUT',
                //   headers: {
                //     'Content-Type': 'application/json',
                //     'Authorization': `Bearer ${token}`,
                //   },
                //   body: JSON.stringify({ fileNames: [downloadURL] }),
                // })
                const url = new URL(`https://springboot-backend-pms-20-12-2024.onrender.com/api/file-info/addFile`);
                url.searchParams.append('projectId', id); // Thêm 'id' vào tham số query
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

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf':
        return <FileTextIcon className="h-12 w-12 text-red-500" />
      case 'docx':
        return (
          <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4C4 2.89543 4.89543 2 6 2H14L20 8V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4Z" fill="#4285F4" />
            <path d="M14 2L20 8H14V2Z" fill="#A1C2FA" />
            <path d="M9.5 13H7V19H8.5V16.5H9.5C10.8807 16.5 12 15.3807 12 14C12 12.6193 10.8807 11.5 9.5 11.5C8.11929 11.5 7 12.6193 7 14H8.5C8.5 13.4477 8.94772 13 9.5 13C10.0523 13 10.5 13.4477 10.5 14C10.5 14.5523 10.0523 15 9.5 15H8.5V13H9.5Z" fill="white" />
            <path d="M13 13H16V14.5H14.5V15.5H16V17H14.5V19H13V13Z" fill="white" />
          </svg>
        )
      case 'xlsx':
        return (
          <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4C4 2.89543 4.89543 2 6 2H14L20 8V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4Z" fill="#0F9D58" />
            <path d="M14 2L20 8H14V2Z" fill="#87CEAC" />
            <path d="M7 13L9.5 19H11L13.5 13H12L10.25 17.5L8.5 13H7Z" fill="white" />
            <path d="M14 13H17V14.5H15.5V15.5H17V17H15.5V19H14V13Z" fill="white" />
          </svg>
        )
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
        return <ImageIcon className="h-12 w-12 text-green-500" />
      default:
        return <FileIcon className="h-12 w-12 text-gray-500" />
    }
  }

  const handleDownload = (filePath) => {
    // Implement download logic here
    console.log("Downloading:", filePath)
  }

  const handleDelete = async (FileInfoId) => {
    console.log("Deleting:", FileInfoId)
    try {
      if (!token) {
        console.log("Phiên đăng nhập đã hết hạn")
      }
      const response = await axios.delete(`https://springboot-backend-pms-20-12-2024.onrender.com/api/file-info/delete/${FileInfoId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Xoá tệp thành công")

      // Cập nhật danh sách fileInfo cục bộ
      setFileInfo((prevFileInfo) =>
        prevFileInfo.filter((file) => file.id !== FileInfoId)
      );

    } catch (error) {
      console.log("Có lỗi xảy ra trong quá trình tải dữ liệu", error)
    }
  }

  const removeFile = (index) => {
    setSelectedFile(selectedFile.filter((_, i) => i !== index))
  }

  const fetchProcessData = async () => {
    console.log("wefwefdcsdfcewrfergfergfewrvvrgwegfrewds")
    try {
      const response = await axios.get(`https://springboot-backend-pms-20-12-2024.onrender.com/api/issues/projects/completion-ratio`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: { projectId: id }
      });
      setProcessData(response.data); // Cập nhật processData với giá trị trả về từ API
      console.log("process", response.data);
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
    }
  };

  useEffect(() => {
    fetchProcessData();
  }, [token, id]); // Thêm token vào dependency array

  const handleRating = (memberId, rating) => {
    setMembers(members.map(member =>
      member.id === memberId ? { ...member, rating } : member
    ))
  }

  const [editName, setEditName] = useState(project.projectDetails?.name);
  const [description, setDescription] = useState(project.projectDetails?.description);
  const [endtime, setEndtime] = useState(project.projectDetails?.createdDate);



  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Updated project info:', fetchproject)

    if (!token) {
      console.log("Phiên đăng nhập đã hết hạn")
    }
    try {
      const response = await axios.put(`https://springboot-backend-pms-20-12-2024.onrender.com/api/projects/updateProject/${id}`, fetchproject.projectDetails, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Cập nhật thành công", response.data);
      setIsOpen(false)
      dispatch(fetchProjectById(id))

    } catch (error) {
      console.log("Có lỗi xảy ra trong quá trình thực hiện dữ liệu", error)
    }

  }

  const UpdateProjectPinned = async () => {
    try {

      if (!token) {
        console.error("Token không tồn tại");
        return;
      }

      const response = await axios.put(
        `https://springboot-backend-pms-20-12-2024.onrender.com/api/projects/${id}/update-action`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log(response.data);
    } catch (error) {
      console.log("Có lỗi xảy ra khi Ghim dự án", error);
    }
  }

  const [inforUser, setInfoUser] = useState([]);
  const [inforProject, setInfoProject] = useState([]);

  const [newGoal, setNewGoal] = useState("")
  const [fetchproject, setProject] = useState({
    projectDetails: {
      name: "",
      description: "",
      endDate: "",


    }
  });

  const fetchUser = async () => {
    try {
      const response = await axios.get(`https://springboot-backend-pms-20-12-2024.onrender.com/api/users/profile`, {
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

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`https://springboot-backend-pms-20-12-2024.onrender.com/api/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Thông tin dự án", response.data);
      setInfoProject(response.data);
      setProject({
        projectDetails: response.data,  // Dữ liệu dự án sẽ được lưu trữ trong projectDetails
      });
    } catch (error) {
      console.log('Có lỗi xẩy ra trong quá trình thực hiện dữ liệu', error)
    }
  }



  const ExportToExcel = async () => {

    if (inforUser.id === inforProject.owner?.id) {
      try {

        const response = await axios.get(`https://springboot-backend-pms-20-12-2024.onrender.com/api/projects/projects/${id}/issues/export`, {
          headers: {
            "Authorization": `Bearer ${token}`
          },
          responseType: "arraybuffer",
        });
        const file = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(file);
        link.download = "report.xlsx";
        link.click();
        toast.success(
          <div>
            <strong>Tải xuống</strong>
            <p>Bạn đã tải xuống thống kê của kế hoạch ${inforProject.name}.</p>
          </div>
        )

      } catch (error) {
        console.log("Có lỗi xẩy ra trong quá trình thực hiện dữ liệu", error)
      }
    } else {
      toast.error(
        <div>
          <strong>Lỗi Tải xuống</strong>
          <p>Chỉ có người tạo tự án mới có thể tải xuống</p>
        </div>
      )
    }
  }
  useEffect(() => {
    fetchUser();
    fetchProjects();
    return;
  }, [token, id])

  const displayedMembers = project.projectDetails?.team.slice(0, 5)
  const additionalMembers = Math.max(0, project.projectDetails?.length - 5)

  const [member, setMember] = useState([]);

  const handleEditWorkType = (memberId, newWorkType) => {
    setMember(member.map(member =>
      member.userId === memberId ? { ...member, workType: newWorkType } : member
    ))
    setEditingMember(null)
  }

  const fetchMember = async () => {
    if (!token) {
      console.log("Phiên đăng nhập đã hết hạn")
    } else {
      console.log("id", id)
      try {
        const response = await axios.get(`https://springboot-backend-pms-20-12-2024.onrender.com/api/users/project/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log("Thành viên", response.data);
        setMember(response.data);

      } catch (error) {
        console.log("Có lỗi xẩy ra trong quá trình tải dữ liệu", error)
      }
    }
  }

  const addWorkTypeMenbers = async (memberId, newWorkType) => {
    if (inforUser.id === inforProject.owner?.id) {
      try {

        const requestData = {
          userId: memberId,
          projectId: 1003,
          workingType: newWorkType
        };

        console.log("Dữ liệu truyền vào", requestData)

        const response = await axios.post(`https://springboot-backend-pms-20-12-2024.onrender.com/api/worktype/addWorkType`, null, {
          params: requestData,
          headers: {
            Authorization: `Bearer ${token}`
          }

        });
        console.log("Thêm hình thức làm việc cho người dùng thành công")

      } catch (error) {
        console.log("Có lỗi xảy ra trong quá trình tải dữ liệu");
      }
    } else {
      toast.warning(
        <div>
          <strong>Lỗi </strong>
          <p>Chỉ có người tạo tự án mới có thể chỉnh sửa</p>
        </div>
      )
    }
  }

  const updateWorkTypeMenbers = async (memberId, newWorkType) => {
    if (inforUser.id === inforProject.owner?.id) {
      try {
        const requestData = {
          userId: memberId,
          projectId: id,
          workingType: newWorkType
        };

        console.log("Dữ liệu truyền vào", requestData)
        const response = await axios.put(`https://springboot-backend-pms-20-12-2024.onrender.com/api/worktype/update`, null, {
          params: requestData,
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log("Cập nhập hình thức làm việc cho người dùng thành công")
        fetchMember();

      } catch (error) {
        console.log("Có lỗi xảy ra trong quá trình tải dữ liệu");
      }
    } else {
      toast.warning(
        <div>
          <strong>Lỗi </strong>
          <p>Chỉ có người tạo tự án mới có thể chỉnh sửa</p>
        </div>
      )
    }
  }

  const [tasks, setTasks] = useState([]);

  const fetchTask = async () => {
    try {
      const data = {
        projectId: id
      }
      const response = await axios.get(`https://springboot-backend-pms-20-12-2024.onrender.com/api/issues/project/${id}`, {

        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Nhiệm vụ", response.data);
      setTasks(response.data)

    } catch (error) {
      console.log("Có lỗi xảy ra trong quá trình tải dữ liệu")
    }
  }

  const calculateProgress = (memberId) => {
    const memberTasks = tasks.filter(task => task.assignee?.id === memberId)
    const completedTasks = memberTasks.filter(task => task.status === 'Hoàn thành').length
    const totalTasks = memberTasks.length
    return {
      percentage: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
      fraction: `${completedTasks}/${totalTasks}`
    }
  }

  useEffect(() => {
    fetchTask();
    fetchMember();
  }, [])

  // Hàm thay đổi trạng thái

  const [updateproject, setUpdateProject] = useState([]);

  const updateProject = async () => {
    try {

      const response = await axios.put(`localhost:1000/api/projects/${id}`,)
    } catch (error) {
      console.log("Có lỗi xẩy ra trong quá trình thực hiển dữ liệu", error)
    }
  }

  const onStatusChange = async (value) => {

    if (value === 'done' || value === "inprocess") {
      try {
        const requestData = {
          status: value,
        }

        const response = await axios.put(`https://springboot-backend-pms-20-12-2024.onrender.com/api/projects/${id}/status`, null, {
          params: requestData,
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } catch (error) {
        console.log("Có lỗi xẩy ra trong quá trình thực hiển dữ liệu", error)
      }
      // setUpdateProject(updatedProject);

      console.log("Trạng thái mới:", value);
      dispatch(fetchProjectById(id))

    } else {
      console.error("Không tìm thấy project với ID:", value);
    }
  };

  const handleChangeproject = (e) => {
    const { name, value } = e.target;
    setProject(prevProject => ({
      ...prevProject,
      projectDetails: {
        ...prevProject.projectDetails,
        [name]: value
      }
    }));

  };

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      setProject(prevProject => ({
        ...prevProject,
        projectDetails: {
          ...prevProject.projectDetails,
          goals: [...prevProject.projectDetails.goals, newGoal.trim()]
        }
      }));
      setNewGoal("");

    }
  };

  const handleRemoveGoal = (index) => {
    setProject(prevProject => ({
      ...prevProject,
      projectDetails: {
        ...prevProject.projectDetails,
        goals: prevProject.projectDetails.goals.filter((_, i) => i !== index)
      }
    }));
  };

  const [projectTabs, setProjectTabs] = useState([]);
  const [projectIssues, setProjectIssues] = useState([]);
  const [newTabLabel, setNewTabLabel] = useState('')

  const fetchProjectTabs = async () => {
    try {
      const response = await axios.get(`https://springboot-backend-pms-20-12-2024.onrender.com/api/taskCategories/project/${id}`, {
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

  const fetchProjectIssue = async () => {
    try {
      const response = await axios.get(`https://springboot-backend-pms-20-12-2024.onrender.com/api/issues/project/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProjectIssues(response.data);

    } catch (error) {
      console.log("Có lỗi xảy ra trong quá trình tải dữ liệu", error);
    }
  }

  const addProjectTabs = async (newTabId) => {
    try {
      const requestData = {
        Label: newTabId
      }
      const response = await axios.post(`https://springboot-backend-pms-20-12-2024.onrender.com/api/taskCategories/project/${id}`, {}, {
        params: requestData,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Thêm Tabs thành công");
      setProjectTabs(prevTabs => [...prevTabs, response.data]);
    } catch (error) {
      console.log("Có lỗi xảy ra trong quá trình tải dữ liệu", error);
    }
  }

  const deleteProjectTabs = async (TabsId) => {
    try {
      const response = await axios.delete(`https://springboot-backend-pms-20-12-2024.onrender.com/api/taskCategories/project/${id}/task/${TabsId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Xoá Tabs thành công")

      setProjectTabs(prevTabs => prevTabs.filter(tab => tab.id !== TabsId))
    } catch (error) {
      console.log("Có lỗi xảy ra trong quá trình tải dữ liệu", error);
    }
  }


  useEffect(() => {
    fetchProjectTabs();
    fetchProjectIssue();
  }, [id, token])

  const isTabDeletable = (label) => {
    return !['Chưa làm', 'Đang làm', 'Hoàn thành'].includes(label)
  }

  const addNewTab = () => {
    addProjectTabs(newTabLabel)
    setNewTabLabel('')
  }

  const handleDeleteTab = (TabsId) => {
    deleteProjectTabs(TabsId)
  }

  const PdfExport = async (userId) => {
    try {

      const response = await axios.get(`https://springboot-backend-pms-20-12-2024.onrender.com/api/export/projects/${id}/users/${userId}/tasks/pdf`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        responseType: 'blob',
      });
      // Tạo một blob từ dữ liệu trả về
      const blob = new Blob([response.data], { type: 'application/pdf' });

      // Tạo URL từ blob
      const url = window.URL.createObjectURL(blob);

      // Tạo thẻ <a> để tải file
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report_${userId}_${id}.pdf`);
      document.body.appendChild(link);
      link.click();

      // Xóa URL sau khi tải xong
      window.URL.revokeObjectURL(url);
      link.remove();

      console.log("File PDF đã được tải về thành công");
    } catch (error) {
      console.log("Có lỗi xảy ra trong quá trình tải dữ liệu", error);
    }
  }

  const [fileInfo, setFileInfo] = useState([]);

  const fetchFileInfo = async () => {
    try {
      if (!token) {
        console.log("Phiên đăng nhập đã hết hạn")
      }
      const response = await axios.get(`https://springboot-backend-pms-20-12-2024.onrender.com/api/file-info/project/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Tệp đã tải lên của dự án: ", response.data)
      setFileInfo(response.data)

    } catch (error) {
      console.log("Có lôi xảy ra trong quá trình thực hiển dữ liệu", error)
    }
  }

  useEffect(() => {
    fetchFileInfo();
  }, [token, id])

  const fetchFileUser = async () => {
    try {
      if (!token) {
        console.log("Phiên đăng nhập đã hết hạn")
      }
      const response = await axios.get(`https://springboot-backend-pms-20-12-2024.onrender.com/api/file-info/user`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Avater", response.data)
      setAvaterUser(response.data)

    } catch (error) {
      console.log("Có lỗi xẩy ra trong quá trình thực hiện dữ liệu", error)
    }
  }

  useEffect(() => {
    fetchFileUser();
  }, [token])

  const [isExtensionDialogOpen, setIsExtensionDialogOpen] = useState(false)
  const [newEndDate, setNewEndDate] = useState('');
  const [minDate, setMinDate] = useState('');

  useEffect(() => {
    if (project.projectDetails?.endDate) {
      // Chuyển đổi ngày kết thúc và cập nhật newEndDate
      const formattedEndDate = project.projectDetails.endDate.toString().split('T')[0];
      setNewEndDate(formattedEndDate);

      // Cập nhật minDate (thêm 1 ngày)
      const calculatedMinDate = format(
        addDays(parseISO(formattedEndDate), 1),
        'yyyy-MM-dd'
      );
      setMinDate(calculatedMinDate);
    }
  }, [project.projectDetails?.endDate]);

  const handleExtend = async () => {
    if (newEndDate) {
      try {
        const response = await axios.put(`https://springboot-backend-pms-20-12-2024.onrender.com/api/projects/${id}/endDate`,
          newEndDate,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          });
        if (response.status === 200) {
          console.log("Gia hạn thành công", newEndDate);

          // Cập nhật lại dữ liệu dự án sau khi gia hạn
          dispatch(fetchProjectById(id));

          // Đặt lại ngày kết thúc mới và đóng hộp thoại
          setNewEndDate('');
          setIsExtensionDialogOpen(false);
        } else {
          console.log("Lỗi khi cập nhật ngày kết thúc");
        }

      } catch (error) {
        console.log("Có lỗi xảy ra trong quá trình thực hiện dữ liệu")
      }

      console.log("Ngày gia hạn mới", newEndDate)

    }
  }

  const toggleMenu = () => {
    setIsExtensionDialogOpen(!isExtensionDialogOpen); // Đảo ngược trạng thái dropdown khi nhấn
  };


  const handleDeleteMember = async (memberId) => {

    setIsOpen(true)
    if (!token) {
      console.log("Phiên đăng nhập đã hết hạn");
      return; // Dừng lại nếu không có token
    }
  
    try {
      const response = await axios.delete(`https://springboot-backend-pms-20-12-2024.onrender.com/api/projects/${id}/members/${memberId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Kiểm tra phản hồi từ server, ví dụ như kiểm tra status
      if (response.status === "No message available") {
        console.log("Xoá thành công thành viên trong dự án");
      } else {
        console.log("Có lỗi khi xóa thành viên: ", response.data);
      }
    } catch (error) {
      // Kiểm tra lỗi axios, nếu có phản hồi từ server
      if (error.response) {
        console.error("Lỗi từ server:", error.response.data);
        fetchMember();
        toast.success('Xoá thành công thành viên')
        setIsOpen(false)
      } else {
        console.error("Lỗi kết nối:", error.message);
        toast.warning('Bạn không có quyền truy cập')
      }
    }
  
    // Các log khác (nếu cần thiết)
    console.log("Xoá thành viên", memberId);
    console.log("Xoá thành viên trong dự án", id);
  };

  const fetchAvatarOwner = async() => {
    try{
      const response = await axios.get(`https://springboot-backend-pms-20-12-2024.onrender.com/api/projects/${id}/ownerFile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Avatar Owner Project", response.data)
      setAvatarOwner(response.data)

    }catch(error){
      console.log("Có lỗi xảy ra trong quá trình tải dữ liệu", error)
    }
  }

  useEffect(() => {
    fetchAvatarOwner();
  }, [id])
  





  return (
    <>
      <div className='mt-5 lg:px-10'>
        <div className='lg:flex gap-5 justify-between pb-4'>
          <div className='w-full'>
            <Tabs
              value={activeMainTab}
              onChange={handleMainTabChange}
              centered
              textColor='secondary'
              indicatorColor='secondary'>
              <Tab label="Thông tin" value="details" />
              <Tab label="Thành viên" value="members" />
              <Tab label="Thống kê" value="statistics" />
              <Tab label="Tệp đã tải lên" value="uploadFile" />
              <Tab label="lịch biểu" value="Calender" />
            </Tabs>
            {activeMainTab === 'details' && (
              <ScrollArea className="h-screen lg:w-[100%] pr-2">
                <div className='text-gray-400 pb-10 w-full'>

                  <div className="flex items-center gap-4 p-4 bg-white  shadow mb-8">
                    <div className="relative">
                      <div className="w-12 h-12 bg-violet-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-semibold">Xd</span>
                        <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-black text-white text-xs flex items-center justify-center rounded-full">1</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold">{project.projectDetails?.name}</h2>
                      <p className="text-sm text-muted-foreground">{project.projectDetails?.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit project</span>
                          </Button>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle className="text-xl font-bold">Chỉnh sửa thông tin dự án</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="name">Tên dự án</Label>
                              <Input id="name" name="name" value={fetchproject.projectDetails?.name || ""} onChange={(e) => handleChangeproject(e)}
                                className="border-[rgb(29,134,192)] focus-visible:ring-[rgb(29,134,192)]" />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="description">Mô tả</Label>
                              <Textarea
                                id="description"
                                name="description"
                                value={fetchproject.projectDetails?.description}
                                onChange={handleChangeproject}
                                className="min-h-[100px] border-[rgb(29,134,192)] focus-visible:ring-[rgb(29,134,192)]"
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="endDate">Thời gian kết thúc</Label>
                              <Input id="endDate" name="endDate" type="date" value={fetchproject.projectDetails?.endDate} onChange={handleChangeproject}
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="goals">Mục tiêu</Label>
                              <ul className="space-y-2">
                                {fetchproject.projectDetails?.goals?.map((goal, index) => (
                                  <li key={index} className="flex items-center gap-2">
                                    <span className="flex-grow">{goal}</span>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleRemoveGoal(index)}
                                      aria-label={`Xóa mục tiêu: ${goal}`}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </li>
                                ))}
                              </ul>
                              <div className="flex gap-2" >
                                <Input
                                  id="goals"
                                  name='goals'
                                  value={newGoal}
                                  onChange={(e) => setNewGoal(e.target.value)}
                                  placeholder="Thêm mục tiêu mới"
                                  aria-label="Nhập mục tiêu mới"
                                  style={{ width: '90%' }}
                                />
                                <Button type="button" onClick={handleAddGoal} aria-label="Thêm mục tiêu" className="hover:bg-[rgb(29,134,192)] hover:text-white border-[rgb(29,134,192)]">
                                  <Plus className="h-4 w-4 mr-2 text-white" />
                                  Thêm
                                </Button>
                              </div>
                            </div>
                            <div className="flex justify-end gap-4">
                              <Button type="button" variant="outline" className="hover:bg-[rgb(29,134,192)] hover:text-white border-[rgb(29,134,192)]">Hủy</Button>
                              <Button type="submit" className="bg-[rgb(29,134,192)] hover:bg-[rgb(29,134,192)]/90">Lưu thay đổi</Button>
                            </div>
                          </form>
                        </DialogContent>


                      </Dialog>

                      <Button onClick={() => UpdateProjectPinned()} variant="outline" size="icon" title="Ghim dự án">
                        <Pin className="h-4 w-4" />
                        <span className="sr-only">Pin project</span>
                      </Button>
                      <Button onClick={ExportToExcel} variant="outline" size="icon" title="Tải xuống báo cáo Excel">
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download Excel report</span>
                      </Button>
                    </div>

                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/50">
                    <div className="relative h-10 w-10">
                      <img
                        src={avatarOwner[0]?.Filename}
                        alt="Avatar"
                        className="rounded-full object-cover"
                        height={40}
                        width={40}
                      />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Người tạo dự án</div>
                      <div className="font-medium">{project.projectDetails?.owner.fullname}</div>
                    </div>
                  </div>

                  <div className="space-y-8" style={{ marginTop: '20px' }}>
                    <section className="grid gap-6">
                      <div className="space-y-2">
                        <h2 className="text-2xl font-semibold tracking-tight">Tổng quan kế hoạch</h2>
                        <p className="text-muted-foreground">
                          {project.projectDetails?.description}
                        </p>
                      </div>

                      <div className="grid gap-6 md:grid-cols-4">
                        <div className="rounded-lg border p-4">
                          <div className="flex items-center gap-2 justify-between">
                            <h2 className="text-sm font-medium">Trạng thái</h2>
                            <DropdownMenu>
                              <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                                <MoreVertical className="h-5 w-5" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => onStatusChange(project.projectDetails?.status === 'done' ? 'inprocess' : 'done')}>
                                  {project.projectDetails?.status === 'inprocess' ? (
                                    <div className="flex items-center">
                                      <XCircle className="mr-2 h-4 w-4" />
                                      <span> Đánh dấu hoàn thành</span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center">
                                      <CheckCircle2 className="mr-2 h-4 w-4" />
                                      <span>Đánh dấu chưa hoàn thành</span>
                                    </div>
                                  )}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <div className="mt-2">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${project.projectDetails?.status === 'done'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                                }`}
                            >
                              {project.projectDetails?.status === 'done' ? 'Hoàn thành' : 'Chưa hoàn thành'}
                            </span>
                          </div>
                        </div>

                        <div className="rounded-lg border p-4">
                          <h2 className="text-sm font-medium">Thể loại</h2>
                          <div className="mt-2">
                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                              {project.projectDetails?.category}
                            </span>
                          </div>
                        </div>

                        <div className="rounded-lg border p-4">
                          <h2 className="text-sm font-medium">Tiến độ</h2>
                          <div className="mt-2">
                            <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-100">
                              <div className="h-full rounded-full bg-primary" style={{ width: `${processData}%` }} />
                            </div>
                            <p className="mt-2 text-sm">{processData}% hoàn thành</p>
                          </div>
                        </div>

                        <div className="rounded-lg border p-4">
                          <div className="flex items-center gap-2 justify-between">
                            <h2 className="text-sm font-medium">Thời gian</h2>
                            <DropdownMenu>
                              <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                                <MoreVertical className="h-5 w-5" onClick={toggleMenu} />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setIsExtensionDialogOpen(true)}>
                                  <div className="flex items-center">
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    <span>Gia hạn</span>
                                  </div>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>

                            <Dialog open={isExtensionDialogOpen} onOpenChange={setIsExtensionDialogOpen}>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Gia hạn dự án {project.projectDetails?.name}</DialogTitle>
                                </DialogHeader>
                                <div className="py-4">
                                  <Label htmlFor="newEndDate">Ngày kết thúc mới</Label>
                                  <Input
                                    id="newEndDate"
                                    value={newEndDate}
                                    onChange={(e) => setNewEndDate(e.target.value)}
                                    min={minDate}  // Đảm bảo minDate đã được xác định trước đó
                                    type="date"
                                    required
                                    className="mt-1"
                                  />
                                </div>
                                <DialogFooter>
                                  <Button type="button" onClick={handleExtend}>
                                    Xác nhận
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>

                          <div className="mt-2 space-y-1 text-sm">
                            <p>Bắt đầu: {project.projectDetails?.createdDate ? format(new Date(project.projectDetails.createdDate), 'dd/MM/yyyy') : 'Chưa xác định'}</p>
                            <p>Kết thúc dự kiến: {project.projectDetails?.endDate ? format(new Date(project.projectDetails.endDate), 'dd/MM/yyyy') : 'Chưa xác định'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Mục tiêu</h3>
                          <ul className="space-y-2">
                            {project.projectDetails?.goals.map((goal, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <svg
                                  className="h-5 w-5 text-green-500 mt-0.5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                <span>{goal}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Công nghệ sử dụng</h3>
                          <div className="flex flex-wrap gap-2">

                            {project.projectDetails && project.projectDetails?.tags && project.projectDetails?.tags.map((tag, index) => (
                              <Badge key={index}>{tag}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>

                  <div value="team" className="space-y-8" style={{ marginTop: '20px' }}>
                    <section className="grid gap-6">
                      <div className="space-y-2">
                        <h2 className="text-2xl font-semibold tracking-tight">Thành viên trong kế hoạch</h2>
                        <p className="text-muted-foreground">Danh sách thành viên và vai trò trong dự án</p>
                      </div>

                      <div className=" grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {displayedMembers?.map((item, index) => {

                          const progress = calculateProgress(item.id)

                          return (
                            <div key={index} className=" border rounded-t-lg shadow-lg overflow-hidden">
                              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white" >
                                <div className=" flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
                                    <Avatar className="h-16 w-16 border-2 border-white">
                                      <AvatarImage src={item.fileInfo[0]?.fileName} alt="Nguyễn Văn Tài" />
                                      <AvatarFallback className="bg-white text-blue-500 text-xl font-semibold">{item.fullname.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>

                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h3 className="text-xl font-semibold">{item.fullname}</h3>
                                    </div>
                                    
                                    <p className="text-sm text-blue-100">{item.programerposition}</p>

                                  </div>


                                </div>
                              </div>


                              <div className="p-4 space-y-2">
                                <div className="text-sm text-muted-foreground">Tiến độ công việc</div>
                                <Progress value={progress.percentage} className="h-2" />
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">
                                    {progress.fraction} tác vụ
                                  </span>
                                  <span className="font-medium">
                                    {progress.percentage.toFixed(0)}%
                                  </span>
                                </div>
                              </div>
                              <div className="p-4 flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="h-4 w-4" />
                                {item.email}
                              </div>
                            </div>
                          )

                        })}
                        {additionalMembers > 0 && (
                          <Card>
                            <CardContent className="flex items-center justify-center p-4">
                              <div className="text-center">
                                <span className="text-2xl font-bold">+{additionalMembers}</span>
                                <p className="text-sm text-muted-foreground">thành viên khác</p>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </section>
                  </div>

                  <div className='space-y-5 pb-10 text-sm' style={{ marginTop: "20px" }}>
                    <div className='flex'>
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
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold">Tệp đã tải lên</h2>
                            <div className="flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 rounded-full">
                              <FileIcon className="h-4 w-4" />
                              {/* <span className="text-sm font-medium">{project.projectDetails?.fileNames.length}</span> */}
                              <span className="text-sm font-medium">{fileInfo?.length}</span>

                            </div>
                          </div>
                          <div className='w-full max-w-md mx-auto p-6 space-y-6'>
                            <label
                              htmlFor="file-upload"
                              className="block border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                            >
                              <input
                                id="file-upload"
                                type="file"
                                onChange={handleFileChange}
                                multiple
                                className="hidden"
                              />
                              <Upload className="mx-auto h-12 w-12 text-gray-400" />
                              <p className="mt-2 text-sm text-gray-600">
                                Nhấp để chọn hoặc kéo và thả tệp vào đây
                              </p>
                              <p className="text-xs text-gray-500">PNG, JPG, GIF tối đa 10MB</p>
                            </label>

                            <AnimatePresence>
                              {selectedFile.length > 0 && (
                                <motion.div
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -20 }}
                                  className="space-y-2"
                                >
                                  {selectedFile.map((file, index) => (
                                    <motion.div
                                      key={file.name}
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      exit={{ opacity: 0, x: 20 }}
                                      className="flex items-center justify-between p-3 bg-gray-100 rounded-md"
                                    >
                                      <div className="flex items-center space-x-3">
                                        <FileText className="h-5 w-5 text-primary" />
                                        <span className="text-sm font-medium truncate max-w-[200px]">
                                          {file.name}
                                        </span>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeFile(index)}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </motion.div>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>

                            <div className="space-y-4">
                              <Button
                                onClick={handleUpload}
                                disabled={isUploading || selectedFile.length === 0}
                                className="w-full"
                              >
                                {isUploading ? "Đang tải lên..." : "Tải tệp lên"}
                              </Button>

                            </div>

                            <AnimatePresence>
                              {isUploading && (
                                <motion.div
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                >
                                  <Progress value={uploadProgress} className="w-full" />
                                  <p className="text-sm text-center mt-2 text-gray-600">
                                    Đang tải lên: {Math.round(uploadProgress)}%
                                  </p>
                                </motion.div>
                              )}
                            </AnimatePresence>

                          </div>

                        </CardContent>
                      </Card>



                    </div>
                  </div>

                  <section>
                    <div className="space-y-4 p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg shadow-md">
                      <div className="flex justify-between items-center">
                        <div>
                          <h2 className="text-2xl font-semibold text-blue-800">Danh sách tác vụ</h2>
                          <p className="text-sm text-blue-600">
                            Danh sách tất cả các tác vụ có trong kế hoạch
                          </p>
                        </div>

                        <div className="flex gap-2 items-center">
                          <Input
                            placeholder="Tên vấn đề mới"
                            value={newTabLabel}
                            onChange={(e) => setNewTabLabel(e.target.value)}
                            className="max-w-[200px] border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                          <Button onClick={addNewTab} size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white gap-2 whitespace-nowrap transition-colors duration-300"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Thêm vấn đề
                          </Button>

                        </div>

                      </div>
                      <div className="tabs w-full flex items-center justify-around">
                        <Tabs
                          value={activeTab}
                          onChange={handleChange}
                          aria-label="task progress tabs"
                          centered
                          textColor="secondary"
                          indicatorColor="secondary"
                        >
                          {projectTabs.map((tab, index) => (
                            <Tab
                              key={index}
                              // label={tab.label}
                              label={
                                <div className="flex items-center space-x-2">
                                  <span>{tab.label}</span>
                                  {isTabDeletable(tab.label) && (
                                    <X
                                      className="h-4 w-4 text-gray-500 hover:text-white bg-gray-200 hover:bg-red-500 rounded-full p-0.5 transition-colors duration-200 ease-in-out"
                                      onClick={() => handleDeleteTab(tab.id)}
                                    />
                                  )}
                                </div>
                              }
                              value={tab.label}
                              className={activeTab === tab.label ? 'text-red-500' : 'text-gray-500'}
                            />
                          ))}
                        </Tabs>
                      </div>
                    </div>

                    <div className="tab-content py-5">
                      {projectTabs.map((item, index) => (
                        activeTab === item.label && <IssueList status={item.label} title={item.label} />
                      ))}
                    </div>
                  </section>
                </div>
              </ScrollArea>
            )}

            {activeMainTab === 'statistics' && (
              <ScrollArea className="h-screen lg:w-[100%] pr-2">
                <GetIssuesCountByStatus />

              </ScrollArea>
            )}

            {activeMainTab === 'uploadFile' && (
              <ScrollArea className="h-screen lg:w-[100%] pr-2">
                <div className="h-screen w-full bg-gradient-to-br from-background to-secondary/20 flex flex-col">
                  <h2 className="text-2xl font-bold mb-6">Tệp đã tải lên</h2>
                  {fileInfo && fileInfo.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {fileInfo.map((file, index) => {
                        const filePath = file?.fileName; // Đường dẫn file
                        if (!filePath) return null; // Bỏ qua nếu không có filePath

                        // Tách tên tệp
                        const encodedFileName = filePath.split('%2F').pop()?.split('?')[0]; // Lấy tên tệp mã hóa
                        const fileName = decodeURIComponent(encodedFileName); // Giải mã tên tệp

                        const fileExtension = fileName.split('.').pop().toLowerCase();

                        return (
                          <Card key={index} className="overflow-hidden">
                            <CardContent className="p-4">
                              <div className="flex items-center space-x-4">
                                {getFileIcon(fileExtension)}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{fileName}</p>
                                  <p className="text-sm text-gray-500 truncate">{fileExtension.toUpperCase()}</p>
                                </div>
                              </div>
                              {['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(fileExtension) && (
                                <div className="mt-4">
                                  <img
                                    src={filePath}
                                    alt={fileName}
                                    className="w-full h-32 object-cover rounded"
                                  />
                                </div>
                              )}
                              <div className="flex justify-between items-center mt-4">
                                <a href={filePath}>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    href={filePath}
                                    onClick={() => handleDownload(filePath)}
                                  >
                                    <DownloadIcon className="h-4 w-4 mr-2" />
                                    Tải xuống
                                  </Button>
                                </a>

                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDelete(file?.id)}
                                >
                                  <TrashIcon className="h-4 w-4 mr-2" />
                                  Xoá
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Badge variant="secondary" className="text-sm">
                        Chưa có tệp nào
                      </Badge>
                    </div>
                  )}



                </div>
              </ScrollArea>
            )}

            {activeMainTab === 'Calender' && (
              <ScrollArea className="h-screen lg:w-[100%] pr-2 ">

                <Calender />
              </ScrollArea>

            )}

            {activeMainTab === 'members' && (
              <ScrollArea>
                <div className="flex flex-col h-full gap-6 p-6 bg-gray-50 dark:bg-gray-900">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 dark:bg-gray-900">
                          <TableHead className="w-[250px]">Thành viên</TableHead>
                          <TableHead className="hidden md:table-cell">Vị trí</TableHead>
                          <TableHead className="hidden lg:table-cell">Hình thức làm việc</TableHead>
                          <TableHead className="hidden md:table-cell">Email</TableHead>
                          <TableHead className="hidden lg:table-cell">Số điện thoại</TableHead>
                          <TableHead className="text-center">Nhiệm vụ</TableHead>
                          <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {member.map((member) => (
                          <TableRow key={member.userId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={member.fileName} alt={member.fullName} />
                                  <AvatarFallback>{member.fullName}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                  <span className="font-medium">{member.fullName}</span>
                                  <span className="text-sm text-muted-foreground md:hidden">{member.position}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{member.programerPosition}</TableCell>
                            <TableCell className="hidden lg:table-cell">
                              <Badge variant="outline" className={
                                member.workType === 'Remote' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                                  'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                              }>
                                {member.workType || 'Chưa có'}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-gray-400" />
                                <span className="text-sm">{member.email}</span>
                              </div>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <span className="text-sm">{member.phone}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant="secondary">{member.issues} Task</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-end gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      {member.workType ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                                      <span className="sr-only">{member.workType ? 'Sửa' : 'Thêm'}</span>
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                      <DialogTitle>
                                        {member.workType ? 'Chỉnh sửa hình thức làm việc' : 'Thêm hình thức làm việc'}
                                      </DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="workType" className="text-right">
                                          Hình thức
                                        </Label>
                                        <Select
                                          onValueChange={(value) =>

                                            updateWorkTypeMenbers(member.userId, value)
                                          }
                                          defaultValue={member.workType || undefined}
                                        >
                                          <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Chọn hình thức làm việc" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="On-Site">On-Site</SelectItem>
                                            <SelectItem value="Remote">Remote</SelectItem>
                                            <SelectItem value="Freelancer">Freelancer</SelectItem>
                                            <SelectItem value="Hybrid">Hybrid</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>

                                  </DialogContent>
                                </Dialog>
                                {/* <Button onClick={() => PdfExport(member.userId)} variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                  <Download className="h-4 w-4" />
                                  <span className="sr-only">Thống kê</span>
                                </Button> */}
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteMember(member.userId)}>
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Xóa</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </ScrollArea>

            )}
          </div>
          <div className='lg:w-[30%] founded-md sticky right-5 top-10'>
            <ChatBox />
          </div>
        </div>
      </div>
    </>
  );
}

export default ProjectDetails;

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
import { CalendarIcon, LinkIcon, MenuIcon, SendIcon, TagIcon, UploadIcon } from "lucide-react";
import { Card, Progress } from "antd";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createComment } from "@/Redux/Comment/Action";
import { useForm } from "react-hook-form";
import TextArea from "antd/es/input/TextArea";


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

  const handleFileUpload = () => {
    if (selectedFile) {
      // Here you would typically handle the file upload to your backend
      console.log("File to upload:", selectedFile.name)
      // Reset the file input after upload
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleLinkSubmit = (event) => {
    event.preventDefault()
    const link = event.target.link.value
    if (link) {
      // Here you would typically handle the link submission to your backend
      console.log("Link submitted:", link)
      event.target.reset()
    }
  }

  // const form = useForm({
  //   // resolver: zod
  //   defaultValues: {
  //     content: newComment,
  //   }
  // })

  const onSubmit = (data) => {
    dispatch(createComment({ content: newComment, issueId }))
    console.log("create project data:", data)
    setNewComment("");
  }



  return (

    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-4 bg-white border-b">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">{issue.issueDetails?.title || "Default Title"}</h1>
          </div>
          <Select onValueChange={handleUpdateIssueStatus} defaultValue={issue.issueDetails?.status || "pending"}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={issue.issueDetails?.status || "Select Status"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Chưa làm</SelectItem>
              <SelectItem value="in_progress">Đang hoàn thàh</SelectItem>
              <SelectItem value="done">Đã hoàn thành</SelectItem>
            </SelectContent>
          </Select>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
              <Card className="md:col-span-2 h-full">
                <CardHeader>
                  <CardTitle>Chi tiết tác vụ</CardTitle>
                  <CardDescription>Task ID: TV - {issue.issueDetails?.id || "N/A"}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Mô tả</h3>
                    <p className="text-sm text-gray-700">{issue.issueDetails?.description || "No description available."}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Tiến độ</h3>
                    <Progress value={issue.issueDetails?.progress || 0} className="w-full" />
                    <p className="text-sm text-gray-600 mt-1">{issue.issueDetails?.progress || 0}% hoàn thành</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600">Hết hạn {new Date(issue.issueDetails?.dueDate).toLocaleDateString('vi-VN') || "N/A"}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Phân công</h3>
                    <div className="flex -space-x-2 overflow-hidden">
                      {issue.issueDetails?.assignee?.fullname ? (
                        <div className="flex items-center gap-3">
                          <Avatar className="border-2 border-white">
                            <AvatarFallback>{issue.issueDetails.assignee.fullname.slice(-3)[0]}</AvatarFallback>
                          </Avatar>
                          <p>{issue.issueDetails.assignee.fullname}</p>
                        </div>
                      ) : (
                        <p>Chưa phân công</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Độ ưu tiên</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">
                        <TagIcon className="h-3 w-3 mr-1" />
                        <p>{issue.issueDetails?.priority || "Normal"}</p>
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Tải tệp lên</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Tệp</h3>
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        onChange={handleFileSelect}
                        ref={fileInputRef}
                        className="flex-grow"
                      />
                      <Button onClick={handleFileUpload} disabled={!selectedFile}>
                        <UploadIcon className="h-4 w-4 mr-2" />
                        Tải lên
                      </Button>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Đường dẫn</h3>
                    <form onSubmit={handleLinkSubmit} className="flex gap-2">
                      <Input type="url" name="link" placeholder="https://example.com" required className="flex-grow" />
                      <Button type="submit">
                        <LinkIcon className="h-4 w-4 mr-2" />
                        Thêm
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle>Đánh giá</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px] pr-4">
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
              </Card>

              
            </div>
          </div>
        </main>
      </div>
    </div>


  )
}

export default IssueDetails
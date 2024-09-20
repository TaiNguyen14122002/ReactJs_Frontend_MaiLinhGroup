import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import IssueCard from './IssueCard'
import { Button } from '@/components/ui/button'
import { PlusIcon } from '@radix-ui/react-icons'
import CreateIssueForm from './CreateIssueForm'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { fetchIssues } from '@/Redux/Issue/Action'
import { useParams } from 'react-router-dom'


const IssueList = ({title, status}) => {
    const dispatch = useDispatch();
    const {issue} = useSelector(store => store)
    const {id} = useParams();
    useEffect(() => {
        dispatch(fetchIssues(id))
    },[id])
  return (
    <div className='w-full'>
  <Dialog >
    <Card className="w-full ">
      <CardHeader>
        <CardTitle>
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="px-2">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border px-4 py-2 text-left">Tiêu đề</th>
              <th className="border px-4 py-2 text-left">Mô tả</th>
              <th className="border px-4 py-2 text-left">Ngày hết hạn</th>
              <th className="border px-4 py-2 text-left">Ưu tiên</th>
              <th className="border px-4 py-2 text-left">Tiến độ</th>
              <th className="border px-4 py-2 text-left">Nhiệm vụ</th>
            </tr>
          </thead>
          <tbody>
            {issue.issues
              .filter((issue) => issue.status == status)
              .map((item) => (
                <tr key={item.id}>
                  <td className="border px-4 py-2">{item.title}</td>
                  <td className="border px-4 py-2">{item.description}</td>
                  <td className="border px-4 py-2">
              {new Date(item.dueDate).toLocaleDateString('vi-VN')} {/* Định dạng ngày */}
            </td>
                  <td className="border px-4 py-2">{item.priority}</td>
                  <td className="border px-4 py-2">{item.status}</td>
                  <td className="border px-4 py-2">
                    {/* Thay IssueCard bằng nút hoặc các hành động khác */}
                    <IssueCard projectId={id} item={item} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </CardContent>

      <CardFooter>
        <DialogTrigger>
          <Button variant="outline" className="w-full flex items-center gap-2">
            <PlusIcon />
            Thêm nhiệm vụ
          </Button>
        </DialogTrigger>
      </CardFooter>
    </Card>

    <DialogContent>
      <DialogHeader>
        <DialogTitle>Thêm nhiệm vụ mới</DialogTitle>
      </DialogHeader>
      <CreateIssueForm status={status} />
    </DialogContent>
  </Dialog>
</div>

  )
}

export default IssueList
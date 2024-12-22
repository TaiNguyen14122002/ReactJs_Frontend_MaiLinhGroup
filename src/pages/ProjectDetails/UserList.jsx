import { assignedUserToIssue } from "@/Redux/Issue/Action";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const UserList = ({ issueDetails, onUpdate }) => {  // Thêm onUpdate vào props
    const { project } = useSelector((store) => store);
    const dispatch = useDispatch();
    const [avatar, setAvatar] = useState([]);
    const [assignee, setAssignee] = useState(issueDetails.assignee); // Theo dõi người được gán
    const token = localStorage.getItem("jwt");

    const handleAssignIssueToUser = async (userId, event) => {
        try {
            // Gửi yêu cầu gán user
            dispatch(assignedUserToIssue({ issueId: issueDetails.id, userId }));

            // Cập nhật người được gán tại client (tránh cần tải lại từ server)
            const selectedUser = project.projectDetails.team.find((user) => user.id === userId);
            if (selectedUser) {
                setAssignee(selectedUser);
                event.preventDefault(); // Ngăn hành vi mặc định
                if (onUpdate) {
                    onUpdate(); // Gọi callback onUpdate để cập nhật dữ liệu trong IssueCard
                }
            }
        } catch (error) {
            console.error("Có lỗi xảy ra trong quá trình gán người dùng:", error);
        }
    };

    const fetchAvatar = async (userId) => {
        try {
            const response = await axios.get(`https://springbootbackendpms2012202-production.up.railway.app/api/file-info/UserAssigner/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setAvatar((prev) => ({ ...prev, [userId]: response.data }));
        } catch (error) {
            console.error("Có lỗi xảy ra trong quá trình tải avatar", error);
        }
    };

    useEffect(() => {
        if (project.projectDetails?.team) {
            project.projectDetails.team.forEach((member) => {
                fetchAvatar(member.id);
            });
        }
    }, [project]);

    return (
        <div className="space-y-2">
            <div className="border rounded-md">
                <p className="py-2 px-3">{assignee?.fullname || "Chưa phân công"}</p>
            </div>
            {project.projectDetails?.team.map((item) => (
                <div
                    onClick={(event) => handleAssignIssueToUser(item.id, event)}
                    key={item.id}
                    className="py-2 group hover:bg-slate-800 cursor-pointer flex items-center space-x-4 rounded-md border px-4"
                >
                    <Avatar>
                        <AvatarImage src={avatar[item.id]?.[0]?.fileName || ""} />
                        <AvatarFallback>
                            {item.fullname.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <p className="text-sm leading-none">{item.fullname}</p>
                        <p className="text-sm text-muted-foreground">@{item.fullname.toLowerCase()}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UserList;

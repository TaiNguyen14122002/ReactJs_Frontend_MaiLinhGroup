import { useLocation, Link } from 'react-router-dom';
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const BreadcrumbComponent = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  return (
    <nav aria-label="Breadcrumb">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/">Trang chủ</BreadcrumbLink>
          <BreadcrumbSeparator />
        </BreadcrumbItem>
        {pathnames.map((pathname, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;

          // Thay đổi các từ khóa thành từ hiển thị tương ứng
          const displayName = pathname === 'project' ? 'Kế hoạch' :
                              pathname === 'status' ? 'Thống kê' :
                              pathname === 'upgrade_plan' ? 'Đã giao cho tôi' :
                              pathname === 'Issue' ? 'Nhiệm vụ' :
                              pathname === 'Countproject'  ? 'Thống kê hoa hồng' :
                              pathname.charAt(0).toUpperCase() + pathname.slice(1);

          return (
            <BreadcrumbItem key={to}>
              <BreadcrumbLink as={Link} to={to}>
                {displayName} {/* Hiển thị tên tương ứng */}
              </BreadcrumbLink>
              <BreadcrumbSeparator />
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </nav>
  );
};

export default BreadcrumbComponent;

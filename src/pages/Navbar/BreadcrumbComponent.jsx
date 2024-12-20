import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const BreadcrumbComponent = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  // Create a mapping object for path translations with all possible cases
  const pathTranslations = {
    'project': 'Dự án',
    'Project': 'Dự án',
    'status': 'Thống kê',
    'Status': 'Thống kê',
    'upgrade_plan': 'Đã giao cho tôi',
    'Upgrade_plan': 'Đã giao cho tôi',
    'issue': 'Nhiệm vụ',
    'Issue': 'Nhiệm vụ',
    'countproject': 'Thống kê lương thành viên ',
    'Countproject': 'Thống kê lương thành viên',
    'COUNTPROJECT': 'Thống kê lương thành viên',
    'performance': 'Hiệu suất',
    'Performance': 'Hiệu suất',
    'deleted': 'Dự án đã xoá',
    'Deleted': 'Dự án đã xoá',
    'DELETED': 'Dự án đã xoá',
    'Expiring': 'Dự án sắp hết hạn',
    'EXPIRING': 'Dự án sắp hết hạn',
    'Expired': 'Dự án đã hết hạn',
    'Issues': 'Nhiệm vụ',
    'PDF': 'Xuất PDF',
    'Information': 'Xem thông tin PDF',
    'Statistical': 'Chi têu dự án',
    'Members': 'Chi tiêu từng thành viên',
    
    

    
    
    
    
    
  };

  return (
    <nav aria-label="Breadcrumb">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/">Trang chủ</BreadcrumbLink>
          <BreadcrumbSeparator />
        </BreadcrumbItem>
        {pathnames.map((pathname, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          
          // Get the display name from translations, checking for case-insensitive match
          const displayName = pathTranslations[pathname] || 
                            pathTranslations[pathname.toLowerCase()] ||
                            pathTranslations[pathname.charAt(0).toUpperCase() + pathname.slice(1)] ||
                            pathname.charAt(0).toUpperCase() + pathname.slice(1);

          return (
            <BreadcrumbItem key={to}>
              <BreadcrumbLink as={Link} to={to}>
                {displayName}
              </BreadcrumbLink>
              {index < pathnames.length - 1 && <BreadcrumbSeparator />}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </nav>
  );
};

export default BreadcrumbComponent;


import { Dialog, DialogContent } from "@/components/ui/dialog";


export function LoadingPopup({ isOpen }) {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <div className="flex flex-col items-center justify-center p-4">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-semibold">Đang tải dữ liệu...</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}


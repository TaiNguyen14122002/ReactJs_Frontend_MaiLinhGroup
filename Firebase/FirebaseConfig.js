// Import các thư viện cần thiết từ Firebase
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// Cấu hình Firebase của bạn từ Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyBZJUcWgI5eoVycVyH6IoSZsNpV1ntcot8",
    authDomain: "pms-fe88f.firebaseapp.com",
    projectId: "pms-fe88f",
    storageBucket: "pms-fe88f.appspot.com",
    messagingSenderId: "768420476944",
    appId: "1:768420476944:web:a80d9f5c12b824e0cef295",
    measurementId: "G-6TD5VWN250"
  };

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Firebase Storage
const storage = getStorage(app);

export { storage };

// Hàm tải ảnh từ Firebase Storage
export const getImageUrl = async (path) => {
  const storageRef = ref(storage, "https://firebasestorage.googleapis.com/v0/b/pms-fe88f.appspot.com/o/files%2FBlack%20and%20White%20Auto%20Repair%20Logo%20(1).png?alt=media&token=5cbbc329-d36f-46e1-8526-53d6e2f11699");
  try {
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error("Error getting image URL:", error);
    return null;
  }
};

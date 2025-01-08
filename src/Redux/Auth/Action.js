
import { API_BASE_URL } from "@/config/api";
import { GET_USER_REQUEST, GET_USER_SUCCESS, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT, REGISTER_REQUEST, REGISTER_SUCCESS } from "./ActionTypes"
import axios from "axios"

export const register = (userData) => async (dispatch) => {
    dispatch({ type: REGISTER_REQUEST });
    try {
        const { data } = await axios.post(`${API_BASE_URL}/auth/signup`, userData);
        
        if (data.token) {
            localStorage.setItem("jwt", data.token);
            dispatch({ type: REGISTER_SUCCESS, payload: data });
            return { success: true };
        }

        console.log("Register success:", data);
    } catch (error) {
        console.error("Register failed:", error);

        // Kiểm tra phản hồi từ server
        if (error.response) {
            const status = error.response.status;
            const message = error.response.data.message;

            if (status === 403) {
                return {
                    error: {
                        message: 'Tài khoản đã tồn tại',
                        code: 'ACCOUNT_ALREADY_EXISTS'
                    }
                };
            }

            if (status === 400 || message === 'PASSWORD_DOES_NOT_MATCH') {
                return {
                    error: {
                        message: 'Mật khẩu không hợp lệ. Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ thường, chữ hoa, số và ký tự đặc biệt.',
                        code: 'PASSWORD_DOES_NOT_MATCH'
                    }
                };
            }
        }

        // Trả về lỗi mặc định nếu không khớp điều kiện nào ở trên
        return {
            error: {
                message: 'Đăng ký thất bại, vui lòng thử lại!',
                code: 'REGISTER_FAILED'
            }
        };
    }
};


export const login = userData => async (dispatch) => {
    dispatch({ type: LOGIN_REQUEST })
    try {

        const { data } = await axios.post(`${API_BASE_URL}/auth/login`, userData)
        if (data.token) {
            localStorage.setItem("jwt", data.token)
            dispatch({ type: LOGIN_SUCCESS, payload: data })
            return { data };
        }
        console.log("login success", data)
        
    } catch (error) {
        console.log(error)
        if (error.response) {
            const status = error.response.status;
            const message = error.response.data.message; // Lấy message trả về từ API
            
            //Trường hợp tài khoản không tồn tại
            if (message === "Tài khoản không tồn tại") {
                return { error: { message: 'Tài khoản không tồn tại', code: 'USER_NOT_FOUND' }};
            }
            
            // Trường hợp mật khẩu không chính xác
            if (message === 'Mật khẩu không chính xác') {
                return { error: { message: 'Mật khẩu không chính xác', code: 'INVALID_PASSWORD' }};
            }
        }

        // Mặc định nếu có lỗi chung
        return { error: { message: 'Đăng nhập thất bại, vui lòng thử lại!', code: 'LOGIN_FAILED' }};
    }
};

export const getUser = () => async (dispatch) => {
    dispatch({ type: GET_USER_REQUEST })
    try {
        const { data } = await axios.get(`${API_BASE_URL}/api/user/profile`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt")}`
            }
        });
        
            dispatch({ type: GET_USER_SUCCESS, payload: data });
        
        console.log("user success", data);
    } catch (error) {
        console.log(error);
    }
};

export const logout = () => async(dispatch) => {
    dispatch({type: LOGOUT})
    localStorage.clear();
}
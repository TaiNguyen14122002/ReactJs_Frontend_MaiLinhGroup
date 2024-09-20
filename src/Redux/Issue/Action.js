import api from "@/config/api";
import * as actionTypes from "./ActionTypes";

export const fetchIssues = (id) => {
    return async (dispatch) => {
        dispatch({ type: actionTypes.FETCH_ISSUES_REQUEST });
        try {
            const response = await api.get(`/api/issues/project/${id}`);
            console.log("fetch issues", response.data);
            dispatch({
                type: actionTypes.FETCH_ISSUES_SUCCESS,
                issues: response.data,
            });
        } catch (error) {
            dispatch({
                type: actionTypes.FETCH_ISSUES_FAILURE,
                error: error.message,
            });
        }
    };
};

export const createIssue = (issueData) => {
    return async (dispatch) => {

        dispatch({ type: actionTypes.CREATE_ISSUES_REQUEST })
        try {
            console.log("tai issue", issueData)
            const response = await api.post(`/api/issues`, issueData);

            dispatch({
                type: actionTypes.CREATE_ISSUES_SUCCESS,
                issue: response.data
            });
            console.log("issue created successfully", response.data)
        } catch (error) {
            console.log("error", error)
            dispatch({
                type: actionTypes.CREATE_ISSUES_FAILURE,
                error: error.message,
            });

        }
    };
};


export const deleteIssue = ({ issueId }) => {
    return async (dispatch) => {
        dispatch({ type: actionTypes.DELETE_ISSUES_REQUEST })
        try {
            const response = await api.delete("api/issues/" + issueId)
            console.log("issue delete", response)
            dispatch({
                type: actionTypes.DELETE_ISSUES_SUCCESS,

                issue: response.data
            })
        } catch (error) {
            console.log("error", error)
            dispatch({
                type: actionTypes.DELETE_ISSUES_FAILURE,
                error: error.message,
            });

        }
    };
};

export const fetchIssueById = (id) => {
    return async (dispatch) => {
        dispatch({ type: actionTypes.FETCH_ISSUES_BY_ID_REQUEST });
        try {
            const response = await api.get(`/api/issues/${id}`);
            console.log('fetch issue by id', response.data);
            dispatch({
                type: actionTypes.FETCH_ISSUES_BY_ID_SUCCESS,
                issue: response.data,
                
            });
        } catch (error) {
            dispatch({
                type: actionTypes.FETCH_ISSUES_BY_ID_FAILURE,
                error: error.message,
            }
            );
        }
    };
};





// export const fetchIssueById = (id) => {
//     return async (dispatch) => {
//         dispatch({ type: actionTypes.FETCH_ISSUES_BY_ID_REQUEST });
//         try {
//             const response = await api.get(`/api/issues/${id}`);
//             console.log('fetch issue by id', response.data); // Ensure this logs the expected data
//             dispatch({
//                 type: actionTypes.FETCH_ISSUES_BY_ID_SUCCESS,
//                 payload: response.data, // Correctly set payload
//             });
//         } catch (error) {
//             dispatch({
//                 type: actionTypes.FETCH_ISSUES_BY_ID_FAILURE,
//                 error: error.message,
//             });
//         }
//     };
// };

export const updateIssueStatus = ({ id, status }) => {
    return async (dispatch) => {
        dispatch({ type: actionTypes.UPDATE_ISSUES_STATUS_REQUEST });
        try {
            const response = await api.put(`/api/issues/${id}/status/${status}`);
            console.log("update issue status", response.data);
            dispatch({
                type: actionTypes.UPDATE_ISSUES_STATUS_SUCCESS,
                issues: response.data,
            })
        } catch (error) {
            dispatch({
                type: actionTypes.UPDATE_ISSUES_STATUS_FAILURE,
                error: error.message,
            })
        }
    };
};

export const assignedUserToIssue = ({ issueId, userId }) => {
    return async (dispatch) => {
        dispatch({ type: actionTypes.ASSIGNED_ISSUES_TO_USER_REQUEST });
        try {
            const response = await api.put(`/api/issues/${issueId}/assignee/${userId}`)
            console.log("assigned issue --- ", response.data);
            dispatch({
                type: actionTypes.ASSIGNED_ISSUES_TO_USER_SUCCESS,
                issue: response.data,
            })
        } catch (error) {
            console.log("error", error)
            dispatch({
                type: actionTypes.ASSIGNED_ISSUES_TO_USER_FAILURE,
                error: error.message,
            })
        }
    }
}


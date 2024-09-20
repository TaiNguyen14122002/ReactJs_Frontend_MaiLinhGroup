import * as actionTypes from './ActionTypes';

const initialState = {
    issues: [],
    loading: false,
    error: null,
    issueDetails: null,
};

const issueReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_ISSUES_REQUEST:
        case actionTypes.CREATE_ISSUES_REQUEST:
        case actionTypes.DELETE_ISSUES_REQUEST:
        case actionTypes.FETCH_ISSUES_BY_ID_REQUEST:
        case actionTypes.ASSIGNED_ISSUES_TO_USER_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case actionTypes.FETCH_ISSUES_SUCCESS:
            return {
                ...state,
                loading: false,
                issues: action.issues,
            };
            case actionTypes.FETCH_ISSUES_BY_ID_SUCCESS:
                console.log("Fetched Issue Details:", action.issue); // Debugging
                return {
                    ...state,
                    loading: false,
                    issueDetails: action.issue, // Ensure action.issue matches the payload from the action creator
                };
        case actionTypes.UPDATE_ISSUES_STATUS_SUCCESS:
            console.log("-----------", action.issues)
            return {
                ...state,
                loading: false,
                issueDetails: action.issue,
            };
        case actionTypes.CREATE_ISSUES_SUCCESS:
            return {
                ...state,
                loading: false,
                issues: [...state.issues, action.issue],
            };
        case actionTypes.ASSIGNED_ISSUES_TO_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                issues: state.issues.map((issue) => issue.id === action.issue.id ? action.issue : issue
            ),
            };
            case actionTypes.DELETE_ISSUES_SUCCESS:
                return {
                    ...state,
                    loading: false,
                    issues: state.issues.filter(
                        (issue) => issue.id !== action.issueId
                        // projects: state.projects.filter(
                        //     (project) => project.id !== action.projectId
                        // ),
                    ),
                };
                case actionTypes.FETCH_ISSUES_BY_ID_FAILURE:
                    case actionTypes.CREATE_ISSUES_FAILURE:
                        case actionTypes.DELETE_ISSUES_FAILURE:
                        case actionTypes.ASSIGNED_ISSUES_TO_USER_FAILURE:
                            return {
                                ...state,
                                loading: false,
                                error: action.error,
                            };

        default:
            return state;;
    }
};

export default issueReducer;
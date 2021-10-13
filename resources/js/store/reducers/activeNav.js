const initialState = "/";

const activeNav = (state = initialState, action) => {
    switch (action.type) {
        case "dashboard":
            return (state = "/");
        case "profile":
            return (state = "");
        default:
            return (state = action.type);
    }
};

export default activeNav;

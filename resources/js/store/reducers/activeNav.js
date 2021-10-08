const initialState = "/";

const activeNav = (state = initialState, action) => {
    if (action.type == "dashboard") return (state = "/");
    else if (action.type == "profile") return (state = "");
    else return (state = action.type);
};

export default activeNav;

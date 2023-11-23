export const getUserInfo = async () => {
    try {
        const response = await axios.get("/user-info");
        console.log("User roles:", response.data.roles);
    } catch (error) {
        console.error("Error fetching user roles:", error);
    }
};

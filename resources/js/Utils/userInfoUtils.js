export async function getUserInfo() {
    try {
        const response = await axios.get("/user-info");
        const roles = response.data.roles;
        // console.log("User roles:", roles);
        
        if (roles && roles.length > 0) {
            const roleName = roles[0].name;
            return roleName;
        }
    } catch (error) {
        console.error("Error fetching user roles:", error);
    }
}

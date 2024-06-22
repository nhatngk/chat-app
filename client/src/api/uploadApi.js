import privateApi from "./privateApi";

const uploadApiEndpoints = {
    upload: "upload/",
}
export const upload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    
    return await privateApi.post(
        `${uploadApiEndpoints.upload}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
}


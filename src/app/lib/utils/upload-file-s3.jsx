const UploadFileS3 = async (uploadUrl, file) => {
    const response = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
    });

    if(response.status === 200) return { ok: true };
    return { ok: false }
};


export default UploadFileS3;
const UploadFileS3 = async (uploadUrl, file) => {
    try {
        const response = await fetch(uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": file.type },
            body: file,
        });

        if(response.ok) return { ok: true };
    } catch (err) {
        console.log(err);
        return { ok: false }
    };
};


export default UploadFileS3;
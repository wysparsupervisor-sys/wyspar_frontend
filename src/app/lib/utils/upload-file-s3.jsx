const UploadFileS3 = async (uploadUrl, file) => {
    let response;
    try {
        response = await fetch(uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": file.type },
            body: file,
        });

        if(response.ok) return { ok: true };
    } catch (err) {
        console.log(err, " :", response);
        return { ok: false }
    };
};


export default UploadFileS3;
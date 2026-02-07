export function SaveToLocalStorage(key, data, ttl = 10000000){ //let  the default expiry be technically infinite
    const record = {
        data,
        expiry: Date.now() + ttl,
    };

    localStorage.setItem(key, JSON.stringify(record));
};


export function GetFromLocalStorage(key){
    const record = JSON.parse(localStorage.getItem(key));
    if(!record) return null;

    if(Date.now() > record.expiry) {
        localStorage.removeItem(key);
        return null
    };

    return record.data;
};
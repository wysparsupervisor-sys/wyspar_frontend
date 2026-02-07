export function SaveToSessionStorage(key, data, ttl = 10000000){ //let  the default expiry be technically infinite
    if (typeof window !== 'undefined'){
        const record = {
            data,
            expiry: Date.now() + ttl,
        };

        sessionStorage.setItem(key, JSON.stringify(record));
    };
};


export function GetFromSessionStorage(key){
    if(typeof window !== 'undefined') {
        const record = JSON.parse(sessionStorage.getItem(key));
        if(!record) return null;

        if(Date.now() > record.expiry) {
            sessionStorage.removeItem(key);
            return null
        };

        return record.data;
    };
};
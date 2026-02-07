import { format, formatDistanceToNow } from "date-fns";

export default function TimeAgo(date){
    const dt = typeof date === "string" ? new Date(date) : date instanceof Date ? date : new Date(date);
    const diffDays = (Date.now() - dt.getTime()) / (1000 * 60 * 60 * 24);

    if(diffDays < 7) {
        return <span>{formatDistanceToNow(dt, { addSuffix: true })}</span>
    }

    return <span>{format(dt, 'do MMMM yyyy')}</span>
};
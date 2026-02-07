import { BookOpen, CircleQuestionMark, Coffee, Flame, HeartHandshake, HelpingHand, icons, Megaphone, MessageCircle, PartyPopper, Scale } from "lucide-react";


export const POST_CATEGORIES = ["fun", "realtalk", "rant", "thought", "confession", "advice", "buzz", "question", "casual", "academic" ];

export const POST_CATEGORIES_ICONS = {
        fun: {icon: PartyPopper, color: "yellow"},
        realtalk: {icon: Scale,  color: "blue"},
        rant: {icon:  Flame, color: "orangered"},
        thought: {icon: MessageCircle, color: "white"},
        confession: {icon: HeartHandshake, color: "#ff004cff"},
        advice: {icon:  HelpingHand, color: "greenyellow"},
        buzz: {icon: Megaphone, color: "orange"},
        question: {icon: CircleQuestionMark, color: "red"},
        casual: {icon: Coffee, color: "cyan"},
        academic: {icon: BookOpen, color: "saddlebrown"},
    };
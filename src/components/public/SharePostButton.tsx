"use client"
import { LinkedinShareButton } from 'react-share';
import { Linkedin } from "lucide-react";

export const SharePostButton = ({className}:{className?: string}) => {
    return (
        <LinkedinShareButton className={className} url={window.location.href}>
        <Linkedin size={18}/>
        </LinkedinShareButton>
    )
}
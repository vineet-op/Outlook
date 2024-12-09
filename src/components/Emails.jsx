import React from 'react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

const Emails = ({ from, email, subject, preview, timestamp, onClick }) => {

    const initial = from.charAt(0).toUpperCase();

    return (
        <div className='min-w-6'>
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer border-2 m-4 border-theme-accent " onClick={onClick}>
                <CardContent className="p-4 flex items-start  gap-10">
                    <Avatar className="h-10 w-10 bg-destructive">
                        <AvatarFallback className=" bg-theme-accent text-2xl text-theme-readBg">
                            {initial}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0 flex-col gap-5">
                        <div className="flex justify-between gap-2 text-sm">
                            <div className="font-medium truncate">
                                From: {from} {'<'}{email}{'>'}
                            </div>
                        </div>
                        <div className="text-sm font-medium mt-1">
                            Subject: {subject}
                        </div>
                        <div className="text-sm text-muted-foreground truncate mt-1">
                            {preview}
                        </div>
                        <div className="text-muted-foreground whitespace-nowrap">
                            {timestamp}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Emails
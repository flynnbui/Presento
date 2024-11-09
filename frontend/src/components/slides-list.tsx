import { Context } from "@/context";
import { ReactElement, useContext, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";

export type SlideCard = {
    id: string,
}

function dataToSlide(data: SlideCard[], navigate: NavigateFunction): ReactElement[] {
    let content: ReactElement[] = data.map(c => {
        return (
            <div key={c.id}>
                <div className="aspect-video min-w-[300px] max-w-[300px] rounded-xl bg-white" />
            </div>
        )
    });
    return content;
}

export function SlideCards() {
    const navigate = useNavigate();
    const SlideData = getters.userData?.presentations || [];
    const slides = dataToSlide(SlideData, navigate);
    const { getters } = useContext(Context);
    const SlideData = getters.userData?.presentations
}
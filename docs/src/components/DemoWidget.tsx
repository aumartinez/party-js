import party from "party-js";
import React, { useState } from "react";

import styles from "./DemoWidget.module.scss";

interface DemoTemplate {
    label: string;
    method: (e: MouseEvent) => void;
}

const templates: DemoTemplate[] = [
    {
        label: "Confetti",
        method: party.confetti,
    },
    {
        label: "Sparkles",
        method: party.sparkles,
    },
];

export default function DemoWidget() {
    const [activeTemplate, setTemplate] = useState(0);

    function handleAreaClick(e: React.MouseEvent) {
        templates[activeTemplate].method(e.nativeEvent);
    }

    return (
        <div className={styles.demoWidget}>
            <div className="templateSelect">
                <ul>
                    {templates.map((template, index) => (
                        <li
                            key={index}
                            className={index === activeTemplate ? "active" : ""}
                            onClick={(e) => setTemplate(index)}
                        >
                            {template.label}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="demoArea" onClick={handleAreaClick}></div>
        </div>
    );
}

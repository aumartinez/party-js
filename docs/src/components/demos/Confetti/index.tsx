import party from "party-js";
import React, { useEffect, useRef, useState } from "react";

import { Vector } from "../../../../../lib/components";
import ConfettiCannonSVG from "../../../../static/img/confetti.svg";
import styles from "./styles.module.scss";

export default function Confetti() {
    const containerRef = useRef<HTMLDivElement>(null);

    const [mousePosition, setMousePosition] = useState<Vector>(null);
    const [cannonOrigin, setCannonOrigin] = useState<Vector>(null);
    const [cannonRotation, setCannonRotation] = useState<number>(0);

    const handleMouseDown = (event: React.MouseEvent) => {
        handleMouseMovement(event);

        if (!mousePosition || !cannonOrigin || !cannonRotation) {
            return;
        }

        const rect = containerRef.current.getBoundingClientRect();

        const domSource = new Vector(
            window.scrollX + rect.left + cannonOrigin.x,
            window.scrollY + rect.top + (rect.height - cannonOrigin.y)
        );
        const domDirection = getCannonDirection().scale(
            new party.Vector(1, -1)
        );
        const confettiOrigin = domSource.add(
            domDirection.normalized().scale(110)
        );

        const source = new party.Rect(confettiOrigin.x, confettiOrigin.y);

        party.scene.current.createEmitter({
            emitterOptions: {
                loops: 1,
                duration: 8,
                modules: [
                    new party.ModuleBuilder()
                        .drive("size")
                        .by((t) => Math.min(1, t * 3))
                        .relative()
                        .build(),
                    new party.ModuleBuilder()
                        .drive("rotation")
                        .by((t) => new Vector(140, 200, 260).scale(t))
                        .relative()
                        .build(),
                ],
            },
            emissionOptions: {
                rate: 0,
                bursts: [{ time: 0, count: party.variation.range(20, 40) }],

                sourceSampler: party.sources.dynamicSource(source),
                angle: party.variation.skew(
                    (-cannonRotation * 180) / Math.PI,
                    party.variation.evaluateVariation(
                        party.variation.range(35, 45)
                    )
                ),

                initialLifetime: party.variation.range(6, 8),
                initialSpeed: party.variation.range(300, 600),
                initialSize: party.variation.skew(1, 0.2),
                initialRotation: () =>
                    party.random.randomUnitVector().scale(180),
                initialColor: () =>
                    party.Color.fromHsl(
                        party.random.randomRange(0, 360),
                        100,
                        70
                    ),
            },
            rendererOptions: {
                shapeFactory: ["square", "circle"],
            },
        });
    };

    const handleMouseMovement = (event: React.MouseEvent) => {
        const rect = containerRef.current.getBoundingClientRect();

        setMousePosition(
            new Vector(
                event.clientX - rect.left,
                rect.height - (event.clientY - rect.top)
            )
        );

        if (mousePosition) {
            const direction = getCannonDirection();
            setCannonRotation(Math.atan2(direction.y, direction.x));
        }
    };

    function getCannonOrigin(): Vector {
        const rect = containerRef.current.getBoundingClientRect();
        return new Vector(rect.width / 2, 70);
    }
    function getCannonDirection(): Vector {
        return mousePosition.subtract(cannonOrigin);
    }

    useEffect(() => {
        setCannonOrigin(getCannonOrigin());
        window.addEventListener("resize", () =>
            setCannonOrigin(getCannonOrigin())
        );
    }, []);

    return (
        <div
            className={styles.confettiDemoContainer}
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMovement}
        >
            <ConfettiCannonSVG
                className="cannon"
                style={{
                    transform: `translateX(50%) rotate(45deg) rotate(${-cannonRotation}rad)`,
                }}
            />
        </div>
    );
}

import * as party from "party-js";
import { Source } from "party-js/dist/util";

export function confetti(source: Source): void {
    party.confetti(source, {
        size: party.variation.range(0.6, 1),
    });
}

export function sparkles(source: Source): void {
    party.sparkles(source);
}

export function hearts(source: Source): void {
    const rect = party.util.sourceToRect(source);

    if (!party.resolvableShapes.heart) {
        party.resolvableShapes.heart = `<svg viewBox="0 0 512 512" height="20" width="20"><path d="M316.722,29.761c66.852,0,121.053,54.202,121.053,121.041c0,110.478-218.893,257.212-218.893,257.212S0,266.569,0,150.801 C0,67.584,54.202,29.761,121.041,29.761c40.262,0,75.827,19.745,97.841,49.976C240.899,49.506,276.47,29.761,316.722,29.761z"/></svg>`;
    }

    const emitter = party.scene.current.createEmitter({
        emitterOptions: {
            loops: 1,
            useGravity: false,
            initialSpeed: 400,
            initialColour: party.variation.gradientSample(
                party.Gradient.simple(
                    party.Colour.fromHex("#ffa68d"),
                    party.Colour.fromHex("#fd3a84")
                )
            ),
        },
        emissionOptions: {
            rate: 0,
            bursts: [{ time: 0, count: party.variation.skew(20, 10) }],
        },
        shapeOptions: {
            angle: party.variation.range(0, 360),
            source: rect,
        },
        rendererOptions: {
            shapeFactory: "heart",
            applyLighting: undefined,
        },
    });

    const rotationModule = emitter.addModule(party.modules.RotationModifier);
    rotationModule.rotation = (p) =>
        new party.Vector(0, 0, 100).scale(p.initialLifetime - p.lifetime);

    const sizeModule = emitter.addModule(party.modules.SizeModifier);
    sizeModule.size = (p) =>
        0.5 + 0.3 * (Math.cos((p.initialLifetime - p.lifetime) * 10) + 1);
}

import { useState, useEffect, useRef } from "react";

export default function Confetti({ active = false, defeat }) {
    const [confetti, setConfetti] = useState([]);
    const containerRef = useRef(null);
    const [isFading, setIsFading] = useState(false);
    const previousActiveRef = useRef(active);

    const emojis = defeat
        ? ["💀", "☠️", "💣"]
        : ["🏆", "🏅", "🥇", "🎖️"];

    // Monitorar mudanças na prop active
    useEffect(() => {
        // Se acabou de mudar para false, inicie o esmaecimento
        if (previousActiveRef.current && !active) {
            setIsFading(true);
        }

        // Se mudou para true, reinicie a animação
        if (!previousActiveRef.current && active) {
            setConfetti([]);
            setIsFading(false);
        }

        previousActiveRef.current = active;
    }, [active]);

    useEffect(() => {
        if (!active && !isFading && confetti.length === 0) return;

        // Configuração inicial
        const containerWidth = containerRef.current?.offsetWidth || 500;
        const containerHeight = containerRef.current?.offsetHeight || 500;

        // Criar novos confetes se estiver ativo e não houver confetes
        if (active && confetti.length === 0) {
            const initialConfetti = Array.from({ length: 60 }, () => ({
                id: Math.random().toString(36).substr(2, 9),
                x: Math.random() * containerWidth,
                y: -20 - Math.random() * 100,
                size: 20 + Math.random() * 20,
                rotation: Math.random() * 360,
                emoji: emojis[Math.floor(Math.random() * emojis.length)],
                speedX: -1.5 + Math.random() * 3,
                speedY: 2 + Math.random() * 2.5,
                rotationSpeed: -1.5 + Math.random() * 3,
                opacity: 0.7 + Math.random() * 0.3,
                wobbleFrequency: 0.5 + Math.random() * 2,
                wobbleAmplitude: 0.5 + Math.random(),
                wobbleOffset: Math.random() * Math.PI * 2,
            }));

            setConfetti(initialConfetti);
        }

        // Animação
        let animationFrameId;
        let lastTime = Date.now();

        const updateConfetti = () => {
            const currentTime = Date.now();
            const deltaTime = (currentTime - lastTime) / 16; // Normalizar para ~60fps
            lastTime = currentTime;

            setConfetti((prevConfetti) => {
                return prevConfetti
                    .map((conf) => {
                        // Efeito de oscilação
                        const wobble =
                            Math.sin(
                                (currentTime / 1000) * conf.wobbleFrequency +
                                    conf.wobbleOffset
                            ) * conf.wobbleAmplitude;

                        // Movimento dos confetes com oscilação
                        const newX =
                            conf.x + (conf.speedX + wobble) * deltaTime;
                        const newY = conf.y + conf.speedY * deltaTime;
                        const newRotation =
                            conf.rotation + conf.rotationSpeed * deltaTime;

                        // Calcular nova opacidade
                        let newOpacity = conf.opacity;
                        if (isFading) {
                            // Esmaecimento rápido quando active se torna false
                            newOpacity = Math.max(
                                0,
                                conf.opacity - 0.05 * deltaTime
                            );
                        }

                        // Resetar confete quando sai da tela (só se estiver no modo ativo)
                        if (newY > containerHeight + 100 && active) {
                            return {
                                ...conf,
                                x: Math.random() * containerWidth,
                                y: -20 - Math.random() * 50,
                                rotation: Math.random() * 360,
                                opacity: 0.7 + Math.random() * 0.3,
                            };
                        }

                        return {
                            ...conf,
                            x: newX,
                            y: newY,
                            rotation: newRotation,
                            opacity: newOpacity,
                        };
                    })
                    .filter((conf) => conf.opacity > 0); // Remover confetes totalmente esmaecidos
            });

            // Continuar a animação se ainda houver confetes visíveis ou se estiver ativo
            if (active || confetti.length > 0) {
                animationFrameId = requestAnimationFrame(updateConfetti);
            } else {
                setIsFading(false);
            }
        };

        animationFrameId = requestAnimationFrame(updateConfetti);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [active, isFading, confetti.length]);

    // Reset completo da animação
    const resetAnimation = () => {
        setConfetti([]);
        setIsFading(false);
    };

    // Quando o componente desmonta, limpar tudo
    useEffect(() => {
        return () => {
            resetAnimation();
        };
    }, []);

    return (
        <div
            className="relative w-full h-full overflow-hidden"
            ref={containerRef}
        >
            {confetti.map((conf) => (
                <div
                    key={conf.id}
                    className="absolute text-2xl pointer-events-none transition-opacity duration-200 ease-out"
                    style={{
                        left: `${conf.x}px`,
                        top: `${conf.y}px`,
                        fontSize: `${conf.size}px`,
                        transform: `rotate(${conf.rotation}deg)`,
                        opacity: conf.opacity,
                    }}
                >
                    {conf.emoji}
                </div>
            ))}
        </div>
    );
}

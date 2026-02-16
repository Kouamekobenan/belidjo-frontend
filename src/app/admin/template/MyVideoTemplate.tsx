import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Series,
  Img,
  spring,
  Audio,
} from "remotion";

interface VideoProps {
  images: string[];
  prices: number[];
  shopName: string;
  audioUrl?: string;
  bpm?: number;
}

export const MyVideoTemplate: React.FC<VideoProps> = ({
  images,
  prices,
  shopName,
  audioUrl,
  bpm = 115,
}) => {
  const { durationInFrames, fps } = useVideoConfig();
  const frame = useCurrentFrame();
  // Calcul du temps d'affichage par image
  const framesPerImage = Math.floor(durationInFrames / images.length);
  const currentImageIndex = Math.min(
    Math.floor(frame / framesPerImage),
    images.length - 1,
  );
  const logo = "/images/android-chrome-512x512.png";
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      <Series>
        {images.map((img, index) => (
          <Series.Sequence key={index} durationInFrames={framesPerImage}>
            <ImageSlide src={img} index={index} />
          </Series.Sequence>
        ))}
      </Series>

      {/* 2. Musique de fond */}
      {audioUrl && <Audio src={audioUrl} volume={0.6} startFrom={0} />}
      {/* 3. Logo Noboutik Fulgurant (en haut) */}
      <LogoFulgurant logo={logo} />

      {/* 3. Overlay gradient pour meilleure lisibilité */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.8) 100%)",
          pointerEvents: "none",
        }}
      />
      {/* 4. Informations dynamiques par image */}
      <ProductInfo
        currentIndex={currentImageIndex}
        images={images}
        price={prices[currentImageIndex]}
        shopName={shopName}
        framesPerImage={framesPerImage}
      />
    </AbsoluteFill>
  );
};
// Sous-composant pour le logo fulgurant
const LogoFulgurant: React.FC<{ logo: string }> = ({ logo }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation d'entrée du logo
  const logoScale = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    config: {
      damping: 15,
      mass: 0.5,
      stiffness: 100,
    },
  });
  // Rotation continue subtile
  const rotation = interpolate(frame, [0, 300], [0, 360], {
    extrapolateRight: "wrap",
  });
  // Effet de pulsation
  const pulse = interpolate(frame % 30, [0, 15, 30], [1, 1.1, 1], {
    extrapolateRight: "wrap",
  });
  // Effet de brillance (fulgurant)
  const glowIntensity = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.5, 1]);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: 40,
          left: "50%",
          transform: `translateX(-50%) scale(${logoScale})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Halo de lumière fulgurant */}
        <div
          style={{
            position: "absolute",
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(20, 184, 166, ${glowIntensity * 0.6}) 0%, transparent 70%)`,
            filter: "blur(30px)",
            animation: "pulse 2s ease-in-out infinite",
          }}
        />

        {/* Rayons de lumière */}
        <div
          style={{
            position: "absolute",
            width: 300,
            height: 300,
            background:
              "conic-gradient(from 0deg, transparent 0%, rgba(16, 185, 129, 0.3) 10%, transparent 20%, transparent 80%, rgba(20, 184, 166, 0.3) 90%, transparent 100%)",
            borderRadius: "50%",
            transform: `rotate(${rotation}deg) scale(${pulse})`,
            filter: "blur(5px)",
          }}
        />

        {/* Logo principal */}
        <div
          style={{
            position: "relative",
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #14b8a6 0%, #10b981 100%)",
            padding: 4,
            boxShadow: `0 0 ${glowIntensity * 30}px rgba(20, 184, 166, 0.8), 
                        0 0 ${glowIntensity * 60}px rgba(16, 185, 129, 0.4),
                        inset 0 0 20px rgba(255, 255, 255, 0.3)`,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              overflow: "hidden",
              background: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Img
              src={logo}
              style={{
                width: "85%",
                height: "85%",
                objectFit: "contain",
              }}
            />
          </div>
        </div>

        {/* Particules scintillantes */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const particleDelay = i * 5;
          const particleOpacity = interpolate(
            (frame - particleDelay) % 60,
            [0, 30, 60],
            [0, 1, 0],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "wrap",
            },
          );
          const angle = i * 60 + frame * 2;
          const distance = 80;

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #14b8a6, #10b981)",
                transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(${distance}px)`,
                opacity: particleOpacity,
                boxShadow: "0 0 10px rgba(20, 184, 166, 0.8)",
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Sous-composant pour les informations produit dynamiques
const ProductInfo: React.FC<{
  currentIndex: number;
  images: string[];
  price: number;
  shopName: string;
  framesPerImage: number;
}> = ({ currentIndex, images, price, shopName, framesPerImage }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Frame locale pour l'image actuelle
  const localFrame = frame % framesPerImage;

  // Animation d'entrée pour chaque changement d'image
  const slideUp = spring({
    frame: localFrame,
    fps,
    from: 100,
    to: 0,
    config: {
      damping: 20,
      mass: 0.5,
    },
  });

  const fadeIn = spring({
    frame: localFrame,
    fps,
    from: 0,
    to: 1,
    config: {
      damping: 15,
    },
  });

  // Simuler des prix différents pour chaque image (pour la démo)
  // En production, vous devriez passer un tableau de prix
  const basePrice = price;
  // const currentPrice = basePrice + currentIndex * 500;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          bottom: 80,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          transform: `translateY(${slideUp}px)`,
          opacity: fadeIn,
        }}
      >
        {/* Nom du shop avec effet néon */}
        <div
          style={{
            position: "relative",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: 64,
              fontWeight: 900,
              margin: 0,
              background:
                "linear-gradient(135deg, #14b8a6 0%, #10b981 50%, #059669 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter:
                "drop-shadow(0 0 20px rgba(20, 184, 166, 0.6)) drop-shadow(0 4px 10px rgba(0,0,0,0.5))",
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            {shopName}
          </h2>
        </div>

        {/* Indicateur d'image */}
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
          }}
        >
          {images.map((_, index) => (
            <div
              key={index}
              style={{
                width: index === currentIndex ? 40 : 12,
                height: 12,
                borderRadius: 6,
                background:
                  index === currentIndex
                    ? "linear-gradient(90deg, #14b8a6, #10b981)"
                    : "rgba(255,255,255,0.3)",
                transition: "all 0.3s ease",
                boxShadow:
                  index === currentIndex
                    ? "0 0 15px rgba(20, 184, 166, 0.8)"
                    : "none",
              }}
            />
          ))}
        </div>
        {/* Badge de prix avec animation */}
        <div
          style={{
            position: "relative",
            display: "inline-block",
          }}
        >
          {/* Effet de brillance en arrière-plan */}
          <div
            style={{
              position: "absolute",
              inset: -8,
              background: "linear-gradient(135deg, #14b8a6, #10b981, #059669)",
              borderRadius: 60,
              filter: "blur(15px)",
              opacity: 0.6,
            }}
          />

          {/* Badge principal */}
          <div
            style={{
              position: "relative",
              background:
                "linear-gradient(135deg, #14b8a6 0%, #10b981 50%, #059669 100%)",
              padding: "20px 60px",
              borderRadius: 50,
              boxShadow:
                "0 10px 40px rgba(20, 184, 166, 0.4), inset 0 2px 10px rgba(255,255,255,0.3)",
              border: "3px solid rgba(255, 255, 255, 0.3)",
            }}
          >
            <div
              style={{
                fontSize: 72,
                fontWeight: 900,
                color: "white",
                textShadow: "0 4px 15px rgba(0,0,0,0.3)",
                letterSpacing: 1,
                display: "flex",
                alignItems: "center",
                gap: 15,
              }}
            >
              <span style={{ fontSize: 50 }}>🔥</span>
              {basePrice.toLocaleString()}
              <span style={{ fontSize: 48, fontWeight: 700 }}>FCFA</span>
            </div>
          </div>
        </div>

        {/* Call to action subtil */}
        <div
          style={{
            fontSize: 32,
            color: "rgba(255,255,255,0.9)",
            fontWeight: 600,
            textShadow: "0 2px 10px rgba(0,0,0,0.5)",
            animation: "bounce 2s ease-in-out infinite",
          }}
        >
          ✨ Produit {currentIndex + 1}/{images.length} ✨
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Sous-composant pour l'effet de chaque image
const ImageSlide: React.FC<{ src: string; index: number }> = ({
  src,
  index,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Effet Ken Burns (zoom progressif)
  const scale = interpolate(frame, [0, 200], [1, 1.15], {
    extrapolateRight: "clamp",
  });

  // Mouvement panoramique léger
  const translateX = interpolate(frame, [0, 200], [0, -50], {
    extrapolateRight: "clamp",
  });

  // Animation d'entrée
  const fadeIn = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    config: {
      damping: 20,
    },
  });

  return (
    <AbsoluteFill>
      <div
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          opacity: fadeIn,
        }}
      >
        <Img
          src={src}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${scale}) translateX(${translateX}px)`,
            filter: "brightness(0.85) contrast(1.1)",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

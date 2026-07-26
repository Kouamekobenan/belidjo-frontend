"use client";
import { useState, useRef, useCallback } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

// 10fps : bon compromis vitesse / qualité pour un slideshow
const RENDER_FPS = 10;
const FRAMES_PER_IMAGE = RENDER_FPS * 3; // 3 secondes par image
const W = 1080;
const H = 1920;

// ── helpers canvas ────────────────────────────────────────────────────────────

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => {
      // Fallback sans CORS (canvas tainted possible mais on gère l'erreur)
      const img2 = new Image();
      img2.onload = () => resolve(img2);
      img2.onerror = () => reject(new Error(`Image introuvable: ${src}`));
      img2.src = src;
    };
    img.src = src;
  });
}

function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function renderFrame(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  frame: number,
  price: number,
  shopName: string,
  imgIndex: number,
  totalImages: number,
) {
  // Fond noir
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, W, H);

  // ── Ken Burns ────────────────────────────────────────────────────────────
  const t = frame / FRAMES_PER_IMAGE;
  const zoom = 1 + 0.12 * t;
  const imgAspect = (img.naturalWidth || img.width) / (img.naturalHeight || img.height);
  const canvasAspect = W / H;

  let drawW: number, drawH: number;
  if (imgAspect > canvasAspect) {
    drawH = H * zoom;
    drawW = drawH * imgAspect;
  } else {
    drawW = W * zoom;
    drawH = drawW / imgAspect;
  }

  const offsetX = (W - drawW) / 2 - 25 * t;
  const offsetY = (H - drawH) / 2;

  ctx.drawImage(img, offsetX, offsetY, drawW, drawH);

  // ── Gradient overlay ─────────────────────────────────────────────────────
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, "rgba(0,0,0,0.45)");
  grad.addColorStop(0.28, "rgba(0,0,0,0)");
  grad.addColorStop(0.62, "rgba(0,0,0,0)");
  grad.addColorStop(1, "rgba(0,0,0,0.9)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // ── Logo / nom de boutique ───────────────────────────────────────────────
  ctx.save();
  ctx.font = "900 86px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(20,184,166,0.75)";
  ctx.shadowBlur = 45;
  ctx.fillStyle = "#14b8a6";
  ctx.fillText(shopName.toUpperCase(), W / 2, H - 400);
  ctx.restore();

  // ── Badge prix ───────────────────────────────────────────────────────────
  if (price > 0) {
    const bW = 640, bH = 128, bR = 64;
    const bX = (W - bW) / 2;
    const bY = H - 308;

    const gBadge = ctx.createLinearGradient(bX, bY, bX + bW, bY);
    gBadge.addColorStop(0, "#14b8a6");
    gBadge.addColorStop(0.5, "#10b981");
    gBadge.addColorStop(1, "#059669");

    ctx.save();
    ctx.shadowColor = "rgba(20,184,166,0.55)";
    ctx.shadowBlur = 35;
    ctx.fillStyle = gBadge;
    drawRoundRect(ctx, bX, bY, bW, bH, bR);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.font = "bold 64px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.shadowBlur = 10;
    ctx.fillText(`${price.toLocaleString("fr-FR")} FCFA`, W / 2, bY + 84);
    ctx.restore();
  }

  // ── Indicateur de progression (dots) ────────────────────────────────────
  const dotSpacing = 36;
  const startX = (W - (totalImages - 1) * dotSpacing) / 2;
  const dotsY = H - 165;

  for (let i = 0; i < totalImages; i++) {
    const cx = startX + i * dotSpacing;
    ctx.save();
    if (i === imgIndex) {
      const gDot = ctx.createLinearGradient(cx - 20, dotsY, cx + 20, dotsY);
      gDot.addColorStop(0, "#14b8a6");
      gDot.addColorStop(1, "#10b981");
      ctx.fillStyle = gDot;
      drawRoundRect(ctx, cx - 20, dotsY - 8, 40, 16, 8);
      ctx.fill();
    } else {
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.beginPath();
      ctx.arc(cx, dotsY, 8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

// ── Hook principal ────────────────────────────────────────────────────────────

export function useVideoExport() {
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const loadFFmpeg = async (): Promise<FFmpeg> => {
    if (ffmpegRef.current) return ffmpegRef.current;

    const ffmpeg = new FFmpeg();
    // Fichiers servis localement depuis /public/ffmpeg/ — zéro dépendance CDN
    await ffmpeg.load({
      coreURL: await toBlobURL("/ffmpeg/ffmpeg-core.js", "text/javascript"),
      wasmURL: await toBlobURL("/ffmpeg/ffmpeg-core.wasm", "application/wasm"),
    });
    ffmpegRef.current = ffmpeg;
    return ffmpeg;
  };

  const exportVideo = useCallback(
    async (
      images: string[],
      prices: number[],
      shopName: string,
      audioUrl?: string,
    ) => {
      if (images.length === 0) return;

      setIsExporting(true);
      setError(null);
      setVideoUrl(null);
      setProgress(0);

      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d")!;

      let frameCount = 0;

      try {
        // ── 1. Chargement du moteur ─────────────────────────────────────
        setStatus("Chargement du moteur vidéo...");
        const ffmpeg = await loadFFmpeg();
        setProgress(5);

        // ── 2. Rendu frame-by-frame ──────────────────────────────────────
        for (let i = 0; i < images.length; i++) {
          setStatus(`Rendu image ${i + 1} / ${images.length}...`);

          let img: HTMLImageElement;
          try {
            img = await loadImage(images[i]);
          } catch {
            // Image inaccessible → frame noire avec texte
            img = new Image();
            img.width = 1;
            img.height = 1;
          }

          for (let f = 0; f < FRAMES_PER_IMAGE; f++) {
            try {
              renderFrame(ctx, img, f, prices[i] ?? 0, shopName, i, images.length);
            } catch {
              ctx.fillStyle = "#0a0a0a";
              ctx.fillRect(0, 0, W, H);
            }

            const jpegBytes = await new Promise<Uint8Array>((res) => {
              canvas.toBlob(
                (blob) =>
                  blob!.arrayBuffer().then((buf) => res(new Uint8Array(buf))),
                "image/jpeg",
                0.82,
              );
            });

            await ffmpeg.writeFile(
              `frame${String(frameCount).padStart(5, "0")}.jpg`,
              jpegBytes,
            );
            frameCount++;
          }

          // Progression : 5% → 60% pendant le rendu canvas
          setProgress(5 + Math.round(((i + 1) / images.length) * 55));
        }

        // ── 3. Audio ─────────────────────────────────────────────────────
        if (audioUrl) {
          setStatus("Chargement de l'audio...");
          const fullAudioUrl = audioUrl.startsWith("/")
            ? `${window.location.origin}${audioUrl}`
            : audioUrl;
          const audioBytes = await fetchFile(fullAudioUrl);
          await ffmpeg.writeFile("audio.mpeg", audioBytes);
        }

        // ── 4. Encodage ffmpeg ────────────────────────────────────────────
        setStatus("Encodage de la vidéo...");
        setProgress(62);

        const args: string[] = [
          "-framerate", String(RENDER_FPS),
          "-i", "frame%05d.jpg",
        ];

        if (audioUrl) {
          args.push("-i", "audio.mpeg");
        }

        args.push(
          "-c:v", "libx264",
          "-pix_fmt", "yuv420p",
          "-preset", "ultrafast",
          "-crf", "24",
        );

        if (audioUrl) {
          args.push("-c:a", "aac", "-b:a", "128k", "-shortest");
        }

        args.push("output.mp4");

        await ffmpeg.exec(args);
        setProgress(90);

        // ── 5. Récupération du fichier ────────────────────────────────────
        setStatus("Finalisation...");
        const raw = await ffmpeg.readFile("output.mp4");
        // Copie dans un ArrayBuffer standard (ffmpeg peut retourner un SharedArrayBuffer)
        const blob = new Blob([new Uint8Array(raw as Uint8Array)], { type: "video/mp4" });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        setProgress(100);
        setStatus("Vidéo prête !");

        // Nettoyage du FS virtuel
        for (let i = 0; i < frameCount; i++) {
          try {
            await ffmpeg.deleteFile(
              `frame${String(i).padStart(5, "0")}.jpg`,
            );
          } catch { /* ignore */ }
        }
        if (audioUrl) {
          try { await ffmpeg.deleteFile("audio.mpeg"); } catch { /* ignore */ }
        }
        try { await ffmpeg.deleteFile("output.mp4"); } catch { /* ignore */ }

      } catch (e: unknown) {
        const message =
          e instanceof Error ? e.message : "Erreur lors de la génération";
        setError(message);
        setStatus("");
      } finally {
        setIsExporting(false);
      }
    },
    [],
  );

  const reset = useCallback(() => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoUrl(null);
    setError(null);
    setProgress(0);
    setStatus("");
  }, [videoUrl]);

  return { exportVideo, progress, status, isExporting, error, videoUrl, reset };
}

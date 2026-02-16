import { Composition } from "remotion";
import { MyVideoTemplate } from "../admin/template/MyVideoTemplate";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="MyVideoTemplate"
        // Utilise bien le signe "=" ici pour les props JSX
        component={MyVideoTemplate as React.FC<any>}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          images: [] as string[],
          price: 0,
          shopName: "Noboutik",
          audioUrl: "",
          bpm: 120,
        }}
      />
    </>
  );
};

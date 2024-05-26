import { getFavicon } from "@/lib/utils";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface FaviconProps {
  website: string;
}

const Favicon: React.FC<FaviconProps> = ({ website }) => {
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavicon = async () => {
      const favicon = await getFavicon(website);
      setFaviconUrl(favicon);
    };

    fetchFavicon();
  }, [website]);

  if (!faviconUrl) {
    return <div>hi</div>;
  }

  return (
    <div className="mt-2 mr-2">
      <Image
        src={faviconUrl}
        width={32}
        height={32}
        alt="Website favicon"
        className="rounded-full bg-gray-200 ring ring-emerald-500"
      />
    </div>
  );
};

export default Favicon;

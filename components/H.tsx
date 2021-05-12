import Router, { useRouter } from "next/router";
import { useEffect } from "react";
import { ContentTableEntry } from "./ContentTable";

export interface HProps {
  text: string;
  level: number;
  contentTableCallback?: (entry: ContentTableEntry) => void;
}

export default function H(props: HProps) {
  const CustomTag = `h${props.level}` as keyof JSX.IntrinsicElements;
  const trimmedText = props.text.replace(/\s/g, "").toLowerCase();
  const router = useRouter();
  const href = `https://avif.io${router.pathname}#${trimmedText}`;

  useEffect(() => {
    props.contentTableCallback?.({ text: props.text, href, level: props.level });
  }, []);

  function copyToClipboard(e: any) {
    navigator.clipboard.writeText(href);
    e.target.focus();
  }

  return (
    <CustomTag id={trimmedText}>
      {props.text}{" "}
      <span role="presentation" className="heading-anchor-wrapper tutorial">
        <a className="header-link" href={`#${props.text}`} onClick={copyToClipboard}>
          <span role="img" aria-label="copy" className="css-1i2mldy">
            <svg width="24" height="24" viewBox="0 0 24 24" role="presentation">
              <g fill="currentColor" fillRule="evenodd">
                <path d="M12.856 5.457l-.937.92a1.002 1.002 0 000 1.437 1.047 1.047 0 001.463 0l.984-.966c.967-.95 2.542-1.135 3.602-.288a2.54 2.54 0 01.203 3.81l-2.903 2.852a2.646 2.646 0 01-3.696 0l-1.11-1.09L9 13.57l1.108 1.089c1.822 1.788 4.802 1.788 6.622 0l2.905-2.852a4.558 4.558 0 00-.357-6.82c-1.893-1.517-4.695-1.226-6.422.47"></path>
                <path d="M11.144 19.543l.937-.92a1.002 1.002 0 000-1.437 1.047 1.047 0 00-1.462 0l-.985.966c-.967.95-2.542 1.135-3.602.288a2.54 2.54 0 01-.203-3.81l2.903-2.852a2.646 2.646 0 013.696 0l1.11 1.09L15 11.43l-1.108-1.089c-1.822-1.788-4.802-1.788-6.622 0l-2.905 2.852a4.558 4.558 0 00.357 6.82c1.893 1.517 4.695 1.226 6.422-.47"></path>
              </g>
            </svg>
          </span>
        </a>
      </span>
    </CustomTag>
  );
}

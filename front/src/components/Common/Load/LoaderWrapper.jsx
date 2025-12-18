import MatLoader from "./MatLoader.jsx";

export default function LoaderWrapper({ loading, text, children }) {
  if (loading) return <MatLoader text={text} />;
  return children;
}

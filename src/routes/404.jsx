import PageIntrouvable from "../components/PageIntrouvable";

// Page 404 : jamais indexée
export function meta() {
  return [
    { title: "Page introuvable" },
    { name: "robots", content: "noindex" },
  ];
}

export default function Page() {
  return <PageIntrouvable />;
}

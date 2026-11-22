document.documentElement.classList.add("js");

const menu = document.querySelector(".menu");
const navigation = document.querySelector("#navigation");
function toggleMenu(open) {
  navigation.classList.toggle("open", open);
  menu.setAttribute("aria-expanded", String(open));
}
menu.addEventListener("click", () => toggleMenu(menu.getAttribute("aria-expanded") === "false"));
navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) toggleMenu(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menu.getAttribute("aria-expanded") === "true") {
    toggleMenu(false);
    menu.focus();
  }
});

if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const reveal = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.animate([{ opacity: 0.5, transform: "translateY(14px)" }, { opacity: 1, transform: "translateY(0)" }],
        { duration: 450, easing: "ease-out" });
      reveal.unobserve(entry.target);
    }
  }, { threshold: 0.12 });
  document.querySelectorAll("[data-reveal]").forEach((section) => reveal.observe(section));
}

const projects = [
  { type: "image", src: "cuisine-ouverte.webp", title: "Cuisine ouverte et îlot", caption: "Vue d’ensemble de l’agencement, avec un îlot aux façades en bois et un plafond lambrissé." },
  { type: "image", src: "cuisine-en-l.webp", title: "Cuisine en L", caption: "Façades hautes en bois, meubles bas foncés et colonne intégrant les appareils de cuisson." },
  { type: "image", src: "rangements-bois.webp", title: "Rangements toute hauteur", caption: "Portes et tiroirs intégrés dans un ensemble de façades en bois." },
  { type: "image", src: "meuble-vasques.webp", title: "Meuble à deux vasques", caption: "Meuble de salle de bains à façades en bois, surmonté de deux vasques foncées." },
  { type: "image", src: "chambre-bois.webp", title: "Agencement d’une chambre", caption: "Habillage en bois autour du lit, avec panneaux à lames et éclairage intégré en partie haute." },
  { type: "image", src: "salon-sous-pente.webp", title: "Habillage sous pente", caption: "Plafond en bois dans un salon sous combles, autour du conduit d’un poêle suspendu." },
  { type: "video", src: "habillage-couloir.mp4", poster: "habillage-couloir.webp", title: "Habillage bois d’un couloir", caption: "Vue en mouvement du plafond, des retours en bois et des raccords autour des baies vitrées." }
];
const mediaDirectory = "assets/chantiers/";
const gallery = document.querySelector("#gallery");
const dialog = document.querySelector("#media-dialog");
gallery.hidden = false;
for (const project of projects) {
  const tile = document.createElement("button");
  tile.type = "button";
  if (project.type === "image" || project.poster) {
    const thumbnail = document.createElement("img");
    thumbnail.src = mediaDirectory + (project.poster || project.src);
    thumbnail.alt = "";
    thumbnail.loading = "lazy";
    tile.append(thumbnail);
  }
  tile.append(project.title + (project.type === "video" ? " · Vidéo" : ""));
  tile.addEventListener("click", () => {
    const media = document.createElement(project.type === "video" ? "video" : "img");
    media.src = mediaDirectory + project.src;
    if (media instanceof HTMLVideoElement) {
      media.controls = true;
      media.playsInline = true;
      media.poster = mediaDirectory + project.poster;
    } else {
      media.alt = project.title;
    }
    document.querySelector("#media-title").textContent = project.title;
    document.querySelector("#media-caption").textContent = project.caption;
    document.querySelector("#media-view").replaceChildren(media);
    dialog.showModal();
  });
  gallery.append(tile);
}
dialog.addEventListener("close", () => document.querySelector("#media-view").replaceChildren());

document.querySelector("#brief").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const fields = [
    "Impact Intelligent — Fiche chantier",
    "Lot à poser : " + data.get("project").trim(),
    "Commune : " + data.get("location").trim(),
    "Créneau souhaité : " + (data.get("timing").trim() || "À définir")
  ];
  const url = URL.createObjectURL(new Blob([fields.join("\r\n")], { type: "text/plain;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "impact-intelligent-fiche-chantier.txt";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  document.querySelector("#brief-status").textContent = "Le téléchargement du récapitulatif a été lancé.";
});

const portraits = [
  ["01", "Soviet Nostalgic Grandpa", "exec-70dd8dcb-50d2-4493-b536-e3400b51ba2c.png"],
  ["02", "Apartment Communist", "exec-874bfe36-d077-4884-8c17-bf0f293bfbbf.png"],
  ["03", "Silovik Patriot", "exec-587ce22d-e8bd-4969-bdd0-5a35dc25d575.png"],
  ["04", "State TV Uncle", "exec-b1d6abc8-24b9-409b-a3ff-34468e3423e2.png"],
  ["05", "Telegram Z-Blogger", "exec-e5f413a9-a819-4eb4-ae62-88740f1992d5.png"],
  ["06", "VK Nationalist", "exec-d37f59ae-9f50-4ab8-8e70-0df62173e1b1.png"],
  ["07", "Oil Shift Worker", "exec-1be00b9c-1cc4-4c75-b6d7-8914fd9dc65d.png"],
  ["08", "Kuzbass Miner", "exec-4728b8ce-a1c1-4756-87db-d1eda0cf351a.png"],
  ["09", "History Teacher Patriot", "exec-a9686167-a5b4-4e1e-be8f-85f4b3313c3c.png"],
  ["10", "Provincial Mayor", "exec-548dcff8-8dad-44ab-a5e8-05f03862d9b1.png"],
  ["11", "Orthodox Babushka", "exec-99ea5ca0-4506-422e-bc0b-c7b13dba91bd.png"],
  ["12", "Siberian Hunter", "exec-0335b889-27e5-411e-bf3f-381915eb0e18.png"],
  ["13", "Tatar Pragmatist", "exec-14d616b2-a254-4fae-a9c0-3a23df7fda89.png"],
  ["14", "Lada Mechanic", "exec-a4180699-ffb5-4b54-8084-10682da7b261.png"],
  ["15", "Chess Boomer", "exec-9d21cdfc-8ee2-4219-b86b-7d3bbe5776aa.png"],
  ["16", "Dacha Dad", "exec-ebce86da-1e4b-4630-94cf-01d4fe5f5471.png"],
  ["17", "Figure Skating Mom", "exec-37cb7989-3027-4add-86fd-6ea89ab67aea.png"],
  ["18", "Caucasus Tough Guy", "exec-ac8833e9-e667-41af-9ee7-b530142afec3.png"],
  ["19", "Platzkart Philosopher", "exec-3d084a6a-6eab-427e-8a35-3125991580a9.png"],
  ["20", "Doomscrolling Student", "exec-d9299c89-d189-46a8-91b1-bbb4f0fc3f4b.png"],
  ["21", "St. Petersburg Intellectual", "exec-2da78a29-000b-4e5b-b682-639ef9d64cc7.png"],
  ["22", "Apathetic Office Guy", "exec-4cff1a47-718b-4833-aec6-34f5e5e470bc.png"],
  ["23", "Moscow Influencer", "exec-146bc545-faa3-4c85-9427-b6653e89c375.png"],
  ["24", "Black Sea Hustler", "exec-9c384315-dfd2-4a8b-ac21-9d38d537a0c3.png"],
  ["25", "Cosmonaut Dreamer", "exec-eb2735ce-4117-4a96-8af4-3fd01b67d55e.png"],
  ["26", "Muscovite Liberal", "exec-38f64426-572c-4a5e-ae3e-c42bda94666c.png"],
  ["27", "IT Relocant", "exec-81736fec-78be-48b3-8be3-5f46123de8dd.png"],
  ["28", "Yekaterinburg Rapper", "exec-0a8d776b-2788-4c35-b34a-d7bbefce9a57.png"],
  ["29", "Oligarch in Exile", "exec-50618829-73fa-40b2-a05a-f1373b21be4d.png"],
  ["30", "Banya Mystic", "exec-cfbbfa0a-1bcd-4b2d-bc51-35418bde7801.png"]
].map(([number, label, file]) => ({ number, label, file, id: number }));

const grid = document.querySelector("#grid");
const status = document.querySelector("#status");
const initialOrder = portraits.map((portrait) => portrait.id);
let order = [...initialOrder];
let selectedId = null;
let activeTile = null;

function getPortrait(id) {
  return portraits.find((portrait) => portrait.id === id);
}

function announce(message) {
  status.textContent = message;
}

function swapIds(firstId, secondId) {
  const firstIndex = order.indexOf(firstId);
  const secondIndex = order.indexOf(secondId);
  if (firstIndex < 0 || secondIndex < 0 || firstIndex === secondIndex) return;
  [order[firstIndex], order[secondIndex]] = [order[secondIndex], order[firstIndex]];
  render();
}

function clearTileStates() {
  grid.querySelectorAll(".tile").forEach((tile) => tile.classList.remove("is-over", "is-dragging"));
}

function finishPointerDrag(event) {
  if (!activeTile) return;
  const target = document.elementFromPoint(event.clientX, event.clientY)?.closest(".tile");
  const sourceId = activeTile.dataset.id;
  const targetId = target?.dataset.id;
  activeTile.releasePointerCapture?.(event.pointerId);
  if (targetId && targetId !== sourceId) {
    swapIds(sourceId, targetId);
    announce(`Swapped ${getPortrait(sourceId).label} and ${getPortrait(targetId).label}.`);
  }
  activeTile = null;
  clearTileStates();
}

function startPointerDrag(event) {
  if (event.button !== undefined && event.button !== 0) return;
  activeTile = event.currentTarget;
  activeTile.classList.add("is-dragging");
  activeTile.setPointerCapture?.(event.pointerId);
  announce(`Dragging ${getPortrait(activeTile.dataset.id).label}.`);
}

function movePointerDrag(event) {
  if (!activeTile) return;
  clearTileStates();
  activeTile.classList.add("is-dragging");
  const target = document.elementFromPoint(event.clientX, event.clientY)?.closest(".tile");
  if (target && target !== activeTile) target.classList.add("is-over");
}

function handleTileKeydown(event) {
  const tile = event.currentTarget;
  const id = tile.dataset.id;
  const index = order.indexOf(id);
  const columns = window.matchMedia("(max-width: 820px)").matches ? (window.matchMedia("(max-width: 470px)").matches ? 2 : 3) : (window.matchMedia("(max-width: 1160px)").matches ? 5 : 6);
  let targetIndex = index;

  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    if (!selectedId) {
      selectedId = id;
      tile.classList.add("is-selected");
      announce(`${getPortrait(id).label} selected. Choose another tile to swap.`);
    } else if (selectedId === id) {
      selectedId = null;
      tile.classList.remove("is-selected");
      announce("Selection cleared.");
    } else {
      const other = selectedId;
      selectedId = null;
      swapIds(other, id);
      announce(`Swapped ${getPortrait(other).label} and ${getPortrait(id).label}.`);
    }
    return;
  }

  if (event.key === "ArrowLeft") targetIndex = index - 1;
  if (event.key === "ArrowRight") targetIndex = index + 1;
  if (event.key === "ArrowUp") targetIndex = index - columns;
  if (event.key === "ArrowDown") targetIndex = index + columns;
  if (targetIndex !== index && targetIndex >= 0 && targetIndex < order.length) {
    event.preventDefault();
    const targetId = order[targetIndex];
    swapIds(id, targetId);
    requestAnimationFrame(() => grid.querySelector(`[data-id="${id}"]`)?.focus());
    announce(`Moved ${getPortrait(id).label}.`);
  }
}

function render() {
  grid.replaceChildren();
  order.forEach((id) => {
    const portrait = getPortrait(id);
    const tile = document.createElement("article");
    tile.className = "tile";
    tile.dataset.id = portrait.id;
    tile.tabIndex = 0;
    tile.setAttribute("role", "button");
    tile.setAttribute("aria-label", `${portrait.number} — ${portrait.label}`);
    tile.addEventListener("pointerdown", startPointerDrag);
    tile.addEventListener("pointermove", movePointerDrag);
    tile.addEventListener("pointerup", finishPointerDrag);
    tile.addEventListener("pointercancel", (event) => {
      activeTile?.releasePointerCapture?.(event.pointerId);
      activeTile = null;
      clearTileStates();
    });
    tile.addEventListener("keydown", handleTileKeydown);

    const image = document.createElement("img");
    image.src = `images/${portrait.file}`;
    image.alt = `${portrait.number} — ${portrait.label}`;
    image.loading = "lazy";
    image.draggable = false;
    tile.append(image);
    grid.append(tile);
  });
}

document.querySelector("#shuffleButton").addEventListener("click", () => {
  for (let index = order.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [order[index], order[randomIndex]] = [order[randomIndex], order[index]];
  }
  selectedId = null;
  render();
  announce("Lookbook shuffled.");
});

document.querySelector("#resetButton").addEventListener("click", () => {
  order = [...initialOrder];
  selectedId = null;
  render();
  announce("Original order restored.");
});

render();

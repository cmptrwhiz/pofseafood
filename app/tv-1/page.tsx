import { DisplayPlayer, type DisplayPlaylist } from "@/components/display/DisplayPlayer";

const tvOnePlaylist: DisplayPlaylist = {
  updatedLabel: "TV 1 menu rotation",
  items: [
    {
      id: "menu-board",
      title: "Core Menu",
      type: "menu-board-one",
      durationSeconds: 210,
    },
    {
      id: "menu-board-2",
      title: "Full Menu",
      type: "menu-board-two",
      durationSeconds: 210,
    },
    {
      id: "menu-board-4",
      title: "Lunch, Dinner & Fish",
      type: "menu-board-four",
      durationSeconds: 210,
    },
    {
      id: "menu-board-5",
      title: "Best Sellers",
      type: "menu-board-five",
      durationSeconds: 210,
    },
  ],
};

export default function TvOnePage() {
  return (
    <div className="tv-one-display">
      <DisplayPlayer playlist={tvOnePlaylist} />
    </div>
  );
}

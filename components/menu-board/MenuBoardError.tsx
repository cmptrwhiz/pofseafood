export function MenuBoardError({ message }: { message: string }) {
  return (
    <div className="menu-board-error" role="status">
      <strong>Plenty of Fish Seafood</strong>
      <span>{message}</span>
    </div>
  );
}

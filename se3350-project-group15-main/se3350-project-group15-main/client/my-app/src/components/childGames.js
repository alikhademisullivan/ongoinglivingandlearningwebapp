import React, { useState } from 'react';
import '../styles/childGames.css';

const games = [
  { id: 1, url: "https://freehtml5games.org/games/fishing-frenzy/index.html", width: "800", height: "600" },
  { id: 2, url: "https://freehtml5games.org/games/smiles/index.html", width: "800", height: "600" },
  { id: 3, url: "https://freehtml5games.org/games/brick-out/index.html", width: "800", height: "600" },
];

const ChildGames = () => {
  const [activeGameId, setActiveGameId] = useState(games[0].id);

  const switchGame = (id) => {
    setActiveGameId(id);
  };

  const activeGame = games.find(game => game.id === activeGameId);

  return (
    <div>
      <h2 className='title'>Games</h2>
      <ul className="game-tabs">
        {games.map((game) => (
          <li
            key={game.id}
            className={`game-tab ${game.id === activeGameId ? 'active' : ''}`}
            onClick={() => switchGame(game.id)}
          >
            Game {game.id}
          </li>
        ))}
      </ul>
      <div className="game-container">
        {activeGame && (
          <iframe
            src={activeGame.url}
            width={activeGame.width}
            height={activeGame.height}
            frameBorder="0"
            scrolling="no"
            key={activeGame.id}
          ></iframe>
        )}
      </div>
    </div>
  );
};

export default ChildGames;


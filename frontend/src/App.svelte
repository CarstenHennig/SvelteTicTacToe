<script>
  import { onMount, afterUpdate } from "svelte";
  import { writable } from "svelte/store";

  let board = ["", "", "", "", "", "", "", "", ""];
  let currentPlayer = "X";
  let winner = null;
  let draw = false;

  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  function handleCellClick(index) {
    if (board[index] || winner || draw) return;

    board[index] = currentPlayer;
    currentPlayer = currentPlayer === "X" ? "O" : "X";

    winner = checkWinner();
    draw = checkDraw();
  }

  function checkWinner() {
    for (let i = 0; i < winningCombos.length; i++) {
      const [a, b, c] = winningCombos[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  }

  function checkDraw() {
    return board.filter((cell) => cell === "").length === 0;
  }

  function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    winner = null;
    draw = false;
  }

  async function saveMatchResult() {
    const response = await fetch("/api/match", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        result: winner || "draw",
      }),
    });

    if (response.ok) {
      console.log("Match result saved successfully");
    } else {
      console.error("Failed to save match result");
    }
  }

  let matchResults = writable([]);

  async function restoreMatchResults() {
    const response = await fetch("/api/matches");

    if (response.ok) {
      const results = await response.json();
      matchResults.set(results);
    } else {
      console.error("Failed to retrieve match results");
    }
  }

  onMount(restoreMatchResults);
  afterUpdate(() => {
    if (winner || draw) {
      matchResults.update((prevResults) => {
        const result = {
          result: winner ? "Winner" : "Draw",
          winner: winner || "",
        };
        return [result, ...prevResults.slice(0, 4)];
      });
    }
  });
</script>

<main class="dashboard">
  <div class="header">
    <!-- <div class="image">
      <img src="./gp-joule.png" alt="GP Joule" />
    </div> -->
    <h1>Let's play TicTacToe 2gether</h1>
  </div>
  <div class="gamegrid">
    <div class="grid">
      {#each board as cell, index}
        <div class="cell" on:click={() => handleCellClick(index)}>{cell}</div>
      {/each}
    </div>
  </div>

  <div class="resultgrid">
    {#if winner}
      <p>Winner: {winner}</p>
      <button class="buttonRestart" on:click={resetGame}>Restart</button>
    {:else if draw}
      <p>It's a draw!</p>
      <button class="buttonRestart" on:click={resetGame}>Restart</button>
    {/if}

    <!-- <button on:click={saveMatchResult}>Save Match Result</button> -->

    <h2>Latest Match Results:</h2>
    {#each $matchResults as result, index}
      <p key={index}>{result.result} - {result.winner}</p>
    {/each}
  </div>
</main>

<style>
  .dashboard {
    background-color: yellow !important;
    font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
      "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
  }

  .header {
    display: grid;
    justify-items: center;
    align-items: center;
  }

  .gamegrid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    grid-gap: 10px;
    justify-items: center;
    align-items: center;
  }

  .resultgrid {
    display: grid;
    justify-items: center;
    align-items: center;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 5px;
  }

  .cell {
    width: 100px;
    height: 100px;
    border: 2px solid #000;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    font-style: bold;
    cursor: pointer;
  }

  .buttonRestart {
    background-color: yellow;
  }
</style>

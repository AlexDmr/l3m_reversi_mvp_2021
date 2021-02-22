import { tap } from "rxjs/operators";
import { IA } from "./IA";
import { ReversiModel } from "./ReversiModel";
import { ReversiPresenter } from "./ReversiPresenter";


const view = `
<pre>
  Player 1 as IA <input type="checkbox" />
  Player 2 as IA <input type="checkbox" />

  Player 1 (black): <label></label>
  Player 2 (white): <label></label>

  <label class="winner"></label>
  <button>Restart</button>
</pre>
<div class="reversiBoard"></div>
`;

export class GamePresenter {

    constructor(private root: HTMLElement) {
        root.innerHTML = view;

        const rootReversiBoard = root.querySelector(".reversiBoard") as HTMLDivElement;
        const [inputIA1, inputIA2] = document.body.querySelectorAll("input");
        const [labP1, labP2, labWin] = document.body.querySelectorAll("label");
        const btRestart = root.querySelector("button") as HTMLButtonElement;

        // Create models:
        const m = new ReversiModel();
        const ia1 = new IA('Player1', m);
        const ia2 = new IA('Player2', m);

        // Create sub-component Reversi
        const reversiPresenter = new ReversiPresenter(rootReversiBoard, m);

        // MODELS => HTML
        ia1.activatedObs.subscribe( a => inputIA1.checked = a );
        ia2.activatedObs.subscribe( a => inputIA2.checked = a );
        m.gameStateObs.subscribe( ({board}) => {
            const scoreP1 = board.reduce( (nb, L) => nb + L.reduce( (n, c) => c === "Player1" ? n + 1 : n, 0), 0);
            const scoreP2 = board.reduce( (nb, L) => nb + L.reduce( (n, c) => c === "Player2" ? n + 1 : n, 0), 0);
            labP1.textContent = scoreP1.toString();
            labP2.textContent = scoreP2.toString();
        });
        m.winnerObs.subscribe( w => labWin.textContent = !w ? '' : `and the winner is ${w}`);

        // HTML -> MODELS
        inputIA1.onchange = () => ia1.activate(inputIA1.checked);
        inputIA2.onchange = () => ia2.activate(inputIA2.checked);
        btRestart.onclick = () => m.initBoard();
    }
}
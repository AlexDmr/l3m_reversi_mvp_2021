import { BehaviorSubject, combineLatest, Subscription } from "rxjs";
import { filter } from "rxjs/operators";
import { ReversiModelInterface, TileCoords, Turn } from "./ReversiDefinitions";


export class IA {
    private player: Turn = 'Player2';
    private game: ReversiModelInterface;
    private subscription: Subscription;
    private activateSubj = new BehaviorSubject<boolean>( false );
    activatedObs = this.activateSubj.asObservable();

    constructor(player: Turn, game: ReversiModelInterface) {
        this.config(player, game);
    }
    
    activate(a: boolean): this {
        this.activateSubj.next(a);
        return this;
    }

    isActivated(): boolean {
        return this.activateSubj.value;
    }

    config(player: Turn, game: ReversiModelInterface): this {
        this.player = player;
        this.game   = game;
        this.subscription?.unsubscribe(); // Unsubscribe if subscription already exist
        this.subscription = combineLatest([game.gameStateObs, this.activateSubj]).pipe(
            filter( ([{turn}, a]) => a && turn === this.player )
            ).subscribe( () => {
                let max = 0;
                let coords: TileCoords[] = [];
                for(let i=0; i<8; i++) {
                    for(let j=0; j<8; j++) {
                        const nb = game.PionsTakenIfPlayAt(i, j).length;
                        if (nb > max) {
                            coords = [ [i, j] ];
                            max = nb;
                        } else if (nb === max) {
                            coords.push([i, j]);
                        }
                    }
                }
                if (coords.length > 0) {
                    const c = coords[ Math.floor(Math.random() * coords.length) ];
                    setTimeout( () => game.play( ...c ), 250); // Wait 250ms to play
                }
            }
        );
        return this;
    }


}
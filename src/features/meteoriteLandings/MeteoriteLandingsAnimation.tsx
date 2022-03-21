import React from "react";
import styled from "styled-components";
import {iMeteoriteLandingsDisplayProps} from "./MeteoriteLandingsDisplay";
import { useEffect, useRef} from "react";
import { random } from "../../util/MathUtils.js";

class Meteorite {
    private color: string;
    x: number;
    y: number;
    private velX: number;
    private velY: number;
    size: number;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;


    constructor(x: number, y: number, velX: number, velY: number, color: string, size: number, canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        const context = canvas.getContext('2d');
        if(!context){
            throw new Error();
        }
        this.ctx = context;
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
        this.color = color;
        this.size = size;
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.fillStyle = this.color;
        this.ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    updatePosition() {
        if ((this.x + this.size) >= this.canvas.width) {
            this.velX = -(this.velX);
        }

        if ((this.x - this.size) <= 0) {
            this.velX = -(this.velX);
        }

        if ((this.y + this.size) >= this.canvas.height) {
            this.velY = -(this.velY);
        }

        if ((this.y - this.size) <= 0) {
            this.velY = -(this.velY);
        }

        this.x += this.velX;
        this.y += this.velY;
    }
}



const MeteoriteLandingsCanvas = styled.canvas`
  width: 100%;
  height: 100%;
`

// im not so good with animations, but im starting to play with canvas now, and there was a tutorial with a similar animation and it was so cool I add to here.
const MeteoriteLandingsAnimation: React.FC<iMeteoriteLandingsDisplayProps> = ({meteoriteLandings, hasMore, loadMeteoriteLandings}) => {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const meteoritesRefContainer = useRef<Meteorite[]>([]);

    useEffect(() => {
        if(hasMore && meteoriteLandings.length === 0) {
            loadMeteoriteLandings();
        }
    }, [hasMore, loadMeteoriteLandings, meteoriteLandings])

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }
        const ctx = canvasRef.current.getContext('2d');
        const width = canvasRef.current.width;
        const height = canvasRef.current.height;

        function loop() {
            if (!ctx){
                return;
            }

            ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
            ctx.fillRect(0, 0,  width, height);

            for (const meteorite of meteoritesRefContainer.current) {
                meteorite.draw();
                meteorite.updatePosition();
            }
            requestAnimationFrame(loop);
        }

        loop();
    }, [])

    useEffect(() => {
        const canvasElement = canvasRef.current;
        const context2D = canvasElement?.getContext('2d');
        if (!canvasElement || !context2D) {
            return;
        }
        context2D.fillStyle = 'rgba(0, 0, 0, 1)';

        const width = canvasElement.width;
        const height = canvasElement.height;
        function randomRGB() {
            return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
        }

        meteoritesRefContainer.current = meteoriteLandings.map((meteoriteLanding) => {
            const size = parseInt(meteoriteLanding.mass) * 0.00001;
            return new Meteorite(
                random(size,width - size),
                random(size,height - size),
                random(-7,7),
                random(-7,7),
                randomRGB(),
                size,
                canvasElement
            );
        });
    }, [meteoriteLandings])



    return (
            <MeteoriteLandingsCanvas ref={canvasRef}/>
    );
}


export default MeteoriteLandingsAnimation;
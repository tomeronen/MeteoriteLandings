import React from "react";
import styled from "styled-components";
import {iMeteoriteLandingsDisplayProps} from "./MeteoriteLandingsDisplay";
import { useEffect, useRef} from "react";
import { random } from "../../util/MathUtils.js";

class Meteorite {
    private color: any;
    x: any;
    y: any;
    private velX: any;
    private velY: any;
    size: any;
    private canvas: any;
    private ctx: any;


    constructor(x: any, y: any, velX: any, velY: any, color: string, size: any, canvas: any) {
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
        this.color = color;
        this.size = size;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
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
        // @ts-ignore
        const width = canvasRef.current.width;
        // @ts-ignore
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
        if (!canvasRef.current) {
            return;
        }

        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
            ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        }

        // @ts-ignore
        const width = canvasRef.current.width;
        // @ts-ignore
        const height = canvasRef.current.height;
        function randomRGB() {
            return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
        }

        meteoritesRefContainer.current = meteoriteLandings.map((meteoriteLanding) => {
            const size = parseInt(meteoriteLanding.mass) * 0.00001;
            return new Meteorite(
                random(0 + size,width - size),
                random(0 + size,height - size),
                random(-7,7),
                random(-7,7),
                randomRGB(),
                size,
                canvasRef.current
            );
        });
    }, [meteoriteLandings])



    return (
            <MeteoriteLandingsCanvas ref={canvasRef}/>
    );
}


export default MeteoriteLandingsAnimation;
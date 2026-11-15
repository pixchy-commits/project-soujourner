// Procedural sand terrain. Skipped when an assets.background image is provided.
export function mulberry(a: number): () => number{ return ()=>{ a|=0; a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }

export function drawTerrain(cv: HTMLCanvasElement, dpr: number, _M: number, L: { rows: number; cols: number; seed: number }) {
  const ctx=cv.getContext('2d',{willReadFrequently:true}) as CanvasRenderingContext2D, w=cv.width/dpr, h=cv.height/dpr, rnd=mulberry(L.seed*7919);
  ctx.setTransform(dpr,0,0,dpr,0,0);
  const g=ctx.createLinearGradient(0,0,w*.3,h); g.addColorStop(0,'#eeb476'); g.addColorStop(.55,'#d9894d'); g.addColorStop(1,'#b96137');
  ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
  // soft elevation blotches
  for(let i=0;i<46;i++){ const x=rnd()*w,y=rnd()*h,r=30+rnd()*150, light=rnd()<.5;
    const rg=ctx.createRadialGradient(x,y,0,x,y,r); rg.addColorStop(0,light?'rgba(255,225,168,.28)':'rgba(118,57,27,.19)'); rg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=rg; ctx.fillRect(x-r,y-r,2*r,2*r); }
  // wind ripples / dune ridges
  ctx.lineCap='round';
  for(let i=0;i<22;i++){ const x=rnd()*w,y=rnd()*h,len=60+rnd()*160,a=-.35+rnd()*.25;
    ctx.beginPath(); ctx.moveTo(x,y); ctx.quadraticCurveTo(x+len/2,y+len*a-12,x+len,y+len*a);
    ctx.strokeStyle='rgba(255,233,179,.28)'; ctx.lineWidth=2+rnd()*3; ctx.stroke();
    ctx.translate(0,3); ctx.strokeStyle='rgba(100,45,19,.17)'; ctx.lineWidth=1.5; ctx.stroke(); ctx.translate(0,-3); }
  // grain
  const img=ctx.getImageData(0,0,cv.width,cv.height), d=img.data;
  for(let i=0;i<d.length;i+=4){ const n=(rnd()-.5)*32; d[i]+=n; d[i+1]+=n*.8; d[i+2]+=n*.6; }
  ctx.putImageData(img,0,0);
  // decorative pebbles (tiny, never block)
  for(let i=0;i<(L.rows*L.cols*5);i++){ const x=rnd()*w,y=rnd()*h,r=1+rnd()*2.6;
    ctx.fillStyle='rgba(60,20,8,.35)'; ctx.beginPath(); ctx.ellipse(x+1.2,y+1.2,r,r*.7,0,0,7); ctx.fill();
    ctx.fillStyle=rnd()<.5?'#7a3a22':'#8f4a2c'; ctx.beginPath(); ctx.ellipse(x,y,r,r*.75,rnd()*3,0,7); ctx.fill();
    ctx.fillStyle='rgba(255,210,170,.35)'; ctx.beginPath(); ctx.arc(x-r*.3,y-r*.3,r*.35,0,7); ctx.fill(); }
  // vignette
  const vg=ctx.createRadialGradient(w/2,h/2,Math.min(w,h)*.35,w/2,h/2,Math.max(w,h)*.75);
  vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(50,14,4,.45)'); ctx.fillStyle=vg; ctx.fillRect(0,0,w,h);
}

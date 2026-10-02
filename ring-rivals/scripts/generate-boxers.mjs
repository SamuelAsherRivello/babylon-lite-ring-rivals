import { writeFile } from "node:fs/promises";
import { deflateSync } from "node:zlib";

const cellW=64,cellH=128,columns=11,rows=12,width=cellW*columns,height=cellH*rows,rgba=new Uint8Array(width*height*4);
const C={ink:[30,34,47,255],skin:[190,132,94,255],lit:[239,193,139,255],shade:[127,75,63,255],red:[173,53,43,255],red2:[202,73,51,255],blue:[23,103,125,255],blue2:[33,140,151,255],gold:[240,200,74,255],gold2:[255,223,93,255],orange:[215,91,54,255],dark:[103,49,50,255],white:[255,241,206,255],eye:[25,34,51,255],shadow:[17,24,39,150]};
let ox=0,oy=0,shiftX=0,shiftY=0;
function put(x,y,c){x=Math.round(x+ox+shiftX);y=Math.round(y+oy+shiftY);if(x>=0&&y>=0&&x<width&&y<height)rgba.set(C[c],(y*width+x)*4);}
function box(x,y,w,h,c){for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)put(xx,yy,c);}
function oval(cx,cy,rx,ry,c){for(let y=-ry;y<=ry;y++)for(let x=-rx;x<=rx;x++)if(x*x/(rx*rx)+y*y/(ry*ry)<=1)put(cx+x,cy+y,c);}
const actions=['idle','attack-jab-head','attack-cross-head','attack-jab-body','attack-cross-body','guard-high','guard-low','dodge-left','dodge-right','hit-block','hit-stun'];
function drawBoxer(style,front,action,phase){
 const flash=style===1,top=flash?'blue':'red',light=flash?'blue2':'red2',shorts=flash?'dark':'orange',belt=flash?'gold2':'gold';
 shiftX=(action.startsWith('dodge-')?(action.endsWith('left')?-1:1)*[0,4,1][phase]:action.startsWith('attack-')?[0,4,0][phase]:action.startsWith('hit-')?[-2,2,0][phase]:0);
 shiftY=(action==='guard-low'||action.startsWith('attack-')&&action.endsWith('-body')?[0,5,1][phase]:action.startsWith('hit-')?[0,2,0][phase]:action==='idle'?[0,-1,1][phase]:0);
 oval(32,122,24,4,'shadow');box(18,93,12,27,shorts);box(34,93,12,27,shorts);box(16,86,16,9,belt);box(33,86,16,9,belt);
 box(13,53,38,39,top);box(9,43,46,24,light);box(1,42,15,22,'lit');box(48,42,15,22,'lit');box(1,57,13,7,'shade');box(50,57,13,7,'shade');
 box(16,25,32,35,'skin');box(12,17,40,18,'ink');box(12,28,6,17,'ink');box(46,28,6,17,'ink');box(0,35,12,7,belt);box(52,35,12,7,belt);
 box(0,42,12,11,top);box(52,42,12,11,top);box(15,56,7,24,light);box(42,56,7,24,top);
 if(front){box(14,48,36,12,belt);box(26,49,12,11,top);box(18,36,10,6,'white');box(36,36,10,6,'white');box(21,38,6,4,'eye');box(37,38,6,4,'eye');box(23,48,18,4,'shade');box(28,44,8,2,'lit');}
 else {box(8,43,48,8,'ink');box(22,58,20,5,'shade');box(21,68,22,6,light);box(23,75,18,4,top);}
 box(14,89,18,3,belt);box(33,89,18,3,belt);
 if(action.startsWith('attack-')){const body=action.endsWith('-body'),cross=action.includes('-cross-');const handXs=cross?[36,48,43]:[39,52,45],headYs=[51,37,44],bodyYs=[76,68,72],handX=handXs[phase],handY=(body?bodyYs:headYs)[phase];box(handX-8,handY-3,15,10,light);box(handX-5,handY-5,10,4,belt);box(cross?5:44,body?67:49,12,13,top);}
 else if(action==='guard-high'){box(7,29,15,18,top);box(8,27,13,9,belt);box(42,29,15,18,top);box(43,27,13,9,belt);}
 else if(action==='guard-low'){box(6,64,17,13,top);box(8,62,13,8,belt);box(42,64,17,13,top);box(43,62,13,8,belt);}
 else if(action.startsWith('dodge-')){box(action.endsWith('left')?0:50,35,13,18,top);box(action.endsWith('left')?2:51,33,11,9,belt);}
 else if(action==='hit-block'){box(8,31,16,15,top);box(41,31,16,15,top);}
 else if(action==='hit-stun'){box(9,49,12,15,top);box(43,49,12,15,top);}
 shiftX=0;shiftY=0;
}
for(let boxer=0;boxer<2;boxer++)for(let view=0;view<2;view++)for(let clip=0;clip<actions.length;clip++)for(let phase=0;phase<3;phase++){
 const index=((boxer*2+view)*actions.length+clip)*3+phase;ox=(index%columns)*cellW;oy=Math.floor(index/columns)*cellH;drawBoxer(boxer,view===1,actions[clip],phase);
}
function crc(bytes){let n=0xffffffff;for(const b of bytes){n^=b;for(let i=0;i<8;i++)n=(n>>>1)^((n&1)?0xedb88320:0);}return(n^0xffffffff)>>>0;}
function chunk(type,data){const name=Buffer.from(type),body=Buffer.concat([name,data]),out=Buffer.alloc(data.length+12);out.writeUInt32BE(data.length);body.copy(out,4);out.writeUInt32BE(crc(body),data.length+8);return out;}
const scan=Buffer.alloc(height*(1+width*4));for(let y=0;y<height;y++)Buffer.from(rgba.buffer,y*width*4,width*4).copy(scan,y*(1+width*4)+1);
const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(width);ihdr.writeUInt32BE(height,4);ihdr[8]=8;ihdr[9]=6;
const png=Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk("IHDR",ihdr),chunk("IDAT",deflateSync(scan)),chunk("IEND",Buffer.alloc(0))]);
await writeFile(new URL("../src/content/ring-rivals/boxers.png",import.meta.url),png);

const stageW=480,stageH=180,stage=new Uint8Array(stageW*stageH*4);
function stagePixel(x,y,c){if(x<0||y<0||x>=stageW||y>=stageH)return;stage.set(c,(y*stageW+x)*4);}
function stageRect(x,y,w,h,c){for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)stagePixel(xx,yy,c);}
const skyTop=[24,38,60,255],skyBottom=[72,104,122,255];
for(let y=0;y<stageH;y++)for(let x=0;x<stageW;x++){
  const t=Math.min(y/85,1),c=skyTop.map((v,i)=>Math.round(v+(skyBottom[i]-v)*t));stagePixel(x,y,c);
}
stageRect(0,78,stageW,29,[39,43,60,255]);
for(let x=0;x<stageW;x+=7)stageRect(x,79,3,26,x%3?[51,51,72,255]:[28,36,56,255]);
stageRect(0,107,stageW,73,[178,109,68,255]);
stageRect(18,88,444,71,[255,241,206,255]);stageRect(20,90,440,67,[190,79,59,255]);
stageRect(23,93,434,60,[219,202,157,255]);stageRect(24,96,432,53,[185,129,87,255]);
for(const y of [103,119,136]){stageRect(22,y,436,2,[255,241,206,255]);stageRect(22,y+2,436,1,[160,54,55,255]);}
stageRect(18,159,444,3,[108,55,64,255]);
const stageRows=Buffer.alloc(stageH*(1+stageW*4));for(let y=0;y<stageH;y++)Buffer.from(stage.buffer,y*stageW*4,stageW*4).copy(stageRows,y*(1+stageW*4)+1);
const stageHeader=Buffer.alloc(13);stageHeader.writeUInt32BE(stageW);stageHeader.writeUInt32BE(stageH,4);stageHeader[8]=8;stageHeader[9]=6;
const stagePng=Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk("IHDR",stageHeader),chunk("IDAT",deflateSync(stageRows)),chunk("IEND",Buffer.alloc(0))]);
await writeFile(new URL("../src/content/ring-rivals/arena.png",import.meta.url),stagePng);

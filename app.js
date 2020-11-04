let speed = 0;
let position = 0;
let rounded = 0;
let block = document.getElementById("block");


window.addEventListener("wheel", (e) => {
  speed += e.deltaY * 0.0003;
});

var sketch = new Sketch();

let objs = Array(5).fill({ dist: 0 });
let attractMode = false;
let attractTo = 0;
const raf = () => {
  position += speed;
  speed *= 0.8;
  rounded = Math.round(position);
  objs.forEach((o, i) => {
    o.dist = Math.min(Math.abs(position - i), 1);
    o.dist = 1 - o.dist ** 2;
    //  elems[i].style.transform = `scale(${1+0.4*o.dist})`
    let scale = 1+0.2*o.dist;
    console.log(position)
    sketch.meshes[i].position.y = i * 1.2 - position * 1.2;
    sketch.meshes[i].scale.set(scale,scale,scale)
    sketch.meshes[i].material.uniforms.distanceFromCenter.value = o.dist;
  });
  let diff = rounded - position;
  
    if(attractMode){
      position += -(position- attractTo)*0.05;
      console.log(position)
    }else{
      position += Math.sign(diff) * Math.pow(Math.abs(diff), 0.7) * 0.05;

     


    }
  window.requestAnimationFrame(raf);
  
};

raf();


let navs = [...document.querySelectorAll('.nav li')]
let nav= document.querySelector('.nav');
let rots = sketch.groups.map(e=>e.rotation)
nav.addEventListener('mouseenter',()=>{
  attractMode = true;
  gsap.to(document.body,{
    duration:0.3,
    background: '#1b1f25'
  })
  gsap.to(rots,{
    duration:0.3,
    x:-0.7,
    y:0,
    z:0,
  })
})
nav.addEventListener('mouseleave',()=>{
  attractMode=false;
  gsap.to(rots,{
    duration:0.3,
    x:-0.3,
    y:-0.5,
    z:-0.1,
  })
  gsap.to(document.body,{
    duration:0.3,
    background: '#ffffff'
  })
})
navs.forEach((el)=>{
  el.addEventListener('mouseover', e=>{
    console.log(e.target);
   
    attractTo= Number(e.target.getAttribute('data-nav'));
     console.log(attractTo)
  })

})

// gsap.from(document.querySelector('h1'), {duration:1, height:0,})
// gsap.fromTo(document.querySelector('h1.outline'), 1, {fill:"none"}, {fill:"green"});
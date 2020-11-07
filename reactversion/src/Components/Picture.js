import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "react-three-fiber";
import picture from "../images/elite.png";
import { TweenMax } from "gsap/gsap-core";
import { TimelineMax, Power4 } from "gsap";
const fragmentShader = `
    uniform float isMiddle;
    uniform float uTime;
    uniform float distanceFromCenter;
    uniform sampler2D texture1;
    uniform vec4 resolution;
    varying vec2 vUv;
    varying vec3 vPosition;
    float PI = 3.141592653589793238;
    void main(){

          vec4 t = texture2D(texture1, vUv);
          float bw = (t.r + t.b + t.g )/3.;
          vec4 another = vec4(bw,bw,bw,1);
           gl_FragColor = mix(another,t,distanceFromCenter);
           gl_FragColor.a = clamp(distanceFromCenter, 0.8, 1.);
  
       
  
    }
        
    `;

const vertexShader = `
    uniform float uTime;
    uniform float uAspectRatio;
    uniform float uFrameRotation;
    uniform float uFrameScale;
    uniform float uBend;
    uniform float uFloating;
    varying vec2 vUv;
    const float PI = 3.141592653589793;
    mat2 scale(vec2 value) {
        return mat2(value.x, 0.0, 0.0, value.y);
    }
    vec2 scaleUv(vec2 uv, float scaleFactor) {
        float parsedScaleFactor = 1.0 - (scaleFactor - 1.0);
        return uv * scale(vec2(parsedScaleFactor)) + vec2((1.0 - parsedScaleFactor) * 0.5);
    }
    mat2 rotate(float angle) {
        return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    }
    vec2 rotateUv(vec2 uv, float angle) {
        uv -= 0.5;
        uv.y *= uAspectRatio;
        uv *= rotate(angle);
        uv.y /= uAspectRatio;
        uv += 0.5;
        return uv;
    }
    void main() {
        vec3 pos = position;
        vUv = uv;
        /**
        * bend
        */
        pos.y -= uBend * (1.0 - sin(uv.x * PI));
        pos.x += uBend * (uv.y * 2.0 - 1.0) * (uv.x * 2.0 - 1.0) * 0.5;
        /**
        * scaling
        */
        vUv = scaleUv(vUv, 1.0 + (1.0 - uFrameScale));
        /**
        * rotation
        */
        vUv = rotateUv(vUv, uFrameRotation);
        /**
        * floating
        */
        float reducedTime = uTime * 0.35;
        float floatingWave = sin(reducedTime * PI) * uFloating;
        float yShift = 0.028;
        float xShift = -0.007;
        pos.y += floatingWave * yShift;
        pos.x += floatingWave * xShift;
        vUv.y += floatingWave * yShift;
        vUv.x += floatingWave * xShift;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

export default function Picture(props) {
  const speed = useRef(0);
  const rounded = useRef(0);
  const position = useRef(0);
  const distance = useRef(0);
  const firstTime = useRef(0);
  const size = useRef(
    window.innerWidth / 1900 > 1 ? 1 : window.innerWidth / 1900
  );
  const rotationAnimatation = useRef();  
  const positionAnimatation = useRef();  

  const mesh = useRef();
  const group = useRef();
  const texture1 = new THREE.TextureLoader().load(picture);
  const material = useRef();
 

  const uniforms = useRef({
    uFrameRotation: { type: "f", value: 0 },
    uFrameScale: { type: "f", value: 1 },
    uBend: { type: "f", value: 0.021 },
    uAspectRatio: { type: "f", value: 1.7 },
    uFloating: { type: "f", value: 1 },
    isMiddle: { type: "f", value: 0 },
    distanceFromCenter: { type: "f", value: 1 },
    uTime: { type: "f", value: 0 },
    texture1: { type: "t", value: texture1 },
    resolution: { type: "v4", value: new THREE.Vector4() },
    uvRate1: {
      value: new THREE.Vector2(1, 1),
    },
  });

  useEffect(() => {
    uniforms.current.distanceFromCenter.value = 1;
    
    window.addEventListener("wheel", (e) => {
      speed.current += e.deltaY * 0.0003;
    });
    window.addEventListener("resize", () => {
      const value = window.innerWidth / 1900;
      size.current = value > 1 ? 1 : value;
    });

    //Load in animatations
    let tl = new TimelineMax();
    tl.to(group.current.rotation, {
      duration: 0,
      x: 0,
      z: 0,
      y: 0,
    });

    tl.fromTo(
      group.current.position,
      {
        x: 0,
        z: 2,
        y: -10,
        ease: Power4.easeInOut,
      },
      {
        duration: 3,
        x: 0,
        y: 0,
        z: 0,
        ease: Power4.easeInOut,
      }
    );
    tl.to(
      group.current.rotation,
      {
        duration: 0.8,
        x: -0.3,
        y: -0.35,
        z: -0.12,
        ease: Power4.easeInOut,
      },
      "-=0.8"
    );
    tl.to(
      group.current.position,
      {
        duration: 0.8,
        x: 0.8,
        y: 0,
        z: 0.1,
        ease: Power4.easeInOut,
      },
      "-=0.8"
    );
    rotationAnimatation.current = TweenMax.fromTo(group.current.rotation, 1,{
      x: -0.3,
      y: -0.35,
      z: -0.12,
    }, {
      duration: 1,
      x: -0.5,
      y: 0,
      z: 0,
      paused:true
    })  

    positionAnimatation.current= TweenMax.fromTo(group.current.position, 1,{
      x: 0.8,
      y: 0,
      z: 0.1,
    }, {
      duration: 0.5,
      x: 0,
      y: 0.3,
      z: 0,
      paused:true
    })  
    return () => {
      window.removeEventListener("wheel", (e) => {
        speed.current += e.deltaY * 0.0003;
      });
      window.removeEventListener("resize", () => {
        const value = window.innerWidth / 700;
        size.current = value > 1 ? 1 : value;
      });
    };
  }, []);

  useEffect(() => {
    let animatation = 1;
    if (firstTime.current > 2) {
      if (props.rotating === "middle") {
        rotationAnimatation.current.play()
      } else {
        rotationAnimatation.current.reverse()
      }
    } else {
      firstTime.current++;
    }

    return () => {
      if(animatation!==1){
        animatation.kill(group.current.rotation,{x:true, y:true, z:true})
      }
    };
  }, [props.rotating]);

  useEffect(() => {
    let animatation = 1;
    if (firstTime.current > 2) {
      firstTime.current++;
      
      if (props.positioning === "middle") {
         uniforms.current.isMiddle.value = -1;
        positionAnimatation.current.play()
      } else {
         uniforms.current.isMiddle.value = 0;
        positionAnimatation.current.reverse()
      }
      group.current.position.x = props.positioning.x;
    } else {
      firstTime.current++;
    }

    return () => {
      if(animatation!== 1){
        animatation.kill(group.current.position, {x:true, y:true, z:true})
      }
    };
  }, [props.positioning]);

  useFrame(() => {
    const startRound = rounded.current;
    //checks to make sure users dont scroll out of the list
    if(position.current<-0 ||position.current>3){speed.current*=0.25}
    if(position.current<-0.3 ||position.current>3.3){speed.current=0}

    if (speed.current !== 0 || props.attractTo.shouldJump) {
      uniforms.current.uTime.value += 0.01;
      position.current = speed.current + position.current;
      speed.current = speed.current * 0.8;
      rounded.current = Math.round(position.current);
    }
    distance.current =1 - Math.min(Math.abs(position.current - props.index), 1)**2;
    const newPosition = props.index * 1.2 - position.current * 1.2;
    mesh.current.position.y = newPosition;

    const sizing = props.attractMode ? size.current : size.current;
    const fromCenter = props.attractMode ? 1 : distance.current;
    let scale = (1 + 0.08 * fromCenter) * sizing * 1.3;

    group.current.scale.set(scale, scale, scale);
    uniforms.current.distanceFromCenter.value = distance.current;

    if (props.index == 0 && startRound !== rounded.current) {
      props.displayDom(rounded.current);
    }
    let diff = rounded.current - position.current;

    if (props.attractMode || props.attractTo.shouldJump) {
      //speeds up selection with attractmode is true
      position.current -= props.attractMode
        ? (position.current - props.attractTo.goTo) * 0.1
        : (position.current - props.attractTo.goTo) * 0.05;
      console.log(position.current);

      //cancels jumps once picture is mostly at the center
      if (
        props.attractTo.shouldJump &&
        Math.round(position.current * 2) / 2 == props.attractTo.goTo
      ) {
        props.jumpComplete();
      }
    } else {
      position.current =
        position.current +
        Math.sign(diff) * Math.pow(Math.abs(diff), 0.7) * 0.05;
    }
  });

//Changes orientation of images on click before using the goTo props to navigate to selected page
  const goToPicture = () => {
    if (props.displayNumber == props.index) {
      TweenMax.to(group.current.position, {
        duration: 1,
        x: -0,
        y: 0,
        z: -0,
      });
      TweenMax.to(group.current.rotation, {
        duration: 1,
        x: 0,
        y: 0,
        z: 0,
      });
    }
    props.goTo(props.index);
  };

  //Creates pointer events for the images
  const onPointerEnter = () => {
    document.body.style.cursor = "pointer";
  };
  const onPointerLeave = () => {
    document.body.style.cursor = "default";
  };

  return (
    <group {...props} ref={group}>
      <mesh
        ref={mesh}
        onClick={goToPicture}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
      >
        <planeBufferGeometry args={[1.5, 1, 20, 20]} />
        <shaderMaterial
          ref={material}
          attach="material"
          uniforms={uniforms.current}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </mesh>
    </group>
  );
}

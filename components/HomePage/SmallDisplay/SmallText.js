import React, { useState } from "react";
import Background from "../Background";
import SideBar from "../../Common/sideBar";
import Buttons from "../../Common/Buttons";
import { ButtonGroup} from "@material-ui/core";

export function SmallText(props) {
  const [sideBarWidth, setSideBarSize] = useState("10px");

  const linkToContacts = (e) => {
    e.preventDefault();
    props.linkTo();
  };

  const sideBarLarge = (event, boolean) => {
    event.stopPropagation();
    setSideBarSize( boolean ? "15px": "10px");
  };

  return (
    <>
      <SideBar
        information={props.data}
        attractMode={false}
        number={props.number}
        sideBarRef={sideBarWidth}
      />
      <Background
        information={props.data}
        attractMode={false}
        number={props.number}
      />
      <div
        className="details"
        style={{
          position: "absolute",
          top: "25%",
          left: "10%",
          margin: "auto",
          color: `${props.data[props.number].whiteOrBlackText}`,
        }}
      >
        <div>
          <h1
            style={{
              color: `${props.data[props.number].primaryColour}`,
              zIndex: -1,
            }}
          >
            {props.data[props.number].title}
          </h1>
          <p>{props.data[props.number].snippet}</p>
        </div>
        <Buttons
          link={true}
          primaryColour={props.data[props.number].primaryColour}
          secondaryColour={props.data[props.number].secondaryColour}
          href={`/posts/${props.data[props.number].slug}`}
          onClick={linkToContacts}
        >
          <a
            onPointerOver={e => sideBarLarge(e, true)}
            onPointerLeave={(e) => sideBarLarge(e, false)}
          >
            More Details
          </a>
        </Buttons>
        <ButtonGroup>
          <Buttons
            link={false}
            primaryColour={props.data[props.number].primaryColour}
            secondaryColour={props.data[props.number].secondaryColour}
            onClick={linkToContacts}
          >
            <a
              style={{ color: "inherit", textDecoration: "none" }}
              href={props.data[props.number].liveDemo}
              target="_blank"
              rel="noopener noreferrer"
            >
              Live demo
            </a>
          </Buttons>
          <Buttons
            link={false}
            primaryColour={props.data[props.number].primaryColour}
            secondaryColour={props.data[props.number].secondaryColour}
            onClick={linkToContacts}
          >
            <a
              style={{ color: "inherit", textDecoration: "none" }}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                console.log(props.data[props.number]);
              }}
              href={props.data[props.number].sourceCode}
              //  className="button"
            >
              Source Code
            </a>
          </Buttons>
        </ButtonGroup>
      </div>
    </>
  );
}


export default React.memo(SmallText)
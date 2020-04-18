import { createElement } from "./dom";
import { startAnimation } from "./easing";

document.body.addEventListener("mousedown", function(event) {
  let target = event.target as HTMLElement;

  while (target) {
    if (!target.classList || !target.classList.contains("ripple")) {
      target = target.parentNode as HTMLElement;
    } else {
      break;
    }
  }

  if (target && target.classList.contains("ripple")) {
    const ripplerContainer = target.querySelector(".ripple-container");
    const offsetInfo = target.getBoundingClientRect();
    if (ripplerContainer) {
      ripplerContainer.remove();
    }

    // fixed the bug
    const maxLength =
      offsetInfo.width > offsetInfo.height
        ? offsetInfo.width
        : offsetInfo.height;
    const circleD = maxLength * 2;

    const ripple = createElement("div", {
      style: {
        position: "absolute",
        zIndex: "99",
        width: circleD + "px",
        height: circleD + "px",
        left: event.pageX - offsetInfo.left - circleD / 2 + "px",
        top: event.pageY - offsetInfo.top - circleD / 2 + "px",
        borderRadius: "500px",
        overflow: "hidden",
        backgroundColor: "rgba(0,0,0,0.1)",
      },
      className: "ripple",
    });

    startAnimation(
      { o: { from: 0, to: 1 } },
      (v) => {
        ripple.style.transform = `scale(${v.o})`;
        ripple.style.opacity = `${1 - v.o}`;
      },
      () => {
        ripple.remove();
      },
      800
    );

    target.appendChild(ripple);
  }
});

const targetelem = document.getElementById("target");

document.addEventListener("mousemove", function(e) {

    anime({
        targets: "#target",
        translateX: e.clientX - targetelem.clientWidth / 2,
        translateY: e.clientY - targetelem.clientHeight / 2,
        duration: 100,
        easing: "easeOutCubic"
    })

});

function disableScroll(event) {
  event.preventDefault();
}

// イベントと関数を紐付け
document.addEventListener('touchmove', disableScroll, { passive: false });

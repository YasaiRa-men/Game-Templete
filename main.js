const targetelem = document.getElementById("target");
const mainelem = document.getElementById("mainWindow");
const ScreenWidth = window.parent.screen.width;
const ScreenHeight = window.parent.screen.height;

console.log(ScreenWidth)

//スクリーンの大きさより移動可能幅の方が大きい場合、移動可能幅をスクリーンの大きさに合わせる
mainelem.style.width = Math.min(ScreenWidth, mainelem.offsetWidth) + "px";

//スクリーンをずらした誤差の調整
const X_Error = (ScreenWidth / 2) - (mainelem.offsetWidth / 2);
console.log(X_Error);

//パソコンでの操作
document.addEventListener("mousemove", function(e) {

    let AfterX = Math.max(0, e.clientX - targetelem.clientWidth / 2 - X_Error);
    AfterX = Math.min(mainelem.offsetWidth - targetelem.clientWidth, AfterX);

    //console.log(AfterX);

    anime({
        targets: "#target",
        translateX: AfterX,
        translateY: e.clientY - targetelem.clientHeight / 2,
        duration: 100,
        easing: "easeOutCubic"
    })

});

//スマホでの操作
document.addEventListener("touchmove", function(e) {

    let AfterX = Math.max(0, e.touches[0].clientX - targetelem.clientWidth / 2 - X_Error);
    AfterX = Math.min(mainelem.offsetWidth - targetelem.clientWidth, AfterX);

    //console.log(AfterX);

    anime({
        targets: "#target",
        translateX: AfterX,
        translateY: e.touches[0].clientY - targetelem.clientHeight / 2,
        duration: 100,
        easing: "easeOutCubic"
    })

});

function disableScroll(event) {
    event.preventDefault();
}

// イベントと関数を紐付け
document.addEventListener('touchmove', disableScroll, { passive: false });

//座標取得
setInterval(function() {

    /*
    console.log(
        "X : " + new WebKitCSSMatrix(targetelem.style.transform).m41,
        ", Y : " + new WebKitCSSMatrix(targetelem.style.transform).m42
    );
    */

    GameEvent();
}, 100);

//時間処理
function GameEvent() {
    const smallballs = document.querySelectorAll(".smallball");

    for (let smallball of smallballs) {
        let smallball_X =Math.abs(new WebKitCSSMatrix(smallball.style.transform).m41 - new WebKitCSSMatrix(targetelem.style.transform).m41);
        let smallball_Y =Math.abs(new WebKitCSSMatrix(smallball.style.transform).m42 - new WebKitCSSMatrix(targetelem.style.transform).m42);

        distance = Math.sqrt(smallball_X ** 2 + smallball_Y ** 2);

        let smallballSize = smallball.offsetWidth;

        if (distance < (targetelem.offsetWidth / 2) + (smallballSize / 2)) console.error("Game Over");
    }
}

//障害物(小)
let smallballnum = 0;
function SmallBall() {

    mainelem.insertAdjacentHTML("afterbegin", '<div id="s' + smallballnum + '" class="smallball"></div>');

    let ranX = mainelem.offsetWidth * Math.random() - document.getElementById("s" + smallballnum).offsetWidth;
    let snum = smallballnum;

    anime({
        targets: "#s" + smallballnum,
        translateX: [ranX, ranX],
        translateY: [-100, ScreenHeight + 100],
        duration: 10000,
        easing: "linear",
        complete: function() {
            document.querySelector("#s" + snum).remove();
        }
    })

    //console.log(smallballnum);

    smallballnum++;

}

setInterval(SmallBall, 3000);

const targetelem = document.getElementById("target");
const targetField = document.getElementById("targetField");
const mainelem = document.getElementById("mainWindow");
const gameTitle = document.getElementById("gameTitle");
const startButton = document.getElementById("startButton");
const gameoverTitle = document.getElementById("gameoverTitle");
const endButton = document.getElementById("endButton");
const ScreenWidth = window.parent.screen.width;
const ScreenHeight = window.parent.screen.height;

console.log(ScreenWidth)

//スクリーンの大きさより移動可能幅の方が大きい場合、移動可能幅をスクリーンの大きさに合わせる
mainelem.style.width = Math.min(ScreenWidth, mainelem.offsetWidth) + "px";

//スクリーンをずらした誤差の調整
const X_Error = (ScreenWidth / 2) - (mainelem.offsetWidth / 2);
console.log(X_Error);

// target と障害物を非表示にする
targetelem.style.display = 'none';
gameoverTitle.style.display = 'none';

let SmallBall_Interval;
let SmallBall_Animation;
let SmallBall_ms;

// スタートボタンのクリックイベント
startButton.addEventListener('click', function() {
    // ゲームタイトルとスタートボタンを非表示にする
    gameTitle.style.display = 'none';
    mainelem.style.display = 'block';

    // target を表示する
    targetelem.style.display = 'block';
    anime({
        targets: "#target",
        translateX: (targetField.offsetWidth / 2) - (targetelem.clientWidth / 2),
        translateY: targetField.offsetTop + (targetField.offsetHeight / 2) - (targetelem.clientHeight / 2),
        duration: 0,
        easing: "linear"
    });

    // 障害物生成を開始する

    SmallBall_ms = 3000;
    SmallBall_Interval = setInterval(SmallBall, SmallBall_ms);

    // イベントリスナーを有効にする
    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("touchmove", touchMoveHandler, { passive: false });
});

// ホームボタンのクリックイベント
endButton.addEventListener('click', function() {
    // ゲームタイトルにする
    gameTitle.style.display = 'block';
    gameoverTitle.style.display = 'none';

    // ゲームを初期化する
    InitGame();

    // イベントリスナーを無効にする
    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("touchmove", touchMoveHandler, { passive: false });
});

//パソコンでの操作
function mouseMoveHandler(e) {

    let AfterX = Math.max(0, e.clientX - targetelem.clientWidth / 2 - X_Error);
    AfterX = Math.min(mainelem.offsetWidth - targetelem.clientWidth, AfterX);

    let AfterY = Math.max(targetField.offsetTop, e.clientY - targetelem.clientHeight / 2);
    AfterY = Math.min(mainelem.clientHeight - targetField.clientHeight - targetelem.clientWidth, AfterY);

    anime({
        targets: "#target",
        translateX: AfterX,
        translateY: AfterY,
        duration: 100,
        easing: "easeOutCubic"
    });

}

//スマホでの操作
function touchMoveHandler(e) {

    let AfterX = Math.max(0, e.touches[0].clientX - targetelem.clientWidth / 2 - X_Error);
    AfterX = Math.min(mainelem.offsetWidth - targetelem.clientWidth, AfterX);

    
    let AfterY = Math.max(targetField.offsetTop, e.touches[0].clientY - targetelem.clientHeight / 2);
    AfterY = Math.min(mainelem.clientHeight - targetField.clientHeight - targetelem.clientWidth, AfterY);

    console.log(AfterY);

    anime({
        targets: "#target",
        translateX: AfterX,
        translateY: AfterY,
        duration: 100,
        easing: "easeOutCubic"
    });

}

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
        let smallball_X = Math.abs(new WebKitCSSMatrix(smallball.style.transform).m41 - new WebKitCSSMatrix(targetelem.style.transform).m41);
        let smallball_Y = Math.abs(new WebKitCSSMatrix(smallball.style.transform).m42 - new WebKitCSSMatrix(targetelem.style.transform).m42);

        distance = Math.sqrt(smallball_X ** 2 + smallball_Y ** 2);

        let smallballSize = smallball.offsetWidth;

        if (distance < (targetelem.offsetWidth / 2) + (smallballSize / 2)) {

            targetelem.style.display = 'none';
            gameoverTitle.style.display = 'block';

            clearInterval(SmallBall_Interval);
            for (let i = 0; i < smallballnum; i++) {

                anime.remove("#s" + i);
                document.querySelector("#s" + i).remove();

            }
            smallballnum = 0;

        };
    }
}

function InitGame() {

}

//障害物(小),
let smallballnum = 0;
function SmallBall() {

    mainelem.insertAdjacentHTML("afterbegin", '<div id="s' + smallballnum + '" class="smallball"></div>');

    let ranX = (mainelem.offsetWidth - document.getElementById("s" + smallballnum).offsetWidth) * Math.random();
    let snum = smallballnum;

    SmallBall_Animation = anime({
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

    SmallBall_ms =- 10;
    SmallBall_ms = Math.max(SmallBall_ms, 0);

}
